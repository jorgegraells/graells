# Boletín semanal (Brevo)

Un correo a la semana con lo publicado en el blog (guías y noticias), en castellano
y en inglés, con solo los temas que eligió cada suscriptor. Si una semana no hay
nada, no se envía.

## Cómo funciona

- **Alta**: formulario `SubscribeForm` al final de cada artículo, en Noticias (los dos
  modos), en el pie de portada, blog, formación y sobre mí (modo oscuro) y en el cierre
  de la portada (modo claro). No sale en Flypet. Llama a `/api/subscribe`, que pide a
  Brevo el alta con **doble confirmación**: el contacto entra en la lista solo cuando
  pulsa el enlace del correo, que lleva a `/es/suscripcion-confirmada` o `/en/subscribed`
  (noindex).
- **Temas**: el formulario tiene tres casillas (Ciberseguridad, IA, IoT e industria),
  todas marcadas salvo en la página de un tema, donde sale marcado solo ese. La API
  valida los ids (`src/content/topics.ts`) y los manda a Brevo como tres atributos
  booleanos del contacto: `TEMA_CIBER`, `TEMA_IA`, `TEMA_IOT`.
- **Páginas de tema**: `/es/blog/tema/<ciberseguridad|ia|iot>` y
  `/en/blog/topic/<cybersecurity|ai|iot>`, cada una con su RSS (`.../feed.xml`) y el
  formulario con ese tema marcado. Es el enlace para pasar a alguien de un sector.
- **Interruptor**: el formulario solo se pinta si existe `BREVO_API_KEY` en el build
  (`src/lib/subscribe.ts`). Tras poner las variables en Vercel hay que **redesplegar**.
- **Envío**: `.github/workflows/newsletter.yml`, los viernes a las 07:00 UTC, ejecuta
  `scripts/newsletter.mjs`. Junta lo publicado en 7 días (como mucho las 6 piezas más
  recientes de cada tema, el resto con un enlace al blog) y crea una campaña por idioma.
  Cada pieza va dentro de una condición de Brevo (`{% if contact.TEMA_IOT == true %}`),
  así que cada contacto solo ve las de sus temas. Si eligió solo temas sin nada esa
  semana, ve una nota con un enlace al blog. Un contacto sin ningún tema marcado (por
  ejemplo, añadido a mano en Brevo) lo recibe todo. El asunto es neutro ("Lo de esta
  semana en jorgegraells.com") porque cada contacto ve piezas distintas. El pie lleva
  "Cambiar mis temas" (`{{ update_profile }}`) y "Darte de baja".
  - Modo **review** (el de ahora, decisión de Jorge): la campaña queda en **borrador**
    y llega una prueba a `NEWSLETTER_TEST_EMAIL`. Jorge la revisa y la envía desde
    Brevo (Campañas > Borradores).
  - Modo **send**: la envía sola. Para activarlo, variable `NEWSLETTER_MODE=send` en
    GitHub. Solo cuando Jorge lo diga.
- **Vista previa local**: `node scripts/newsletter.mjs --dry` (opcional `--days=30`)
  genera el HTML en la carpeta temporal y dice dónde, como lo vería alguien suscrito a
  todo. Con `--topics=iot` (o `--topics=ia,iot`), como lo vería quien eligió esos temas.
  Con `--template`, también el HTML con las condiciones tal cual va a Brevo.
- **Prueba de Brevo**: la prueba que llega a `NEWSLETTER_TEST_EMAIL` se pinta con los
  atributos de ese contacto. Para verla completa, ese correo tiene que estar en Brevo
  como contacto con los tres temas a `true` (o sin ninguno, y entonces lo ve todo).
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
4. **Atributos de temas** (antes de poner la web en marcha: si no existen, Brevo
   puede rechazar las altas o no guardar los temas): Contactos > Ajustes > Atributos de contacto > Añadir atributo,
   tres veces, tipo **Booleano**, con estos nombres exactos: `TEMA_CIBER`, `TEMA_IA`,
   `TEMA_IOT`.
5. **Formularios para "Cambiar mis temas"** (uno por idioma): Marketing > Formularios >
   pestaña Actualización de perfil > Crear formulario. En cada uno, el correo en solo
   lectura y los tres atributos como casillas, con su nombre en el idioma:
   - ES: "Ciberseguridad", "IA", "IoT e industria".
   - EN: "Cybersecurity", "AI", "IoT and industrial".
   El ID es el código de 24 caracteres que sale en la dirección al editarlo. Si no se
   crean, el enlace lleva al formulario por defecto de Brevo, que no enseña los temas.
6. **Plantillas de confirmación** (una por idioma): Campañas > Plantillas > nueva
   plantilla de doble confirmación. El botón tiene que llevar `{{ params.DOIurl }}`
   como enlace. Texto propuesto:
   - ES, asunto "Confirma tu suscripción": "Hola. Has pedido recibir el resumen semanal
     de jorgegraells.com. Pulsa el botón para confirmarlo. Si no has sido tú, ignora
     este correo y no recibirás nada." Botón: "Confirmar suscripción".
   - EN, asunto "Confirm your subscription": "Hi. You asked to get the weekly roundup
     from jorgegraells.com. Click the button to confirm. If it wasn't you, just ignore
     this email and you won't hear from me." Botón: "Confirm subscription".
   Apuntar el ID de cada plantilla.
7. **Clave de API**: Brevo > SMTP y API > Claves de API > generar.
8. **Vercel** (Settings > Environment Variables, Production) y redesplegar:
   `BREVO_API_KEY`, `BREVO_LIST_ES`, `BREVO_LIST_EN`, `BREVO_DOI_TEMPLATE_ES`,
   `BREVO_DOI_TEMPLATE_EN`.
9. **GitHub** (repo > Settings > Secrets and variables > Actions):
   - Secret: `BREVO_API_KEY`.
   - Variables: `BREVO_SENDER_EMAIL` (`boletin@jorgegraells.com`), `BREVO_LIST_ES`,
     `BREVO_LIST_EN`, `NEWSLETTER_TEST_EMAIL` (dev.graells@gmail.com) y, si se
     crearon en el paso 5, `BREVO_UPDATE_FORM_ES` y `BREVO_UPDATE_FORM_EN`.
10. **Prueba**: suscribirse desde la web con un correo propio, confirmar, comprobar en
   Brevo que el contacto tiene los temas marcados y lanzar el flujo a mano (Actions >
   Boletín semanal > Run workflow, modo review).

Sin `BREVO_LIST_EN` o sin plantilla inglesa, las altas en inglés van a la lista y la
plantilla castellanas, y el envío en inglés se salta.
