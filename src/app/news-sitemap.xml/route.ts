import { locales } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";

/** Sitemap de Google Noticias: solo artículos de los dos últimos días, que es
 *  lo que Google lee de este tipo de sitemap. Se genera en cada despliegue,
 *  y cada publicación desde el panel provoca uno. */

export const dynamic = "force-static";

const SITE = "https://jorgegraells.com";
const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const now = Date.now();
  const entries = locales.flatMap((locale) =>
    getArticles(locale)
      .filter((a) => now - Date.parse(a.published) < TWO_DAYS)
      .map(
        (a) => `  <url>
    <loc>${SITE}/${locale}/blog/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Jorge Graells</news:name>
        <news:language>${locale}</news:language>
      </news:publication>
      <news:publication_date>${a.published.length > 10 ? a.published : `${a.published}T00:00:00Z`}</news:publication_date>
      <news:title>${xml(a.title)}</news:title>
    </news:news>
  </url>`,
      ),
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries.join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
