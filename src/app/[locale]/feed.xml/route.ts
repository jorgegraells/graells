import { getDictionary, isLocale, locales } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import { buildFeed } from "@/lib/feed";

/** Feed RSS por idioma (/es/feed.xml, /en/feed.xml): artículos y noticias publicados,
 *  del más reciente al más antiguo. Hay otro por tema en cada página de tema. */

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const feed = getDictionary(locale).feed;
  return buildFeed({
    locale,
    articles: getArticles(locale),
    title: feed.title,
    description: feed.description,
    linkPath: `/${locale}/blog`,
    selfPath: feed.href,
  });
}
