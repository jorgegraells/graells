import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/blog/ArticleCard";

/** Página "Noticias": solo los artículos marcados como noticia, del más
 *  reciente al más antiguo. Vive en /es/noticias y /en/news (la URL de cada
 *  noticia sigue en /blog/<slug>). */

const SITE = "https://jorgegraells.com";
const NEON = ["#ff3d9a", "#22d3ee", "#a855f7", "#c6ff2e"];
export const NEWS_PATH: Record<Locale, string> = { es: "/es/noticias", en: "/en/news" };

export function newsMetadata(locale: Locale): Metadata {
  const isEs = locale === "es";
  const title = isEs
    ? "Noticias de ciberseguridad e IA | Jorge Graells"
    : "Cybersecurity and AI news | Jorge Graells";
  const description = isEs
    ? "Noticias de ciberseguridad e inteligencia artificial: qué ha pasado, con fuentes oficiales, y qué deben hacer personas y empresas."
    : "Cybersecurity and artificial intelligence news: what happened, with official sources, and what people and companies should do.";
  return {
    title,
    description,
    alternates: {
      canonical: NEWS_PATH[locale],
      languages: { es: NEWS_PATH.es, en: NEWS_PATH.en },
    },
    openGraph: { title, description, url: `${SITE}${NEWS_PATH[locale]}`, type: "website", images: [`${SITE}/og.jpg`] },
  };
}

export default function NewsIndex({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const news = getArticles(locale)
    .filter((a) => a.type === "news")
    .sort((a, b) => b.published.localeCompare(a.published));

  return (
    <main className="flex-1">
      <Nav locale={locale} dict={dict} />
      <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-32">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-neon-pink">
          ● {dict.news.tag}
        </p>
        <h1 className="text-gradient neon-text mt-3 text-5xl font-black uppercase tracking-tight sm:text-6xl">
          {dict.news.title}
        </h1>
        <p className="mt-3 font-mono text-sm uppercase tracking-widest text-muted">
          {dict.news.subtitle}
        </p>
        {news.length === 0 ? (
          <p className="mt-12 text-muted">{dict.news.empty}</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {news.map((a, i) => (
              <ArticleCard key={a.slug} article={a} locale={locale} dict={dict} color={NEON[i % NEON.length]} />
            ))}
          </div>
        )}
      </section>
      <Footer dict={dict} />
    </main>
  );
}
