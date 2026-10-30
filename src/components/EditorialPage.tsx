import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, siteLinks, type Locale } from "@/i18n/dictionaries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/** Política editorial (/es/politica-editorial, /en/editorial-policy):
 *  transparencia sobre fuentes, noticias y correcciones, que Google Noticias
 *  tiene en cuenta para decidir qué webs muestra. */

const SITE = "https://jorgegraells.com";

export function editorialMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const other = getDictionary(locale === "es" ? "en" : "es");
  const title = `${dict.editorial.title} | Jorge Graells`;
  return {
    title,
    description: dict.editorial.intro,
    alternates: {
      canonical: dict.editorial.href,
      languages: { [locale]: dict.editorial.href, [locale === "es" ? "en" : "es"]: other.editorial.href },
    },
    openGraph: { title, description: dict.editorial.intro, url: `${SITE}${dict.editorial.href}`, type: "website" },
  };
}

export default function EditorialPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.editorial;
  return (
    <main className="flex-1">
      <Nav locale={locale} dict={dict} />
      <article className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-neon-cyan">
          <span className="text-neon-pink">◢</span> {t.tag}
        </p>
        <h1 className="text-gradient neon-text mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-foreground/85">{t.intro}</p>
        {t.sections.map((s) => (
          <section key={s.title}>
            <h2 className="mt-10 font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">
              {s.title}
            </h2>
            <p className="mt-3 leading-relaxed text-foreground/85">{s.text}</p>
          </section>
        ))}
        <p className="mt-12 border-l-2 border-neon-cyan/50 pl-4 leading-relaxed text-foreground/85">
          {t.contact}{" "}
          <a href={`mailto:${siteLinks.email}`} className="text-neon-cyan underline">
            {siteLinks.email}
          </a>
        </p>
        <Link
          href={dict.aboutPage.href}
          className="mt-10 inline-block font-mono text-xs uppercase tracking-widest text-neon-cyan hover:underline"
        >
          ← {dict.aboutPage.title}
        </Link>
      </article>
      <Footer dict={dict} />
    </main>
  );
}
