import { notFound } from "next/navigation";
import NewsletterPage, { newsletterMetadata } from "@/components/NewsletterPage";

export function generateStaticParams() {
  return [{ locale: "es" }];
}

export function generateMetadata() {
  return newsletterMetadata("es");
}

export default async function BoletinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  return <NewsletterPage locale="es" />;
}
