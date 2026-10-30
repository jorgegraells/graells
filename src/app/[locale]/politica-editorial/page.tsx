import { notFound } from "next/navigation";
import EditorialPage, { editorialMetadata } from "@/components/EditorialPage";

export function generateStaticParams() {
  return [{ locale: "es" }];
}

export function generateMetadata() {
  return editorialMetadata("es");
}

export default async function PoliticaEditorialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  return <EditorialPage locale="es" />;
}
