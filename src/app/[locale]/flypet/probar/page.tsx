import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
import { FLYPET_EMAIL, flypetPage } from "@/content/flypet";
import { flypetTest } from "@/content/flypet-test";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Apuntarse a la prueba cerrada de Flypet: el enlace que se comparte para conseguir probadores.
// Pensada para leerse en el móvil desde WhatsApp: el gancho, qué hace falta y los tres pasos con su
// botón, en ese orden y sin nada que distraiga entre medias.

const SITE = "https://jorgegraells.com";

const BUTTON =
  "btn-neon clip-corner inline-flex items-center gap-3 px-6 py-3 text-sm font-black uppercase tracking-wide transition-transform hover:scale-[1.04]";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = flypetTest[locale];
  const image = {
    url: `${SITE}/flypet/${locale}/og.jpg`,
    width: 1024,
    height: 500,
    alt: flypetPage[locale].ogAlt,
  };
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: {
      canonical: `/${locale}/flypet/probar`,
      languages: { es: "/es/flypet/probar", en: "/en/flypet/probar" },
    },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url: `${SITE}/${locale}/flypet/probar`,
      type: "website",
      siteName: "Jorge Graells",
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

export default async function FlypetTestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const p = flypetTest[locale];

  return (
    <main className="flex-1 overflow-x-clip">
      <Nav locale={locale as Locale} dict={dict} />
      <section className="bg-grid">
        <div className="mx-auto w-full max-w-3xl px-5 pb-10 pt-28 sm:px-6 md:pt-36">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/flypet/icon.webp"
              width={64}
              height={64}
              alt=""
              className="h-11 w-11 rounded-xl"
            />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-neon-pink">
              ◢ {p.tag}
            </span>
          </div>
          <h1 className="text-gradient neon-text mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            {p.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground/90">{p.lead}</p>
          <p className="mt-4 text-xl font-bold text-neon-cyan">{p.why}</p>
          <a href="#pasos" className={`${BUTTON} mt-6`}>
            {p.startCta}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-6">
        <div className="hud-panel clip-corner p-6 sm:p-7">
          <h2 className="text-xl font-bold text-foreground">{p.needsHeading}</h2>
          <ul className="mt-3 space-y-2">
            {p.needs.map((need) => (
              <li key={need} className="leading-relaxed text-foreground/85">
                <span aria-hidden="true" className="text-neon-cyan">▸</span> {need}
              </li>
            ))}
          </ul>
        </div>

        <h2
          id="pasos"
          className="mt-12 scroll-mt-24 text-2xl font-black uppercase tracking-tight text-foreground"
        >
          {p.stepsHeading}
        </h2>
        <ol className="mt-6 space-y-5">
          {p.steps.map((step, i) => (
            <li key={step.url} className="hud-panel clip-corner p-6 sm:p-7">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-neon-pink">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-foreground/80">{step.text}</p>
              <a
                href={step.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BUTTON} mt-5`}
              >
                {step.cta}
                <span aria-hidden="true">↗</span>
                <span className="sr-only">{p.newTab}</span>
              </a>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 text-2xl font-black uppercase tracking-tight text-foreground">
          {p.askHeading}
        </h2>
        <ul className="mt-4 space-y-3">
          {p.ask.map((item) => (
            <li key={item} className="text-lg leading-relaxed text-foreground/90">
              <span aria-hidden="true" className="text-neon-cyan">▸</span> {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl font-black uppercase tracking-tight text-foreground">
          {p.faqHeading}
        </h2>
        <div className="mt-4 space-y-5">
          {p.faq.map((item) => (
            <div key={item.q}>
              <h3 className="font-bold text-foreground">{item.q}</h3>
              <p className="mt-1 leading-relaxed text-foreground/80">{item.a}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xl font-bold text-neon-cyan">{p.thanks}</p>
        <p className="mt-3 leading-relaxed text-foreground/80">
          {p.contactLabel}{" "}
          <a
            href={`mailto:${FLYPET_EMAIL}`}
            className="underline underline-offset-4 hover:text-neon-cyan"
          >
            {FLYPET_EMAIL}
          </a>
        </p>
        <p className="mt-6">
          <Link
            href={`/${locale}/flypet`}
            className="font-mono text-xs font-semibold uppercase tracking-wider text-muted underline underline-offset-4 transition-colors hover:text-neon-cyan"
          >
            <span aria-hidden="true">←</span> {p.backLink}
          </Link>
        </p>
      </section>
      <Footer dict={dict} />
    </main>
  );
}
