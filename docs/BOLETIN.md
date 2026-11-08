# Boletín semanal (Brevo)

Un correo a la semana con lo publicado en el blog (guías y noticias), en castellano
y en inglés. Si una semana no hay nada, no se envía.

## Cómo funciona

- **Alta**: formulario `SubscribeForm` al final de cada artículo, en Noticias (los dos
  modos), en el pie de portada, blog, formación y sobre mí (modo oscuro) y en el cierre
  de la portada (modo claro). No sale en Flypet. Llama a `/api/subscribe`, que pide a
  Brevo el alta con **doble confirmación**: el contacto entra en la lista solo cuando
  pulsa el enlace del correo, que lleva a `/es/suscripcion-confirmada` o `/en/subscribed`
  (noindex).
- **Interruptor**: el formulario solo se pinta si existe `BREVO_API_KEY` en el build
  (`src/lib/subscribe.ts`). Tras poner las variables en Vercel hay que **redesplegar**.
- **Envío**: `.github/workflows/newsletter.yml`, los viernes a las 07:00 UTC, ejecuta
  `scripts/newsletter.mjs`. Junta lo publicado en 7 días (máx. 10 piezas, el resto con
  un enlace al blog) y crea una campaña por idioma.
  - Modo **review** (el de ahora, decisión de Jorge): la campaña queda en **borrador**
    y llega una prueba a `NEWSLETTER_TEST_EMAIL`. Jorge la revisa y la envía desde
    Brevo (Campañas > Borradores).
  - Modo **send**: la envía sola. Para activarlo, variable `NEWSLETTER_MODE=send` en
    GitHub. Solo cuando Jorge lo diga.
- **Vista previa local**: `node scripts/newsletter.mjs --dry` (opcional `--days=30`)
  genera el HTML en la carpeta temporal y dice dónde.
- **Privacidad**: el apartado "Boletín semanal" de `/es/privacidad` describe todo esto.
  Si cambia algo (otro proveedor, otra frecuencia, datos nuevos), se cambia allí antes.

## Montaje (una vez, lo hace Jorge)

1. **Cuenta en Brevo** (plan gratuito: 300 correos al día).
2. **Dominio remitente**: Brevo > Remitentes, dominios e IP dedicadas > Dominios >
   añadir `jorgegraells.com` y crear en el DNS los registros que indique (código de
   Brevo, DKIM y DMARC). Después, remitente `boletin@jorgegraells.com` (no hace falta
   que el buzón exista; las respuestas van a dev.graells@gmail.com). Con una dirección
   de Gmail como remitente los correos acaban en spam o rechazados.
3. **Listas**: Contactos > Listas > "Boletín ES" y "Boletín EN". Apuntar el ID de cada una.
4. **Plantillas de confirmación** (una por idioma): Campañas > Plantillas > nueva
   plantilla de doble confirmación. El botón tiene que llevar `{{ params.DOIurl }}`
   como enlace. Texto propuesto:
   - ES, asunto "Confirma tu suscripción": "Hola. Has pedido recibir el resumen semanal
     de jorgegraells.com. Pulsa el botón para confirmarlo. Si no has sido tú, ignora
     este correo y no recibirás nada." Botón: "Confirmar suscripción".
   - EN, asunto "Confirm your subscription": "Hi. You asked to get the weekly roundup
     from jorgegraells.com. Click the button to confirm. If it wasn't you, just ignore
     this email and you won't hear from me." Botón: "Confirm subscription".
   Apuntar el ID de cada plantilla.
5. **Clave de API**: Brevo > SMTP y API > Claves de API > generar.
6. **Vercel** (Settings > Environment Variables, Production) y redesplegar:
   `BREVO_API_KEY`, `BREVO_LIST_ES`, `BREVO_LIST_EN`, `BREVO_DOI_TEMPLATE_ES`,
   `BREVO_DOI_TEMPLATE_EN`.
7. **GitHub** (repo > Settings > Secrets and variables > Actions):
   - Secret: `BREVO_API_KEY`.
   - Variables: `BREVO_SENDER_EMAIL` (`boletin@jorgegraells.com`), `BREVO_LIST_ES`,
     `BREVO_LIST_EN`, `NEWSLETTER_TEST_EMAIL` (dev.graells@gmail.com).
8. **Prueba**: suscribirse desde la web con un correo propio, confirmar, y lanzar el
   flujo a mano (Actions > Boletín semanal > Run workflow, modo review).

Sin `BREVO_LIST_EN` o sin plantilla inglesa, las altas en inglés van a la lista y la
plantilla castellanas, y el envío en inglés se salta.
