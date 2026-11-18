// Boletín semanal con Brevo. Configuración y alta: docs/BOLETIN.md.

/** El formulario solo se pinta si hay clave de Brevo. Las páginas son estáticas,
 *  así que al poner la variable en Vercel hay que redesplegar para que aparezca. */
export const subscribeEnabled = Boolean(process.env.BREVO_API_KEY);
