import { notFound } from "next/navigation";
import NewsletterPage, { newsletterMetadata } from "@/components/NewsletterPage";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata() {
  return newsletterMetadata("en");
}

export default async function NewsletterRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <NewsletterPage locale="en" />;
}
