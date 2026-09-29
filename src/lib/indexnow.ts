/** IndexNow: avisa a Bing (y a quien comparte su índice: ChatGPT Search,
 *  Copilot, DuckDuckGo, Yandex…) de que unas URLs son nuevas o han cambiado.
 *  Google no lo soporta; allí se pide indexación a mano en Search Console.
 *
 *  La clave es pública por diseño: se verifica contra `public/<clave>.txt`. */

export const INDEXNOW_KEY = "f8afc2c879870f8ae7ee50a660940e64";

const HOST = "jorgegraells.com";

export async function pingIndexNow(
  urls: string[],
): Promise<{ ok: boolean; status: number }> {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });
  // 200 = aceptado, 202 = aceptado pendiente de validar la clave
  return { ok: res.status === 200 || res.status === 202, status: res.status };
}
