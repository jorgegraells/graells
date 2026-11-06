// Valida un artículo antes de subirlo.
// Uso: node scripts/check-article.mjs src/content/articles/<slug-es>.json [--publish]
// Sale con código 1 si hay errores; los avisos no bloquean.
// --publish es el filtro de lo que se publica sin que lo revise Jorge: los avisos
// pasan a ser errores y se exigen fuentes y fechas de publicación.
import fs from "node:fs";
import path from "node:path";

const PUBLISH = process.argv.includes("--publish");
const file = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!file) {
  console.error("Uso: node scripts/check-article.mjs <archivo.json> [--publish]");
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
  /la buena noticia/i,
  /regla de oro/i,
  /reglas del juego/i,
  /dicho de otro modo/i,
  /the good news/i,
  /golden rule/i,
  /changes? the game|game[- ]changer/i,
  /in other words/i,
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
  if (d.seoDescription !== undefined && d.seoDescription.length > 155)
    errors.push(`${l}: seoDescription de ${d.seoDescription.length} caracteres (máx. 155)`);
  if ((d.description ?? "").length > 160 && !d.seoDescription)
    warnings.push(`${l}: falta seoDescription (la description es larga y Google la cortará)`);
  if (!Array.isArray(d.tags) || d.tags.length < 3 || d.tags.some((t) => typeof t !== "string"))
    errors.push(`${l}: tags debe ser una lista de 3+ textos`);
  const words = (d.body ?? "").trim().split(/\s+/).length;
  if (words < 600) errors.push(`${l}: cuerpo de ${words} palabras (mínimo 600, ideal 900-1.400)`);
  if ((text.match(/—/g) ?? []).length) errors.push(`${l}: contiene raya larga (—)`);
  for (const re of BANNED) if (re.test(text)) errors.push(`${l}: contiene término prohibido ${re}`);
  for (const re of AI_TICS) if (re.test(text)) warnings.push(`${l}: posible tic de IA ${re}`);
  if (/^\s*(?:[-*]|\d+\.)\s+\*\*/m.test(d.body ?? ""))
    errors.push(`${l}: listas con la primera frase en negrita (marca típica de texto de IA)`);
  for (const p of (d.body ?? "").split(/\n\s*\n/))
    if (/\d+ ?%/.test(p) && !p.includes("]("))
      warnings.push(`${l}: porcentaje sin fuente enlazada en el párrafo: "${p.slice(0, 60)}…"`);
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

if (PUBLISH) {
  if (a.draft) errors.push('sigue con "draft": quítalo antes de publicar');
  const ISO = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/;
  if (!ISO.test(a.updated ?? "")) errors.push("updated debe ser ISO UTC con hora");
  // Los artículos antiguos no tienen hora de publicación ni tantas fuentes, y
  // actualizarlos no debe obligar a rehacerlos
  const isNew = Date.now() - Date.parse(a.date) < 3 * 86_400_000;
  if (isNew && !ISO.test(a.published ?? "")) errors.push("published debe ser ISO UTC con hora");
  for (const l of ["es", "en"]) {
    const d = a[l];
    if (!d) continue;
    const text = `${d.title}\n${d.description}\n${d.body}`;
    // Sus proyectos y lo personal los publica Jorge, nunca una rutina
    if (/flypet|antidop|workleveling|hor[oó]scop|horoscope/i.test(text))
      errors.push(`${l}: habla de un proyecto de Jorge: se queda en borrador`);
    const links = new Set([...(d.body ?? "").matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => new URL(m[1]).hostname));
    // Una noticia se contrasta en dos sitios; una guía puede explicar una sola fuente oficial
    const minLinks = a.type === "news" ? 2 : 1;
    if (isNew && links.size < minLinks) errors.push(`${l}: necesita enlaces a al menos ${minLinks} fuente(s) externa(s) distinta(s)`);
  }
  errors.push(...warnings);
  warnings.length = 0;
}

for (const w of warnings) console.log(`AVISO  ${w}`);
for (const e of errors) console.log(`ERROR  ${e}`);
console.log(errors.length ? `\n${errors.length} error(es)` : "\nOK");
process.exit(errors.length ? 1 : 0);
