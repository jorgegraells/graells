import { notFound } from "next/navigation";
import AboutPage, { aboutMetadata } from "@/components/AboutPage";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata() {
  return aboutMetadata("en");
}

export default async function AboutRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <AboutPage locale="en" />;
}
