import { notFound } from "next/navigation";
import NewsIndex, { newsMetadata } from "@/components/blog/NewsIndex";

// Dirección en inglés de la página de noticias (la castellana es /es/noticias)
export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata() {
  return newsMetadata("en");
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <NewsIndex locale="en" />;
}
