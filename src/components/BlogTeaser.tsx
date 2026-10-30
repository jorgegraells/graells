import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import ArticleCard from "@/components/blog/ArticleCard";

export default function BlogTeaser({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const articles = getArticles(locale).slice(0, 2);
  if (articles.length === 0) return null;
  const NEON = ["#22d3ee", "#a855f7"];

  return (
    <Section id="blog">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHead index="06" tag={dict.blog.tag} title={dict.blog.title} />
        <Link
          href={`/${locale}/blog`}
          className="font-mono text-xs uppercase tracking-widest text-neon-cyan hover:underline"
        >
          {dict.blog.title} →
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {articles.map((a, i) => (
          <ArticleCard key={a.slug} article={a} locale={locale} dict={dict} color={NEON[i % NEON.length]} compact />
        ))}
      </div>
    </Section>
  );
}
