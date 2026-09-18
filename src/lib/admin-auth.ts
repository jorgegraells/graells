import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** Autenticación del panel de administración: un solo usuario (Jorge), una
 *  contraseña en la variable de entorno ADMIN_PASSWORD y una cookie de sesión
 *  firmada con HMAC derivado de esa contraseña. Cambiar la contraseña
 *  invalida todas las sesiones. */

export const SESSION_COOKIE = "admin_session";

function secret(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function sessionToken(): string {
  return createHmac("sha256", secret()!).update("admin-session-v1").digest("hex");
}

/** Comparación a tiempo constante para no filtrar información por timing. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function checkPassword(password: string): boolean {
  const s = secret();
  return s !== null && safeEqual(password, s);
}

export async function isAuthenticated(): Promise<boolean> {
  if (!secret()) return false;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return !!token && safeEqual(token, sessionToken());
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
