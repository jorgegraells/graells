import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";

export default function BlogTeaser({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const articles = getArticles(locale).slice(0, 2);
  if (articles.length === 0) return null;
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const NEON = ["#22d3ee", "#a855f7"];

  return (
    <Section id="blog">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHead index="05" tag={dict.blog.tag} title={dict.blog.title} />
        <Link
          href={`/${locale}/blog`}
          className="font-mono text-xs uppercase tracking-widest text-neon-cyan hover:underline"
        >
          {dict.blog.title} →
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {articles.map((a, i) => {
          const c = NEON[i % NEON.length];
          return (
            <Link
              key={a.slug}
              href={`/${locale}/blog/${a.slug}`}
              className="hud-panel clip-corner group flex flex-col p-6 transition-transform duration-300 hover:-translate-y-1.5"
              style={{ borderColor: `${c}55` }}
            >
              <div className="flex flex-wrap gap-2">
                {a.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                    style={{ borderColor: `${c}88`, color: c }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h3
                className="mt-4 text-lg font-black leading-tight tracking-tight"
                style={{ color: c }}
              >
                {a.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {a.description}
              </p>
              <p className="mt-4 font-mono text-xs text-muted">
                {fmt.format(new Date(a.date))} · {a.readingMinutes}{" "}
                {dict.blog.minRead}
              </p>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
