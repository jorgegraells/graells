import { ImageResponse } from "next/og";
import { isLocale } from "@/i18n/dictionaries";
import { getArticle, getAllArticleParams } from "@/content/articles";

/** Imagen social propia de cada artículo (LinkedIn, WhatsApp, X, Google
 *  Discover). Se genera en el build a partir del título y los tags, así que
 *  cada artículo nuevo tiene la suya sin hacer nada. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Jorge Graells";

/** Geist en negrita (la tipografía de la web) desde Google Fonts. Sin agente
 *  de usuario, Google sirve TTF, que es lo que admite ImageResponse. Si la
 *  descarga falla, la imagen se genera igual con la fuente por defecto. */
async function loadBoldFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch("https://fonts.googleapis.com/css2?family=Geist:wght@800")
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return getAllArticleParams();
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = isLocale(locale) ? getArticle(locale, slug) : undefined;
  const title = article?.title ?? "Jorge Graells";
  const tags = (article?.tags ?? []).slice(0, 3);
  const titleSize = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;
  const bold = await loadBoldFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(circle at 85% 15%, rgba(168,85,247,0.35), transparent 45%), radial-gradient(circle at 10% 90%, rgba(34,211,238,0.25), transparent 45%), #07050f",
          color: "#f4f1ff",
          fontFamily: bold ? "Geist" : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 28, letterSpacing: 4 }}>
          <span style={{ color: "#22d3ee", fontWeight: 800 }}>JORGE</span>
          <span style={{ color: "#a59fc4", fontWeight: 800 }}>GRAELLS</span>
          <span style={{ color: "#ec4899", fontWeight: 800 }}>.EXE</span>
          <span style={{ marginLeft: 24, color: "#a59fc4", fontSize: 22 }}>
            {locale === "en" ? "/ BLOG" : "/ ARTÍCULOS"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -1,
            maxWidth: 1050,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  display: "flex",
                  border: "2px solid rgba(34,211,238,0.6)",
                  borderRadius: 999,
                  padding: "6px 18px",
                  fontSize: 22,
                  color: "#22d3ee",
                  textTransform: "uppercase",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#a59fc4" }}>jorgegraells.com</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 10,
            background: "linear-gradient(90deg, #22d3ee, #a855f7, #ec4899)",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: bold ? [{ name: "Geist", data: bold, weight: 800, style: "normal" }] : [],
    },
  );
}
