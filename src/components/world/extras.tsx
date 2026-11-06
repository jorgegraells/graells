"use client";

// Lo que da vida al pueblo más allá de las casas: anciano, buzón, tablón,
// balón y los objetos propios de cada proyecto.

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  Block,
  useInteractable,
  useWorldStyle,
  useWorldTheme,
} from "./kit";
import { BOARD_COLOR, ELDER_COLOR, MAIL_COLOR } from "./constants";

/** Puntos de la plaza, en los huecos entre caminos, bancos y farolas. */
export const ELDER_POS = { x: 2.6, z: -4.5 };
export const MAILBOX_POS = { x: -5.2, z: -3 };
export const BOARD_POS = { x: 5.4, z: 3.1 };

export const PLAZA_COLLIDERS = [
  { x: ELDER_POS.x, z: ELDER_POS.z, r: 0.5 },
  { x: MAILBOX_POS.x, z: MAILBOX_POS.z, r: 0.4 },
  { x: BOARD_POS.x, z: BOARD_POS.z, r: 0.9 },
];

/** Objetos con volumen junto a cada casa, en coordenadas de la casa. */
export const HOUSE_PROP_COLLIDERS: Record<string, { lx: number; lz: number; r: number }[]> = {
  workleveling: [
    { lx: -4.3, lz: 2.2, r: 0.8 },
    { lx: 4.4, lz: 2.2, r: 1.1 },
  ],
  flypet: [
    { lx: -4.3, lz: 2.2, r: 1.1 },
    { lx: 4.3, lz: 2.2, r: 1.0 },
  ],
  antidop: [
    { lx: -4.3, lz: 2.2, r: 0.9 },
    { lx: 4.3, lz: 2.2, r: 0.8 },
  ],
  yaiwell: [
    { lx: -4.3, lz: 2.2, r: 0.5 },
    { lx: 4.4, lz: 2.2, r: 1.1 },
  ],
};

/** Aviso flotante de "puedes hacer algo aquí", a tamaño fijo. */
function Prompt({ text, color, y }: { text: string; color: string; y: number }) {
  return (
    <Html center zIndexRange={[15, 0]} position={[0, y, 0]} style={{ pointerEvents: "none" }}>
      <div
        className="animate-pulse whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-white shadow-lg"
        style={{ background: color }}
      >
        {text}
      </div>
    </Html>
  );
}

function Tag({ text, color, y, near }: { text: string; color: string; y: number; near: boolean }) {
  // Al lado, a tamaño fijo: con la perspectiva taparía media pantalla
  return (
    <Html center distanceFactor={near ? undefined : 9} zIndexRange={[15, 0]} position={[0, y, 0]} style={{ pointerEvents: "none" }}>
      <p
        className="whitespace-nowrap rounded-lg px-3 py-1 text-sm font-bold text-white"
        style={{ background: "rgba(15,18,30,0.75)", border: `2px solid ${color}` }}
      >
        {text}
      </p>
    </Html>
  );
}

/** Anciano de la plaza: cuenta la trayectoria de Jorge. */
export function Elder({
  dict,
  touch,
  drag,
  onUse,
}: {
  dict: Dictionary;
  touch: boolean;
  drag: { dist: number };
  onUse: () => void;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const theme = useWorldTheme();
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const near = useInteractable({
    id: "elder",
    x: ELDER_POS.x,
    z: ELDER_POS.z,
    radius: 3,
    verb: dict.world.actions.talk,
    onUse,
  });

  useFrame(({ clock, camera }) => {
    group.current?.lookAt(camera.position.x, 0.16, camera.position.z);
    if (body.current) body.current.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.02;
  });

  const head = theme === "overworld" ? 1.25 : 1;
  return (
    <group
      ref={group}
      position={[ELDER_POS.x, 0.16, ELDER_POS.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (near && drag.dist < 8) onUse();
      }}
    >
      <group ref={body}>
        {/* Túnica larga */}
        <Block args={[0.72, 1.3, 0.46]} radius={0.14} castShadow position={[0, 0.65, 0]}>
          <meshStandardMaterial color="#5b3f8c" flatShading={flat} />
        </Block>
        <Block args={[0.76, 0.1, 0.5]} radius={0.04} position={[0, 0.82, 0]}>
          <meshStandardMaterial color={ELDER_COLOR} flatShading={flat} />
        </Block>
        {/* Brazos */}
        {[-1, 1].map((s) => (
          <Block key={s} args={[0.2, 0.7, 0.24]} radius={0.08} castShadow position={[s * 0.46, 0.95, 0]}>
            <meshStandardMaterial color="#4c3478" flatShading={flat} />
          </Block>
        ))}
        {/* Cabeza, barba y sombrero */}
        <group position={[0, 1.55, 0]} scale={head}>
          <Block args={[0.48, 0.46, 0.44]} radius={0.12} castShadow>
            <meshStandardMaterial color="#e8c4a0" flatShading={flat} />
          </Block>
          <Block args={[0.4, 0.4, 0.1]} radius={0.05} position={[0, -0.22, 0.2]}>
            <meshStandardMaterial color="#f2efe8" flatShading={flat} />
          </Block>
          {[-0.11, 0.11].map((x) => (
            <mesh key={x} position={[x, 0.06, 0.225]}>
              <boxGeometry args={[0.07, 0.07, 0.02]} />
              <meshStandardMaterial color="#26222e" />
            </mesh>
          ))}
          <Block args={[0.7, 0.07, 0.66]} radius={0.03} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#4c3478" flatShading={flat} />
          </Block>
          <mesh castShadow position={[0, 0.58, 0]}>
            <coneGeometry args={[0.28, 0.62, flat ? 4 : 14]} />
            <meshStandardMaterial color="#5b3f8c" flatShading={flat} />
          </mesh>
        </group>
        {/* Bastón */}
        <Block args={[0.07, 1.75, 0.07]} radius={0.03} castShadow position={[0.64, 0.87, 0.14]}>
          <meshStandardMaterial color="#7a5230" flatShading={flat} />
        </Block>
        <mesh position={[0.64, 1.8, 0.14]}>
          <sphereGeometry args={[0.1, 10, 8]} />
          <meshStandardMaterial color={ELDER_COLOR} emissive={ELDER_COLOR} emissiveIntensity={0.8} />
        </mesh>
      </group>
      <Tag text={dict.world.elder.name} color={ELDER_COLOR} y={2.65} near={near} />
      {near && (
        <Prompt
          text={touch ? dict.world.hintNearTouch : dict.world.hintNear}
          color={ELDER_COLOR}
          y={3.2}
        />
      )}
    </group>
  );
}

/** Buzón de la plaza: la banderita se levanta al acercarse. */
export function Mailbox({
  dict,
  touch,
  drag,
  onUse,
}: {
  dict: Dictionary;
  touch: boolean;
  drag: { dist: number };
  onUse: () => void;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const flag = useRef<THREE.Group>(null);
  const near = useInteractable({
    id: "mailbox",
    x: MAILBOX_POS.x,
    z: MAILBOX_POS.z,
    radius: 2.6,
    verb: dict.world.actions.open,
    onUse,
  });
  useFrame((_, delta) => {
    if (!flag.current) return;
    const target = near ? 0 : Math.PI / 2;
    flag.current.rotation.z = THREE.MathUtils.damp(flag.current.rotation.z, target, 8, delta);
  });
  return (
    <group
      position={[MAILBOX_POS.x, 0.16, MAILBOX_POS.z]}
      rotation={[0, Math.atan2(-MAILBOX_POS.x, -MAILBOX_POS.z), 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (near && drag.dist < 8) onUse();
      }}
    >
      <Block args={[0.14, 1.05, 0.14]} radius={0.04} castShadow position={[0, 0.52, 0]}>
        <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
      </Block>
      <Block args={[0.56, 0.44, 0.76]} radius={0.16} castShadow position={[0, 1.24, 0]}>
        <meshStandardMaterial color={MAIL_COLOR} flatShading={flat} />
      </Block>
      {/* Ranura de la carta */}
      <Block args={[0.34, 0.05, 0.03]} radius={0.01} position={[0, 1.3, 0.39]}>
        <meshStandardMaterial color="#2a1a18" flatShading={flat} />
      </Block>
      {/* Banderita */}
      <group ref={flag} position={[0.31, 1.15, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <Block args={[0.04, 0.42, 0.04]} radius={0.01} position={[0, 0.21, 0]}>
          <meshStandardMaterial color="#f2f2f2" flatShading={flat} />
        </Block>
        <Block args={[0.03, 0.16, 0.22]} radius={0.01} position={[0, 0.36, 0.11]}>
          <meshStandardMaterial color="#f5c542" flatShading={flat} />
        </Block>
      </group>
      <Tag text={dict.world.mailbox.name} color={MAIL_COLOR} y={2.1} near={near} />
      {near && (
        <Prompt
          text={touch ? dict.world.hintOpenTouch : dict.world.hintOpen}
          color={MAIL_COLOR}
          y={2.65}
        />
      )}
    </group>
  );
}

/** Tablón de la plaza: lo último que se ha publicado en la web. */
export function Noticeboard({
  dict,
  touch,
  drag,
  onUse,
}: {
  dict: Dictionary;
  touch: boolean;
  drag: { dist: number };
  onUse: () => void;
}) {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const near = useInteractable({
    id: "board",
    x: BOARD_POS.x,
    z: BOARD_POS.z,
    radius: 2.5,
    verb: dict.world.actions.read,
    onUse,
  });
  // Papeles clavados: deterministas, siempre en el mismo sitio
  const notes: { x: number; y: number; w: number; h: number; rot: number; c: string }[] = [
    { x: -0.72, y: 1.92, w: 0.5, h: 0.62, rot: 0.05, c: "#f4edd9" },
    { x: 0.02, y: 2.0, w: 0.56, h: 0.46, rot: -0.04, c: "#f8e49a" },
    { x: 0.72, y: 1.88, w: 0.46, h: 0.6, rot: 0.08, c: "#f4edd9" },
    { x: -0.34, y: 1.26, w: 0.62, h: 0.42, rot: -0.03, c: "#cfe6f5" },
    { x: 0.48, y: 1.24, w: 0.56, h: 0.46, rot: 0.04, c: "#f4edd9" },
  ];
  return (
    <group
      position={[BOARD_POS.x, 0.16, BOARD_POS.z]}
      rotation={[0, Math.atan2(-BOARD_POS.x, -BOARD_POS.z), 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (near && drag.dist < 8) onUse();
      }}
    >
      {[-1, 1].map((s) => (
        <Block key={s} args={[0.14, 2.7, 0.14]} radius={0.04} castShadow position={[s * 1.12, 1.35, 0]}>
          <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
        </Block>
      ))}
      <Block args={[2.2, 1.4, 0.1]} radius={0.04} castShadow position={[0, 1.6, 0]}>
        <meshStandardMaterial color={BOARD_COLOR} flatShading={flat} />
      </Block>
      {notes.map((n, i) => (
        <Block
          key={i}
          args={[n.w, n.h, 0.02]}
          radius={0.005}
          position={[n.x, n.y, 0.07]}
          rotation={[0, 0, n.rot]}
        >
          <meshStandardMaterial color={n.c} flatShading={flat} />
        </Block>
      ))}
      {/* Tejadillo */}
      <Block args={[2.6, 0.12, 0.6]} radius={0.04} castShadow position={[0, 2.75, 0.06]}>
        <meshStandardMaterial color="#5a3d22" flatShading={flat} />
      </Block>
      <Tag text={dict.world.board.name} color={BOARD_COLOR} y={3.3} near={near} />
      {near && (
        <Prompt
          text={touch ? dict.world.hintReadTouch : dict.world.hintRead}
          color={BOARD_COLOR}
          y={3.85}
        />
      )}
    </group>
  );
}

const BALL_R = 0.24;

/** Balón que se empuja andando contra él y marca goles en cualquiera de las porterías. */
export function SoccerBall({
  pitch,
  width,
  length,
  goalHalf,
  hint,
  paused,
  onGoal,
}: {
  pitch: { x: number; z: number };
  width: number;
  length: number;
  goalHalf: number;
  hint: string;
  paused: boolean;
  onGoal: () => void;
}) {
  const { camera } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const pos = useRef(new THREE.Vector2(0, 0));
  const vel = useRef(new THREE.Vector2(0, 0));
  const lastPlayer = useRef(new THREE.Vector2(camera.position.x, camera.position.z));
  const resetIn = useRef(0);
  const hintRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // Parches negros para que se note que rueda
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 64;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, 128, 64);
    ctx.fillStyle = "#23232b";
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.arc(10 + i * 21 + (j % 2) * 10, 11 + j * 21, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const px = camera.position.x - pitch.x;
    const pz = camera.position.z - pitch.z;
    const speedX = (px - lastPlayer.current.x) / Math.max(delta, 0.001);
    const speedZ = (pz - lastPlayer.current.y) / Math.max(delta, 0.001);
    lastPlayer.current.set(px, pz);
    if (pausedRef.current) return;

    const b = pos.current;
    const v = vel.current;

    if (resetIn.current > 0) {
      resetIn.current -= delta;
      if (resetIn.current <= 0) {
        b.set(0, 0);
        v.set(0, 0);
      }
    } else {
      // Empujón: el jugador choca con el balón andando
      const dx = b.x - px;
      const dz = b.y - pz;
      const d = Math.hypot(dx, dz);
      const reach = BALL_R + 0.6;
      if (d < reach && d > 1e-3) {
        const playerSpeed = Math.hypot(speedX, speedZ);
        const kick = Math.max(3.2, playerSpeed * 1.5);
        const towards = dx * speedX + dz * speedZ;
        if (towards > 0 || v.lengthSq() < 0.4) {
          v.set((dx / d) * kick, (dz / d) * kick);
        }
        b.set(px + (dx / d) * reach, pz + (dz / d) * reach);
        touched.current = true;
      }

      b.x += v.x * delta;
      b.y += v.y * delta;
      v.multiplyScalar(Math.exp(-delta * 0.85));
      if (v.lengthSq() < 0.002) v.set(0, 0);

      const maxX = width / 2 - BALL_R;
      const endZ = length / 2 - BALL_R;
      const inGoalMouth = Math.abs(b.x) < goalHalf - BALL_R;
      if (Math.abs(b.y) > endZ) {
        if (inGoalMouth) {
          // Dentro: gol en cuanto cruza la línea del todo, aunque entre muy despacio
          const pastLine = Math.abs(b.y) > length / 2 + BALL_R;
          if (pastLine || (Math.abs(b.y) > length / 2 && v.length() < 0.3)) {
            onGoal();
            resetIn.current = 1.3;
            v.set(0, 0);
          }
        } else {
          b.y = Math.sign(b.y) * endZ;
          v.y *= -0.6;
        }
      }
      if (Math.abs(b.y) > length / 2) {
        // Dentro de la portería: la red manda en los lados
        const inner = goalHalf - BALL_R;
        if (Math.abs(b.x) > inner) {
          b.x = Math.sign(b.x) * inner;
          v.x *= -0.4;
        }
      } else if (Math.abs(b.x) > maxX) {
        b.x = Math.sign(b.x) * maxX;
        v.x *= -0.6;
      }
    }

    if (mesh.current) {
      mesh.current.position.set(b.x, BALL_R + 0.02, b.y);
      const speed = v.length();
      if (speed > 0.01) {
        const axis = new THREE.Vector3(v.y / speed, 0, -v.x / speed);
        mesh.current.rotateOnWorldAxis(axis, (speed * delta) / BALL_R);
      }
    }
    if (hintRef.current) {
      const close = Math.hypot(b.x - px, b.y - pz) < 5;
      hintRef.current.style.opacity = close && !touched.current ? "1" : "0";
    }
  });

  return (
    <group position={[pitch.x, 0, pitch.z]}>
      <mesh ref={mesh} castShadow position={[0, BALL_R + 0.02, 0]}>
        <sphereGeometry args={[BALL_R, 16, 12]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <Html center zIndexRange={[15, 0]} position={[0, 1.1, 0]} style={{ pointerEvents: "none" }}>
        <div
          ref={hintRef}
          className="whitespace-nowrap rounded-full bg-[#0f121e]/80 px-3 py-1 font-mono text-[11px] font-semibold text-white transition-opacity"
          style={{ opacity: 0 }}
        >
          ⚽ {hint}
        </div>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Objetos propios de cada proyecto. Coordenadas de la casa: la puerta mira a +Z.
// ---------------------------------------------------------------------------

/** WorkLeveling: trofeo y barra de experiencia a medio llenar. */
function WorkLevelingProps() {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const star = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!star.current) return;
    star.current.rotation.y = clock.elapsedTime * 1.6;
    star.current.position.y = 2.25 + Math.sin(clock.elapsedTime * 2) * 0.08;
  });
  return (
    <>
      <group position={[-4.3, 0, 2.2]}>
        <Block args={[0.9, 0.5, 0.9]} radius={0.08} castShadow position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#4b4f58" flatShading={flat} />
        </Block>
        <Block args={[0.18, 0.45, 0.18]} radius={0.05} position={[0, 0.72, 0]}>
          <meshStandardMaterial color="#d9a521" metalness={0.5} roughness={0.35} flatShading={flat} />
        </Block>
        <Block args={[0.62, 0.55, 0.62]} radius={0.22} castShadow position={[0, 1.2, 0]}>
          <meshStandardMaterial color="#f0c23a" metalness={0.5} roughness={0.35} flatShading={flat} />
        </Block>
        {[-1, 1].map((s) => (
          <Block key={s} args={[0.12, 0.34, 0.12]} radius={0.05} position={[s * 0.42, 1.25, 0]}>
            <meshStandardMaterial color="#d9a521" metalness={0.5} roughness={0.35} flatShading={flat} />
          </Block>
        ))}
        <mesh ref={star} castShadow position={[0, 2.25, 0]}>
          <octahedronGeometry args={[0.2]} />
          <meshStandardMaterial color="#ffe27a" emissive="#ffc93c" emissiveIntensity={0.9} flatShading />
        </mesh>
      </group>
      {/* Barra de XP sobre dos postes */}
      <group position={[4.4, 0, 2.2]} rotation={[0, -0.35, 0]}>
        {[-1, 1].map((s) => (
          <Block key={s} args={[0.12, 1.5, 0.12]} radius={0.04} castShadow position={[s * 0.95, 0.75, 0]}>
            <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
          </Block>
        ))}
        <Block args={[2.1, 0.42, 0.1]} radius={0.04} castShadow position={[0, 1.32, 0]}>
          <meshStandardMaterial color="#22252e" flatShading={flat} />
        </Block>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Block key={i} args={[0.28, 0.24, 0.02]} radius={0.01} position={[-0.8 + i * 0.32, 1.32, 0.06]}>
            <meshStandardMaterial
              color={i < 4 ? "#6ee75a" : "#3a3e49"}
              emissive={i < 4 ? "#3fbf2f" : "#000000"}
              emissiveIntensity={i < 4 ? 0.8 : 0}
              flatShading={flat}
            />
          </Block>
        ))}
      </group>
    </>
  );
}

/** Flypet: la mosca sobre el tejado y fruta a su escala en el jardín. */
function FlypetProps() {
  const style = useWorldStyle();
  const theme = useWorldTheme();
  const flat = style === "blocky";
  const fly = useRef<THREE.Group>(null);
  const wings = useRef<THREE.Group[]>([]);
  // Las uvas forman un racimo fijo
  const grapes = useMemo(() => {
    const list: [number, number, number][] = [];
    [
      [0, 3],
      [1, 3],
      [2, 2],
      [3, 1],
    ].forEach(([row, count], r) => {
      for (let i = 0; i < count; i++) {
        const x = (i - (count - 1) / 2) * 0.36;
        list.push([x, 1.32 - row * 0.3, (r % 2) * 0.1]);
      }
    });
    return list;
  }, []);
  const roofTop = theme === "overworld" ? 6.9 : 6.3;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (fly.current) {
      fly.current.position.y = roofTop + 0.5 + Math.sin(t * 1.3) * 0.12;
      fly.current.rotation.y = Math.sin(t * 0.5) * 0.5;
    }
    wings.current.forEach((w, i) => {
      if (w) w.rotation.z = (i === 0 ? 1 : -1) * (0.35 + Math.sin(t * 34) * 0.28);
    });
  });

  return (
    <>
      <group ref={fly} position={[0, roofTop + 0.5, 0]} scale={1.15}>
        {/* Abdomen, tórax y cabeza con los ojos rojos */}
        <mesh castShadow position={[0, 0, -0.42]} scale={[0.82, 0.74, 1.15]}>
          <sphereGeometry args={[0.36, 12, 10]} />
          <meshStandardMaterial color="#7b5a33" flatShading={flat} />
        </mesh>
        <mesh castShadow position={[0, 0.03, 0.08]}>
          <sphereGeometry args={[0.3, 12, 10]} />
          <meshStandardMaterial color="#a67c45" flatShading={flat} />
        </mesh>
        <mesh castShadow position={[0, 0.04, 0.42]}>
          <sphereGeometry args={[0.22, 12, 10]} />
          <meshStandardMaterial color="#8d6a3c" flatShading={flat} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.15, 0.07, 0.48]}>
            <sphereGeometry args={[0.13, 10, 8]} />
            <meshStandardMaterial color="#b4231f" flatShading={flat} />
          </mesh>
        ))}
        {[0, 1].map((i) => (
          <group
            key={i}
            ref={(el) => {
              if (el) wings.current[i] = el;
            }}
            position={[i === 0 ? 0.14 : -0.14, 0.26, -0.05]}
          >
            <mesh position={[i === 0 ? 0.42 : -0.42, 0.02, -0.12]} rotation={[-Math.PI / 2, 0, i === 0 ? -0.5 : 0.5]}>
              <planeGeometry args={[0.8, 0.34]} />
              <meshStandardMaterial
                color="#dcebf5"
                transparent
                opacity={0.55}
                side={THREE.DoubleSide}
                userData={{ outlineParameters: { visible: false } }}
              />
            </mesh>
          </group>
        ))}
        {/* Patas */}
        {[-1, 1].flatMap((s) =>
          [-0.14, 0.08, 0.28].map((z) => (
            <mesh key={`${s}${z}`} position={[s * 0.3, -0.26, z]} rotation={[0, 0, s * 0.5]}>
              <boxGeometry args={[0.035, 0.42, 0.035]} />
              <meshStandardMaterial color="#3b2c1c" />
            </mesh>
          )),
        )}
      </group>
      {/* Racimo de uvas colgado de un soporte */}
      <group position={[-4.3, 0, 2.2]}>
        <Block args={[0.1, 1.9, 0.1]} radius={0.03} castShadow position={[0, 0.95, -0.28]}>
          <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
        </Block>
        <Block args={[0.1, 0.1, 0.42]} radius={0.03} position={[0, 1.85, -0.08]}>
          <meshStandardMaterial color="#6b4a2b" flatShading={flat} />
        </Block>
        {grapes.map(([x, y, z], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <sphereGeometry args={[0.2, 10, 8]} />
            <meshStandardMaterial color={i % 3 === 0 ? "#6b3fa0" : "#7b4db5"} flatShading={flat} />
          </mesh>
        ))}
        <Block args={[0.26, 0.05, 0.14]} radius={0.02} position={[0.16, 1.63, 0.06]} rotation={[0, 0, 0.5]}>
          <meshStandardMaterial color="#4f8f3a" flatShading={flat} />
        </Block>
      </group>
      {/* Manzana grande */}
      <group position={[4.3, 0, 2.2]}>
        <mesh castShadow position={[0, 0.62, 0]} scale={[1, 0.92, 1]}>
          <sphereGeometry args={[0.68, 14, 12]} />
          <meshStandardMaterial color="#c9362f" flatShading={flat} />
        </mesh>
        <Block args={[0.07, 0.3, 0.07]} radius={0.02} position={[0, 1.34, 0]}>
          <meshStandardMaterial color="#5a3d22" flatShading={flat} />
        </Block>
        <Block args={[0.28, 0.04, 0.16]} radius={0.015} position={[0.16, 1.36, 0]} rotation={[0, 0, 0.45]}>
          <meshStandardMaterial color="#4f8f3a" flatShading={flat} />
        </Block>
      </group>
    </>
  );
}

/** ANTIDOP: móvil gigante con la pantalla bloqueada y un reloj de arena. */
function AntidopProps() {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const lock = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (lock.current) lock.current.emissiveIntensity = 0.9 + Math.sin(clock.elapsedTime * 2.4) * 0.35;
  });
  return (
    <>
      <group position={[-4.3, 0, 2.2]} rotation={[-0.12, 0.3, 0]}>
        <Block args={[1.0, 0.16, 0.7]} radius={0.04} castShadow position={[0, 0.08, 0]}>
          <meshStandardMaterial color="#4b4f58" flatShading={flat} />
        </Block>
        <Block args={[1.0, 1.9, 0.12]} radius={0.1} castShadow position={[0, 1.1, 0]}>
          <meshStandardMaterial color="#17191f" flatShading={flat} />
        </Block>
        <Block args={[0.86, 1.72, 0.02]} radius={0.01} position={[0, 1.1, 0.07]}>
          <meshStandardMaterial color="#7f1d1d" emissive="#b4231f" emissiveIntensity={0.5} flatShading={flat} />
        </Block>
        {/* Candado en la pantalla */}
        {/* noToon: el material se anima, y un clon toon dejaría de responder */}
        <mesh position={[0, 1.02, 0.09]} userData={{ noToon: true }}>
          <boxGeometry args={[0.34, 0.28, 0.03]} />
          <meshStandardMaterial ref={lock} color="#f5ead6" emissive="#f5ead6" emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0, 1.22, 0.09]}>
          <torusGeometry args={[0.11, 0.03, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#f5ead6" emissive="#f5ead6" emissiveIntensity={0.6} />
        </mesh>
      </group>
      <group position={[4.3, 0, 2.2]}>
        {[0, 1.32].map((y) => (
          <Block key={y} args={[0.8, 0.1, 0.8]} radius={0.03} castShadow position={[0, 0.05 + y, 0]}>
            <meshStandardMaterial color="#7a5230" flatShading={flat} />
          </Block>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={s} castShadow position={[0, 0.72 + s * 0.3, 0]} rotation={[s > 0 ? Math.PI : 0, 0, 0]}>
            <coneGeometry args={[0.32, 0.6, flat ? 6 : 14]} />
            <meshStandardMaterial color="#cfe9f5" transparent opacity={0.65} flatShading={flat} />
          </mesh>
        ))}
        <mesh position={[0, 0.3, 0]}>
          <coneGeometry args={[0.24, 0.28, flat ? 6 : 12]} />
          <meshStandardMaterial color="#e0a82f" flatShading={flat} />
        </mesh>
      </group>
    </>
  );
}

/** Yaiwell: poste de barbería, y un rincón de sillón y mancuernas. */
function YaiwellProps() {
  const style = useWorldStyle();
  const flat = style === "blocky";
  const pole = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (pole.current) pole.current.rotation.y += delta * 1.2;
  });
  return (
    <>
      <group position={[-4.3, 0, 2.2]}>
        <Block args={[0.34, 0.14, 0.34]} radius={0.04} castShadow position={[0, 0.07, 0]}>
          <meshStandardMaterial color="#d7c3cf" flatShading={flat} />
        </Block>
        <group ref={pole} position={[0, 1.05, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.13, 1.8, flat ? 8 : 16]} />
            <meshStandardMaterial color="#faf4e6" flatShading={flat} />
          </mesh>
          {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
            <mesh key={y} position={[0, y, 0]} rotation={[0.35, i, 0]}>
              <torusGeometry args={[0.133, 0.03, 6, flat ? 8 : 16]} />
              <meshStandardMaterial color={i % 2 ? "#e9a8bf" : "#5a2548"} />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 2.02, 0]}>
          <sphereGeometry args={[0.16, 10, 8]} />
          <meshStandardMaterial color="#5a2548" flatShading={flat} />
        </mesh>
      </group>
      <group position={[4.4, 0, 2.2]} rotation={[0, -0.5, 0]}>
        {/* Sillón */}
        <Block args={[0.86, 0.46, 0.8]} radius={0.14} castShadow position={[-0.5, 0.26, 0]}>
          <meshStandardMaterial color="#5a2548" flatShading={flat} />
        </Block>
        <Block args={[0.86, 0.9, 0.2]} radius={0.1} castShadow position={[-0.5, 0.8, -0.32]}>
          <meshStandardMaterial color="#6d2f58" flatShading={flat} />
        </Block>
        {/* Mancuernas y toallas */}
        {[0.12, 0.72].map((x) => (
          <group key={x} position={[x + 0.1, 0.16, 0.2]}>
            <Block args={[0.1, 0.1, 0.42]} radius={0.03}>
              <meshStandardMaterial color="#3d3d46" flatShading={flat} />
            </Block>
            {[-1, 1].map((s) => (
              <Block key={s} args={[0.24, 0.24, 0.1]} radius={0.04} castShadow position={[0, 0, s * 0.22]}>
                <meshStandardMaterial color="#22252e" flatShading={flat} />
              </Block>
            ))}
          </group>
        ))}
        {["#e9a8bf", "#faf4e6", "#b9d6c8"].map((c, i) => (
          <Block key={c} args={[0.62, 0.12, 0.42]} radius={0.05} castShadow position={[0.46, 0.07 + i * 0.13, -0.38]}>
            <meshStandardMaterial color={c} flatShading={flat} />
          </Block>
        ))}
      </group>
    </>
  );
}

/** Decide qué lleva cada casa. EchoGEO ya tiene su obra. */
export function HouseProps({ slug }: { slug: string }) {
  if (slug === "workleveling") return <WorkLevelingProps />;
  if (slug === "flypet") return <FlypetProps />;
  if (slug === "antidop") return <AntidopProps />;
  if (slug === "yaiwell") return <YaiwellProps />;
  return null;
}
