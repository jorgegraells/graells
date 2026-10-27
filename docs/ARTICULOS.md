# Guía editorial de artículos — jorgegraells.com

Esta guía la sigue cualquiera que escriba un artículo para el blog, incluido el
agente diario que deja borradores para que Jorge los revise. Las reglas de
contenido de `AGENTS.md` mandan sobre todo lo que hay aquí.

## Para qué sirve el blog

Atraer a dos tipos de lector y convencerles de que Jorge sabe de lo que habla:

1. **Empresas** (gerencia, RR. HH., responsables de equipo) que podrían
   contratar sus formaciones de ciberseguridad e IA (`/training`).
2. **Gente técnica y de producto** que llega buscando cómo hacer algo con IA.

Cada artículo responde de verdad a una pregunta que alguien escribe en Google o
en ChatGPT. Nada de relleno para "tener contenido".

## Quién es Jorge (para escribir en su voz)

AI Engineer y desarrollador full-stack en España. Más de 5 años como
responsable de seguridad informática en una empresa industrial (nunca se nombra
la empresa), deteniendo ataques reales. Construye asistentes de IA que trabajan
con el conocimiento completo de una empresa (RAG, agentes). Imparte
formaciones de ciberseguridad e IA para plantillas no técnicas; ya ha formado,
entre otras, a la plantilla de Rodmu. Proyectos públicos: WorkLeveling,
EchoGEO, ANTIDOP (ver `src/i18n/dictionaries.ts`).

## Temas (pilares)

Escoge siempre dentro de estos pilares, con ángulo práctico para empresas:

- **Ciberseguridad para plantillas**: phishing, fraude del CEO, contraseñas y
  MFA, ransomware, ingeniería social, deepfakes de voz, teletrabajo, móviles.
- **Seguridad de la IA**: prompt injection, fugas de datos en chatbots,
  agentes con permisos, shadow AI, políticas de uso de IA en la empresa.
- **IA aplicada en la empresa**: qué automatizar, RAG, agentes, cómo elegir
  modelo, costes, errores típicos al implantar IA, IA por departamento.
- **GEO / SEO en la era de la IA**: aparecer en ChatGPT, Perplexity y Gemini,
  llms.txt, datos estructurados.
- **Normativa práctica**: AI Act europeo, NIS2, Cyber Resilience Act,
  explicados para quien tiene que cumplirlos, no para abogados.
- **Actualidad con ángulo propio**: una caída, un ataque sonado o un
  lanzamiento importante de la semana, siempre con "qué significa para tu
  empresa y qué hacer".

## Antes de escribir

1. Lee los títulos de todos los JSON de `src/content/articles/` (borradores
   incluidos). **No repitas un tema ya cubierto**; como mucho, un ángulo nuevo
   claramente distinto que enlace al anterior.
2. **Anticípate.** Mira primero las señales tempranas (Hacker News, GitHub,
   arXiv, Hugging Face Papers, Reddit, prensa de seguridad rápida e
   investigadores como embracethered.com o simonwillison.net) y busca un tema
   que esté subiendo y del que en español aún haya poco escrito, como pasó con
   la prompt injection. Esas webs sirven para descubrir el tema, nunca como
   fuente de los datos. Elige una pregunta concreta que la gente vaya a buscar.
3. Comprueba los datos en fuentes fiables (organismos oficiales, OWASP, INCIBE,
   ENISA, documentación oficial de los fabricantes, medios reconocidos). Si un
   dato no se puede verificar, no va.

## Voz y estilo (no negociable)

- Español de España, natural, cálido y profesional. Primera persona cuando
  aporta ("cuando construyo un asistente me pregunto..."), sin abusar.
- **Prohibida la raya larga (—).** Usa comas, dos puntos o punto.
- Evita los tics que delatan texto de IA: "no es solo X, es Y", tríos pulidos
  de adjetivos, "en resumen", "en conclusión", "en el mundo actual", "sin
  duda", "cabe destacar", "sumérgete", "desbloquea", "potencia", exceso de
  negritas, listas para todo, preguntas retóricas en cadena.
- Párrafos cortos con ideas concretas. Ejemplos y escenarios realistas, no
  abstracciones.
- **Nunca inventes anécdotas, clientes, cifras, casos ni citas de Jorge.** Si
  quieres un ejemplo, plantéalo como escenario ("imagina que llega un correo
  que...") o como caso público verificable y citado.
- La versión inglesa se escribe en inglés natural, no traducción literal.
  Mismo contenido y estructura.

## Estructura

- **title**: con la palabra clave principal al principio, sin mayúsculas
  enteras, 45-70 caracteres. Ej.: "Prompt injection: qué es y cómo proteger a
  tu empresa".
- **description**: es la entradilla. Responde directamente a la pregunta en
  2-3 frases (máx. ~300 caracteres). Es lo que citan las IAs: tiene que
  entenderse sola.
- **seoDescription**: lo que sale en el resultado de Google. Máximo 155
  caracteres, con la palabra clave al principio y un gancho para hacer clic.
  Obligatoria si la description pasa de 160 caracteres.
- **body** (Markdown): 900-1.400 palabras.
  - Primer párrafo: engancha con el problema real del lector.
  - 5-8 secciones `##`. Varias en forma de pregunta tal como se busca ("¿Qué
    diferencia hay entre X e Y?").
  - Incluye las variantes con las que se busca en español (p. ej.
    "inyección de prompts" además de "prompt injection").
  - Una sección práctica de "qué hacer" (para la empresa y/o la plantilla).
  - Cierre breve con enlace natural a `/es/training` (o `/en/training`) si
    el tema encaja con las formaciones. Sin tono de anuncio.
  - 1-2 enlaces internos a otros artículos publicados cuando venga a cuento,
    y enlaces externos a las fuentes oficiales que cites.
- **slug**: sin tildes, en minúsculas con guiones, distinto en cada idioma
  (`que-es-x` / `what-is-x`). El archivo se llama `<slug-es>.json`.
- **tags**: 4-6, en minúsculas, por idioma.

## Formato del archivo

`src/content/articles/<slug-es>.json`:

```json
{
  "date": "AAAA-MM-DD",
  "draft": true,
  "es": { "slug": "...", "title": "...", "description": "...", "seoDescription": "...", "tags": ["..."], "body": "..." },
  "en": { "slug": "...", "title": "...", "description": "...", "seoDescription": "...", "tags": ["..."], "body": "..." }
}
```

Los borradores (`"draft": true`) no salen en la web, ni en el sitemap, ni en
los listados: solo en el panel `/admin`, donde Jorge los revisa, edita y pulsa
Publicar (eso quita el `draft`, pone la fecha del día y avisa a Bing).

Antes de dar un borrador por bueno:

```bash
node scripts/check-article.mjs src/content/articles/<slug-es>.json
```

Tiene que terminar sin errores.
