import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n/dictionaries";
import World from "@/components/world/World";

const SITE = "https://jorgegraells.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";
  const title = isEs
    ? "Mundo 3D jugable | Jorge Graells"
    : "Playable 3D world | Jorge Graells";
  const description = isEs
    ? "Recorre la trayectoria y los proyectos de Jorge Graells en un pueblo 3D donde cada aldeano cuenta un proyecto. Hecho con Three.js y React."
    : "Explore Jorge Graells' career and projects in a 3D village where every villager tells the story of a project. Built with Three.js and React.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/world`,
      languages: { es: "/es/world", en: "/en/world" },
    },
    openGraph: {
      title,
      description,
      url: `${SITE}/${locale}/world`,
      type: "website",
      images: [`${SITE}/og.jpg`],
    },
  };
}

export default async function WorldPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <h1 className="sr-only">{dict.world.title}</h1>
      <World locale={locale} dict={dict} />
    </>
  );
}
