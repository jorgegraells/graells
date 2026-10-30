import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/blog/ArticleCard";

const SITE = "https://jorgegraells.com";
const NEON = ["#22d3ee", "#a855f7", "#ff3d9a", "#c6ff2e"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";
  const title = isEs
    ? "Artículos sobre IA y ciberseguridad | Jorge Graells"
    : "Articles on AI and cybersecurity | Jorge Graells";
  const description = isEs
    ? "Artículos de Jorge Graells sobre inteligencia artificial, ciberseguridad para empresas y posicionamiento en buscadores e IAs (GEO)."
    : "Articles by Jorge Graells on artificial intelligence, cybersecurity for businesses and visibility in search engines and AI answers (GEO).";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { es: "/es/blog", en: "/en/blog" },
    },
    openGraph: {
      title,
      description,
      url: `${SITE}/${locale}/blog`,
      type: "website",
      images: [`${SITE}/og.jpg`],
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const articles = getArticles(locale);
  const news = articles.filter((a) => a.type === "news");
  const guides = articles.filter((a) => a.type !== "news");
  const newsHref = locale === "es" ? "/es/noticias" : "/en/news";

  return (
    <main className="flex-1">
      <Nav locale={locale as Locale} dict={dict} />
      <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-32">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-neon-cyan">
          <span className="text-neon-pink">◢</span> {dict.blog.tag}
        </p>
        <h1 className="text-gradient neon-text mt-3 text-5xl font-black uppercase tracking-tight sm:text-6xl">
          {dict.blog.title}
        </h1>
        <p className="mt-3 font-mono text-sm uppercase tracking-widest text-muted">
          {dict.blog.subtitle}
        </p>

        {articles.length === 0 ? (
          <p className="mt-12 text-muted">{dict.blog.empty}</p>
        ) : (
          <>
            {news.length > 0 && (
              <>
                <div className="mt-12 flex flex-wrap items-end justify-between gap-3">
                  <h2 className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-pink">
                    ● {dict.blog.latestNews}
                  </h2>
                  <Link
                    href={newsHref}
                    className="font-mono text-xs uppercase tracking-widest text-neon-cyan hover:underline"
                  >
                    {dict.blog.allNews} →
                  </Link>
                </div>
                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  {news.slice(0, 2).map((a, i) => (
                    <ArticleCard key={a.slug} article={a} locale={locale} dict={dict} color={NEON[(i + 2) % NEON.length]} />
                  ))}
                </div>
                <h2 className="mt-14 font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">
                  {dict.blog.guides}
                </h2>
              </>
            )}
            <div className={`grid gap-6 md:grid-cols-2 ${news.length > 0 ? "mt-5" : "mt-12"}`}>
              {guides.map((a, i) => (
                <ArticleCard key={a.slug} article={a} locale={locale} dict={dict} color={NEON[i % NEON.length]} />
              ))}
            </div>
          </>
        )}
      </section>
      <Footer dict={dict} />
    </main>
  );
}
