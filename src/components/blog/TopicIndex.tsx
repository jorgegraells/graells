import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n/dictionaries";
import { getArticles } from "@/content/articles";
import { TOPIC_IDS, type TopicId } from "@/content/topics";
import { topicFeedPath, topicPath } from "@/lib/topic-pages";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/blog/ArticleCard";
import TopicLinks from "@/components/blog/TopicLinks";
import DossierTabs, { innerTabs } from "@/components/dossier/DossierTabs";
import DossierFolio from "@/components/dossier/DossierFolio";
import DossierLedger from "@/components/dossier/DossierLedger";
import SubscribeForm from "@/components/SubscribeForm";
import { subscribeEnabled } from "@/lib/subscribe";

/** Página de un tema (/es/blog/tema/iot, /en/blog/topic/iot): guías y noticias de
 *  ese tema, de la más reciente a la más antigua, con su RSS y el alta al boletín
 *  con ese tema ya marcado. */

const SITE = "https://jorgegraells.com";
const NEON = ["#c6ff2e", "#22d3ee", "#a855f7", "#ff3d9a"];
const other = (locale: Locale): Locale => (locale === "es" ? "en" : "es");

export function topicMetadata(locale: Locale, id: TopicId): Metadata {
  const t = getDictionary(locale).topics.items[id];
  const path = topicPath(locale, id);
  return {
    title: t.seoTitle,
    description: t.seoDescription,
    alternates: {
      canonical: path,
      languages: { [locale]: path, [other(locale)]: topicPath(other(locale), id) },
      types: { "application/rss+xml": topicFeedPath(locale, id) },
    },
    openGraph: {
      title: t.seoTitle,
      description: t.seoDescription,
      url: `${SITE}${path}`,
      type: "website",
      images: [`${SITE}/og.jpg`],
    },
  };
}

export default function TopicIndex({ locale, id }: { locale: Locale; id: TopicId }) {
  const dict = getDictionary(locale);
  const t = dict.topics.items[id];
  // Las noticias van por hora de publicación, como en la página de noticias
  const articles = getArticles(locale)
    .filter((a) => a.topics.includes(id))
    .sort((a, b) => b.published.localeCompare(a.published));
  const others = TOPIC_IDS.filter((x) => x !== id);
  const feedHref = topicFeedPath(locale, id);
  const subscribeDict = { subscribe: dict.subscribe, privacy: dict.privacy };

  return (
    <main className="flex-1">
      <div className="theme-arcade">
        <Nav locale={locale} dict={dict} themeToggle />
        <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-32">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-neon-lime">
            <span className="text-neon-pink">◢</span> {dict.topics.tag}
          </p>
          <h1 className="text-gradient neon-text mt-3 text-5xl font-black uppercase tracking-tight sm:text-6xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-foreground/85">{t.intro}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <TopicLinks locale={locale} dict={dict} ids={others} variant="arcade" label={dict.topics.otherTopics} />
            <a
              href={feedHref}
              className="font-mono text-[11px] uppercase tracking-widest text-neon-cyan hover:underline"
            >
              {dict.topics.rss}
            </a>
          </div>

          {subscribeEnabled && (
            <div className="mx-auto max-w-3xl">
              <SubscribeForm locale={locale} dict={subscribeDict} variant="arcade" preselect={[id]} />
            </div>
          )}

          {articles.length === 0 ? (
            <p className="mt-12 text-muted">{dict.topics.empty}</p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {articles.map((a, i) => (
                <ArticleCard key={a.slug} article={a} locale={locale} dict={dict} color={NEON[i % NEON.length]} />
              ))}
            </div>
          )}
          <Link
            href={`/${locale}/blog`}
            className="mt-10 inline-block font-mono text-xs uppercase tracking-widest text-neon-cyan hover:underline"
          >
            ← {dict.topics.allArticles}
          </Link>
        </section>
        <Footer dict={dict} />
      </div>

      <div className="theme-dossier">
        <div className="dx">
          <DossierTabs
            locale={locale}
            dict={dict}
            tabs={innerTabs(locale, dict, "blog")}
            localeHref={topicPath(other(locale), id)}
          />
          <DossierFolio
            head={`${dict.dossier.file} · ${t.name}`}
            folio={`${articles.length} ${dict.topics.entries}`}
            foot={dict.dossier.ledger.footer}
          >
            <p className="dx-h1" role="heading" aria-level={1}>{t.title}</p>
            <p className="dx-resumen">{t.intro}</p>
            <TopicLinks locale={locale} dict={dict} ids={others} variant="dossier" label={dict.topics.otherTopics} />
            <p className="dx-topics dx-lab">
              <a href={feedHref}>{dict.topics.rss}</a>
            </p>
            {subscribeEnabled && <SubscribeForm locale={locale} dict={subscribeDict} variant="dossier" preselect={[id]} />}
            {articles.length === 0 ? (
              <p>{dict.topics.empty}</p>
            ) : (
              <DossierLedger articles={articles} locale={locale} dict={dict} />
            )}
          </DossierFolio>
        </div>
      </div>
    </main>
  );
}
