import { notFound } from "next/navigation";
import PolicyPage, { policyMetadata } from "@/components/PolicyPage";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata() {
  return policyMetadata("en", "editorial");
}

export default async function EditorialPolicyRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <PolicyPage locale="en" kind="editorial" />;
}
