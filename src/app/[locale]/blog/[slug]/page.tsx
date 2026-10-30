import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getDictionary,
  isLocale,
  siteLinks,
  type Locale,
} from "@/i18n/dictionaries";
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
  const metaDescription = article.seoDescription || article.description;
  return {
    // El sufijo solo si cabe: Google corta los títulos a partir de ~65 caracteres
    title:
      article.title.length + 16 <= 65
        ? `${article.title} | Jorge Graells`
        : article.title,
    description: metaDescription,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        es: `/es/blog/${article.slugs.es}`,
        en: `/en/blog/${article.slugs.en}`,
      },
    },
    openGraph: {
      title: article.title,
      description: metaDescription,
      url: `${SITE}/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updated,
      authors: ["Jorge Graells"],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: metaDescription,
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
  const fmtUpdated = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  });
  // Solo se muestra si hubo una edición posterior al día de publicación
  const wasUpdated =
    article.updated.length > 10 &&
    Date.parse(article.updated) - Date.parse(article.published) > 10 * 60_000;
  // Las noticias muestran la hora de publicación, como cualquier medio
  const shownDate =
    article.type === "news" && article.published.length > 10
      ? `${fmtUpdated.format(new Date(article.published))} UTC`
      : fmt.format(new Date(article.date));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": article.type === "news" ? "NewsArticle" : "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    dateModified: article.updated,
    inLanguage: locale,
    keywords: article.tags.join(", "),
    author: {
      "@type": "Person",
      name: "Jorge Graells",
      url: SITE,
      jobTitle: "AI Engineer & Full-Stack Developer",
      sameAs: [siteLinks.linkedin, siteLinks.github],
    },
    publisher: { "@type": "Person", name: "Jorge Graells", url: SITE },
    image: `${SITE}/${locale}/blog/${slug}/opengraph-image`,
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
          {dict.blog.by}{" "}
          <Link href={`/${locale}#about`} rel="author" className="text-foreground/80 hover:text-neon-cyan">
            Jorge Graells
          </Link>{" "}
          · {shownDate} · {article.readingMinutes}{" "}
          {dict.blog.minRead}
        </p>
        {wasUpdated && (
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-neon-lime">
            {dict.blog.updated}:{" "}
            <time dateTime={article.updated}>
              {fmtUpdated.format(new Date(article.updated))} UTC
            </time>
          </p>
        )}

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
