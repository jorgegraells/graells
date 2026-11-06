import Link from "next/link";
import { getDictionary, siteLinks, type Dictionary, type Locale } from "@/i18n/dictionaries";
import DossierTabs, { innerTabs } from "./DossierTabs";
import DossierFolio from "./DossierFolio";

/** Política editorial en modo expediente: cláusulas numeradas */
export default function DossierEditorial({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.editorial;
  const d = dict.dossier;
  const other = getDictionary(locale === "es" ? "en" : "es");

  return (
    <div className="dx">
      <DossierTabs locale={locale} dict={dict} tabs={innerTabs(locale, dict, "home")} localeHref={other.editorial.href} />
      <DossierFolio
        head={`${d.file} · ${d.editorialPage.section}`}
        folio={`${t.sections.length} ${d.editorialPage.clause.toLowerCase()}s`}
        foot={d.editorialPage.footer}
      >
        <h1 className="dx-doc-title">{t.title}</h1>
        <p className="dx-resumen">{t.intro}</p>
        <ol className="dx-clauses">
          {t.sections.map((s, i) => (
            <li key={s.title}>
              <span className="dx-lab dx-graph">
                {d.editorialPage.clause} {i + 1}
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
