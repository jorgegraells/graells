import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n/dictionaries";
import { TOPIC_IDS } from "@/content/topics";
import { topicPath } from "@/lib/topic-pages";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SubscribeForm from "@/components/SubscribeForm";
import DossierTabs, { innerTabs } from "@/components/dossier/DossierTabs";
import DossierFolio from "@/components/dossier/DossierFolio";
import { subscribeEnabled, subscribeOptions } from "@/lib/subscribe";

/** Página del boletín (/es/boletin, /en/newsletter): qué llega (resumen semanal y,
 *  si están montados, avisos urgentes), que cada uno elige sus temas, y el alta.
 *  Está enlazada en el menú, en las pestañas del expediente y en el pie. */

const SITE = "https://jorgegraells.com";
const other = (locale: Locale): Locale => (locale === "es" ? "en" : "es");

export function newsletterMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale).newsletterPage;
  const alt = getDictionary(other(locale)).newsletterPage;
  return {
    title: t.seoTitle,
    description: t.seoDescription,
    alternates: {
      canonical: t.href,
      languages: { [locale]: t.href, [other(locale)]: alt.href },
    },
    openGraph: {
      title: t.seoTitle,
      description: t.seoDescription,
      url: `${SITE}${t.href}`,
      type: "website",
      images: [`${SITE}/og.jpg`],
    },
  };
}

export default function NewsletterPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.newsletterPage;
  const altHref = getDictionary(other(locale)).newsletterPage.href;
  const subscribeDict = { subscribe: dict.subscribe, privacy: dict.privacy };
  const kinds = [
    { title: t.weeklyTitle, text: t.weeklyText },
    ...(subscribeOptions.alerts ? [{ title: t.alertsTitle, text: t.alertsText }] : []),
  ];

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
          <p className="mt-6 text-lg leading-relaxed text-foreground/85">{t.intro}</p>

          <div className={`mt-10 grid gap-4 ${kinds.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {kinds.map((k) => (
              <section key={k.title} className="hud-panel clip-corner p-5">
                <h2 className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-neon-cyan">{k.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{k.text}</p>
              </section>
            ))}
          </div>

          <section>
            <h2 className="mt-10 font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">
              {t.topicsTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-foreground/85">{t.topicsText}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {TOPIC_IDS.map((id) => (
                <li key={id}>
                  <Link
                    href={topicPath(locale, id)}
                    className="inline-block rounded-full border border-neon-lime/50 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-neon-lime/90 transition-colors hover:bg-neon-lime/10"
                  >
                    {dict.topics.items[id].name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {subscribeEnabled ? (
            <SubscribeForm locale={locale} dict={subscribeDict} variant="arcade" />
          ) : (
            <p className="mt-12 border-l-2 border-neon-cyan/50 pl-4 leading-relaxed text-foreground/85">
              {t.comingSoon}{" "}
              <a href={dict.feed.href} className="text-neon-cyan underline">
                {dict.footer.rss}
              </a>
            </p>
          )}

          <p className="mt-8 text-sm leading-relaxed text-muted">
            {t.privacyText}{" "}
            <Link href={dict.privacy.href} className="text-neon-cyan underline">
              {dict.privacy.title.toLowerCase()}
            </Link>
            .
          </p>
        </article>
        <Footer dict={dict} />
      </div>

      <div className="theme-dossier">
        <div className="dx">
          <DossierTabs locale={locale} dict={dict} tabs={innerTabs(locale, dict, "newsletter")} localeHref={altHref} />
          <DossierFolio head={`${dict.dossier.file} · ${t.section}`} folio={t.tag} foot={t.footer}>
            <p className="dx-doc-title dx-h1" role="heading" aria-level={1}>
              {t.title}
            </p>
            <p className="dx-resumen">{t.intro}</p>
            {kinds.map((k) => (
              <section key={k.title}>
                <h2>{k.title}</h2>
                <p>{k.text}</p>
              </section>
            ))}
            <section>
              <h2>{t.topicsTitle}</h2>
              <p>{t.topicsText}</p>
              <p className="dx-topics dx-lab">
                {TOPIC_IDS.map((id, i) => (
                  <span key={id}>
                    {i > 0 && " · "}
                    <Link href={topicPath(locale, id)}>{dict.topics.items[id].name}</Link>
                  </span>
                ))}
              </p>
            </section>
            {subscribeEnabled ? (
              <SubscribeForm locale={locale} dict={subscribeDict} variant="dossier" />
            ) : (
              <p className="dx-margin" style={{ marginTop: 20 }}>
                {t.comingSoon} <a href={dict.feed.href}>{dict.footer.rss}</a>
              </p>
            )}
            <p className="dx-lab" style={{ marginTop: 16 }}>
              {t.privacyText} <Link href={dict.privacy.href}>{dict.privacy.title.toLowerCase()}</Link>.
            </p>
          </DossierFolio>
        </div>
      </div>
    </main>
  );
}
