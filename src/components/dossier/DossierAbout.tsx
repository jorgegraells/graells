import Link from "next/link";
import { getDictionary, siteLinks, socialProfiles, type Dictionary, type Locale } from "@/i18n/dictionaries";
import DossierTabs, { innerTabs } from "./DossierTabs";
import DossierFolio from "./DossierFolio";
import Withheld from "./Withheld";

const CLOSED = /\d{4}\s*-\s*\d{4}/;

/** /sobre-mi en modo expediente: la ficha completa del sujeto */
export default function DossierAbout({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.aboutPage;
  const d = dict.dossier;
  const other = getDictionary(locale === "es" ? "en" : "es");
  const head = `${d.file} · ${d.aboutPage.section}`;

  return (
    <div className="dx">
      <DossierTabs locale={locale} dict={dict} tabs={innerTabs(locale, dict, "home")} localeHref={other.aboutPage.href} />

      <DossierFolio head={head} folio={`${d.folio} 1 ${d.of} 2`} foot={d.subject.footer}>
        <h1>{dict.hero.name}</h1>
        <div className="dx-subject">
          <figure className="dx-photo">
            {/* eslint-disable-next-line @next/next/no-img-element -- PNG de 2 colores ya optimizado */}
            <img src="/jorge-expediente.png" width={240} height={300} alt={d.subject.photoAlt} />
            <figcaption className="dx-lab">{d.subject.photoCaption}</figcaption>
          </figure>
          <div>
            <p className="dx-resumen">{t.headline}</p>
            <dl className="dx-fields">
              <dt className="dx-lab">{d.subject.fields.occupation}</dt>
              <dd>{dict.hero.role}</dd>
              <dt className="dx-lab">{d.subject.fields.specialty}</dt>
              <dd>{d.subject.specialtyValue}</dd>
              <dt className="dx-lab">{d.subject.fields.phone}</dt>
              <dd>
                <Withheld label={d.subject.withheldLabel} tip={d.subject.phoneTip}>
                  {d.subject.withheld}
                </Withheld>
              </dd>
              <dt className="dx-lab">{d.subject.fields.contact}</dt>
              <dd>
                <a href={`mailto:${siteLinks.email}`}>{siteLinks.email}</a>
              </dd>
            </dl>
          </div>
        </div>

        <h2 style={{ marginTop: 26 }}>{d.aboutPage.report}</h2>
        {dict.about.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </DossierFolio>

      <DossierFolio head={head} folio={`${d.folio} 2 ${d.of} 2`} foot={d.close.footer}>
        <div className="dx-cols">
          <div>
            <h2>{t.journeyTitle}</h2>
            <ul className="dx-hist dx-hist--full">
              {dict.journey.items.map((j) => (
                <li key={j.title} className={CLOSED.test(j.period) ? "dx-g35" : ""}>
                  <span className="dx-lab">{j.period}</span>
                  <span>
                    <b>{j.title}</b>
                    <br />
                    <span className="dx-hist-desc">{j.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="dx-margin">{d.background.margin}</p>
        </div>

        <h2 style={{ marginTop: 28 }}>{t.trainingTitle}</h2>
        <ul className="dx-check">
          {t.trainingItems.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 14 }}>
          <Link className="dx-btn" href={`/${locale}/training`}>
            {t.trainingCta}
          </Link>
        </p>

        <h2 style={{ marginTop: 28 }}>{t.writingTitle}</h2>
        <p>{t.writingText}</p>
        <p className="dx-social dx-lab">
          <Link href={`/${locale}/blog`}>{dict.nav.blog}</Link>
          <Link href={dict.editorial.href}>{t.editorialLink}</Link>
        </p>

        <h2 style={{ marginTop: 28 }}>{d.aboutPage.channels}</h2>
        <p className="dx-social dx-lab">
          {socialProfiles.map((p) => (
            <a key={p.href} href={p.href} rel="me noopener noreferrer" target="_blank">
              {p.label}
            </a>
          ))}
          <a href={`mailto:${siteLinks.email}`}>{siteLinks.email}</a>
        </p>
      </DossierFolio>
    </div>
  );
}
