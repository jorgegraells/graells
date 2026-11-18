import { getDictionary, isLocale, locales } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";

/** Feed RSS por idioma (/es/feed.xml, /en/feed.xml): artículos y noticias publicados,
 *  del más reciente al más antiguo. Se genera en cada despliegue, como el sitemap. */

export const dynamic = "force-static";

const SITE = "https://jorgegraells.com";
const MAX_ITEMS = 30;

const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// `published` puede venir solo con fecha (artículos antiguos): medianoche UTC
const rfc822 = (iso: string) => new Date(iso.length > 10 ? iso : `${iso}T00:00:00Z`).toUTCString();

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const dict = getDictionary(locale);
  const feed = dict.feed;
  const articles = getArticles(locale).slice(0, MAX_ITEMS);
  const lastBuild = articles.reduce((max, a) => (a.updated > max ? a.updated : max), articles[0]?.updated ?? "");

  const items = articles.map((a) => {
    const url = `${SITE}/${locale}/blog/${a.slug}`;
    const tags = (a.type === "news" ? [dict.blog.newsBadge, ...a.tags] : a.tags)
      .map((t) => `      <category>${xml(t)}</category>`)
      .join("\n");
    return `    <item>
      <title>${xml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(a.published)}</pubDate>
      <dc:creator>Jorge Graells</dc:creator>
      <description>${xml(a.description)}</description>
${tags}
    </item>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(feed.title)}</title>
    <link>${SITE}/${locale}/blog</link>
    <atom:link href="${SITE}${feed.href}" rel="self" type="application/rss+xml"/>
    <description>${xml(feed.description)}</description>
    <language>${locale}</language>
${lastBuild ? `    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>\n` : ""}${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
