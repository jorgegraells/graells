import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { flypetPrivacy } from "@/content/flypet-privacy";
import FlypetLegal from "@/components/flypet/FlypetLegal";

// Política de privacidad de la app Flypet: el enlace que piden Google Play y la propia app.
// Con la piel de Flypet (FlypetLegal), como la página principal.

const SITE = "https://jorgegraells.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = flypetPrivacy[locale];
  return {
    title: p.title,
    description: p.description,
    alternates: {
      canonical: `/${locale}/flypet/privacidad`,
      languages: { es: "/es/flypet/privacidad", en: "/en/flypet/privacidad" },
    },
    openGraph: {
      title: p.title,
      description: p.description,
      url: `${SITE}/${locale}/flypet/privacidad`,
      type: "website",
    },
  };
}

export default async function FlypetPrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = flypetPrivacy[locale];

  return (
    <FlypetLegal
      locale={locale}
      path="/privacidad"
      title={p.title}
      updated={p.updated}
      intro={p.intro}
      sections={p.sections}
      contact={p.contact}
    />
  );
}
