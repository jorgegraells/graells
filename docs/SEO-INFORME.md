# Informe SEO y GEO semanal

Fecha: 2026-10-27 (primer informe, no hay anterior con el que comparar).

## Resumen

- Search Console: 202 impresiones y 2 clics en 28 días (antes 70 y 2). La posición media mejora de 64,3 a 34,9, pero casi nada se pulsa.
- Técnica: las 18 URLs del sitemap responden 200, con canonical, hreflang, JSON-LD y un solo h1, salvo los fallos de abajo. `llms.txt` lista los 5 artículos publicados.
- Los títulos de los artículos son demasiado largos y la descripción de la home es el doble de lo permitido.

## Top 3 acciones de esta semana

1. Acortar el `<title>` del artículo de GEO (109 caracteres, 67 impresiones, posición 64): empezar por "Qué es GEO". Ahora Google lo corta y no coincide con la consulta "qué es geo".
2. Reescribir title y seoDescription de `/en/blog/what-is-prompt-injection` (62 impresiones, posición 25,7, 0 clics) y de `/es/blog/que-es-prompt-injection` (posición 29). Prompt injection es la consulta con más impresiones (40).
3. Recortar la meta description de la home (ES 248, EN 238 caracteres) y de `/es/training` (179) a 155 o menos.

## Search Console (28 días: 2026-09-27 a 2026-10-24)

| | Ahora | Antes |
| --- | --- | --- |
| Clics | 2 | 2 |
| Impresiones | 202 | 70 |
| CTR | 1,0 % | 2,9 % |
| Posición media | 34,9 | 64,3 |

- Consultas: "prompt injection" 40 impresiones (pos. 27,5); "geo chatgpt" 11 (pos. 89); "qué es geo" y variantes unas 21 en total (pos. 86-90); "geo seo" 4 (pos. 31); "prevenir inyección de prompts" 3 (pos. 57); "claude caído" pos. 1 y "claude error" pos. 29,5.
- Páginas con más impresiones: artículo GEO ES (67), prompt injection EN (62), claude-ha-caido (19, 1 clic, pos. 7,4), claude-is-down (18, pos. 11,2).
- Oportunidades en posición 4-20: la herramienta no lista ninguna, pero por página sí hay: `/es/blog/claude-ha-caido` (7,4), `/en/blog/claude-is-down` (11,2), `/es/blog/los-ataques-no-entran-por-el-servidor` (5,4), `/es/training` (4,5) y `/en/training` (4,8).
- CTR bajo: artículo GEO ES (67 impr.) y prompt injection EN (62 impr.).

## Problemas técnicos (por gravedad)

1. **Media.** Títulos largos (limite 65 caracteres con el sufijo " — Jorge Graells"): GEO ES 109, GEO EN 99, ataques EN 87, prompt injection EN 76, ataques ES 75, AI Act EN 74, AI Act ES 70, prompt injection ES 69. Arreglo: `title` corto (50-55 caracteres) y dejar el sufijo solo si cabe.
2. **Media.** Meta description demasiado larga: `/es` 248, `/en` 238, `/es/world` 248, `/en/world` 238, `/es/training` 179. Arreglo: máx. 155 en `src/i18n/dictionaries.ts`.
3. **Media.** `/es/world` y `/en/world` tienen canonical hacia `/es` y `/en` (decisión probable para no indexar el mundo 3D, pero están en el sitemap y reciben impresiones: 13 en `/es/world`). Arreglo: quitarlas del sitemap o darles canonical propio.
4. **Baja.** `/es/world` y `/en/world` no tienen h1 (es un canvas 3D). Añadir un h1 visible para lectores de pantalla (`sr-only`).
5. **Baja.** Los títulos de `/es/blog` y `/en/blog` miden 25 y 24 caracteres (mínimo 30). Añadir un descriptor.
6. **Falso positivo a vigilar.** En una petición `/en` el chequeo de `og:image` dio error de red una vez; `https://jorgegraells.com/og.jpg` responde 200 al repetirlo.

Sin enlaces internos rotos, sin JSON-LD inválido, hreflang es/en presentes, robots.txt OK (bloquea /admin y /api).

## Rendimiento móvil

No se pudo medir: la API de PageSpeed Insights devolvió "Quota exceeded" para las tres URLs (/es, /es/training, /es/blog/claude-ha-caido). Probar con una clave de API propia (`&key=`) y el dominio `www.googleapis.com` ya permitido.

## Propuestas por artículo

- **Qué es GEO (ES/EN):** title "Qué es GEO y cómo salir en ChatGPT y Perplexity" y seoDescription "Qué es GEO (Generative Engine Optimization), en qué se diferencia del SEO y qué técnicas funcionan en 2026 para que la IA cite tu web." Añadir sección "GEO vs SEO" con pregunta literal y una definición de 2 líneas al inicio, y una sección sobre "geo chatgpt". Enlazar desde la home y desde /training.
- **Prompt injection (ES/EN):** title "Prompt injection: qué es y cómo protegerse" (ES) y "What is prompt injection? How to protect your company" (EN). Añadir secciones "Directa vs indirecta", "Ejemplos reales" y "Cómo prevenirla" (cubre "prevenir inyección de prompts" y "ataques prompt injection"). Enlazar a "los ataques no entran por el servidor".
- **Claude ha caído:** es la que mejor posiciona (pos. 1 a 8). Mantener el artículo actualizado: la página oficial de estado y el historial de septiembre cambian. Añadir un bloque "Última comprobación" con fecha y las caídas posteriores al 29 de septiembre, y una sección "Claude error: qué significa" (consulta "claude error", pos. 29,5).
- **Ataques no entran por el servidor:** pos. 5,4 con 5 impresiones; title de 75 caracteres a recortar y enlazar hacia prompt injection.
- **AI Act artículo 4:** las fuentes actuales discrepan sobre el efecto del Digital Omnibus (obligación de medios frente a resultado, texto pendiente del DOUE en junio de 2026). Comprobar el texto publicado en el DOUE y actualizar la fecha de modificación. Sin datos de Search Console todavía.
- **Training:** pos. 4,5 y 4,8 con pocas impresiones. Recortar la descripción ES y añadir una pregunta frecuente de precio orientativo y FUNDAE (los competidores publican rangos y bonificación).

## GEO (búsquedas hechas)

Ninguna de las 5 consultas mostró jorgegraells.com en los 8-10 primeros resultados del buscador usado.

| Consulta | Aparece | Dominan | Lo que tienen y Jorge no |
| --- | --- | --- | --- |
| qué es GEO posicionamiento en respuestas de IA | No | agencias (cangrejodigital, tenten, americanindustrialmagazine) | Autoridad de dominio, ejemplos con marcas y medición |
| qué es prompt injection | No | Trend Micro, SentinelOne, WeLiveSecurity | Dominio con autoridad, definición clara arriba, tipos, mitigación |
| formación IA empresas artículo 4 AI Act | No | elindependiente, legaltoday, osborneclarke, upliora | Citas de despacho y prensa, texto del Omnibus verificado |
| claude caído hoy | No | NeuralTrust, Xataka, medios | Páginas con histórico de incidencias |
| formación IA empresas precio | No | Global Knowledge, javadex, upliora | Rangos de precio, FUNDAE, comparativas |

Solo se hicieron 5 búsquedas con una herramienta de búsqueda general, no con ChatGPT ni Perplexity, así que la presencia en respuestas de IA no se midió.

## Temas sugeridos para el redactor

1. "Prompt injection indirecta: ejemplos reales y cómo prevenirla" (consultas: "prevenir inyección de prompts", "ataques prompt injection").
2. "GEO vs SEO: diferencias y qué hacer primero" (consultas: "geo seo", "posicionamiento geo").
3. "Cómo salir en ChatGPT: guía práctica de GEO" (consulta: "geo chatgpt", 11 impresiones).
4. "Claude da error: qué significa y cómo resolverlo" (consultas: "claude error", "claude degradation").
5. "GEO para inteligencia artificial en pymes: checklist" (consulta: "geo inteligencia artificial").

## Qué se arregló desde el informe anterior

No hay informe anterior (primera auditoría).
