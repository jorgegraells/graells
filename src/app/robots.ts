import type { MetadataRoute } from "next";

const SITE = "https://jorgegraells.com";

// Los crawlers de IA (búsqueda generativa) se permiten EXPLÍCITAMENTE:
// que ChatGPT, Perplexity, Claude y Gemini puedan leer y citar la web
// es parte de la estrategia GEO del sitio.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "CCBot",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
