import Link from "next/link";
import { siteLinks, socialProfiles, type Dictionary, type Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import DossierTabs, { innerTabs } from "./DossierTabs";
import Withheld from "./Withheld";
import SubscribeForm from "@/components/SubscribeForm";
import { subscribeEnabled } from "@/lib/subscribe";

const FOLIOS = 5;
const LETTERS = "ABCDEFGHIJ";
// Una etapa con año de fin está cerrada: se imprime como copia de copia
const CLOSED = /\d{4}\s*-\s*\d{4}/;

function Folio({
  n,
  section,
  anchor,
  id,
  footer,
  dict,
  children,
}: {
  n: number;
  section: string;
  anchor: string;
  id?: string;
  footer: React.ReactNode;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const t = dict.dossier;
  return (
    <article className="dx-folio" id={id} data-anchor={anchor}>
      <div className="dx-fh dx-lab">
        <span>
          {t.file} · {section}
        </span>
        <span>
          {t.folio} {n} {t.of} {FOLIOS}
        </span>
      </div>
      {children}
      <div className="dx-ff dx-lab">
        <span>{footer}</span>
        <span>
          {t.folio} {n}
        </span>
      </div>
    </article>
  );
}

export default function DossierHome({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.dossier;
  const [latest, ...rest] = getArticles(locale);
  const dateFmt = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const kind = (type?: string) => (type === "news" ? t.record.news : t.record.guide);

  return (
    <div className="dx" id="dx-top">
      <DossierTabs locale={locale} dict={dict} tabs={innerTabs(locale, dict, "home")} />

      <Folio n={1} section={t.subject.section} anchor="top" footer={t.subject.footer} dict={dict}>
        <div className="dx-stamp" aria-hidden="true">
          {t.subject.stamp}
          <small>{t.subject.stampSub}</small>
        </div>
        <h1>
          {t.subject.greeting}
          <br />
          {dict.hero.name}
        </h1>
        <div className="dx-subject">
          <figure className="dx-photo">
            {/* eslint-disable-next-line @next/next/no-img-element -- PNG de 2 colores ya optimizado (scripts/dither-photo.mjs) */}
            <img src="/jorge-expediente.png" width={240} height={300} fetchPriority="high" alt={t.subject.photoAlt} />
            <figcaption className="dx-lab">{t.subject.photoCaption}</figcaption>
          </figure>
          <div>
            <dl className="dx-fields">
              <dt className="dx-lab">{t.subject.fields.name}</dt>
              <dd>{dict.hero.name}</dd>
              <dt className="dx-lab">{t.subject.fields.occupation}</dt>
              <dd>{dict.hero.role}</dd>
              <dt className="dx-lab">{t.subject.fields.specialty}</dt>
              <dd>{t.subject.specialtyValue}</dd>
              <dt className="dx-lab">{t.subject.fields.phone}</dt>
              <dd>
                <Withheld label={t.subject.withheldLabel} tip={t.subject.phoneTip}>
                  {t.subject.withheld}
                </Withheld>
              </dd>
              <dt className="dx-lab">{t.subject.fields.address}</dt>
              <dd>
                <Withheld label={t.subject.withheldLabel} tip={t.subject.addressTip}>
                  {t.subject.withheld}
                </Withheld>
              </dd>
              <dt className="dx-lab">{t.subject.fields.contact}</dt>
              <dd>
                <a href={`mailto:${siteLinks.email}`}>{siteLinks.email}</a>
              </dd>
            </dl>
            <div className="dx-lead">
              <p className="dx-lab dx-graph" style={{ margin: "0 0 4px" }}>
                {t.subject.summary}
              </p>
              <p className="dx-resumen">{dict.hero.tagline}</p>
              <div className="dx-ctas">
              <a className="dx-btn dx-btn--solid" href="#dx-annexes">
                {dict.hero.ctaProjects}
              </a>
              <a className="dx-btn" href="#dx-close">
                {dict.hero.ctaContact}
              </a>
                <Link className="dx-link" href={`/${locale}/world`}>
                  {dict.hero.ctaWorld}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Folio>

      <Folio n={2} section={t.report.section} anchor="about" footer={t.report.footer} dict={dict}>
        <div className="dx-cols">
          <div>
            <h2>{t.report.title}</h2>
            <p>
              {t.report.beforeCompany}
              <Withheld className="dx-red--co" label={t.report.companyLabel} tip={t.report.companyTip} />
              {t.report.afterCompany}
            </p>
            <p>{t.report.second}</p>
          </div>
          <div>
            <h2>{t.report.capabilities}</h2>
            <ul className="dx-check">
              {t.report.capabilityItems.map((c) => (
                <li key={c.label}>
                  <span>
                    <b>{c.label}</b> {c.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Folio>

      <Folio
        n={3}
        section={t.annexes.section}
        anchor="projects"
        id="dx-annexes"
        footer={`${t.annexes.footer} A - ${LETTERS[dict.projects.items.length - 1]}`}
        dict={dict}
      >
        <h2>{t.annexes.title}</h2>
        <ul className="dx-annex">
          {dict.projects.items.map((p, i) => (
            <li key={p.slug}>
              <span className="dx-tab" aria-hidden="true">
                {LETTERS[i]}
              </span>
              <div>
                <h3>{p.name}</h3>
                <p className="dx-annex-tag">{p.tagline}</p>
                <p className="dx-annex-desc dx-annex-wide">{p.description}</p>
                <p className="dx-annex-desc dx-annex-wide dx-annex-note">{p.highlight}</p>
                {/* En el móvil, plegada: cinco descripciones enteras hacen la lista larguísima */}
                <details className="dx-annex-more">
                  <summary className="dx-lab">{t.annexes.readMore}</summary>
                  <p className="dx-annex-desc">{p.description}</p>
                  <p className="dx-annex-desc dx-annex-note">{p.highlight}</p>
                </details>
              </div>
              <div>
                <span className="dx-lab">{t.annexes.mediaLabel}</span>
                <span className="dx-st">
                  {p.status}. {p.tech.join(", ")}.
                </span>
              </div>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 16, fontSize: 16 }}>
          <Link href={`/${locale}/world`}>{t.annexes.note}</Link>
        </p>
      </Folio>

      <Folio n={4} section={t.background.section} anchor="journey" footer={t.background.footer} dict={dict}>
        <div className="dx-cols">
          <div>
            <h2>{t.background.title}</h2>
            <ul className="dx-hist">
              {dict.journey.items.map((j) => (
                <li key={j.title} className={CLOSED.test(j.period) ? "dx-g35" : ""}>
                  <span className="dx-lab">{j.period}</span>
                  <span>{j.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="dx-margin">{t.background.margin}</p>
        </div>
        <h2 style={{ marginTop: 30 }}>{t.background.training}</h2>
        <div className="dx-train">
          {dict.training.courses.map((c, i) => (
            <div key={c.name}>
              <span className="dx-lab">
                {t.background.sessionLabel} {i + 1}
              </span>
              <h3>{c.name}</h3>
              <p>{c.tagline}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16 }}>
          <Link className="dx-btn" href={`/${locale}/training`}>
            {t.background.trainingCta}
          </Link>
        </p>
      </Folio>

      <Folio n={5} section={t.record.section} anchor="blog" id="dx-record" footer={t.close.footer} dict={dict}>
        {latest && (
          <div className="dx-open">
            <span className="dx-lab dx-graph">
              {kind(latest.type)} · {dateFmt.format(new Date(latest.published))}
            </span>
            <span className="dx-recv">{t.record.received}</span>
            <h3>
              <Link href={`/${locale}/blog/${latest.slug}`}>{latest.title}</Link>
            </h3>
            <p style={{ fontSize: 17 }}>{latest.description}</p>
          </div>
        )}
        <ul className="dx-log">
          {rest.slice(0, 5).map((a) => (
            <li key={a.slug}>
              <span className="dx-lab">
                {kind(a.type)} · {dateFmt.format(new Date(a.published))}
              </span>
              <Link href={`/${locale}/blog/${a.slug}`}>{a.title}</Link>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 14 }}>
          <Link className="dx-link" href={`/${locale}/blog`}>
            {t.record.all}
          </Link>
        </p>

        <div id="dx-close" data-anchor="contact" style={{ marginTop: 34, scrollMarginTop: "calc(var(--dx-bar) + 16px)" }}>
          <h2>{t.close.title}</h2>
          <p>{t.close.text}</p>
          <p className="dx-mail">
            <a href={`mailto:${siteLinks.email}`}>{siteLinks.email}</a>
          </p>
          <p className="dx-lab dx-social">
            <span>{t.close.social}</span>
            {socialProfiles.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </p>
          {subscribeEnabled && <SubscribeForm locale={locale} dict={{ subscribe: dict.subscribe, privacy: dict.privacy }} variant="dossier" compact />}
          <p className="dx-lab dx-social">
            <Link href={dict.editorial.href}>{dict.editorial.title}</Link>
            <Link href={dict.privacy.href}>{dict.privacy.title}</Link>
            <a href={dict.feed.href}>{dict.footer.rss}</a>
          </p>
        </div>
      </Folio>
    </div>
  );
}
