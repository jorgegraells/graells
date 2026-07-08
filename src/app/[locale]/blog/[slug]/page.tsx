import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
import {
  getArticle,
  getArticles,
  getAllArticleParams,
} from "@/content/articles";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Markdown from "@/components/blog/Markdown";

const SITE = "https://jorgegraells.com";

export function generateStaticParams() {
  return getAllArticleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = getArticle(locale, slug);
  if (!article) return {};
  return {
    title: `${article.title} — Jorge Graells`,
    description: article.description,
    alternates: { canonical: `/${locale}/blog/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE}/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: article.date,
      authors: ["Jorge Graells"],
      tags: article.tags,
      images: [`${SITE}/og.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [`${SITE}/og.jpg`],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const article = getArticle(locale, slug);
  if (!article) notFound();

  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: locale,
    keywords: article.tags.join(", "),
    author: { "@type": "Person", name: "Jorge Graells", url: SITE },
    publisher: { "@type": "Person", name: "Jorge Graells", url: SITE },
    image: `${SITE}/og.jpg`,
    mainEntityOfPage: `${SITE}/${locale}/blog/${slug}`,
  };

  return (
    <main className="flex-1">
      <Nav locale={locale as Locale} dict={dict} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <Link
          href={`/${locale}/blog`}
          className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-neon-cyan"
        >
          ← {dict.blog.back}
        </Link>

        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-neon-cyan/50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neon-cyan"
            >
              {t}
            </span>
          ))}
        </div>

        <h1 className="text-gradient neon-text mt-4 text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">
          {fmt.format(new Date(article.date))} · {article.readingMinutes}{" "}
          {dict.blog.minRead}
        </p>

        <p className="mt-8 border-l-2 border-neon-cyan/50 pl-4 text-lg leading-relaxed text-foreground/90">
          {article.description}
        </p>

        <div className="mt-6">
          <Markdown>{article.body}</Markdown>
        </div>

        <hr className="mt-14 border-white/10" />
        <Link
          href={`/${locale}/blog`}
          className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-neon-cyan hover:underline"
        >
          ← {dict.blog.back}
        </Link>

        {/* Otros artículos */}
        {getArticles(locale).filter((a) => a.slug !== slug).length > 0 && (
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {getArticles(locale)
              .filter((a) => a.slug !== slug)
              .slice(0, 2)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/${locale}/blog/${a.slug}`}
                  className="hud-panel clip-corner p-5 transition-transform hover:-translate-y-1"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neon-pink">
                    {dict.blog.readMore}
                  </p>
                  <p className="mt-1 font-bold leading-tight text-foreground">
                    {a.title}
                  </p>
                </Link>
              ))}
          </div>
        )}
      </article>
      <Footer dict={dict} />
    </main>
  );
}
