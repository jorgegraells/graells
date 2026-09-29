import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/i18n/dictionaries";

export type Article = {
  slug: string;
  title: string;
  /** Respuesta directa / lead — también se usa como meta description y subtítulo. */
  description: string;
  date: string; // ISO
  /** Última edición (ISO con hora). Si el archivo no la trae, igual a `date`. */
  updated: string;
  readingMinutes: number;
  tags: string[];
  body: string; // Markdown
  /** Slug del mismo artículo en cada idioma, para hreflang. */
  slugs: Record<Locale, string>;
};

/** Un artículo por archivo JSON en `src/content/articles/`, con los dos
 *  idiomas emparejados. Los crea y edita el panel de administración
 *  (`/admin`), que además sella `updated` en cada guardado. */
type ArticleFile = {
  date: string;
  updated?: string;
  es: ArticleLocale;
  en: ArticleLocale;
};

type ArticleLocale = Omit<Article, "readingMinutes" | "date" | "updated" | "slugs">;

const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function loadFiles(): ArticleFile[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8")),
    );
}

function toArticle(file: ArticleFile, locale: Locale): Article {
  const data = file[locale];
  return {
    ...data,
    date: file.date,
    updated: file.updated ?? file.date,
    readingMinutes: readingMinutes(data.body),
    slugs: { es: file.es.slug, en: file.en.slug },
  };
}

export function getArticles(locale: Locale): Article[] {
  return loadFiles()
    .map((f) => toArticle(f, locale))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(locale: Locale, slug: string): Article | undefined {
  const file = loadFiles().find((f) => f[locale].slug === slug);
  return file ? toArticle(file, locale) : undefined;
}

export function getAllArticleParams(): { locale: Locale; slug: string }[] {
  return loadFiles().flatMap((f) => [
    { locale: "es" as Locale, slug: f.es.slug },
    { locale: "en" as Locale, slug: f.en.slug },
  ]);
}
