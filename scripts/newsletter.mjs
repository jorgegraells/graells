// Resumen semanal del boletín: junta lo publicado en los últimos 7 días y prepara
// en Brevo una campaña por idioma. Lo lanza GitHub Actions los viernes
// (.github/workflows/newsletter.yml). Montaje y variables: docs/BOLETIN.md.
//
// Modos:
//   --dry     solo genera el HTML en la carpeta temporal y dice dónde (no llama a Brevo)
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
const MAX_ITEMS = 10; // el resto, con un enlace al blog
const ARTICLES_DIR = new URL("../src/content/articles/", import.meta.url);

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const mode = flag("dry") ? "dry" : flag("send") ? "send" : (process.env.NEWSLETTER_MODE === "send" ? "send" : "review");
const days = Number(args.find((a) => a.startsWith("--days="))?.split("=")[1] ?? 7);

const TEXT = {
  es: {
    week: "Ciberseguridad e IA",
    hello: "Hola. Esto es lo que he publicado esta semana:",
    news: "News",
    read: "Leer",
    why: "Te llega este correo porque te suscribiste en jorgegraells.com.",
    unsubscribe: "Darte de baja",
    privacy: "Privacidad",
    privacyHref: "/es/privacidad",
    subject: "Esta semana: ",
    rest: (n) => `Y ${n} más en el blog`,
    date: (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "long", timeZone: "Europe/Madrid" }),
  },
  en: {
    week: "Cybersecurity and AI",
    hello: "Hi. Here's what I published this week:",
    news: "News",
    read: "Read",
    why: "You're getting this email because you subscribed at jorgegraells.com.",
    unsubscribe: "Unsubscribe",
    privacy: "Privacy",
    privacyHref: "/en/privacy",
    subject: "This week: ",
    rest: (n) => `And ${n} more on the blog`,
    date: (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "Europe/Madrid" }),
  },
};

const LISTS = { es: process.env.BREVO_LIST_ES, en: process.env.BREVO_LIST_EN };

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// `published` puede venir solo con fecha (artículos antiguos): medianoche UTC
const toTime = (iso) => Date.parse(iso.length > 10 ? iso : `${iso}T00:00:00Z`);

function recentArticles(locale) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(new URL(f, ARTICLES_DIR), "utf8")))
    .filter((a) => !a.draft)
    .map((a) => ({ ...a[locale], type: a.type, published: a.published ?? a.date }))
    .filter((a) => toTime(a.published) > since)
    .sort((a, b) => toTime(b.published) - toTime(a.published));
}

function buildEmail(locale, items) {
  const t = TEXT[locale];
  const today = t.date(new Date());
  const subject = t.subject + items[0].title;
  const rest = items.length - MAX_ITEMS;
  const preview = items[0].description.slice(0, 140);

  const cards = items
    .slice(0, MAX_ITEMS)
    .map((a) => {
      const url = `${SITE}/${locale}/blog/${a.slug}`;
      const badge = a.type === "news"
        ? `<span style="display:inline-block;font:700 11px/1 Arial,sans-serif;letter-spacing:1px;color:#a3201f;text-transform:uppercase;margin-bottom:6px">● ${t.news}</span><br>`
        : "";
      return `<tr><td style="padding:18px 0;border-top:1px solid #e3dccb">
  ${badge}<a href="${url}" style="font:700 19px/1.3 Georgia,serif;color:#14100a;text-decoration:none">${esc(a.title)}</a>
  <p style="margin:8px 0 10px;font:15px/1.55 Arial,sans-serif;color:#463b2c">${esc(a.description)}</p>
  <a href="${url}" style="font:700 13px/1 Arial,sans-serif;color:#2a3f7c">${t.read} →</a>
</td></tr>`;
    })
    .join("\n");

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
${cards}
${rest > 0 ? `<tr><td style="padding:18px 0;border-top:1px solid #e3dccb"><a href="${SITE}/${locale}/blog" style="font:700 14px/1 Arial,sans-serif;color:#2a3f7c">${t.rest(rest)} →</a></td></tr>` : ""}
</table></td></tr>
<tr><td style="padding:16px 28px 24px;border-top:1px solid #c9b994">
  <p style="margin:0;font:12px/1.5 Arial,sans-serif;color:#6a5d49">${t.why}
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
    const email = buildEmail(locale, items);
    console.log(`[${locale}] ${items.length} piezas · asunto: ${email.subject}`);

    if (mode === "dry") {
      const file = path.join(os.tmpdir(), `boletin-${locale}.html`);
      fs.writeFileSync(file, email.html);
      console.log(`[${locale}] vista previa en ${file}`);
      continue;
    }

    const { id } = await brevo("POST", "/emailCampaigns", {
      name: email.name,
      subject: email.subject,
      previewText: email.preview,
      sender: { name: "Jorge Graells", email: process.env.BREVO_SENDER_EMAIL },
      replyTo: REPLY_TO,
      htmlContent: email.html,
      recipients: { listIds: [Number(LISTS[locale])] },
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

  if (mode === "review" && prepared) {
    console.log("Revisa la prueba y envía la campaña desde Brevo (Campañas > Borradores).");
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
