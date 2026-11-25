import { NextResponse } from "next/server";
import { getDictionary, isLocale } from "@/i18n/dictionaries";
import { TOPIC_ATTRIBUTE, TOPIC_IDS, isTopic } from "@/content/topics";

/** Alta en el boletín con doble confirmación de Brevo: Brevo manda el correo de
 *  confirmación y el contacto solo entra en la lista al pulsar el enlace, que
 *  luego lleva a la página de "suscripción confirmada". Montaje: docs/BOLETIN.md. */

const SITE = "https://jorgegraells.com";
const BREVO_DOI = "https://api.brevo.com/v3/contacts/doubleOptinConfirmation";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lista y plantilla de confirmación por idioma; la inglesa cae en la castellana si falta
function brevoConfig(locale: "es" | "en") {
  const env = process.env;
  const list = locale === "en" ? env.BREVO_LIST_EN || env.BREVO_LIST_ES : env.BREVO_LIST_ES;
  const template = locale === "en" ? env.BREVO_DOI_TEMPLATE_EN || env.BREVO_DOI_TEMPLATE_ES : env.BREVO_DOI_TEMPLATE_ES;
  if (!env.BREVO_API_KEY || !list || !template) return null;
  return { key: env.BREVO_API_KEY, list: Number(list), template: Number(template) };
}

export async function POST(request: Request) {
  let body: { email?: unknown; locale?: unknown; topics?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Campo trampa relleno: es un bot. Se le contesta como si hubiera ido bien.
  if (typeof body.website === "string" && body.website !== "") return NextResponse.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "es";

  // Temas elegidos: solo ids conocidos y al menos uno. Si no llega el campo
  // (un formulario antiguo en caché), se apunta a todos.
  if (body.topics !== undefined && (!Array.isArray(body.topics) || !body.topics.every(isTopic))) {
    return NextResponse.json({ error: "invalid_topics" }, { status: 400 });
  }
  const topics = body.topics === undefined ? [...TOPIC_IDS] : (body.topics as string[]);
  if (topics.length === 0) return NextResponse.json({ error: "invalid_topics" }, { status: 400 });
  // Un atributo booleano por tema en Brevo (TEMA_CIBER, TEMA_IA, TEMA_IOT): el boletín
  // muestra a cada contacto solo los temas que tiene a true. Montaje: docs/BOLETIN.md.
  const attributes = Object.fromEntries(
    TOPIC_IDS.map((id) => [TOPIC_ATTRIBUTE[id], topics.includes(id)]),
  );

  const config = brevoConfig(locale);
  if (!config) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const res = await fetch(BREVO_DOI, {
    method: "POST",
    headers: { "api-key": config.key, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email,
      attributes,
      includeListIds: [config.list],
      templateId: config.template,
      redirectionUrl: `${SITE}${getDictionary(locale).subscribe.confirmed.href}`,
    }),
  });

  if (res.ok) return NextResponse.json({ ok: true });

  // El detalle va al log de Vercel; al navegador, un error genérico
  console.error("Brevo DOI", res.status, await res.text().catch(() => ""));
  return NextResponse.json({ error: "provider_error" }, { status: 502 });
}
