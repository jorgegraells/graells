import Link from "next/link";
import type { Locale } from "@/i18n/dictionaries";
import { antidopChrome, ANTIDOP_EMAIL } from "@/content/antidop";

// Cabecera y pie de las páginas de ANTIDOP. `path` es la ruta sin el idioma ("" o "/privacidad").

const LOCALES: Locale[] = ["es", "en"];

export function AntidopHeader({ locale, path = "" }: { locale: Locale; path?: string }) {
  const c = antidopChrome[locale];
  return (
    <header className="ad-wrap flex items-center justify-between gap-4 pt-6">
      <Link href={`/${locale}/antidop`} aria-label={c.home} className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/antidop/icon.webp"
          width={192}
          height={192}
          alt=""
          className="h-10 w-10"
          style={{ imageRendering: "pixelated" }}
        />
        <span className="ad-pix text-2xl tracking-[0.12em]">ANTIDOP</span>
      </Link>
      <nav aria-label={c.switchLabel} className="ad-pix flex items-center gap-2 text-base">
        {LOCALES.map((l) => (
          <Link
            key={l}
            href={`/${l}/antidop${path}`}
            hrefLang={l}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? "ad-chip ad-cyan" : "ad-chip ad-muted"}
          >
            {l.toUpperCase()}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function AntidopFooter({ locale, path = "" }: { locale: Locale; path?: string }) {
  const c = antidopChrome[locale];
  return (
    <footer className="ad-wrap pb-12 pt-4">
      <div className="ad-rule" aria-hidden="true" />
      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="ad-muted leading-relaxed">
          {c.madeBy}{" "}
          <Link href={`/${locale}`} className="ad-link">
            {c.siteLabel}
          </Link>
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {path !== "" && (
            <li>
              <Link href={`/${locale}/antidop`} className="ad-link">
                {c.backToApp}
              </Link>
            </li>
          )}
          {path !== "/privacidad" && (
            <li>
              <Link href={`/${locale}/antidop/privacidad`} className="ad-link">
                {c.privacy}
              </Link>
            </li>
          )}
          <li>
            <a href={`mailto:${ANTIDOP_EMAIL}`} className="ad-link">
              {c.contact}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
