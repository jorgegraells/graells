// Crea en Brevo las dos plantillas de doble confirmación (ES y EN) que usa
// /api/subscribe y dice sus ID para ponerlos en Vercel. Se ejecuta una vez.
// Si ya existen (mismo nombre), no las duplica: solo dice sus ID.
//
// Uso (en PowerShell, la clave no se guarda en ningún archivo):
//   $env:BREVO_API_KEY = "xkeysib-..."; node scripts/brevo-setup.mjs
//
// Doc: https://developers.brevo.com/reference/createsmtptemplate
// La plantilla de confirmación tiene que llevar la etiqueta "optin" y un enlace
// a {{ params.DOIurl }}: https://help.brevo.com/hc/en-us/articles/360019540880

const API = "https://api.brevo.com/v3";
const KEY = process.env.BREVO_API_KEY;
const SENDER = { name: "Jorge Graells", email: "boletin@jorgegraells.com" };
const REPLY_TO = "dev.graells@gmail.com";

if (!KEY) {
  console.error('Falta la clave. En PowerShell: $env:BREVO_API_KEY = "xkeysib-..."; node scripts/brevo-setup.mjs');
  process.exit(1);
}

const headers = { "api-key": KEY, "Content-Type": "application/json", Accept: "application/json" };

async function api(path, init = {}) {
  const res = await fetch(API + path, { ...init, headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path}: ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

const page = (lang, { title, text, button, ignore }) => `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e3e3df;">
<tr><td style="padding:32px 28px;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
<p style="margin:0 0 6px;font:600 12px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#6b6b66;">jorgegraells.com</p>
<h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;font-weight:700;">${title}</h1>
<p style="margin:0 0 24px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#333;">${text}</p>
<p style="margin:0 0 28px;"><a href="{{ params.DOIurl }}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font:600 15px/1 Arial,Helvetica,sans-serif;padding:14px 22px;">${button}</a></p>
<p style="margin:0;font:13px/1.5 Arial,Helvetica,sans-serif;color:#6b6b66;">${ignore}</p>
</td></tr></table>
</td></tr></table>
</body></html>`;

const TEMPLATES = [
  {
    env: "BREVO_DOI_TEMPLATE_ES",
    templateName: "Boletín: confirmación ES",
    subject: "Confirma tu suscripción",
    htmlContent: page("es", {
      title: "Confirma tu suscripción",
      text: "Hola. Has pedido recibir el resumen semanal de jorgegraells.com. Pulsa el botón para confirmarlo.",
      button: "Confirmar suscripción",
      ignore: "Si no has sido tú, ignora este correo y no recibirás nada.",
    }),
  },
  {
    env: "BREVO_DOI_TEMPLATE_EN",
    templateName: "Newsletter: confirmation EN",
    subject: "Confirm your subscription",
    htmlContent: page("en", {
      title: "Confirm your subscription",
      text: "Hi. You asked to get the weekly roundup from jorgegraells.com. Click the button to confirm.",
      button: "Confirm subscription",
      ignore: "If it wasn't you, just ignore this email and you won't hear from me.",
    }),
  },
];

const existing = (await api("/smtp/templates?limit=1000")).templates ?? [];
const ids = {};
for (const t of TEMPLATES) {
  const found = existing.find((e) => e.name === t.templateName);
  if (found) {
    ids[t.env] = found.id;
    console.log(`Ya existía "${t.templateName}" (ID ${found.id}).`);
    continue;
  }
  const created = await api("/smtp/templates", {
    method: "POST",
    body: JSON.stringify({
      tag: "optin",
      sender: SENDER,
      replyTo: REPLY_TO,
      templateName: t.templateName,
      subject: t.subject,
      htmlContent: t.htmlContent,
      isActive: true,
    }),
  });
  ids[t.env] = created.id;
  console.log(`Creada "${t.templateName}" (ID ${created.id}).`);
}

const lists = (await api("/contacts/lists?limit=50")).lists ?? [];
const listId = (name) => lists.find((l) => l.name === name)?.id ?? "(no encontrada)";

console.log("\nPon estas variables en Vercel (Production) y redespliega:");
console.log(`  BREVO_LIST_ES = ${listId("Boletín ES")}`);
console.log(`  BREVO_LIST_EN = ${listId("Boletín EN")}`);
for (const [k, v] of Object.entries(ids)) console.log(`  ${k} = ${v}`);
console.log("  BREVO_API_KEY = (la clave que acabas de usar)");
