<p align="center">
  <img src="public/og.jpg" alt="Jorge Graells — AI Engineer & Full-Stack Developer" width="640" />
</p>

<h1 align="center">jorgegraells.com</h1>

<p align="center">
  <strong>Un currículum que se juega.</strong><br/>
  Web de marca personal de <a href="https://jorgegraells.com">Jorge Graells</a> — Ingeniero de IA y Desarrollador Full-Stack.
</p>

<p align="center">
  🌐 <a href="https://jorgegraells.com">jorgegraells.com</a> &nbsp;·&nbsp; 🎮 <a href="https://jorgegraells.com/es/world">Mundo virtual</a>
</p>

---

No es un portfolio normal: es una **landing estilo arcade/synthwave** con un
holograma vivo en el hero, y un **mundo virtual 3D jugable** donde cada proyecto
es una casa y un vecino te cuenta su historia. Bilingüe (ES/EN).

## ✨ Destacado

- **Hero holográfico** con recorte real (segmentación por IA), barrido de
  escaneo, glow y parallax.
- **Mundo 3D jugable** (React Three Fiber): movimiento WASD + ratón estilo FPS,
  aldeanos con personalidad y diálogos, ventana de habilidades tipo *Solo
  Leveling*, dos estilos visuales (cuadrado / redondo), obra de construcción con
  grúas y obreros, montañas, y controles táctiles en móvil.
- **Estética arcade/HUD 2026**: neón, tarjetas *level select*, barras de XP,
  *quest log*.
- **Bilingüe ES/EN** con detección de idioma.
- **SEO + GEO**: JSON-LD (Person + proyectos), `sitemap.xml` con hreflang,
  Open Graph, `robots.txt` que permite los crawlers de IA y `llms.txt` para que
  ChatGPT / Perplexity / Claude / Gemini puedan citar el sitio.

## 🛠️ Stack

Next.js 16 (App Router, Turbopack) · React 19 · React Three Fiber · Tailwind v4 ·
Framer Motion · TypeScript. Desplegado en **Vercel**.

## 📂 Estructura

```
src/
  app/[locale]/        Landing (page.tsx) y mundo 3D (world/)
  app/sitemap.ts,      SEO: sitemap y robots (crawlers de IA incluidos)
  app/robots.ts
  components/          Una sección por archivo + world/ (escena y HUD)
  i18n/dictionaries.ts TODO el contenido visible (objetos es / en)
public/                Holograma, OG image, llms.txt
docs/                  Guías de mantenimiento (contenido, mundo 3D, operaciones)
scripts/               Utilidades (recorte del holograma, imagen OG)
```

> Casi todo el contenido visible vive en `src/i18n/dictionaries.ts`.

## 🚀 Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
```

## 👤 Contacto

**Jorge Graells** — dev.graells@gmail.com ·
[GitHub](https://github.com/jorgegraells) ·
[LinkedIn](https://www.linkedin.com/in/jorge-graells-4a2911117/)
