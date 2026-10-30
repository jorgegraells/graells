import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, siteLinks, type Locale } from "@/i18n/dictionaries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/** Página "Sobre mí" (/es/sobre-mi, /en/about): la ficha de autor que Google
 *  usa para reconocer a Jorge como persona (panel de conocimiento) y que
 *  Google Noticias pide para saber quién firma. Las firmas de los artículos
 *  enlazan aquí. */

const SITE = "https://jorgegraells.com";
export const PHOTO = "/jorge-graells.webp";

export function aboutMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const isEs = locale === "es";
  const title = isEs
    ? "Jorge Graells | Ingeniero de IA, desarrollador y formador"
    : "Jorge Graells | AI engineer, developer and trainer";
  const description = isEs
    ? "Quién es Jorge Graells: ingeniero de IA y desarrollador full-stack, responsable de seguridad informática y formador en ciberseguridad e IA para empresas."
    : "Who Jorge Graells is: AI engineer and full-stack developer, IT security lead and cybersecurity and AI trainer for companies.";
  const other = getDictionary(isEs ? "en" : "es");
  return {
    title,
    description,
    alternates: {
      canonical: dict.aboutPage.href,
      languages: { [locale]: dict.aboutPage.href, [isEs ? "en" : "es"]: other.aboutPage.href },
    },
    openGraph: {
      title,
      description,
      url: `${SITE}${dict.aboutPage.href}`,
      type: "profile",
      images: [`${SITE}${PHOTO}`],
    },
  };
}

export default function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.aboutPage;
  const profiles = [
    { label: "LinkedIn", href: siteLinks.linkedin },
    { label: "GitHub", href: siteLinks.github },
    { label: siteLinks.email, href: `mailto:${siteLinks.email}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE}${t.href}`,
    inLanguage: locale,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE}/#jorge`,
      name: "Jorge Graells",
      alternateName: "Graells",
      jobTitle:
        locale === "es"
          ? "Ingeniero de IA y Desarrollador Full-Stack"
          : "AI Engineer & Full-Stack Developer",
      description: dict.about.paragraphs[0],
      image: `${SITE}${PHOTO}`,
      url: SITE,
      email: `mailto:${siteLinks.email}`,
      sameAs: [siteLinks.linkedin, siteLinks.github],
    },
  };

  return (
    <main className="flex-1">
      <Nav locale={locale} dict={dict} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto w-full max-w-4xl px-6 pb-24 pt-32">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-neon-cyan">
          <span className="text-neon-pink">◢</span> {t.tag}
        </p>

        <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-center">
          <div className="clip-corner relative h-40 w-40 shrink-0 overflow-hidden border border-neon-cyan/40">
            <Image src={PHOTO} alt="Jorge Graells" fill sizes="160px" className="object-cover" priority />
          </div>
          <div>
            <h1 className="text-gradient neon-text text-5xl font-black uppercase tracking-tight sm:text-6xl">
              Jorge Graells
            </h1>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-foreground/85">{t.headline}</p>
          </div>
        </div>

        <div className="mt-12 space-y-4 text-base leading-relaxed text-foreground/85">
          {dict.about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <h2 className="mt-14 font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">
          {t.journeyTitle}
        </h2>
        <ol className="mt-5 space-y-5 border-l border-neon-violet/30 pl-6">
          {dict.journey.items.map((j) => (
            <li key={j.title}>
              <p className="font-mono text-xs uppercase tracking-widest text-neon-violet">{j.period}</p>
              <p className="mt-1 font-bold text-foreground/90">{j.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{j.description}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">
          {t.trainingTitle}
        </h2>
        <ul className="mt-5 space-y-2 text-foreground/85">
          {t.trainingItems.map((item) => (
            <li key={item}>
              <span className="mr-2 text-neon-lime">▹</span>
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={`/${locale}/training`}
          className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-neon-cyan hover:underline"
        >
          {t.trainingCta} →
        </Link>

        <h2 className="mt-14 font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">
          {t.writingTitle}
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-foreground/85">{t.writingText}</p>
        <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
          <Link href={`/${locale}/blog`} className="text-neon-cyan hover:underline">
            {dict.nav.blog} →
          </Link>
          <Link href={dict.editorial.href} className="text-neon-cyan hover:underline">
            {t.editorialLink} →
          </Link>
        </p>

        <h2 className="mt-14 font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">
          {t.elsewhereTitle}
        </h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {profiles.map((p) => (
            <li key={p.href}>
              <a
                href={p.href}
                rel={p.href.startsWith("mailto:") ? undefined : "me noopener noreferrer"}
                target={p.href.startsWith("mailto:") ? undefined : "_blank"}
                className="hud-panel clip-corner inline-block px-4 py-2 font-mono text-xs text-foreground/85 transition-colors hover:text-neon-cyan"
              >
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </article>
      <Footer dict={dict} />
    </main>
  );
}
