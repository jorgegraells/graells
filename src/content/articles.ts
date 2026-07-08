import type { Locale } from "@/i18n/dictionaries";

export type Article = {
  slug: string;
  title: string;
  /** Respuesta directa / lead — también se usa como meta description y subtítulo. */
  description: string;
  date: string; // ISO
  readingMinutes: number;
  tags: string[];
  body: string; // Markdown
};

const es: Article[] = [
  {
    slug: "que-es-geo-posicionar-web-en-respuestas-de-ia",
    title:
      "Qué es el GEO y cómo hacer que tu web salga en las respuestas de ChatGPT, Perplexity y Gemini",
    description:
      "El GEO (Generative Engine Optimization) es estructurar tu web para que las IAs la citen al redactar sus respuestas. No buscas rankear en una lista de enlaces: buscas ser la fuente que el modelo elige. Estas son las técnicas que funcionan en 2026.",
    date: "2026-07-08",
    readingMinutes: 7,
    tags: ["GEO", "SEO", "IA", "LLM"],
    body: `El **GEO (Generative Engine Optimization)** es la práctica de estructurar tu web para que los motores de respuesta de IA —ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews o Bing Copilot— la **citen dentro de sus respuestas**. A diferencia del SEO clásico, no compites por un puesto en una lista de diez enlaces azules: compites por ser **la fuente que el modelo elige** cuando redacta.

Cada vez más gente no busca "diez resultados": le pregunta a una IA y lee **una sola respuesta**. Si tu web no está en esa respuesta, para ese usuario no existes. El GEO es cómo entrar en ella.

## GEO vs SEO: en qué se diferencian

No son opuestos, son capas. El SEO sigue importando (muchos motores de IA se apoyan en el índice de búsqueda), pero el GEO añade requisitos nuevos.

| | SEO clásico | GEO |
|---|---|---|
| Objetivo | Rankear en la lista de resultados | Ser citado en la respuesta generada |
| Unidad | La página | El **pasaje** extraíble |
| Gana | Enlaces + autoridad + keywords | Claridad + estructura + datos citables |
| Lo lee | Googlebot | GPTBot, PerplexityBot, ClaudeBot… |

## Cómo eligen las IAs a quién citar

Un motor generativo hace, por debajo, un proceso de recuperación (RAG): busca pasajes relevantes, los evalúa y **cita los que puede extraer con confianza**. Si tu contenido es ambiguo, está enterrado tras JavaScript o no tiene estructura, el modelo lo **salta** para no arriesgarse a alucinar. Premia lo contrario: respuestas directas, datos concretos y marcado que deje claro qué es cada cosa.

## Técnicas que funcionan en 2026

### 1. Deja entrar a los crawlers de IA

El error más común es **bloquearlos sin querer** (muchos plugins de seguridad lo hacen por defecto). Si tu \`robots.txt\` no deja pasar a GPTBot, PerplexityBot o ClaudeBot, estás renunciando a aparecer en sus respuestas. Permítelos explícitamente:

\`\`\`txt
User-agent: GPTBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
\`\`\`

### 2. Publica un llms.txt

El estándar emergente **\`llms.txt\`** es un índice limpio de tu sitio pensado para modelos: quién eres, qué ofreces y tus páginas clave, en texto plano y fácil de extraer. Es para las IAs lo que el sitemap es para Google.

### 3. Datos estructurados (JSON-LD)

El marcado **Schema.org** en JSON-LD le dice a la máquina qué es cada entidad (una persona, un producto, un artículo). Las páginas con **tres o más tipos de schema muestran ~13% más probabilidad de ser citadas** por un LLM. Define tu entidad, no la dejes adivinar.

### 4. Responde primero, adorna después

El dato más accionable de los estudios GEO: **el 44% de las citas salen del primer 30% de la página**. Sustituye la intro florida por una **respuesta directa y autosuficiente en las primeras 60 palabras**, y luego expande. Una sección = una pregunta, con encabezados \`H2\`/\`H3\` claros.

### 5. Renderiza en el servidor

Los crawlers de IA **no ejecutan como un navegador**: leen el HTML que devuelve tu servidor. Si tu contenido aparece por JavaScript después de cargar, para ellos **no existe**. Usa renderizado en servidor o generación estática para todo lo importante.

### 6. Aporta datos y cifras

Añadir **estadísticas y cifras concretas** fue, en los estudios, el mayor impulso de visibilidad. La IA prefiere citar fuentes específicas y verificables antes que afirmaciones vagas.

## Checklist rápido

- [ ] \`robots.txt\` permite los crawlers de IA
- [ ] \`llms.txt\` publicado en la raíz
- [ ] JSON-LD con tu entidad (3+ tipos)
- [ ] Respuesta directa en las primeras 60 palabras
- [ ] Estructura \`H1\` → \`H2\` → \`H3\`, una idea por sección
- [ ] Renderizado en servidor / HTML estático
- [ ] Datos, cifras y ejemplos concretos

## Conclusión

El GEO no reemplaza al SEO: lo amplía para un mundo donde la mayoría de las respuestas las redacta una IA. La buena noticia es que casi todo se reduce a **claridad y estructura** — hacer tu contenido fácil de leer para una máquina suele hacerlo mejor también para las personas.

Esta web aplica todo lo anterior. Y es justo el problema que resuelve **EchoGEO**, una de las herramientas que estoy construyendo: medir si una marca aparece en las respuestas de IA y qué hacer para salir citada.`,
  },
];

const en: Article[] = [
  {
    slug: "what-is-geo-rank-your-website-in-ai-answers",
    title:
      "What is GEO and how to get your website into ChatGPT, Perplexity and Gemini answers",
    description:
      "GEO (Generative Engine Optimization) is structuring your website so AI engines cite it when they write answers. You're not chasing a spot in a list of links: you're chasing being the source the model picks. Here are the techniques that work in 2026.",
    date: "2026-07-08",
    readingMinutes: 7,
    tags: ["GEO", "SEO", "AI", "LLM"],
    body: `**GEO (Generative Engine Optimization)** is the practice of structuring your website so AI answer engines —ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews or Bing Copilot— **cite it inside their answers**. Unlike classic SEO, you're not competing for a slot in a list of ten blue links: you're competing to be **the source the model picks** when it writes.

More and more people don't scan "ten results" anymore: they ask an AI and read **one answer**. If your site isn't in that answer, to that user you don't exist. GEO is how you get in.

## GEO vs SEO: what's different

They're not opposites, they're layers. SEO still matters (many AI engines lean on the search index), but GEO adds new requirements.

| | Classic SEO | GEO |
|---|---|---|
| Goal | Rank in the results list | Get cited in the generated answer |
| Unit | The page | The extractable **passage** |
| Wins with | Links + authority + keywords | Clarity + structure + citable data |
| Read by | Googlebot | GPTBot, PerplexityBot, ClaudeBot… |

## How AIs decide who to cite

Under the hood, a generative engine runs a retrieval step (RAG): it finds relevant passages, scores them and **cites the ones it can extract with confidence**. If your content is ambiguous, buried behind JavaScript or unstructured, the model **skips it** to avoid hallucinating. It rewards the opposite: direct answers, concrete data and markup that makes clear what each thing is.

## Techniques that work in 2026

### 1. Let the AI crawlers in

The most common mistake is **blocking them by accident** (many security plugins do it by default). If your \`robots.txt\` doesn't allow GPTBot, PerplexityBot or ClaudeBot, you're opting out of their answers. Allow them explicitly:

\`\`\`txt
User-agent: GPTBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
\`\`\`

### 2. Publish an llms.txt

The emerging **\`llms.txt\`** standard is a clean, model-friendly index of your site: who you are, what you offer and your key pages, in plain, easy-to-extract text. It's to AIs what the sitemap is to Google.

### 3. Structured data (JSON-LD)

**Schema.org** markup in JSON-LD tells the machine what each entity is (a person, a product, an article). Pages with **three or more schema types show ~13% higher LLM citation probability**. Define your entity, don't make it guess.

### 4. Answer first, decorate later

The most actionable finding from GEO studies: **44% of citations come from the first 30% of a page**. Replace the flowery intro with a **direct, self-contained answer in the first 60 words**, then expand. One section = one question, with clear \`H2\`/\`H3\` headings.

### 5. Render on the server

AI crawlers **don't run like a browser**: they read the HTML your server returns. If your content appears via JavaScript after load, to them it **doesn't exist**. Use server rendering or static generation for anything that matters.

### 6. Bring data and numbers

Adding **concrete statistics and figures** was, in the studies, the single biggest visibility lift. AIs prefer to cite specific, verifiable sources over vague claims.

## Quick checklist

- [ ] \`robots.txt\` allows AI crawlers
- [ ] \`llms.txt\` published at the root
- [ ] JSON-LD with your entity (3+ types)
- [ ] Direct answer in the first 60 words
- [ ] \`H1\` → \`H2\` → \`H3\` structure, one idea per section
- [ ] Server-rendered / static HTML
- [ ] Concrete data, numbers and examples

## Conclusion

GEO doesn't replace SEO: it extends it for a world where most answers are written by an AI. The good news is that almost all of it comes down to **clarity and structure** — making your content easy for a machine to read usually makes it better for people too.

This site applies everything above. And it's exactly the problem **EchoGEO** solves — one of the tools I'm building: measuring whether a brand shows up in AI answers and what to do to get cited.`,
  },
];

const articles: Record<Locale, Article[]> = { es, en };

export function getArticles(locale: Locale): Article[] {
  return [...articles[locale]].sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(locale: Locale, slug: string): Article | undefined {
  return articles[locale].find((a) => a.slug === slug);
}

export function getAllArticleParams(): { locale: Locale; slug: string }[] {
  return (Object.keys(articles) as Locale[]).flatMap((locale) =>
    articles[locale].map((a) => ({ locale, slug: a.slug })),
  );
}
