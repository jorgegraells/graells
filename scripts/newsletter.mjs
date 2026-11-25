// Boletín por correo con Brevo. Dos tipos, cada uno con su lista por idioma (una
// persona puede estar en una o en las dos):
//
//   --kind=weekly (por defecto)  Resumen de los últimos 7 días, los viernes
//                                (.github/workflows/newsletter.yml). Lista BREVO_LIST_ES/EN.
//                                Repetir piezas está bien: es un resumen.
//   --kind=alerts                Un correo por noticia marcada con "alert": true, en
//                                cuanto se publica (.github/workflows/alerts.yml).
//                                Lista BREVO_LIST_ES_ALERTS/EN_ALERTS. Se envía solo.
//
// Montaje y variables: docs/BOLETIN.md.
//
// Temas: cada suscriptor elige en la web qué temas recibe (ciberseguridad, IA,
// IoT e industria) y Brevo lo guarda en tres atributos booleanos del contacto
// (TEMA_CIBER, TEMA_IA, TEMA_IOT). Cada pieza va dentro de una condición de Brevo
// y cada contacto solo ve las de sus temas. Sintaxis ({% if contact.X == true %}):
// https://help.brevo.com/hc/en-us/articles/360001030599--Manual-Show-or-hide-content-using-if-statements
//
// El semanal manda a toda la lista (quien no tenga nada de sus temas ve una nota).
// Los avisos no pueden mandar correos vacíos, y una campaña de Brevo no se salta
// contactos: el script elige a quién le toca (los contactos de la lista de avisos con
// algún tema de la noticia), los mete en una lista temporal "tmp-..." en la misma
// carpeta y manda la campaña a esa lista. Las temporales de más de 2 días se borran
// al principio de cada ejecución (borrar la lista no borra los contactos, y mientras
// Brevo envía la campaña la lista tiene que seguir existiendo).
//
// Un aviso no se repite: la campaña se llama "Aviso ES <slug castellano>" y, si ya
// hay una enviada con ese nombre, no se vuelve a mandar. Antes de enviar espera a que
// la página responda, para no enlazar algo que Vercel aún no ha desplegado.
//
// Modos:
//   --dry     solo genera el HTML en la carpeta temporal y dice dónde (no llama a Brevo).
//             Lo pinta como lo vería alguien suscrito a todos los temas; con
//             --topics=iot (o --topics=ia,iot) lo pinta como lo vería quien eligió esos.
//             --template guarda además el HTML que se manda a Brevo, con las condiciones.
//             En los avisos, --slug=<slug-es> fuerza un artículo aunque no lleve "alert".
//   review    (por defecto en el semanal) crea las campañas en borrador y manda una
//             prueba a NEWSLETTER_TEST_EMAIL; Jorge la revisa y la envía desde Brevo
//   --send    crea las campañas y las envía ya. Los avisos siempre envían.
// Opcional: --days=N cambia la ventana del semanal (para probar con más artículos).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SITE = "https://jorgegraells.com";
const API = "https://api.brevo.com/v3";
const REPLY_TO = "dev.graells@gmail.com";
// Semanal: como mucho, las 6 piezas más recientes de cada tema (una pieza de dos temas
// cuenta en los dos); el resto, con un enlace al blog. Así un tema con poco movimiento,
// como IoT, no se queda fuera en una semana cargada de ciberseguridad.
const MAX_PER_TOPIC = 6;
const ARTICLES_DIR = new URL("../src/content/articles/", import.meta.url);
// Plan gratuito de Brevo: 300 correos al día. Por encima de esto, aviso en el log.
const DAILY_LIMIT_WARN = 280;
const TEMP_PREFIX = "tmp-";

// Mismos ids que src/content/topics.ts
const TOPICS = ["ciber", "ia", "iot"];
const ATTRIBUTE = { ciber: "TEMA_CIBER", ia: "TEMA_IA", iot: "TEMA_IOT" };

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const kind = option("kind") ?? process.env.NEWSLETTER_KIND ?? "weekly";
if (!["weekly", "alerts"].includes(kind)) {
  console.error(`--kind tiene que ser weekly o alerts (llegó "${kind}")`);
  process.exit(1);
}
// Los avisos se envían solos; el semanal, en revisión salvo que se pida
const mode = flag("dry")
  ? "dry"
  : kind === "alerts" || flag("send") || process.env.NEWSLETTER_MODE === "send"
    ? "send"
    : "review";
const days = Number(option("days") ?? 7);
const previewTopics = option("topics")?.split(",").filter((t) => TOPICS.includes(t));

const TEXT = {
  es: {
    week: "Ciberseguridad, IA e IoT",
    hello: {
      weekly: "Hola. Esto es lo que he publicado esta semana sobre los temas que elegiste:",
      alerts: "Te escribo ya porque esto es urgente y es de uno de tus temas:",
    },
    kicker: { weekly: "Resumen semanal", alerts: "Aviso urgente" },
    news: "News",
    read: "Leer",
    topicNames: { ciber: "Ciberseguridad", ia: "IA", iot: "IoT e industria" },
    nothing: "Esta semana no he publicado nada de tus temas. Si te apetece, en el blog tienes lo demás que he escrito.",
    toBlog: "Ir al blog",
    why: "Te llega este correo porque te suscribiste en jorgegraells.com.",
    changeTopics: "Cambiar mis preferencias",
    unsubscribe: "Darte de baja",
    privacy: "Privacidad",
    privacyHref: "/es/privacidad",
    subject: {
      weekly: (date) => `Lo de esta semana en jorgegraells.com (${date})`,
      alerts: (title) => `Aviso: ${title}`,
    },
    preview: {
      weekly: "Las guías y noticias de la semana, solo de los temas que elegiste.",
      alerts: "Un aviso urgente de uno de tus temas.",
    },
    rest: "Hay más en el blog",
    date: (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "long", timeZone: "Europe/Madrid" }),
  },
  en: {
    week: "Cybersecurity, AI and IoT",
    hello: {
      weekly: "Hi. Here's what I published this week on the topics you picked:",
      alerts: "I'm writing straight away because this is urgent and it's on one of your topics:",
    },
    kicker: { weekly: "Weekly roundup", alerts: "Urgent alert" },
    news: "News",
    read: "Read",
    topicNames: { ciber: "Cybersecurity", ia: "AI", iot: "IoT and industrial" },
    nothing: "I didn't publish anything on your topics this week. If you fancy it, the rest of what I wrote is on the blog.",
    toBlog: "Go to the blog",
    why: "You're getting this email because you subscribed at jorgegraells.com.",
    changeTopics: "Change my preferences",
    unsubscribe: "Unsubscribe",
    privacy: "Privacy",
    privacyHref: "/en/privacy",
    subject: {
      weekly: (date) => `This week on jorgegraells.com (${date})`,
      alerts: (title) => `Alert: ${title}`,
    },
    preview: {
      weekly: "This week's guides and news, only on the topics you picked.",
      alerts: "An urgent alert on one of your topics.",
    },
    rest: "There's more on the blog",
    date: (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "Europe/Madrid" }),
  },
};

const ENV_SUFFIX = { weekly: "", alerts: "_ALERTS" };
const listFor = (locale) => process.env[`BREVO_LIST_${locale.toUpperCase()}${ENV_SUFFIX[kind]}`];
const UPDATE_FORMS = { es: process.env.BREVO_UPDATE_FORM_ES, en: process.env.BREVO_UPDATE_FORM_EN };
// Prefijo del nombre de cada campaña en Brevo: de él depende no repetir avisos, así
// que no se cambia a la ligera
const NAME = {
  weekly: (locale) => `Boletín ${locale.toUpperCase()} `,
  alerts: (locale) => `Aviso ${locale.toUpperCase()} `,
};

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// `published` puede venir solo con fecha (artículos antiguos): medianoche UTC
const toTime = (iso) => Date.parse(iso.length > 10 ? iso : `${iso}T00:00:00Z`);

// Sin temas en el archivo (artículos antiguos): ciberseguridad, como en la web
const articleTopics = (a) => {
  const t = (a.topics ?? []).filter((x) => TOPICS.includes(x));
  return t.length ? t : ["ciber"];
};

/** Todo lo publicado, en el idioma pedido, del más reciente al más antiguo */
function publishedArticles(locale) {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(new URL(f, ARTICLES_DIR), "utf8")))
    .filter((a) => !a.draft)
    .map((a) => ({
      ...a[locale],
      esSlug: a.es.slug,
      type: a.type,
      alert: a.type === "news" && a.alert === true,
      topics: articleTopics(a),
      published: a.published ?? a.date,
    }))
    .sort((a, b) => toTime(b.published) - toTime(a.published));
}

// Condición de Brevo: "el contacto tiene a true alguno de estos temas"
const anyOf = (topics) => topics.map((t) => `contact.${ATTRIBUTE[t]} == true`).join(" or ");

/** Envuelve `html` para que solo lo vea quien tenga alguno de `topics`.
 *  `forTopics` (vista previa local) resuelve la condición aquí en vez de en Brevo. */
function when(topics, html, forTopics) {
  if (forTopics) return topics.some((t) => forTopics.includes(t)) ? html : "";
  return `{% if ${anyOf(topics)} %}${html}{% endif %}`;
}
function unless(topics, html, forTopics) {
  if (forTopics) return topics.some((t) => forTopics.includes(t)) ? "" : html;
  return `{% if ${anyOf(topics)} %}{% else %}${html}{% endif %}`;
}

function card(locale, a) {
  const t = TEXT[locale];
  const url = `${SITE}/${locale}/blog/${a.slug}`;
  const labels = [
    ...(a.type === "news" ? [`<span style="color:#a3201f">● ${t.news}</span>`] : []),
    ...a.topics.map((x) => esc(t.topicNames[x])),
  ].join(" · ");
  return `<tr><td style="padding:18px 0;border-top:1px solid #e3dccb">
  <span style="display:inline-block;font:700 11px/1 Arial,sans-serif;letter-spacing:1px;color:#6a5d49;text-transform:uppercase;margin-bottom:6px">${labels}</span><br>
  <a href="${url}" style="font:700 19px/1.3 Georgia,serif;color:#14100a;text-decoration:none">${esc(a.title)}</a>
  <p style="margin:8px 0 10px;font:15px/1.55 Arial,sans-serif;color:#463b2c">${esc(a.description)}</p>
  <a href="${url}" style="font:700 13px/1 Arial,sans-serif;color:#2a3f7c">${t.read} →</a>
</td></tr>`;
}

/** Piezas que entran en el semanal: las MAX_PER_TOPIC más recientes de cada tema,
 *  en orden de publicación. Un aviso es una sola pieza. */
function pickItems(items) {
  if (kind !== "weekly") return items;
  const picked = new Set();
  for (const topic of TOPICS) {
    items.filter((a) => a.topics.includes(topic)).slice(0, MAX_PER_TOPIC).forEach((a) => picked.add(a));
  }
  return items.filter((a) => picked.has(a));
}

/** Cuerpo de piezas. Sin `forTopics`, plantilla de Brevo con condiciones; con
 *  `forTopics`, HTML ya resuelto para esos temas (vista previa). */
function buildList(locale, items, forTopics) {
  const t = TEXT[locale];
  const shown = pickItems(items);
  const blog = `${SITE}/${locale}/blog`;
  const restRow = items.length > shown.length
    ? `<tr><td style="padding:18px 0;border-top:1px solid #e3dccb"><a href="${blog}" style="font:700 14px/1 Arial,sans-serif;color:#2a3f7c">${t.rest} →</a></td></tr>`
    : "";

  // Cada pieza, solo para quien tenga alguno de sus temas
  const filtered = shown.map((a) => when(a.topics, card(locale, a), forTopics)).join("\n");

  // Semanal: quien eligió solo temas sin nada esta semana ve una nota en vez de una
  // lista vacía. Los avisos solo llegan a quien sigue el tema, no hace falta.
  const present = TOPICS.filter((x) => shown.some((a) => a.topics.includes(x)));
  const fallback = kind === "weekly" && present.length < TOPICS.length
    ? unless(present, `<tr><td style="padding:18px 0;border-top:1px solid #e3dccb">
  <p style="margin:0 0 10px;font:15px/1.55 Arial,sans-serif;color:#463b2c">${esc(t.nothing)}</p>
  <a href="${blog}" style="font:700 13px/1 Arial,sans-serif;color:#2a3f7c">${t.toBlog} →</a>
</td></tr>`, forTopics)
    : "";

  if (forTopics) return `${filtered}\n${fallback}\n${restRow}`;

  // Un contacto sin ningún tema marcado (dado de alta antes de los temas o a mano
  // en Brevo) recibe todo, como antes
  const all = shown.map((a) => card(locale, a)).join("\n");
  return `{% if ${anyOf(TOPICS)} %}
${filtered}
${fallback}
{% else %}
${all}
{% endif %}
${restRow}`;
}

/** `stamp`: lo que va detrás del prefijo en el nombre de la campaña (fecha del
 *  semanal, slug castellano del aviso). */
function buildEmail(locale, items, forTopics, stamp) {
  const t = TEXT[locale];
  const today = t.date(new Date());
  // Asunto neutro en el semanal: cada contacto ve piezas distintas y el asunto no
  // admite condiciones. El aviso es de una sola pieza: va su título.
  const subject = kind === "alerts" ? t.subject.alerts(items[0].title) : t.subject.weekly(today);
  const preview = t.preview[kind];

  const html = `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#f0e6cf">
<span style="display:none;max-height:0;overflow:hidden">${esc(preview)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0e6cf"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#f7f0de;border:1px solid #c9b994">
<tr><td style="padding:24px 28px 8px">
  <p style="margin:0;font:700 12px/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${kind === "alerts" ? "#a3201f" : "#6a5d49"}">${t.kicker[kind]} · ${today}</p>
  <p style="margin:8px 0 0;font:700 26px/1.2 Georgia,serif;color:#14100a">Jorge Graells</p>
  <p style="margin:16px 0 4px;font:15px/1.55 Arial,sans-serif;color:#2a2318">${t.hello[kind]}</p>
</td></tr>
<tr><td style="padding:0 28px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${buildList(locale, items, forTopics)}
</table></td></tr>
<tr><td style="padding:16px 28px 24px;border-top:1px solid #c9b994">
  <p style="margin:0;font:12px/1.5 Arial,sans-serif;color:#6a5d49">${t.why}
  <a href="{{ update_profile }}" style="color:#6a5d49">${t.changeTopics}</a> ·
  <a href="{{ unsubscribe }}" style="color:#6a5d49">${t.unsubscribe}</a> ·
  <a href="${SITE}${t.privacyHref}" style="color:#6a5d49">${t.privacy}</a></p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  return { subject, preview, html, name: NAME[kind](locale) + stamp };
}

async function brevo(method, endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Brevo ${method} ${endpoint}: ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

/** Campañas clásicas, de la más reciente a la más antigua (hasta 500) */
async function recentCampaigns() {
  const out = [];
  for (let offset = 0; offset < 500; offset += 100) {
    const page = await brevo("GET", `/emailCampaigns?type=classic&limit=100&offset=${offset}&sort=desc`);
    const items = page.campaigns ?? [];
    out.push(...items);
    if (items.length < 100) break;
  }
  return out;
}
const SENT_STATUSES = new Set(["sent", "inProcess", "queued", "in_process"]);

/** Contactos de una lista con sus atributos (paginado) */
async function listContacts(listId) {
  const out = [];
  for (let offset = 0; ; offset += 500) {
    const page = await brevo("GET", `/contacts/lists/${listId}/contacts?limit=500&offset=${offset}`);
    const items = page.contacts ?? [];
    out.push(...items);
    if (items.length < 500) break;
  }
  return out;
}

/** Temas de un contacto. Sin ningún atributo de tema (alta antigua o a mano): todos. */
function contactTopics(c) {
  const attrs = c.attributes ?? {};
  const set = TOPICS.filter((t) => attrs[ATTRIBUTE[t]] === true);
  const anyDefined = TOPICS.some((t) => attrs[ATTRIBUTE[t]] !== undefined);
  return anyDefined ? set : [...TOPICS];
}

/** A quién le toca: contactos de la lista, no bloqueados ni dados de baja de ella,
 *  con algún tema de `items` */
async function recipientsFor(listId, items) {
  const wanted = new Set(items.flatMap((a) => a.topics));
  const contacts = await listContacts(listId);
  return contacts
    .filter((c) => !c.emailBlacklisted && !(c.listUnsubscribed ?? []).includes(Number(listId)))
    .filter((c) => contactTopics(c).some((t) => wanted.has(t)))
    .map((c) => c.email);
}

/** Lista temporal en la carpeta de `baseListId` con `emails` (de 150 en 150) */
async function tempList(baseListId, label, emails) {
  const base = await brevo("GET", `/contacts/lists/${baseListId}`);
  const { id } = await brevo("POST", "/contacts/lists", {
    name: `${TEMP_PREFIX}${label}-${new Date().toISOString()}`,
    folderId: base.folderId,
  });
  for (let i = 0; i < emails.length; i += 150) {
    await brevo("POST", `/contacts/lists/${id}/contacts/add`, { emails: emails.slice(i, i + 150) });
  }
  return id;
}

/** Borra las listas temporales de más de 2 días (ya se habrán enviado sus campañas) */
async function cleanTempLists() {
  const limit = Date.now() - 2 * 24 * 60 * 60 * 1000;
  for (let offset = 0; offset < 1000; offset += 50) {
    const page = await brevo("GET", `/contacts/lists?limit=50&offset=${offset}&sort=desc`);
    const lists = page.lists ?? [];
    for (const l of lists) {
      if (!l.name?.startsWith(TEMP_PREFIX)) continue;
      const created = Date.parse(l.name.slice(l.name.lastIndexOf("-", l.name.length - 25) + 1));
      if (Number.isFinite(created) && created < limit) {
        await brevo("DELETE", `/contacts/lists/${l.id}`);
        console.log(`borrada la lista temporal ${l.name}`);
      }
    }
    if (lists.length < 50) break;
  }
}

/** Correos ya enviados hoy (UTC) por campañas, para avisar antes del límite diario */
async function sentToday() {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const page = await brevo(
    "GET",
    `/emailCampaigns?type=classic&status=sent&statistics=globalStats&limit=100&startDate=${start.toISOString()}&endDate=${new Date().toISOString()}`,
  );
  return (page.campaigns ?? []).reduce((n, c) => n + (c.statistics?.globalStats?.sent ?? 0), 0);
}

/** Espera a que la página responda 200 (Vercel despliega en ~1-2 minutos) */
async function waitLive(url, maxMs = 6 * 60 * 1000) {
  const end = Date.now() + maxMs;
  while (Date.now() < end) {
    const ok = await fetch(url, { method: "HEAD" }).then((r) => r.ok).catch(() => false);
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 20_000));
  }
  return false;
}

/** Crea la campaña y la envía (o deja borrador y prueba, en el semanal de revisión) */
async function createAndSend(locale, email, listIds, recipientCount) {
  if (recipientCount !== undefined) {
    const before = await sentToday().catch(() => null);
    if (before !== null && before + recipientCount > DAILY_LIMIT_WARN) {
      console.warn(`[${locale}] ojo: hoy ya van ${before} correos y este suma ${recipientCount}; el plan gratuito de Brevo para en 300 al día`);
    }
  }
  const { id } = await brevo("POST", "/emailCampaigns", {
    name: email.name,
    subject: email.subject,
    previewText: email.preview,
    sender: { name: "Jorge Graells", email: process.env.BREVO_SENDER_EMAIL },
    replyTo: REPLY_TO,
    htmlContent: email.html,
    recipients: { listIds },
    // Formulario de "Cambiar mis preferencias" ({{ update_profile }}) en el idioma del
    // correo; sin él, Brevo usa su formulario por defecto, que no enseña los temas
    ...(UPDATE_FORMS[locale] ? { updateFormId: UPDATE_FORMS[locale] } : {}),
  });
  console.log(`[${locale}] campaña ${id} creada: ${email.name}`);

  if (mode === "send") {
    await brevo("POST", `/emailCampaigns/${id}/sendNow`);
    console.log(`[${locale}] campaña ${id} enviada${recipientCount !== undefined ? ` a ${recipientCount} personas` : ""}`);
  } else if (process.env.NEWSLETTER_TEST_EMAIL) {
    // La prueba no debe tumbar el trabajo: la campaña ya está en Brevo
    try {
      await brevo("POST", `/emailCampaigns/${id}/sendTest`, { emailTo: [process.env.NEWSLETTER_TEST_EMAIL] });
      console.log(`[${locale}] prueba enviada a ${process.env.NEWSLETTER_TEST_EMAIL}`);
    } catch (e) {
      console.warn(`[${locale}] no se pudo mandar la prueba (la campaña sigue en borrador): ${e.message}`);
    }
  }
  return id;
}

function writePreview(locale, items, stamp, suffix = "") {
  const forTopics = previewTopics?.length ? previewTopics : TOPICS;
  const email = buildEmail(locale, items, forTopics, stamp);
  const topicSuffix = previewTopics?.length ? `-${previewTopics.join("-")}` : "";
  const file = path.join(os.tmpdir(), `boletin-${kind}-${locale}${suffix}${topicSuffix}.html`);
  fs.writeFileSync(file, email.html);
  console.log(`[${locale}] asunto: ${email.subject}`);
  console.log(`[${locale}] vista previa (${forTopics.join(", ")}) en ${file}`);
  if (flag("template")) {
    // El HTML tal cual se manda a Brevo, con las condiciones sin resolver
    const raw = path.join(os.tmpdir(), `boletin-${kind}-${locale}${suffix}-plantilla.html`);
    fs.writeFileSync(raw, buildEmail(locale, items, undefined, stamp).html);
    console.log(`[${locale}] plantilla de Brevo en ${raw}`);
  }
}

const countByTopic = (items) =>
  TOPICS.map((x) => `${x} ${items.filter((a) => a.topics.includes(x)).length}`).join(", ");

// ---------------------------------------------------------------- semanal

async function weekly(locale) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const items = publishedArticles(locale).filter((a) => toTime(a.published) > since);
  if (!items.length) {
    console.log(`[${locale}] nada publicado en los últimos ${days} días: no hay boletín`);
    return 0;
  }
  console.log(`[${locale}] ${items.length} piezas (${countByTopic(items)})`);
  const stamp = new Date().toISOString().slice(0, 10);
  if (mode === "dry") return writePreview(locale, items, stamp), 0;

  // Brevo no deja crear una campaña para una lista vacía (400 "no contacts"):
  // si nadie se ha suscrito aún en este idioma, se salta sin tumbar el otro
  const list = await brevo("GET", `/contacts/lists/${Number(listFor(locale))}`).catch(() => null);
  const subscribers = list?.uniqueSubscribers ?? list?.totalSubscribers;
  if (subscribers === 0) {
    console.log(`[${locale}] la lista ${listFor(locale)} aún no tiene suscriptores: no hay boletín en este idioma`);
    return 0;
  }
  const email = buildEmail(locale, items, undefined, stamp);
  console.log(`[${locale}] asunto: ${email.subject}`);
  await createAndSend(locale, email, [Number(listFor(locale))]);
  return 1;
}

// ---------------------------------------------------------------- avisos

async function alerts(locale, campaigns) {
  const forced = option("slug");
  const since = Date.now() - 48 * 60 * 60 * 1000;
  const candidates = publishedArticles(locale).filter((a) =>
    forced ? a.esSlug === forced : a.alert && toTime(a.published) > since,
  );
  if (!candidates.length) {
    console.log(`[${locale}] ningún aviso urgente publicado en las últimas 48 horas`);
    return 0;
  }
  let sent = 0;
  for (const a of candidates) {
    // El nombre lleva el slug castellano: si ya hay una campaña con él (enviada o en
    // envío), este aviso ya salió. Un borrador que se quedó a medias se reintenta.
    const name = NAME.alerts(locale) + a.esSlug;
    const previous = (campaigns ?? []).filter((c) => c.name === name);
    if (previous.some((c) => SENT_STATUSES.has(c.status))) {
      console.log(`[${locale}] el aviso de ${a.esSlug} ya se envió`);
      continue;
    }
    console.log(`[${locale}] aviso: ${a.title} (${a.topics.join(", ")})`);
    if (mode === "dry") {
      writePreview(locale, [a], a.esSlug, `-${a.esSlug}`);
      continue;
    }
    for (const c of previous) await brevo("DELETE", `/emailCampaigns/${c.id}`).catch(() => {});

    const url = `${SITE}/${locale}/blog/${a.slug}`;
    if (!(await waitLive(url))) {
      console.warn(`[${locale}] ${url} no responde todavía: el aviso se reintentará en la próxima ejecución`);
      continue;
    }
    const listId = Number(listFor(locale));
    const emails = await recipientsFor(listId, [a]);
    if (!emails.length) {
      console.log(`[${locale}] nadie pidió avisos de ${a.topics.join(", ")}: no se envía`);
      continue;
    }
    const temp = await tempList(listId, `aviso-${locale}`, emails);
    await createAndSend(locale, buildEmail(locale, [a], undefined, a.esSlug), [temp], emails.length);
    sent++;
  }
  return sent;
}

// ---------------------------------------------------------------- main

async function main() {
  console.log(`tipo: ${kind}, modo: ${mode}`);
  if (mode !== "dry") {
    // El flujo de avisos corre en cada publicación: sin la lista de avisos montada
    // (o sin clave) no es un error, simplemente aún no hay avisos
    if (kind === "alerts" && (!process.env.BREVO_API_KEY || (!listFor("es") && !listFor("en")))) {
      console.log("los avisos urgentes aún no están montados (falta BREVO_LIST_ES_ALERTS o la clave): nada que hacer");
      return;
    }
    const missing = ["BREVO_API_KEY", "BREVO_SENDER_EMAIL"].filter((k) => !process.env[k]);
    if (!listFor("es") && !listFor("en")) missing.push(`BREVO_LIST_ES${ENV_SUFFIX[kind]}`);
    if (missing.length) throw new Error(`Faltan variables: ${missing.join(", ")} (ver docs/BOLETIN.md)`);
    if (kind === "alerts") await cleanTempLists().catch((e) => console.warn(`no se pudieron limpiar las listas temporales: ${e.message}`));
  }

  // Los avisos miran las campañas anteriores para no repetir
  const campaigns = mode !== "dry" && kind === "alerts" ? await recentCampaigns() : null;

  let done = 0;
  for (const locale of ["es", "en"]) {
    if (mode !== "dry" && !listFor(locale)) {
      console.log(`[${locale}] sin lista configurada para ${kind}, se salta`);
      continue;
    }
    done += kind === "weekly" ? await weekly(locale) : await alerts(locale, campaigns);
  }

  if (mode === "dry") {
    console.log("Para verla como alguien con solo unos temas: --topics=iot o --topics=ia,iot");
  }
  if (mode === "review" && done) {
    console.log("Revisa la prueba y envía la campaña desde Brevo (Campañas > Borradores).");
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
