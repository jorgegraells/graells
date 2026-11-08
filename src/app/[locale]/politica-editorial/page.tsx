import { notFound } from "next/navigation";
import PolicyPage, { policyMetadata } from "@/components/PolicyPage";

export function generateStaticParams() {
  return [{ locale: "es" }];
}

export function generateMetadata() {
  return policyMetadata("es", "editorial");
}

export default async function PoliticaEditorialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  return <PolicyPage locale="es" kind="editorial" />;
}
