"use client";

import { useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Caja voxel con sombreado plano (look de bloques). */
function Box({
  args,
  color,
  position,
  rotation,
  castShadow,
  receiveShadow,
  children,
}: {
  args: [number, number, number];
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  children?: ReactNode;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <boxGeometry args={args} />
      {children ?? <meshStandardMaterial color={color} flatShading />}
    </mesh>
  );
}

/** Casita voxel con tejado del color indicado. */
function MiniHouse({
  position,
  roof,
}: {
  position: [number, number, number];
  roof: string;
}) {
  return (
    <group position={position}>
      <Box args={[1.7, 1.3, 1.5]} color="#d8b483" position={[0, 0.65, 0]} castShadow />
      <mesh castShadow position={[0, 1.75, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.5, 1.1, 4]} />
        <meshStandardMaterial color={roof} flatShading />
      </mesh>
      <Box args={[0.5, 0.8, 0.1]} color="#6b4a2b" position={[0, 0.4, 0.75]} />
      <Box args={[0.4, 0.4, 0.08]} color="#bfe9ff" position={[-0.5, 0.85, 0.75]} />
      <Box args={[0.4, 0.4, 0.08]} color="#bfe9ff" position={[0.5, 0.85, 0.75]} />
    </group>
  );
}

function Diorama() {
  const turntable = useRef<THREE.Group>(null);
  const wave = useRef<THREE.Group>(null);
  const hook = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (turntable.current) {
      turntable.current.rotation.y += delta * 0.14;
      turntable.current.position.y = -0.4 + Math.sin(t * 0.6) * 0.18;
      // Leve inclinación hacia el puntero
      turntable.current.rotation.x = THREE.MathUtils.lerp(
        turntable.current.rotation.x,
        -0.12 + state.pointer.y * 0.06,
        0.04,
      );
    }
    if (wave.current) wave.current.rotation.z = -0.9 - Math.sin(t * 6) * 0.5;
    if (hook.current) hook.current.position.y = 1.2 + Math.sin(t * 1.5) * 0.15;
  });

  return (
    <group ref={turntable} rotation={[-0.12, 0, 0]}>
      {/* Isla flotante */}
      <Box args={[6.6, 0.9, 6.6]} color="#6fbf44" position={[0, 0, 0]} receiveShadow castShadow />
      <Box args={[6.2, 1, 6.2]} color="#7a5230" position={[0, -0.9, 0]} />
      <Box args={[4.2, 1.4, 4.2]} color="#6b4a2b" position={[0, -2, 0]} />
      <Box args={[2.2, 1.8, 2.2]} color="#5e4227" position={[0, -3.4, 0]} />
      {/* Rocas flotando bajo la isla */}
      <Box args={[0.7, 0.7, 0.7]} color="#8f8f8f" position={[2.6, -2.4, 1.4]} rotation={[0.4, 0.5, 0]} />
      <Box args={[0.5, 0.5, 0.5]} color="#8f8f8f" position={[-2.4, -3, -1]} rotation={[0.2, 0.8, 0.3]} />

      {/* Casas (colores de acento del sitio) */}
      <MiniHouse position={[-1.7, 0.45, -0.6]} roof="#22d3ee" />
      <MiniHouse position={[1.5, 0.45, 0.9]} roof="#8b5cf6" />

      {/* Árbol voxel */}
      <group position={[1.9, 0.45, -1.7]}>
        <Box args={[0.35, 1.1, 0.35]} color="#6b4a2b" position={[0, 0.55, 0]} castShadow />
        <Box args={[1.4, 1.1, 1.4]} color="#3f9e33" position={[0, 1.5, 0]} castShadow />
        <Box args={[0.9, 0.8, 0.9]} color="#46ab3a" position={[0, 2.3, 0]} castShadow />
      </group>

      {/* Mini-grúa (guiño a la obra del mundo) */}
      <group position={[-2, 0.45, 1.7]}>
        <Box args={[0.5, 0.3, 0.5]} color="#6a6a6a" position={[0, 0.15, 0]} />
        <Box args={[0.24, 3, 0.24]} color="#f2c14e" position={[0, 1.6, 0]} castShadow />
        <group position={[0, 3, 0]}>
          <Box args={[2.2, 0.15, 0.15]} color="#f2c14e" position={[0.8, 0, 0]} />
          <Box args={[0.7, 0.15, 0.15]} color="#f2c14e" position={[-0.5, 0, 0]} />
          <Box args={[0.35, 0.35, 0.35]} color="#3d3d3d" position={[-0.8, 0, 0]} />
          <group ref={hook} position={[1.7, 0, 0]}>
            <Box args={[0.03, 1.2, 0.03]} color="#2a2a2a" position={[0, -0.6, 0]} />
            <Box args={[0.2, 0.28, 0.2]} color="#c0392b" position={[0, -1.3, 0]} />
          </group>
        </group>
      </group>

      {/* Aldeano saludando */}
      <group position={[0.2, 0.45, 1.9]}>
        <Box args={[0.22, 0.4, 0.2]} color="#0ea5b7" position={[0, 0.5, 0]} castShadow />
        <Box args={[0.16, 0.36, 0.16]} color="#3a4a6b" position={[0, 0.18, 0]} />
        <Box args={[0.3, 0.3, 0.3]} color="#e8b98d" position={[0, 0.9, 0]} castShadow />
        <Box args={[0.32, 0.1, 0.32]} color="#4a3320" position={[0, 1.06, 0]} />
        <group ref={wave} position={[0.16, 0.72, 0]}>
          <Box args={[0.1, 0.34, 0.1]} color="#e8b98d" position={[0, 0.17, 0]} />
        </group>
        <Box args={[0.1, 0.34, 0.1]} color="#e8b98d" position={[-0.16, 0.55, 0]} />
      </group>
    </group>
  );
}

/** Nubes voxel que derivan por el cielo, fuera de la isla giratoria. */
function DriftClouds() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    group.current?.children.forEach((c, i) => {
      c.position.x += delta * (0.25 + i * 0.05);
      if (c.position.x > 9) c.position.x = -9;
    });
  });
  const clouds: [number, number, number][] = [
    [-6, 3.2, -2],
    [4, 4, -3],
    [0, 2.4, -4],
  ];
  return (
    <group ref={group}>
      {clouds.map((p, i) => (
        <Box key={i} args={[2.4, 0.5, 1]} color="#ffffff" position={p}>
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </Box>
      ))}
    </group>
  );
}

export default function TitleDiorama() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 3.2, 8.5], fov: 34 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      className="pointer-events-none"
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      onCreated={({ camera }) => camera.lookAt(0, -0.4, 0)}
    >
      <hemisphereLight color="#cfe3ff" groundColor="#6a8f4a" intensity={0.9} />
      <directionalLight
        castShadow
        position={[5, 9, 6]}
        intensity={1.5}
        color="#ffe6c2"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* Luz de relleno violeta para dar dramatismo de atardecer */}
      <directionalLight position={[-6, 3, -5]} intensity={0.5} color="#a78bfa" />
      <Diorama />
      <DriftClouds />
    </Canvas>
  );
}
