import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getDictionary,
  isLocale,
  siteLinks,
  type Locale,
} from "@/i18n/dictionaries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const SITE = "https://jorgegraells.com";

// Colores neón de cada formación (ciberseguridad, IA)
const NEON = ["#22d3ee", "#a855f7"];
// Mínimos en EUR de cada formato, para el JSON-LD (mismo orden que formats)
const MIN_PRICES = [300, 500, 1200, 200];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";
  const title = isEs
    ? "Formación en ciberseguridad e IA para empresas — Jorge Graells"
    : "Cybersecurity & AI corporate training — Jorge Graells";
  const description = isEs
    ? "Sesiones de formación en ciberseguridad e inteligencia artificial para toda la plantilla: buenas prácticas, riesgos reales y uso productivo de la IA. Impartidas por Jorge Graells."
    : "Cybersecurity and artificial intelligence training sessions for the whole team: good practices, real risks and productive AI use. Delivered by Jorge Graells.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/training`,
      languages: { es: "/es/training", en: "/en/training" },
    },
    openGraph: {
      title,
      description,
      url: `${SITE}/${locale}/training`,
      type: "website",
      images: [`${SITE}/training/formacion-ciberseguridad-2.webp`],
    },
  };
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.training;
  const mailto = `mailto:${siteLinks.email}?subject=${encodeURIComponent(t.title)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.title,
    description: t.intro,
    serviceType: "Corporate training",
    inLanguage: locale,
    provider: { "@type": "Person", name: "Jorge Graells", url: SITE },
    areaServed: "ES",
    offers: t.formats.map((f, i) => ({
      "@type": "Offer",
      name: `${f.name} (${f.detail})`,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: MIN_PRICES[i],
        priceCurrency: "EUR",
      },
    })),
  };

  return (
    <main className="flex-1">
      <Nav locale={locale as Locale} dict={dict} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-32">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-neon-cyan">
          <span className="text-neon-pink">◢</span>{" "}
          <span className="text-neon-violet">{t.tag}</span>
        </p>
        <h1 className="text-gradient neon-text mt-3 text-5xl font-black uppercase tracking-tight sm:text-6xl">
          {t.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {t.intro}
        </p>

        {/* Quién lo imparte */}
        <div className="hud-panel clip-corner mt-8 max-w-3xl border-neon-lime/30 p-6">
          <p className="text-sm leading-relaxed text-foreground/85">
            <span className="mr-2 text-neon-lime">★</span>
            {t.authority}
          </p>
        </div>

        {/* Fotos de una sesión real */}
        <div className="mt-10 grid gap-5 sm:grid-cols-5">
          <div className="clip-corner relative aspect-[3/4] overflow-hidden sm:col-span-2">
            <Image
              src="/training/formacion-ciberseguridad-1.webp"
              alt={t.photoAlts[0]}
              fill
              sizes="(min-width: 640px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="clip-corner relative aspect-[4/3] overflow-hidden sm:col-span-3 sm:aspect-auto">
            <Image
              src="/training/formacion-ciberseguridad-2.webp"
              alt={t.photoAlts[1]}
              fill
              sizes="(min-width: 640px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Las dos formaciones */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {t.courses.map((course, i) => {
            const c = NEON[i % NEON.length];
            return (
              <article
                key={course.name}
                className="hud-panel clip-corner flex flex-col p-7"
                style={{ borderColor: `${c}55` }}
              >
                <h2
                  className="text-2xl font-black uppercase tracking-tight"
                  style={{ color: c, textShadow: `0 0 20px ${c}55` }}
                >
                  {course.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-foreground/80">
                  {course.tagline}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {course.bullets.map((b) => (
                    <li key={b} className="text-sm leading-relaxed text-foreground/80">
                      <span className="mr-2" style={{ color: c }}>
                        ▹
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <p className="mt-5 max-w-2xl text-sm text-muted">{t.combinedNote}</p>

        {/* Formatos y tarifas */}
        <h2 className="mt-14 font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">
          {t.formatsTitle}
        </h2>
        <div className="hud-panel clip-corner mt-5 max-w-3xl divide-y divide-white/10">
          {t.formats.map((f) => (
            <div
              key={f.name}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 py-4"
            >
              <div>
                <p className="font-semibold text-foreground/90">{f.name}</p>
                <p className="text-sm text-muted">{f.detail}</p>
              </div>
              <p className="font-mono text-sm font-bold text-neon-lime">
                {f.price}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
          {t.priceNote}
        </p>

        {/* CTA */}
        <div className="mt-9">
          <a
            href={mailto}
            className="btn-neon clip-corner inline-block px-9 py-4 font-black uppercase tracking-wide transition-transform hover:scale-[1.04]"
          >
            ▶ {t.cta}
          </a>
        </div>
      </section>
      <Footer dict={dict} />
    </main>
  );
}
