# Informe SEO y GEO semanal

Fecha: 2026-10-27 (segunda pasada del día; el informe anterior era de hoy mismo, así que los datos de Search Console no han cambiado).

## Resumen

- Search Console: 202 impresiones y 2 clics en 28 días (antes 70 y 2). Posición media 34,9 (antes 64,3). Casi nada se pulsa.
- Indexación: 14 de 22 páginas indexadas. Los 3 artículos nuevos (phishing, WhatsApp, AI Act artículo 4) y el EN de GEO siguen sin indexar.
- Técnica: arreglado lo del informe anterior. Las 22 URLs del sitemap dan 200, con title de 30 a 65, description de 150 como máximo, canonical propio, hreflang, JSON-LD válido, un h1 y sin enlaces rotos. `llms.txt` lista los 7 artículos.

## Top 3 acciones de esta semana

1. Solicitar indexación de los 8 artículos sin indexar (enlaces abajo): 7 URLs que Google "no reconoce" (nunca rastreadas) y 1 descubierta sin indexar. Sin esto no hay impresiones posibles.
2. Reescribir la apertura y las secciones de `/en/blog/what-is-prompt-injection` (62 impresiones, pos. 25,7, 0 clics) y de `/es/blog/que-es-prompt-injection` (pos. 29): definición en 2 líneas arriba, directa vs indirecta, ejemplos reales, "cómo prevenirla" (mínimo privilegio, guardrails, contenido externo no confiable, defensa en capas, OWASP LLM Top 10 nº1).
3. Subir el artículo de GEO (67 impresiones, pos. 64): sección explícita "GEO vs SEO" y otra "cómo salir en ChatGPT" (consultas "geo chatgpt", "geo seo"), con estadísticas y fuentes citadas, que es lo que recomiendan las guías que ya dominan.

## Indexación en Google

14 de 22 páginas indexadas. Sin indexar (abrir enlace y pulsar "Solicitar indexación"):

- /es: Duplicada, Google ha elegido otra canónica, último rastreo 2026-10-18. Probable causa: `/` redirige (307) a `/es` y Google prefiere `/`. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=ufNDV9uTiKnQun4ZPSU8Qw&utm_medium=link&utm_source=api)
- /es/blog/alfabetizacion-en-ia-ai-act-articulo-4: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=J_eztxMyWHcEzpCKiiHZqw&utm_medium=link&utm_source=api)
- /en/blog/ai-literacy-ai-act-article-4: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=YzrfhJMPk2zPenzhS5XXbQ&utm_medium=link&utm_source=api)
- /es/blog/como-saber-si-un-correo-es-phishing: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=7q7UC9RDY9EUUr62Q_rTgQ&utm_medium=link&utm_source=api)
- /en/blog/how-to-spot-a-phishing-email: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=3uaYZLk-vPrQko9VX-0uiw&utm_medium=link&utm_source=api)
- /es/blog/me-han-hackeado-el-whatsapp: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=GVYxef35jY8LNTwCVSxRpQ&utm_medium=link&utm_source=api)
- /en/blog/whatsapp-hacked-how-to-recover: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=H3Q6lLrytiodlZFzqXVatQ&utm_medium=link&utm_source=api)
- /en/blog/what-is-geo-rank-your-website-in-ai-answers: descubierta, actualmente sin indexar. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=nbgm2I-lTjlUUNCp9rZ_0w&utm_medium=link&utm_source=api)

Además, enviar `https://jorgegraells.com/sitemap.xml` en Search Console si no consta enviado.

## Search Console (2026-09-27 a 2026-10-24, frente a los 28 días anteriores)

| | Ahora | Antes |
| --- | --- | --- |
| Clics | 2 | 2 |
| Impresiones | 202 | 70 |
| CTR | 1,0 % | 2,9 % |
| Posición media | 34,9 | 64,3 |

- Consultas: "prompt injection" 40 impr. (pos. 27,5); "geo chatgpt" 11 (pos. 89); variantes de "qué es geo" unas 21 (pos. 86-90); "geo seo" 4 (pos. 31); "prevenir inyección de prompts" 3 (pos. 57); "claude error" 2 (pos. 29,5); "claude caído" pos. 1.
- Páginas: GEO ES 67 impr.; prompt injection EN 62; claude-ha-caido 19 (1 clic, pos. 7,4); claude-is-down 18 (pos. 11,2); `/es/world` 13 (pos. 10,8).
- Oportunidades 4-20 (la herramienta no lista ninguna; por página): claude-ha-caido (7,4), claude-is-down (11,2), ataques-no-entran (5,4), `/es/training` (4,5), `/en/training` (4,8). Todas con muy pocas impresiones: la palanca es indexar y ganar visibilidad, no retocar títulos.
- CTR bajo: GEO ES y prompt injection EN. Sus títulos ya están en rango (63 y 53 caracteres); falta ganar posición. Propuesta de seoDescription (máx. 155): GEO "Qué es GEO (Generative Engine Optimization), en qué se diferencia del SEO y cómo conseguir que ChatGPT y Perplexity citen tu web." Prompt injection EN "Prompt injection: what it is, direct vs indirect attacks, real examples and how to defend your company's LLM apps."

## Problemas técnicos (por gravedad)

1. **Media.** `/es` figura como duplicada: `/` responde 307 a `/es` y Google elige otra canónica. Arreglo: que `/` sirva el contenido en español o que el canonical de `/es` y la redirección sean coherentes (permanente, 308) y que el sitemap liste la URL que Google debe elegir.
2. **Baja.** `/es/world` y `/en/world` ya tienen canonical propio y un h1 (arreglado). Sin incidencias.
3. **Baja.** El sitemap no incluye hreflang (sí lo hay en el HTML de cada página). Opcional.

Sin enlaces internos rotos, JSON-LD válido, og:image 200 en las 22 URLs, robots.txt y llms.txt responden 200.

## Rendimiento

No medido: PageSpeed Insights devolvió "Quota exceeded" otra vez para /es, /es/training y el artículo GEO. Hace falta una clave de API (`&key=`) en el entorno; el dominio `www.googleapis.com` ya está permitido.

## Propuestas por artículo

- **Prompt injection (ES/EN):** ver acción 2. Enlazar a "los ataques no entran por el servidor" y desde ella de vuelta.
- **GEO (ES/EN):** ver acción 3. Comprobar antes que no existan ya las secciones "GEO vs SEO" y "ChatGPT". Enlazar desde la home y /training.
- **Claude ha caído / is down:** mejor posicionada (pos. 1-11). Mantener actualizada con la página oficial de estado y añadir bloque "Última comprobación" con fecha; sección "Claude error: qué significa".
- **Ataques no entran por el servidor:** pos. 5,4. Añadir enlaces internos hacia prompt injection.
- **AI Act artículo 4:** pendiente de revisar contra el DOUE y el Digital Omnibus; esta pasada no se verificó el texto oficial. Es el artículo con más interés de pymes: priorizar indexarlo.
- **WhatsApp hackeado:** los resultados dominantes (ESET, Xataka Android) abren con los primeros 10 minutos y los pasos: dispositivos vinculados, re-registro por SMS, verificación en dos pasos, aviso a contactos. Comprobar que el artículo empieza por esa lista numerada.
- **Phishing:** sin datos todavía; solo indexación.
- **Training:** añadir pregunta frecuente de precio orientativo y bonificación FUNDAE.

## GEO

Búsquedas de esta pasada (buscador general, no ChatGPT ni Perplexity): jorgegraells.com no aparece en los resultados vistos de ninguna.

| Consulta | Aparece | Dominan | Lo que tienen y Jorge no |
| --- | --- | --- | --- |
| qué es prompt injection y cómo prevenirla | No | TrueFoundry, Cloudflare, Helicone, techsy | Definición clara arriba, directa vs indirecta, lista de mitigaciones, referencia a OWASP |
| cómo salir en ChatGPT GEO guía | No | ecosistemastartup, seocrawl, cangrejodigital | Guías "2026" con plan por semanas, estudio de Princeton citado, herramientas |
| me han hackeado el WhatsApp qué hacer | No | ESET, Xataka Android, La Gaceta | Pasos numerados en los primeros 10 minutos, marca de autoridad |

Pendiente de repetir: AI Act artículo 4 y formación IA empresas (no se rehicieron en esta pasada; ver informe anterior: dominan despachos y prensa con citas legales).

## Temas sugeridos para el redactor

1. "Prompt injection indirecta: ejemplos reales y cómo prevenirla" (consultas "prevenir inyección de prompts", "ataques prompt injection", "inyección de prompts").
2. "GEO vs SEO: diferencias y qué hacer primero" (consultas "geo seo", "posicionamiento geo").
3. "Cómo salir en ChatGPT: guía práctica de GEO" (consulta "geo chatgpt", 11 impresiones).
4. "Claude da error: qué significa y cómo resolverlo" (consultas "claude error", "claude degradation").
5. "GEO para inteligencia artificial en pymes: checklist" (consulta "geo inteligencia artificial").

## Qué se arregló desde el informe anterior

- Títulos largos de artículos: todos entre 50 y 65 caracteres.
- Meta descriptions de /es, /en, world y /es/training: todas de 150 o menos.
- Canonical de /es/world y /en/world: ya propio. Ambas páginas tienen h1.
- Títulos de /es/blog y /en/blog: 51 y 48 caracteres.
- `llms.txt` lista los 7 artículos publicados (antes 5).
- Sigue pendiente: medición de rendimiento (cuota de PageSpeed) y la indexación.
