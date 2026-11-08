import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DossierTabs, { innerTabs } from "@/components/dossier/DossierTabs";
import DossierFolio from "@/components/dossier/DossierFolio";
import DossierLedger from "@/components/dossier/DossierLedger";
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
  // Las noticias tienen su propia sección
  const guides = getArticles(locale).filter((a) => a.type !== "news");

  return (
    <main className="flex-1">
      <div className="theme-arcade">
        <Nav locale={locale as Locale} dict={dict} themeToggle />
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

          {guides.length === 0 ? (
            <p className="mt-12 text-muted">{dict.blog.empty}</p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {guides.map((a, i) => (
                <ArticleCard
                  key={a.slug}
                  article={a}
                  locale={locale}
                  dict={dict}
                  color={NEON[i % NEON.length]}
                />
              ))}
            </div>
          )}
        </section>
        <Footer dict={dict} subscribe={locale as Locale} />
      </div>

      <div className="theme-dossier">
        <div className="dx">
          <DossierTabs
            locale={locale}
            dict={dict}
            tabs={innerTabs(locale, dict, "blog")}
            localeHref={`/${locale === "es" ? "en" : "es"}/blog`}
          />
          <DossierFolio
            head={`${dict.dossier.file} · ${dict.dossier.ledger.blogSection}`}
            folio={`${guides.length} ${dict.dossier.ledger.entries}`}
            foot={dict.dossier.ledger.footer}
          >
            <h1>{dict.dossier.ledger.blogSection}</h1>
            <p className="dx-resumen">{dict.blog.subtitle}</p>
            <DossierLedger articles={guides} locale={locale} dict={dict} />
          </DossierFolio>
        </div>
      </div>
    </main>
  );
}
