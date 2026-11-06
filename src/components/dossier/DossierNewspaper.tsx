import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { Article } from "@/content/articles";

const LEAD_WORDS = 90;
const PAGE_WORDS = 40;

/** Primeras frases del cuerpo en texto plano. Se salta los avisos de
 *  actualización, que en una portada no se entenderían sin su contexto. */
function excerpt(body: string, words: number): string {
  const sentences: string[] = [];
  for (const block of body.split(/\n\s*\n/)) {
    const text = block.trim();
    if (text.startsWith("#")) break;
    if (!text || text.startsWith("**") || /^[-*\d]/.test(text)) continue;
    const plain = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .replace(/\s+/g, " ");
    sentences.push(...(plain.match(/.+?(?:[.!?]+(?:\s+|$)|$)/g) ?? [plain]));
    if (sentences.join(" ").split(" ").length >= words) break;
  }
  let out = "";
  for (const s of sentences) {
    if (out && out.split(" ").length + s.split(" ").length > words) break;
    out += s;
  }
  return out.trim();
}

/** Cada noticia, como la portada de un periódico sobre la mesa del expediente.
 *  La primera, la más reciente, es la portada grande. */
export default function DossierNewspaper({
  articles,
  locale,
  dict,
}: {
  articles: Article[];
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.dossier.newspaper;
  const tag = locale === "es" ? "es-ES" : "en-GB";
  const fmt = new Intl.DateTimeFormat(tag, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <ol className="dx-np-pile">
      {articles.map((a, i) => {
        const lead = i === 0;
        return (
          <li key={a.slug} className={`dx-np${lead ? " dx-np--lead" : ""}`}>
            <div className="dx-np-name" aria-hidden="true">
              {t.name}
            </div>
            <p className="dx-np-date dx-lab">
              <span>
                {t.issue} {articles.length - i}
              </span>
              <time dateTime={a.published}>{fmt.format(new Date(a.published))}</time>
              <span>{a.readingMinutes} min</span>
            </p>
            <h2 className="dx-np-head">
              <Link href={`/${locale}/blog/${a.slug}`}>{a.title}</Link>
            </h2>
            <p className="dx-np-deck">{a.description}</p>
            <div className="dx-np-text">
              <p>{excerpt(a.body, lead ? LEAD_WORDS : PAGE_WORDS)}</p>
              <p className="dx-np-more dx-lab">{t.more}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
