import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { ANTIDOP_EMAIL, antidopPage } from "@/content/antidop";
import { antidopTest } from "@/content/antidop-test";
import { AntidopFooter, AntidopHeader } from "@/components/antidop/AntidopChrome";

// Apuntarse a la prueba cerrada de ANTIDOP: el enlace que se comparte para conseguir probadores.
// Misma estructura que la de Flypet, con la piel de ANTIDOP: gancho, qué hace falta y tres pasos.

const SITE = "https://jorgegraells.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = antidopTest[locale];
  const image = {
    url: `${SITE}/antidop/${locale}/og.jpg`,
    width: 1024,
    height: 500,
    alt: antidopPage[locale].ogAlt,
  };
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: {
      canonical: `/${locale}/antidop/probar`,
      languages: { es: "/es/antidop/probar", en: "/en/antidop/probar" },
    },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url: `${SITE}/${locale}/antidop/probar`,
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: p.metaTitle,
      description: p.metaDescription,
      images: [image],
    },
  };
}

export default async function AntidopTestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = antidopTest[locale];

  return (
    <main className="overflow-x-clip">
      <AntidopHeader locale={locale} path="/probar" />

      <section className="mx-auto w-full max-w-3xl px-5 pb-10 pt-12 sm:px-6 md:pt-16">
        <p className="dop-pix dop-cyan text-base uppercase tracking-[0.2em]">{p.tag}</p>
        <h1 className="dop-pix mt-3 text-4xl leading-[1.15] sm:text-5xl">{p.title}</h1>
        <p className="mt-6 text-lg leading-relaxed">{p.lead}</p>
        <p className="dop-pix dop-cyan mt-5 text-xl leading-snug sm:text-2xl">{p.why}</p>
        <a href="#pasos" className="dop-btn dop-pix mt-7">
          {p.startCta}
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section className="mx-auto w-full max-w-3xl px-5 pb-20 sm:px-6">
        <div className="dop-card mt-6">
          <span className="dop-label dop-pix">{p.needsHeading}</span>
          <ul className="space-y-2">
            {p.needs.map((need) => (
              <li key={need} className="flex gap-3 leading-relaxed">
                <span aria-hidden="true" className="dop-cyan mt-[0.55rem] h-2.5 w-2.5 shrink-0 bg-current" />
                <span>{need}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2 id="pasos" className="dop-pix mt-14 scroll-mt-8 text-3xl">
          {p.stepsHeading}
        </h2>
        <ol className="mt-8 space-y-10">
          {p.steps.map((step, i) => (
            <li key={step.url} className="dop-card">
              <span className="dop-label dop-pix">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="dop-pix text-2xl leading-snug">{step.title}</h3>
              <p className="dop-muted mt-3 leading-relaxed">{step.text}</p>
              <a
                href={step.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dop-btn dop-pix mt-5"
              >
                {step.cta}
                <span aria-hidden="true">↗</span>
                <span className="sr-only">{p.newTab}</span>
              </a>
            </li>
          ))}
        </ol>

        <h2 className="dop-pix mt-14 text-3xl">{p.askHeading}</h2>
        <ul className="mt-5 space-y-3">
          {p.ask.map((item) => (
            <li key={item} className="flex gap-3 text-lg leading-relaxed">
              <span aria-hidden="true" className="dop-cyan mt-[0.6rem] h-2.5 w-2.5 shrink-0 bg-current" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="dop-pix mt-14 text-3xl">{p.faqHeading}</h2>
        <div className="mt-5 space-y-6">
          {p.faq.map((item) => (
            <div key={item.q}>
              <h3 className="dop-pix dop-cyan text-xl">{item.q}</h3>
              <p className="dop-muted mt-1 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <p className="dop-pix dop-gold mt-14 text-2xl">{p.thanks}</p>
        <p className="dop-muted mt-3 leading-relaxed">
          {p.contactLabel}{" "}
          <a href={`mailto:${ANTIDOP_EMAIL}`} className="dop-link">
            {ANTIDOP_EMAIL}
          </a>
        </p>
        <p className="mt-6">
          <Link href={`/${locale}/antidop`} className="dop-link dop-pix">
            <span aria-hidden="true">←</span> {p.backLink}
          </Link>
        </p>
      </section>

      <AntidopFooter locale={locale} path="/probar" />
    </main>
  );
}
