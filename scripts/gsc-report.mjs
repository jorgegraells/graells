// Informe de Google Search Console para el auditor SEO semanal.
// Uso: node scripts/gsc-report.mjs            → informe en Markdown
//      node scripts/gsc-report.mjs --json     → datos en bruto
//
// Credencial: una cuenta de servicio de Google con acceso "Restringido"
// (solo lectura) a la propiedad de jorgegraells.com en Search Console.
//   GSC_SERVICE_ACCOUNT       → el JSON de la clave, tal cual o en base64
//   GSC_SERVICE_ACCOUNT_FILE  → o la ruta al archivo JSON (uso local)
// Sin dependencias: firma el JWT con node:crypto.
import crypto from "node:crypto";
import fs from "node:fs";

const API = "https://searchconsole.googleapis.com/webmasters/v3";

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function loadServiceAccount() {
  const raw =
    process.env.GSC_SERVICE_ACCOUNT ||
    (process.env.GSC_SERVICE_ACCOUNT_FILE &&
      fs.readFileSync(process.env.GSC_SERVICE_ACCOUNT_FILE, "utf8"));
  if (!raw) fail("falta GSC_SERVICE_ACCOUNT (ver docs/SEO.md)");
  const text = raw.trim().startsWith("{")
    ? raw
    : Buffer.from(raw.trim(), "base64").toString("utf8");
  try {
    const sa = JSON.parse(text);
    if (!sa.client_email || !sa.private_key) throw new Error("sin client_email/private_key");
    return sa;
  } catch (e) {
    fail(`GSC_SERVICE_ACCOUNT no es un JSON de cuenta de servicio válido (${e.message})`);
  }
}

const b64url = (input) =>
  Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(`${header}.${claims}`)
    .sign(sa.private_key);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${b64url(signature)}`,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token)
    fail(`Google no ha dado acceso (${res.status}): ${JSON.stringify(json).slice(0, 300)}`);
  return json.access_token;
}

async function api(token, path, body) {
  const res = await fetch(`${API}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) fail(`Search Console ${res.status} en ${path}: ${JSON.stringify(json).slice(0, 300)}`);
  return json;
}

const day = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * 86_400_000);

async function query(token, site, startDate, endDate, dimensions, rowLimit = 250) {
  const json = await api(token, `/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
    startDate,
    endDate,
    dimensions,
    rowLimit,
  });
  return json.rows ?? [];
}

function totals(rows) {
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  const position = impressions
    ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions
    : 0;
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position };
}

const pct = (x) => `${(x * 100).toFixed(1)} %`;
const pos = (x) => x.toFixed(1);
const short = (url) => url.replace(/^https?:\/\/[^/]+/, "") || "/";

const sa = loadServiceAccount();
const token = await getAccessToken(sa);

const sites = (await api(token, "/sites")).siteEntry ?? [];
const site = sites.find((s) => s.siteUrl.includes("jorgegraells.com"))?.siteUrl;
if (!site)
  fail(
    `la cuenta ${sa.client_email} no tiene acceso a jorgegraells.com. Añádela en Search Console → Configuración → Usuarios y permisos (permiso Restringido).`,
  );

// Search Console va unos 3 días por detrás
const end = addDays(new Date(), -3);
const start = addDays(end, -27);
const prevEnd = addDays(start, -1);
const prevStart = addDays(prevEnd, -27);
const range = [day(start), day(end)];

const [byDate, prevByDate, byQuery, byPage, byPageQuery] = await Promise.all([
  query(token, site, ...range, ["date"]),
  query(token, site, day(prevStart), day(prevEnd), ["date"]),
  query(token, site, ...range, ["query"]),
  query(token, site, ...range, ["page"]),
  query(token, site, ...range, ["page", "query"], 1000),
]);

const now = totals(byDate);
const before = totals(prevByDate);
// Casi en la primera página: posición 4-20 con algo de visibilidad
const opportunities = byPageQuery
  .filter((r) => r.position >= 4 && r.position <= 20 && r.impressions >= 3)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 20);
// Se ven pero no se pulsan: título o descripción a revisar
const lowCtr = byPage
  .filter((r) => r.impressions >= 20 && r.clicks / r.impressions < 0.01)
  .sort((a, b) => b.impressions - a.impressions);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ site, range, now, before, byQuery, byPage, opportunities, lowCtr }, null, 2));
  process.exit(0);
}

const row = (cells) => `| ${cells.join(" | ")} |`;
const lines = [
  `# Search Console: ${site}`,
  "",
  `Periodo: ${range[0]} a ${range[1]} (28 días), comparado con los 28 anteriores.`,
  "",
  row(["", "Ahora", "Antes"]),
  row(["---", "---", "---"]),
  row(["Clics", now.clicks, before.clicks]),
  row(["Impresiones", now.impressions, before.impressions]),
  row(["CTR", pct(now.ctr), pct(before.ctr)]),
  row(["Posición media", pos(now.position), pos(before.position)]),
  "",
  "## Consultas principales",
  "",
  row(["Consulta", "Clics", "Impr.", "CTR", "Pos."]),
  row(["---", "---", "---", "---", "---"]),
  ...byQuery
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20)
    .map((r) => row([r.keys[0], r.clicks, r.impressions, pct(r.ctr), pos(r.position)])),
  "",
  "## Páginas",
  "",
  row(["Página", "Clics", "Impr.", "CTR", "Pos."]),
  row(["---", "---", "---", "---", "---"]),
  ...byPage
    .sort((a, b) => b.impressions - a.impressions)
    .map((r) => row([short(r.keys[0]), r.clicks, r.impressions, pct(r.ctr), pos(r.position)])),
  "",
  "## Oportunidades (posición 4-20)",
  "",
  opportunities.length
    ? [
        row(["Página", "Consulta", "Impr.", "Pos."]),
        row(["---", "---", "---", "---"]),
        ...opportunities.map((r) => row([short(r.keys[0]), r.keys[1], r.impressions, pos(r.position)])),
      ].join("\n")
    : "Ninguna todavía.",
  "",
  "## Se ven pero no se pulsan (CTR < 1 %)",
  "",
  lowCtr.length
    ? lowCtr.map((r) => `- ${short(r.keys[0])}: ${r.impressions} impresiones, ${r.clicks} clics`).join("\n")
    : "Ninguna.",
];
console.log(lines.join("\n"));
