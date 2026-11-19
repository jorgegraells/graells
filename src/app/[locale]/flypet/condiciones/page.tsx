import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { flypetTerms } from "@/content/flypet-terms";
import FlypetLegal from "@/components/flypet/FlypetLegal";

// Condiciones de uso de la app Flypet: el enlace de la declaración de comerciante de Google Play.
// Con la piel de Flypet (FlypetLegal), como la página principal.

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
  const p = flypetTerms[locale];

  return (
    <FlypetLegal
      locale={locale}
      path="/condiciones"
      title={p.title}
      updated={p.updated}
      intro={p.intro}
      sections={p.sections}
      contact={p.contact}
    />
  );
}
