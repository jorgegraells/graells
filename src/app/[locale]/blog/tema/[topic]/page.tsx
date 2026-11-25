import { notFound } from "next/navigation";
import TopicIndex, { topicMetadata } from "@/components/blog/TopicIndex";
import { topicFromSlug, topicParams } from "@/lib/topic-pages";

// Páginas de tema en castellano: /es/blog/tema/<slug> (las inglesas, en /en/blog/topic)
export function generateStaticParams() {
  return topicParams("es");
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; topic: string }> }) {
  const { locale, topic } = await params;
  const id = locale === "es" ? topicFromSlug("es", topic) : undefined;
  return id ? topicMetadata("es", id) : {};
}

export default async function TemaPage({ params }: { params: Promise<{ locale: string; topic: string }> }) {
  const { locale, topic } = await params;
  const id = locale === "es" ? topicFromSlug("es", topic) : undefined;
  if (!id) notFound();
  return <TopicIndex locale="es" id={id} />;
}
