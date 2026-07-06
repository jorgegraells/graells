"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 260;
const FIELD_RADIUS = 8;
const LINK_DISTANCE = 2.1;

function buildField() {
  const positions = new Float32Array(NODE_COUNT * 3);
  const nodes: THREE.Vector3[] = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    // Distribución esférica con ligero aplanado en Z para que respire en pantalla
    const r = FIELD_RADIUS * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    const z = r * Math.cos(phi) * 0.6;
    nodes.push(new THREE.Vector3(x, y, z));
    positions.set([x, y, z], i * 3);
  }

  const linkPositions: number[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (nodes[i].distanceTo(nodes[j]) < LINK_DISTANCE) {
        linkPositions.push(
          nodes[i].x, nodes[i].y, nodes[i].z,
          nodes[j].x, nodes[j].y, nodes[j].z,
        );
      }
    }
  }

  return { positions, links: new Float32Array(linkPositions) };
}

function NeuralField() {
  const group = useRef<THREE.Group>(null);
  const { positions, links } = useMemo(buildField, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.05;
    // Parallax suave hacia el puntero
    const targetX = state.pointer.y * 0.25;
    const targetZ = state.pointer.x * 0.15;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.03,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      targetZ,
      0.03,
    );
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color="#67e8f9"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[links, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function NeuralScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      className="pointer-events-none"
      eventSource={
        typeof document !== "undefined" ? document.body : undefined
      }
    >
      <NeuralField />
    </Canvas>
  );
}
