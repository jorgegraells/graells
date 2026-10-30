import { isAuthenticated } from "@/lib/admin-auth";
import {
  listArticleFiles,
  saveArticleFile,
  deleteDraftFile,
  type ArticleFile,
  type ArticleLocaleData,
} from "@/lib/article-store";

/** API del panel: GET lista los artículos completos, POST guarda/publica uno. */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function invalidLocale(d: unknown): string | null {
  const a = d as ArticleLocaleData;
  if (!a || typeof a !== "object") return "faltan datos";
  if (typeof a.slug !== "string" || !SLUG_RE.test(a.slug))
    return "slug inválido (minúsculas, números y guiones)";
  if (typeof a.title !== "string" || a.title.trim().length < 5)
    return "título demasiado corto";
  if (typeof a.description !== "string" || a.description.trim().length < 20)
    return "descripción demasiado corta";
  if (
    a.seoDescription !== undefined &&
    (typeof a.seoDescription !== "string" || a.seoDescription.length > 170)
  )
    return "descripción para Google de más de 170 caracteres";
  if (!Array.isArray(a.tags) || a.tags.some((t) => typeof t !== "string"))
    return "tags inválidos";
  if (typeof a.body !== "string" || a.body.trim().length < 100)
    return "cuerpo demasiado corto";
  return null;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const files = await listArticleFiles();
    return Response.json({ articles: files });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  const payload = (await request.json().catch(() => null)) as {
    file?: string;
    data?: ArticleFile;
    /** false = guardar como borrador (no sale en la web). Por defecto publica. */
    publish?: boolean;
  } | null;
  const data = payload?.data;
  if (!data || !DATE_RE.test(data.date ?? "")) {
    return Response.json({ error: "Fecha inválida (AAAA-MM-DD)" }, { status: 400 });
  }
  for (const locale of ["es", "en"] as const) {
    const problem = invalidLocale(data[locale]);
    if (problem) {
      return Response.json(
        { error: `Versión ${locale.toUpperCase()}: ${problem}` },
        { status: 400 },
      );
    }
  }
  // El archivo se nombra por el slug ES; al editar se conserva el original
  const file = payload.file || `${data.es.slug}.json`;
  if (!/^[a-z0-9-]+\.json$/.test(file)) {
    return Response.json({ error: "Nombre de archivo inválido" }, { status: 400 });
  }
  // Cada guardado es una edición: alimenta dateModified y el sitemap
  const updated = new Date().toISOString();
  const urls = (["es", "en"] as const).map(
    (l) => `https://jorgegraells.com/${l}/blog/${data[l].slug}`,
  );
  const publish = payload.publish !== false;
  const record: ArticleFile = {
    date: data.date,
    updated,
    // Al publicar un borrador queda sellada la hora exacta de publicación
    ...(publish && (data.draft || !payload.file)
      ? { published: updated }
      : data.published
        ? { published: data.published }
        : {}),
    ...(data.type === "news" ? { type: "news" as const } : {}),
    ...(publish ? {} : { draft: true }),
    es: data.es,
    en: data.en,
  };
  try {
    const { committed } = await saveArticleFile(file, record);
    return Response.json({ ok: true, committed, file, updated, urls, publish });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  const { file } = (await request.json().catch(() => ({}))) as { file?: string };
  if (!file || !/^[a-z0-9-]+.json$/.test(file)) {
    return Response.json({ error: "Nombre de archivo inválido" }, { status: 400 });
  }
  try {
    const { committed } = await deleteDraftFile(file);
    return Response.json({ ok: true, committed });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 400 });
  }
}
