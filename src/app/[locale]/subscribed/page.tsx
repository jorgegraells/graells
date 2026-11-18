import { notFound } from "next/navigation";
import SubscribedPage, { subscribedMetadata } from "@/components/SubscribedPage";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata() {
  return subscribedMetadata("en");
}

export default async function SubscribedRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <SubscribedPage locale="en" />;
}
