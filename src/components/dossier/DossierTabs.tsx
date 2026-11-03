import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import ThemeToggle from "@/components/theme/ThemeToggle";

export type DossierTab = { href: string; label: string; current?: boolean };

/** Pestañas de carpeta del expediente, fijas arriba, con idioma y cambio de modo */
export default function DossierTabs({
  locale,
  dict,
  tabs,
  localeHref,
}: {
  locale: Locale;
  dict: Dictionary;
  tabs: DossierTab[];
  /** Misma página en el otro idioma (por defecto, su portada) */
  localeHref?: string;
}) {
  const t = dict.dossier;
  const otherLocale: Locale = locale === "es" ? "en" : "es";
  return (
    <nav className="dx-tabs dx-lab" aria-label={t.file}>
      {tabs.map((tab) =>
        tab.href.startsWith("#") ? (
          <a key={tab.href} href={tab.href} aria-current={tab.current ? "page" : undefined}>
            {tab.label}
          </a>
        ) : (
          <Link key={tab.href} href={tab.href} aria-current={tab.current ? "page" : undefined}>
            {tab.label}
          </Link>
        ),
      )}
      <div className="dx-tools">
        <span className="dx-cls">{t.classification}</span>
        <Link href={localeHref ?? `/${otherLocale}`} className="dx-tool" aria-label={t.switchLocale}>
          {otherLocale}
        </Link>
        <ThemeToggle to="arcade" dict={dict} className="dx-tool" />
      </div>
    </nav>
  );
}

/** Pestañas de las páginas interiores (blog, noticias, artículos…) */
export function innerTabs(locale: Locale, dict: Dictionary, current: "blog" | "news" | "training"): DossierTab[] {
  const p = dict.dossier.pages;
  return [
    { href: `/${locale}`, label: p.home },
    { href: `/${locale}/blog`, label: p.blog, current: current === "blog" },
    { href: locale === "es" ? "/es/noticias" : "/en/news", label: p.news, current: current === "news" },
    { href: `/${locale}/training`, label: p.training, current: current === "training" },
    { href: `/${locale}#dx-close`, label: p.contact },
  ];
}
