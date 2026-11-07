import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
import { flypetTerms } from "@/content/flypet-terms";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Condiciones de uso de la app Flypet: el enlace de la declaración de comerciante de Google Play.

const SITE = "https://jorgegraells.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = flypetTerms[locale];
  return {
    title: p.title,
    description: p.description,
    alternates: {
      canonical: `/${locale}/flypet/condiciones`,
      languages: { es: "/es/flypet/condiciones", en: "/en/flypet/condiciones" },
    },
    openGraph: {
      title: p.title,
      description: p.description,
      url: `${SITE}/${locale}/flypet/condiciones`,
      type: "website",
    },
  };
}

export default async function FlypetTermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const p = flypetTerms[locale];

  return (
    <main className="flex-1">
      <Nav locale={locale as Locale} dict={dict} />
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <h1 className="text-gradient neon-text text-4xl font-black uppercase tracking-tight sm:text-5xl">
          {p.title}
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {p.updated}
        </p>
        <p className="mt-8 text-lg leading-relaxed text-foreground/90">{p.intro}</p>
        {p.sections.map((s) => (
          <div key={s.heading} className="mt-10">
            <h2 className="text-xl font-bold text-foreground">{s.heading}</h2>
            {s.paragraphs.map((text) => (
              <p key={text} className="mt-3 leading-relaxed text-foreground/80">
                {text}
              </p>
            ))}
          </div>
        ))}
        <p className="mt-12 text-sm text-muted">{p.contact}</p>
      </section>
      <Footer dict={dict} />
    </main>
  );
}
