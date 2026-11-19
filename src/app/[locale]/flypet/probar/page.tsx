import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { FLYPET_EMAIL, FLYPET_PLAY_URL, flypetPage } from "@/content/flypet";
import { flypetTest } from "@/content/flypet-test";
import { FlypetFooter, FlypetHeader } from "@/components/flypet/FlypetChrome";

// Apuntarse a la prueba cerrada de Flypet: el enlace que se comparte para conseguir probadores.
// Pensada para leerse en el móvil desde WhatsApp: el gancho, qué hace falta y los tres pasos con su
// botón, en ese orden y sin nada que distraiga entre medias. Con la piel de Flypet (flypet.css):
// crema para el gancho, oro para el premio y lo que hace falta, cian para los pasos y crema al final.

const SITE = "https://jorgegraells.com";

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
    width: 1200,
    height: 630,
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

function Dots({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="fp-body flex gap-3">
          <span aria-hidden="true" className="fp-dot" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function FlypetTestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = flypetTest[locale];
  const [rewardBefore, rewardAfter] = p.reward.text.split(p.reward.highlight);

  return (
    <main className="flypet">
      <section className="fp-sec fp-sec--crema fp-sec--limpia">
        <FlypetHeader locale={locale} path="/probar" />
        <div className="fp-wrap fp-wrap--narrow pb-16 pt-10 md:pt-14">
          <p className="fp-chip fp-chip--tag">{p.tag}</p>
          <h1 className="fp-display mt-5 text-[2.5rem] sm:text-6xl">{p.title}</h1>
          <p className="fp-lead mt-6">{p.lead}</p>
          <p className="mt-5 text-xl font-black leading-snug sm:text-2xl">{p.why}</p>
          <a href="#pasos" className="fp-btn mt-8">
            {p.startCta}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="fp-sec fp-sec--oro">
        <div className="fp-wrap fp-wrap--narrow space-y-10 py-16">
          {/* El premio de los probadores solo se gana antes de la salida: con la app ya publicada, fuera. */}
          {!FLYPET_PLAY_URL && (
            <div className="fp-card">
              <p className="fp-label">
                <span aria-hidden="true">★ </span>
                {p.reward.tag}
              </p>
              <h2 className="fp-display mt-4 text-[1.75rem] sm:text-4xl">{p.reward.heading}</h2>
              <p className="fp-body mt-4">
                {rewardBefore}
                <strong className="fp-strong">{p.reward.highlight}</strong>
                {rewardAfter}
              </p>
              <p className="mt-3 font-black">{p.reward.note}</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-[2fr_3fr] sm:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/flypet/probar/prototipo-1080.webp"
                  srcSet="/flypet/probar/prototipo-540.webp 540w, /flypet/probar/prototipo-1080.webp 1080w"
                  sizes="(min-width: 640px) 270px, calc(100vw - 100px)"
                  width={1080}
                  height={1080}
                  loading="lazy"
                  alt={p.reward.flyAlt}
                  className="fp-photo h-auto w-full"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/flypet/probar/placa-${locale}-1080.webp`}
                  srcSet={`/flypet/probar/placa-${locale}-540.webp 540w, /flypet/probar/placa-${locale}-1080.webp 1080w`}
                  sizes="(min-width: 640px) 410px, calc(100vw - 100px)"
                  width={1080}
                  height={720}
                  loading="lazy"
                  alt={p.reward.plaqueAlt}
                  className="fp-photo h-auto w-full"
                />
              </div>
            </div>
          )}

          <div className="fp-card">
            <h2 className="text-2xl font-black">{p.needsHeading}</h2>
            <Dots items={p.needs} className="mt-4" />
          </div>
        </div>
      </section>

      <section id="pasos" className="fp-sec fp-sec--cian scroll-mt-6">
        <div className="fp-wrap fp-wrap--narrow py-16">
          <h2 className="fp-display text-[2.2rem] sm:text-5xl">{p.stepsHeading}</h2>
          <ol className="mt-8 space-y-6">
            {p.steps.map((step, i) => (
              <li key={step.url} className="fp-card">
                <p className="fp-label">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-2xl font-black">{step.title}</h3>
                <p className="fp-body mt-2">{step.text}</p>
                <a href={step.url} target="_blank" rel="noopener noreferrer" className="fp-btn mt-5">
                  {step.cta}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">{p.newTab}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="fp-sec fp-sec--crema fp-grow">
        <div className="fp-wrap fp-wrap--narrow pb-20 pt-16">
          <h2 className="fp-display text-[2.2rem] sm:text-5xl">{p.askHeading}</h2>
          <Dots items={p.ask} className="mt-6" />

          <h2 className="fp-display mt-14 text-[2.2rem] sm:text-5xl">{p.faqHeading}</h2>
          <div className="fp-card mt-6 space-y-6">
            {p.faq.map((item) => (
              <div key={item.q}>
                <h3 className="text-lg font-black sm:text-xl">{item.q}</h3>
                <p className="fp-body mt-1">{item.a}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-2xl font-black leading-snug">{p.thanks}</p>
          <p className="fp-body mt-3">
            {p.contactLabel}{" "}
            <a href={`mailto:${FLYPET_EMAIL}`} className="fp-link break-all">
              {FLYPET_EMAIL}
            </a>
          </p>
          <p className="mt-8">
            <Link href={`/${locale}/flypet`} className="fp-link">
              <span aria-hidden="true">←</span> {p.backLink}
            </Link>
          </p>
        </div>
      </section>
      <FlypetFooter locale={locale} path="/probar" />
    </main>
  );
}
