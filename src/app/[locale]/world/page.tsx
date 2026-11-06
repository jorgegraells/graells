import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import World from "@/components/world/World";
import PlainWorld, { type BoardItem } from "@/components/world/PlainWorld";

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

  // Lo último de la web para el tablón de la plaza
  const articles = getArticles(locale);
  const toItem = (a: (typeof articles)[number]): BoardItem => ({
    title: a.title,
    href: `/${locale}/blog/${a.slug}`,
    kind: a.type === "news" ? "news" : "guide",
    date: a.published,
  });
  const newest = (type: "news" | "guide") =>
    articles
      .filter((a) => (a.type === "news" ? "news" : "guide") === type)
      .sort((a, b) => b.published.localeCompare(a.published))
      .slice(0, 3)
      .map(toItem);
  const board = [...newest("news"), ...newest("guide")];

  return (
    <>
      <h1 className="sr-only">{dict.world.title}</h1>
      {/* Lo mismo en texto: para lectores de pantalla, buscadores y teclado */}
      <div id="world-plain-copy" className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:inset-0 focus-within:z-50 focus-within:overflow-y-auto focus-within:bg-[#0b0d18]">
        <PlainWorld dict={dict} locale={locale} board={board} />
      </div>
      <World locale={locale} dict={dict} board={board} />
    </>
  );
}
