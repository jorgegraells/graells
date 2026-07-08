# Recetas de contenido — `src/i18n/dictionaries.ts`

Todo el texto visible de la web (landing Y mundo 3D) sale de este archivo.
Hay dos objetos espejo: `es` y `en`. **Cada cambio se hace en los dos.**

## Editar o añadir un proyecto

Los proyectos son `projects.items[]` (tipo `Project`). Campos:

| Campo | Uso |
|---|---|
| `slug` | clave interna estable, igual en ES y EN |
| `name` | nombre público (ojo regla VTEQ/SofIA de AGENTS.md) |
| `tagline` | una frase gancho (aparece en tarjeta y cartel del aldeano) |
| `description` | 2-3 frases: qué es y qué resuelve (línea 2 del diálogo del aldeano) |
| `highlight` | el dato que impresiona — SIN cifras comerciales (solo tarjeta, no diálogo) |
| `tech` | chips de tecnologías (línea 3 del diálogo) |
| `role` | "Fundador y desarrollador", etc. |
| `status` | etiqueta corta: "En piloto", "En producción"… |
| `links?` | `[{ label, href }]` — opcional, tarjeta + final del diálogo |

- **Añadir/quitar proyecto**: solo tocar el array (en ambos idiomas). El pueblo 3D
  se reajusta solo: nº de casas, ángulos y colliders derivan de `items.length`.
- Colores de casa/aldeano: `VILLAGE_COLORS` en `WorldCanvas.tsx` (por índice, cíclico).
- El diálogo del aldeano se genera solo: saludo (`world.greet` con `{name}`) →
  `description` → `tech — role`. No hay nada más que tocar.

## Editar textos de secciones

- Hero: `hero.*` (el titular es `role`, el botón del mundo es `ctaWorld`).
- Sobre mí: `about.paragraphs[]` (3 párrafos).
- Stack: `skills.groups[]` (4 grupos; también se muestran en la ventana STATUS).
- Trayectoria: `journey.items[]` (`period`, `title`, `description`).
- Mundo 3D (HUD, diálogos, STATUS): `world.*` — los atributos RPG de la ventana
  STATUS están en `world.status.attributes` (nombre + valor 0-100).
- SEO (título/description/OG): `generateMetadata` en `src/app/[locale]/layout.tsx`
  (único texto visible fuera del diccionario).

## Enlaces globales

`siteLinks` (mismo archivo): GitHub, LinkedIn, email. Se usan en Contact y Footer.

## Añadir un artículo al blog

Los artículos viven en `src/content/articles.ts` (arrays `es` y `en`, uno por
idioma). Para publicar uno nuevo:

1. Añade un objeto `Article` a `es` **y** a `en` (mismo tema, cada uno en su
   idioma). Campos: `slug` (URL, distinto por idioma y sin tildes), `title`,
   `description` (= respuesta directa/lead y meta description), `date` (ISO),
   `readingMinutes`, `tags[]`, `body` (Markdown).
2. El `body` admite Markdown (encabezados `##`/`###`, listas, tablas, código,
   citas). Para GEO: respuesta directa en las primeras frases, una idea por
   sección, y cifras concretas.
3. Nada más. Ruta, listado, teaser de la home, sitemap y JSON-LD se generan
   solos. Recuerda: ES **y** EN, sin precios/VTEQ/SofIA.

## SEO / GEO (posicionamiento en buscadores e IAs)

- **JSON-LD** (Person + WebSite + ProfilePage + ItemList de proyectos): se
  genera en `src/app/[locale]/layout.tsx` **desde el diccionario** — al editar
  proyectos se actualiza solo. Si cambias el titular de Jorge, revisa
  `jobTitle` y las descriptions de `generateMetadata` ahí mismo.
- **`public/llms.txt`**: índice del sitio para LLMs (estándar llms.txt). Al
  añadir/quitar un proyecto, actualízalo a mano (una línea por proyecto,
  mismas reglas de contenido: sin precios/VTEQ/SofIA).
- `src/app/sitemap.ts` y `src/app/robots.ts`: el robots permite explícitamente
  los crawlers de IA (GPTBot, PerplexityBot, ClaudeBot…) — NO bloquearlos.
- Imagen social: `public/og.jpg` (se regenera con `node scripts/og-image.mjs`).

## Checklist al terminar

1. ¿ES y EN actualizados y equivalentes?
2. ¿Cumple las prohibiciones de AGENTS.md (precios, VTEQ, SofIA…)?
3. `npx tsc --noEmit` (el tipo `Dictionary` caza campos olvidados en un idioma).
