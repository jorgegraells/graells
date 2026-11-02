# Informe SEO y GEO semanal

Fecha: 2026-11-02

## Resumen

- Search Console: 455 impresiones y 2 clics en 28 días (antes 116 y 4). Posición media 21,0 (antes 46,5). Las impresiones se cuadruplican, pero casi nada se pulsa (CTR 0,4 %).
- Indexación: 40 de 44 páginas indexadas (antes 14 de 22). Quedan 3 artículos nuevos sin rastrear y `/es` como duplicada.
- Técnica: 44 URLs del sitemap, todas con 200. Solo 3 avisos menores (2 títulos EN largos, 1 description larga). `llms.txt` lista los 15 artículos publicados. PageSpeed sigue sin medirse por cuota.

## Top 3 acciones de esta semana

1. Solicitar indexación de los 3 artículos nuevos que Google no conoce (enlaces abajo): fraude del CEO (EN), prompt injection indirecta (ES y EN). El de prompt injection indirecta ataca justo la consulta que más impresiones da.
2. Mejorar el CTR del artículo de WhatsApp (108 impresiones, pos. 7,8, 0 clics) y del EN (37 impr., pos. 11,4): nuevo title y seoDescription con la consulta al principio y los pasos inmediatos (propuestas abajo).
3. Subir el artículo de GEO (72 impresiones, pos. 59,8): añadir secciones "GEO vs SEO" y "cómo salir en ChatGPT" (si no existen ya) y enlazarlo desde la home y `/training`.

## Indexación en Google

40 de 44 indexadas. Sin indexar (abrir el enlace y pulsar "Solicitar indexación"):

- /es: Duplicada, Google prefiere `https://jorgegraells.com/`. Último rastreo 2026-10-30. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=dsikRlC6hKX_VQvMV9FyZA&utm_medium=link&utm_source=api)
- /en/blog/ceo-fraud-how-to-spot-it: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=KOQUyw8D1Mh1LOrx5EkrMA&utm_medium=link&utm_source=api)
- /es/blog/prompt-injection-indirecta-ejemplos-y-como-prevenirla: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=xbFU2vlHoM2zCK7za_PGCA&utm_medium=link&utm_source=api)
- /en/blog/indirect-prompt-injection-examples-and-prevention: no reconocida, nunca rastreada. [Abrir en Search Console](https://search.google.com/search-console/inspect?resource_id=https://jorgegraells.com/&id=O4R39p8jPlq2MwTT8LX-_g&utm_medium=link&utm_source=api)

## Search Console (2026-10-03 a 2026-10-30, frente a los 28 días anteriores)

| | Ahora | Antes |
| --- | --- | --- |
| Clics | 2 | 4 |
| Impresiones | 455 | 116 |
| CTR | 0,4 % | 3,4 % |
| Posición media | 21,0 | 46,5 |

- Consultas: "prompt injection" 42 impr. (pos. 27,4); "geo chatgpt" 10 (pos. 89); "geo seo" 9 (pos. 33,9); "qué es geo" y variantes unas 18 (pos. 86-92); "geo" 7 (pos. 15); "what is prompt injection" 6 (pos. 61,7); "phishing steal pw" 4 (pos. 5); "prevenir inyección de prompts" 4 (pos. 48,8); "binance official statement $6.3 billion hack" 2 (pos. 5).
- Páginas con más impresiones: WhatsApp ES 108 (pos. 7,8); GEO ES 72 (pos. 59,8); prompt injection EN 71 (pos. 26,9); Binance ES 48 (1 clic, pos. 8,2); WhatsApp EN 37 (pos. 11,4); Binance EN 31 (pos. 9,4); prompt injection ES 21 (pos. 30,5).
- Evolución frente al informe anterior: WhatsApp pasa de no indexado a 108 impresiones en pos. 7,8; GEO ES sigue estancado (pos. 60-64); prompt injection EN no se mueve (pos. 25,7 a 26,9), señal de que la reescritura propuesta aún no se ha hecho.
- Oportunidades 4-20 (la herramienta lista dos): GEO ES con la consulta "geo" (7 impr., pos. 15) y phishing EN con "phishing steal pw" (4 impr., pos. 5). Por página, también WhatsApp ES/EN, Binance ES/EN, claude-ha-caido (pos. 7), `/es/training` (pos. 3,4).
- CTR bajo, propuestas (máx. 155 caracteres, consulta al principio):
  - WhatsApp ES, title: "Me han hackeado el WhatsApp: qué hacer en 10 minutos". seoDescription: "Me han hackeado el WhatsApp: cierra dispositivos vinculados, recupera la cuenta por SMS, activa la verificación en dos pasos y avisa a tus contactos."
  - WhatsApp EN, seoDescription: "WhatsApp hacked? Log out linked devices, re-register with your SMS code, turn on two-step verification and warn your contacts. Steps in 10 minutes."
  - Binance ES/EN (48 y 31 impr., pos. 8-9): poner en el title la cifra y la fecha ("Hackeo a Binance: robo de 6.300 millones, qué se sabe") y citar la nota oficial de Binance en la primera línea, ya que la consulta "binance official statement" aparece.
  - GEO ES, seoDescription: "Qué es GEO (Generative Engine Optimization), en qué se diferencia del SEO y cómo conseguir que ChatGPT y Perplexity citen tu web."
  - Prompt injection EN, seoDescription: "Prompt injection: what it is, direct vs indirect attacks, real examples and how to defend your company's LLM apps."
- Consultas sin artículo propio que las responda bien: "geogreeting" (5 impr., ruido, ignorar); "cómo proteger tu aplicación web del prompt injection" (2 impr., pos. 18, cubierta a medias por el nuevo artículo de prevención, comprobar que incluya aplicaciones web).

## Problemas técnicos (por gravedad)

1. **Media.** `/es` figura como duplicada: Google prefiere `/`. `/` redirige a `/es`; hacer que redirección, canonical y sitemap apunten a la misma URL (redirección permanente 308 y sitemap con la elegida), o que `/` sirva el español directamente.
2. **Baja.** `/en/blog/openai-google-shared-robots-txt-ai-training-signal`: title de 67 caracteres (máx. 65). Acortar 2 o más.
3. **Baja.** `/en/blog/safepay-ransomware-how-to-protect-your-company`: title de 66 caracteres. Acortar 1 o más.
4. **Baja.** `/en/editorial-policy`: meta description de 166 caracteres (máx. 160). Y `/es/politica-editorial` y `/en/editorial-policy` no tienen og:image. Añadir la imagen social por defecto.
5. **Baja.** El sitemap no incluye hreflang (sí está en el HTML). Opcional.

Sin enlaces internos rotos (44 enlaces únicos revisados), JSON-LD válido y un solo h1 en las 44 URLs, canonical propio y hreflang es/en en todas, robots.txt y llms.txt responden 200. `llms.txt` contiene los 15 artículos publicados en ambos idiomas (el borrador `claves-api-ia-robadas-llmjacking` correctamente fuera).

## Rendimiento

No medido otra vez: la API de PageSpeed Insights devolvió "Quota exceeded" para /es, /es/training y el artículo más reciente. Hace falta una clave de API (`&key=`) en el entorno de la rutina; `www.googleapis.com` ya está permitido.

## Propuestas por artículo

- **Prompt injection (ES/EN):** reescribir la apertura (definición en 2 líneas), directa vs indirecta, ejemplos, defensas (mínimo privilegio, aprobación humana para acciones sensibles, marcar contenido no confiable, controlar acciones y no solo texto) y mención a OWASP LLM01. Enlazar al nuevo artículo de prompt injection indirecta y a "agentes con demasiados permisos". Comprobar antes qué secciones existen.
- **Prompt injection indirecta (ES/EN, nuevo):** solo indexación. Enlazar desde el artículo base.
- **GEO (ES/EN):** ver acción 3. Citar el estudio académico original (noviembre de 2023), robots.txt y GPTBot, indexación en Bing.
- **WhatsApp (ES/EN):** ver CTR arriba. Los líderes (ESET, La Gaceta, Cronista) abren con los pasos y el tiempo; comprobar que el artículo empieza con una lista numerada y que cubre bloquear la SIM y denunciar.
- **AI Act artículo 4 (ES/EN):** hay fuentes que dicen que desde el 27 de julio de 2026 el Digital Omnibus cambia la obligación de las empresas a medidas de fomento; otras lo niegan. No he podido verificar el texto oficial del DOUE en esta pasada. Revisar el artículo contra EUR-Lex y las preguntas y respuestas de la Comisión Europea, y actualizar `dateModified`.
- **Claude ha caído / is down:** pos. 7 y 17. Mantener un bloque "Última comprobación" con fecha según la página de estado oficial.
- **Phishing EN:** pos. 5 con "phishing steal pw"; sin acción salvo indexar contenido relacionado.
- **Training:** pos. 3,4. Añadir pregunta frecuente de precio orientativo ("desde X €") y de bonificación FUNDAE (comprobar que no exista ya). Cautela: las cifras de crédito FUNDAE que circulan son de proveedores comerciales; citar solo FUNDAE.

## GEO

Búsquedas de esta pasada (buscador general, no ChatGPT ni Perplexity): jorgegraells.com no aparece en las vistas.

| Consulta | Aparece | Dominan | Lo que tienen y Jorge no |
| --- | --- | --- | --- |
| me han hackeado el whatsapp qué hacer | No | ESET, La Gaceta, Cronista, que.es | Pasos numerados al inicio, "primeros 10 minutos", marca de autoridad |
| qué es GEO posicionamiento en ChatGPT | No | blogs de agencias y herramientas (applabx, merchynt, promptwatch) | Definición breve, comparación con SEO, tácticas concretas; casi todo en inglés, hay hueco en español |
| prompt injection indirecta ejemplos cómo prevenirla | No | mindgard, aurascape, promptfoo, arXiv (todos en inglés) | Ejemplos reales (calendarios, base de conocimiento, correos), defensa centrada en acciones; en español casi no hay competencia |
| alfabetización en IA artículo 4 AI Act obligaciones empresas | No | El Independiente, LegalToday, Sage, Osborne Clarke, Ecija | Citas legales, fecha de aplicación, análisis del Digital Omnibus |
| formación en IA para empresas bonificada FUNDAE | No | tecnociminnova, upliora, javadex, factorial | Calculadora de crédito, requisitos, catálogo, comparativas |

Mejor oportunidad: prompt injection en español, donde dominan fuentes inglesas.

## Temas sugeridos para el redactor

1. "Cómo proteger tu aplicación web del prompt injection" (consultas "cómo proteger tu aplicación web del prompt injection", "prevenir inyección de prompts").
2. "GEO vs SEO: diferencias y qué hacer primero" (consultas "geo seo", 9 impr.; "posicionamiento geo").
3. "Cómo salir en ChatGPT: guía práctica de GEO" (consulta "geo chatgpt", 10 impr.).
4. "Qué es el OWASP LLM Top 10 explicado para empresas" (consulta "ataques prompt injection", ligada a OWASP LLM01).
5. "Phishing que roba contraseñas: cómo reconocerlo" (consulta "phishing steal pw", pos. 5; versión en español).

## Qué se arregló desde el informe anterior

- Indexación: de 14 a 40 de 44 páginas. WhatsApp, phishing, AI Act artículo 4 y GEO EN ya están indexados.
- Los 8 artículos que había sin indexar quedan en 3 nuevos (publicados esta semana).
- Títulos y descriptions: el resto del sitio está en rango; solo quedan los 3 avisos menores de arriba.
- `llms.txt` pasa de 7 a 15 artículos, sincronizado.
- Sigue pendiente: `/es` duplicada, medición de PageSpeed (cuota), reescrituras de prompt injection y GEO.
