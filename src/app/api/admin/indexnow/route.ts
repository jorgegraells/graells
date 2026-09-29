import { isAuthenticated } from "@/lib/admin-auth";
import { pingIndexNow } from "@/lib/indexnow";

/** El panel lo llama cuando detecta que el despliegue ya sirve la versión
 *  nueva del artículo (avisar antes haría que Bing rastrease la vieja). */

const URL_RE = /^https:\/\/jorgegraells\.com\/(es|en)\/blog\/[a-z0-9-]+$/;

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  const { urls } = (await request.json().catch(() => ({}))) as { urls?: unknown };
  if (
    !Array.isArray(urls) ||
    urls.length === 0 ||
    urls.some((u) => typeof u !== "string" || !URL_RE.test(u))
  ) {
    return Response.json({ error: "URLs inválidas" }, { status: 400 });
  }
  try {
    const result = await pingIndexNow(urls as string[]);
    return Response.json(result, { status: result.ok ? 200 : 502 });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 502 });
  }
}
