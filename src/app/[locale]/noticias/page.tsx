import { notFound } from "next/navigation";
import NewsIndex, { newsMetadata } from "@/components/blog/NewsIndex";

// Dirección en castellano de la página de noticias (la inglesa es /en/news)
export function generateStaticParams() {
  return [{ locale: "es" }];
}

export function generateMetadata() {
  return newsMetadata("es");
}

export default async function NoticiasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  return <NewsIndex locale="es" />;
}
