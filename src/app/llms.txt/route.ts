import fs from "node:fs";
import path from "node:path";
import { getArticles } from "@/content/articles";

/** llms.txt (índice del sitio para LLMs) generado en el build: el texto fijo
 *  vive en `src/content/llms-base.md` y la sección de artículos se rellena
 *  sola con los publicados (los borradores no salen). */

export const dynamic = "force-static";

const SITE = "https://jorgegraells.com";

export function GET() {
  const base = fs.readFileSync(
    path.join(process.cwd(), "src", "content", "llms-base.md"),
    "utf8",
  );
  const articles = getArticles("en")
    .map(
      (a) =>
        `- [${a.title}](${SITE}/en/blog/${a.slug}): ${a.description} Spanish: ${SITE}/es/blog/${a.slugs.es}`,
    )
    .join("\n");
  return new Response(base.replace("{{ARTICLES}}", articles), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
