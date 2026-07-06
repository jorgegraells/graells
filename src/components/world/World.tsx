"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary, Locale, Project } from "@/i18n/dictionaries";
import { VILLAGE_COLORS, type MoveInput } from "@/components/world/WorldCanvas";

const WorldCanvas = dynamic(() => import("@/components/world/WorldCanvas"), {
  ssr: false,
  loading: () => null,
});

const JOYSTICK_RADIUS = 44;

/** Joystick táctil para moverse en pantallas sin teclado. */
function Joystick({ move }: { move: MoveInput }) {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const base = useRef<HTMLDivElement>(null);

  const update = (e: React.PointerEvent) => {
    if (!base.current) return;
    const rect = base.current.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > JOYSTICK_RADIUS) {
      dx = (dx / len) * JOYSTICK_RADIUS;
      dy = (dy / len) * JOYSTICK_RADIUS;
    }
    move.x = dx / JOYSTICK_RADIUS;
    move.y = dy / JOYSTICK_RADIUS;
    setKnob({ x: dx, y: dy });
  };

  const release = () => {
    move.x = 0;
    move.y = 0;
    setKnob({ x: 0, y: 0 });
  };

  return (
    <div
      ref={base}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) update(e);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      className="glass absolute bottom-20 left-6 z-10 h-28 w-28 touch-none rounded-full"
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full border border-accent/40 bg-accent/20"
        style={{
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
        }}
      />
    </div>
  );
}

/** Botón de salto táctil, simétrico al joystick. */
function JumpButton({ move }: { move: MoveInput }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move.jump = true;
      }}
      onPointerUp={() => (move.jump = false)}
      onPointerCancel={() => (move.jump = false)}
      onContextMenu={(e) => e.preventDefault()}
      className="glass absolute bottom-20 right-6 z-10 flex h-20 w-20 touch-none items-center justify-center rounded-full text-2xl text-white/90 active:bg-white/20"
      aria-label="Saltar"
    >
      ⬆
    </button>
  );
}

/** Diálogo del aldeano: cuenta el proyecto línea a línea con efecto máquina de escribir. */
function Dialogue({
  project,
  color,
  dict,
  touch,
  onClose,
}: {
  project: Project;
  color: string;
  dict: Dictionary;
  touch: boolean;
  onClose: () => void;
}) {
  const lines = useMemo(
    () => [
      dict.world.greet.replace("{name}", project.name),
      project.description,
      `${project.tech.join(" · ")} — ${project.role}`,
    ],
    [project, dict],
  );
  const [lineIndex, setLineIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const line = lines[lineIndex];
  const done = chars >= line.length;
  const isLast = lineIndex === lines.length - 1;

  useEffect(() => {
    if (chars >= lines[lineIndex].length) return;
    const id = setTimeout(() => setChars((c) => c + 2), 18);
    return () => clearTimeout(id);
  }, [chars, lineIndex, lines]);

  const advance = useCallback(() => {
    if (!done) {
      setChars(line.length);
    } else if (!isLast) {
      setLineIndex((i) => i + 1);
      setChars(0);
    } else {
      onClose();
    }
  }, [done, isLast, line.length, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE" || e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="absolute inset-x-0 bottom-0 z-20 flex justify-center p-5"
    >
      <div
        onClick={advance}
        className="glass w-full max-w-2xl cursor-pointer select-none rounded-2xl p-6"
        style={{ boxShadow: `0 8px 60px -12px ${color}` }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-bold" style={{ color }}>
            {project.name}
          </p>
          <span
            className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
            style={{ borderColor: `${color}66`, color }}
          >
            {project.status}
          </span>
        </div>

        <p className="mt-3 min-h-20 text-base leading-relaxed text-foreground/90">
          {line.slice(0, chars)}
          {!done && <span className="animate-pulse text-accent">▌</span>}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {lines.map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: i <= lineIndex ? color : "rgba(148,163,184,0.3)",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            {done && isLast &&
              project.links?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-semibold hover:underline"
                  style={{ color }}
                >
                  {link.label} ↗
                </a>
              ))}
            <p className="font-mono text-xs text-muted">
              {done && isLast ? dict.world.close : dict.world.next}
              {!touch && " · E"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function World({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [active, setActive] = useState<Project | null>(null);
  const [touchDevice, setTouchDevice] = useState(false);
  const move = useRef<MoveInput>({ x: 0, y: 0, jump: false }).current;

  const close = useCallback(() => setActive(null), []);
  const onEnter = useCallback((project: Project) => setActive(project), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const activeIndex = active
    ? dict.projects.items.findIndex((p) => p.slug === active.slug)
    : -1;
  const activeColor =
    activeIndex >= 0
      ? VILLAGE_COLORS[activeIndex % VILLAGE_COLORS.length]
      : "#0ea5b7";

  return (
    <div className="fixed inset-0 select-none bg-[#6cb8ec]">
      <WorldCanvas
        dict={dict}
        touch={touchDevice}
        paused={active !== null}
        onEnter={onEnter}
        externalMove={move}
      />

      {touchDevice && !active && (
        <>
          <Joystick move={move} />
          <JumpButton move={move} />
        </>
      )}

      {/* HUD superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5">
        <Link
          href={`/${locale}`}
          className="glass pointer-events-auto rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/80 transition-colors hover:text-white"
        >
          ← {dict.world.exit}
        </Link>
        <p className="glass rounded-full px-5 py-2 font-mono text-xs uppercase tracking-[0.3em] text-white">
          {dict.world.title}
        </p>
        <div className="w-32" aria-hidden />
      </div>

      {/* Pista de controles (oculta durante el diálogo) */}
      {!active && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center px-4">
          <p className="glass rounded-full px-5 py-2.5 text-center font-mono text-xs text-white/85">
            {touchDevice ? dict.world.hintTouch : dict.world.hint}
          </p>
        </div>
      )}

      <AnimatePresence>
        {active && (
          <Dialogue
            key={active.slug}
            project={active}
            color={activeColor}
            dict={dict}
            touch={touchDevice}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
