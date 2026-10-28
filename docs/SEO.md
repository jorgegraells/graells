# SEO y GEO automatizado

## Qué se hace solo

- **En cada artículo** (código de la web): imagen social propia generada en el
  build, `seoDescription` corta para Google, hreflang ES↔EN, `dateModified`
  real, autor con `sameAs`, sitemap y `llms.txt` generados con los artículos
  publicados, aviso a Bing vía IndexNow al publicar desde el panel.
- **Borrador diario** (rutina en la nube, 07:00 Madrid): escribe un artículo
  con radar de tendencias. Ver `docs/ARTICULOS.md`.
- **Auditoría semanal** (rutina en la nube, lunes 08:00 Madrid): revisa la web
  en producción, lee Search Console y deja el informe en
  `docs/SEO-INFORME.md`. Solo informa, no cambia nada.

Las dos rutinas corren en el entorno de la nube "Blog - fuentes oficiale",
que solo deja salir a una lista blanca de dominios. Se gestionan en
https://claude.ai/code/routines.

## Search Console (datos reales de Google)

`scripts/gsc-report.mjs` lee los últimos 28 días (comparados con los 28
anteriores): consultas, páginas, oportunidades en posición 4-20 y páginas que
se ven pero no se pulsan. Además inspecciona cada página pública (URL Inspection API,
solo lectura) y lista las que Google aún no ha indexado, con el enlace
directo para pulsar "Solicitar indexación" (eso Google no deja
automatizarlo). Usa una **cuenta de servicio** de Google con
permiso de solo lectura.

### Configuración (una vez)

1. **Google Cloud**: https://console.cloud.google.com, crea un proyecto
   (p. ej. `jorgegraells-seo`). En *APIs y servicios → Biblioteca*, busca
   **Google Search Console API** y pulsa *Habilitar*.
2. **Cuenta de servicio**: *IAM y administración → Cuentas de servicio →
   Crear cuenta de servicio* (p. ej. `gsc-lector`), sin roles. Ábrela, ve a
   *Claves → Agregar clave → Crear clave nueva → JSON*. Se descarga un
   archivo `.json`: es una credencial, guárdala bien y no la subas al repo.
3. **Search Console**: *Configuración → Usuarios y permisos → Añadir
   usuario*, pega el email de la cuenta de servicio
   (`gsc-lector@<proyecto>.iam.gserviceaccount.com`) con permiso
   **Restringido** (solo lectura).
4. **Entorno de la nube** (claude.ai/code → entorno "Blog - fuentes
   oficiale"):
   - Variable de entorno `GSC_SERVICE_ACCOUNT` con el JSON en base64. En
     PowerShell lo copias al portapapeles con:
     `[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\ruta\clave.json")) | Set-Clipboard`
   - Dominios permitidos: `oauth2.googleapis.com`,
     `searchconsole.googleapis.com`, `www.googleapis.com`, `jorgegraells.com`.

### Aviso diario de indexación

`node scripts/gsc-report.mjs --pending` revisa solo los artículos publicados y
lista los que Google aún no ha indexado, con el enlace de Search Console para
solicitarlo. El redactor diario lo ejecuta cada mañana y, si hay alguno, manda
una notificación al móvil de Jorge con esos enlaces.

### Uso en local

```bash
GSC_SERVICE_ACCOUNT_FILE=C:/ruta/clave.json node scripts/gsc-report.mjs
```

### Si algo falla

- `falta GSC_SERVICE_ACCOUNT`: la variable no está en el entorno.
- `Google no ha dado acceso`: clave revocada, API no habilitada o el JSON
  está mal copiado.
- `no tiene acceso a jorgegraells.com`: falta el paso 3.
- Riesgo asumido: la variable la ven las dos rutinas del entorno. La clave
  solo permite **leer** estadísticas de Search Console; si se filtrase, se
  borra en Google Cloud y se crea otra.
