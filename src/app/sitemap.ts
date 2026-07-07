import type { MetadataRoute } from "next";

const SITE = "https://jorgegraells.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE}/es`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: `${SITE}/es`, en: `${SITE}/en` } },
    },
    {
      url: `${SITE}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: `${SITE}/es`, en: `${SITE}/en` } },
    },
    {
      url: `${SITE}/es/world`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: { es: `${SITE}/es/world`, en: `${SITE}/en/world` },
      },
    },
    {
      url: `${SITE}/en/world`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: { es: `${SITE}/es/world`, en: `${SITE}/en/world` },
      },
    },
  ];
}
