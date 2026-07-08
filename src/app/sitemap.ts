import type { MetadataRoute } from "next";
import { locales } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";

const SITE = "https://jorgegraells.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const base: MetadataRoute.Sitemap = [
    {
      url: `${SITE}/es`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: `${SITE}/es`, en: `${SITE}/en` } },
    },
    {
      url: `${SITE}/en`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: `${SITE}/es`, en: `${SITE}/en` } },
    },
    {
      url: `${SITE}/es/world`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: { es: `${SITE}/es/world`, en: `${SITE}/en/world` },
      },
    },
    {
      url: `${SITE}/en/world`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: { es: `${SITE}/es/world`, en: `${SITE}/en/world` },
      },
    },
    {
      url: `${SITE}/es/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: { es: `${SITE}/es/blog`, en: `${SITE}/en/blog` } },
    },
    {
      url: `${SITE}/en/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: { es: `${SITE}/es/blog`, en: `${SITE}/en/blog` } },
    },
  ];

  const articles: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getArticles(locale).map((a) => ({
      url: `${SITE}/${locale}/blog/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  );

  return [...base, ...articles];
}
