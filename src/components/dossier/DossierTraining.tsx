import Image from "next/image";
import { siteLinks, type Dictionary, type Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import DossierTabs, { innerTabs } from "./DossierTabs";
import DossierFolio from "./DossierFolio";
import DossierLedger from "./DossierLedger";

/** /training en modo expediente: programa, tarifas orientativas, fotos y declaraciones */
export default function DossierTraining({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.training;
  const d = dict.dossier.trainingPage;
  const other: Locale = locale === "es" ? "en" : "es";
  const mailto = `mailto:${siteLinks.email}?subject=${encodeURIComponent(t.title)}`;
  const head = `${dict.dossier.file} · ${d.section}`;

  return (
    <div className="dx">
      <DossierTabs locale={locale} dict={dict} tabs={innerTabs(locale, dict, "training")} localeHref={`/${other}/training`} />

      <DossierFolio head={head} folio={`${dict.dossier.folio} 1 ${dict.dossier.of} 2`} foot={d.footer}>
        <h1 className="dx-doc-title">{t.title}</h1>
        <p className="dx-resumen">{t.intro}</p>
        <div className="dx-cols" style={{ marginTop: 18 }}>
          <div>
            <h2>{d.program}</h2>
            <div className="dx-train dx-train--program">
              {t.courses.map((c, i) => (
                <div key={c.name}>
                  <span className="dx-lab dx-graph">
                    {dict.dossier.background.sessionLabel} {i + 1}
                  </span>
                  <h3>{c.name}</h3>
                  <p>{c.tagline}</p>
                  <ul className="dx-check">
                    {c.bullets.map((b) => (
                      <li key={b}>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <aside className="dx-margin">
            <span style={{ display: "block", marginBottom: 6 }}>{d.credentials}</span>
            {t.authority}
          </aside>
        </div>
        <p style={{ marginTop: 16 }}>{t.combinedNote}</p>

        <h2 style={{ marginTop: 28 }}>{t.formatsTitle}</h2>
        <table className="dx-tariff">
          <tbody>
            {t.formats.map((f) => (
              <tr key={f.name}>
                <th scope="row">
                  {f.name}
                  <span className="dx-lab dx-graph">{f.detail}</span>
                </th>
                <td>{f.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="dx-margin" style={{ marginTop: 14 }}>
          {t.priceNote}
        </p>
        <p className="dx-ctas">
          <a className="dx-btn dx-btn--solid" href={mailto}>
            {t.cta}
          </a>
        </p>
      </DossierFolio>

      <DossierFolio head={head} folio={`${dict.dossier.folio} 2 ${dict.dossier.of} 2`} foot={t.photosCaption}>
        <h2>{d.photos}</h2>
        <div className="dx-prints">
          <figure className="dx-print">
            <div className="dx-print-img dx-print-img--tall">
              <Image
                src="/training/formacion-ciberseguridad-1.webp"
                alt={t.photoAlts[0]}
                fill
                sizes="(min-width: 820px) 35vw, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="dx-lab">{d.photoLabel} 1</figcaption>
          </figure>
          <figure className="dx-print dx-print--b">
            <div className="dx-print-img">
              <Image
                src="/training/formacion-ciberseguridad-2.webp"
                alt={t.photoAlts[1]}
                fill
                sizes="(min-width: 820px) 50vw, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="dx-lab">{d.photoLabel} 2</figcaption>
          </figure>
        </div>

        <h2 style={{ marginTop: 30 }}>{d.statements}</h2>
        <div className="dx-statements">
          {t.testimonials.map((q) => (
            <figure key={q.name}>
              <blockquote>«{q.quote}»</blockquote>
              <figcaption className="dx-lab dx-graph">
                {q.name} · {q.role}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 className="dx-ledger-h">{t.articlesTitle}</h2>
        <DossierLedger articles={getArticles(locale).slice(0, 3)} locale={locale} dict={dict} />
      </DossierFolio>
    </div>
  );
}
