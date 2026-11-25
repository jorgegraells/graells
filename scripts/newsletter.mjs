// Resumen semanal del boletín: junta lo publicado en los últimos 7 días y prepara
// en Brevo una campaña por idioma. Lo lanza GitHub Actions los viernes
// (.github/workflows/newsletter.yml). Montaje y variables: docs/BOLETIN.md.
//
// Temas: cada suscriptor elige en la web qué temas recibe (ciberseguridad, IA,
// IoT e industria) y Brevo lo guarda en tres atributos booleanos del contacto
// (TEMA_CIBER, TEMA_IA, TEMA_IOT). Sigue habiendo una sola campaña por idioma:
// cada pieza va dentro de una condición de Brevo y cada contacto solo ve las de
// sus temas. Sintaxis de las condiciones ({% if contact.X == true %}):
// https://help.brevo.com/hc/en-us/articles/360001030599--Manual-Show-or-hide-content-using-if-statements
//
// Modos:
//   --dry     solo genera el HTML en la carpeta temporal y dice dónde (no llama a Brevo).
//             Lo pinta como lo vería alguien suscrito a todos los temas; con
//             --topics=iot (o --topics=ia,iot) lo pinta como lo vería quien eligió esos.
//             --template guarda además el HTML que se manda a Brevo, con las condiciones.
//   review    (por defecto) crea las campañas en borrador y manda una prueba a
//             NEWSLETTER_TEST_EMAIL; Jorge la revisa y la envía desde Brevo
//   --send    crea las campañas y las envía ya. Solo cuando Jorge lo decida.
// Opcional: --days=N cambia la ventana (para probar con más artículos).
// Si no hay nada publicado en la ventana, no se prepara nada.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SITE = "https://jorgegraells.com";
const API = "https://api.brevo.com/v3";
const REPLY_TO = "dev.graells@gmail.com";
// Como mucho, las 6 piezas más recientes de cada tema (una pieza de dos temas cuenta
// en los dos); el resto, con un enlace al blog. Así un tema con poco movimiento,
// como IoT, no se queda fuera en una semana cargada de ciberseguridad.
const MAX_PER_TOPIC = 6;
const ARTICLES_DIR = new URL("../src/content/articles/", import.meta.url);

// Mismos ids que src/content/topics.ts
const TOPICS = ["ciber", "ia", "iot"];
const ATTRIBUTE = { ciber: "TEMA_CIBER", ia: "TEMA_IA", iot: "TEMA_IOT" };

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const mode = flag("dry") ? "dry" : flag("send") ? "send" : (process.env.NEWSLETTER_MODE === "send" ? "send" : "review");
const days = Number(option("days") ?? 7);
const previewTopics = option("topics")?.split(",").filter((t) => TOPICS.includes(t));

const TEXT = {
  es: {
    week: "Ciberseguridad, IA e IoT",
    hello: "Hola. Esto es lo que he publicado esta semana sobre los temas que elegiste:",
    news: "News",
    read: "Leer",
    topicNames: { ciber: "Ciberseguridad", ia: "IA", iot: "IoT e industria" },
    nothing: "Esta semana no he publicado nada de tus temas. Si te apetece, en el blog tienes lo demás que he escrito.",
    toBlog: "Ir al blog",
    why: "Te llega este correo porque te suscribiste en jorgegraells.com.",
    changeTopics: "Cambiar mis temas",
    unsubscribe: "Darte de baja",
    privacy: "Privacidad",
    privacyHref: "/es/privacidad",
    subject: (date) => `Lo de esta semana en jorgegraells.com (${date})`,
    preview: "Las guías y noticias de la semana, solo de los temas que elegiste.",
    rest: "Hay más en el blog",
    date: (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "long", timeZone: "Europe/Madrid" }),
  },
  en: {
    week: "Cybersecurity, AI and IoT",
    hello: "Hi. Here's what I published this week on the topics you picked:",
    news: "News",
    read: "Read",
    topicNames: { ciber: "Cybersecurity", ia: "AI", iot: "IoT and industrial" },
    nothing: "I didn't publish anything on your topics this week. If you fancy it, the rest of what I wrote is on the blog.",
    toBlog: "Go to the blog",
    why: "You're getting this email because you subscribed at jorgegraells.com.",
    changeTopics: "Change my topics",
    unsubscribe: "Unsubscribe",
    privacy: "Privacy",
    privacyHref: "/en/privacy",
    subject: (date) => `This week on jorgegraells.com (${date})`,
    preview: "This week's guides and news, only on the topics you picked.",
    rest: "There's more on the blog",
    date: (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "Europe/Madrid" }),
  },
};

const LISTS = { es: process.env.BREVO_LIST_ES, en: process.env.BREVO_LIST_EN };
const UPDATE_FORMS = { es: process.env.BREVO_UPDATE_FORM_ES, en: process.env.BREVO_UPDATE_FORM_EN };

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// `published` puede venir solo con fecha (artículos antiguos): medianoche UTC
const toTime = (iso) => Date.parse(iso.length > 10 ? iso : `${iso}T00:00:00Z`);

// Sin temas en el archivo (artículos antiguos): ciberseguridad, como en la web
const articleTopics = (a) => {
  const t = (a.topics ?? []).filter((x) => TOPICS.includes(x));
  return t.length ? t : ["ciber"];
};

function recentArticles(locale) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(new URL(f, ARTICLES_DIR), "utf8")))
    .filter((a) => !a.draft)
    .map((a) => ({ ...a[locale], type: a.type, topics: articleTopics(a), published: a.published ?? a.date }))
    .filter((a) => toTime(a.published) > since)
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

/** Piezas que entran en el correo: las MAX_PER_TOPIC más recientes de cada tema,
 *  en orden de publicación. */
function pickItems(items) {
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

  // Quien eligió solo temas sin nada esta semana ve una nota en vez de una lista vacía
  const present = TOPICS.filter((x) => shown.some((a) => a.topics.includes(x)));
  const fallback = present.length < TOPICS.length
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

function buildEmail(locale, items, forTopics) {
  const t = TEXT[locale];
  const today = t.date(new Date());
  // Asunto neutro: cada contacto ve piezas distintas y el asunto no admite condiciones
  const subject = t.subject(today);
  const preview = t.preview;

  const html = `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#f0e6cf">
<span style="display:none;max-height:0;overflow:hidden">${esc(preview)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0e6cf"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#f7f0de;border:1px solid #c9b994">
<tr><td style="padding:24px 28px 8px">
  <p style="margin:0;font:700 12px/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#6a5d49">${t.week} · ${today}</p>
  <p style="margin:8px 0 0;font:700 26px/1.2 Georgia,serif;color:#14100a">Jorge Graells</p>
  <p style="margin:16px 0 4px;font:15px/1.55 Arial,sans-serif;color:#2a2318">${t.hello}</p>
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

  return { subject, preview, html, name: `Boletín ${locale.toUpperCase()} ${new Date().toISOString().slice(0, 10)}` };
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

async function main() {
  if (mode !== "dry") {
    const missing = ["BREVO_API_KEY", "BREVO_SENDER_EMAIL", "BREVO_LIST_ES"].filter((k) => !process.env[k]);
    if (missing.length) throw new Error(`Faltan variables: ${missing.join(", ")} (ver docs/BOLETIN.md)`);
  }

  let prepared = 0;
  for (const locale of ["es", "en"]) {
    if (mode !== "dry" && !LISTS[locale]) {
      console.log(`[${locale}] sin lista configurada, se salta`);
      continue;
    }
    const items = recentArticles(locale);
    if (!items.length) {
      console.log(`[${locale}] nada publicado en los últimos ${days} días: no hay boletín`);
      continue;
    }
    const count = TOPICS.map((x) => `${x} ${items.filter((a) => a.topics.includes(x)).length}`).join(", ");
    console.log(`[${locale}] ${items.length} piezas (${count})`);

    if (mode === "dry") {
      const forTopics = previewTopics?.length ? previewTopics : TOPICS;
      const email = buildEmail(locale, items, forTopics);
      const suffix = previewTopics?.length ? `-${previewTopics.join("-")}` : "";
      const file = path.join(os.tmpdir(), `boletin-${locale}${suffix}.html`);
      fs.writeFileSync(file, email.html);
      console.log(`[${locale}] vista previa (${forTopics.join(", ")}) en ${file}`);
      if (flag("template")) {
        // El HTML tal cual se manda a Brevo, con las condiciones sin resolver
        const raw = path.join(os.tmpdir(), `boletin-${locale}-plantilla.html`);
        fs.writeFileSync(raw, buildEmail(locale, items).html);
        console.log(`[${locale}] plantilla de Brevo en ${raw}`);
      }
      continue;
    }

    const email = buildEmail(locale, items);
    console.log(`[${locale}] asunto: ${email.subject}`);
    const { id } = await brevo("POST", "/emailCampaigns", {
      name: email.name,
      subject: email.subject,
      previewText: email.preview,
      sender: { name: "Jorge Graells", email: process.env.BREVO_SENDER_EMAIL },
      replyTo: REPLY_TO,
      htmlContent: email.html,
      recipients: { listIds: [Number(LISTS[locale])] },
      // Formulario de "Cambiar mis temas" ({{ update_profile }}) en el idioma del boletín;
      // sin él, Brevo usa su formulario por defecto, que no enseña los temas
      ...(UPDATE_FORMS[locale] ? { updateFormId: UPDATE_FORMS[locale] } : {}),
    });
    prepared++;
    console.log(`[${locale}] campaña ${id} creada en borrador`);

    if (mode === "send") {
      await brevo("POST", `/emailCampaigns/${id}/sendNow`);
      console.log(`[${locale}] campaña ${id} enviada`);
    } else if (process.env.NEWSLETTER_TEST_EMAIL) {
      // La prueba no debe tumbar el trabajo: la campaña ya está en Brevo
      try {
        await brevo("POST", `/emailCampaigns/${id}/sendTest`, { emailTo: [process.env.NEWSLETTER_TEST_EMAIL] });
        console.log(`[${locale}] prueba enviada a ${process.env.NEWSLETTER_TEST_EMAIL}`);
      } catch (e) {
        console.warn(`[${locale}] no se pudo mandar la prueba (la campaña sigue en borrador): ${e.message}`);
      }
    }
  }

  if (mode === "dry") {
    console.log("Para verla como alguien con solo unos temas: --topics=iot o --topics=ia,iot");
  }
  if (mode === "review" && prepared) {
    console.log("Revisa la prueba y envía la campaña desde Brevo (Campañas > Borradores).");
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
