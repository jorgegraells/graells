import { getDictionary, type Locale } from "@/i18n/dictionaries";
import type { Article } from "@/content/articles";

/** RSS 2.0 de una lista de artículos: el general (/es/feed.xml) y el de cada tema
 *  (/es/blog/tema/iot/feed.xml). Se generan en cada despliegue, como el sitemap. */

const SITE = "https://jorgegraells.com";
export const FEED_MAX_ITEMS = 30;

const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// `published` puede venir solo con fecha (artículos antiguos): medianoche UTC
const rfc822 = (iso: string) => new Date(iso.length > 10 ? iso : `${iso}T00:00:00Z`).toUTCString();

export function buildFeed({
  locale,
  articles,
  title,
  description,
  linkPath,
  selfPath,
}: {
  locale: Locale;
  articles: Article[];
  title: string;
  description: string;
  /** Página HTML del canal, p. ej. /es/blog */
  linkPath: string;
  /** Dirección del propio feed */
  selfPath: string;
}): Response {
  const dict = getDictionary(locale);
  const list = articles.slice(0, FEED_MAX_ITEMS);
  const lastBuild = list.reduce((max, a) => (a.updated > max ? a.updated : max), list[0]?.updated ?? "");

  const items = list.map((a) => {
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
    <title>${xml(title)}</title>
    <link>${SITE}${linkPath}</link>
    <atom:link href="${SITE}${selfPath}" rel="self" type="application/rss+xml"/>
    <description>${xml(description)}</description>
    <language>${locale}</language>
${lastBuild ? `    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>\n` : ""}${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
