import { notFound } from "next/navigation";
import SubscribedPage, { subscribedMetadata } from "@/components/SubscribedPage";

export function generateStaticParams() {
  return [{ locale: "es" }];
}

export function generateMetadata() {
  return subscribedMetadata("es");
}

export default async function SuscripcionConfirmadaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  return <SubscribedPage locale="es" />;
}
