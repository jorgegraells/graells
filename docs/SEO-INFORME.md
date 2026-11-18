# Informe SEO y GEO semanal

Fecha: 2026-11-16

## Resumen

- Search Console (2026-10-17 a 2026-11-13): 3.017 impresiones y 32 clics en 28 días (antes 142 y 3). Posición media 16,1 (antes 34,9). El CTR sigue bajo (1,1 %): las páginas con más impresiones casi no reciben clics.
- Indexación: 115 de 120 páginas indexadas. Los 8 artículos que señalé la semana pasada ya están indexados. Quedan 4 artículos EN sin indexar más `/es` (duplicada) y `/en/blog`.
- Técnica: todo con 200, canonical, JSON-LD y og:image correctos. Persisten el doble `<h1>` (120 de 126 URLs) y 16 títulos de artículo por encima de 65 caracteres. PageSpeed, otra semana sin dato (429).

## Top 3 acciones de esta semana

1. Solicitar indexación de los 4 artículos EN que Google no conoce o no ha indexado: Apache HTTP/2, Zoom/Teams FaceStealer, Crédit Mutuel Arkéa y el índice `/en/blog` (enlaces abajo).
2. Arreglar el doble `<h1>` en todas las páginas de artículo (sigue sin resolver desde hace una semana, afecta a 120 URLs).
3. Subir el CTR de las páginas con muchas impresiones y 0 clics: WhatsApp ES (264 impr., pos. 8,4), fraude del CEO EN (262 impr., pos. 22,5) y neveras EN (457 impr., 0,9 %). Las propuestas de title y seoDescription de la semana pasada siguen sin aplicarse; ver más abajo.

## Indexación en Google

115 de 120 indexadas. Sin indexar (abrir el enlace y pulsar "Solicitar indexación"):

- /es: Duplicada, Google prefiere `https://jorgegraells.com/`. Último rastreo 2026-11-15. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=8yk8dEHRRi67g08Rn-54Sg&utm_medium=link&utm_source=api)
- /en/blog: Rastreada, actualmente sin indexar (último rastreo 2026-07-08). [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=Rdapjjq2n2Yvg5MasaSQ1Q&utm_medium=link&utm_source=api)
- /en/blog/apache-http-server-cve-2026-119618-http2-update: Google no reconoce la URL, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=Bex7bTC6Chzoil2mv1FGwg&utm_medium=link&utm_source=api)
- /en/blog/credit-mutuel-arkea-cyberattack-service-provider: Descubierta, actualmente sin indexar, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=3A6R7EqKtuS92Bc_wuc8gg&utm_medium=link&utm_source=api)
- /en/blog/fake-zoom-teams-video-call-facestealer-fbi: Google no reconoce la URL, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=t5dZjjK98zpIffSjjndYWg&utm_medium=link&utm_source=api)

## Search Console (2026-10-17 a 2026-11-13, frente a los 28 días anteriores)

| | Ahora | Antes |
| --- | --- | --- |
| Clics | 32 | 3 |
| Impresiones | 3.017 | 142 |
| CTR | 1,1 % | 2,1 % |
| Posición media | 16,1 | 34,9 |

- Consultas con más impresiones: "ceo fraud" 55 (pos. 30,5); "what is ceo fraud" 54 (16,4); "prompt injection" 42 (28,8); "indirect prompt injection" 37 (81,4); "ceo fraud phishing" 30 (17,5); "fridge cyber attack" 26 (15,8); "cyber resilience act news" 20 (13,4); "qué es geo" 20 (91,5); "inyección de prompts" 17 (93,2); "geo" 16 (16,6). Todas con 0 clics.
- Páginas con más impresiones: neveras EN 457 (4 clics, pos. 9,9); WhatsApp ES 264 (0 clics, 8,4); fraude del CEO EN 262 (0 clics, 22,5); neveras ES 244 (5 clics, 9,0); Claude Code settings EN 132 (1 clic, 8,3); Amadeus EN 118 (2 clics).
- Evolución: las impresiones se multiplican por 21, pero los clics solo por 10. WhatsApp ES sube de 201 a 264 impresiones sin un solo clic. GEO ES sigue en pos. 57,9 (antes 54,2) y "qué es geo" en 91,5. Prompt injection ES pasa a pos. 50,6 y la EN a 29,9; la reescritura propuesta no se ha hecho. "indirect prompt injection" mejora de pos. 88 a 81,4. Los artículos nuevos de fraude del CEO (ejemplos reales ES, 2 clics con CTR 11 %) ya empiezan a rendir.
- Oportunidades 4-20: fraude del CEO EN ("what is ceo fraud", "ceo fraud phishing", "ceofraud"); neveras EN ("fridge cyber attack", "europe cyber attack"); CRA EN ("cyber resilience act news", pos. 13,4); GEO ES ("geo", 16,6); agentes de IA con demasiados permisos EN ("why are most ai agents over-permissioned?", pos. 8,6); llmjacking ES (pos. 7,0); prompt injection indirecta ES ("ataques indirect prompt injection", 15,8).
- CTR bajo, propuestas (máx. 155 caracteres, consulta al principio):
  - Fraude del CEO EN, title: "What is CEO fraud? How to spot it and stop it". seoDescription: "What is CEO fraud? A fake boss email or call that pushes an urgent payment. Learn the warning signs, real examples and how to prevent it."
  - WhatsApp ES, title: "Me han hackeado el WhatsApp: qué hacer en 10 minutos". seoDescription: "Me han hackeado el WhatsApp: cierra dispositivos vinculados, recupera la cuenta con el código SMS, activa la verificación en dos pasos y avisa a tus contactos."
  - Neveras EN, seoDescription: "Fridge cyber attack in Europe: what happened to supermarket cold chains, what is confirmed and what is still unknown. Updated."
  - GEO ES, seoDescription: "Qué es GEO (Generative Engine Optimization), en qué se diferencia del SEO y cómo conseguir que ChatGPT y Perplexity citen tu web."
  - Prompt injection EN, seoDescription: "Prompt injection: what it is, direct vs indirect attacks, real examples and how to defend your company's LLM apps."
  - Prompt injection ES, seoDescription: "Prompt injection: qué es, diferencia entre directa e indirecta, ejemplos reales y defensas por capas para proteger las IA de tu empresa."
  - CRA EN ("cyber resilience act news"): añadir al título "CRA news" no encaja; mejor un bloque "Last update" con fecha al inicio.
- Consultas con impresiones sin artículo que las responda bien: "qué es geo" (91,5) e "inyección de prompts" (93,2) están en pos. 90+, es decir, el artículo existe pero no compite; hace falta reescribir. "alfabetización ia empleados" (10 impr., pos. 92,9) y "owasp top 10 llm" (9, pos. 88,8) igual.

## Problemas técnicos (por gravedad)

1. **Media.** Doble `<h1>` en 120 de las 126 URLs del sitemap (todas las páginas de artículo). Una procede de la variante "dossier" del tema (`dx-doc-title`) renderizada a la vez que la principal. Renderizar un solo título por tema o cambiar el segundo a `<div role="heading" aria-level="1">`... mejor `<p>`. Sigue igual que la semana pasada.
2. **Media.** `/es` figura como duplicada y Google prefiere `/`. Alinear redirección permanente, canonical y sitemap en una sola URL. Tres semanas sin resolverse.
3. **Baja.** Títulos por encima de 65 caracteres (16): ES: `cursor-hackeo-extension-claude-code-falsa` (73), `check-point-php2shell-cve-2026-123039-cortafuegos-atacados` (70), `cuentas-github-robadas-roban-secretos-ci` (69), `railway-fireworks-robo-claves-api-ia`, `openssh-sshole-cve-2026-123158-alpine-linux`, `asistente-ia-documentos-empresa-fuga-de-datos`, `chatgpt-lockdown-mode-fallo-check-point` (67 cada uno), `videollamada-falsa-zoom-teams-facestealer-fbi`, `proxy-residencial-apps-que-pagan-por-compartir-internet`, `sonicwall-cve-2026-19868-vpn-saltar-mfa` (66). EN: `cursor-breach-fake-claude-code-extension` (76), `amadeus-data-breach-airlines-passengers` (68), `openssh-sshole-cve-2026-123158-alpine-linux-exploited` (68), `bossai-ai-agents-attack-taipei-emergency-services` y `credit-mutuel-arkea-cyberattack-service-provider` (67), `screenconnect-attack-rmm-plus-extension-it-providers` (66). Acortar a 65 o menos; para artículos publicados por el radar, ajustar el límite en el redactor.
4. **Baja.** `/es/flypet/probar` y `/en/flypet/probar`: title de 29 caracteres (mín. 30). Añadir una palabra.
5. **Baja.** El sitemap no incluye hreflang (sí está en el HTML). Opcional.

Sin errores en: HTTP 200 en las 126 URLs, canonical propio, hreflang es/en, og:image con 200 (todas), JSON-LD parseable, meta descriptions dentro de 160, robots.txt y llms.txt con 200. `llms.txt` lista los 53 artículos publicados del repo. No he comprobado enlaces internos rotos de forma exhaustiva en esta pasada (solo el estado de las 126 URLs del sitemap).

## Rendimiento

No medido: la API de PageSpeed devuelve 429 RESOURCE_EXHAUSTED para `/es`, `/es/training` y el artículo reciente. Quinta semana consecutiva sin dato. Hace falta una clave de API (`&key=`) en el entorno de la rutina; `www.googleapis.com` ya está permitido.

## Propuestas por artículo

No he podido releer los 53 artículos contra fuentes oficiales en esta pasada; priorizo los que tienen datos de Search Console.

- **Fraude del CEO (ES/EN):** EN en pos. 16-22 con 262 impresiones. Ya existen los artículos de ejemplos reales y deepfake de voz: enlazarlos desde el artículo base (comprobar antes si ya lo están), y añadir DMARC/SPF/DKIM como medida técnica, además de la doble aprobación y el "colgar y volver a llamar". Citar la guía de INCIBE para pymes.
- **Neveras de supermercados (ES/EN):** la mejor página en impresiones (457 + 244). Mantener "Última actualización" con fecha, verificar países afectados y cifras contra agencias, y priorizar la reescritura de la seoDescription.
- **Prompt injection (ES/EN):** ES pos. 50,6, "inyección de prompts" en 93. Reescribir la apertura con definición en 2 líneas, directa vs indirecta, defensas por capas (mínimo privilegio, separar instrucciones de datos, aprobación humana en acciones sensibles) y OWASP LLM01, reconociendo que no hay defensa infalible. Es lo que ofrecen las fuentes que dominan (Trend Micro, Cloudflare, Cyberhaven). Enlazar con el artículo de inyección indirecta y OWASP.
- **Prompt injection indirecta (ES/EN):** EN pos. 49,9 con 90 impresiones. Ejemplo concreto con calendario o correo en el primer párrafo.
- **GEO (ES/EN):** ES en pos. 57,9, "qué es geo" en 91,5. Añadir (si faltan) "GEO vs SEO", "cómo salir en ChatGPT" y "cómo medirlo"; enlazar desde la home y `/training`.
- **WhatsApp (ES/EN):** CTR 0 con pos. 8,4. Aplicar title y seoDescription propuestos y abrir con lista numerada de pasos.
- **CRA (EN):** pos. 13,4 en "cyber resilience act news". Bloque de novedades fechado.
- **Agentes de IA con demasiados permisos (EN):** pos. 8,6 para una pregunta literal. Añadir la pregunta como H2 con respuesta de 2-3 líneas.
- **AI Act artículo 4 (ES/EN):** pos. 34-79. Sigue pendiente verificar contra EUR-Lex y la Comisión el efecto del Digital Omnibus sobre la obligación; no he leído texto oficial completo esta semana. No cambiar nada sin esa fuente.

## GEO

Esta semana solo he podido hacer 2 de las 5 búsquedas (en un buscador general, no ChatGPT ni Perplexity). jorgegraells.com no aparece en las vistas devueltas en ninguna de las dos.

| Consulta | Aparece | Dominan | Lo que tienen y Jorge no |
| --- | --- | --- | --- |
| qué es prompt injection cómo prevenirla empresas | No | Trend Micro, Cloudflare, Cyberhaven, tec5, Bloka, QualityDevs, Wikipedia | Autoridad de marca, definición directa/indirecta al principio, lista de defensas por capas, mención a OWASP LLM01 |
| fraude del CEO cómo detectarlo y evitarlo empresas | No | INCIBE, Tarlogic, Aitana, Veridas, abogados | Guía oficial de INCIBE, enfoque pyme, señales de alarma concretas (IBAN, urgencia, festivos), protocolo de doble aprobación |

Las otras 3 consultas de la semana pasada (GEO, formación bonificada, neveras) siguen sin presencia según el informe anterior. Mejor oportunidad: prompt injection en español y fraude del CEO en inglés.

## Temas sugeridos para el redactor

1. "Qué hacer si has caído en el fraude del CEO: pasos en las primeras 24 horas" (consultas "prevent ceo fraud" 13 impr., "ceo fraud prevention" 15, "ceo phishing email" 9).
2. "GEO vs SEO: diferencias y qué hacer primero" (consultas "qué es geo" 20 y "geo" 16).
3. "Cómo proteger tu aplicación del prompt injection, paso a paso" (consultas "inyección de prompts" 17, "prevenir inyección de prompts" 10, "ataques prompt injection" 13).
4. "Alfabetización en IA para empleados: qué exige el AI Act y cómo formarlos" (consulta "alfabetización ia empleados", 10 impr., pos. 92,9; enlaza con `/training`).
5. "Por qué los agentes de IA tienen demasiados permisos y cómo limitarlos" (consulta "why are most ai agents over-permissioned?", 14 impr., pos. 8,6): solo si se añade como sección al artículo existente no basta.

## Qué se arregló desde el informe anterior

- Indexación: de 74 de 82 a 115 de 120. Los 8 artículos señalados (Iberostar, DMARC, SonicWall ES/EN y Crédit Mutuel ES) ya están indexados.
- Publicados los artículos de ejemplos reales de fraude del CEO y deepfake de voz, que eran temas sugeridos; el primero ya recibe clics (CTR 11 %).
- `llms.txt` sincronizado con los 53 artículos publicados.
- Sigue pendiente: doble `<h1>`, `/es` duplicada, medición de PageSpeed, reescrituras de prompt injection y GEO, verificación del artículo 4 del AI Act, propuestas de CTR de la semana pasada, títulos largos (ahora 16, antes 3).
