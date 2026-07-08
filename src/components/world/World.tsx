"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary, Locale, Project } from "@/i18n/dictionaries";
import {
  VILLAGE_COLORS,
  type MoveInput,
  type WorldStyle,
} from "@/components/world/WorldCanvas";

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

/** Pantalla de bienvenida: enmarca el mundo como un videojuego antes de empezar. */
function Welcome({
  dict,
  touch,
  onStart,
}: {
  dict: Dictionary;
  touch: boolean;
  onStart: () => void;
}) {
  const controls = touch
    ? dict.world.intro.controlsTouch
    : dict.world.intro.controls;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        className="glass w-full max-w-lg rounded-3xl p-8 text-center shadow-[0_0_80px_-20px_rgba(34,211,238,0.7)]"
      >
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          {dict.world.intro.eyebrow}
        </p>
        <h2 className="mt-3 bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          {dict.world.intro.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80">
          {dict.world.intro.body}
        </p>

        <ul className="mx-auto mt-6 grid max-w-sm gap-2 text-left">
          {controls.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 text-sm text-white/85"
            >
              <span className="mt-0.5 text-accent">▹</span>
              {line}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onStart}
          className="glow-ring mt-8 w-full rounded-full bg-accent/15 px-6 py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/25"
        >
          {dict.world.intro.cta} →
        </button>
      </motion.div>
    </motion.div>
  );
}

const EQUIP_COLOR = ["#0e7490", "#7e22ce", "#be185d", "#3f6212"];
const EQUIP_ICON = ["⚔", "✦", "▣", "◆"];

/** Ventana STATUS: menú de personaje estilo Minecraft (panel gris con bisel,
 *  barras de XP verdes y ranuras de inventario), a juego con el pueblo voxel. */
function StatusPanel({
  dict,
  onClose,
}: {
  dict: Dictionary;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        className="mc-panel max-h-[80vh] w-full max-w-md overflow-y-auto p-5 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#3f3f3f]">
            {dict.world.status.title}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mc-btn grid h-7 w-7 place-items-center text-xs font-bold leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <p className="text-lg font-bold text-[#2b2b2b]">Jorge Graells</p>
          <p className="text-xs text-[#5c5c5c]">
            {dict.world.status.playerClass}
          </p>
          <p className="mt-1 text-xs font-bold text-[#2e7d1e]">
            {dict.world.status.level}
          </p>
          <p className="mt-0.5 text-xs italic text-[#6d4a1f]">
            {dict.world.status.epithet}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {dict.world.status.attributes.map((attr, i) => (
            <div key={attr.name}>
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] font-semibold text-[#3f3f3f]">
                  {attr.name}
                </p>
                <p className="text-[11px] font-bold text-[#2e7d1e]">
                  {attr.value}
                </p>
              </div>
              <div className="mc-bar-track mt-1 h-3.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${attr.value}%` }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.07 }}
                  className="mc-bar-fill h-full"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-wider text-[#3f3f3f]">
          {dict.world.status.equipmentLabel}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {dict.world.status.equipment.map((slot, i) => (
            <div key={slot.slot} className="flex items-start gap-2">
              <span
                className="mc-slot grid h-9 w-9 shrink-0 place-items-center text-base"
                style={{ color: EQUIP_COLOR[i % EQUIP_COLOR.length] }}
              >
                {EQUIP_ICON[i % EQUIP_ICON.length]}
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#5c5c5c]">
                  {slot.slot}
                </p>
                <p className="text-[11px] leading-snug text-[#2b2b2b]">
                  {slot.items}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
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
      `${project.tech.join(" · ")} · ${project.role}`,
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
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [worldStyle, setWorldStyle] = useState<WorldStyle>("blocky");
  const [started, setStarted] = useState(false);
  const [touchDevice, setTouchDevice] = useState(false);
  const move = useRef<MoveInput>({ x: 0, y: 0, jump: false }).current;
  const activeRef = useRef(active);
  activeRef.current = active;
  const startedRef = useRef(started);
  startedRef.current = started;

  const close = useCallback(() => setActive(null), []);
  const onEnter = useCallback((project: Project) => {
    setSkillsOpen(false);
    setActive(project);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        setActive(null);
        setSkillsOpen(false);
      }
      // C abre/cierra la ventana de habilidades (si ya se ha entrado y no hay diálogo)
      if (e.code === "KeyC" && activeRef.current === null && startedRef.current) {
        setSkillsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Entrar al pueblo: en escritorio captura el ratón para mirar como en un FPS
  const start = useCallback(() => {
    setStarted(true);
    if (!window.matchMedia("(pointer: coarse)").matches) {
      try {
        const canvas = document.querySelector("canvas");
        const req = (
          canvas?.requestPointerLock as (() => Promise<void> | void) | undefined
        )?.call(canvas);
        if (req && typeof (req as Promise<void>).catch === "function") {
          (req as Promise<void>).catch(() => {});
        }
      } catch {
        /* sin pointer lock: el jugador puede clicar para capturar el ratón */
      }
    }
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
        paused={active !== null || skillsOpen || !started}
        casting={skillsOpen}
        style={worldStyle}
        onEnter={onEnter}
        externalMove={move}
      />

      {touchDevice && started && !active && !skillsOpen && (
        <>
          <Joystick move={move} />
          <JumpButton move={move} />
        </>
      )}

      {/* HUD superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 p-5">
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}`}
            className="glass pointer-events-auto rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/80 transition-colors hover:text-white"
          >
            ← {dict.world.exit}
          </Link>
          <button
            type="button"
            onClick={() =>
              setWorldStyle((s) => (s === "blocky" ? "rounded" : "blocky"))
            }
            className="glass pointer-events-auto rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/80 transition-colors hover:text-white"
            aria-label={dict.world.style[worldStyle]}
          >
            {worldStyle === "blocky" ? "◼" : "⬤"}{" "}
            {dict.world.style[worldStyle]}
          </button>
        </div>
        <p className="glass hidden rounded-full px-5 py-2 font-mono text-xs uppercase tracking-[0.3em] text-white sm:block">
          {dict.world.title}
        </p>
        <button
          type="button"
          onClick={() => {
            setActive(null);
            setSkillsOpen((open) => !open);
          }}
          className="glass pointer-events-auto rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-300 transition-colors hover:text-cyan-100"
        >
          ⬡ {dict.world.status.open}
          {!touchDevice && " · C"}
        </button>
      </div>

      {/* Mira central en modo escritorio (feel de FPS) */}
      {started && !touchDevice && !active && !skillsOpen && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 shadow-[0_0_4px_rgba(0,0,0,0.6)]" />
      )}

      {/* Recordatorio de Esc para liberar el ratón / salir (escritorio, en juego) */}
      {started && !touchDevice && !active && !skillsOpen && (
        <p className="glass pointer-events-none absolute bottom-6 right-6 z-10 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/80">
          {dict.world.escHint}
        </p>
      )}

      {/* Pista de controles (oculta antes de entrar, en diálogo o en STATUS) */}
      {started && !active && !skillsOpen && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center px-4">
          <p className="glass rounded-full px-5 py-2.5 text-center font-mono text-xs text-white/85">
            {touchDevice ? dict.world.hintTouch : dict.world.hint}
          </p>
        </div>
      )}

      <AnimatePresence>
        {!started && (
          <Welcome
            key="welcome"
            dict={dict}
            touch={touchDevice}
            onStart={start}
          />
        )}
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
        {skillsOpen && (
          <StatusPanel
            key="status"
            dict={dict}
            onClose={() => setSkillsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
