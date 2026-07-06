"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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
const UP = new THREE.Vector3(0, 1, 0);

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
const SKIN = "#d8a171";

/** Color de tejado y camiseta del aldeano de cada proyecto. */
export const VILLAGE_COLORS = [
  "#0ea5b7",
  "#7c5cd6",
  "#d6558e",
  "#e0912f",
  "#2f9e57",
  "#c94f4f",
];

export type MoveInput = { x: number; y: number; jump: boolean };

/** Estado mutable compartido para distinguir arrastre (mirar) de clic (hablar). */
type DragState = { dist: number };

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

/** Brazos cúbicos en primera persona, estilo Minecraft, con balanceo al andar.
 *  Con `casting`, el brazo derecho se extiende hacia delante para "invocar"
 *  la ventana de habilidades. */
const CAST_ARM_POSITION = new THREE.Vector3(0.16, -0.34, -0.62);
const CAST_ARM_ROTATION = new THREE.Euler(-1.25, 0, 0);
const IDLE_ARM_ROTATION_RIGHT = new THREE.Euler(-0.45, -0.2, 0.1);

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
        <mesh frustumCulled={false}>
          <boxGeometry args={[0.13, 0.13, 0.38]} />
          <meshStandardMaterial color={SKIN} emissive={SKIN} emissiveIntensity={0.18} />
        </mesh>
        <mesh frustumCulled={false} position={[0, 0, 0.17]}>
          <boxGeometry args={[0.15, 0.15, 0.12]} />
          <meshStandardMaterial color="#3aa79a" emissive="#3aa79a" emissiveIntensity={0.18} />
        </mesh>
      </group>
      <group ref={armLeft} position={[-0.48, -0.52, -0.9]} rotation={[-0.45, 0.2, -0.1]}>
        <mesh frustumCulled={false}>
          <boxGeometry args={[0.13, 0.13, 0.38]} />
          <meshStandardMaterial color={SKIN} emissive={SKIN} emissiveIntensity={0.18} />
        </mesh>
        <mesh frustumCulled={false} position={[0, 0, 0.17]}>
          <boxGeometry args={[0.15, 0.15, 0.12]} />
          <meshStandardMaterial color="#3aa79a" emissive="#3aa79a" emissiveIntensity={0.18} />
        </mesh>
      </group>
    </group>
  );
}

/** Césped pixelado generado proceduralmente, con filtro nearest para el look Minecraft. */
function GrassFloor() {
  const texture = useMemo(() => {
    const size = 64;
    const cell = 4;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const greens = ["#6fbf44", "#5fae3c", "#7bc94f", "#67b841", "#58a839", "#74c24a"];
    for (let y = 0; y < size; y += cell) {
      for (let x = 0; x < size; x += cell) {
        ctx.fillStyle = greens[Math.floor(Math.random() * greens.length)];
        ctx.fillRect(x, y, cell, cell);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(80, 80);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    // Lo bastante grande para que las faldas de las montañas no lo desborden
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[320, 320]} />
      <meshStandardMaterial map={texture} roughness={1} />
    </mesh>
  );
}

/** Nubes planas estilo Minecraft que derivan lentamente. */
function Clouds() {
  const group = useRef<THREE.Group>(null);
  const clouds = useMemo(
    () =>
      Array.from({ length: 9 }, () => ({
        x: (Math.random() - 0.5) * 180,
        y: 26 + Math.random() * 8,
        z: (Math.random() - 0.5) * 180,
        w: 7 + Math.random() * 9,
        d: 4 + Math.random() * 6,
        speed: 0.4 + Math.random() * 0.6,
      })),
    [],
  );

  useFrame((_, delta) => {
    group.current?.children.forEach((cloud, i) => {
      cloud.position.x += clouds[i].speed * delta;
      if (cloud.position.x > 100) cloud.position.x = -100;
    });
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]}>
          <boxGeometry args={[c.w, 0.9, c.d]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.55}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Árbol cúbico en la plaza central. */
function BlockTree() {
  return (
    <group>
      <mesh castShadow position={[0, 2, 0]}>
        <boxGeometry args={[1, 4, 1]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      <mesh castShadow position={[0, 4.6, 0]}>
        <boxGeometry args={[4.5, 2.2, 4.5]} />
        <meshStandardMaterial color="#3f9e33" />
      </mesh>
      <mesh castShadow position={[0, 6.3, 0]}>
        <boxGeometry args={[3, 1.6, 3]} />
        <meshStandardMaterial color="#46ab3a" />
      </mesh>
    </group>
  );
}

/** Flores cúbicas repartidas por el pueblo. */
function Flowers() {
  const flowers = useMemo(() => {
    const colors = ["#e74c3c", "#f1c40f", "#ffffff", "#e67e22"];
    return Array.from({ length: 70 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 36;
      return {
        x: Math.sin(angle) * radius,
        z: Math.cos(angle) * radius,
        color: colors[i % colors.length],
        scale: 0.8 + Math.random() * 0.6,
      };
    });
  }, []);

  return (
    <>
      {flowers.map((f, i) => (
        <group key={i} position={[f.x, 0, f.z]} scale={f.scale}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.06, 0.3, 0.06]} />
            <meshStandardMaterial color="#3e8e2f" />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.16]} />
            <meshStandardMaterial color={f.color} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** Bosque de árboles cúbicos con variantes de color y tamaño. */
function DecorTrees() {
  const leafColors = ["#3f9e33", "#57b23f", "#2f8f4a"];
  const trunkColors = ["#6b4a2b", "#7d5a35", "#d9cbb2"];
  return (
    <>
      {TREE_SPOTS.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.scale}>
          <mesh castShadow position={[0, 1.6, 0]}>
            <boxGeometry args={[0.8, 3.2, 0.8]} />
            <meshStandardMaterial color={trunkColors[t.variant]} />
          </mesh>
          <mesh castShadow position={[0, 3.7, 0]}>
            <boxGeometry args={[3.4, 1.8, 3.4]} />
            <meshStandardMaterial color={leafColors[t.variant]} />
          </mesh>
          <mesh castShadow position={[0, 5, 0]}>
            <boxGeometry args={[2.2, 1.2, 2.2]} />
            <meshStandardMaterial color={leafColors[(t.variant + 1) % 3]} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** Rocas grises medio enterradas. */
function Rocks() {
  return (
    <>
      {ROCK_SPOTS.map((r, i) => (
        <mesh
          key={i}
          castShadow
          position={[r.x, r.s * 0.35, r.z]}
          rotation={[0, r.rot, 0]}
          scale={[r.s * 1.4, r.s, r.s]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8f8f8f" flatShading />
        </mesh>
      ))}
    </>
  );
}

/** Plaza de piedra central, caminos a cada casa y bancos. */
function Plaza({ layout }: { layout: VillageLayout }) {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.004, 0]}>
        <circleGeometry args={[7, 32]} />
        <meshStandardMaterial color="#b3ac9f" />
      </mesh>
      {/* Caminos radiales hasta cada casa */}
      {layout.map((l, i) => (
        <group key={i} rotation={[0, l.angle, 0]}>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.006, 12.5]}>
            <planeGeometry args={[1.7, 13]} />
            <meshStandardMaterial color="#a8a094" />
          </mesh>
        </group>
      ))}
      {/* Bancos mirando al árbol */}
      {BENCH_SPOTS.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]} rotation={[0, b.rotY, 0]}>
          <mesh castShadow position={[0, 0.45, 0]}>
            <boxGeometry args={[1.6, 0.12, 0.5]} />
            <meshStandardMaterial color="#9a794f" />
          </mesh>
          <mesh castShadow position={[0, 0.72, -0.22]}>
            <boxGeometry args={[1.6, 0.5, 0.1]} />
            <meshStandardMaterial color="#9a794f" />
          </mesh>
          <mesh position={[-0.65, 0.22, 0]}>
            <boxGeometry args={[0.12, 0.45, 0.45]} />
            <meshStandardMaterial color="#6b4a2b" />
          </mesh>
          <mesh position={[0.65, 0.22, 0]}>
            <boxGeometry args={[0.12, 0.45, 0.45]} />
            <meshStandardMaterial color="#6b4a2b" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Farolillos de la plaza con linterna cálida. */
function LampPosts() {
  return (
    <>
      {LAMP_SPOTS.map((l, i) => (
        <group key={i} position={[l.x, 0, l.z]}>
          <mesh castShadow position={[0, 1.3, 0]}>
            <boxGeometry args={[0.14, 2.6, 0.14]} />
            <meshStandardMaterial color="#3d3d3d" />
          </mesh>
          <mesh position={[0, 2.75, 0]}>
            <boxGeometry args={[0.38, 0.42, 0.38]} />
            <meshStandardMaterial
              color="#ffd27a"
              emissive="#ffb84d"
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>
          <mesh castShadow position={[0, 3.02, 0]}>
            <boxGeometry args={[0.48, 0.12, 0.48]} />
            <meshStandardMaterial color="#3d3d3d" />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** Pozo de piedra junto a la plaza. */
function Well() {
  return (
    <group position={[WELL_POS.x, 0, WELL_POS.z]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          castShadow
          position={[i < 2 ? 0 : i === 2 ? 0.68 : -0.68, 0.3, i === 0 ? 0.68 : i === 1 ? -0.68 : 0]}
          rotation={[0, i < 2 ? 0 : Math.PI / 2, 0]}
        >
          <boxGeometry args={[1.7, 0.6, 0.35]} />
          <meshStandardMaterial color="#8f8f8f" />
        </mesh>
      ))}
      <mesh position={[0, 0.45, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.55, 16]} />
        <meshStandardMaterial color="#3aa0d8" />
      </mesh>
      <mesh castShadow position={[-0.75, 1.15, 0]}>
        <boxGeometry args={[0.14, 1.7, 0.14]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      <mesh castShadow position={[0.75, 1.15, 0]}>
        <boxGeometry args={[0.14, 1.7, 0.14]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      <mesh castShadow position={[0, 2.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.4, 0.9, 4]} />
        <meshStandardMaterial color="#a33f2f" flatShading />
      </mesh>
    </group>
  );
}

/** Molino de viento con aspas girando, en las afueras. */
function Windmill() {
  const blades = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (blades.current) blades.current.rotation.z += delta * 0.7;
  });
  return (
    <group position={[WINDMILL_POS.x, 0, WINDMILL_POS.z]} rotation={[0, Math.PI / 3, 0]}>
      <mesh castShadow position={[0, 3, 0]}>
        <boxGeometry args={[3.2, 6, 3.2]} />
        <meshStandardMaterial color="#cbb489" />
      </mesh>
      <mesh castShadow position={[0, 6.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.7, 1.9, 4]} />
        <meshStandardMaterial color="#8a4a3a" flatShading />
      </mesh>
      <group ref={blades} position={[0, 5.6, 1.9]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#6b4a2b" />
        </mesh>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) => (
          <group key={a} rotation={[0, 0, a]}>
            <mesh castShadow position={[0, 2, 0]}>
              <boxGeometry args={[0.4, 3.6, 0.1]} />
              <meshStandardMaterial color="#ece1c8" />
            </mesh>
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
  return (
    <>
      {HILL_SPOTS.map((h, i) => (
        <mesh key={`h${i}`} position={[h.x, h.h / 2 - 0.4, h.z]} rotation={[0, h.rot, 0]}>
          <coneGeometry args={[h.r, h.h, 5]} />
          <meshStandardMaterial color="#4c9350" flatShading />
        </mesh>
      ))}
      {MOUNTAIN_SPOTS.map((m, i) => (
        <group key={`m${i}`} position={[m.x, 0, m.z]} rotation={[0, m.rot, 0]}>
          <mesh position={[0, m.h / 2, 0]}>
            <coneGeometry args={[m.r, m.h, 5]} />
            <meshStandardMaterial
              color={m.rocky ? "#5c6d7a" : "#54725e"}
              flatShading
            />
          </mesh>
          {m.h > 38 && (
            <mesh position={[0, m.h - (m.h * 0.22) / 2, 0]}>
              <coneGeometry args={[m.r * 0.27, m.h * 0.22, 5]} />
              <meshStandardMaterial color="#f1f5f9" flatShading />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

/** Casa cúbica con tejado del color del proyecto. La puerta mira a +Z local. */
function House({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 1.6, 0]}>
        <boxGeometry args={[6, 3.2, 5]} />
        <meshStandardMaterial color="#c9a36a" />
      </mesh>
      {/* Tejado piramidal */}
      <mesh
        castShadow
        position={[0, 4.35, 0]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[1.3, 1, 1.1]}
      >
        <coneGeometry args={[4.3, 2.3, 4]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Puerta */}
      <mesh position={[0, 1.05, 2.51]}>
        <boxGeometry args={[1.1, 2.1, 0.08]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      {/* Ventanas */}
      <mesh position={[-1.8, 1.9, 2.51]}>
        <boxGeometry args={[1, 1, 0.06]} />
        <meshStandardMaterial color="#bfe9ff" />
      </mesh>
      <mesh position={[1.8, 1.9, 2.51]}>
        <boxGeometry args={[1, 1, 0.06]} />
        <meshStandardMaterial color="#bfe9ff" />
      </mesh>
      {/* Chimenea */}
      <mesh castShadow position={[1.7, 5, -1]}>
        <boxGeometry args={[0.6, 1.8, 0.6]} />
        <meshStandardMaterial color="#8d8d8d" />
      </mesh>
      {/* Camino de tierra hasta la puerta */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 3.9]}>
        <planeGeometry args={[1.6, 3]} />
        <meshStandardMaterial color="#9b7653" />
      </mesh>
      {/* Vallas del jardincito delantero */}
      {[-2.2, 2.2].map((x) => (
        <group key={x} position={[x, 0, 3.6]}>
          {[-0.9, 0, 0.9].map((z) => (
            <mesh key={z} castShadow position={[0, 0.45, z]}>
              <boxGeometry args={[0.14, 0.9, 0.14]} />
              <meshStandardMaterial color="#8a6a42" />
            </mesh>
          ))}
          <mesh castShadow position={[0, 0.68, 0]}>
            <boxGeometry args={[0.09, 0.09, 2.1]} />
            <meshStandardMaterial color="#9a794f" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Aldeano cúbico que presenta un proyecto: mira al jugador y saluda. */
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
        {/* Piernas */}
        <mesh castShadow position={[-0.14, 0.35, 0]}>
          <boxGeometry args={[0.24, 0.7, 0.24]} />
          <meshStandardMaterial color="#3b4a8c" />
        </mesh>
        <mesh castShadow position={[0.14, 0.35, 0]}>
          <boxGeometry args={[0.24, 0.7, 0.24]} />
          <meshStandardMaterial color="#3b4a8c" />
        </mesh>
        {/* Cuerpo con la camiseta del color del proyecto */}
        <mesh castShadow position={[0, 1.06, 0]}>
          <boxGeometry args={[0.54, 0.74, 0.3]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Brazos con pivote en el hombro */}
        <group ref={armLeft} position={[-0.38, 1.38, 0]}>
          <mesh castShadow position={[0, -0.3, 0]}>
            <boxGeometry args={[0.2, 0.66, 0.24]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
        </group>
        <group ref={armRight} position={[0.38, 1.38, 0]}>
          <mesh castShadow position={[0, -0.3, 0]}>
            <boxGeometry args={[0.2, 0.66, 0.24]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
        </group>
        {/* Cabeza */}
        <mesh castShadow position={[0, 1.7, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
        {/* Pelo */}
        <mesh position={[0, 1.97, -0.02]}>
          <boxGeometry args={[0.54, 0.16, 0.54]} />
          <meshStandardMaterial color="#4a3320" />
        </mesh>
        {/* Ojos */}
        <mesh position={[-0.11, 1.72, 0.26]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#2c2c34" />
        </mesh>
        <mesh position={[0.11, 1.72, 0.26]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#2c2c34" />
        </mesh>
      </group>

      {/* Cartel con el proyecto del que habla, encima de la cabeza */}
      <Html
        center
        zIndexRange={[15, 0]}
        position={[0, 2.6, 0]}
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
          position={[0, 3.4, 0]}
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
  onEnter,
  externalMove,
}: {
  dict: Dictionary;
  touch: boolean;
  paused: boolean;
  casting: boolean;
  onEnter: (project: Project) => void;
  externalMove: MoveInput;
}) {
  const drag = useRef<DragState>({ dist: 0 }).current;
  const layout = useMemo(
    () => buildLayout(dict.projects.items.length),
    [dict.projects.items.length],
  );

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
      <Clouds />
      <Mountains />
      <BlockTree />
      <Flowers />
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
    </Canvas>
  );
}
