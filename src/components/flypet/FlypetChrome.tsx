import Link from "next/link";
import type { Locale } from "@/i18n/dictionaries";
import { flypetChrome, FLYPET_EMAIL } from "@/content/flypet";

// Cabecera y pie de la página de Flypet (piel de flypet.css). `path` es la ruta sin el idioma.

const LOCALES: Locale[] = ["es", "en"];

export function FlypetHeader({
  locale,
  path = "",
  cta,
}: {
  locale: Locale;
  path?: string;
  /** Botón de la derecha (probadores o Google Play); se esconde en pantallas estrechas */
  cta?: { href: string; label: string; external?: boolean };
}) {
  const c = flypetChrome[locale];
  return (
    <header className="fp-wrap relative z-10 flex items-center justify-between gap-3 pt-5 sm:pt-6">
      <Link href={`/${locale}/flypet`} aria-label={c.home} className="fp-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/flypet/icono-192.webp" width={192} height={192} alt="" className="fp-brand-icon" />
        <span className="fp-brand-name">Flypet</span>
      </Link>
      <div className="flex items-center gap-3">
        {/* (el envoltorio esconde el botón: .fp-btn, sin capa, pisaría la utilidad hidden de Tailwind) */}
        {cta && (
          <span className="hidden sm:block">
            {cta.external ? (
              <a href={cta.href} className="fp-btn fp-btn--small">
                {cta.label}
              </a>
            ) : (
              <Link href={cta.href} className="fp-btn fp-btn--small">
                {cta.label}
              </Link>
            )}
          </span>
        )}
        <nav aria-label={c.switchLabel} className="flex items-center gap-1.5">
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={`/${l}/flypet${path}`}
              hrefLang={l}
              aria-current={l === locale ? "true" : undefined}
              className={l === locale ? "fp-lang fp-lang--on" : "fp-lang"}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function FlypetFooter({ locale }: { locale: Locale }) {
  const c = flypetChrome[locale];
  return (
    <footer className="fp-foot">
      <div className="fp-wrap flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/flypet/icono-192.webp" width={192} height={192} alt="" className="fp-brand-icon" loading="lazy" />
          <p className="leading-relaxed">
            {c.madeBy}{" "}
            <Link href={`/${locale}`} className="fp-link">
              {c.siteLabel}
            </Link>
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href={`/${locale}/flypet/privacidad`} className="fp-link">
              {c.privacy}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/flypet/condiciones`} className="fp-link">
              {c.terms}
            </Link>
          </li>
          <li>
            <a href={`mailto:${FLYPET_EMAIL}`} className="fp-link">
              {c.contact}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
