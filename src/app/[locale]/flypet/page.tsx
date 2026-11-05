import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
import { flypetPage, FLYPET_EMAIL, FLYPET_PLAY_URL } from "@/content/flypet";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Página pública de la app Flypet: qué es, capturas, enlace a Play, privacidad y contacto.

const SITE = "https://jorgegraells.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = flypetPage[locale];
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: {
      canonical: `/${locale}/flypet`,
      languages: { es: "/es/flypet", en: "/en/flypet" },
    },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url: `${SITE}/${locale}/flypet`,
      type: "website",
    },
  };
}

export default async function FlypetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const p = flypetPage[locale];

  return (
    <main className="flex-1">
      <Nav locale={locale as Locale} dict={dict} />
      <section className="mx-auto w-full max-w-4xl px-6 pb-24 pt-32">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/flypet/icon.webp"
            width={64}
            height={64}
            alt=""
            className="h-16 w-16 rounded-2xl"
          />
          <h1 className="text-gradient neon-text text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Flypet
          </h1>
        </div>
        <p className="mt-6 text-2xl font-bold text-foreground">{p.tagline}</p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/90">{p.intro}</p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {p.shots.map((shot) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={shot.file}
              src={`/flypet/${locale}/${shot.file}.webp`}
              width={540}
              height={960}
              alt={shot.alt}
              loading="lazy"
              className="h-auto w-full rounded-xl"
            />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground">{p.availabilityHeading}</h2>
          {FLYPET_PLAY_URL ? (
            <a
              href={FLYPET_PLAY_URL}
              className="mt-3 inline-block font-semibold text-foreground underline underline-offset-4"
            >
              {p.playCta}
            </a>
          ) : (
            <p className="mt-3 leading-relaxed text-foreground/80">{p.testing}</p>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-foreground">{p.priceHeading}</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">{p.price}</p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-foreground">{p.makersHeading}</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">{p.makers}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{p.credits}</p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-foreground">{p.privacyHeading}</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">
            <Link
              href={`/${locale}/flypet/privacidad`}
              className="underline underline-offset-4"
            >
              {p.privacyLink}
            </Link>
          </p>
          <p className="mt-2 leading-relaxed text-foreground/80">
            {p.contactLabel}{" "}
            <a href={`mailto:${FLYPET_EMAIL}`} className="underline underline-offset-4">
              {FLYPET_EMAIL}
            </a>
          </p>
        </div>
      </section>
      <Footer dict={dict} />
    </main>
  );
}
