"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Dictionary, Project } from "@/i18n/dictionaries";

const HOUSE_RADIUS = 22;
const NEAR_DISTANCE = 5;
const MOVE_SPEED = 8;
const WORLD_BOUND = 45;
const EYE_HEIGHT = 1.8;
const JUMP_VELOCITY = 5.2;
const GRAVITY = 13.5;
const PLAYER_RADIUS = 0.45;
const PLAZA_RADIUS = 7;
const PATH_INNER = 6.8;
const PATH_OUTER = 19;
const PATH_HALF_WIDTH = 1.2;
const UP = new THREE.Vector3(0, 1, 0);
const SKIN = "#e0ad82";

// ---------------------------------------------------------------------------
// Sistema de estilo: "blocky" (Minecraft) o "rounded" (redondeado)
// ---------------------------------------------------------------------------

export type WorldStyle = "blocky" | "rounded";
const StyleContext = createContext<WorldStyle>("blocky");
const useWorldStyle = () => useContext(StyleContext);

type BlockProps = {
  args: [number, number, number];
  radius?: number;
  children?: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
};

/** Caja que se redondea automáticamente en modo "rounded". El material va como hijo. */
function Block({ args, radius = 0.14, children, ...props }: BlockProps) {
  const style = useWorldStyle();
  if (style === "rounded") {
    const r = Math.min(radius, Math.min(...args) * 0.45);
    return (
      <RoundedBox args={args} radius={r} smoothness={3} {...props}>
        {children}
      </RoundedBox>
    );
  }
  return (
    <mesh {...props}>
      <boxGeometry args={args} />
      {children}
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Disposición del pueblo y RNG determinista
// ---------------------------------------------------------------------------

/** Disposición del pueblo: una casa + aldeano por proyecto, en círculo. */
export type VillageLayout = {
  angle: number;
  housePos: THREE.Vector3;
  npcPos: THREE.Vector3;
}[];

function buildLayout(count: number): VillageLayout {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.PI / 4;
    const dir = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
    return {
      angle,
      housePos: dir.clone().multiplyScalar(HOUSE_RADIUS),
      npcPos: dir.clone().multiplyScalar(HOUSE_RADIUS - 4.5),
    };
  });
}

/** RNG con semilla: decoración idéntica en cada visita. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Zona personal, repartida por el sector este y sureste, lejos del pueblo
 *  de la experiencia: biblioteca, zona friki y campito de fútbol con gradas. */
const LIBRARY_POS = { x: 34, z: 18, rotY: -Math.PI / 2 + 0.35 };
const GEEK_POS = { x: 40, z: -2, rotY: -Math.PI / 2 };
const PITCH_POS = { x: 32, z: -23 };
const PITCH_W = 9;
const PITCH_L = 14;
const DOOR_W = 2; // hueco de puerta de los edificios visitables

/** ¿Cae este punto dentro de la zona personal? (para despejar árboles,
 *  rocas, hierba alta y flores de esas parcelas) */
function inPersonalZone(x: number, z: number) {
  if (Math.hypot(x - LIBRARY_POS.x, z - LIBRARY_POS.z) < 8) return true;
  if (Math.hypot(x - GEEK_POS.x, z - GEEK_POS.z) < 8.5) return true;
  return (
    Math.abs(x - PITCH_POS.x) < PITCH_W / 2 + 4 &&
    Math.abs(z - PITCH_POS.z) < PITCH_L / 2 + 3
  );
}

/** Segmento de pared/mueble en coordenadas locales de un edificio. */
type WallSeg = { cx: number; cz: number; halfW: number; halfD: number };

/** Convierte segmentos locales de un edificio (rotado y posicionado) en
 *  colliders de caja en mundo, con el radio del jugador ya sumado (mismo
 *  formato que las casas del pueblo). */
function wallColliders(bx: number, bz: number, rotY: number, walls: WallSeg[]) {
  const cos = Math.cos(rotY);
  const sin = Math.sin(rotY);
  return walls.map((w) => ({
    x: bx + w.cx * cos + w.cz * sin,
    z: bz - w.cx * sin + w.cz * cos,
    rotY,
    halfW: w.halfW + PLAYER_RADIUS,
    halfD: w.halfD + PLAYER_RADIUS,
  }));
}

/** Paredes de un edificio visitable: trasera, laterales y frente con hueco
 *  de puerta centrado, más los muebles que se le pasen. */
function shellSegs(w: number, d: number, furniture: WallSeg[] = []): WallSeg[] {
  const sideHalf = (w / 2 - DOOR_W / 2) / 2;
  const sideCx = DOOR_W / 2 + sideHalf;
  return [
    { cx: 0, cz: -d / 2 + 0.15, halfW: w / 2, halfD: 0.15 },
    { cx: -w / 2 + 0.15, cz: 0, halfW: 0.15, halfD: d / 2 },
    { cx: w / 2 - 0.15, cz: 0, halfW: 0.15, halfD: d / 2 },
    { cx: -sideCx, cz: d / 2 - 0.15, halfW: sideHalf, halfD: 0.15 },
    { cx: sideCx, cz: d / 2 - 0.15, halfW: sideHalf, halfD: 0.15 },
    ...furniture,
  ];
}

/** Colliders de caja de la zona personal (paredes con puerta, muebles y gradas). */
const PERSONAL_BOX_COLLIDERS = [
  ...wallColliders(
    LIBRARY_POS.x,
    LIBRARY_POS.z,
    LIBRARY_POS.rotY,
    shellSegs(8, 6, [
      { cx: 0, cz: -2.45, halfW: 3.4, halfD: 0.35 }, // estanterías
      { cx: 1.5, cz: 0.3, halfW: 0.85, halfD: 0.5 }, // mesa expositora
      { cx: -2.3, cz: 0.4, halfW: 0.55, halfD: 0.55 }, // sillón
    ]),
  ),
  ...wallColliders(
    GEEK_POS.x,
    GEEK_POS.z,
    GEEK_POS.rotY,
    shellSegs(9, 7, [
      { cx: 1.05, cz: -0.5, halfW: 0.6, halfD: 1.35 }, // sofá
      { cx: 3.85, cz: -0.5, halfW: 0.45, halfD: 1.4 }, // mueble TV
      { cx: -3.5, cz: 1.5, halfW: 0.75, halfD: 1.1 }, // escritorio y silla
      { cx: -1.8, cz: -2.3, halfW: 0.65, halfD: 0.5 }, // mesita de cartas
    ]),
  ),
  ...wallColliders(PITCH_POS.x, PITCH_POS.z, 0, [
    { cx: -(PITCH_W / 2 + 2.2), cz: 0, halfW: 1.6, halfD: PITCH_L / 2 - 0.5 },
    { cx: PITCH_W / 2 + 2.2, cz: 0, halfW: 1.6, halfD: PITCH_L / 2 - 0.5 },
  ]),
];

/** Bosque alrededor del pueblo (fuera del anillo de casas). */
const TREE_SPOTS = (() => {
  const rand = mulberry32(1337);
  return Array.from({ length: 18 }, () => {
    const angle = rand() * Math.PI * 2;
    const radius = 29 + rand() * 13;
    return {
      x: Math.sin(angle) * radius,
      z: Math.cos(angle) * radius,
      scale: 0.7 + rand() * 0.7,
      variant: Math.floor(rand() * 3),
    };
  }).filter((t) => !inPersonalZone(t.x, t.z));
})();

/** Rocas medio enterradas. */
const ROCK_SPOTS = (() => {
  const rand = mulberry32(2024);
  return Array.from({ length: 14 }, () => {
    const angle = rand() * Math.PI * 2;
    const radius = 9 + rand() * 32;
    return {
      x: Math.sin(angle) * radius,
      z: Math.cos(angle) * radius,
      s: 0.35 + rand() * 0.6,
      rot: rand() * Math.PI,
    };
  }).filter((r) => !inPersonalZone(r.x, r.z));
})();

const LAMP_SPOTS = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) => ({
  x: Math.sin(a) * 7.6,
  z: Math.cos(a) * 7.6,
}));

const BENCH_SPOTS = [1.5, 3.7, 5.3].map((a) => ({
  x: Math.sin(a) * 5,
  z: Math.cos(a) * 5,
  rotY: a + Math.PI,
}));

const WINDMILL_POS = { x: -30, z: -22 };

/** Anillo de montañas del horizonte y colinas intermedias. */
const MOUNTAIN_SPOTS = (() => {
  const rand = mulberry32(555);
  const count = 26;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.18;
    const radius = 85 + rand() * 28;
    return {
      x: Math.sin(angle) * radius,
      z: Math.cos(angle) * radius,
      h: 22 + rand() * 26,
      r: 16 + rand() * 14,
      rocky: rand() > 0.5,
      rot: rand() * Math.PI,
    };
  });
})();

const HILL_SPOTS = (() => {
  const rand = mulberry32(888);
  const count = 18;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.3;
    const radius = 58 + rand() * 16;
    return {
      x: Math.sin(angle) * radius,
      z: Math.cos(angle) * radius,
      h: 7 + rand() * 9,
      r: 12 + rand() * 9,
      rot: rand() * Math.PI,
    };
  });
})();

/** Colliders de la decoración sólida (radio sin jugador). */
const DECOR_COLLIDERS = [
  { x: WINDMILL_POS.x, z: WINDMILL_POS.z, r: 2.6 },
  ...TREE_SPOTS.map((t) => ({ x: t.x, z: t.z, r: 0.7 * t.scale })),
  ...LAMP_SPOTS.map((l) => ({ x: l.x, z: l.z, r: 0.3 })),
  ...BENCH_SPOTS.map((b) => ({ x: b.x, z: b.z, r: 0.9 })),
  // Zona personal: postes de las porterías (edificios y gradas van por cajas)
  ...[-1, 1].flatMap((end) =>
    [-1, 1].map((s) => ({
      x: PITCH_POS.x + s * 1.7,
      z: PITCH_POS.z + end * (PITCH_L / 2),
      r: 0.2,
    })),
  ),
];

/** Color de tejado y camiseta del aldeano de cada proyecto. */
export const VILLAGE_COLORS = [
  "#0ea5b7",
  "#7c5cd6",
  "#d6558e",
  "#e0912f",
  "#2f9e57",
  "#c94f4f",
];

/** Proyecto cuya casa está en obras (grúas, vallas, obreros). */
const CONSTRUCTION_SLUG = "echogeo";

/** Rasgos que dan personalidad única a cada aldeano. */
type Persona = {
  skin: string;
  hair: string;
  head: "short" | "tuft" | "long" | "bald";
  hat: "none" | "cap" | "hardhat" | "beanie";
  accessory: "none" | "glasses" | "headphones" | "beard" | "mustache";
  build: number;
};

const VILLAGER_PERSONAS: Persona[] = [
  // WorkLeveling — gamer con cascos y cresta
  { skin: "#e8b98d", hair: "#3a2a1a", head: "tuft", hat: "none", accessory: "headphones", build: 1.0 },
  // IA para empresas — analista con gafas
  { skin: "#f0c9a0", hair: "#1f1f26", head: "short", hat: "none", accessory: "glasses", build: 0.97 },
  // EchoGEO — melena
  { skin: "#c8925a", hair: "#6b4423", head: "long", hat: "none", accessory: "none", build: 1.02 },
  // ANTIDOP — gorrito
  { skin: "#9c6b43", hair: "#caa24b", head: "short", hat: "beanie", accessory: "none", build: 0.99 },
  // IA en la industria — casco de obra y bigote
  { skin: "#e8b98d", hair: "#2b2b2b", head: "short", hat: "hardhat", accessory: "mustache", build: 1.05 },
  // extra — calvo con barba
  { skin: "#7a4f30", hair: "#2c2c34", head: "bald", hat: "none", accessory: "beard", build: 1.03 },
];

/**
 * Predicado: ¿está libre este punto del suelo para plantar flores/hierba?
 * Excluye plaza, caminos, casas, aldeanos y decoración sólida — así no salen
 * flores sobre el cemento ni matojos dentro de una casa.
 */
function makeGroundClear(layout: VillageLayout) {
  const scratch = new THREE.Vector3();
  return (x: number, z: number) => {
    const r = Math.hypot(x, z);
    if (r < PLAZA_RADIUS + 0.7) return false; // plaza + bordillo
    if (r < 2.6) return false; // holograma central
    if (inPersonalZone(x, z)) return false; // biblioteca, zona friki y campito
    for (const l of layout) {
      // Caminos radiales (en el marco local del camino)
      scratch.set(x, 0, z).applyAxisAngle(UP, -l.angle);
      if (
        Math.abs(scratch.x) < PATH_HALF_WIDTH + 0.5 &&
        scratch.z > PATH_INNER - 0.5 &&
        scratch.z < PATH_OUTER + 0.5
      ) {
        return false;
      }
      if (Math.hypot(x - l.housePos.x, z - l.housePos.z) < 4.6) return false;
      if (Math.hypot(x - l.npcPos.x, z - l.npcPos.z) < 1.3) return false;
    }
    for (const c of DECOR_COLLIDERS) {
      if (Math.hypot(x - c.x, z - c.z) < c.r + 0.8) return false;
    }
    return true;
  };
}

export type MoveInput = { x: number; y: number; jump: boolean };

/** Estado mutable compartido para distinguir arrastre (mirar) de clic (hablar). */
type DragState = { dist: number };

// ---------------------------------------------------------------------------
// Jugador
// ---------------------------------------------------------------------------

function PlayerRig({
  paused,
  touch,
  drag,
  externalMove,
  layout,
  extraColliders,
}: {
  paused: boolean;
  touch: boolean;
  drag: DragState;
  externalMove: MoveInput;
  layout: VillageLayout;
  extraColliders: { x: number; z: number; r: number }[];
}) {
  const { camera, gl } = useThree();
  const keys = useRef(new Set<string>());
  const yaw = useRef(0);
  const pitch = useRef(-0.05);
  const velocity = useRef(new THREE.Vector3());
  const verticalVelocity = useRef(0);
  const intro = useRef(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // Al pausar (diálogo, STATUS, bienvenida) se libera el ratón para poder clicar
  useEffect(() => {
    if (paused && document.pointerLockElement) document.exitPointerLock();
  }, [paused]);

  // Colliders del pueblo: cajas rotadas (casas) y círculos (árbol, aldeanos)
  const colliders = useMemo(
    () => ({
      boxes: [
        ...layout.map((l) => ({
          x: l.housePos.x,
          z: l.housePos.z,
          rotY: l.angle + Math.PI,
          halfW: 3 + PLAYER_RADIUS,
          halfD: 2.5 + PLAYER_RADIUS,
        })),
        // Zona personal: paredes con hueco de puerta, muebles y gradas
        ...PERSONAL_BOX_COLLIDERS,
      ],
      circles: [
        { x: 0, z: 0, r: 1.5 + PLAYER_RADIUS }, // peana del holograma central
        ...layout.map((l) => ({
          x: l.npcPos.x,
          z: l.npcPos.z,
          r: 0.45 + PLAYER_RADIUS,
        })),
        ...DECOR_COLLIDERS.map((c) => ({
          x: c.x,
          z: c.z,
          r: c.r + PLAYER_RADIUS,
        })),
        ...extraColliders.map((c) => ({
          x: c.x,
          z: c.z,
          r: c.r + PLAYER_RADIUS,
        })),
      ],
    }),
    [layout, extraColliders],
  );

  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.position.set(0, 22, 42);
  }, [camera]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      intro.current = 1; // cualquier tecla salta la intro
      if (e.code === "Space") e.preventDefault(); // sin scroll de página
      keys.current.add(e.code);
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.code);
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    // Sin esto, el navegador móvil intercepta el gesto (scroll/zoom)
    // y se pierden la mayoría de los pointermove del arrastre.
    el.style.touchAction = "none";

    // Solo el dedo que empezó en el canvas controla la cámara: así el
    // dedo del joystick nunca contamina el arrastre de mirar.
    let lookPointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;
    const yawSensitivity = touch ? 0.008 : 0.004;
    const pitchSensitivity = touch ? 0.006 : 0.003;

    const onDown = (e: PointerEvent) => {
      intro.current = 1; // un clic/toque también salta la intro
      // En escritorio, un clic captura el ratón: se mira moviéndolo, sin arrastrar
      if (!touch && !pausedRef.current && document.pointerLockElement !== el) {
        try {
          const req = (
            el.requestPointerLock as () => Promise<void> | void
          )();
          if (req && typeof (req as Promise<void>).catch === "function") {
            (req as Promise<void>).catch(() => {});
          }
        } catch {
          /* pointer lock no disponible: seguimos con arrastre */
        }
      }
      if (lookPointerId !== null) return; // ya hay un dedo mirando
      lookPointerId = e.pointerId;
      drag.dist = 0;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    // Arrastre (respaldo y táctil): mirar manteniendo pulsado
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== lookPointerId || pausedRef.current) return;
      if (document.pointerLockElement === el) return; // ya mira el ratón capturado
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      drag.dist += Math.abs(dx) + Math.abs(dy);
      // Sentido de cámara invertido respecto al arrastre (petición de Jorge)
      yaw.current += dx * yawSensitivity;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current + dy * pitchSensitivity,
        -0.8,
        0.6,
      );
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === lookPointerId) lookPointerId = null;
    };
    // Ratón capturado (Pointer Lock): mirar como en un FPS. Con el ratón libre
    // el sentido es directo: derecha→derecha, arriba→arriba.
    const onLockedLook = (e: MouseEvent) => {
      if (document.pointerLockElement !== el || pausedRef.current) return;
      yaw.current -= e.movementX * 0.0022;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - e.movementY * 0.002,
        -0.8,
        0.6,
      );
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.addEventListener("mousemove", onLockedLook);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("mousemove", onLockedLook);
    };
  }, [gl, drag, touch]);

  useFrame((_, rawDelta) => {
    // Delta limitado: evita teletransportes al volver de una pestaña en segundo plano
    const delta = Math.min(rawDelta, 0.05);

    // Intro: descenso desde el cielo hasta la plaza del pueblo
    if (intro.current < 1) {
      intro.current = Math.min(1, intro.current + delta / 3);
      const eased = 1 - Math.pow(1 - intro.current, 3);
      camera.position.set(
        0,
        THREE.MathUtils.lerp(22, EYE_HEIGHT, eased),
        THREE.MathUtils.lerp(42, 26, eased),
      );
      pitch.current = THREE.MathUtils.lerp(-0.5, -0.05, eased);
      camera.rotation.set(pitch.current, yaw.current, 0);
      return;
    }

    // Solo dev: window.__look = [yaw, pitch] orienta la cámara (para depurar)
    if (process.env.NODE_ENV !== "production") {
      const w = window as Window & { __look?: [number, number] };
      if (w.__look) {
        yaw.current = w.__look[0];
        pitch.current = w.__look[1];
        w.__look = undefined;
      }
    }

    camera.rotation.set(pitch.current, yaw.current, 0);
    if (pausedRef.current) return;

    const k = keys.current;
    const right = THREE.MathUtils.clamp(
      (k.has("KeyD") || k.has("ArrowRight") ? 1 : 0) -
        (k.has("KeyA") || k.has("ArrowLeft") ? 1 : 0) +
        externalMove.x,
      -1,
      1,
    );
    const back = THREE.MathUtils.clamp(
      (k.has("KeyS") || k.has("ArrowDown") ? 1 : 0) -
        (k.has("KeyW") || k.has("ArrowUp") ? 1 : 0) +
        externalMove.y,
      -1,
      1,
    );

    const target = new THREE.Vector3(right, 0, back);
    if (target.lengthSq() > 1) target.normalize();
    target.applyAxisAngle(UP, yaw.current).multiplyScalar(MOVE_SPEED);

    // Inercia: acelera y frena con suavidad
    velocity.current.lerp(target, 1 - Math.exp(-delta * 7));
    camera.position.addScaledVector(velocity.current, delta);
    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      -WORLD_BOUND,
      WORLD_BOUND,
    );
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      -WORLD_BOUND,
      WORLD_BOUND,
    );

    // Colisiones: el jugador no atraviesa casas, árbol ni aldeanos
    for (const c of colliders.circles) {
      const dx = camera.position.x - c.x;
      const dz = camera.position.z - c.z;
      const dist = Math.hypot(dx, dz);
      if (dist < c.r && dist > 1e-6) {
        const scale = c.r / dist;
        camera.position.x = c.x + dx * scale;
        camera.position.z = c.z + dz * scale;
      }
    }
    for (const b of colliders.boxes) {
      const local = new THREE.Vector3(
        camera.position.x - b.x,
        0,
        camera.position.z - b.z,
      ).applyAxisAngle(UP, -b.rotY);
      if (Math.abs(local.x) < b.halfW && Math.abs(local.z) < b.halfD) {
        const penX = b.halfW - Math.abs(local.x);
        const penZ = b.halfD - Math.abs(local.z);
        // Empujar por el eje de menor penetración
        if (penX < penZ) local.x += Math.sign(local.x || 1) * penX;
        else local.z += Math.sign(local.z || 1) * penZ;
        local.applyAxisAngle(UP, b.rotY);
        camera.position.x = b.x + local.x;
        camera.position.z = b.z + local.z;
      }
    }

    // Salto con espacio o botón táctil + gravedad
    const grounded = camera.position.y <= EYE_HEIGHT + 0.001;
    if (grounded && (k.has("Space") || externalMove.jump)) {
      verticalVelocity.current = JUMP_VELOCITY;
    }
    verticalVelocity.current -= GRAVITY * delta;
    camera.position.y += verticalVelocity.current * delta;
    if (camera.position.y <= EYE_HEIGHT) {
      camera.position.y = EYE_HEIGHT;
      verticalVelocity.current = 0;
    }
  });

  return null;
}

/** Brazos en primera persona, con balanceo al andar.
 *  Con `casting`, el brazo derecho se extiende hacia delante para "invocar"
 *  la ventana de habilidades. */
const CAST_ARM_POSITION = new THREE.Vector3(0.16, -0.34, -0.62);
const CAST_ARM_ROTATION = new THREE.Euler(-1.25, 0, 0);
// El extremo +z del brazo es la mano: en reposo el brazo gira ~180º en X para
// que la mano apunte hacia delante (lejos de la cámara), no hacia el jugador.
const IDLE_ARM_ROTATION_RIGHT = new THREE.Euler(Math.PI - 0.45, -0.2, 0.1);
const IDLE_ARM_ROTATION_LEFT = new THREE.Euler(Math.PI - 0.45, 0.2, -0.1);

function Arm({ sign }: { sign: number }) {
  return (
    <>
      <Block args={[0.16, 0.16, 0.42]} radius={0.07}>
        <meshStandardMaterial
          color="#2f8f83"
          emissive="#2f8f83"
          emissiveIntensity={0.12}
        />
      </Block>
      <Block args={[0.17, 0.17, 0.16]} radius={0.07} position={[0, 0, 0.26]}>
        <meshStandardMaterial
          color={SKIN}
          emissive={SKIN}
          emissiveIntensity={0.15}
        />
      </Block>
      {/* Muñequera para dar un toque */}
      <Block
        args={[0.18, 0.18, 0.05]}
        radius={0.02}
        position={[0, 0, 0.14]}
      >
        <meshStandardMaterial color="#1f6b62" />
      </Block>
      <mesh position={[sign * 0.02, 0, 0]} />
    </>
  );
}

function FirstPersonArms({ casting }: { casting: boolean }) {
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null);
  const armLeft = useRef<THREE.Group>(null);
  const armRight = useRef<THREE.Group>(null);
  const prev = useRef<THREE.Vector3 | null>(null);
  const bob = useRef(0);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const g = root.current;
    if (!g) return;
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);

    if (!prev.current) prev.current = camera.position.clone();
    const speed =
      prev.current.distanceTo(camera.position) / Math.max(delta, 1e-4);
    prev.current.copy(camera.position);

    const moving = speed > 0.8;
    bob.current += delta * (moving ? 10 : 2.2);
    const amp = moving ? 0.05 : 0.012;
    const sway = Math.sin(bob.current) * amp;
    const lift = Math.abs(Math.cos(bob.current)) * amp;
    const blend = 1 - Math.exp(-delta * 9);

    if (armRight.current) {
      const arm = armRight.current;
      if (casting) {
        arm.position.lerp(CAST_ARM_POSITION, blend);
        arm.rotation.x = THREE.MathUtils.lerp(arm.rotation.x, CAST_ARM_ROTATION.x, blend);
        arm.rotation.y = THREE.MathUtils.lerp(arm.rotation.y, CAST_ARM_ROTATION.y, blend);
        arm.rotation.z = THREE.MathUtils.lerp(arm.rotation.z, CAST_ARM_ROTATION.z, blend);
      } else {
        arm.position.lerp(
          new THREE.Vector3(0.48 + sway, -0.52 + lift, -0.9),
          blend,
        );
        arm.rotation.x = THREE.MathUtils.lerp(arm.rotation.x, IDLE_ARM_ROTATION_RIGHT.x, blend);
        arm.rotation.y = THREE.MathUtils.lerp(arm.rotation.y, IDLE_ARM_ROTATION_RIGHT.y, blend);
        arm.rotation.z = THREE.MathUtils.lerp(arm.rotation.z, IDLE_ARM_ROTATION_RIGHT.z, blend);
      }
    }
    if (armLeft.current) {
      armLeft.current.position.set(-0.48 - sway, -0.52 + lift, -0.9);
    }
  });

  return (
    <group ref={root}>
      <group
        ref={armRight}
        position={[0.48, -0.52, -0.9]}
        rotation={IDLE_ARM_ROTATION_RIGHT}
      >
        <Arm sign={1} />
      </group>
      <group
        ref={armLeft}
        position={[-0.48, -0.52, -0.9]}
        rotation={IDLE_ARM_ROTATION_LEFT}
      >
        <Arm sign={-1} />
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Texturas procedurales
// ---------------------------------------------------------------------------

/** Césped procedural. Pixelado en modo blocky, suave en modo redondo. */
function useGrassTexture() {
  const style = useWorldStyle();
  return useMemo(() => {
    const size = 64;
    const cell = style === "blocky" ? 4 : 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const rand = mulberry32(7);
    const greens =
      style === "blocky"
        ? ["#6fbf44", "#5fae3c", "#7bc94f", "#67b841", "#58a839", "#74c24a"]
        : ["#71c05a", "#67b755", "#7cc766", "#6bbc5b", "#63b352", "#78c463"];
    for (let y = 0; y < size; y += cell) {
      for (let x = 0; x < size; x += cell) {
        ctx.fillStyle = greens[Math.floor(rand() * greens.length)];
        ctx.fillRect(x, y, cell, cell);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = style === "blocky" ? THREE.NearestFilter : THREE.LinearFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(90, 90);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [style]);
}

/** Adoquines de piedra para plaza y caminos. */
function useStoneTexture() {
  const style = useWorldStyle();
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const rand = mulberry32(313);
    ctx.fillStyle = "#5f5a52"; // mortero
    ctx.fillRect(0, 0, size, size);
    const cells = 5;
    const step = size / cells;
    for (let gy = 0; gy < cells; gy++) {
      for (let gx = 0; gx < cells; gx++) {
        const j = step * 0.14;
        const x = gx * step + (rand() - 0.5) * j + 3;
        const y = gy * step + (rand() - 0.5) * j + 3;
        const w = step - 6 + (rand() - 0.5) * j;
        const h = step - 6 + (rand() - 0.5) * j;
        const g = 128 + Math.floor(rand() * 54);
        ctx.fillStyle = `rgb(${g},${g - 4},${g - 10})`;
        const r = 4;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.fill();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = style === "blocky" ? THREE.NearestFilter : THREE.LinearFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [style]);
}

// ---------------------------------------------------------------------------
// Suelo, cielo y ambiente
// ---------------------------------------------------------------------------

function GrassFloor() {
  const texture = useGrassTexture();
  return (
    // Lo bastante grande para que las faldas de las montañas no lo desborden
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[320, 320]} />
      <meshStandardMaterial map={texture} roughness={1} />
    </mesh>
  );
}

/** Geometría de un matojo: varias briznas curvadas y estrechadas, con degradado
 *  de color de la base (oscura) a la punta (clara). Una sola geometría instanciada. */
function makeBladeTuft() {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const base = new THREE.Color("#3c7a2c");
  const tip = new THREE.Color("#9bd662");
  const bladeCount = 4;
  let vOffset = 0;

  for (let b = 0; b < bladeCount; b++) {
    const ang = (b / bladeCount) * Math.PI * 2 + 0.4;
    const dirx = Math.cos(ang);
    const dirz = Math.sin(ang);
    const perpx = -dirz;
    const perpz = dirx;
    const lean = 0.1 + (b % 2) * 0.04;
    // Filas de la brizna: altura, semiancho, avance hacia fuera (curvatura)
    const rows = [
      { y: 0, hw: 0.032, f: 0 },
      { y: 0.28, hw: 0.02, f: lean * 0.5 },
      { y: 0.52, hw: 0.005, f: lean },
    ];
    rows.forEach((r, ri) => {
      const cx = dirx * r.f;
      const cz = dirz * r.f;
      const t = ri / (rows.length - 1);
      const col = base.clone().lerp(tip, t);
      positions.push(cx - perpx * r.hw, r.y, cz - perpz * r.hw);
      positions.push(cx + perpx * r.hw, r.y, cz + perpz * r.hw);
      colors.push(col.r, col.g, col.b, col.r, col.g, col.b);
    });
    for (let ri = 0; ri < rows.length - 1; ri++) {
      const a = vOffset + ri * 2;
      const bb = vOffset + ri * 2 + 1;
      const c = vOffset + (ri + 1) * 2;
      const d = vOffset + (ri + 1) * 2 + 1;
      indices.push(a, bb, c, bb, d, c);
    }
    vOffset += rows.length * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** Hierba alta: matojos de briznas instanciados, con viento suave por shader. */
function TallGrass({ clear }: { clear: (x: number, z: number) => boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const uTime = useRef({ value: 0 }).current;

  const tufts = useMemo(() => {
    const rand = mulberry32(4242);
    const list: { x: number; z: number; s: number; rot: number; c: number }[] =
      [];
    let attempts = 0;
    while (list.length < 1500 && attempts < 12000) {
      attempts++;
      const angle = rand() * Math.PI * 2;
      const radius = 8 + rand() * 40;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      if (!clear(x, z)) continue;
      list.push({
        x,
        z,
        s: 0.75 + rand() * 0.9,
        rot: rand() * Math.PI * 2,
        c: rand(),
      });
    }
    return list;
  }, [clear]);

  const geometry = useMemo(makeBladeTuft, []);
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 1,
    });
    // Viento: las briznas ondulan según su altura y su posición en el mundo
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime;
      shader.vertexShader =
        "uniform float uTime;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           float wPhase = instanceMatrix[3].x * 0.6 + instanceMatrix[3].z * 0.6;
           float bend = position.y * position.y;
           transformed.x += sin(uTime * 1.6 + wPhase) * bend * 0.55;
           transformed.z += cos(uTime * 1.3 + wPhase) * bend * 0.3;`,
        );
    };
    return mat;
  }, [uTime]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    tufts.forEach((b, i) => {
      dummy.position.set(b.x, 0, b.z);
      dummy.rotation.set(0, b.rot, 0);
      dummy.scale.set(0.9 + b.c * 0.3, b.s, 0.9 + b.c * 0.3);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      // Tinte sutil por matojo alrededor del blanco (no oscurece el degradado)
      color.setRGB(0.88 + b.c * 0.14, 0.94 + b.c * 0.08, 0.82 + b.c * 0.12);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [tufts]);

  useFrame(({ clock }) => {
    uTime.value = clock.elapsedTime;
  });

  return <instancedMesh ref={ref} args={[geometry, material, tufts.length]} />;
}

/** Nubes que derivan lentamente (esponjosas en modo redondo). */
function Clouds() {
  const group = useRef<THREE.Group>(null);
  const clouds = useMemo(() => {
    const rand = mulberry32(21);
    return Array.from({ length: 9 }, () => ({
      x: (rand() - 0.5) * 180,
      y: 26 + rand() * 8,
      z: (rand() - 0.5) * 180,
      w: 7 + rand() * 9,
      d: 4 + rand() * 6,
      speed: 0.4 + rand() * 0.6,
    }));
  }, []);

  useFrame((_, delta) => {
    group.current?.children.forEach((cloud, i) => {
      cloud.position.x += clouds[i].speed * delta;
      if (cloud.position.x > 100) cloud.position.x = -100;
    });
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <Block key={i} args={[c.w, 0.9, c.d]} radius={0.45} position={[c.x, c.y, c.z]}>
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.55}
            transparent
            opacity={0.92}
          />
        </Block>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Árboles, rocas, flores, hierba
// ---------------------------------------------------------------------------

/** Holograma de Jorge en el centro de la plaza: proyector de piedra con anillo
 *  de energía, la silueta flotando (siempre de cara al jugador) y motas que
 *  ascienden. Es el mismo holograma del hero de la landing, viviendo en el pueblo. */
function PlazaHologram() {
  const style = useWorldStyle();
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [aspect, setAspect] = useState(1);
  const holo = useRef<THREE.Group>(null);
  const ring = useRef<THREE.MeshStandardMaterial>(null);
  const moteRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { camera } = useThree();

  useEffect(() => {
    let alive = true;
    // Variante sin el disco proyector pintado: aquí la peana ya es 3D
    new THREE.TextureLoader().load("/jorge-holo-head.webp", (t) => {
      if (!alive) return;
      t.colorSpace = THREE.SRGBColorSpace;
      setAspect(t.image.width / t.image.height);
      setTex(t);
    });
    return () => {
      alive = false;
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (holo.current) {
      holo.current.position.y = 2.9 + Math.sin(t * 1.1) * 0.12;
      // Billboard en yaw: la silueta siempre mira al jugador
      holo.current.rotation.y = Math.atan2(camera.position.x, camera.position.z);
    }
    if (ring.current) {
      ring.current.emissiveIntensity = 1.6 + Math.sin(t * 2.2) * 0.5;
    }
    moteRefs.current.forEach((m, i) => {
      if (!m) return;
      const p = (t * 0.22 + i * 0.26) % 1;
      const a = i * 2.4 + t * 0.5;
      const r = 0.85 - p * 0.35;
      m.position.set(Math.cos(a) * r, 0.6 + p * 3.6, Math.sin(a) * r);
      (m.material as THREE.MeshBasicMaterial).opacity =
        p < 0.12 ? p * 8 : Math.max(0, 1 - p) * 0.9;
    });
  });

  const holoHeight = 2.6;
  return (
    <group>
      {/* Peana del proyector: piedra + disco oscuro + anillo de energía */}
      <Block args={[2.8, 0.35, 2.8]} radius={0.5} castShadow position={[0, 0.18, 0]}>
        <meshStandardMaterial color="#9a9a9a" flatShading={style === "blocky"} />
      </Block>
      <Block args={[2, 0.25, 2]} radius={0.4} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#2b3440" flatShading={style === "blocky"} />
      </Block>
      <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.78, 0.07, 10, 36]} />
        <meshStandardMaterial
          ref={ring}
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 1.2, 0]} color="#57e6ff" intensity={1.4} distance={9} />

      {/* Cono de proyección */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[1.15, 0.55, 3.6, 24, 1, true]} />
        <meshBasicMaterial
          color="#7fe3ff"
          transparent
          opacity={0.09}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* La silueta holográfica */}
      {tex && (
        <group ref={holo} position={[0, 2.9, 0]}>
          <mesh>
            <planeGeometry args={[holoHeight * aspect, holoHeight]} />
            <meshBasicMaterial
              map={tex}
              transparent
              opacity={0.92}
              color="#d8fbff"
              toneMapped={false}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Motas de luz ascendentes */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} ref={(m) => void (moteRefs.current[i] = m)}>
          <sphereGeometry args={[0.045, 6, 6]} />
          <meshBasicMaterial color="#aef2ff" transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Bosque de árboles con variantes de color y tamaño. */
function DecorTrees() {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const leafColors = ["#3f9e33", "#57b23f", "#2f8f4a"];
  const trunkColors = ["#6b4a2b", "#7d5a35", "#d9cbb2"];
  return (
    <>
      {TREE_SPOTS.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.scale}>
          <Block args={[0.8, 3.2, 0.8]} radius={0.28} castShadow position={[0, 1.6, 0]}>
            <meshStandardMaterial color={trunkColors[t.variant]} flatShading={flat} />
          </Block>
          <Block args={[3.4, 1.8, 3.4]} radius={0.85} castShadow position={[0, 3.7, 0]}>
            <meshStandardMaterial color={leafColors[t.variant]} flatShading={flat} />
          </Block>
          <Block args={[2.2, 1.2, 2.2]} radius={0.6} castShadow position={[0, 5, 0]}>
            <meshStandardMaterial
              color={leafColors[(t.variant + 1) % 3]}
              flatShading={flat}
            />
          </Block>
        </group>
      ))}
    </>
  );
}

/** Rocas grises (cantos rodados en modo redondo). */
function Rocks() {
  const style = useWorldStyle();
  return (
    <>
      {ROCK_SPOTS.map((r, i) => (
        <Block
          key={i}
          args={[1, 1, 1]}
          radius={0.42}
          castShadow
          position={[r.x, r.s * 0.35, r.z]}
          rotation={[0, r.rot, 0]}
          scale={[r.s * 1.4, r.s, r.s]}
        >
          <meshStandardMaterial color="#8f8f8f" flatShading={style === "blocky"} />
        </Block>
      ))}
    </>
  );
}

/** Flores repartidas por el campo (nunca sobre plaza ni caminos). */
function Flowers({ clear }: { clear: (x: number, z: number) => boolean }) {
  const flowers = useMemo(() => {
    const rand = mulberry32(909);
    const colors = ["#e74c3c", "#f1c40f", "#ffffff", "#e67e22", "#c084fc"];
    const list: { x: number; z: number; color: string; scale: number }[] = [];
    let attempts = 0;
    while (list.length < 55 && attempts < 800) {
      attempts++;
      const angle = rand() * Math.PI * 2;
      const radius = 8 + rand() * 34;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      if (!clear(x, z)) continue;
      list.push({
        x,
        z,
        color: colors[Math.floor(rand() * colors.length)],
        scale: 0.8 + rand() * 0.6,
      });
    }
    return list;
  }, [clear]);

  return (
    <>
      {flowers.map((f, i) => (
        <group key={i} position={[f.x, 0, f.z]} scale={f.scale}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.06, 0.3, 0.06]} />
            <meshStandardMaterial color="#3e8e2f" />
          </mesh>
          <Block args={[0.16, 0.14, 0.16]} radius={0.06} position={[0, 0.35, 0]}>
            <meshStandardMaterial color={f.color} />
          </Block>
        </group>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Plaza, caminos, mobiliario
// ---------------------------------------------------------------------------

/** Plaza empedrada con bordillo, caminos de piedra con bordillos y bancos. */
function Plaza({ layout }: { layout: VillageLayout }) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const stone = useStoneTexture();
  const plazaTex = useMemo(() => {
    const t = stone.clone();
    t.needsUpdate = true;
    t.repeat.set(5, 5);
    return t;
  }, [stone]);
  const pathTex = useMemo(() => {
    const t = stone.clone();
    t.needsUpdate = true;
    t.repeat.set(1, 5);
    return t;
  }, [stone]);

  const kerb = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * Math.PI * 2;
        return { x: Math.cos(a) * PLAZA_RADIUS, z: Math.sin(a) * PLAZA_RADIUS, a };
      }),
    [],
  );

  return (
    <group>
      {/* Bordillo: cilindro oscuro que asoma como labio alrededor de la plaza */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[PLAZA_RADIUS + 0.35, PLAZA_RADIUS + 0.35, 0.2, 40]} />
        <meshStandardMaterial color="#4c473f" flatShading={flat} />
      </mesh>
      {/* Superficie empedrada */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.16, 0]} receiveShadow>
        <circleGeometry args={[PLAZA_RADIUS, 44]} />
        <meshStandardMaterial map={plazaTex} roughness={1} />
      </mesh>
      {/* Piedrecitas del borde */}
      {kerb.map((s, i) => (
        <mesh
          key={i}
          castShadow
          position={[s.x, 0.16, s.z]}
          rotation={[0, -s.a, 0]}
        >
          <boxGeometry args={[0.42, 0.24, 0.5]} />
          <meshStandardMaterial color={i % 2 ? "#b9b2a4" : "#a49c8e"} flatShading={flat} />
        </mesh>
      ))}

      {/* Caminos radiales de piedra con bordillos */}
      {layout.map((l, i) => {
        const len = PATH_OUTER - PATH_INNER;
        const mid = (PATH_OUTER + PATH_INNER) / 2;
        return (
          <group key={i} rotation={[0, l.angle, 0]}>
            <mesh position={[0, 0.07, mid]} receiveShadow>
              <boxGeometry args={[PATH_HALF_WIDTH * 2, 0.14, len]} />
              <meshStandardMaterial map={pathTex} roughness={1} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh
                key={s}
                castShadow
                position={[s * (PATH_HALF_WIDTH + 0.11), 0.12, mid]}
              >
                <boxGeometry args={[0.22, 0.2, len]} />
                <meshStandardMaterial color="#8f887b" flatShading={flat} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Bancos con gente sentada mirando el holograma de la plaza */}
      {BENCH_SPOTS.map((b, i) => (
        <group key={i} position={[b.x, 0.16, b.z]} rotation={[0, b.rotY, 0]}>
          <Block args={[1.6, 0.12, 0.5]} radius={0.06} castShadow position={[0, 0.45, 0]}>
            <meshStandardMaterial color="#9a794f" flatShading={flat} />
          </Block>
          <Block args={[1.6, 0.5, 0.1]} radius={0.05} castShadow position={[0, 0.72, -0.22]}>
            <meshStandardMaterial color="#9a794f" flatShading={flat} />
          </Block>
          <Block args={[0.12, 0.45, 0.45]} radius={0.05} position={[-0.65, 0.22, 0]}>
            <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
          </Block>
          <Block args={[0.12, 0.45, 0.45]} radius={0.05} position={[0.65, 0.22, 0]}>
            <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
          </Block>
          {[-0.4, 0.4].map((dx, j) => (
            <group key={j} position={[dx, 0.51, 0.02]}>
              <SeatedPerson
                look={SEAT_PEOPLE[(i * 2 + j) % SEAT_PEOPLE.length]}
                phase={(i * 2 + j) * 1.7}
              />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Farolillos de la plaza con linterna cálida. */
function LampPosts() {
  const style = useWorldStyle();
  return (
    <>
      {LAMP_SPOTS.map((l, i) => (
        <group key={i} position={[l.x, 0.16, l.z]}>
          <Block args={[0.14, 2.6, 0.14]} radius={0.06} castShadow position={[0, 1.3, 0]}>
            <meshStandardMaterial color="#3d3d3d" flatShading={style === "blocky"} />
          </Block>
          <Block args={[0.38, 0.42, 0.38]} radius={0.1} position={[0, 2.75, 0]}>
            <meshStandardMaterial
              color="#ffd27a"
              emissive="#ffb84d"
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </Block>
          <Block args={[0.48, 0.12, 0.48]} radius={0.05} castShadow position={[0, 3.02, 0]}>
            <meshStandardMaterial color="#3d3d3d" />
          </Block>
        </group>
      ))}
    </>
  );
}

/** Pozo de piedra junto a la plaza. */
/** Gente sentada en los bancos: cada una con peinado y accesorio distintos. */
type SeatLook = {
  skin: string;
  shirt: string;
  pants: string;
  hair: string;
  style: "short" | "tuft" | "long" | "bald";
  accessory: "none" | "glasses" | "beard" | "mustache";
  hat: "none" | "beanie" | "cap";
};

const SEAT_PEOPLE: SeatLook[] = [
  // Cresta, sin accesorio
  { skin: "#e8b98d", shirt: "#c94f4f", pants: "#3a4a6b", hair: "#2a1a10", style: "tuft", accessory: "none", hat: "none" },
  // Corto con gafas
  { skin: "#f0c9a0", shirt: "#2f9e57", pants: "#4a3520", hair: "#1f1f26", style: "short", accessory: "glasses", hat: "none" },
  // Pelo largo
  { skin: "#d8a171", shirt: "#7c5cd6", pants: "#2c2c34", hair: "#5a3a1a", style: "long", accessory: "none", hat: "none" },
  // Corto con barba
  { skin: "#e8b98d", shirt: "#e0912f", pants: "#3a4a6b", hair: "#3a2418", style: "short", accessory: "beard", hat: "none" },
  // Gorro de lana
  { skin: "#f0c9a0", shirt: "#3f6f9e", pants: "#4a3520", hair: "#2a1a10", style: "short", accessory: "none", hat: "beanie" },
  // Calvo con bigote y gorra
  { skin: "#d8a171", shirt: "#d6558e", pants: "#2c2c34", hair: "#1f1f26", style: "bald", accessory: "mustache", hat: "cap" },
];

/** Persona sentada, mirando hacia +Z (donde el banco encara la plaza). El
 *  origen del grupo está en la superficie del asiento; respira suavemente. */
function SeatedPerson({ look, phase }: { look: SeatLook; phase: number }) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const head = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (head.current) {
      const t = clock.elapsedTime + phase;
      head.current.rotation.y = Math.sin(t * 0.6) * 0.12;
      head.current.position.y = 0.94 + Math.sin(t * 1.4) * 0.012;
    }
  });
  const skinMat = () => <meshStandardMaterial color={look.skin} flatShading={flat} />;
  const hairMat = () => <meshStandardMaterial color={look.hair} flatShading={flat} />;
  return (
    <group>
      {/* Cadera y muslos (horizontales hacia delante) */}
      <Block args={[0.46, 0.2, 0.34]} radius={0.06} position={[0, 0.1, 0]}>
        <meshStandardMaterial color={look.pants} flatShading={flat} />
      </Block>
      <Block args={[0.42, 0.17, 0.5]} radius={0.06} castShadow position={[0, 0.14, 0.32]}>
        <meshStandardMaterial color={look.pants} flatShading={flat} />
      </Block>
      {/* Espinillas (bajan al suelo) y pies */}
      {[-0.11, 0.11].map((x) => (
        <group key={x}>
          <Block args={[0.16, 0.68, 0.16]} radius={0.06} castShadow position={[x, -0.34, 0.55]}>
            <meshStandardMaterial color={look.pants} flatShading={flat} />
          </Block>
          <Block args={[0.17, 0.12, 0.3]} radius={0.05} castShadow position={[x, -0.64, 0.66]}>
            <meshStandardMaterial color="#3a2c1c" flatShading={flat} />
          </Block>
        </group>
      ))}
      {/* Torso apoyado en el respaldo */}
      <Block args={[0.46, 0.52, 0.3]} radius={0.1} castShadow position={[0, 0.42, -0.03]}>
        <meshStandardMaterial color={look.shirt} flatShading={flat} />
      </Block>
      {/* Brazos descansando sobre los muslos */}
      {[-0.29, 0.29].map((x) => (
        <group key={x}>
          <Block args={[0.14, 0.44, 0.15]} radius={0.06} castShadow position={[x, 0.36, 0.02]}>
            <meshStandardMaterial color={look.shirt} flatShading={flat} />
          </Block>
          <Block args={[0.15, 0.12, 0.16]} radius={0.05} position={[x, 0.14, 0.16]}>
            {skinMat()}
          </Block>
        </group>
      ))}
      {/* Cuello + cabeza (con leve movimiento). Coordenadas relativas al
          centro de la cabeza; mismo lenguaje que los aldeanos de pie. */}
      <Block args={[0.18, 0.12, 0.18]} radius={0.05} position={[0, 0.72, -0.02]}>
        {skinMat()}
      </Block>
      <group ref={head} position={[0, 0.94, 0]}>
        <Block args={[0.36, 0.38, 0.36]} radius={0.12} castShadow>
          {skinMat()}
        </Block>
        {/* Orejas */}
        {[-0.19, 0.19].map((x) => (
          <Block key={x} args={[0.05, 0.1, 0.09]} radius={0.02} position={[x, 0, 0]}>
            {skinMat()}
          </Block>
        ))}
        {/* Nariz */}
        <Block args={[0.07, 0.08, 0.07]} radius={0.02} position={[0, -0.03, 0.19]}>
          {skinMat()}
        </Block>
        {/* Cejas */}
        {[-0.086, 0.086].map((x) => (
          <mesh key={x} position={[x, 0.094, 0.187]}>
            <boxGeometry args={[0.094, 0.022, 0.022]} />
            {hairMat()}
          </mesh>
        ))}
        {/* Ojos: blanco + pupila */}
        {[-0.086, 0.086].map((x) => (
          <group key={x} position={[x, 0.022, 0.18]}>
            <Block args={[0.086, 0.086, 0.02]} radius={0.03}>
              <meshStandardMaterial color="#f4f4f4" />
            </Block>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.04, 0.05, 0.02]} />
              <meshStandardMaterial color="#2c2c34" />
            </mesh>
          </group>
        ))}
        {/* Boca */}
        <mesh position={[0, -0.094, 0.19]}>
          <boxGeometry args={[0.122, 0.025, 0.02]} />
          <meshStandardMaterial color="#7a3b32" />
        </mesh>

        {/* Pelo (si no lleva gorro y no es calvo) */}
        {look.hat === "none" && look.style !== "bald" && (
          <>
            <Block args={[0.389, 0.13, 0.389]} radius={0.08} position={[0, 0.187, 0]}>
              {hairMat()}
            </Block>
            <Block args={[0.389, 0.086, 0.1]} radius={0.03} position={[0, 0.1, 0.158]}>
              {hairMat()}
            </Block>
            {[-0.194, 0.194].map((x) => (
              <Block key={x} args={[0.036, 0.216, 0.302]} radius={0.02} position={[x, 0.065, -0.014]}>
                {hairMat()}
              </Block>
            ))}
            {look.style === "tuft" && (
              <Block args={[0.158, 0.19, 0.202]} radius={0.06} position={[0, 0.31, -0.014]}>
                {hairMat()}
              </Block>
            )}
            {look.style === "long" && (
              <Block args={[0.36, 0.331, 0.1]} radius={0.05} position={[0, 0.014, -0.194]}>
                {hairMat()}
              </Block>
            )}
          </>
        )}

        {/* Gorros */}
        {look.hat === "beanie" && (
          <>
            <Block args={[0.403, 0.187, 0.403]} radius={0.11} position={[0, 0.16, 0]}>
              <meshStandardMaterial color={look.shirt} flatShading={flat} />
            </Block>
            <Block args={[0.418, 0.072, 0.418]} radius={0.04} position={[0, 0.055, 0]}>
              <meshStandardMaterial color="#eef1f4" flatShading={flat} />
            </Block>
            <Block args={[0.1, 0.1, 0.1]} radius={0.04} position={[0, 0.28, 0]}>
              <meshStandardMaterial color="#eef1f4" flatShading={flat} />
            </Block>
          </>
        )}
        {look.hat === "cap" && (
          <>
            <Block args={[0.403, 0.144, 0.403]} radius={0.1} position={[0, 0.16, 0]}>
              <meshStandardMaterial color="#2b6cb0" flatShading={flat} />
            </Block>
            <Block args={[0.36, 0.043, 0.216]} radius={0.02} position={[0, 0.09, 0.245]}>
              <meshStandardMaterial color="#2b6cb0" flatShading={flat} />
            </Block>
          </>
        )}

        {/* Accesorios */}
        {look.accessory === "glasses" && (
          <group position={[0, 0.022, 0.2]}>
            {[-0.086, 0.086].map((x) => (
              <Block key={x} args={[0.115, 0.1, 0.022]} radius={0.02} position={[x, 0, 0]}>
                <meshStandardMaterial color="#20242c" flatShading={flat} />
              </Block>
            ))}
            <mesh>
              <boxGeometry args={[0.072, 0.022, 0.022]} />
              <meshStandardMaterial color="#20242c" />
            </mesh>
          </group>
        )}
        {look.accessory === "mustache" && (
          <mesh position={[0, -0.072, 0.2]}>
            <boxGeometry args={[0.173, 0.04, 0.036]} />
            {hairMat()}
          </mesh>
        )}
        {look.accessory === "beard" && (
          <>
            <Block args={[0.317, 0.187, 0.173]} radius={0.06} position={[0, -0.13, 0.1]}>
              {hairMat()}
            </Block>
            <Block args={[0.173, 0.065, 0.065]} radius={0.02} position={[0, -0.065, 0.194]}>
              {hairMat()}
            </Block>
          </>
        )}
      </group>
    </group>
  );
}

/** Molino de viento con aspas girando, en las afueras. */
function Windmill() {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const blades = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (blades.current) blades.current.rotation.z += delta * 0.7;
  });
  return (
    <group position={[WINDMILL_POS.x, 0, WINDMILL_POS.z]} rotation={[0, Math.PI / 3, 0]}>
      <Block args={[3.2, 6, 3.2]} radius={0.5} castShadow position={[0, 3, 0]}>
        <meshStandardMaterial color="#cbb489" flatShading={flat} />
      </Block>
      <mesh castShadow position={[0, 6.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.7, 1.9, flat ? 4 : 10]} />
        <meshStandardMaterial color="#8a4a3a" flatShading={flat} />
      </mesh>
      <group ref={blades} position={[0, 5.6, 1.9]}>
        <Block args={[0.5, 0.5, 0.5]} radius={0.12} castShadow>
          <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
        </Block>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) => (
          <group key={a} rotation={[0, 0, a]}>
            <Block args={[0.4, 3.6, 0.1]} radius={0.05} castShadow position={[0, 2, 0]}>
              <meshStandardMaterial color="#ece1c8" flatShading={flat} />
            </Block>
          </group>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Zona personal: biblioteca, zona friki y campito de fútbol
// ---------------------------------------------------------------------------

/** Lecturas recomendadas de Jorge, en orden de ranking. */
const BOOKS = [
  { title: "Can't Hurt Me", author: "David Goggins", top: true, color: "#d97706" },
  { title: "Never Finished", author: "David Goggins", top: true, color: "#b91c1c" },
  { title: "Shoe Dog", author: "Phil Knight", top: false, color: "#ef4444" },
  { title: "Principles", author: "Ray Dalio", top: false, color: "#e2e8f0" },
  { title: "Zero to One", author: "Peter Thiel", top: false, color: "#2563eb" },
];

const DOOR_H = 2.5; // alto del hueco de puerta

/** Puerta de madera con bisagra que se abre sola (hacia dentro) al acercarse.
 *  La hoja encaja en un hueco de DOOR_W × DOOR_H con marco de jambas y dintel. */
function AutoDoor({ position }: { position: [number, number, number] }) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const hinge = useRef<THREE.Group>(null);
  const world = useRef(new THREE.Vector3());
  const { camera } = useThree();
  const LW = DOOR_W - 0.18; // ancho de la hoja (holgura en el hueco)
  const LH = DOOR_H - 0.12; // alto de la hoja

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const g = hinge.current;
    if (!g) return;
    g.getWorldPosition(world.current);
    const near =
      Math.hypot(
        camera.position.x - world.current.x,
        camera.position.z - world.current.z,
      ) < 3.4;
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      near ? 1.95 : 0, // hacia dentro, sin barrer al jugador
      1 - Math.exp(-delta * 6),
    );
  });

  return (
    <group position={position}>
      {/* Marco de madera que forra el hueco (jambas + dintel) */}
      {[-1, 1].map((s) => (
        <Block
          key={s}
          args={[0.1, DOOR_H, 0.36]}
          position={[s * (DOOR_W / 2 - 0.05), DOOR_H / 2, 0]}
        >
          <meshStandardMaterial color="#5a3d22" flatShading={flat} />
        </Block>
      ))}
      <Block args={[DOOR_W, 0.1, 0.36]} position={[0, DOOR_H - 0.05, 0]}>
        <meshStandardMaterial color="#5a3d22" flatShading={flat} />
      </Block>
      {/* Hoja con bisagra a la izquierda del hueco */}
      <group ref={hinge} position={[-(DOOR_W / 2 - 0.09), 0.02, 0]}>
        <Block args={[LW, LH, 0.08]} radius={0.02} castShadow position={[LW / 2, LH / 2, 0]}>
          <meshStandardMaterial color="#7a5230" flatShading={flat} />
        </Block>
        {/* Travesaños */}
        {[0.55, 1.75].map((y) => (
          <Block key={y} args={[LW - 0.14, 0.11, 0.11]} position={[LW / 2, y, 0]}>
            <meshStandardMaterial color="#5a3d22" flatShading={flat} />
          </Block>
        ))}
        {/* Pomo */}
        <Block args={[0.09, 0.09, 0.16]} position={[LW - 0.22, 1.15, 0]}>
          <meshStandardMaterial color="#d4af37" flatShading={flat} />
        </Block>
      </group>
    </group>
  );
}

/** Ventana con marco de madera y cristal que brilla suave. Atraviesa la
 *  pared, así se ve desde fuera y desde dentro. */
function WindowPane({
  position,
  rotY = 0,
}: {
  position: [number, number, number];
  rotY?: number;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <Block args={[1.15, 1.35, 0.42]} radius={0.03}>
        <meshStandardMaterial color="#5a3d22" flatShading={flat} />
      </Block>
      <Block args={[0.92, 1.12, 0.46]}>
        <meshStandardMaterial
          color="#bfe3f5"
          emissive="#9fd4ee"
          emissiveIntensity={0.35}
          flatShading={flat}
        />
      </Block>
      {/* Cruceta */}
      <Block args={[0.06, 1.12, 0.48]}>
        <meshStandardMaterial color="#5a3d22" flatShading={flat} />
      </Block>
      <Block args={[0.92, 0.06, 0.48]}>
        <meshStandardMaterial color="#5a3d22" flatShading={flat} />
      </Block>
    </group>
  );
}

/** Cartel de madera colgado con texto pintado (canvas), para que desde fuera
 *  se lea qué es cada edificio. */
function Signboard({
  text,
  emoji,
  bg,
  position,
  width = 2.6,
}: {
  text: string;
  emoji: string;
  bg: string;
  position: [number, number, number];
  width?: number;
}) {
  const tex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 100;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 320, 100);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 78, 320, 22);
    ctx.font = "42px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 44, 46);
    ctx.fillStyle = "#fdf6e3";
    ctx.font = "bold 34px Georgia, serif";
    ctx.fillText(text.toUpperCase(), 176, 50);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [text, emoji, bg]);
  const h = width * (100 / 320);
  return (
    <group position={position}>
      <Block args={[width + 0.18, h + 0.18, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4a3520" />
      </Block>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[width, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Edificio visitable: paredes que BUTAN entre postes de esquina salientes
 *  (sin caras coplanares, así no titilan las aristas), hueco de puerta con
 *  AutoDoor, zócalo de piedra, suelo/techo de madera y tejado piramidal recto
 *  (la escala en Z va en el grupo padre, tras la rotación, para no torcerlo). */
function BuildingShell({
  w,
  d,
  h,
  roofColor,
  wallColor = "#e8d8b0",
  children,
}: {
  w: number;
  d: number;
  h: number;
  roofColor: string;
  wallColor?: string;
  children?: ReactNode;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const wallT = 0.25;
  const postT = 0.44;
  const postC = 0.16; // centro de poste medido desde el borde (sobresale ~0.06)
  const postInner = w / 2 - postC - postT / 2; // cara interior de poste (X)
  const postInnerZ = d / 2 - postC - postT / 2;
  const wallMat = <meshStandardMaterial color={wallColor} flatShading={flat} />;
  const trimMat = () => <meshStandardMaterial color="#6b4a2b" flatShading={flat} />;
  const roofR = (w + 0.8) / 1.414; // pirámide de 4 caras que cubre el ancho
  const roofScaleZ = (d + 0.8) / (w + 0.8);
  const frontSegW = postInner + postT / 2 - DOOR_W / 2; // ancho del segmento entre poste y puerta

  return (
    <group>
      {/* Zócalo de piedra y suelo de madera */}
      <Block args={[w + 0.4, 0.3, d + 0.4]} position={[0, 0.15, 0]} receiveShadow>
        <meshStandardMaterial color="#8f8f8f" flatShading={flat} />
      </Block>
      <Block args={[w - 0.3, 0.14, d - 0.3]} position={[0, 0.3, 0]} receiveShadow>
        <meshStandardMaterial color="#9a7648" flatShading={flat} />
      </Block>

      {/* Pared trasera (buta entre postes) */}
      <Block args={[w - 2 * postC, h, wallT]} castShadow position={[0, h / 2, -d / 2 + wallT / 2]}>
        {wallMat}
      </Block>
      {/* Paredes laterales (butan entre paredes frontal y trasera) */}
      {[-1, 1].map((s) => (
        <Block
          key={s}
          args={[wallT, h, d - 2 * wallT]}
          castShadow
          position={[s * (w / 2 - wallT / 2), h / 2, 0]}
        >
          {wallMat}
        </Block>
      ))}
      {/* Fachada: dos segmentos a los lados del hueco de puerta */}
      {[-1, 1].map((s) => (
        <Block
          key={`f${s}`}
          args={[frontSegW, h, wallT]}
          castShadow
          position={[s * (DOOR_W / 2 + frontSegW / 2), h / 2, d / 2 - wallT / 2]}
        >
          {wallMat}
        </Block>
      ))}
      {/* Dintel sobre la puerta */}
      <Block args={[DOOR_W, h - DOOR_H, wallT]} position={[0, DOOR_H + (h - DOOR_H) / 2, d / 2 - wallT / 2]}>
        {wallMat}
      </Block>

      {/* Postes de esquina salientes: tapan los encuentros de paredes */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <Block
            key={`${sx}${sz}`}
            args={[postT, h + 0.35, postT]}
            castShadow
            position={[sx * postInner, (h + 0.35) / 2, sz * postInnerZ]}
          >
            {trimMat()}
          </Block>
        )),
      )}

      {/* Techo interior y alero */}
      <Block args={[w - 0.3, 0.12, d - 0.3]} position={[0, h - 0.06, 0]}>
        <meshStandardMaterial color="#6e5335" flatShading={flat} />
      </Block>
      <Block args={[w + 0.8, 0.24, d + 0.8]} castShadow position={[0, h + 0.12, 0]}>
        <meshStandardMaterial color="#5a4a33" flatShading={flat} />
      </Block>
      {/* Tejado piramidal recto: escala Z en el grupo padre (tras la rotación) */}
      <group position={[0, h + 0.24, 0]} scale={[1, 1, roofScaleZ]}>
        <mesh castShadow rotation={[0, Math.PI / 4, 0]} position={[0, 1.1, 0]}>
          <coneGeometry args={[roofR, 2.2, 4]} />
          <meshStandardMaterial color={roofColor} flatShading={flat} />
        </mesh>
      </group>

      {/* Puerta automática, empotrada en el plano de fachada */}
      <AutoDoor position={[0, 0.3, d / 2 - wallT / 2]} />
      {/* Luz interior cálida */}
      <pointLight position={[0, h - 0.9, 0]} color="#ffe0b3" intensity={1.6} distance={11} />
      {children}
    </group>
  );
}

/** Paleta de lomos decorativos de las estanterías. */
const SPINE_COLORS = [
  "#b5443c",
  "#3f6f9e",
  "#4e8a4a",
  "#c9a13b",
  "#7b5cb8",
  "#b06a3b",
  "#6b7f8c",
  "#93384f",
];

/** Estantería llena de libros decorativos (deterministas por semilla). */
function Bookcase({
  seed,
  position,
}: {
  seed: number;
  position: [number, number, number];
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const rows = useMemo(() => {
    const rand = mulberry32(seed);
    return [0.28, 1.18, 2.08].map((baseY) => {
      const books: { x: number; w: number; h: number; color: string }[] = [];
      let cursor = -1.42;
      while (cursor < 1.3) {
        const w = 0.15 + rand() * 0.1;
        books.push({
          x: cursor + w / 2,
          w,
          h: 0.52 + rand() * 0.2,
          color: SPINE_COLORS[Math.floor(rand() * SPINE_COLORS.length)],
        });
        cursor += w + 0.015 + rand() * 0.03;
      }
      return { baseY, books };
    });
  }, [seed]);

  return (
    <group position={position}>
      {/* Marco, trasera y baldas */}
      {[-1, 1].map((s) => (
        <Block key={s} args={[0.14, 2.9, 0.5]} castShadow position={[s * 1.58, 1.45, 0]}>
          <meshStandardMaterial color="#4a3520" flatShading={flat} />
        </Block>
      ))}
      {[0.2, 1.1, 2.0, 2.85].map((y) => (
        <Block key={y} args={[3.3, 0.1, 0.5]} position={[0, y, 0]}>
          <meshStandardMaterial color="#4a3520" flatShading={flat} />
        </Block>
      ))}
      <Block args={[3.3, 2.85, 0.06]} position={[0, 1.5, -0.24]}>
        <meshStandardMaterial color="#33241a" flatShading={flat} />
      </Block>
      {/* Lomos */}
      {rows.map((row) =>
        row.books.map((b, i) => (
          <mesh key={`${row.baseY}-${i}`} position={[b.x, row.baseY + b.h / 2, 0.02]}>
            <boxGeometry args={[b.w, b.h, 0.34]} />
            <meshStandardMaterial color={b.color} flatShading={flat} />
          </mesh>
        )),
      )}
    </group>
  );
}

/** Biblioteca visitable: fachada con cartel, estanterías llenas, mesa
 *  expositora con las cinco lecturas recomendadas, sillón y alfombra. Al
 *  acercarse a las estanterías, E (o toque) abre un diálogo estilo aldeano
 *  donde Jorge cuenta los libros. */
function RecommendedLibrary({
  dict,
  touch,
  paused,
  onLibrary,
}: {
  dict: Dictionary;
  touch: boolean;
  paused: boolean;
  onLibrary: () => void;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const { camera } = useThree();
  const [near, setNear] = useState(false);
  const nearRef = useRef(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // Punto de interacción: las estanterías del fondo, en coords de mundo
  const focus = useMemo(() => {
    const cos = Math.cos(LIBRARY_POS.rotY);
    const sin = Math.sin(LIBRARY_POS.rotY);
    const cx = 0;
    const cz = -1.6;
    return {
      x: LIBRARY_POS.x + cx * cos + cz * sin,
      z: LIBRARY_POS.z - cx * sin + cz * cos,
    };
  }, []);

  useFrame(() => {
    const d = Math.hypot(camera.position.x - focus.x, camera.position.z - focus.z);
    const isNear = d < 3.4;
    if (isNear !== nearRef.current) {
      nearRef.current = isNear;
      setNear(isNear);
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.code === "KeyE" || e.code === "Enter") && nearRef.current && !pausedRef.current) {
        onLibrary();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onLibrary]);

  return (
    <group
      position={[LIBRARY_POS.x, 0, LIBRARY_POS.z]}
      rotation={[0, LIBRARY_POS.rotY, 0]}
    >
      <BuildingShell w={8} d={6} h={3.4} roofColor="#3f6212" wallColor="#e6d3a8">
        {/* Ventanas: una a cada lado de la puerta y una por lateral */}
        <WindowPane position={[-2.7, 1.7, 3.0]} />
        <WindowPane position={[2.7, 1.7, 3.0]} />
        <WindowPane position={[-3.9, 1.7, -0.4]} rotY={Math.PI / 2} />
        <WindowPane position={[3.9, 1.7, -0.4]} rotY={Math.PI / 2} />

        {/* Estanterías del fondo (interactuables) */}
        <group onClick={() => nearRef.current && !pausedRef.current && onLibrary()}>
          <Bookcase seed={101} position={[-1.75, 0.35, -2.5]} />
          <Bookcase seed={202} position={[1.75, 0.35, -2.5]} />
        </group>

        {/* Mesa expositora con las 5 recomendaciones de cara al visitante */}
        <group position={[1.5, 0.35, 0.3]}>
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sz) => (
              <Block key={`${sx}${sz}`} args={[0.1, 0.82, 0.1]} position={[sx * 0.75, 0.41, sz * 0.35]}>
                <meshStandardMaterial color="#5a3d22" flatShading={flat} />
              </Block>
            )),
          )}
          <Block args={[1.7, 0.1, 0.9]} castShadow position={[0, 0.87, 0]}>
            <meshStandardMaterial color="#7a5230" flatShading={flat} />
          </Block>
          <Block args={[1.72, 0.02, 0.5]} position={[0, 0.93, 0]}>
            <meshStandardMaterial color="#7f1d1d" flatShading={flat} />
          </Block>
          {BOOKS.map((b, i) => (
            <group key={b.title} position={[-0.64 + i * 0.32, 0, 0]} rotation={[0, (i - 2) * 0.06, 0]}>
              <Block args={[0.26, 0.44, 0.08]} radius={0.01} position={[0, 0.93 + 0.22, 0]}>
                <meshStandardMaterial color={b.color} flatShading={flat} />
              </Block>
            </group>
          ))}
          {/* Velita */}
          <Block args={[0.07, 0.16, 0.07]} position={[0.75, 1.0, -0.32]}>
            <meshStandardMaterial color="#f5ead6" flatShading={flat} />
          </Block>
          <Block args={[0.045, 0.05, 0.045]} position={[0.75, 1.1, -0.32]}>
            <meshStandardMaterial
              color="#ffb84d"
              emissive="#ff9d2e"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </Block>
        </group>

        {/* Sillón de lectura y alfombra */}
        <group position={[-2.3, 0.35, 0.4]}>
          <Block args={[1.0, 0.5, 1.0]} castShadow position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#a34d3f" flatShading={flat} />
          </Block>
          <Block args={[1.0, 0.9, 0.22]} castShadow position={[0, 0.75, -0.4]}>
            <meshStandardMaterial color="#a34d3f" flatShading={flat} />
          </Block>
          {[-1, 1].map((s) => (
            <Block key={s} args={[0.2, 0.4, 0.9]} position={[s * 0.42, 0.6, 0]}>
              <meshStandardMaterial color="#8c4136" flatShading={flat} />
            </Block>
          ))}
          <Block args={[0.78, 0.14, 0.75]} position={[0, 0.56, 0.06]}>
            <meshStandardMaterial color="#c96f5f" flatShading={flat} />
          </Block>
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.38, 0.3]}>
          <circleGeometry args={[1.3, 24]} />
          <meshStandardMaterial color="#b08968" roughness={1} />
        </mesh>

        {/* Cartel exterior sobre la puerta */}
        <Signboard text={dict.world.personal.library} emoji="📚" bg="#3f6212" position={[0, 2.95, 3.0]} width={2.4} />

        {/* Aviso de interacción estilo aldeano (flotante sobre las estanterías) */}
        {near && (
          <Html
            center
            distanceFactor={9}
            zIndexRange={[15, 0]}
            position={[0, 2.6, -1.9]}
            style={{ pointerEvents: "none" }}
          >
            <div className="animate-pulse whitespace-nowrap rounded-full bg-[#e0a82f] px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-white shadow-lg">
              {touch ? dict.world.hintNearTouch : dict.world.hintNear}
            </div>
          </Html>
        )}
      </BuildingShell>
      <Html
        center
        distanceFactor={12}
        zIndexRange={[15, 0]}
        position={[0, 6.1, 0]}
        style={{ pointerEvents: "none" }}
      >
        <p className="whitespace-nowrap rounded-lg bg-[#3f6212] px-3 py-1 text-sm font-bold text-white shadow-lg">
          📚 {dict.world.personal.library}
        </p>
      </Html>
    </group>
  );
}

/** Pósters procedurales de la zona friki (pintados en canvas). */
function usePosterTextures() {
  return useMemo(() => {
    const make = (draw: (ctx: CanvasRenderingContext2D) => void) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 176;
      const ctx = canvas.getContext("2d")!;
      draw(ctx);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };
    const title = (
      ctx: CanvasRenderingContext2D,
      text: string,
      color: string,
    ) => {
      ctx.fillStyle = color;
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(text, 64, 162);
    };

    const spiderman = make((ctx) => {
      ctx.fillStyle = "#b31219";
      ctx.fillRect(0, 0, 128, 176);
      // Telaraña
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(64, 70);
        ctx.lineTo(64 + Math.cos((i / 8) * Math.PI * 2) * 90, 70 + Math.sin((i / 8) * Math.PI * 2) * 90);
        ctx.stroke();
      }
      for (const r of [22, 42, 62]) {
        ctx.beginPath();
        ctx.arc(64, 70, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Araña
      ctx.fillStyle = "#0a0a0a";
      ctx.beginPath();
      ctx.ellipse(64, 74, 9, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0a0a0a";
      ctx.lineWidth = 3;
      for (const [dx, dy] of [[-22, -18], [22, -18], [-26, 0], [26, 0], [-22, 18], [22, 18], [-14, 28], [14, 28]]) {
        ctx.beginPath();
        ctx.moveTo(64, 72);
        ctx.lineTo(64 + dx, 72 + dy);
        ctx.stroke();
      }
      title(ctx, "SPIDER-MAN", "#ffffff");
    });

    const pokemon = make((ctx) => {
      ctx.fillStyle = "#f7f7f7";
      ctx.fillRect(0, 0, 128, 176);
      // Pokébola
      ctx.beginPath();
      ctx.arc(64, 74, 36, Math.PI, 0);
      ctx.fillStyle = "#ee1515";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(64, 74, 36, 0, Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(64, 74, 36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(28, 74);
      ctx.lineTo(100, 74);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(64, 74, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.stroke();
      title(ctx, "POKÉMON", "#2a75bb");
    });

    const rickMorty = make((ctx) => {
      ctx.fillStyle = "#0d1f14";
      ctx.fillRect(0, 0, 128, 176);
      // Portal verde
      for (const [r, c] of [
        [44, "#3f7d2c"],
        [36, "#97ce4c"],
        [27, "#c8f169"],
        [18, "#97ce4c"],
        [10, "#e8ffd0"],
      ] as const) {
        ctx.beginPath();
        ctx.arc(64, 74, r, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      }
      title(ctx, "RICK & MORTY", "#97ce4c");
    });

    const minecraft = make((ctx) => {
      // Cielo, banda de hierba y tierra con pixelado
      ctx.fillStyle = "#7fb2e5";
      ctx.fillRect(0, 0, 128, 64);
      ctx.fillStyle = "#67b841";
      ctx.fillRect(0, 64, 128, 14);
      const rand = mulberry32(42);
      const browns = ["#7a5230", "#6c4628", "#835a36", "#5f3f24"];
      for (let y = 78; y < 176; y += 8) {
        for (let x = 0; x < 128; x += 8) {
          ctx.fillStyle = browns[Math.floor(rand() * browns.length)];
          ctx.fillRect(x, y, 8, 8);
        }
      }
      ctx.fillStyle = "#3f3f3f";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("MINECRAFT", 65, 163);
      ctx.fillStyle = "#ffffff";
      ctx.fillText("MINECRAFT", 64, 162);
    });

    const valorant = make((ctx) => {
      ctx.fillStyle = "#0f1923";
      ctx.fillRect(0, 0, 128, 176);
      ctx.strokeStyle = "#ff4655";
      ctx.lineWidth = 13;
      ctx.beginPath();
      ctx.moveTo(32, 40);
      ctx.lineTo(64, 108);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(96, 40);
      ctx.lineTo(76, 82);
      ctx.stroke();
      title(ctx, "VALORANT", "#ece8e1");
    });

    return { spiderman, pokemon, rickMorty, minecraft, valorant };
  }, []);
}

/** Figurita tipo funko: cabezón y cuerpo pequeño. */
function Funko({ color, position }: { color: string; position: [number, number, number] }) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  return (
    <group position={position}>
      <Block args={[0.18, 0.2, 0.13]} radius={0.04} position={[0, 0.1, 0]}>
        <meshStandardMaterial color={color} flatShading={flat} />
      </Block>
      <Block args={[0.26, 0.26, 0.24]} radius={0.06} position={[0, 0.34, 0]}>
        <meshStandardMaterial color="#e8b98d" flatShading={flat} />
      </Block>
      <Block args={[0.27, 0.1, 0.25]} radius={0.04} position={[0, 0.44, 0]}>
        <meshStandardMaterial color={color} flatShading={flat} />
      </Block>
    </group>
  );
}

/** Zona friki visitable: pósters, tira LED, rincón gaming con sofá y TV,
 *  escritorio con PC, funkos, cartas de Pokémon y puf. */
function GeekDen({ dict }: { dict: Dictionary }) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const posters = usePosterTextures();
  const poster = (
    tex: THREE.Texture,
    position: [number, number, number],
    rotY = 0,
  ) => (
    <mesh position={position} rotation={[0, rotY, 0]}>
      <planeGeometry args={[1.2, 1.62]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
  return (
    <group position={[GEEK_POS.x, 0, GEEK_POS.z]} rotation={[0, GEEK_POS.rotY, 0]}>
      <BuildingShell w={9} d={7} h={3.6} roofColor="#6d28d9" wallColor="#d8cbe6">
        {/* Ventana al frente, a la derecha de la puerta */}
        <WindowPane position={[2.9, 1.7, 3.375]} />
        {/* Cartel exterior sobre la puerta */}
        <Signboard text={dict.world.personal.geek} emoji="🕹️" bg="#6d28d9" position={[0, 3.05, 3.5]} width={2.4} />

        {/* Pósters: tres al fondo, dos en la pared izquierda */}
        {poster(posters.spiderman, [-2.6, 2.35, -3.18])}
        {poster(posters.pokemon, [0, 2.35, -3.18])}
        {poster(posters.rickMorty, [2.6, 2.35, -3.18])}
        {poster(posters.minecraft, [-4.18, 2.35, -1.6], Math.PI / 2)}
        {poster(posters.valorant, [-4.18, 2.35, 0.6], Math.PI / 2)}

        {/* Tira LED del techo: cian delante, violeta al fondo */}
        <Block args={[8.2, 0.07, 0.07]} position={[0, 3.42, 3.0]}>
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Block>
        <Block args={[8.2, 0.07, 0.07]} position={[0, 3.42, -3.0]}>
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Block>

        {/* TV en la pared derecha con mueble y consolas */}
        <Block args={[0.1, 1.1, 1.9]} position={[4.13, 2.1, -0.5]}>
          <meshStandardMaterial color="#111827" flatShading={flat} />
        </Block>
        <Block args={[0.05, 0.95, 1.7]} position={[4.06, 2.1, -0.5]}>
          <meshStandardMaterial
            color="#16324a"
            emissive="#16324a"
            emissiveIntensity={0.7}
            flatShading={flat}
          />
        </Block>
        <Block args={[0.7, 0.5, 2.6]} castShadow position={[3.85, 0.6, -0.5]}>
          <meshStandardMaterial color="#5e4326" flatShading={flat} />
        </Block>
        {/* Nintendo: pantalla con joycons rojo y azul */}
        <group position={[3.8, 0.97, -1.35]}>
          <Block args={[0.06, 0.22, 0.46]}>
            <meshStandardMaterial color="#1f2937" flatShading={flat} />
          </Block>
          <Block args={[0.06, 0.22, 0.11]} position={[0, 0, -0.28]}>
            <meshStandardMaterial color="#ef4444" flatShading={flat} />
          </Block>
          <Block args={[0.06, 0.22, 0.11]} position={[0, 0, 0.28]}>
            <meshStandardMaterial color="#3b82f6" flatShading={flat} />
          </Block>
        </group>
        {/* PlayStation: torre blanca con núcleo negro y mando */}
        <group position={[3.8, 1.15, 0.1]}>
          <Block args={[0.17, 0.6, 0.38]} radius={0.05}>
            <meshStandardMaterial color="#f4f4f5" flatShading={flat} />
          </Block>
          <Block args={[0.18, 0.5, 0.13]}>
            <meshStandardMaterial color="#0a0a0a" flatShading={flat} />
          </Block>
        </group>
        <Block args={[0.24, 0.09, 0.16]} radius={0.04} position={[3.75, 0.9, 0.65]}>
          <meshStandardMaterial color="#1f2937" flatShading={flat} />
        </Block>

        {/* Sofá frente a la TV y alfombra */}
        <group position={[1.15, 0.35, -0.5]}>
          <Block args={[0.95, 0.45, 2.4]} castShadow position={[0, 0.225, 0]}>
            <meshStandardMaterial color="#46527a" flatShading={flat} />
          </Block>
          <Block args={[0.25, 0.75, 2.4]} castShadow position={[-0.45, 0.6, 0]}>
            <meshStandardMaterial color="#46527a" flatShading={flat} />
          </Block>
          {[-1, 1].map((s) => (
            <Block key={s} args={[0.95, 0.32, 0.25]} position={[0, 0.52, s * 1.32]}>
              <meshStandardMaterial color="#3c4668" flatShading={flat} />
            </Block>
          ))}
          {[-0.55, 0.55].map((z) => (
            <Block key={z} args={[0.8, 0.14, 1.0]} position={[0.05, 0.5, z]}>
              <meshStandardMaterial color="#5d6b96" flatShading={flat} />
            </Block>
          ))}
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.38, -0.5]}>
          <circleGeometry args={[1.6, 24]} />
          <meshStandardMaterial color="#4a3d5c" roughness={1} />
        </mesh>

        {/* Escritorio con PC y silla gamer (pared izquierda) */}
        <group position={[-3.55, 0.35, 1.5]}>
          {[-1, 1].map((s) => (
            <Block key={s} args={[0.08, 0.66, 0.08]} position={[0.35, 0.33, s * 0.85]}>
              <meshStandardMaterial color="#3b3b3b" flatShading={flat} />
            </Block>
          ))}
          <Block args={[0.95, 0.1, 1.9]} castShadow position={[0, 0.7, 0]}>
            <meshStandardMaterial color="#4a3520" flatShading={flat} />
          </Block>
          <Block args={[0.06, 0.55, 0.95]} position={[-0.3, 1.15, 0]}>
            <meshStandardMaterial
              color="#101828"
              emissive="#1e3a5f"
              emissiveIntensity={0.9}
              flatShading={flat}
            />
          </Block>
          <Block args={[0.3, 0.04, 0.62]} position={[0.18, 0.77, 0]}>
            <meshStandardMaterial color="#26262b" flatShading={flat} />
          </Block>
        </group>
        <group position={[-2.6, 0.35, 1.5]}>
          <Block args={[0.1, 0.5, 0.1]} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#26262b" flatShading={flat} />
          </Block>
          <Block args={[0.55, 0.1, 0.55]} position={[0, 0.55, 0]}>
            <meshStandardMaterial color="#d92626" flatShading={flat} />
          </Block>
          <Block args={[0.12, 0.75, 0.5]} position={[0.28, 0.95, 0]}>
            <meshStandardMaterial color="#d92626" flatShading={flat} />
          </Block>
        </group>

        {/* Balda de funkos (fondo derecha) */}
        <Block args={[2.4, 0.08, 0.42]} position={[2.5, 1.5, -3.1]}>
          <meshStandardMaterial color="#5e4326" flatShading={flat} />
        </Block>
        <Funko color="#c1121f" position={[1.7, 1.54, -3.1]} />
        <Funko color="#ffcb05" position={[2.25, 1.54, -3.1]} />
        <Funko color="#97ce4c" position={[2.8, 1.54, -3.1]} />
        <Funko color="#ff4655" position={[3.35, 1.54, -3.1]} />

        {/* Mesita de cartas de Pokémon con mazo, y un puf */}
        <group position={[-1.8, 0.35, -2.3]}>
          <Block args={[0.16, 0.6, 0.16]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
          </Block>
          <Block args={[1.2, 0.09, 0.8]} castShadow position={[0, 0.64, 0]}>
            <meshStandardMaterial color="#8a6a42" flatShading={flat} />
          </Block>
          {[-0.32, 0.0, 0.32].map((dx, i) => (
            <group key={i} position={[dx, 0.7, (i % 2) * 0.1 - 0.05]} rotation={[0, (i - 1) * 0.35, 0]}>
              <Block args={[0.26, 0.02, 0.36]}>
                <meshStandardMaterial color="#eab308" flatShading={flat} />
              </Block>
              <Block args={[0.2, 0.022, 0.28]}>
                <meshStandardMaterial color="#e5e7eb" flatShading={flat} />
              </Block>
            </group>
          ))}
          <Block args={[0.28, 0.14, 0.2]} position={[0.42, 0.76, 0.24]}>
            <meshStandardMaterial color="#f59e0b" flatShading={flat} />
          </Block>
        </group>
        <Block args={[0.9, 0.42, 0.9]} radius={0.18} castShadow position={[-0.3, 0.56, -2.6]}>
          <meshStandardMaterial color="#22c55e" flatShading={flat} />
        </Block>
      </BuildingShell>
      <Html
        center
        distanceFactor={12}
        zIndexRange={[15, 0]}
        position={[0, 6.5, 0]}
        style={{ pointerEvents: "none" }}
      >
        <p className="whitespace-nowrap rounded-lg bg-[#6d28d9] px-3 py-1 text-sm font-bold text-white shadow-lg">
          🕹️ {dict.world.personal.geek}
        </p>
      </Html>
    </group>
  );
}

/** Campito de fútbol con césped a franjas, gradas a los dos lados, porterías
 *  con red, áreas marcadas, banderines de córner y balón. */
function FootballPitch() {
  const style = useWorldStyle();
  const flat = style === "blocky";

  // Césped segado a franjas
  const grassTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#4c9a3a" : "#58ab44";
      ctx.fillRect(0, i * 32, 32, 32);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Red de portería: rejilla blanca sobre fondo transparente
  const netTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "rgba(245,245,245,0.9)";
    ctx.lineWidth = 2;
    for (let i = 0; i <= 64; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 64);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(64, i);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 2);
    return tex;
  }, []);

  const GOAL_HW = 1.7; // media anchura de portería
  const GOAL_H = 1.5; // alto
  const NET_D = 1.1; // fondo de la red (hacia atrás)
  const netMat = () => (
    <meshBasicMaterial
      map={netTex}
      transparent
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  );
  const goal = (end: number) => (
    <group position={[0, 0, end * (PITCH_L / 2)]}>
      {/* Postes y larguero (marco delantero, en la línea de gol) */}
      {[-1, 1].map((s) => (
        <Block key={s} args={[0.12, GOAL_H, 0.12]} castShadow position={[s * GOAL_HW, GOAL_H / 2, 0]}>
          <meshStandardMaterial color="#f2f2f2" flatShading={flat} />
        </Block>
      ))}
      <Block args={[GOAL_HW * 2 + 0.12, 0.12, 0.12]} castShadow position={[0, GOAL_H, 0]}>
        <meshStandardMaterial color="#f2f2f2" flatShading={flat} />
      </Block>
      {/* Postes traseros que sujetan la red */}
      {[-1, 1].map((s) => (
        <Block key={`b${s}`} args={[0.08, GOAL_H - 0.4, 0.08]} position={[s * GOAL_HW, (GOAL_H - 0.4) / 2, end * NET_D]}>
          <meshStandardMaterial color="#e2e2e2" flatShading={flat} />
        </Block>
      ))}
      {/* Red: fondo vertical, dos laterales y techo (caja de la red) */}
      <mesh position={[0, (GOAL_H - 0.4) / 2, end * NET_D]}>
        <planeGeometry args={[GOAL_HW * 2, GOAL_H - 0.4]} />
        {netMat()}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`s${s}`} position={[s * GOAL_HW, GOAL_H / 2 - 0.1, (end * NET_D) / 2]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[NET_D, GOAL_H - 0.2]} />
          {netMat()}
        </mesh>
      ))}
      <mesh position={[0, GOAL_H - 0.16, (end * NET_D) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GOAL_HW * 2, NET_D]} />
        {netMat()}
      </mesh>
    </group>
  );

  // Gradas: tres escalones con asientos de colores
  const seatColors = ["#c94f4f", "#ececec", "#3f6f9e"];
  const stand = (side: number) => (
    <group position={[side * (PITCH_W / 2 + 0.7), 0, 0]}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[side * (i + 0.5), 0, 0]}>
          <Block
            args={[1.0, 0.45 * (i + 1), PITCH_L - 1]}
            castShadow
            receiveShadow
            position={[0, (0.45 * (i + 1)) / 2, 0]}
          >
            <meshStandardMaterial color="#9ba1a6" flatShading={flat} />
          </Block>
          <Block args={[0.9, 0.08, PITCH_L - 1.2]} position={[0, 0.45 * (i + 1) + 0.04, 0]}>
            <meshStandardMaterial color={seatColors[i]} flatShading={flat} />
          </Block>
        </group>
      ))}
    </group>
  );

  return (
    <group position={[PITCH_POS.x, 0, PITCH_POS.z]}>
      {/* Césped a franjas, un punto más recortado que el prado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[PITCH_W, PITCH_L]} />
        <meshStandardMaterial map={grassTex} roughness={1} />
      </mesh>
      {/* Líneas: perímetro, medio campo, círculo central y áreas */}
      {[-1, 1].map((s) => (
        <Block key={`v${s}`} args={[0.12, 0.02, PITCH_L]} position={[s * (PITCH_W / 2 - 0.06), 0.035, 0]}>
          <meshStandardMaterial color="#f5f5f5" />
        </Block>
      ))}
      {[-1, 0, 1].map((s) => (
        <Block key={`h${s}`} args={[PITCH_W, 0.02, 0.12]} position={[0, 0.035, s * (PITCH_L / 2 - 0.06)]}>
          <meshStandardMaterial color="#f5f5f5" />
        </Block>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[1.35, 1.5, 36]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[0.09, 12]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Áreas de portería */}
      {[-1, 1].map((end) => (
        <group key={`area${end}`}>
          <Block args={[4.4, 0.02, 0.12]} position={[0, 0.035, end * (PITCH_L / 2 - 2.2)]}>
            <meshStandardMaterial color="#f5f5f5" />
          </Block>
          {[-1, 1].map((s) => (
            <Block key={s} args={[0.12, 0.02, 2.2]} position={[s * 2.2, 0.035, end * (PITCH_L / 2 - 1.1)]}>
              <meshStandardMaterial color="#f5f5f5" />
            </Block>
          ))}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, end * (PITCH_L / 2 - 1.6)]}>
            <circleGeometry args={[0.09, 12]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
        </group>
      ))}
      {goal(-1)}
      {goal(1)}
      {stand(-1)}
      {stand(1)}
      {/* Banderines de córner */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <group key={`${sx}${sz}`} position={[sx * (PITCH_W / 2), 0, sz * (PITCH_L / 2)]}>
            <Block args={[0.05, 1.0, 0.05]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color="#e8e8e8" flatShading={flat} />
            </Block>
            <Block args={[0.28, 0.18, 0.02]} position={[0.14, 0.88, 0]}>
              <meshStandardMaterial color="#e23c3c" flatShading={flat} />
            </Block>
          </group>
        )),
      )}
      {/* Balón */}
      <mesh castShadow position={[1.0, 0.26, 2.0]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshStandardMaterial color="#f5f5f5" flatShading={flat} />
      </mesh>
    </group>
  );
}

/** Grúa torre de obra: mástil, pluma con gancho colgando y contrapeso.
 *  Cada grúa tiene su altura: así las plumas de dos grúas enfrentadas nunca
 *  se cruzan a la misma cota aunque oscilen. La oscilación es suave para que
 *  la pluma no barra la otra grúa ni la casa. */
function ConstructionCrane({ phase, height }: { phase: number; height: number }) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const top = useRef<THREE.Group>(null);
  const hook = useRef<THREE.Group>(null);
  const H = height;
  const braces = useMemo(
    () => Array.from({ length: Math.floor((H - 1) / 1.8) }, (_, i) => 1.8 * (i + 1)),
    [H],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    if (top.current) top.current.rotation.y = Math.sin(t * 0.15) * 0.22;
    if (hook.current) hook.current.position.x = 3.6 + Math.sin(t * 0.5) * 0.4;
  });

  return (
    <group>
      {/* Base de hormigón */}
      <Block args={[1.6, 0.5, 1.6]} radius={0.1} castShadow position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#6a6a6a" flatShading={flat} />
      </Block>
      {/* Mástil (torre) */}
      <Block args={[0.55, H, 0.55]} radius={0.08} castShadow position={[0, H / 2 + 0.3, 0]}>
        <meshStandardMaterial color="#f2c14e" flatShading={flat} />
      </Block>
      {/* Cruces de la torre para aspecto de celosía */}
      {braces.map((y) => (
        <Block key={y} args={[0.62, 0.12, 0.12]} radius={0.03} position={[0, y, 0]}>
          <meshStandardMaterial color="#d9a72f" flatShading={flat} />
        </Block>
      ))}

      {/* Conjunto giratorio: cabina + pluma + contrapluma + gancho */}
      <group ref={top} position={[0, H + 0.3, 0]}>
        {/* Cabina del operario */}
        <Block args={[0.85, 0.8, 0.85]} radius={0.12} castShadow position={[0.55, -0.2, 0]}>
          <meshStandardMaterial color="#e0a800" flatShading={flat} />
        </Block>
        {/* Pluma hacia +X (corta: no llega a la torre de la grúa de enfrente) */}
        <Block args={[6, 0.35, 0.35]} radius={0.05} castShadow position={[3.1, 0.35, 0]}>
          <meshStandardMaterial color="#f2c14e" flatShading={flat} />
        </Block>
        {/* Contrapluma hacia -X */}
        <Block args={[2.2, 0.35, 0.35]} radius={0.05} castShadow position={[-1.3, 0.35, 0]}>
          <meshStandardMaterial color="#f2c14e" flatShading={flat} />
        </Block>
        {/* Contrapeso */}
        <Block args={[1, 0.8, 1]} radius={0.08} castShadow position={[-2.3, 0.15, 0]}>
          <meshStandardMaterial color="#3d3d3d" flatShading={flat} />
        </Block>
        {/* Torreta superior */}
        <Block args={[0.4, 0.6, 0.4]} radius={0.06} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#d9a72f" flatShading={flat} />
        </Block>
        {/* Carro con cable y gancho colgando (siempre sobre el tejado) */}
        <group ref={hook} position={[3.6, 0.2, 0]}>
          <mesh position={[0, -1.6, 0]}>
            <boxGeometry args={[0.05, 3.2, 0.05]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          <Block args={[0.28, 0.4, 0.28]} radius={0.06} castShadow position={[0, -3.3, 0]}>
            <meshStandardMaterial color="#c0392b" flatShading={flat} />
          </Block>
        </group>
      </group>
    </group>
  );
}

/** Obrero con chaleco reflectante y casco. Si le pasas `say`, suelta un
 *  bocadillo con la frase al acercarte o al hacerle clic. */
function Worker({
  position,
  rotY = 0,
  say,
}: {
  position: [number, number, number];
  rotY?: number;
  say?: string;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const root = useRef<THREE.Group>(null);
  const hammerArm = useRef<THREE.Group>(null);
  const [talking, setTalking] = useState(false);
  const nearRef = useRef(false);
  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const phase = position[0] * 1.7 + position[2] * 0.9;

  useFrame(({ clock, camera }) => {
    // Martilleo: el brazo se levanta y golpea sin parar
    if (hammerArm.current) {
      const t = clock.elapsedTime * 5 + phase;
      hammerArm.current.rotation.x = -0.35 - Math.abs(Math.sin(t)) * 1.05;
    }
    if (!root.current || !say) return;
    root.current.getWorldPosition(worldPos);
    const d = Math.hypot(
      camera.position.x - worldPos.x,
      camera.position.z - worldPos.z,
    );
    const near = d < 3.2;
    if (near !== nearRef.current) {
      nearRef.current = near;
      setTalking(near);
    }
  });

  return (
    <group
      ref={root}
      position={position}
      rotation={[0, rotY, 0]}
      onClick={(e) => {
        if (!say) return;
        e.stopPropagation();
        setTalking(true);
      }}
      onPointerOver={() => say && (document.body.style.cursor = "pointer")}
      onPointerOut={() => say && (document.body.style.cursor = "default")}
    >
      {talking && say && (
        <Html
          center
          zIndexRange={[15, 0]}
          position={[0, 2, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="relative whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-lg">
            🚧 {say}
            <div className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-white" />
          </div>
        </Html>
      )}
      {/* Piernas */}
      <Block args={[0.2, 0.5, 0.2]} radius={0.06} castShadow position={[-0.12, 0.25, 0]}>
        <meshStandardMaterial color="#2c3448" flatShading={flat} />
      </Block>
      <Block args={[0.2, 0.5, 0.2]} radius={0.06} castShadow position={[0.12, 0.25, 0]}>
        <meshStandardMaterial color="#2c3448" flatShading={flat} />
      </Block>
      {/* Chaleco naranja con franjas reflectantes */}
      <Block args={[0.5, 0.6, 0.3]} radius={0.1} castShadow position={[0, 0.78, 0]}>
        <meshStandardMaterial color="#f26a1b" flatShading={flat} />
      </Block>
      <Block args={[0.52, 0.09, 0.32]} radius={0.02} position={[0, 0.88, 0]}>
        <meshStandardMaterial color="#eef3f5" flatShading={flat} />
      </Block>
      <Block args={[0.52, 0.09, 0.32]} radius={0.02} position={[0, 0.68, 0]}>
        <meshStandardMaterial color="#eef3f5" flatShading={flat} />
      </Block>
      {/* Brazo izquierdo (fijo) */}
      <Block args={[0.14, 0.52, 0.18]} radius={0.06} castShadow position={[-0.33, 0.76, 0]}>
        <meshStandardMaterial color="#f26a1b" flatShading={flat} />
      </Block>
      {/* Brazo derecho con martillo, pivota en el hombro y golpea */}
      <group ref={hammerArm} position={[0.33, 1.02, 0]}>
        <Block args={[0.14, 0.52, 0.18]} radius={0.06} castShadow position={[0, -0.26, 0]}>
          <meshStandardMaterial color="#f26a1b" flatShading={flat} />
        </Block>
        {/* Mano */}
        <Block args={[0.15, 0.14, 0.16]} radius={0.06} position={[0, -0.52, 0.02]}>
          <meshStandardMaterial color="#d8a171" flatShading={flat} />
        </Block>
        {/* Martillo (mango + cabeza) */}
        <group position={[0, -0.54, 0.1]}>
          <Block args={[0.05, 0.05, 0.34]} radius={0.02} position={[0, 0, 0.14]}>
            <meshStandardMaterial color="#8a5a34" flatShading={flat} />
          </Block>
          <mesh position={[0, 0, 0.34]}>
            <boxGeometry args={[0.14, 0.14, 0.16]} />
            <meshStandardMaterial color="#5b5b5b" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      </group>
      {/* Cabeza */}
      <Block args={[0.34, 0.36, 0.34]} radius={0.1} castShadow position={[0, 1.24, 0]}>
        <meshStandardMaterial color="#d8a171" flatShading={flat} />
      </Block>
      {/* Cara */}
      {[-0.08, 0.08].map((x) => (
        <group key={x} position={[x, 1.28, 0.17]}>
          <mesh>
            <boxGeometry args={[0.08, 0.08, 0.02]} />
            <meshStandardMaterial color="#f4f4f4" />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <boxGeometry args={[0.04, 0.05, 0.02]} />
            <meshStandardMaterial color="#2c2c34" />
          </mesh>
        </group>
      ))}
      {/* Cejas */}
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 1.35, 0.17]}>
          <boxGeometry args={[0.09, 0.025, 0.02]} />
          <meshStandardMaterial color="#4a3320" />
        </mesh>
      ))}
      {/* Nariz */}
      <Block args={[0.07, 0.08, 0.07]} radius={0.02} position={[0, 1.24, 0.19]}>
        <meshStandardMaterial color="#cf9a71" flatShading={flat} />
      </Block>
      {/* Boca */}
      <mesh position={[0, 1.15, 0.18]}>
        <boxGeometry args={[0.12, 0.025, 0.02]} />
        <meshStandardMaterial color="#7a3b32" />
      </mesh>
      {/* Casco de obra */}
      <Block args={[0.42, 0.18, 0.42]} radius={0.16} position={[0, 1.44, 0]}>
        <meshStandardMaterial color="#f2c14e" flatShading={flat} />
      </Block>
      <Block args={[0.52, 0.05, 0.52]} radius={0.03} position={[0, 1.36, 0]}>
        <meshStandardMaterial color="#e0a800" flatShading={flat} />
      </Block>
    </group>
  );
}

/** Valla de obra de barras rojas y blancas de la longitud indicada (a lo largo de X). */
function StripedRail({ length }: { length: number }) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const seg = 0.5;
  const n = Math.max(1, Math.round(length / seg));
  const start = -((n - 1) * seg) / 2;
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => (
        <Block key={i} args={[seg * 0.96, 0.18, 0.1]} radius={0.03} position={[start + i * seg, 0.6, 0]}>
          <meshStandardMaterial color={i % 2 ? "#d63d2e" : "#f3f3f3"} flatShading={flat} />
        </Block>
      ))}
      {[start - seg / 2, -start + seg / 2].map((x, i) => (
        <Block key={i} args={[0.1, 0.78, 0.1]} radius={0.03} castShadow position={[x, 0.39, 0]}>
          <meshStandardMaterial color="#7a7a7a" flatShading={flat} />
        </Block>
      ))}
    </group>
  );
}

/** Andamio tubular pegado a un muro (lado izquierdo o derecho de la casa). */
function Scaffold({ side, flat }: { side: number; flat: boolean }) {
  const pole = "#9a9a9a";
  const x = side * 3.15;
  return (
    <group>
      {[-2, 2].map((z) => (
        <Block key={z} args={[0.1, 4.6, 0.1]} radius={0.03} castShadow position={[x, 2.3, z]}>
          <meshStandardMaterial color={pole} flatShading={flat} />
        </Block>
      ))}
      {[-2, 2].map((z) => (
        <Block key={`o${z}`} args={[0.1, 4.6, 0.1]} radius={0.03} castShadow position={[x + side * 0.9, 2.3, z]}>
          <meshStandardMaterial color={pole} flatShading={flat} />
        </Block>
      ))}
      {[1.4, 2.8, 4.2].map((y) => (
        <Block key={y} args={[0.08, 0.08, 4]} radius={0.02} position={[x + side * 0.45, y, 0]}>
          <meshStandardMaterial color={pole} flatShading={flat} />
        </Block>
      ))}
      {/* Tablones de la plataforma */}
      {[-1.3, -0.4, 0.5, 1.4].map((z) => (
        <Block key={z} args={[1, 0.1, 0.8]} radius={0.02} castShadow position={[x + side * 0.45, 2.85, z]}>
          <meshStandardMaterial color="#c19a5b" flatShading={flat} />
        </Block>
      ))}
    </group>
  );
}

/** Obra alrededor de la casa de EchoGEO: vallas, andamios y materiales.
 *  El perímetro (HW/HD) queda fuera de los andamios (x ±4.05) y el hueco
 *  frontal (±1.6) es más ancho que el camino con bordillos (±1.42):
 *  nada se cruza con nada. */
function ConstructionSite({
  position,
  rotationY,
}: {
  position: [number, number, number];
  rotationY: number;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const HW = 4.6;
  const HD = 4.3;
  const GAP = 1.6; // semiancho del hueco frontal (el camino mide ±1.42)
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Vallas: trasera, laterales y frontales con hueco alineado al camino */}
      <group position={[0, 0, -HD]}>
        <StripedRail length={HW * 2} />
      </group>
      <group position={[-HW, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <StripedRail length={HD * 2} />
      </group>
      <group position={[HW, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <StripedRail length={HD * 2} />
      </group>
      <group position={[-(HW + GAP) / 2, 0, HD]}>
        <StripedRail length={HW - GAP} />
      </group>
      <group position={[(HW + GAP) / 2, 0, HD]}>
        <StripedRail length={HW - GAP} />
      </group>

      {/* Andamios en ambos laterales */}
      <Scaffold side={-1} flat={flat} />
      <Scaffold side={1} flat={flat} />

      {/* Montón de ladrillos (zona delantera izquierda, lejos del andamio) */}
      <group position={[-2.2, 0, 3.1]}>
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 3 }).map((_, c) => (
            <Block
              key={`${r}-${c}`}
              args={[0.5, 0.22, 0.28]}
              radius={0.03}
              castShadow
              position={[(c - 1) * 0.55, 0.12 + r * 0.24, (r % 2) * 0.08]}
            >
              <meshStandardMaterial color="#b1442f" flatShading={flat} />
            </Block>
          )),
        )}
      </group>
      {/* Pila de tablones (delantera derecha) */}
      <group position={[2.4, 0, 3.2]} rotation={[0, Math.PI / 2, 0]}>
        {[0, 1, 2].map((i) => (
          <Block key={i} args={[0.35, 0.12, 1.8]} radius={0.03} castShadow position={[(i - 1) * 0.4, 0.1, 0]}>
            <meshStandardMaterial color="#c19a5b" flatShading={flat} />
          </Block>
        ))}
      </group>
      {/* Montón de arena (trasera, entre casa y valla) */}
      <mesh castShadow position={[1.4, 0.4, -3.4]}>
        <coneGeometry args={[0.8, 0.8, flat ? 5 : 12]} />
        <meshStandardMaterial color="#d9c18a" flatShading={flat} />
      </mesh>
      {/* Carretilla sencilla (trasera izquierda) */}
      <group position={[-1.6, 0, -3.4]} rotation={[0, 0.6, 0]}>
        <Block args={[0.7, 0.3, 0.5]} radius={0.06} castShadow position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#d63d2e" flatShading={flat} />
        </Block>
        <mesh position={[0, 0.22, 0.35]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.12, 12]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
    </group>
  );
}

/** Mariposas revoloteando por el pueblo. */
function Butterflies() {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const data = useMemo(() => {
    const rand = mulberry32(77);
    const colors = ["#fef3c7", "#f9a8d4", "#bae6fd", "#fde68a"];
    return Array.from({ length: 9 }, (_, i) => ({
      cx: (rand() - 0.5) * 32,
      cz: (rand() - 0.5) * 32,
      r: 2 + rand() * 4,
      h: 1 + rand() * 1.6,
      speed: 0.3 + rand() * 0.4,
      phase: rand() * Math.PI * 2,
      color: colors[i % colors.length],
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    data.forEach((b, i) => {
      const g = refs.current[i];
      if (!g) return;
      const a = t * b.speed + b.phase;
      g.position.set(
        b.cx + Math.sin(a) * b.r,
        b.h + Math.sin(t * 2 + b.phase) * 0.35,
        b.cz + Math.cos(a) * b.r,
      );
      g.rotation.y = -a;
      const flap = Math.sin(t * 14 + b.phase) * 0.7;
      (g.children[0] as THREE.Mesh).rotation.z = flap;
      (g.children[1] as THREE.Mesh).rotation.z = -flap;
    });
  });

  return (
    <>
      {data.map((b, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <mesh position={[0.09, 0, 0]}>
            <boxGeometry args={[0.18, 0.02, 0.14]} />
            <meshStandardMaterial color={b.color} />
          </mesh>
          <mesh position={[-0.09, 0, 0]}>
            <boxGeometry args={[0.18, 0.02, 0.14]} />
            <meshStandardMaterial color={b.color} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** Montañas y colinas que cierran el horizonte, difuminadas por la niebla. */
function Mountains() {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const seg = flat ? 5 : 7;
  return (
    <>
      {HILL_SPOTS.map((h, i) => (
        <mesh key={`h${i}`} position={[h.x, h.h / 2 - 0.4, h.z]} rotation={[0, h.rot, 0]}>
          <coneGeometry args={[h.r, h.h, seg]} />
          <meshStandardMaterial color="#4c9350" flatShading={flat} />
        </mesh>
      ))}
      {MOUNTAIN_SPOTS.map((m, i) => (
        <group key={`m${i}`} position={[m.x, 0, m.z]} rotation={[0, m.rot, 0]}>
          <mesh position={[0, m.h / 2, 0]}>
            <coneGeometry args={[m.r, m.h, seg]} />
            <meshStandardMaterial
              color={m.rocky ? "#5c6d7a" : "#54725e"}
              flatShading={flat}
            />
          </mesh>
          {m.h > 38 && (
            <mesh position={[0, m.h - (m.h * 0.22) / 2, 0]}>
              <coneGeometry args={[m.r * 0.27, m.h * 0.22, seg]} />
              <meshStandardMaterial color="#f1f5f9" flatShading={flat} />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Casa y aldeano
// ---------------------------------------------------------------------------

/** Ventana con marco de madera y montantes en cruz. */
function Window({ x, flat }: { x: number; flat: boolean }) {
  const frame = "#5b3f26";
  return (
    <group position={[x, 1.95, 2.5]}>
      {/* Cristal */}
      <Block args={[1, 1, 0.06]} radius={0.04} position={[0, 0, 0.02]}>
        <meshStandardMaterial
          color="#bfe9ff"
          emissive="#bfe9ff"
          emissiveIntensity={0.25}
          metalness={0.1}
          roughness={0.3}
        />
      </Block>
      {/* Marco */}
      {[
        [0, 0.56, 1.16, 0.12],
        [0, -0.56, 1.16, 0.12],
        [-0.56, 0, 0.12, 1.24],
        [0.56, 0, 0.12, 1.24],
      ].map(([px, py, w, h], i) => (
        <Block key={i} args={[w, h, 0.14]} radius={0.03} position={[px, py, 0.05]}>
          <meshStandardMaterial color={frame} flatShading={flat} />
        </Block>
      ))}
      {/* Montantes en cruz */}
      <Block args={[1, 0.07, 0.1]} radius={0.02} position={[0, 0, 0.07]}>
        <meshStandardMaterial color={frame} flatShading={flat} />
      </Block>
      <Block args={[0.07, 1, 0.1]} radius={0.02} position={[0, 0, 0.07]}>
        <meshStandardMaterial color={frame} flatShading={flat} />
      </Block>
      {/* Jardinera con florecitas */}
      <Block args={[1.16, 0.2, 0.24]} radius={0.05} castShadow position={[0, -0.66, 0.14]}>
        <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
      </Block>
      {[-0.32, 0, 0.32].map((fx, i) => (
        <mesh key={i} position={[fx, -0.52, 0.22]}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color={["#e74c3c", "#f1c40f", "#ffffff"][i]} />
        </mesh>
      ))}
    </group>
  );
}

/** Casa con tejado del color del proyecto. La puerta mira a +Z local (al centro).
 *  Con `construction` se omiten las vallas del jardín (las sustituyen las de obra). */
function House({
  color,
  construction = false,
}: {
  color: string;
  construction?: boolean;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const beam = "#6b4a2b";
  return (
    <group>
      {/* Zócalo de piedra */}
      <Block args={[6.3, 0.5, 5.3]} radius={0.12} castShadow receiveShadow position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#8f8272" flatShading={flat} />
      </Block>
      {/* Muros */}
      <Block args={[6, 3.2, 5]} radius={0.25} castShadow receiveShadow position={[0, 2, 0]}>
        <meshStandardMaterial color="#d8b483" flatShading={flat} />
      </Block>
      {/* Vigas de entramado empotradas en las esquinas del muro */}
      {[
        [-2.92, 2.42],
        [2.92, 2.42],
        [-2.92, -2.42],
        [2.92, -2.42],
      ].map(([bx, bz], i) => (
        <Block key={i} args={[0.28, 3.4, 0.28]} radius={0.05} position={[bx, 2, bz]}>
          <meshStandardMaterial color={beam} flatShading={flat} />
        </Block>
      ))}
      {/* Cenefa bajo el alero */}
      <Block args={[6.2, 0.3, 5.2]} radius={0.08} position={[0, 3.65, 0]}>
        <meshStandardMaterial color={beam} flatShading={flat} />
      </Block>
      {/* Tejado piramidal con alero volado */}
      <mesh
        castShadow
        position={[0, 4.55, 0]}
        rotation={[0, flat ? Math.PI / 4 : 0, 0]}
        scale={[1.35, 1, 1.15]}
      >
        <coneGeometry args={[4.5, 2.5, flat ? 4 : 8]} />
        <meshStandardMaterial color={color} flatShading={flat} />
      </mesh>
      {/* Remate del tejado (asentado en el pico del cono, que llega a 5.8) */}
      <Block args={[0.3, 0.3, 0.3]} radius={0.08} position={[0, 5.82, 0]}>
        <meshStandardMaterial color="#f4f4f4" flatShading={flat} />
      </Block>
      {/* Puerta con marco, panel y pomo */}
      <Block args={[1.4, 2.5, 0.16]} radius={0.05} position={[0, 1.25, 2.48]}>
        <meshStandardMaterial color={beam} flatShading={flat} />
      </Block>
      <Block args={[1.1, 2.2, 0.14]} radius={0.05} position={[0, 1.15, 2.54]}>
        <meshStandardMaterial color="#8a5a34" flatShading={flat} />
      </Block>
      <Block args={[0.78, 0.9, 0.06]} radius={0.03} position={[0, 1.5, 2.6]}>
        <meshStandardMaterial color="#7a4f2c" flatShading={flat} />
      </Block>
      <mesh position={[0.36, 1.1, 2.62]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#e8c14a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Escalón de piedra */}
      <Block args={[1.7, 0.18, 0.6]} radius={0.05} castShadow position={[0, 0.09, 2.9]}>
        <meshStandardMaterial color="#9a8f7d" flatShading={flat} />
      </Block>
      {/* Farolito junto a la puerta */}
      <group position={[0.95, 2.2, 2.55]}>
        <Block args={[0.08, 0.5, 0.08]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial color="#3d3d3d" flatShading={flat} />
        </Block>
        <Block args={[0.2, 0.24, 0.2]} radius={0.05} position={[0, -0.3, 0]}>
          <meshStandardMaterial
            color="#ffd27a"
            emissive="#ffb84d"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </Block>
      </group>
      {/* Ventanas detalladas */}
      <Window x={-1.85} flat={flat} />
      <Window x={1.85} flat={flat} />
      {/* Chimenea con remate */}
      <Block args={[0.6, 1.9, 0.6]} radius={0.1} castShadow position={[1.7, 5.1, -1]}>
        <meshStandardMaterial color="#9a6b52" flatShading={flat} />
      </Block>
      <Block args={[0.78, 0.3, 0.78]} radius={0.05} position={[1.7, 6.05, -1]}>
        <meshStandardMaterial color="#7a4f3c" flatShading={flat} />
      </Block>
      {/* Vallas del jardincito delantero (no en la casa en obra) */}
      {!construction &&
        [-2.2, 2.2].map((x) => (
          <group key={x} position={[x, 0, 3.6]}>
            {[-0.9, 0, 0.9].map((z) => (
              <Block key={z} args={[0.14, 0.9, 0.14]} radius={0.05} castShadow position={[0, 0.45, z]}>
                <meshStandardMaterial color="#8a6a42" flatShading={flat} />
              </Block>
            ))}
            <Block args={[0.09, 0.09, 2.1]} radius={0.04} castShadow position={[0, 0.68, 0]}>
              <meshStandardMaterial color="#9a794f" flatShading={flat} />
            </Block>
          </group>
        ))}
    </group>
  );
}

/** Aldeano que presenta un proyecto: mira al jugador y saluda al acercarse. */
function Villager({
  project,
  color,
  persona,
  position,
  near,
  nearLabel,
  drag,
  onEnter,
}: {
  project: Project;
  color: string;
  persona: Persona;
  position: THREE.Vector3;
  near: boolean;
  nearLabel: string;
  drag: DragState;
  onEnter: (project: Project) => void;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const armLeft = useRef<THREE.Group>(null);
  const armRight = useRef<THREE.Group>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime + phase;
    if (group.current) {
      group.current.lookAt(camera.position.x, 0, camera.position.z);
    }
    if (body.current) {
      body.current.position.y = Math.sin(t * 2.2) * 0.03;
    }
    if (armLeft.current) armLeft.current.rotation.x = Math.sin(t * 2.2) * 0.18;
    if (armRight.current) {
      // Cuando el jugador está cerca, el aldeano saluda con el brazo
      armRight.current.rotation.x = near
        ? Math.PI - 0.4 + Math.sin(t * 6) * 0.25
        : -Math.sin(t * 2.2) * 0.18;
    }
  });

  const P = persona;
  const hairMat = () => <meshStandardMaterial color={P.hair} flatShading={flat} />;

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (drag.dist < 8) onEnter(project);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <group ref={body} scale={P.build}>
        {/* Zapatos */}
        <Block args={[0.26, 0.16, 0.32]} radius={0.06} castShadow position={[-0.15, 0.08, 0.03]}>
          <meshStandardMaterial color="#3a2c1c" flatShading={flat} />
        </Block>
        <Block args={[0.26, 0.16, 0.32]} radius={0.06} castShadow position={[0.15, 0.08, 0.03]}>
          <meshStandardMaterial color="#3a2c1c" flatShading={flat} />
        </Block>
        {/* Piernas (pantalón) */}
        <Block args={[0.24, 0.62, 0.24]} radius={0.08} castShadow position={[-0.15, 0.46, 0]}>
          <meshStandardMaterial color="#3a4a6b" flatShading={flat} />
        </Block>
        <Block args={[0.24, 0.62, 0.24]} radius={0.08} castShadow position={[0.15, 0.46, 0]}>
          <meshStandardMaterial color="#3a4a6b" flatShading={flat} />
        </Block>
        {/* Torso con la camiseta del color del proyecto */}
        <Block args={[0.6, 0.82, 0.34]} radius={0.12} castShadow position={[0, 1.14, 0]}>
          <meshStandardMaterial color={color} flatShading={flat} />
        </Block>
        {/* Tirantes para dar detalle al peto */}
        {[-0.16, 0.16].map((x) => (
          <Block key={x} args={[0.08, 0.66, 0.02]} radius={0.02} position={[x, 1.2, 0.18]}>
            <meshStandardMaterial color="#2c2c34" flatShading={flat} />
          </Block>
        ))}
        {/* Cinturón */}
        <Block args={[0.63, 0.12, 0.37]} radius={0.05} position={[0, 0.78, 0]}>
          <meshStandardMaterial color="#2c2c34" flatShading={flat} />
        </Block>
        {/* Brazos con pivote en el hombro y mano de piel */}
        <group ref={armLeft} position={[-0.42, 1.48, 0]}>
          <Block args={[0.2, 0.56, 0.24]} radius={0.08} castShadow position={[0, -0.26, 0]}>
            <meshStandardMaterial color={color} flatShading={flat} />
          </Block>
          <Block args={[0.21, 0.18, 0.25]} radius={0.08} position={[0, -0.56, 0]}>
            <meshStandardMaterial color={P.skin} flatShading={flat} />
          </Block>
        </group>
        <group ref={armRight} position={[0.42, 1.48, 0]}>
          <Block args={[0.2, 0.56, 0.24]} radius={0.08} castShadow position={[0, -0.26, 0]}>
            <meshStandardMaterial color={color} flatShading={flat} />
          </Block>
          <Block args={[0.21, 0.18, 0.25]} radius={0.08} position={[0, -0.56, 0]}>
            <meshStandardMaterial color={P.skin} flatShading={flat} />
          </Block>
        </group>
        {/* Cuello */}
        <Block args={[0.22, 0.12, 0.22]} radius={0.05} position={[0, 1.62, 0]}>
          <meshStandardMaterial color={P.skin} flatShading={flat} />
        </Block>
        {/* Cabeza */}
        <Block args={[0.5, 0.52, 0.5]} radius={0.14} castShadow position={[0, 1.94, 0]}>
          <meshStandardMaterial color={P.skin} flatShading={flat} />
        </Block>
        {/* Orejas */}
        {[-0.27, 0.27].map((x) => (
          <Block key={x} args={[0.06, 0.14, 0.12]} radius={0.03} position={[x, 1.94, 0]}>
            <meshStandardMaterial color={P.skin} flatShading={flat} />
          </Block>
        ))}
        {/* Nariz */}
        <Block args={[0.1, 0.11, 0.1]} radius={0.03} position={[0, 1.9, 0.27]}>
          <meshStandardMaterial color={P.skin} flatShading={flat} />
        </Block>
        {/* Cejas */}
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, 2.07, 0.26]}>
            <boxGeometry args={[0.13, 0.03, 0.03]} />
            {hairMat()}
          </mesh>
        ))}
        {/* Ojos: blanco + pupila */}
        {[-0.12, 0.12].map((x) => (
          <group key={x} position={[x, 1.97, 0.25]}>
            <Block args={[0.12, 0.12, 0.02]} radius={0.05}>
              <meshStandardMaterial color="#f4f4f4" />
            </Block>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.055, 0.07, 0.02]} />
              <meshStandardMaterial color="#2c2c34" />
            </mesh>
          </group>
        ))}
        {/* Boca */}
        <mesh position={[0, 1.81, 0.27]}>
          <boxGeometry args={[0.17, 0.035, 0.02]} />
          <meshStandardMaterial color="#7a3b32" />
        </mesh>

        {/* Pelo (si no lleva gorro) */}
        {P.hat === "none" && P.head !== "bald" && (
          <>
            <Block args={[0.54, 0.18, 0.54]} radius={0.1} position={[0, 2.2, 0]}>
              {hairMat()}
            </Block>
            <Block args={[0.54, 0.12, 0.14]} radius={0.04} position={[0, 2.08, 0.22]}>
              {hairMat()}
            </Block>
            {[-0.27, 0.27].map((x) => (
              <Block key={x} args={[0.05, 0.3, 0.42]} radius={0.02} position={[x, 2.03, -0.02]}>
                {hairMat()}
              </Block>
            ))}
            {P.head === "tuft" && (
              <Block args={[0.22, 0.26, 0.28]} radius={0.09} position={[0, 2.36, -0.02]}>
                {hairMat()}
              </Block>
            )}
            {P.head === "long" && (
              <Block args={[0.5, 0.46, 0.14]} radius={0.06} position={[0, 1.96, -0.27]}>
                {hairMat()}
              </Block>
            )}
          </>
        )}

        {/* Gorro / casco */}
        {P.hat === "beanie" && (
          <>
            <Block args={[0.56, 0.26, 0.56]} radius={0.16} position={[0, 2.25, 0]}>
              <meshStandardMaterial color={color} flatShading={flat} />
            </Block>
            <Block args={[0.58, 0.1, 0.58]} radius={0.05} position={[0, 2.09, 0]}>
              <meshStandardMaterial color="#eef1f4" flatShading={flat} />
            </Block>
            <Block args={[0.14, 0.14, 0.14]} radius={0.06} position={[0, 2.44, 0]}>
              <meshStandardMaterial color="#eef1f4" flatShading={flat} />
            </Block>
          </>
        )}
        {P.hat === "hardhat" && (
          <>
            <Block args={[0.58, 0.24, 0.58]} radius={0.2} position={[0, 2.25, 0]}>
              <meshStandardMaterial color="#f2c14e" flatShading={flat} />
            </Block>
            <Block args={[0.74, 0.06, 0.74]} radius={0.05} position={[0, 2.13, 0]}>
              <meshStandardMaterial color="#e0a800" flatShading={flat} />
            </Block>
            <Block args={[0.1, 0.22, 0.6]} radius={0.03} position={[0, 2.32, 0]}>
              <meshStandardMaterial color="#e0a800" flatShading={flat} />
            </Block>
          </>
        )}
        {P.hat === "cap" && (
          <>
            <Block args={[0.56, 0.2, 0.56]} radius={0.14} position={[0, 2.23, 0]}>
              <meshStandardMaterial color="#2b6cb0" flatShading={flat} />
            </Block>
            <Block args={[0.5, 0.06, 0.3]} radius={0.03} position={[0, 2.15, 0.34]}>
              <meshStandardMaterial color="#2b6cb0" flatShading={flat} />
            </Block>
          </>
        )}

        {/* Accesorio */}
        {P.accessory === "glasses" && (
          <group position={[0, 1.97, 0.28]}>
            {[-0.12, 0.12].map((x) => (
              <Block key={x} args={[0.16, 0.14, 0.03]} radius={0.03} position={[x, 0, 0]}>
                <meshStandardMaterial color="#20242c" flatShading={flat} />
              </Block>
            ))}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.03, 0.03]} />
              <meshStandardMaterial color="#20242c" />
            </mesh>
          </group>
        )}
        {P.accessory === "headphones" && (
          <>
            <Block args={[0.6, 0.1, 0.14]} radius={0.05} position={[0, 2.34, 0]}>
              <meshStandardMaterial color="#26262e" flatShading={flat} />
            </Block>
            {[-0.31, 0.31].map((x) => (
              <Block key={x} args={[0.12, 0.24, 0.26]} radius={0.07} position={[x, 1.96, 0]}>
                <meshStandardMaterial color={color} flatShading={flat} />
              </Block>
            ))}
          </>
        )}
        {P.accessory === "mustache" && (
          <mesh position={[0, 1.84, 0.28]}>
            <boxGeometry args={[0.24, 0.055, 0.05]} />
            {hairMat()}
          </mesh>
        )}
        {P.accessory === "beard" && (
          <>
            <Block args={[0.44, 0.26, 0.24]} radius={0.09} position={[0, 1.76, 0.14]}>
              {hairMat()}
            </Block>
            <Block args={[0.24, 0.09, 0.09]} radius={0.03} position={[0, 1.85, 0.28]}>
              {hairMat()}
            </Block>
          </>
        )}
      </group>

      {/* Cartel con el proyecto del que habla, encima de la cabeza.
          distanceFactor: escala con la perspectiva como el aldeano, así no se
          llena la pantalla de etiquetas del mismo tamaño. */}
      <Html
        center
        distanceFactor={9}
        zIndexRange={[15, 0]}
        position={[0, 2.75, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div className="whitespace-nowrap text-center">
          <p
            className="rounded-lg px-3 py-1 text-sm font-bold text-white"
            style={{ background: "rgba(15,18,30,0.75)", border: `2px solid ${color}` }}
          >
            {project.name}
          </p>
          <p
            className="mt-1 inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white"
            style={{ background: color }}
          >
            {project.status}
          </p>
        </div>
      </Html>

      {near && (
        <Html
          center
          distanceFactor={9}
          zIndexRange={[15, 0]}
          position={[0, 3.55, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="animate-pulse whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-white"
            style={{ background: color, boxShadow: `0 4px 18px rgba(0,0,0,0.35)` }}
          >
            {nearLabel}
          </div>
        </Html>
      )}
    </group>
  );
}

function Village({
  projects,
  dict,
  touch,
  paused,
  drag,
  onEnter,
  layout,
}: {
  projects: Project[];
  dict: Dictionary;
  touch: boolean;
  paused: boolean;
  drag: DragState;
  onEnter: (project: Project) => void;
  layout: VillageLayout;
}) {
  const [nearIndex, setNearIndex] = useState(-1);
  const nearRef = useRef(-1);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useFrame(({ camera }) => {
    let idx = -1;
    let best = NEAR_DISTANCE;
    layout.forEach(({ npcPos }, i) => {
      const d = Math.hypot(
        camera.position.x - npcPos.x,
        camera.position.z - npcPos.z,
      );
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    if (idx !== nearRef.current) {
      nearRef.current = idx;
      setNearIndex(idx);
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (pausedRef.current || nearRef.current < 0) return;
      if (e.code === "KeyE" || e.code === "Enter") {
        onEnter(projects[nearRef.current]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projects, onEnter]);

  return (
    <>
      {projects.map((project, i) => (
        <group key={project.slug}>
          <group
            position={layout[i].housePos}
            rotation={[0, layout[i].angle + Math.PI, 0]}
            onClick={(e) => {
              e.stopPropagation();
              if (drag.dist < 8) onEnter(project);
            }}
          >
            <House
              color={VILLAGE_COLORS[i % VILLAGE_COLORS.length]}
              construction={project.slug === CONSTRUCTION_SLUG}
            />
          </group>
          <Villager
            project={project}
            color={VILLAGE_COLORS[i % VILLAGE_COLORS.length]}
            persona={VILLAGER_PERSONAS[i % VILLAGER_PERSONAS.length]}
            position={layout[i].npcPos}
            near={i === nearIndex}
            nearLabel={touch ? dict.world.hintNearTouch : dict.world.hintNear}
            drag={drag}
            onEnter={onEnter}
          />
        </group>
      ))}
    </>
  );
}

/** Solo en desarrollo: expone la posición de la cámara y permite teletransportarla. */
function DebugProbe() {
  useFrame(({ camera }) => {
    const w = window as unknown as {
      __cam?: number[];
      __rot?: number[];
      __goto?: number[];
    };
    if (w.__goto) {
      camera.position.set(w.__goto[0], EYE_HEIGHT, w.__goto[1]);
      w.__goto = undefined;
    }
    w.__cam = [camera.position.x, camera.position.y, camera.position.z];
    w.__rot = [camera.rotation.x, camera.rotation.y];
  });
  return null;
}

export default function WorldCanvas({
  dict,
  touch,
  paused,
  casting,
  style,
  onEnter,
  onLibrary,
  externalMove,
}: {
  dict: Dictionary;
  touch: boolean;
  paused: boolean;
  casting: boolean;
  style: WorldStyle;
  onEnter: (project: Project) => void;
  onLibrary: () => void;
  externalMove: MoveInput;
}) {
  const drag = useRef<DragState>({ dist: 0 }).current;
  const layout = useMemo(
    () => buildLayout(dict.projects.items.length),
    [dict.projects.items.length],
  );
  const clear = useMemo(() => makeGroundClear(layout), [layout]);

  // Obra de EchoGEO (proyecto "en construcción"): grúas flanqueando la casa,
  // andamios, vallas, materiales y obreros. Se ancla a la casa por slug.
  const echo = useMemo(() => {
    const idx = dict.projects.items.findIndex(
      (p) => p.slug === CONSTRUCTION_SLUG,
    );
    if (idx < 0) return null;
    const l = layout[idx];
    const perp = new THREE.Vector3(Math.cos(l.angle), 0, -Math.sin(l.angle));
    const dir = new THREE.Vector3(Math.sin(l.angle), 0, Math.cos(l.angle));
    const cranes = [1, -1].map((side, i) => {
      const pos = l.housePos
        .clone()
        .addScaledVector(perp, side * 5.5)
        .addScaledVector(dir, 0.8);
      const toHouse = l.housePos.clone().sub(pos);
      return {
        x: pos.x,
        z: pos.z,
        rotY: Math.atan2(-toHouse.z, toHouse.x),
        phase: i * 2.3,
        height: i === 0 ? 10 : 13, // alturas distintas: las plumas nunca se cruzan
      };
    });
    // Obreros junto a la base de cada grúa, fuera de vallas (±4.6) y andamios
    const workers = cranes.flatMap((c) => {
      const offsets = [
        { lx: 0.25, lz: -1.2 },
        { lx: 0.35, lz: 1.2 },
      ];
      return offsets.map((o) => {
        const wx = c.x + o.lx * Math.cos(c.rotY) + o.lz * Math.sin(c.rotY);
        const wz = c.z - o.lx * Math.sin(c.rotY) + o.lz * Math.cos(c.rotY);
        return {
          x: wx,
          z: wz,
          rotY: Math.atan2(l.housePos.x - wx, l.housePos.z - wz),
        };
      });
    });
    return {
      house: { x: l.housePos.x, z: l.housePos.z, rotationY: l.angle + Math.PI },
      cranes,
      workers,
    };
  }, [dict.projects.items, layout]);
  const buildLabel = `${dict.world.building} EchoGEO`;
  // Grúas y obreros son sólidos: no se atraviesan
  const siteColliders = useMemo(
    () =>
      echo
        ? [
            ...echo.cranes.map((c) => ({ x: c.x, z: c.z, r: 1.0 })),
            ...echo.workers.map((w) => ({ x: w.x, z: w.z, r: 0.35 })),
          ]
        : [],
    [echo],
  );

  return (
    <Canvas
      shadows
      camera={{ fov: touch ? 74 : 65, near: 0.1, far: 300 }}
      dpr={[1, 1.75]}
      onCreated={({ gl }) => {
        // Permitir que el navegador restaure el contexto WebGL si se pierde
        gl.domElement.addEventListener("webglcontextlost", (e) =>
          e.preventDefault(),
        );
      }}
    >
      <StyleContext.Provider value={style}>
        <color attach="background" args={["#6cb8ec"]} />
        <fog attach="fog" args={["#9ed2f2", 50, 220]} />
        <hemisphereLight color="#cfe8ff" groundColor="#7da35b" intensity={0.85} />
        <directionalLight
          castShadow
          position={[35, 55, 20]}
          intensity={1.5}
          color="#fff2d9"
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-55}
          shadow-camera-right={55}
          shadow-camera-top={55}
          shadow-camera-bottom={-55}
          shadow-camera-far={160}
          shadow-bias={-0.0004}
        />
        <GrassFloor />
        <TallGrass clear={clear} />
        <Clouds />
        <Mountains />
        <PlazaHologram />
        <Flowers clear={clear} />
        <DecorTrees />
        <Rocks />
        <Plaza layout={layout} />
        <LampPosts />
        <Windmill />
        <RecommendedLibrary dict={dict} touch={touch} paused={paused} onLibrary={onLibrary} />
        <GeekDen dict={dict} />
        <FootballPitch />
        {echo && (
          <ConstructionSite
            position={[echo.house.x, 0, echo.house.z]}
            rotationY={echo.house.rotationY}
          />
        )}
        {echo?.cranes.map((c, i) => (
          <group key={i} position={[c.x, 0, c.z]} rotation={[0, c.rotY, 0]}>
            <ConstructionCrane phase={c.phase} height={c.height} />
          </group>
        ))}
        {echo?.workers.map((w, i) => (
          <Worker
            key={i}
            position={[w.x, 0, w.z]}
            rotY={w.rotY}
            say={buildLabel}
          />
        ))}
        <Butterflies />
        <Village
          projects={dict.projects.items}
          dict={dict}
          touch={touch}
          paused={paused}
          drag={drag}
          onEnter={onEnter}
          layout={layout}
        />
        <PlayerRig
          paused={paused}
          touch={touch}
          drag={drag}
          externalMove={externalMove}
          layout={layout}
          extraColliders={siteColliders}
        />
        <FirstPersonArms casting={casting} />
        {process.env.NODE_ENV !== "production" && <DebugProbe />}
      </StyleContext.Provider>
    </Canvas>
  );
}
