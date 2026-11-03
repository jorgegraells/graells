import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { Article } from "@/content/articles";

/** Libro de registro: una línea por artículo, con tipo, fecha, título y resumen */
export default function DossierLedger({
  articles,
  locale,
  dict,
}: {
  articles: Article[];
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.dossier.article;
  const fmt = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <ol className="dx-ledger">
      {articles.map((a) => (
        <li key={a.slug}>
          <span className="dx-lab dx-graph">
            {a.type === "news" ? t.news : t.guide}
            <br />
            <time dateTime={a.published}>{fmt.format(new Date(a.published))}</time>
          </span>
          <div>
            <h3>
              <Link href={`/${locale}/blog/${a.slug}`}>{a.title}</Link>
            </h3>
            <p>{a.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
