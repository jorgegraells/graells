import Link from "next/link";
import { getDictionary, siteLinks, type Dictionary, type Locale } from "@/i18n/dictionaries";
import type { PolicyKind } from "@/components/PolicyPage";
import DossierTabs, { innerTabs } from "./DossierTabs";
import DossierFolio from "./DossierFolio";

/** Política editorial o de privacidad en modo expediente: cláusulas numeradas */
export default function DossierPolicy({ locale, dict, kind }: { locale: Locale; dict: Dictionary; kind: PolicyKind }) {
  const t = dict[kind];
  const d = dict.dossier;
  const labels = kind === "privacy" ? d.privacyPage : d.editorialPage;
  const other = getDictionary(locale === "es" ? "en" : "es");
  const updated = "updated" in t ? t.updated : undefined;

  return (
    <div className="dx">
      <DossierTabs locale={locale} dict={dict} tabs={innerTabs(locale, dict, "home")} localeHref={other[kind].href} />
      <DossierFolio
        head={`${d.file} · ${labels.section}`}
        folio={`${t.sections.length} ${labels.clause.toLowerCase()}s`}
        foot={labels.footer}
      >
        <h1 className="dx-doc-title">{t.title}</h1>
        {updated && <p className="dx-lab">{updated}</p>}
        <p className="dx-resumen">{t.intro}</p>
        <ol className="dx-clauses">
          {t.sections.map((s, i) => (
            <li key={s.title}>
              <span className="dx-lab dx-graph">
                {labels.clause} {i + 1}
              </span>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="dx-margin" style={{ marginTop: 20 }}>
          {t.contact} <a href={`mailto:${siteLinks.email}`}>{siteLinks.email}</a>
        </p>
        <p style={{ marginTop: 16 }}>
          <Link className="dx-link" href={dict.aboutPage.href}>
            {dict.aboutPage.title}
          </Link>
        </p>
      </DossierFolio>
    </div>
  );
}
