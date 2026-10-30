// Bot de indexación: abre Search Console en un Chrome propio (perfil aparte,
// con la sesión de Google de Jorge) y pulsa "Solicitar indexación" en las
// páginas que Google aún no tiene. Sin dependencias: habla con Chrome por CDP.
//
//   node scripts/index-bot.mjs             → revisa y solicita (máx. 10 por pasada)
//   node scripts/index-bot.mjs --dry-run   → solo revisa, no pulsa nada
//   node scripts/index-bot.mjs --hidden    → sin ventana (lo usa la tarea programada)
//   node scripts/index-bot.mjs <url> ...   → solo esas URLs
//
// La primera vez abre la ventana para que Jorge inicie sesión en Google a mano.
// Si sale un captcha o se acaba la cuota, para y lo dice: no intenta saltárselo.
// Perfil, estado y registro viven en %LOCALAPPDATA%\jorgegraells-indexbot.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const ORIGIN = "https://jorgegraells.com";
// El resumen de la propiedad: tiene arriba la caja "Inspecciona cualquier URL".
// (La ruta /inspect sin id redirige aquí y, si escribes durante la redirección, se pierde el texto.)
const CONSOLE = `https://search.google.com/search-console?resource_id=${encodeURIComponent(`${ORIGIN}/`)}`;
const PORT = 9333;
const HOME = path.join(process.env.LOCALAPPDATA ?? os.homedir(), "jorgegraells-indexbot");
const PROFILE = path.join(HOME, "chrome");
const STATE_FILE = path.join(HOME, "state.json");
const LOG_FILE = path.join(HOME, "log.txt");
const MAX_REQUESTS = 10; // Google deja unas 10-12 solicitudes al día por propiedad
const DAY = 86_400_000;
const RECHECK_INDEXED = 7 * DAY;
const RECHECK_REQUESTED = 3 * DAY;

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const HIDDEN = args.includes("--hidden");
const only = args.filter((a) => a.startsWith("http"));

const CHROME_PATHS = [
  path.join(process.env.ProgramFiles ?? "", "Google/Chrome/Application/chrome.exe"),
  path.join(process.env["ProgramFiles(x86)"] ?? "", "Google/Chrome/Application/chrome.exe"),
  path.join(process.env.LOCALAPPDATA ?? "", "Google/Chrome/Application/chrome.exe"),
  path.join(process.env["ProgramFiles(x86)"] ?? "", "Microsoft/Edge/Application/msedge.exe"),
];

// Textos de Search Console en castellano, catalán (el idioma de la cuenta de
// Jorge) e inglés. El idioma lo decide la cuenta de Google, no el navegador.
const ON_GOOGLE = /(la url está en google|l.url és a google|url is on google)/i;
const NOT_ON_GOOGLE = /(la url no está en google|l.url no és a google|url is not on google)/i;
const REQUESTED = /(se ha solicitado la indexación|indexación solicitada|s.ha sol·licitat la indexació|indexació sol·licitada|indexing requested)/i;
const TESTING = /(probando si se puede indexar|estem provant si es pot indexar|testing if live url can be indexed)/i;
const QUOTA =/(cuota superada|se ha superado la cuota|quota superada|s.ha superat la quota|quota exceeded)/i;
const REQUEST_BUTTON = "^(solicitar indexación|sol·licita la indexació|request indexing)$";
const DISMISS_BUTTON = "^(ignorar|ignora|entendido|d.acord|cerrar|tanca|aceptar|accepta|got it|dismiss|ok)$";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(HOME, { recursive: true });

function log(msg) {
  console.log(msg);
  fs.appendFileSync(LOG_FILE, `${new Date().toISOString()} ${msg}\n`);
}

function fail(msg, code = 1) {
  log(`ERROR: ${msg}`);
  process.exit(code);
}

// ---- Qué URLs mirar: artículos (los más nuevos primero) y páginas fijas ----

function candidateUrls() {
  if (only.length) return only;
  const dir = new URL("../src/content/articles/", import.meta.url);
  const articles = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(new URL(f, dir), "utf8")))
    .filter((a) => !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
  const pages = [
    ...["es", "en"].flatMap((l) => ["", "/training", "/blog", "/world"].map((p) => `/${l}${p}`)),
    "/es/sobre-mi",
    "/en/about",
    "/es/noticias",
    "/en/news",
    "/es/politica-editorial",
    "/en/editorial-policy",
  ];
  return [
    ...articles.flatMap((a) => ["es", "en"].map((l) => `${ORIGIN}/${l}/blog/${a[l].slug}`)),
    ...pages.map((p) => ORIGIN + p),
  ];
}

const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) : {};
const saveState = () => fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

function skipReason(url) {
  if (only.length) return null;
  const s = state[url] ?? {};
  const now = Date.now();
  if (s.indexedAt && now - Date.parse(s.indexedAt) < RECHECK_INDEXED) return "indexada";
  if (s.requestedAt && now - Date.parse(s.requestedAt) < RECHECK_REQUESTED) return "ya solicitada";
  return null;
}

// ---- Chrome por CDP ----

async function debuggerInfo() {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

async function startChrome() {
  if (await debuggerInfo()) return false;
  const exe = CHROME_PATHS.find((p) => fs.existsSync(p));
  if (!exe) fail("no encuentro Chrome ni Edge instalados");
  const flags = [
    `--user-data-dir=${PROFILE}`,
    `--remote-debugging-port=${PORT}`,
    "--no-first-run",
    "--no-default-browser-check",
    // Si la ventana queda tapada o minimizada, Chrome deja de pintar y se traga los clics
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling",
  ];
  if (HIDDEN) flags.push("--headless=new", "--window-size=1400,1000");
  spawn(exe, [...flags, "about:blank"], { detached: true, stdio: "ignore" }).unref();
  for (let i = 0; i < 75; i++) {
    if (await debuggerInfo()) return true;
    await sleep(200);
  }
  fail("Chrome no ha abierto el puerto de depuración");
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((ok, ko) => {
    ws.onopen = ok;
    ws.onerror = () => ko(new Error("no conecta con Chrome"));
  });
  let seq = 0;
  const waiting = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (!m.id || !waiting.has(m.id)) return;
    const { ok, ko } = waiting.get(m.id);
    waiting.delete(m.id);
    m.error ? ko(new Error(m.error.message)) : ok(m.result);
  };
  const send = (method, params = {}) =>
    new Promise((ok, ko) => {
      const id = ++seq;
      waiting.set(id, { ok, ko });
      ws.send(JSON.stringify({ id, method, params }));
    });
  return { send, close: () => ws.close() };
}

async function openPage() {
  const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  let target = targets.find((t) => t.type === "page");
  if (!target)
    target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
  const page = await connect(target.webSocketDebuggerUrl);
  // Con la ventana minimizada o estrecha, Search Console pliega la caja de búsqueda
  try {
    const { windowId } = await page.send("Browser.getWindowForTarget");
    await page.send("Browser.setWindowBounds", { windowId, bounds: { windowState: "normal" } });
    await page.send("Browser.setWindowBounds", { windowId, bounds: { width: 1400, height: 1000 } });
  } catch {
    // sin ventana (headless) ya va con --window-size
  }
  await page.send("Emulation.setFocusEmulationEnabled", { enabled: true });
  if (HIDDEN) {
    // Sin ventana Chrome se anuncia como "HeadlessChrome"; Google lo mira con lupa
    const { userAgent } = await page.send("Browser.getVersion");
    await page.send("Network.setUserAgentOverride", { userAgent: userAgent.replace("HeadlessChrome", "Chrome") });
  }
  return page;
}

// ---- Acciones dentro de Search Console ----

let page;

async function evaluate(expression) {
  const r = await page.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return r.result?.value;
}

const bodyText = () => evaluate("document.body ? document.body.innerText : ''");

// Centro del último botón visible cuyo texto encaja (los diálogos van al final del DOM)
const findButton = (pattern) =>
  evaluate(`(() => {
    const rx = new RegExp(${JSON.stringify(pattern)}, "i");
    const el = [...document.querySelectorAll('[role="button"], button')]
      .filter((b) => { const r = b.getBoundingClientRect(); return r.width && r.height && rx.test(b.innerText.trim()); })
      .at(-1);
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  })()`);

const findSearchBox = () =>
  evaluate(`(() => {
    const el = [...document.querySelectorAll("input")].find((i) => {
      const r = i.getBoundingClientRect();
      const label = (i.placeholder || "") + " " + (i.getAttribute("aria-label") || "");
      return r.width && r.height && /inspec/i.test(label);
    });
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  })()`);

// Solo cuenta el reto de verdad (bframe) o la casilla "No soy un robot"; el sello
// invisible de reCAPTCHA está siempre en la página y no significa nada
const captchaVisible = () =>
  evaluate(`[...document.querySelectorAll('iframe[src*="recaptcha"]')].some((f) => {
    const r = f.getBoundingClientRect();
    const onScreen = r.width > 100 && r.height > 50 && r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0;
    // La casilla mide 304x78; el sello invisible, 256x60 abajo a la derecha
    return onScreen && (f.src.includes("bframe") || (f.src.includes("anchor") && r.width >= 300 && !f.src.includes("size=invisible")));
  })`);

// Captura para entender un fallo sin tener que mirar la ventana
async function screenshot(name) {
  const { data } = await page.send("Page.captureScreenshot", { format: "jpeg", quality: 60 });
  const file = path.join(HOME, `${name}.jpg`);
  fs.writeFileSync(file, Buffer.from(data, "base64"));
  log(`  (captura en ${file})`);
  const dialogs = await evaluate(`[...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')]
    .map((d) => { const r = d.getBoundingClientRect(); return Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height) + ": " + d.innerText.replace(/\\s+/g, " ").slice(0, 300); })
    .join(" | ")`);
  if (dialogs) log(`  (diálogos: ${dialogs})`);
}

async function click({ x, y }) {
  await page.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await page.send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
}

// Search Console solo reacciona al Enter si llega como tecla + carácter por separado
async function pressEnter() {
  const key = { key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 };
  await page.send("Input.dispatchKeyEvent", { type: "rawKeyDown", ...key });
  await page.send("Input.dispatchKeyEvent", { type: "char", ...key, text: "\r" });
  await page.send("Input.dispatchKeyEvent", { type: "keyUp", ...key });
}

async function waitFor(check, seconds) {
  for (let i = 0; i < seconds * 2; i++) {
    const v = await check();
    if (v) return v;
    await sleep(500);
  }
  return null;
}

// Carga la herramienta de inspección y devuelve la caja de búsqueda (o null si no hay sesión)
async function loadInspector() {
  await page.send("Page.navigate", { url: CONSOLE });
  return waitFor(async () => {
    const href = await evaluate("location.href");
    if (/accounts\.google\.com|search-console\/(about|welcome)/.test(href ?? "")) return "login";
    return findSearchBox();
  }, 30);
}

async function ensureLoggedIn() {
  let box = await loadInspector();
  if (box && box !== "login") return;
  if (HIDDEN)
    fail("no hay sesión de Google en el perfil del bot. Ejecuta `node scripts/index-bot.mjs` con ventana e inicia sesión", 2);
  log("Inicia sesión en Google en la ventana de Chrome que se ha abierto (tienes 15 minutos).");
  if (box === "login" && !(await evaluate("location.href")).includes("accounts.google.com"))
    await page.send("Page.navigate", { url: `https://accounts.google.com/ServiceLogin?continue=${encodeURIComponent(CONSOLE)}` });
  const ok = await waitFor(async () => {
    const href = (await evaluate("location.href")) ?? "";
    return href.includes("search.google.com/search-console") && (await findSearchBox());
  }, 15 * 60);
  if (!ok) fail("no se ha iniciado sesión a tiempo", 2);
  log("Sesión iniciada; queda guardada en el perfil del bot.");
}

// Escribe la URL, comprueba que está en la caja y lanza la inspección (con reintentos:
// a veces la app aún se está montando y se come el texto)
async function typeUrl(box, url) {
  await page.send("Page.bringToFront");
  for (let attempt = 0; attempt < 3; attempt++) {
    await sleep(1000);
    await click(box);
    await sleep(300);
    const typed = await evaluate(`(() => {
      const el = document.activeElement;
      if (!el || el.tagName !== "INPUT" || !/inspec/i.test(el.getAttribute("aria-label") || "")) return false;
      el.select();
      return true;
    })()`);
    if (!typed) continue;
    await page.send("Input.insertText", { text: url });
    if ((await evaluate("document.activeElement.value")) !== url) continue;
    await pressEnter();
    if (await waitFor(async () => (await evaluate("location.href"))?.includes("/inspect?"), 10)) return true;
  }
  return false;
}

/** Inspecciona una URL y, si Google no la tiene, solicita la indexación. */
async function processUrl(url, canRequest) {
  const box = await loadInspector();
  if (!box || box === "login") return { status: "error", detail: "no carga la inspección" };
  if (!(await typeUrl(box, url))) {
    await screenshot("sin-escribir");
    return { status: "error", detail: "no he podido escribir la URL en la caja de inspección" };
  }

  const verdict = await waitFor(async () => {
    if (await captchaVisible()) return "captcha";
    const text = await bodyText();
    if (NOT_ON_GOOGLE.test(text)) return "missing";
    if (ON_GOOGLE.test(text)) return "indexed";
    return null;
  }, 90);
  if (!verdict) {
    await screenshot("sin-respuesta");
    return { status: "error", detail: "Search Console no ha respondido" };
  }
  if (verdict === "captcha") await screenshot("captcha");
  if (verdict !== "missing") return { status: verdict };
  if (!canRequest) return { status: "missing" };

  // Si el clic llega antes de que la app escuche, no pasa nada: se reintenta solo
  // cuando no ha aparecido ni la prueba en directo ni una respuesta (no duplica solicitudes)
  let started = false;
  for (let attempt = 0; attempt < 3 && !started; attempt++) {
    const button = await waitFor(() => findButton(REQUEST_BUTTON), 15);
    if (!button) return { status: "error", detail: "no encuentro el botón Solicitar indexación" };
    await sleep(1500);
    await click(button);
    started = await waitFor(async () => {
      const text = await bodyText();
      return TESTING.test(text) || REQUESTED.test(text) || QUOTA.test(text) || (await captchaVisible());
    }, 10);
  }
  if (!started) {
    await screenshot("sin-clic");
    return { status: "error", detail: "el botón Solicitar indexación no responde" };
  }

  // Google prueba la URL en directo antes de confirmar: tarda uno o dos minutos
  const outcome = await waitFor(async () => {
    if (await captchaVisible()) return "captcha";
    const text = await bodyText();
    if (QUOTA.test(text)) return "quota";
    if (REQUESTED.test(text)) return "requested";
    return null;
  }, 240);
  if (outcome !== "requested") await screenshot(outcome ?? "sin-confirmar");
  if (outcome === "requested") {
    const dismiss = await findButton(DISMISS_BUTTON);
    if (dismiss) await click(dismiss);
  }
  return { status: outcome ?? "error", detail: outcome ? undefined : "la solicitud no se ha confirmado" };
}

// ---- Pasada ----

const startedChrome = await startChrome();
page = await openPage();
await page.send("Page.enable");
await page.send("Runtime.enable");

let exitCode = 0;
try {
  await ensureLoggedIn();
  log(`Pasada ${DRY ? "de prueba (sin pulsar) " : ""}de ${candidateUrls().length} URLs`);
  const summary = { requested: [], missing: [], indexed: 0, skipped: 0, errors: [] };
  for (const url of candidateUrls()) {
    const reason = skipReason(url);
    if (reason) {
      summary.skipped++;
      continue;
    }
    const canRequest = !DRY && summary.requested.length < MAX_REQUESTS;
    const r = await processUrl(url, canRequest);
    const now = new Date().toISOString();
    if (r.status === "indexed") {
      summary.indexed++;
      state[url] = { ...state[url], indexedAt: now };
      log(`  ✓ ${url} ya está en Google`);
    } else if (r.status === "requested") {
      summary.requested.push(url);
      state[url] = { ...state[url], requestedAt: now };
      log(`  → ${url} indexación solicitada`);
    } else if (r.status === "missing") {
      summary.missing.push(url);
      log(`  · ${url} no está en Google${DRY ? "" : " (cupo de hoy agotado)"}`);
    } else if (r.status === "quota" || r.status === "captcha") {
      log(
        r.status === "quota"
          ? "Google dice que se ha superado la cuota diaria: sigo mañana."
          : "Google ha sacado un captcha: paro aquí. Pulsa a mano los enlaces que queden o vuelve a probar mañana.",
      );
      exitCode = 2;
      break;
    } else {
      summary.errors.push(url);
      log(`  ✗ ${url}: ${r.detail}`);
    }
    saveState();
  }
  log(
    `Hecho: ${summary.requested.length} solicitadas, ${summary.indexed} ya indexadas, ` +
      `${summary.missing.length} pendientes, ${summary.skipped} saltadas, ${summary.errors.length} con error.`,
  );
} finally {
  saveState();
  if (startedChrome) {
    const info = await debuggerInfo();
    if (info) {
      const browser = await connect(info.webSocketDebuggerUrl);
      await browser.send("Browser.close").catch(() => {});
    }
  }
  page.close();
}
process.exit(exitCode);
