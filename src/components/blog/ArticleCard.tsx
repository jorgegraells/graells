import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { Article } from "@/content/articles";

/** Tarjeta de artículo: la usan el blog, la página de noticias y la portada.
 *  Las noticias llevan una etiqueta propia y muestran la hora de publicación. */
export default function ArticleCard({
  article: a,
  locale,
  dict,
  color: c,
  compact = false,
}: {
  article: Article;
  locale: Locale;
  dict: Dictionary;
  color: string;
  compact?: boolean;
}) {
  const isNews = a.type === "news";
  const date =
    isNews && a.published.length > 10
      ? new Intl.DateTimeFormat(locale, {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "UTC",
        }).format(new Date(a.published)) + " UTC"
      : new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(a.date));
  const Title = compact ? "h3" : "h2";

  return (
    <Link
      href={`/${locale}/blog/${a.slug}`}
      className={`hud-panel clip-corner group flex flex-col transition-transform duration-300 hover:-translate-y-1.5 ${compact ? "p-6" : "p-7"}`}
      style={{ borderColor: `${c}55` }}
    >
      <div className="flex flex-wrap gap-2">
        {isNews && (
          <span className="rounded-full bg-neon-pink/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neon-pink">
            ● {dict.blog.newsBadge}
          </span>
        )}
        {a.tags.slice(0, compact ? 3 : undefined).map((t) => (
          <span
            key={t}
            className="rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
            style={{ borderColor: `${c}88`, color: c }}
          >
            {t}
          </span>
        ))}
      </div>
      <Title
        className={`mt-4 font-black leading-tight tracking-tight ${compact ? "text-lg" : "text-xl"}`}
        style={{ color: c, textShadow: compact ? undefined : `0 0 20px ${c}44` }}
      >
        {a.title}
      </Title>
      <p className={`flex-1 text-sm leading-relaxed text-muted ${compact ? "mt-2" : "mt-3"}`}>
        {a.description}
      </p>
      <div
        className={`flex items-center justify-between gap-4 font-mono text-xs text-muted ${compact ? "mt-4" : "mt-5"}`}
      >
        <span>
          {date} · {a.readingMinutes} {dict.blog.minRead}
        </span>
        {!compact && (
          <span
            className="shrink-0 font-bold transition-transform group-hover:translate-x-1"
            style={{ color: c }}
          >
            {dict.blog.readMore} →
          </span>
        )}
      </div>
    </Link>
  );
}
