# Panel de administración — `/admin`

Interfaz privada para que Jorge publique artículos del blog sin tocar código.
Solo en castellano (es una herramienta interna, excepción a la regla ES+EN),
con `robots` noindex y excluida del middleware de idioma (`src/proxy.ts`)
y del robots.txt.

## Cómo funciona

- **Fuente de verdad**: los JSON de `src/content/articles/` en el repo.
  El panel no usa base de datos.
- **En desarrollo** (sin `GITHUB_TOKEN`): lee y escribe directo a disco.
  Guardas y recargas el blog del dev server para verlo al instante.
- **En producción**: cada "Publicar" hace un commit a `main` vía la API de
  contenidos de GitHub, y Vercel despliega solo (~2 min). El commit sale con
  el mensaje "Publica artículo desde el panel: <título>".

## Piezas

| Archivo | Qué hace |
|---|---|
| `src/app/admin/page.tsx` | UI: login → lista → editor (pestañas ES/EN, vista previa con el `Markdown` real del blog) |
| `src/app/admin/layout.tsx` | Layout raíz propio (html lang="es", noindex) |
| `src/app/api/admin/login/route.ts` | Sesión: POST contraseña, GET estado, DELETE logout |
| `src/app/api/admin/articles/route.ts` | GET lista, POST guarda (con validación de slug/fecha/longitudes en ambos idiomas) |
| `src/lib/admin-auth.ts` | Cookie de sesión HttpOnly (HMAC de `ADMIN_PASSWORD`, 7 días) |
| `src/lib/article-store.ts` | Doble backend: disco en dev, GitHub Contents API en prod |

## Variables de entorno

| Variable | Dónde | Para qué |
|---|---|---|
| `ADMIN_PASSWORD` | `.env.local` (dev) y Vercel (prod) | Contraseña de acceso al panel |
| `GITHUB_TOKEN` | Solo Vercel | Token para commitear los artículos al repo |

### Setup en producción (una sola vez)

1. **Token de GitHub**: github.com → Settings → Developer settings →
   Fine-grained personal access tokens → Generate new token.
   - Repository access: *Only select repositories* → `jorgegraells/graells`.
   - Permissions → Repository permissions → **Contents: Read and write**.
     Nada más.
   - Caducidad: la máxima que permita (habrá que renovarlo al caducar).
2. **Vercel**: proyecto → Settings → Environment Variables → añadir
   `GITHUB_TOKEN` (el token) y `ADMIN_PASSWORD` (una contraseña larga y única),
   ambos en *Production*. Redeploy para que las coja.

## Seguridad

- Sin sesión, la API devuelve 401; la contraseña se compara con
  `timingSafeEqual` y la cookie es HttpOnly + SameSite=Lax + Secure.
- El nombre de archivo se valida (`^[a-z0-9-]+\.json$`) — no se puede escribir
  fuera de `src/content/articles/`.
- El token de GitHub solo puede tocar contenidos de ese repo; si se filtrase,
  revocar en GitHub y generar otro.
