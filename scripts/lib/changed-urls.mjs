// Traduce un rango de commits a las URLs públicas que han cambiado.
// Lo usan el aviso a Bing (scripts/index-changes.mjs, en GitHub Actions) y el bot
// de Google (scripts/index-bot.mjs, en el PC de Jorge). Solo lee de git: nunca
// toca la copia de trabajo.

import { execFileSync } from "node:child_process";

export const ORIGIN = "https://jorgegraells.com";
const ARTICLES_DIR = "src/content/articles";

export function git(args, cwd = process.cwd()) {
  return execFileSync("git", ["-c", "core.quotepath=off", ...args], {
    cwd,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
}

// Secciones con la ruta distinta en cada idioma
const ROUTES = {
  about: ["/es/sobre-mi", "/en/about"],
  "sobre-mi": ["/es/sobre-mi", "/en/about"],
  news: ["/es/noticias", "/en/news"],
  noticias: ["/es/noticias", "/en/news"],
  "editorial-policy": ["/es/politica-editorial", "/en/editorial-policy"],
  "politica-editorial": ["/es/politica-editorial", "/en/editorial-policy"],
};
const route = (name) => ROUTES[name] ?? [`/es/${name}`, `/en/${name}`];
const HOME = ["/es", "/en"];

/** Rutas afectadas por un archivo que no es un artículo. */
function pagesForFile(file) {
  if (file === "src/i18n/dictionaries.ts") return [...HOME, ...route("training"), ...route("about")];
  if (file === "src/content/flypet.ts") return route("flypet");
  if (file === "src/content/flypet-privacy.ts") return route("flypet/privacidad");
  if (file === "src/app/[locale]/page.tsx") return HOME;

  // La plantilla de los artículos no cambia el contenido de ninguno
  const page = file.match(/^src\/app\/\[locale\]\/(.+)\/page\.tsx$/);
  if (page) return page[1].includes("[") ? [] : route(page[1]);

  if (file === "src/components/blog/NewsIndex.tsx" || file === "src/components/dossier/DossierNewspaper.tsx") return route("news");
  if (file.startsWith("src/components/world/")) return route("world");
  if (/^src\/components\/[^/]+\.tsx$/.test(file)) return HOME;
  return [];
}

/** Artículos publicados y páginas que cambian entre dos commits. */
export function changedBetween(from, to, cwd) {
  const articles = [];
  const pages = new Set();
  const lines = git(["diff", "--name-status", "--no-renames", from, to], cwd).split("\n").filter(Boolean);
  for (const line of lines) {
    const [status, file] = line.split("\t");
    if (status === "D") continue;
    if (file.startsWith(`${ARTICLES_DIR}/`) && file.endsWith(".json")) {
      const a = JSON.parse(git(["show", `${to}:${file}`], cwd));
      if (a.draft) continue;
      articles.push({
        file,
        title: a.es.title,
        updated: a.updated ?? a.published ?? a.date,
        urls: ["es", "en"].map((l) => `${ORIGIN}/${l}/blog/${a[l].slug}`),
      });
    } else {
      for (const p of pagesForFile(file)) pages.add(ORIGIN + p);
    }
  }
  return { articles, pages: [...pages] };
}

/** Las URLs de todos los artículos publicados en un commit, los más nuevos primero. */
export function publishedArticleUrls(ref, cwd) {
  return git(["ls-tree", "--name-only", ref, `${ARTICLES_DIR}/`], cwd)
    .split("\n")
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(git(["show", `${ref}:${f}`], cwd)))
    .filter((a) => !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .flatMap((a) => ["es", "en"].map((l) => `${ORIGIN}/${l}/blog/${a[l].slug}`));
}
