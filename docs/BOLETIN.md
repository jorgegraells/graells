# Boletín (Brevo)

Dos tipos de correo, en castellano y en inglés, siempre solo de los temas que eligió
cada suscriptor. Cada persona puede pedir uno, el otro o los dos:

- **Resumen semanal** (marcado por defecto): lo publicado en la semana, los viernes.
  Si una semana no hay nada, no se envía.
- **Avisos urgentes** (sin marcar por defecto): un correo por noticia marcada con
  `"alert": true`, en cuanto se publica. Solo lo que no puede esperar (criterio en
  docs/ARTICULOS.md).

No hay correo diario (decisión de Jorge, 25 nov 2026).

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
- **Qué correos**: si existe la lista de avisos, el formulario enseña dos casillas,
  "Resumen semanal" (marcada) y "Avisos urgentes" (sin marcar, con una línea que
  explica qué es); hay que dejar al menos una. La API mete al contacto en
  `BREVO_LIST_ES/EN` (semanal), `BREVO_LIST_ES_ALERTS/EN_ALERTS` (avisos) o en las
  dos. Sin lista de avisos, no hay casillas y todo el mundo va al semanal. El
  interruptor sale de `next.config.ts` (`env.NEWSLETTER_ALERTS`), que lo calcula en el
  build: tras crear la lista de avisos hay que **redesplegar** para que aparezca.
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
- **Avisos urgentes**: `.github/workflows/alerts.yml` corre en cada push a `main` que
  toque `src/content/articles/` (y a mano). Ejecuta `newsletter.mjs --kind=alerts`:
  busca noticias publicadas con `"alert": true` de las últimas 48 horas y, por cada
  una e idioma:
  - Si ya hay una campaña enviada llamada `Aviso ES <slug castellano>`, se salta:
    **un aviso no se manda dos veces**. Un borrador que se quedó a medias se borra y
    se reintenta.
  - Espera (hasta 6 minutos) a que la página responda 200, para no enlazar algo que
    Vercel aún no ha desplegado. Si no responde, lo reintenta en el siguiente push.
  - Elige a quién le toca: los contactos de la lista de avisos con algún tema de la
    noticia (sin temas marcados, todos), sin los bloqueados ni dados de baja. Brevo no
    sabe saltarse contactos dentro de una campaña, así que los mete en una lista
    temporal `tmp-aviso-<idioma>-<fecha>` en la misma carpeta y manda la campaña a esa
    lista. Las temporales de más de 2 días se borran al principio de la siguiente
    ejecución (borrar una lista no borra los contactos).
  - Se envía sola, sin revisión: la noticia ya pasó el filtro al publicarse.
  - Asunto "Aviso: <título>" / "Alert: <title>".
  - Si el aviso más lo ya enviado hoy pasa de 280 correos, lo avisa en el log (el plan
    gratuito para en 300 al día).
  - Sin `BREVO_LIST_ES_ALERTS` (o sin clave) no hace nada y termina bien.
  - Para mandar a mano un artículo como aviso: Actions > Avisos urgentes > Run
    workflow, con su slug castellano. Con "dry" solo genera la vista previa.
- **Vista previa local**: `node scripts/newsletter.mjs --dry` (opcional `--days=30`)
  genera el HTML en la carpeta temporal y dice dónde, como lo vería alguien suscrito a
  todo. Con `--topics=iot` (o `--topics=ia,iot`), como lo vería quien eligió esos temas.
  Con `--template`, también el HTML con las condiciones tal cual va a Brevo.
  Avisos: `node scripts/newsletter.mjs --kind=alerts --dry` (los marcados de las
  últimas 48 horas) o `--kind=alerts --dry --slug=<slug-es>` (cualquier artículo).
- **Prueba de Brevo**: la prueba que llega a `NEWSLETTER_TEST_EMAIL` se pinta con los
  atributos de ese contacto. Para verla completa, ese correo tiene que estar en Brevo
  como contacto con los tres temas a `true` (o sin ninguno, y entonces lo ve todo).
- **Privacidad**: el apartado "Boletín" de `/es/privacidad` describe todo esto.
  Si cambia algo (otro proveedor, otra frecuencia, datos nuevos), se cambia allí antes.

## Montaje (una vez, lo hace Jorge)

1. **Cuenta en Brevo** (plan gratuito: 300 correos al día).
2. **Dominio remitente**: Brevo > Remitentes, dominios e IP dedicadas > Dominios >
   añadir `jorgegraells.com` y crear en el DNS los registros que indique (código de
   Brevo, DKIM y DMARC). Después, remitente `boletin@jorgegraells.com` (no hace falta
   que el buzón exista; las respuestas van a dev.graells@gmail.com). Con una dirección
   de Gmail como remitente los correos acaban en spam o rechazados.
3. **Listas**: Contactos > Listas > "Boletín ES" y "Boletín EN" (semanal). Las de
   avisos, "Avisos ES" y "Avisos EN", las crea `scripts/brevo-setup.mjs` en la misma
   carpeta (paso 6). Apuntar el ID de cada una.
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
   Apuntar el ID de cada plantilla. Más fácil: `scripts/brevo-setup.mjs` crea las dos
   plantillas y las listas de avisos y dice todos los ID (ver su cabecera).
7. **Clave de API**: Brevo > SMTP y API > Claves de API > generar, restringida a
   Emails transaccionales, Campañas de email y Contactos.
8. **Vercel** (Settings > Environment Variables, Production) y redesplegar:
   `BREVO_API_KEY`, `BREVO_LIST_ES`, `BREVO_LIST_EN`, `BREVO_LIST_ES_ALERTS`,
   `BREVO_LIST_EN_ALERTS`, `BREVO_DOI_TEMPLATE_ES`, `BREVO_DOI_TEMPLATE_EN`.
9. **GitHub** (repo > Settings > Secrets and variables > Actions):
   - Secret: `BREVO_API_KEY`.
   - Variables: `BREVO_SENDER_EMAIL` (`boletin@jorgegraells.com`), `BREVO_LIST_ES`,
     `BREVO_LIST_EN`, `BREVO_LIST_ES_ALERTS`, `BREVO_LIST_EN_ALERTS`,
     `NEWSLETTER_TEST_EMAIL` (dev.graells@gmail.com) y, si se crearon en el paso 5,
     `BREVO_UPDATE_FORM_ES` y `BREVO_UPDATE_FORM_EN`. En esos formularios conviene
     añadir también las listas (semanal y avisos) para que cada uno pueda cambiar qué
     correos recibe.
10. **Prueba**: suscribirse desde la web con un correo propio, confirmar, comprobar en
   Brevo que el contacto tiene los temas marcados y lanzar el flujo a mano (Actions >
   Boletín semanal > Run workflow, modo review).

Sin `BREVO_LIST_EN` o sin plantilla inglesa, las altas en inglés van a la lista y la
plantilla castellanas, y el envío en inglés se salta.
