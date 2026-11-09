# Informe SEO y GEO semanal

Fecha: 2026-11-09

## Resumen

- Search Console: 2.049 impresiones y 24 clics en 28 días (antes 106 y 4). Posición media 14,8 (antes 40,2). Crecimiento fuerte, pero el CTR es del 1,2 % y las páginas más vistas casi no se pulsan.
- Indexación: 74 de 82 páginas indexadas. Quedan 7 URLs nuevas sin rastrear (Iberostar, Crédit Mutuel Arkéa, DMARC, SonicWall) y `/es` como duplicada.
- Técnica: 88 URLs del sitemap, todas con 200, canonical y JSON-LD correctos. Hallazgo nuevo: las páginas de artículo tienen dos `<h1>`. PageSpeed sigue sin medirse por cuota.

## Top 3 acciones de esta semana

1. Solicitar indexación de los 7 artículos nuevos que Google no conoce (enlaces abajo): Iberostar, Crédit Mutuel Arkéa (EN), DMARC/SPF/DKIM y SonicWall, en ES y EN.
2. Subir el CTR de las páginas con más impresiones y 0 clics: fraude del CEO EN (220 impr., pos. 21,9), WhatsApp ES (201 impr., pos. 7,7) y neveras de supermercados EN (448 impr., 4 clics). Propuestas de title y seoDescription más abajo.
3. Arreglar el doble `<h1>` de las páginas de artículo y la duplicada `/es` vs `/` (ver problemas técnicos).

## Indexación en Google

74 de 82 indexadas. Sin indexar (abrir el enlace y pulsar "Solicitar indexación"):

- /es: Duplicada, Google prefiere `https://jorgegraells.com/`. Último rastreo 2026-11-07. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=Tit753qeCsREtDm_6t9ITg&utm_medium=link&utm_source=api)
- /es/blog/brecha-iberostar-datos-reservas-correos-falsos: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=1U2gVlS5NhIz54ge5Ctq-Q&utm_medium=link&utm_source=api)
- /en/blog/iberostar-data-breach-booking-details-fake-emails: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=qyyIDo2qeHo4Z9GVVmK4Wg&utm_medium=link&utm_source=api)
- /en/blog/credit-mutuel-arkea-cyberattack-service-provider: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=0FTxFWl_giXZoyWFYi6pbA&utm_medium=link&utm_source=api)
- /es/blog/dmarc-spf-dkim-que-son-como-configurarlos: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=bJtvVr98-xE0PI76iuP2tA&utm_medium=link&utm_source=api)
- /en/blog/dmarc-spf-dkim-explained-how-to-set-up: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=y8AL88JPVlUHXaRq85lz7w&utm_medium=link&utm_source=api)
- /es/blog/sonicwall-cve-2026-19868-vpn-saltar-mfa: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=tkKngxvpprXq3Ip2VeCTug&utm_medium=link&utm_source=api)
- /en/blog/sonicwall-cve-2026-19868-vpn-mfa-bypass: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=0CxNy9bZbUQgEclEMx9eog&utm_medium=link&utm_source=api)

Los 3 artículos de la semana pasada (fraude del CEO EN, prompt injection indirecta ES y EN) ya están indexados y reciben impresiones.

## Search Console (2026-10-10 a 2026-11-06, frente a los 28 días anteriores)

| | Ahora | Antes |
| --- | --- | --- |
| Clics | 24 | 4 |
| Impresiones | 2.049 | 106 |
| CTR | 1,2 % | 3,8 % |
| Posición media | 14,8 | 40,2 |

- Consultas con más impresiones: "what is ceo fraud" 51 (pos. 16,3); "ceo fraud" 47 (30,6); "prompt injection" 47 (27,4); "fridge cyber attack" 26 (15,8); "ceo fraud phishing" 24 (17,3); "geo" 16 (16,6); "prevenir inyección de prompts" 12 (32,8); "indirect prompt injection" 11 (88); "cyber resilience act news" 10 (9,0); "llmjacking" 7 (7,7).
- Páginas con más impresiones: neveras EN 448 (4 clics, pos. 9,6); fraude del CEO EN 220 (0 clics, pos. 21,9); neveras ES 218 (5 clics, pos. 8,9); WhatsApp ES 201 (0 clics, pos. 7,7); WhatsApp EN 82 (pos. 9,4); GEO ES 73 (pos. 54,2); prompt injection EN 71 (pos. 26,9); Binance ES 66 (2 clics).
- Evolución frente al informe anterior: las noticias de última hora (neveras, Amadeus, Ivanti, CRA) entran rápido en pos. 6-10. WhatsApp ES pasa de 108 a 201 impresiones sin clics. GEO ES empeora de pos. 59,8 a 54,2 solo en parte (sigue lejos). Prompt injection EN no se mueve (26,9), la reescritura propuesta sigue sin hacerse. El artículo de fraude del CEO, nuevo, ya es la segunda página más vista.
- Oportunidades 4-20: fraude del CEO EN ("what is ceo fraud", "ceo fraud phishing", "ceo phishing email", "ceo fraud examples"); neveras EN ("fridge cyber attack", "europe cyber attack fridge"); GEO ES ("geo", pos. 16,6); CRA EN ("cyber resilience act news", pos. 9); llmjacking ES/EN (pos. 5,3 y 11); Claude ha caído ("claude ha caido?", pos. 9,8); Amadeus EN ("amadeus data breach", pos. 15).
- CTR bajo, propuestas (máx. 155 caracteres, consulta al principio):
  - Fraude del CEO EN, title: "What is CEO fraud? How to spot it and stop it". seoDescription: "What is CEO fraud? A fake boss email or call that pushes an urgent payment. Learn the warning signs, real examples and how to prevent it."
  - Fraude del CEO ES, title: "Fraude del CEO: cómo detectarlo y evitarlo en tu empresa". seoDescription: "Fraude del CEO: un falso directivo pide una transferencia urgente. Señales de alerta, ejemplos reales y cómo verificar antes de pagar."
  - WhatsApp ES (201 impr., 0 clics, pos. 7,7), title: "Me han hackeado el WhatsApp: qué hacer en 10 minutos". seoDescription: "Me han hackeado el WhatsApp: cierra dispositivos vinculados, recupera la cuenta con tu código SMS, activa la verificación en dos pasos y avisa a tus contactos." (155 máx., recortar "tus contactos" si pasa).
  - Neveras EN (448 impr., 0,9 %), seoDescription: "Fridge cyber attack in Europe: what happened to supermarket cold chains in 9+ countries, what is confirmed and what is still unknown. Updated."
  - GEO ES, seoDescription: "Qué es GEO (Generative Engine Optimization), en qué se diferencia del SEO y cómo conseguir que ChatGPT y Perplexity citen tu web."
  - Prompt injection EN, seoDescription: "Prompt injection: what it is, direct vs indirect attacks, real examples and how to defend your company's LLM apps."
  - Phishing EN: la consulta larga tipo test ("an email claims to be from a senior colleague...") sale en pos. 4,7-6,3 porque el artículo contiene un cuestionario. Hay que comprobar que la respuesta correcta se vea en el HTML, pero no es prioridad.
- Consultas con impresiones sin artículo propio que las responda: "ceo phishing email" y "ceo fraud examples" (cubiertas a medias por el artículo de fraude del CEO, falta una sección de ejemplos reales); "europe cyber attack" (resto de países afectados en las neveras, se actualiza con la noticia). "indirect prompt injection" tiene pos. 88: el artículo existe pero no compite, ver propuestas.

## Problemas técnicos (por gravedad)

1. **Media.** Todas las páginas de artículo tienen dos `<h1>` (ejemplo: `/es/blog/claude-ha-caido`: uno `text-gradient neon-text` y otro `dx-doc-title`, que viene de la variante "dossier" del tema renderizada a la vez). Antes figuraba uno solo. Servir solo un h1 por tema (renderizar condicionalmente o cambiar el segundo a `<p role="heading">`/`div`) para no confundir a Google y a los LLM.
2. **Media.** `/es` figura como duplicada: Google prefiere `/`. Alinear redirección permanente, canonical y sitemap en la misma URL. Sigue sin resolverse desde hace una semana.
3. **Baja.** Títulos largos (máx. 65): `/es/blog/asistente-ia-documentos-empresa-fuga-de-datos` (67), `/en/blog/credit-mutuel-arkea-cyberattack-service-provider` (67), `/en/blog/amadeus-data-breach-airlines-passengers` (68). Acortar 3 caracteres como mínimo.
4. **Baja.** `/es/flypet/probar` y `/en/flypet/probar`: title de 29 caracteres (mín. 30). Añadir una palabra.
5. **Baja.** El sitemap no incluye hreflang (sí está en el HTML como `hrefLang`). Opcional.

Sin errores en: HTTP 200 en las 88 URLs, canonical propio, hreflang es/en en el HTML, og:image con 200, JSON-LD parseable, meta descriptions dentro de 160, enlaces internos sin roturas, robots.txt y llms.txt con 200. `llms.txt` lista todos los artículos publicados del repo (34 archivos; el borrador no está). Las editorial policy que fallaban la semana pasada ya cumplen.

## Rendimiento

No medido otra vez: la API de PageSpeed Insights devuelve 429 "Quota exceeded" (cuota diaria del proyecto compartido sin clave) para `/es` y `/es/training`. Hace falta una clave de API (`&key=`) en el entorno de la rutina; `www.googleapis.com` ya está permitido. Cuarta semana consecutiva sin dato.

## Propuestas por artículo

- **Fraude del CEO (ES/EN):** el más prometedor (EN pos. 16-22 en cuatro consultas). Añadir (comprobar antes si existen) una sección de ejemplos reales, la variante con deepfakes de voz y vídeo, la regla de "colgar y volver a llamar" y la guía de INCIBE para pymes como fuente. Enlazar a DMARC/SPF/DKIM (nuevo) y al artículo de phishing.
- **Neveras de supermercados (ES/EN):** la búsqueda actual muestra que el ataque se amplió a más países (Alemania, Italia, Reino Unido, Rumanía) y las fuentes difieren en cifras (9 a 15 países). Comprobar el artículo contra Reuters y Euronews, y mantener una línea "Última actualización" con fecha. Aún no hay atribución oficial.
- **Prompt injection (ES/EN):** reescribir la apertura con definición en 2 líneas, directa vs indirecta, defensas por capas (mínimo privilegio, delimitar contenido no fiable, confirmación humana en acciones sensibles) y mención a OWASP LLM01, que admite que no hay defensa infalible. Enlazar al artículo de inyección indirecta y al de OWASP LLM.
- **Prompt injection indirecta (ES/EN):** "indirect prompt injection" en pos. 88. Enlazar desde el artículo base y desde OWASP; añadir un ejemplo con calendario/correo en el primer párrafo.
- **GEO (ES/EN):** sigue en pos. 49-54. Añadir (si faltan) "GEO vs SEO", "cómo salir en ChatGPT" (Bing indexado, GPTBot en robots.txt) y "cómo medirlo", y enlazar desde la home y `/training`.
- **WhatsApp (ES/EN):** ver CTR. Abrir con lista numerada de pasos y tiempo estimado.
- **CRA (EN):** "cyber resilience act news" en pos. 9: añadir bloque de novedades con fecha.
- **Claude ha caído / is down:** mantener "Última comprobación" con fecha según la página de estado oficial.
- **AI Act artículo 4 (ES/EN):** pos. 34-78. Pendiente desde hace dos semanas verificar contra EUR-Lex y la Comisión el efecto del Digital Omnibus sobre la obligación (no he podido leer el texto oficial completo en esta pasada). No cambiar nada sin esa fuente.
- **Training:** pos. 3,4 con pocas impresiones. Añadir pregunta frecuente de precio orientativo y de bonificación FUNDAE (comprobar que no exista). Las cifras de crédito que circulan (por ejemplo "mínimo 420 €") vienen de proveedores comerciales: citar solo FUNDAE.

## GEO

Búsquedas hechas en un buscador general, no en ChatGPT ni Perplexity; jorgegraells.com no aparece en las vistas devueltas en ninguna.

| Consulta | Aparece | Dominan | Lo que tienen y Jorge no |
| --- | --- | --- | --- |
| fraude del CEO cómo detectarlo empresas | No | INEAF, BBVA, McAfee, INCIBE, Santander | Marca institucional, guía de 10 pasos de INCIBE, ejemplo de pregunta de verificación |
| qué es GEO posicionamiento en ChatGPT | No | blogs de agencias y herramientas (applabx, promptwatch, hashmeta) | Definición breve, comparación con SEO, métricas de menciones; casi todo en inglés |
| formación ciberseguridad e IA para empresas bonificada | No | tecnociminnova, KPMG/Founderz, ISMS Forum, Grupo2000 | Páginas de crédito FUNDAE, programas con marca, catálogo |
| inyección de prompts qué es y cómo prevenirla | No | SentinelOne, wwwhatsnew, IEB, cyberclick, openreplay | Definición directa/indirecta y lista de defensas; poca competencia técnica en español |
| ciberataque neveras supermercados Europa | No | Euronews, Forbes, Vozpópuli, Excélsior, regionales | Cobertura de agencia y actualización continua; Jorge aporta ángulo para pymes |

Mejor oportunidad: prompt injection en español y fraude del CEO en inglés (ya hay impresiones).

## Temas sugeridos para el redactor

1. "Ejemplos reales de fraude del CEO y cómo se frenaron" (consultas "ceo fraud examples", "ceo phishing email", 7 y 4 impr.).
2. "Deepfake de voz del jefe: cómo comprobar una llamada" (consulta "fraude del CEO deepfake", relacionada con "ceo fraud prevention", 12 impr.).
3. "GEO vs SEO: diferencias y qué hacer primero" (consultas "geo seo" 8 impr., "qué es geo" 9 y "geo" 16).
4. "Cómo salir en ChatGPT: guía práctica de GEO" (consulta "geo chatgpt", 7 impr.).
5. "Cómo proteger tu aplicación web del prompt injection" (consultas "prevenir inyección de prompts" 12 y "inyección de prompts" 10).

## Qué se arregló desde el informe anterior

- Indexación: de 40 de 44 a 74 de 82. Los 3 artículos señalados (fraude del CEO EN, prompt injection indirecta ES/EN) ya están indexados.
- Títulos EN señalados (openai-google, safepay) y las meta/og:image de la política editorial ya están en rango. Aparecen 3 títulos largos nuevos.
- `llms.txt` sincronizado con los 34 artículos publicados.
- Sigue pendiente: `/es` duplicada, medición de PageSpeed (cuota), reescrituras de prompt injection y GEO, verificación del artículo 4 del AI Act. Nuevo: doble h1.
