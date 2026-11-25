// Boletín con Brevo. Configuración y alta: docs/BOLETIN.md.

/** El formulario solo se pinta si hay clave de Brevo. Las páginas son estáticas,
 *  así que al poner la variable en Vercel hay que redesplegar para que aparezca. */
export const subscribeEnabled = Boolean(process.env.BREVO_API_KEY);

/** Qué opciones extra enseña el formulario. Sale de next.config.ts (`env`), que lo
 *  calcula en el build a partir de las listas de Brevo: sin la lista de avisos, el
 *  formulario no ofrece "Avisos urgentes" y todo el mundo va al resumen semanal.
 *  Se lee igual en servidor y en cliente. */
export const subscribeOptions = {
  alerts: process.env.NEWSLETTER_ALERTS === "1",
};
