import { notFound } from "next/navigation";
import TopicIndex, { topicMetadata } from "@/components/blog/TopicIndex";
import { topicFromSlug, topicParams } from "@/lib/topic-pages";

// Páginas de tema en inglés: /en/blog/topic/<slug> (las castellanas, en /es/blog/tema)
export function generateStaticParams() {
  return topicParams("en");
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; topic: string }> }) {
  const { locale, topic } = await params;
  const id = locale === "en" ? topicFromSlug("en", topic) : undefined;
  return id ? topicMetadata("en", id) : {};
}

export default async function TopicPage({ params }: { params: Promise<{ locale: string; topic: string }> }) {
  const { locale, topic } = await params;
  const id = locale === "en" ? topicFromSlug("en", topic) : undefined;
  if (!id) notFound();
  return <TopicIndex locale="en" id={id} />;
}
