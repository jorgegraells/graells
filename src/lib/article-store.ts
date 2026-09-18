import fs from "node:fs";
import path from "node:path";

/** Almacén de artículos para el panel de administración.
 *
 *  Fuente de verdad: los JSON de `src/content/articles/` en el repo.
 *  - En desarrollo (o sin GITHUB_TOKEN) lee y escribe directo en disco:
 *    cambios visibles al instante con el dev server.
 *  - En producción lee y escribe vía la API de contenidos de GitHub: cada
 *    guardado es un commit a `main`, y Vercel despliega solo (~2 min). */

export type ArticleLocaleData = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  body: string;
};

export type ArticleFile = {
  date: string;
  es: ArticleLocaleData;
  en: ArticleLocaleData;
};

const OWNER = "jorgegraells";
const REPO = "graells";
const BRANCH = "main";
const DIR = "src/content/articles";
const LOCAL_DIR = path.join(process.cwd(), DIR);

function githubToken(): string | null {
  return process.env.GITHUB_TOKEN || null;
}

/** En dev sin token trabajamos contra el disco; con token, contra GitHub. */
function useLocalFs(): boolean {
  return process.env.NODE_ENV === "development" && !githubToken();
}

function ghHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${githubToken()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

const GH = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

export async function listArticleFiles(): Promise<
  { file: string; data: ArticleFile }[]
> {
  if (useLocalFs()) {
    if (!fs.existsSync(LOCAL_DIR)) return [];
    return fs
      .readdirSync(LOCAL_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => ({
        file: f,
        data: JSON.parse(fs.readFileSync(path.join(LOCAL_DIR, f), "utf8")),
      }));
  }
  if (!githubToken()) {
    throw new Error("Falta GITHUB_TOKEN en el entorno");
  }
  const res = await fetch(`${GH}/${DIR}?ref=${BRANCH}`, {
    headers: ghHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} al listar artículos`);
  const entries: { name: string; download_url: string }[] = await res.json();
  const files = entries.filter((e) => e.name.endsWith(".json"));
  return Promise.all(
    files.map(async (e) => {
      const raw = await fetch(e.download_url, { cache: "no-store" });
      if (!raw.ok) throw new Error(`GitHub ${raw.status} al leer ${e.name}`);
      return { file: e.name, data: (await raw.json()) as ArticleFile };
    }),
  );
}

export async function saveArticleFile(
  file: string,
  data: ArticleFile,
): Promise<{ committed: boolean }> {
  const json = JSON.stringify(data, null, 2) + "\n";

  if (useLocalFs()) {
    fs.mkdirSync(LOCAL_DIR, { recursive: true });
    fs.writeFileSync(path.join(LOCAL_DIR, file), json);
    return { committed: false };
  }
  if (!githubToken()) {
    throw new Error("Falta GITHUB_TOKEN en el entorno");
  }

  const filePath = `${GH}/${DIR}/${file}`;
  // Si el archivo ya existe necesitamos su SHA para actualizarlo
  let sha: string | undefined;
  const existing = await fetch(`${filePath}?ref=${BRANCH}`, {
    headers: ghHeaders(),
    cache: "no-store",
  });
  if (existing.ok) sha = (await existing.json()).sha;

  const res = await fetch(filePath, {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify({
      message: `Publica artículo desde el panel: ${data.es.title}`,
      content: Buffer.from(json, "utf8").toString("base64"),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub ${res.status} al guardar: ${detail.slice(0, 200)}`);
  }
  return { committed: true };
}
