// Valida un artículo antes de subirlo (lo usa el agente diario de borradores).
// Uso: node scripts/check-article.mjs src/content/articles/<slug-es>.json
// Sale con código 1 si hay errores; los avisos no bloquean.
import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("Uso: node scripts/check-article.mjs <archivo.json>");
  process.exit(1);
}

const errors = [];
const warnings = [];
let a;
try {
  a = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (e) {
  console.error(`JSON inválido: ${e.message}`);
  process.exit(1);
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date ?? "")) errors.push("date debe ser AAAA-MM-DD");

// Mismas reglas que valida la API del panel, más las editoriales
const BANNED = [/VTEQ/i, /\bSofIA\b/, /Quizdly/i];
const AI_TICS = [
  /no es solo .{1,40}, es /i,
  /\bnot just .{1,40}, (it'?s|but) /i,
  /en resumen/i,
  /en conclusi[oó]n/i,
  /\bin conclusion\b/i,
  /en el mundo actual/i,
  /sum[eé]rgete/i,
  /\bdelve\b/i,
];

for (const l of ["es", "en"]) {
  const d = a[l];
  if (!d) {
    errors.push(`falta el bloque "${l}"`);
    continue;
  }
  const text = `${d.title}\n${d.description}\n${d.body}`;
  if (!SLUG_RE.test(d.slug ?? "")) errors.push(`${l}: slug inválido`);
  if ((d.title ?? "").trim().length < 5) errors.push(`${l}: título demasiado corto`);
  if (d.title && d.title === d.title.toUpperCase()) errors.push(`${l}: título en mayúsculas`);
  if ((d.description ?? "").trim().length < 20) errors.push(`${l}: descripción demasiado corta`);
  if ((d.description ?? "").length > 320) warnings.push(`${l}: descripción de ${d.description.length} caracteres (ideal ≤ 300)`);
  if (!Array.isArray(d.tags) || d.tags.length < 3 || d.tags.some((t) => typeof t !== "string"))
    errors.push(`${l}: tags debe ser una lista de 3+ textos`);
  const words = (d.body ?? "").trim().split(/\s+/).length;
  if (words < 600) errors.push(`${l}: cuerpo de ${words} palabras (mínimo 600, ideal 900-1.400)`);
  if ((text.match(/—/g) ?? []).length) errors.push(`${l}: contiene raya larga (—)`);
  for (const re of BANNED) if (re.test(text)) errors.push(`${l}: contiene término prohibido ${re}`);
  for (const re of AI_TICS) if (re.test(text)) warnings.push(`${l}: posible tic de IA ${re}`);
  if (((d.body ?? "").match(/^## /gm) ?? []).length < 4) warnings.push(`${l}: menos de 4 secciones ##`);

  // Enlaces internos: deben apuntar a páginas que existen
  for (const [, href] of (d.body ?? "").matchAll(/\]\((\/[^)\s]+)\)/g)) {
    const m = href.match(/^\/(es|en)\/blog\/([a-z0-9-]+)$/);
    if (m) {
      const exists = fs
        .readdirSync(path.dirname(file))
        .filter((f) => f.endsWith(".json"))
        .some((f) => {
          const o = JSON.parse(fs.readFileSync(path.join(path.dirname(file), f), "utf8"));
          return !o.draft && o[m[1]]?.slug === m[2];
        });
      if (!exists) errors.push(`${l}: enlace interno roto o a un borrador: ${href}`);
    } else if (!/^\/(es|en)(\/(training|blog|world))?(#[a-z-]+)?$/.test(href)) {
      warnings.push(`${l}: enlace interno no reconocido: ${href}`);
    }
  }
}

if (a.es?.slug && path.basename(file) !== `${a.es.slug}.json`)
  errors.push(`el archivo debería llamarse ${a.es.slug}.json`);
if (a.es?.slug && a.en?.slug && a.es.slug === a.en.slug)
  warnings.push("el slug ES y EN son iguales (mejor uno por idioma)");

// Slugs únicos frente al resto de artículos
for (const f of fs.readdirSync(path.dirname(file))) {
  if (!f.endsWith(".json") || path.join(path.dirname(file), f) === path.normalize(file)) continue;
  const o = JSON.parse(fs.readFileSync(path.join(path.dirname(file), f), "utf8"));
  for (const l of ["es", "en"]) if (o[l]?.slug === a[l]?.slug) errors.push(`${l}: slug ya usado en ${f}`);
}

for (const w of warnings) console.log(`AVISO  ${w}`);
for (const e of errors) console.log(`ERROR  ${e}`);
console.log(errors.length ? `\n${errors.length} error(es)` : "\nOK");
process.exit(errors.length ? 1 : 0);
