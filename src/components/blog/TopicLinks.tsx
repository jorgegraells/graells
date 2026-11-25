import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { TOPIC_IDS, type TopicId } from "@/content/topics";
import { topicPath } from "@/lib/topic-pages";

/** Enlaces a las páginas de tema. En los artículos, solo sus temas; en el blog y
 *  en noticias, todos. `current` marca el tema de la página en la que se está. */
export default function TopicLinks({
  locale,
  dict,
  ids = [...TOPIC_IDS],
  variant,
  label,
  current,
  className = "",
}: {
  locale: Locale;
  dict: Dictionary;
  ids?: TopicId[];
  variant: "arcade" | "dossier";
  /** Texto delante de los enlaces; por defecto, "Temas" */
  label?: string;
  current?: TopicId;
  className?: string;
}) {
  const items = dict.topics.items;
  const text = label ?? dict.topics.label;

  if (variant === "dossier") {
    return (
      <p className={`dx-topics dx-lab ${className}`}>
        <span>{text}:</span>{" "}
        {ids.map((id, i) => (
          <span key={id}>
            {i > 0 && " · "}
            <Link href={topicPath(locale, id)} aria-current={id === current ? "page" : undefined}>
              {items[id].name}
            </Link>
          </span>
        ))}
      </p>
    );
  }

  return (
    <nav aria-label={text} className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{text}</span>
      {ids.map((id) => (
        <Link
          key={id}
          href={topicPath(locale, id)}
          aria-current={id === current ? "page" : undefined}
          className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
            id === current
              ? "border-neon-lime bg-neon-lime/15 text-neon-lime"
              : "border-neon-lime/50 text-neon-lime/90 hover:bg-neon-lime/10"
          }`}
        >
          {items[id].name}
        </Link>
      ))}
    </nav>
  );
}
