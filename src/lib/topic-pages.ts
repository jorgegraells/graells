import { getDictionary, type Locale } from "@/i18n/dictionaries";
import { TOPIC_BASE, TOPIC_IDS, type TopicId } from "@/content/topics";

/** Direcciones de las páginas de tema: /es/blog/tema/iot, /en/blog/topic/iot. */

export function topicPath(locale: Locale, id: TopicId): string {
  return `${TOPIC_BASE[locale]}/${getDictionary(locale).topics.items[id].slug}`;
}

export function topicFeedPath(locale: Locale, id: TopicId): string {
  return `${topicPath(locale, id)}/feed.xml`;
}

/** Tema a partir del último tramo de la dirección en ese idioma. */
export function topicFromSlug(locale: Locale, slug: string): TopicId | undefined {
  const items = getDictionary(locale).topics.items;
  return TOPIC_IDS.find((id) => items[id].slug === slug);
}

/** Parámetros estáticos de las páginas de tema de un idioma. */
export function topicParams(locale: Locale): { locale: Locale; topic: string }[] {
  const items = getDictionary(locale).topics.items;
  return TOPIC_IDS.map((id) => ({ locale, topic: items[id].slug }));
}
