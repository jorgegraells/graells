import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/i18n/dictionaries";
import World from "@/components/world/World";

export default async function WorldPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return <World locale={locale} dict={dict} />;
}
