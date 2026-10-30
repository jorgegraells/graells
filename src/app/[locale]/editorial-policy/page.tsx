import { notFound } from "next/navigation";
import EditorialPage, { editorialMetadata } from "@/components/EditorialPage";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata() {
  return editorialMetadata("en");
}

export default async function EditorialPolicyRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <EditorialPage locale="en" />;
}
