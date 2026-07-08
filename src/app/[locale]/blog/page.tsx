import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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
    ? "Artículos — Jorge Graells"
    : "Articles — Jorge Graells";
  const description = isEs
    ? "Artículos de Jorge Graells sobre inteligencia artificial, desarrollo full-stack y posicionamiento en buscadores e IAs (GEO)."
    : "Articles by Jorge Graells on artificial intelligence, full-stack development and visibility in search engines and AI answers (GEO).";
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
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

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
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {articles.map((a, i) => {
              const c = NEON[i % NEON.length];
              return (
                <Link
                  key={a.slug}
                  href={`/${locale}/blog/${a.slug}`}
                  className="hud-panel clip-corner group flex flex-col p-7 transition-transform duration-300 hover:-translate-y-1.5"
                  style={{ borderColor: `${c}55` }}
                >
                  <div className="flex flex-wrap gap-2">
                    {a.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                        style={{ borderColor: `${c}88`, color: c }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2
                    className="mt-4 text-xl font-black leading-tight tracking-tight"
                    style={{ color: c, textShadow: `0 0 20px ${c}44` }}
                  >
                    {a.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {a.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between font-mono text-xs text-muted">
                    <span>
                      {fmt.format(new Date(a.date))} · {a.readingMinutes}{" "}
                      {dict.blog.minRead}
                    </span>
                    <span
                      className="font-bold transition-transform group-hover:translate-x-1"
                      style={{ color: c }}
                    >
                      {dict.blog.readMore} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      <Footer dict={dict} />
    </main>
  );
}
