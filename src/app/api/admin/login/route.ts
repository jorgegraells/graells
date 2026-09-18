import {
  checkPassword,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/admin-auth";

/** Sesión del panel: POST inicia con contraseña, GET consulta, DELETE cierra. */

export async function GET() {
  return Response.json({ authenticated: await isAuthenticated() });
}

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !checkPassword(password)) {
    return Response.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  await createSession();
  return Response.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return Response.json({ ok: true });
}
