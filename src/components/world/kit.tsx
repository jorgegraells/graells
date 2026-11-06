"use client";

// Piezas comunes de la escena: estilo, calidad, bloque e interacción.
// Vive aparte de WorldCanvas para que las zonas nuevas no engorden ese archivo.

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useFrame, type Camera } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { WorldTheme } from "./constants";

export type WorldStyle = "blocky" | "rounded";

export const StyleContext = createContext<WorldStyle>("blocky");
export const useWorldStyle = () => useContext(StyleContext);

export const ThemeContext = createContext<WorldTheme>("voxel");
export const useWorldTheme = () => useContext(ThemeContext);

/** Equipos modestos: sin sombras, menos detalle y sin contornos. */
export const QualityContext = createContext<{ low: boolean }>({ low: false });
export const useQuality = () => useContext(QualityContext);

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
export function Block({ args, radius = 0.14, children, ...props }: BlockProps) {
  const style = useWorldStyle();
  if (style === "rounded") {
    const r = Math.min(radius, Math.min(...args) * 0.45);
    // Con un solo paso el canto se ve igual de suave y cuesta menos de la mitad
    return (
      <RoundedBox args={args} radius={r} smoothness={1} {...props}>
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

/** Lo que el jugador puede hacer ahora mismo (tecla E o botón táctil). */
export type NearAction = {
  id: string;
  verb: string;
  run: () => void;
};

type Reporter = (id: string, action: NearAction | null) => void;
export const InteractContext = createContext<Reporter>(() => {});

/** Marca un punto del mundo como interactuable: avisa al HUD de cuándo está
 *  cerca el jugador. La tecla y el botón táctil viven en un solo sitio (World),
 *  así que no hay varios oyentes compitiendo por la misma pulsación. */
export function useInteractable({
  id,
  x,
  z,
  radius,
  verb,
  onUse,
  inRange,
}: {
  id: string;
  x: number;
  z: number;
  radius: number;
  verb: string;
  onUse: () => void;
  /** Condición propia en vez de la distancia (por ejemplo, estar dentro de un edificio) */
  inRange?: (camera: Camera) => boolean;
}) {
  const report = useContext(InteractContext);
  const [near, setNear] = useState(false);
  const nearRef = useRef(false);
  const onUseRef = useRef(onUse);
  const inRangeRef = useRef(inRange);
  useEffect(() => {
    onUseRef.current = onUse;
    inRangeRef.current = inRange;
  });

  useFrame(({ camera }) => {
    const isNear = inRangeRef.current
      ? inRangeRef.current(camera)
      : Math.hypot(camera.position.x - x, camera.position.z - z) < radius;
    if (isNear !== nearRef.current) {
      nearRef.current = isNear;
      setNear(isNear);
    }
  });

  useEffect(() => {
    report(id, near ? { id, verb, run: () => onUseRef.current() } : null);
    return () => report(id, null);
  }, [id, near, verb, report]);

  return near;
}

/** ¿Está el jugador lo bastante cerca para que merezca la pena pintar este
 *  detalle? Con histéresis, para que no parpadee justo en el límite. */
export function usePlayerWithin(x: number, z: number, radius: number) {
  const [within, setWithin] = useState(false);
  const ref = useRef(false);
  useFrame(({ camera }) => {
    const d = Math.hypot(camera.position.x - x, camera.position.z - z);
    const next = ref.current ? d < radius + 4 : d < radius;
    if (next !== ref.current) {
      ref.current = next;
      setWithin(next);
    }
  });
  return within;
}
