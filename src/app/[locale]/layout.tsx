import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import {
  locales,
  isLocale,
  getDictionary,
  siteLinks,
  type Locale,
} from "@/i18n/dictionaries";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://jorgegraells.com";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";
  const title = isEs
    ? "Jorge Graells — Ingeniero de IA y Desarrollador Full-Stack"
    : "Jorge Graells — AI Engineer & Full-Stack Developer";
  const description = isEs
    ? "Jorge Graells, ingeniero de IA y desarrollador full-stack con 8 años de experiencia. IA aplicada para industria y software regulado: RAG, agentes y LLMs en producción. Disponible para proyectos y colaboraciones. Incluye un currículum jugable en 3D."
    : "Jorge Graells, AI engineer and full-stack developer with 8 years of experience. Applied AI for industry and regulated software: RAG, agents and LLMs in production. Available for projects and collaborations. Featuring a playable 3D résumé.";

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    keywords: isEs
      ? [
          "Jorge Graells",
          "Graells",
          "ingeniero IA",
          "ingeniero de inteligencia artificial",
          "desarrollador full-stack",
          "contratar desarrollador IA",
          "desarrollo de software con IA",
          "RAG",
          "agentes IA",
          "LLM",
          "Next.js",
          "España",
        ]
      : [
          "Jorge Graells",
          "Graells",
          "AI engineer",
          "artificial intelligence engineer",
          "full-stack developer",
          "hire AI developer",
          "AI software development",
          "RAG",
          "AI agents",
          "LLM",
          "Next.js",
          "Spain",
        ],
    authors: [{ name: "Jorge Graells", url: SITE }],
    creator: "Jorge Graells",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", en: "/en" },
    },
    openGraph: {
      title,
      description,
      url: `${SITE}/${locale}`,
      siteName: "Jorge Graells",
      locale: isEs ? "es_ES" : "en_US",
      type: "profile",
      images: [
        {
          url: `${SITE}/og.jpg`,
          width: 1200,
          height: 630,
          alt: "Jorge Graells — AI Engineer & Full-Stack Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/og.jpg`],
    },
  };
}

/** JSON-LD: Person + WebSite + proyectos. Refleja el contenido visible de la
 *  página (regla de Google) y da a los buscadores/IA la entidad "Jorge Graells". */
function buildJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  const isEs = locale === "es";

  const person = {
    "@type": "Person",
    "@id": `${SITE}/#jorge`,
    name: "Jorge Graells",
    jobTitle: isEs
      ? "Ingeniero de IA y Desarrollador Full-Stack"
      : "AI Engineer & Full-Stack Developer",
    description: dict.about.paragraphs[0],
    url: SITE,
    image: `${SITE}/og.jpg`,
    email: `mailto:${siteLinks.email}`,
    sameAs: [siteLinks.github, siteLinks.linkedin],
    nationality: { "@type": "Country", name: isEs ? "España" : "Spain" },
    knowsAbout: [
      "Artificial Intelligence",
      "LLM",
      "RAG",
      "AI agents",
      "Full-stack development",
      "Next.js",
      "React",
      "TypeScript",
      "C++",
      "Cybersecurity",
      "EU Cyber Resilience Act",
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "Jorge Graells",
    inLanguage: isEs ? "es" : "en",
    author: { "@id": `${SITE}/#jorge` },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${SITE}/${locale}#page`,
    url: `${SITE}/${locale}`,
    mainEntity: { "@id": `${SITE}/#jorge` },
    isPartOf: { "@id": `${SITE}/#website` },
  };

  const projects = {
    "@type": "ItemList",
    "@id": `${SITE}/${locale}#projects`,
    name: dict.projects.title,
    itemListElement: dict.projects.items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p.name,
        description: p.description,
        creator: { "@id": `${SITE}/#jorge` },
        ...(p.links?.[0] ? { url: p.links[0].href } : {}),
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage, projects],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale satisfies Locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd(locale)),
          }}
        />
        {children}
      </body>
    </html>
  );
}
