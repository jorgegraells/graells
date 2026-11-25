import { topicParams } from "@/lib/topic-pages";
import { topicFeed } from "@/lib/topic-feed";

// RSS de cada tema en inglés: /en/blog/topic/<slug>/feed.xml
export const dynamic = "force-static";

export function generateStaticParams() {
  return topicParams("en");
}

export function GET(_req: Request, { params }: { params: Promise<{ locale: string; topic: string }> }) {
  return topicFeed("en", params);
}
