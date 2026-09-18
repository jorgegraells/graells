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

/** Los artículos se escriben sin `readingMinutes`: se calcula del cuerpo. */
type ArticleData = Omit<Article, "readingMinutes">;

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const es: ArticleData[] = [
  {
    slug: "que-es-geo-posicionar-web-en-respuestas-de-ia",
    title:
      "Qué es el GEO y cómo hacer que tu web salga en las respuestas de ChatGPT, Perplexity y Gemini",
    description:
      "El GEO (Generative Engine Optimization) es estructurar tu web para que las IAs la citen al redactar sus respuestas. No buscas rankear en una lista de enlaces: buscas ser la fuente que el modelo elige. Estas son las técnicas que funcionan en 2026.",
    date: "2026-07-08",
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
  {
    slug: "los-ataques-no-entran-por-el-servidor",
    title: "Los ataques no entran por el servidor: entran por un correo",
    description:
      "Llevo años parando ataques reales en una empresa industrial y casi ninguno empezó en una máquina: empezaron en una persona. Esto es lo que cualquier plantilla debería saber para no ser la puerta de entrada.",
    date: "2026-09-17",
    tags: ["Ciberseguridad", "Phishing", "Empresas"],
    body: `La mayoría de los ciberataques a empresas no empiezan con alguien reventando un firewall desde un sótano. Empiezan con un correo normal y corriente que una persona del equipo abre un martes cualquiera a media mañana. Lo sé porque llevo años como responsable de seguridad informática en una empresa industrial, y de todos los ataques que he visto de cerca, casi ninguno atacó una máquina. Atacaron a una persona.

Esa es la parte incómoda: puedes gastarte una fortuna en tecnología y seguir expuesto, porque el atacante no va a pelearse con tu firewall si puede convencer a alguien de tu plantilla de que le abra la puerta.

## Por qué van a por las personas y no a por las máquinas

Es pura economía. Romper un sistema bien protegido cuesta tiempo, dinero y conocimientos. Engañar a una persona cuesta un correo. El atacante moderno no "hackea": suplanta, presiona y convence. Se hace pasar por un proveedor, por un banco, por tu jefe. Y le basta con que funcione una vez de cada mil, porque enviar mil correos es gratis.

Por eso la seguridad de una empresa no la marca su tecnología, la marca la persona menos preparada que tenga acceso a un correo. Y eso no se arregla comprando otra caja: se arregla entrenando.

## El phishing de 2026 ya no tiene faltas de ortografía

Durante años la señal clásica era la redacción torpe: si el correo estaba mal escrito, era fraude. Esa pista ha muerto. Con la IA generativa, los correos fraudulentos llegan perfectos, en tu idioma, con el logo bien puesto y un contexto creíble. Y la cosa va más allá del texto: ya circulan fraudes con voces clonadas que suenan como tu director general pidiendo una transferencia urgente por teléfono.

La consecuencia es directa: si tu plantilla aprendió a detectar phishing hace cinco años, está entrenada para un enemigo que ya no existe.

## Las señales que sí siguen funcionando

La buena noticia es que hay señales que la IA no puede maquillar, porque son parte del propio engaño:

- **Urgencia más dinero o credenciales.** "Transferencia hoy mismo", "tu cuenta se bloquea en 24 horas". La prisa es la herramienta del atacante: existe para que no pienses.
- **El dominio real no cuadra.** El nombre visible puede decir lo que quiera; lo que importa es lo que hay detrás. Un correo de "Banco Santander" enviado desde un dominio raro es todo lo que necesitas ver.
- **El enlace no va donde dice.** Pasa el ratón por encima sin hacer clic y mira la dirección real. Si el texto dice una cosa y el enlace otra, ya está todo dicho.
- **Cambios de última hora en pagos.** El clásico: un "proveedor" avisa de que ha cambiado de cuenta bancaria justo antes de una factura. Este fraude lleva años arruinando empresas precisamente porque parece rutina.
- **Peticiones fuera del canal habitual.** Si tu jefe nunca te pide nada por SMS y hoy te pide ahí una compra de tarjetas regalo, no es tu jefe.

Y la regla de oro que resume todas: **ante la duda, verifica por otro canal**. Llama al número de siempre, no al que viene en el correo. Pregunta en persona. Treinta segundos de verificación desmontan el 99% de los engaños.

## Si alguien pica, las primeras horas lo son todo

Aquí va la parte que casi ninguna empresa hace bien: qué pasa después del clic. Si la persona que ha picado tiene miedo de la bronca, lo esconderá, y el atacante tendrá días para moverse por dentro. Si la cultura es "avisa rápido y no pasa nada", tendrás el incidente acotado en una hora: contraseña cambiada, sesión cortada, aviso al resto del equipo.

La persona que avisa a tiempo no es el problema. Es la que te salva.

## El mínimo que toda plantilla debería tener

No hace falta convertir a nadie en técnico. Con cuatro hábitos se elimina la mayoría del riesgo real:

1. **Doble factor** activado en correo y en todo lo que toque dinero o datos.
2. **Gestor de contraseñas**: una contraseña distinta por servicio sin tener que memorizar ninguna.
3. **Verificar por segundo canal** cualquier petición de dinero, credenciales o cambios de cuenta.
4. **Saber a quién avisar**, y que avisar sea siempre seguro.

## Esto se entrena

Nada de lo anterior es difícil. Lo difícil es que cale en toda la plantilla, del taller a dirección, y que se mantenga fresco cuando los fraudes cambian cada año. Esa es exactamente la parte a la que me dedico: doy [formación en ciberseguridad para empresas](/es/training), pensada para que la entienda todo el mundo, no solo el equipo técnico, con los casos y las señales que he visto funcionar en el mundo real.

Porque el firewall hay que tenerlo, claro. Pero el día que llegue el correo bueno, lo que va a proteger tu empresa es que la persona que lo abra sepa lo que está mirando.`,
  },
];

const en: ArticleData[] = [
  {
    slug: "what-is-geo-rank-your-website-in-ai-answers",
    title:
      "What is GEO and how to get your website into ChatGPT, Perplexity and Gemini answers",
    description:
      "GEO (Generative Engine Optimization) is structuring your website so AI engines cite it when they write answers. You're not chasing a spot in a list of links: you're chasing being the source the model picks. Here are the techniques that work in 2026.",
    date: "2026-07-08",
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
  {
    slug: "attacks-dont-come-in-through-the-server",
    title: "Attacks don't come in through the server: they come in through an email",
    description:
      "I've spent years stopping real attacks at an industrial company and almost none of them started on a machine: they started with a person. This is what every team should know so nobody becomes the way in.",
    date: "2026-09-17",
    tags: ["Cybersecurity", "Phishing", "Business"],
    body: `Most cyberattacks on companies don't start with someone cracking a firewall from a basement. They start with a perfectly ordinary email that somebody on the team opens on a random Tuesday mid-morning. I know because I've spent years as the IT security lead of an industrial company, and of all the attacks I've seen up close, almost none went after a machine. They went after a person.

That's the uncomfortable part: you can spend a fortune on technology and still be exposed, because the attacker won't fight your firewall if they can convince someone on your team to open the door.

## Why they target people, not machines

It's pure economics. Breaking into a well-protected system takes time, money and skill. Fooling a person takes one email. The modern attacker doesn't "hack": they impersonate, pressure and persuade. They pose as a supplier, a bank, your boss. And they only need it to work once in a thousand tries, because sending a thousand emails is free.

That's why a company's security isn't defined by its technology. It's defined by the least prepared person with access to an inbox. And you don't fix that by buying another box: you fix it with training.

## Phishing in 2026 no longer has typos

For years the classic tell was clumsy writing: if the email was badly written, it was a scam. That clue is dead. With generative AI, fraudulent emails arrive flawless, in your language, logo in place, with believable context. And it goes beyond text: there are already scams using cloned voices that sound like your CEO asking for an urgent transfer over the phone.

The consequence is direct: if your team learned to spot phishing five years ago, they're trained against an enemy that no longer exists.

## The signals that still work

The good news is that some signals can't be polished away by AI, because they're part of the scam itself:

- **Urgency plus money or credentials.** "Transfer today", "your account gets blocked in 24 hours". The rush is the attacker's tool: it exists so you don't think.
- **The real domain doesn't add up.** The display name can say anything; what matters is what's behind it. An email from "Bank of America" sent from some odd domain is all you need to see.
- **The link doesn't go where it says.** Hover without clicking and look at the real address. If the text says one thing and the link another, that's the whole story.
- **Last-minute changes to payments.** The classic: a "supplier" announces a new bank account right before an invoice is due. This scam has been ruining companies for years precisely because it looks like routine.
- **Requests outside the usual channel.** If your boss never texts you and today asks you by SMS to buy gift cards, that's not your boss.

And the golden rule that sums them all up: **when in doubt, verify through another channel**. Call the usual number, not the one in the email. Ask in person. Thirty seconds of checking dismantles 99% of the tricks.

## If someone falls for it, the first hours are everything

Here's the part almost no company gets right: what happens after the click. If the person who fell for it fears getting blasted, they'll hide it, and the attacker gets days to move around inside. If the culture is "report it fast and nothing happens to you", you'll have the incident contained within the hour: password changed, session cut, rest of the team warned.

The person who reports in time is not the problem. They're the one who saves you.

## The minimum every team should have

Nobody needs to become an engineer. Four habits remove most of the real risk:

1. **Two-factor authentication** on email and on anything touching money or data.
2. **A password manager**: a different password per service without memorizing any of them.
3. **Second-channel verification** for any request involving money, credentials or account changes.
4. **Knowing who to alert**, and making sure alerting is always safe.

## This can be trained

None of the above is hard. The hard part is making it stick across the whole team, from the shop floor to management, and keeping it fresh while the scams change every year. That's exactly what I do: I deliver [cybersecurity training for companies](/en/training), built so everyone gets it, not just the technical staff, with the cases and signals I've seen work in the real world.

You still need the firewall, of course. But the day the right email lands, what will protect your company is that the person opening it knows what they're looking at.`,
  },
];

const articles: Record<Locale, ArticleData[]> = { es, en };

function toArticle(a: ArticleData): Article {
  return { ...a, readingMinutes: readingMinutes(a.body) };
}

export function getArticles(locale: Locale): Article[] {
  return [...articles[locale]]
    .map(toArticle)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(locale: Locale, slug: string): Article | undefined {
  const a = articles[locale].find((x) => x.slug === slug);
  return a ? toArticle(a) : undefined;
}

export function getAllArticleParams(): { locale: Locale; slug: string }[] {
  return (Object.keys(articles) as Locale[]).flatMap((locale) =>
    articles[locale].map((a) => ({ locale, slug: a.slug })),
  );
}
