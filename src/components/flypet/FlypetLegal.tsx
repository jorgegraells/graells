import Link from "next/link";
import type { Locale } from "@/i18n/dictionaries";
import { flypetChrome } from "@/content/flypet";
import { FlypetFooter, FlypetHeader } from "@/components/flypet/FlypetChrome";

// Página de texto legal de Flypet (privacidad y condiciones) con la piel de la app: cabecera y pie
// propios, el título y una tarjeta para leer, con el enlace de vuelta a /flypet arriba y abajo.

export type FlypetLegalSection = { heading: string; paragraphs: string[] };

export default function FlypetLegal({
  locale,
  path,
  title,
  updated,
  intro,
  sections,
  contact,
}: {
  locale: Locale;
  path: string;
  title: string;
  updated: string;
  intro: string;
  sections: FlypetLegalSection[];
  contact: string;
}) {
  const c = flypetChrome[locale];
  return (
    <main className="flypet">
      <section className="fp-sec fp-sec--crema fp-grow">
        <FlypetHeader locale={locale} path={path} />
        <div className="fp-wrap fp-wrap--narrow pb-20 pt-10 md:pt-14">
          <Link href={`/${locale}/flypet`} className="fp-link">
            <span aria-hidden="true">←</span> {c.backToApp}
          </Link>
          <h1 className="fp-display mt-6 text-[2.4rem] sm:text-5xl">{title}</h1>
          <p className="fp-muted mt-4 text-sm font-extrabold">{updated}</p>
          <div className="fp-card mt-8">
            <p className="fp-body">{intro}</p>
            {sections.map((s) => (
              <div key={s.heading} className="mt-9">
                <h2 className="text-xl font-black sm:text-2xl">{s.heading}</h2>
                {s.paragraphs.map((text) => (
                  <p key={text} className="fp-body mt-3">
                    {text}
                  </p>
                ))}
              </div>
            ))}
            <div className="fp-bullet-sep mt-9" aria-hidden="true" />
            <p className="fp-muted mt-5 text-sm leading-relaxed">{contact}</p>
          </div>
          <p className="mt-8">
            <Link href={`/${locale}/flypet`} className="fp-link">
              <span aria-hidden="true">←</span> {c.backToApp}
            </Link>
          </p>
        </div>
      </section>
      <FlypetFooter locale={locale} path={path} />
    </main>
  );
}
