import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, siteLinks, type Locale } from "@/i18n/dictionaries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DossierPolicy from "@/components/dossier/DossierPolicy";

/** Páginas de texto por apartados:
 *  - Política editorial (/es/politica-editorial, /en/editorial-policy): fuentes, noticias
 *    y correcciones, que Google Noticias tiene en cuenta para decidir qué webs muestra.
 *  - Privacidad (/es/privacidad, /en/privacy): qué datos trata la web. Si cambia algo
 *    (analítica, suscripción por correo...), se actualiza aquí antes de publicarlo. */

const SITE = "https://jorgegraells.com";

export type PolicyKind = "editorial" | "privacy";

export function policyMetadata(locale: Locale, kind: PolicyKind): Metadata {
  const doc = getDictionary(locale)[kind];
  const other = getDictionary(locale === "es" ? "en" : "es")[kind];
  const title = `${doc.title} | Jorge Graells`;
  const description = doc.seoDescription ?? doc.intro;
  return {
    title,
    description,
    alternates: {
      canonical: doc.href,
      languages: { [locale]: doc.href, [locale === "es" ? "en" : "es"]: other.href },
    },
    openGraph: { title, description, url: `${SITE}${doc.href}`, type: "website", images: [`${SITE}/og.jpg`] },
  };
}

export default function PolicyPage({ locale, kind }: { locale: Locale; kind: PolicyKind }) {
  const dict = getDictionary(locale);
  const t = dict[kind];
  const updated = "updated" in t ? t.updated : undefined;
  return (
    <main className="flex-1">
      <div className="theme-arcade">
      <Nav locale={locale} dict={dict} themeToggle />
      <article className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-neon-cyan">
          <span className="text-neon-pink">◢</span> {t.tag}
        </p>
        <h1 className="text-gradient neon-text mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
          {t.title}
        </h1>
        {updated && (
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">{updated}</p>
        )}
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
      </div>
      <div className="theme-dossier">
        <DossierPolicy locale={locale} dict={dict} kind={kind} />
      </div>
    </main>
  );
}
