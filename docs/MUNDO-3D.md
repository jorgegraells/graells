# Mundo 3D (`/[locale]/world`) — arquitectura y trampas

Dos archivos en `src/components/world/`:

- **`World.tsx`** (cliente): monta el canvas (dynamic, ssr:false) + capa DOM:
  HUD, joystick táctil, botón/ventana STATUS, `Dialogue` del aldeano (máquina de
  escribir, avanza con E/Enter/Espacio/clic). Estado: `active` (proyecto en diálogo)
  y `skillsOpen` (STATUS). Ambos pausan el movimiento (`paused`).
- **`WorldCanvas.tsx`**: toda la escena R3F. Componentes: `PlayerRig` (movimiento),
  `FirstPersonArms` (manos Minecraft, pose "cast" cuando STATUS abierto),
  `Village` (casas+aldeanos), `House`, `Villager`, decoración (`Mountains`,
  `DecorTrees`, `Plaza`, `Well`, `Windmill`, `LampPosts`, `Butterflies`, `Rocks`,
  `Clouds`, `Flowers`, `GrassFloor`) y `DebugProbe` (solo dev).

## Sistema de estilo (cuadrado ⇄ redondo)

- `WorldStyle = "blocky" | "rounded"` YA NO tiene toggle en el HUD: se deriva
  del tema (`voxel` → blocky, `overworld` → rounded) dentro de `WorldCanvas`.
  Se propaga por **contexto R3F**: `StyleContext.Provider` está DENTRO del
  `<Canvas>` (obligatorio: R3F usa su propio reconciliador). Los componentes
  leen con `useWorldStyle()`.
- Helper **`Block`**: caja que renderiza `boxGeometry` en blocky y `RoundedBox`
  (drei) en rounded. Radio auto-clampado a `min(args)*0.45`. Úsalo para
  estructuras nuevas en vez de `<mesh><boxGeometry/>`.
- Conos (tejados, montañas, hierba): parametrizar segmentos y `flatShading` por
  estilo (`flat = style === "blocky"`). Blocky = facetado; rounded = suave.
- Detalles diminutos (ojos, mariposas, flores tallo) siguen siendo `mesh` planos
  a propósito, por rendimiento (no merece la pena redondearlos).

## Invariantes del diseño

- **Cada aldeano es único**: `VILLAGER_PERSONAS[i]` define piel, pelo, peinado,
  gorro (cap/casco/gorrito) y accesorio (gafas/cascos/barba/bigote) por índice de
  proyecto. Para cambiar el aspecto de un vecino, edita su entrada ahí.
- **El pueblo escala con los proyectos**: `buildLayout(n)` reparte casas en círculo
  de radio `HOUSE_RADIUS` (22); aldeano a 4.5 delante de su casa. NUNCA posicionar
  casas a mano.
- **Colliders**: cajas rotadas (casas: transformar posición del jugador al espacio
  local con `applyAxisAngle(UP, -rotY)`, semiextensiones 3×2.5 + `PLAYER_RADIUS`) y
  círculos (árbol, aldeanos, `DECOR_COLLIDERS`). Toda decoración sólida nueva debe
  añadirse a `DECOR_COLLIDERS`.
- **Decoración determinista**: posiciones vía `mulberry32(semilla)` en constantes de
  módulo (`TREE_SPOTS`, `MOUNTAIN_SPOTS`…). Nada de `Math.random()` en posiciones
  persistentes — el mundo debe ser idéntico en cada visita.
- **Controles**: WASD/flechas + arrastre (sentido INVERTIDO adrede — petición de
  Jorge), Espacio salta (gravedad simple), E habla, C abre STATUS, ESC cierra.
  Móvil (`pointer: coarse`): joystick + botón salto + textos `hintTouch`.
- **Zona personal** (este/sureste, repartida y lejos del pueblo):
  `LIBRARY_POS`/`GEEK_POS`/`PITCH_POS` + `inPersonalZone()` (despeja árboles,
  rocas, hierba y flores). Los edificios son VISITABLES: `BuildingShell` monta
  paredes con hueco de puerta + `AutoDoor` (se abre sola por proximidad) y las
  colisiones van por segmentos de pared (`shellSegs` + `wallColliders` →
  `PERSONAL_BOX_COLLIDERS`, cajas como las casas). Biblioteca: `BOOKS` (ranking),
  estanterías `Bookcase` (lomos deterministas) e interacción E/toque que muestra
  la recomendación (`dict.world.personal.libraryQuote`). Zona friki: pósters
  procedurales (`usePosterTextures`), LED, sofá, PC, funkos, consolas. Campo:
  césped a franjas, gradas con collider, porterías con red; el campo se pisa.
- **Holograma de la plaza** (`PlazaHologram`): usa `public/jorge-holo-head.webp`
  (variante SIN el disco pintado — el disco es la peana 3D; se regenera con
  `node scripts/holo-head.mjs`). La landing sigue usando `jorge-holo-cut.webp`.

- **Tema del mundo** (`WorldTheme` "voxel"|"overworld"): se alterna con el
  botón arcade de la plaza (`ThemeButton` en `THEME_BUTTON_POS`), que dispara
  `onThemeButton` → `World.tsx` orquesta un fogonazo blanco (~250 ms cerrar,
  ~350 ms abrir) y cambia el tema en el punto más blanco. El tema viaja por
  `ThemeContext`/`useWorldTheme` (paralelo a `StyleContext`) y afecta a cielo,
  niebla, luces y paletas de hierba; en overworld la geometría se FUERZA a
  "rounded". El voxel es el estado por defecto e intacto.
  **Fase 2 (hecha)**: en overworld, `ToonMaterialSwap` recorre la escena y
  cambia cada `MeshStandardMaterial` por un clon `MeshToonMaterial` cacheado
  (gradiente de 4 escalones) y `OutlinedRenderer` toma el render con
  `OutlineEffect` (contornos negros; useFrame con prioridad 1 desactiva el
  render automático de R3F). Exclusiones: `mesh.userData.noToon` para
  materiales animados por ref (anillo del holograma, pulsador) y la hierba
  instanciada (shader de viento), y
  `material.userData.outlineParameters.visible = false` para planos finos
  (pósters, carteles, red de portería, holo, cono, motas, briznas).
  **Fase 3 (hecha)**: diseños propios por tema, no solo recolor. En overworld:
  casas de JRPG (muros crema sin entramado, cenefa del color del tejado, cono
  suave 14 seg con remate esférico, ventana redonda con marco blanco, valla
  blanca, sin chimenea), árboles de copa esférica doble, gente chibi (cabeza
  ×1.3 vía doble grupo pivotado en el centro de la cabeza, sin tocar
  coordenadas: Villager, SeatedPerson, Worker), pradera de manchas suaves en
  vez de píxel, losetas arena redondeadas y montañas menta/lavanda. Todo con
  ramas condicionales por `useWorldTheme()`; el voxel queda intacto.

## Trampas conocidas (no re-descubrir)

1. **Delta clamp**: `Math.min(delta, 0.05)` en todo `useFrame` con física — sin
   esto, volver de una pestaña dormida teletransporta al jugador.
2. **Multi-touch**: solo el dedo cuyo `pointerdown` nació en el canvas controla la
   cámara (se rastrea `pointerId`); el dedo del joystick no debe contaminarla.
   El canvas lleva `touch-action: none` (si no, el navegador roba el gesto).
3. **drei `<Html>`**: usar `zIndexRange={[15, 0]}` para que los carteles queden BAJO
   los overlays DOM (z-20). Sin `transform` — tamaño fijo de pantalla, siempre nítido.
4. **Clic vs arrastre**: `drag.dist < 8` distingue tocar un aldeano de mirar.
5. **Contexto WebGL**: `onCreated` registra `webglcontextlost` + `preventDefault`
   para permitir restauración. DPR capado a 1.75.
6. **Intro**: cinemática de 3 s saltable con cualquier tecla/clic (`intro.current = 1`).
7. **HMR resetea la cámara** al spawn — no es un bug de producción.
8. Nubes y linternas usan `emissive` — sin él se ven grises (sin luz por debajo).

## Depuración (solo dev)

`DebugProbe` expone en `window`: `__cam` [x,y,z], `__rot` [pitch,yaw] y acepta
`__goto = [x, z]` para teletransportar. Útil para probar proximidad/colisiones.
`PlayerRig` acepta además `__look = [yaw, pitch]` para orientar la cámara
(imprescindible al verificar por script: la rotación se pisa cada frame).
