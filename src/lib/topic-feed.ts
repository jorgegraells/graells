import { getDictionary, type Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import { buildFeed } from "@/lib/feed";
import { topicFeedPath, topicFromSlug, topicPath } from "@/lib/topic-pages";

/** RSS de un tema (/es/blog/tema/iot/feed.xml): lo comparten las rutas de los dos idiomas. */
export async function topicFeed(
  locale: Locale,
  params: Promise<{ locale: string; topic: string }>,
): Promise<Response> {
  const p = await params;
  const id = p.locale === locale ? topicFromSlug(locale, p.topic) : undefined;
  if (!id) return new Response("Not found", { status: 404 });
  const dict = getDictionary(locale);
  const t = dict.topics.items[id];
  return buildFeed({
    locale,
    articles: getArticles(locale)
      .filter((a) => a.topics.includes(id))
      .sort((a, b) => b.published.localeCompare(a.published)),
    title: `Jorge Graells | ${t.title}`,
    description: t.seoDescription,
    linkPath: topicPath(locale, id),
    selfPath: topicFeedPath(locale, id),
  });
}
