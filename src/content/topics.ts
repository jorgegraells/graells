import type { Locale } from "@/i18n/dictionaries";

/** Temas del blog y del boletín. Cada artículo lleva uno o varios en `topics`
 *  (src/content/articles/*.json) y cada suscriptor elige cuáles recibe.
 *  Los nombres, las direcciones y los textos de cada tema están en el diccionario
 *  (`dict.topics`). Si se añade uno, hay que tocarlo también en
 *  scripts/newsletter.mjs, scripts/check-article.mjs y el panel /admin. */
export const TOPIC_IDS = ["ciber", "ia", "iot"] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export function isTopic(value: unknown): value is TopicId {
  return typeof value === "string" && (TOPIC_IDS as readonly string[]).includes(value);
}

/** Atributo de contacto en Brevo para cada tema (booleano). */
export const TOPIC_ATTRIBUTE: Record<TopicId, string> = {
  ciber: "TEMA_CIBER",
  ia: "TEMA_IA",
  iot: "TEMA_IOT",
};

/** Carpeta de las páginas de tema en cada idioma: /es/blog/tema/<slug>, /en/blog/topic/<slug>. */
export const TOPIC_BASE: Record<Locale, string> = { es: "/es/blog/tema", en: "/en/blog/topic" };
