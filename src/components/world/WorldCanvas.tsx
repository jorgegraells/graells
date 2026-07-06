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
  });
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
  });
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

const WELL_POS = { x: 5, z: -4 };
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
  { x: WELL_POS.x, z: WELL_POS.z, r: 1.3 },
  { x: WINDMILL_POS.x, z: WINDMILL_POS.z, r: 2.6 },
  ...TREE_SPOTS.map((t) => ({ x: t.x, z: t.z, r: 0.7 * t.scale })),
  ...LAMP_SPOTS.map((l) => ({ x: l.x, z: l.z, r: 0.3 })),
  ...BENCH_SPOTS.map((b) => ({ x: b.x, z: b.z, r: 0.9 })),
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
    if (r < 2.6) return false; // árbol central
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
}: {
  paused: boolean;
  touch: boolean;
  drag: DragState;
  externalMove: MoveInput;
  layout: VillageLayout;
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

  // Colliders del pueblo: cajas rotadas (casas) y círculos (árbol, aldeanos)
  const colliders = useMemo(
    () => ({
      boxes: layout.map((l) => ({
        x: l.housePos.x,
        z: l.housePos.z,
        rotY: l.angle + Math.PI,
        halfW: 3 + PLAYER_RADIUS,
        halfD: 2.5 + PLAYER_RADIUS,
      })),
      circles: [
        { x: 0, z: 0, r: 1 + PLAYER_RADIUS }, // tronco del árbol central
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
      ],
    }),
    [layout],
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
      if (lookPointerId !== null) return; // ya hay un dedo mirando
      lookPointerId = e.pointerId;
      drag.dist = 0;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== lookPointerId || pausedRef.current) return;
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

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
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
const IDLE_ARM_ROTATION_RIGHT = new THREE.Euler(-0.45, -0.2, 0.1);

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
      <group ref={armRight} position={[0.48, -0.52, -0.9]} rotation={[-0.45, -0.2, 0.1]}>
        <Arm sign={1} />
      </group>
      <group ref={armLeft} position={[-0.48, -0.52, -0.9]} rotation={[-0.45, 0.2, -0.1]}>
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

/** Hierba alta: matojos instanciados repartidos por el campo (fuera de plaza/caminos). */
function TallGrass({ clear }: { clear: (x: number, z: number) => boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const style = useWorldStyle();

  const blades = useMemo(() => {
    const rand = mulberry32(4242);
    const list: { x: number; z: number; s: number; rot: number; c: number }[] =
      [];
    let attempts = 0;
    while (list.length < 1800 && attempts < 14000) {
      attempts++;
      const angle = rand() * Math.PI * 2;
      const radius = 8 + rand() * 40;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      if (!clear(x, z)) continue;
      list.push({
        x,
        z,
        s: 0.7 + rand() * 1.1,
        rot: rand() * Math.PI,
        c: rand(),
      });
    }
    return list;
  }, [clear]);

  const geometry = useMemo(() => new THREE.ConeGeometry(0.07, 0.5, 4), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 1 }),
    [],
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    blades.forEach((b, i) => {
      dummy.position.set(b.x, 0.25 * b.s, b.z);
      dummy.rotation.set(0, b.rot, 0);
      dummy.scale.set(1, b.s, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.setRGB(0.28 + b.c * 0.14, 0.6 + b.c * 0.22, 0.26 + b.c * 0.12);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [blades, style]);

  return (
    <instancedMesh ref={ref} args={[geometry, material, blades.length]} />
  );
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

/** Árbol grande de la plaza central. */
function BlockTree() {
  const style = useWorldStyle();
  return (
    <group>
      <Block args={[1, 4, 1]} radius={0.35} castShadow position={[0, 2, 0]}>
        <meshStandardMaterial color="#6b4a2b" flatShading={style === "blocky"} />
      </Block>
      <Block args={[4.5, 2.2, 4.5]} radius={1} castShadow position={[0, 4.6, 0]}>
        <meshStandardMaterial color="#3f9e33" flatShading={style === "blocky"} />
      </Block>
      <Block args={[3, 1.6, 3]} radius={0.8} castShadow position={[0, 6.3, 0]}>
        <meshStandardMaterial color="#46ab3a" flatShading={style === "blocky"} />
      </Block>
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

      {/* Bancos mirando al árbol */}
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
function Well() {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const roofSeg = flat ? 4 : 10;
  return (
    <group position={[WELL_POS.x, 0, WELL_POS.z]}>
      {[0, 1, 2, 3].map((i) => (
        <Block
          key={i}
          args={[1.7, 0.6, 0.35]}
          radius={0.12}
          castShadow
          position={[i < 2 ? 0 : i === 2 ? 0.68 : -0.68, 0.3, i === 0 ? 0.68 : i === 1 ? -0.68 : 0]}
          rotation={[0, i < 2 ? 0 : Math.PI / 2, 0]}
        >
          <meshStandardMaterial color="#8f8f8f" flatShading={flat} />
        </Block>
      ))}
      <mesh position={[0, 0.45, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.55, 16]} />
        <meshStandardMaterial color="#3aa0d8" />
      </mesh>
      <Block args={[0.14, 1.7, 0.14]} radius={0.06} castShadow position={[-0.75, 1.15, 0]}>
        <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
      </Block>
      <Block args={[0.14, 1.7, 0.14]} radius={0.06} castShadow position={[0.75, 1.15, 0]}>
        <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
      </Block>
      <mesh castShadow position={[0, 2.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.4, 0.9, roofSeg]} />
        <meshStandardMaterial color="#a33f2f" flatShading={flat} />
      </mesh>
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

/** Casa con tejado del color del proyecto. La puerta mira a +Z local (al centro). */
function House({ color }: { color: string }) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  return (
    <group>
      <Block args={[6, 3.2, 5]} radius={0.3} castShadow receiveShadow position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#c9a36a" flatShading={flat} />
      </Block>
      {/* Tejado piramidal */}
      <mesh
        castShadow
        position={[0, 4.35, 0]}
        rotation={[0, flat ? Math.PI / 4 : 0, 0]}
        scale={[1.3, 1, 1.1]}
      >
        <coneGeometry args={[4.3, 2.3, flat ? 4 : 8]} />
        <meshStandardMaterial color={color} flatShading={flat} />
      </mesh>
      {/* Puerta */}
      <Block args={[1.1, 2.1, 0.1]} radius={0.06} position={[0, 1.05, 2.5]}>
        <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
      </Block>
      {/* Ventanas */}
      <Block args={[1, 1, 0.08]} radius={0.05} position={[-1.8, 1.9, 2.5]}>
        <meshStandardMaterial
          color="#bfe9ff"
          emissive="#bfe9ff"
          emissiveIntensity={0.2}
        />
      </Block>
      <Block args={[1, 1, 0.08]} radius={0.05} position={[1.8, 1.9, 2.5]}>
        <meshStandardMaterial
          color="#bfe9ff"
          emissive="#bfe9ff"
          emissiveIntensity={0.2}
        />
      </Block>
      {/* Chimenea */}
      <Block args={[0.6, 1.8, 0.6]} radius={0.1} castShadow position={[1.7, 5, -1]}>
        <meshStandardMaterial color="#8d8d8d" flatShading={flat} />
      </Block>
      {/* Vallas del jardincito delantero */}
      {[-2.2, 2.2].map((x) => (
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
  position,
  near,
  nearLabel,
  drag,
  onEnter,
}: {
  project: Project;
  color: string;
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

  const skin = (
    <meshStandardMaterial color={SKIN} flatShading={flat} />
  );

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
      <group ref={body}>
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
        {/* Cinturón */}
        <Block args={[0.63, 0.12, 0.37]} radius={0.05} position={[0, 0.78, 0]}>
          <meshStandardMaterial color="#2c2c34" flatShading={flat} />
        </Block>
        {/* Brazos con pivote en el hombro y mano más clara */}
        <group ref={armLeft} position={[-0.42, 1.48, 0]}>
          <Block args={[0.2, 0.56, 0.24]} radius={0.08} castShadow position={[0, -0.26, 0]}>
            <meshStandardMaterial color={color} flatShading={flat} />
          </Block>
          <Block args={[0.21, 0.18, 0.25]} radius={0.08} position={[0, -0.56, 0]}>
            {skin}
          </Block>
        </group>
        <group ref={armRight} position={[0.42, 1.48, 0]}>
          <Block args={[0.2, 0.56, 0.24]} radius={0.08} castShadow position={[0, -0.26, 0]}>
            <meshStandardMaterial color={color} flatShading={flat} />
          </Block>
          <Block args={[0.21, 0.18, 0.25]} radius={0.08} position={[0, -0.56, 0]}>
            <meshStandardMaterial color={SKIN} flatShading={flat} />
          </Block>
        </group>
        {/* Cuello */}
        <Block args={[0.22, 0.12, 0.22]} radius={0.05} position={[0, 1.62, 0]}>
          {skin}
        </Block>
        {/* Cabeza */}
        <Block args={[0.5, 0.52, 0.5]} radius={0.14} castShadow position={[0, 1.94, 0]}>
          <meshStandardMaterial color={SKIN} flatShading={flat} />
        </Block>
        {/* Nariz */}
        <Block args={[0.1, 0.1, 0.09]} radius={0.03} position={[0, 1.9, 0.27]}>
          <meshStandardMaterial color="#cf9a71" flatShading={flat} />
        </Block>
        {/* Pelo: casquete + flequillo */}
        <Block args={[0.54, 0.18, 0.54]} radius={0.1} position={[0, 2.2, 0]}>
          <meshStandardMaterial color="#4a3320" flatShading={flat} />
        </Block>
        <Block args={[0.54, 0.12, 0.12]} radius={0.04} position={[0, 2.08, 0.22]}>
          <meshStandardMaterial color="#4a3320" flatShading={flat} />
        </Block>
        {/* Ojos */}
        <mesh position={[-0.12, 1.96, 0.26]}>
          <boxGeometry args={[0.08, 0.09, 0.02]} />
          <meshStandardMaterial color="#2c2c34" />
        </mesh>
        <mesh position={[0.12, 1.96, 0.26]}>
          <boxGeometry args={[0.08, 0.09, 0.02]} />
          <meshStandardMaterial color="#2c2c34" />
        </mesh>
      </group>

      {/* Cartel con el proyecto del que habla, encima de la cabeza */}
      <Html
        center
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
            <House color={VILLAGE_COLORS[i % VILLAGE_COLORS.length]} />
          </group>
          <Villager
            project={project}
            color={VILLAGE_COLORS[i % VILLAGE_COLORS.length]}
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
  externalMove,
}: {
  dict: Dictionary;
  touch: boolean;
  paused: boolean;
  casting: boolean;
  style: WorldStyle;
  onEnter: (project: Project) => void;
  externalMove: MoveInput;
}) {
  const drag = useRef<DragState>({ dist: 0 }).current;
  const layout = useMemo(
    () => buildLayout(dict.projects.items.length),
    [dict.projects.items.length],
  );
  const clear = useMemo(() => makeGroundClear(layout), [layout]);

  return (
    <Canvas
      shadows
      camera={{ fov: 65, near: 0.1, far: 300 }}
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
        <BlockTree />
        <Flowers clear={clear} />
        <DecorTrees />
        <Rocks />
        <Plaza layout={layout} />
        <LampPosts />
        <Well />
        <Windmill />
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
        />
        <FirstPersonArms casting={casting} />
        {process.env.NODE_ENV !== "production" && <DebugProbe />}
      </StyleContext.Provider>
    </Canvas>
  );
}
