import { notFound } from "next/navigation";
import AboutPage, { aboutMetadata } from "@/components/AboutPage";

export function generateStaticParams() {
  return [{ locale: "es" }];
}

export function generateMetadata() {
  return aboutMetadata("es");
}

export default async function SobreMiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  return <AboutPage locale="es" />;
}
