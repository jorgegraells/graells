import { NextResponse } from "next/server";
import { getDictionary, isLocale } from "@/i18n/dictionaries";
import { TOPIC_ATTRIBUTE, TOPIC_IDS, isTopic } from "@/content/topics";

/** Alta en el boletín con doble confirmación de Brevo: Brevo manda el correo de
 *  confirmación y el contacto solo entra en sus listas al pulsar el enlace, que
 *  luego lleva a la página de "suscripción confirmada". Montaje: docs/BOLETIN.md.
 *
 *  Dos listas por idioma: resumen semanal (BREVO_LIST_ES/EN) y avisos urgentes
 *  (BREVO_LIST_ES_ALERTS/EN_ALERTS). Se puede estar en una o en las dos. Las
 *  inglesas caen en las castellanas si faltan, como siempre. */

const SITE = "https://jorgegraells.com";
const BREVO_DOI = "https://api.brevo.com/v3/contacts/doubleOptinConfirmation";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function listId(locale: "es" | "en", suffix: "" | "_ALERTS"): number | null {
  const env = process.env;
  const raw = locale === "en" ? env[`BREVO_LIST_EN${suffix}`] || env[`BREVO_LIST_ES${suffix}`] : env[`BREVO_LIST_ES${suffix}`];
  return raw ? Number(raw) : null;
}

function brevoConfig(locale: "es" | "en") {
  const env = process.env;
  const template = locale === "en" ? env.BREVO_DOI_TEMPLATE_EN || env.BREVO_DOI_TEMPLATE_ES : env.BREVO_DOI_TEMPLATE_ES;
  const weekly = listId(locale, "");
  if (!env.BREVO_API_KEY || !weekly || !template) return null;
  return { key: env.BREVO_API_KEY, template: Number(template), lists: { weekly, alerts: listId(locale, "_ALERTS") } };
}

export async function POST(request: Request) {
  let body: {
    email?: unknown;
    locale?: unknown;
    topics?: unknown;
    weekly?: unknown;
    alerts?: unknown;
    website?: unknown;
  };
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

  // Qué correos: resumen semanal (sí por defecto) y avisos urgentes (no por defecto).
  // Al menos uno. Un formulario antiguo no manda nada: solo semanal, como antes.
  if (
    (body.weekly !== undefined && typeof body.weekly !== "boolean") ||
    (body.alerts !== undefined && typeof body.alerts !== "boolean")
  ) {
    return NextResponse.json({ error: "invalid_delivery" }, { status: 400 });
  }
  const weekly = body.weekly !== false;
  const alerts = body.alerts === true;
  if (!weekly && !alerts) return NextResponse.json({ error: "invalid_delivery" }, { status: 400 });

  const config = brevoConfig(locale);
  if (!config) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  // Sin lista de avisos montada no se pueden pedir (el formulario ya no los enseña)
  if (alerts && !config.lists.alerts) return NextResponse.json({ error: "invalid_delivery" }, { status: 400 });
  const includeListIds = [
    ...(weekly ? [config.lists.weekly] : []),
    ...(alerts && config.lists.alerts ? [config.lists.alerts] : []),
  ];

  // Un atributo booleano por tema en Brevo (TEMA_CIBER, TEMA_IA, TEMA_IOT): cada
  // correo enseña a cada contacto solo los temas que tiene a true.
  const attributes = Object.fromEntries(
    TOPIC_IDS.map((id) => [TOPIC_ATTRIBUTE[id], topics.includes(id)]),
  );

  const res = await fetch(BREVO_DOI, {
    method: "POST",
    headers: { "api-key": config.key, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email,
      attributes,
      includeListIds,
      templateId: config.template,
      redirectionUrl: `${SITE}${getDictionary(locale).subscribe.confirmed.href}`,
    }),
  });

  if (res.ok) return NextResponse.json({ ok: true });

  // El detalle va al log de Vercel; al navegador, un error genérico
  console.error("Brevo DOI", res.status, await res.text().catch(() => ""));
  return NextResponse.json({ error: "provider_error" }, { status: 502 });
}
