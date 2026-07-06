<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# jorgegraells.com — web de marca personal de Jorge Graells

Portfolio bilingüe (ES/EN) con dos caras: una landing (hero 3D de red neuronal,
proyectos, stack, trayectoria, contacto) y un **mundo virtual 3D estilo Minecraft**
(`/[locale]/world`) donde cada proyecto es una casa con un aldeano que lo cuenta.
Stack: Next.js 16 (App Router, Turbopack) + React 19 + React Three Fiber + Tailwind v4.
Deploy: Vercel desde `main` en github.com/jorgegraells/graells.

## Dónde está cada cosa

- **Todo el contenido visible vive en `src/i18n/dictionaries.ts`** (objetos `es` y `en`).
  El 90% de los cambios que pedirá Jorge se hacen SOLO ahí. Receta: `docs/CONTENIDO.md`.
- Landing: `src/app/[locale]/page.tsx` + `src/components/*.tsx` (una sección por archivo).
- Mundo 3D: `src/components/world/` (`WorldCanvas.tsx` escena, `World.tsx` HUD/diálogos).
  Arquitectura y trampas: `docs/MUNDO-3D.md`.

## Reglas de contenido (no negociables)

1. Todo texto visible existe en ES **y** EN — nunca editar un idioma solo.
2. **Prohibido publicar**: precios, nº de usuarios, cifras comerciales, el nombre
   "VTEQ" (empresa de Jorge), el nombre interno "SofIA" (públicamente es
   "IA para empresas"), datos personales (teléfono, dirección, DNI, nacimiento),
   y cualquier rastro del motor de horóscopo de ANTIDOP 2.0.
3. Email público: dev.graells@gmail.com. GitHub: jorgegraells. Quizdly NO se publica.
4. Strings de UI nunca hardcodeados en componentes: siempre vía `Dictionary`.

## Comandos y verificación

```bash
npm run dev        # dev server puerto 3000
npx tsc --noEmit   # typecheck (rápido, úsalo tras cada cambio)
npm run build      # build de producción (puerta final)
```

**Gotcha crítico**: tras `npm run build`, borra `.next` antes de relanzar `npm run dev`
(si no, las rutas dan 404). Detalle y flujo de deploy/git: `docs/OPERACIONES.md`.

## Convenciones

- Código en inglés; comentarios y commits en castellano (Conventional-ish, imperativo).
- Componentes funcionales + hooks. Tailwind v4 (`@theme` en `globals.css`).
- Commits acaban con `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
