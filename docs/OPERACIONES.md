# Operaciones — verificar, commitear, desplegar

## Flujo estándar de un cambio

1. Editar (contenido → `docs/CONTENIDO.md`; mundo 3D → `docs/MUNDO-3D.md`).
2. `npx tsc --noEmit` — barato, caza la mayoría de errores.
3. Verificar en navegador solo si el cambio es visual (dev server puerto 3000;
   el mundo está en `/es/world`).
4. `npm run build` como puerta final.
5. **Borrar `.next` tras el build** y relanzar dev si se va a seguir trabajando:
   ```powershell
   npm run build; if ($?) { Remove-Item -Recurse -Force .next -Confirm:$false }
   ```
   Motivo: build y dev comparten `.next`; si dev arranca sobre artefactos de
   producción, las rutas (p. ej. `/es/world`) devuelven **404**.
6. Commit + push a `main` → Vercel despliega solo.

## Git

- Remoto: `https://github.com/jorgegraells/graells.git`, rama `main`.
- Mensajes en castellano, imperativo, cuerpo con guiones si aporta.
  Terminar con `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Commitear/pushear solo cuando Jorge lo pida o sea la continuación natural
  de un cambio que él pidió publicar.

## Rutas e i18n

- `src/proxy.ts` (el middleware de Next 16) redirige `/` → `/es` o `/en` según
  `Accept-Language`. Rutas: `/[locale]` (landing) y `/[locale]/world` (mundo).
- Ambas se prerenderizan (SSG) vía `generateStaticParams`. El build debe mostrar
  siempre `/es`, `/en`, `/es/world`, `/en/world`.

## Entorno de Jorge

- Windows 11 + PowerShell 5.1 (sin `&&`; usar `;` o `if ($?)`).
- Para probar en su móvil (misma WiFi): `http://192.168.1.90:3000/es/world`.
- Preview con pestaña oculta: rAF congelado → física/animaciones no avanzan y
  las capturas pueden fallar. No es un bug de la app.
