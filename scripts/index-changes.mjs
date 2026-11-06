// Tras cada push a main: valida los artículos publicados que han cambiado, espera
// a que Vercel sirva la versión nueva y avisa a Bing por IndexNow. Da igual quién
// haya subido el cambio (Jorge, el panel, una rutina). Lo ejecuta GitHub Actions.
// Uso: node scripts/index-changes.mjs <commit-anterior> <commit-nuevo>
// Google no admite este aviso: de Google se encarga scripts/index-bot.mjs.

import { execFileSync } from "node:child_process";
import { changedBetween } from "./lib/changed-urls.mjs";

const INDEXNOW_KEY = "f8afc2c879870f8ae7ee50a660940e64";
const HOST = "jorgegraells.com";
const DEPLOY_TIMEOUT = 10 * 60_000;
const PAGE_DEPLOY_WAIT = 4 * 60_000; // una página fija no dice qué versión sirve

const [from, to] = process.argv.slice(2);
if (!from || !to || /^0+$/.test(from)) {
  console.log("Sin commit anterior con el que comparar: no hay nada que avisar.");
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const { articles, pages } = changedBetween(from, to);
const urls = [...new Set([...articles.flatMap((a) => a.urls), ...pages])];
if (!urls.length) {
  console.log("Este push no cambia ninguna página pública.");
  process.exit(0);
}

// Un artículo publicado que no pasa el validador hace fallar el trabajo y GitHub
// avisa a Jorge por correo. Se sigue avisando a Bing: el artículo ya está en la web.
let invalid = 0;
for (const a of articles) {
  try {
    execFileSync("node", ["scripts/check-article.mjs", a.file], { stdio: "inherit" });
  } catch {
    invalid++;
    console.log(`NO PASA EL VALIDADOR: ${a.file}`);
  }
}

async function serves(url, text) {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(20_000) });
    return res.ok && (!text || (await res.text()).includes(text));
  } catch {
    return false;
  }
}

// El `updated` del artículo sale en el HTML: en cuanto se ve, el despliegue ya está
const started = Date.now();
if (!articles.length) await sleep(PAGE_DEPLOY_WAIT);
for (const a of articles) {
  for (const url of a.urls) {
    while (!(await serves(url, a.updated)) && Date.now() - started < DEPLOY_TIMEOUT) await sleep(20_000);
  }
}
const deployed = await Promise.all(
  articles.flatMap((a) => a.urls.map((u) => serves(u, a.updated))),
);
if (deployed.includes(false)) console.log("Aviso: alguna URL aún no sirve la versión nueva; aviso a Bing igualmente.");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  }),
});
console.log(`IndexNow respondió ${res.status} para ${urls.length} URLs:\n${urls.join("\n")}`);

// 200 = aceptado, 202 = aceptado pendiente de validar la clave
const indexed = res.status === 200 || res.status === 202;
process.exit(indexed && !invalid ? 0 : 1);
