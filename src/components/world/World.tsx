"use client";

import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import type { Dictionary, Locale, Project } from "@/i18n/dictionaries";
import { siteLinks } from "@/i18n/dictionaries";
import {
  ELDER_COLOR,
  MAIL_COLOR,
  VILLAGE_COLORS,
  type MoveInput,
  type WorldTheme,
} from "@/components/world/constants";
import PlainWorld, { type BoardItem } from "@/components/world/PlainWorld";

// Three y compañía solo se descargan si de verdad se va a pintar el mundo
const WorldCanvas = dynamic(() => import("@/components/world/WorldCanvas"), {
  ssr: false,
  loading: () => null,
});

const JOYSTICK_RADIUS = 44;
/** Con qué modo se entra al pueblo; el botón de la plaza cambia al otro */
const DEFAULT_THEME: WorldTheme = "overworld";
const QUEST_KEY = "jg-world-quest";

type NearAction = { id: string; verb: string; run: () => void };

/** Si algo falla al montar el 3D, se ofrece el texto en vez de una pantalla rota. */
class CanvasBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Joystick táctil para moverse en pantallas sin teclado. */
function Joystick({ move }: { move: MoveInput }) {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const base = useRef<HTMLDivElement>(null);

  // Si desaparece con el dedo puesto (se abre un panel), el jugador debe pararse
  useEffect(
    () => () => {
      move.x = 0;
      move.y = 0;
    },
    [move],
  );

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
function JumpButton({ move, label }: { move: MoveInput; label: string }) {
  useEffect(
    () => () => {
      move.jump = false;
    },
    [move],
  );
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
      aria-label={label}
    >
      ⬆
    </button>
  );
}

/** Pantalla de bienvenida: enmarca el mundo como un videojuego antes de empezar. */
function Welcome({
  dict,
  touch,
  low,
  onStart,
  onPlain,
}: {
  dict: Dictionary;
  touch: boolean;
  low: boolean;
  onStart: () => void;
  onPlain: () => void;
}) {
  const controls = touch
    ? dict.world.intro.controlsTouch
    : dict.world.intro.controls;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-30 flex items-center justify-center overflow-y-auto bg-black/40 p-5 ${low ? "" : "backdrop-blur-sm"}`}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={dict.world.intro.title}
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        className="glass my-auto w-full max-w-lg rounded-3xl p-8 text-center shadow-[0_0_80px_-20px_rgba(34,211,238,0.7)]"
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
          autoFocus
          onClick={onStart}
          className="glow-ring mt-8 w-full rounded-full bg-accent/15 px-6 py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/25"
        >
          {dict.world.intro.cta} →
        </button>
        <button
          type="button"
          onClick={onPlain}
          className="mt-3 min-h-11 text-sm font-medium text-white/70 underline underline-offset-4 hover:text-white"
        >
          {dict.world.plain.open}
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
  const dialogRef = useDialogFocus();
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
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={dict.world.status.title}
        initial={{ scale: 0.94, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        className="mc-panel max-h-[80vh] w-full max-w-md overflow-y-auto p-5 font-mono outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#3f3f3f]">
            {dict.world.status.title}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mc-btn grid h-7 w-7 place-items-center text-xs font-bold leading-none pointer-coarse:h-11 pointer-coarse:w-11"
            aria-label={dict.world.closeLabel}
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

/** Reparte un texto largo en páginas de diálogo, cortando siempre entre frases. */
function dialogPages(text: string, max = 200): string[] {
  const sentences = text.match(/.+?(?:[.!?]+(?:\s+|$)|$)/g) ?? [text];
  const pages: string[] = [];
  let page = "";
  for (const sentence of sentences) {
    if (page && page.length + sentence.length > max) {
      pages.push(page.trim());
      page = "";
    }
    page += sentence;
  }
  if (page.trim()) pages.push(page.trim());
  return pages;
}

/** ¿Esta pulsación es para el botón o enlace que tiene el foco? */
const onFocusedControl = (e: KeyboardEvent) =>
  (e.code === "Enter" || e.code === "Space") &&
  Boolean((e.target as HTMLElement | null)?.closest?.("a,button"));

type PanelLink = { label: string; href: string };

/** Diálogo con máquina de escribir, línea a línea: aldeanos, anciano y biblioteca. */
/** Lleva el foco al panel al abrirlo: el teclado y el lector empiezan por él. */
function useDialogFocus() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}

function TalkPanel({
  title,
  badge,
  color,
  lines,
  links,
  dict,
  touch,
  onClose,
  onLastLine,
}: {
  title: string;
  badge?: string;
  color: string;
  lines: string[];
  links?: PanelLink[];
  dict: Dictionary;
  touch: boolean;
  onClose: () => void;
  onLastLine?: () => void;
}) {
  const reduced = useReducedMotion();
  const dialogRef = useDialogFocus();
  const [lineIndex, setLineIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const line = lines[lineIndex];
  const done = Boolean(reduced) || chars >= line.length;
  const isLast = lineIndex === lines.length - 1;

  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => setChars((c) => c + 2), 18);
    return () => clearTimeout(id);
  }, [chars, done]);

  useEffect(() => {
    if (isLast) onLastLine?.();
  }, [isLast, onLastLine]);

  const closed = useRef(false);
  const close = useCallback(() => {
    if (closed.current) return;
    closed.current = true;
    onClose();
  }, [onClose]);

  const advance = useCallback(() => {
    if (!done) {
      setChars(line.length);
    } else if (!isLast) {
      setLineIndex((i) => i + 1);
      setChars(0);
    } else {
      close();
    }
  }, [done, isLast, line.length, close]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || onFocusedControl(e)) return;
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
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-label={title}
        onClick={advance}
        className="glass w-full max-w-2xl cursor-pointer select-none rounded-2xl p-6 outline-none"
        style={{ boxShadow: `0 8px 60px -12px ${color}` }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-bold" style={{ color }}>
            {title}
          </p>
          <div className="flex items-center gap-2">
            {badge && (
              <span
                className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                style={{ borderColor: `${color}66`, color }}
              >
                {badge}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label={dict.world.closeLabel}
              className="grid h-7 w-7 place-items-center rounded-full text-sm text-white/70 hover:text-white pointer-coarse:h-11 pointer-coarse:w-11"
            >
              ✕
            </button>
          </div>
        </div>

        {/* El lector de pantalla recibe la frase entera, sin la máquina de escribir */}
        <p className="sr-only" aria-live="polite">
          {line}
        </p>
        <p aria-hidden className="mt-3 min-h-20 text-base leading-relaxed text-foreground/90">
          {done ? line : line.slice(0, chars)}
          {!done && <span className="animate-pulse text-accent">▌</span>}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
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
          <div className="flex flex-wrap items-center gap-4">
            {done &&
              isLast &&
              links?.map((link) => (
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

type LinkGroup = {
  heading?: string;
  links?: (PanelLink & { hint?: string })[];
  checklist?: { label: string; done: boolean }[];
};

/** Panel de enlaces: buzón, tablón y recompensa de la misión. */
function LinksPanel({
  title,
  color,
  intro,
  groups,
  dict,
  touch,
  onClose,
}: {
  title: string;
  color: string;
  intro?: string;
  groups: LinkGroup[];
  dict: Dictionary;
  touch: boolean;
  onClose: () => void;
}) {
  const dialogRef = useDialogFocus();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || onFocusedControl(e)) return;
      if (e.code === "KeyE") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.14 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ y: 16 }}
        animate={{ y: 0 }}
        exit={{ y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="glass max-h-[80vh] w-full max-w-lg select-text overflow-y-auto rounded-2xl p-6 outline-none"
        style={{ boxShadow: `0 8px 60px -12px ${color}` }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-bold" style={{ color }}>
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.world.closeLabel}
            className="grid h-7 w-7 place-items-center rounded-full text-sm text-white/70 hover:text-white pointer-coarse:h-11 pointer-coarse:w-11"
          >
            ✕
          </button>
        </div>
        {intro && <p className="mt-3 text-sm leading-relaxed text-foreground/90">{intro}</p>}
        {groups.map((group, i) => (
          <div key={group.heading ?? i} className="mt-4">
            {group.heading && (
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
                {group.heading}
              </p>
            )}
            {group.checklist && (
              <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
                {group.checklist.map((item) => (
                  <li key={item.label} className="text-sm text-white/90">
                    <span className={item.done ? "text-emerald-300" : "text-amber-300"}>
                      {item.done ? "✓" : "!"}
                    </span>{" "}
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
            <ul className="mt-1.5">
              {group.links?.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg py-2 text-sm font-medium text-white/90 hover:text-white hover:underline"
                  >
                    {link.label} <span aria-hidden style={{ color }}>↗</span>
                    {link.hint && <span className="ml-2 font-mono text-[11px] text-muted">{link.hint}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="mt-4 text-right font-mono text-xs text-muted">
          {dict.world.close}
          {!touch && " · Esc"}
        </p>
      </motion.div>
    </motion.div>
  );
}

type Panel =
  | { kind: "project"; project: Project }
  | { kind: "skills" | "library" | "elder" | "mailbox" | "board" | "quest" | "plain" };

function readVisited(slugs: string[]): string[] {
  try {
    const raw = window.localStorage.getItem(QUEST_KEY);
    const list: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    return [...new Set(list.filter((s): s is string => slugs.includes(s)))];
  } catch {
    return [];
  }
}

export default function World({
  locale,
  dict,
  board,
}: {
  locale: Locale;
  dict: Dictionary;
  board: BoardItem[];
}) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [worldTheme, setWorldTheme] = useState<WorldTheme>(DEFAULT_THEME);
  const [themeFlash, setThemeFlash] = useState(false);
  const flashingRef = useRef(false);
  const [started, setStarted] = useState(false);
  // Se decide en el cliente, antes de montar el 3D: dispositivo y si hay WebGL
  const [env, setEnv] = useState<{ touch: boolean; low: boolean; webgl: boolean } | null>(null);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const [locked, setLocked] = useState(false);
  const [action, setAction] = useState<NearAction | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [goals, setGoals] = useState(0);
  const [goalToast, setGoalToast] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const nearActions = useRef(new Map<string, NearAction>());
  const questShownRef = useRef(false);
  const move = useRef<MoveInput>({ x: 0, y: 0, jump: false }).current;
  const reduced = useReducedMotion();

  const touchDevice = env?.touch ?? false;
  const low = env?.low ?? false;
  const noCanvas = env !== null && (!env.webgl || canvasFailed);
  const slugs = useMemo(() => dict.projects.items.map((p) => p.slug), [dict]);
  const total = slugs.length;
  const questDone = visited.length >= total;

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const modest =
      touch ||
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
      navigator.hardwareConcurrency <= 4;
    let webgl = false;
    try {
      const probe = document.createElement("canvas");
      webgl = Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setEnv({ touch, low: modest, webgl });
    const saved = readVisited(slugs);
    setVisited(saved);
    // Quien ya la completó en otra visita no vuelve a recibir la recompensa de golpe
    questShownRef.current = saved.length >= slugs.length;
  }, [slugs]);

  useEffect(() => {
    const onChange = () => setLocked(document.pointerLockElement !== null);
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  const startedRef = useRef(started);
  startedRef.current = started;
  const requestLock = useCallback(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
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
  }, []);

  // Al terminar un diálogo se recupera el ratón; si el navegador no lo permite,
  // un aviso pide el clic que hace falta
  const closedAt = useRef(0);
  const closePanel = useCallback(() => {
    closedAt.current = performance.now();
    setPanel(null);
    if (startedRef.current) requestLock();
  }, [requestLock]);

  // Con el último vecino, al cerrar su diálogo se entrega la recompensa
  const visitedRef = useRef(visited);
  visitedRef.current = visited;
  const closeProject = useCallback(() => {
    if (visitedRef.current.length >= total && !questShownRef.current) {
      questShownRef.current = true;
      setPanel({ kind: "quest" });
    } else {
      closePanel();
    }
  }, [total, closePanel]);

  const markVisited = useCallback((slug: string) => {
    setVisited((current) => {
      if (current.includes(slug)) return current;
      const next = [...current, slug];
      try {
        window.localStorage.setItem(QUEST_KEY, JSON.stringify(next));
      } catch {
        /* sin almacenamiento, la misión dura lo que la visita */
      }
      return next;
    });
  }, []);

  // Lo que se abre desde el mundo: nunca sobre otro panel ni justo al cerrar uno,
  // sea con tecla o con clic. Cada apertura lleva su clave, para que un panel que
  // aún está saliendo no se reutilice.
  const panelRef = useRef(panel);
  panelRef.current = panel;
  const openSeq = useRef(0);
  const openFromWorld = useCallback((next: Panel) => {
    if (panelRef.current || performance.now() - closedAt.current < 500) return;
    openSeq.current += 1;
    setPanel(next);
  }, []);
  const onEnter = useCallback(
    (project: Project) => openFromWorld({ kind: "project", project }),
    [openFromWorld],
  );
  const onLibrary = useCallback(() => openFromWorld({ kind: "library" }), [openFromWorld]);
  const onElder = useCallback(() => openFromWorld({ kind: "elder" }), [openFromWorld]);
  const onMailbox = useCallback(() => openFromWorld({ kind: "mailbox" }), [openFromWorld]);
  const onBoard = useCallback(() => openFromWorld({ kind: "board" }), [openFromWorld]);

  const onGoal = useCallback(() => {
    setGoals((g) => g + 1);
    setGoalToast(true);
    window.setTimeout(() => setGoalToast(false), 1600);
  }, []);

  const reportNear = useCallback((id: string, next: NearAction | null) => {
    if (next) nearActions.current.set(id, next);
    else nearActions.current.delete(id);
    setAction([...nearActions.current.values()].at(-1) ?? null);
  }, []);

  // Botón arcade de la plaza: fogonazo blanco estilo transición de RPG y,
  // en el punto más blanco, se cambia el tema del mundo.
  const onThemeButton = useCallback(() => {
    if (flashingRef.current) return;
    if (reduced) {
      setWorldTheme((t) => (t === "voxel" ? "overworld" : "voxel"));
      return;
    }
    flashingRef.current = true;
    setThemeFlash(true);
    window.setTimeout(() => {
      setWorldTheme((t) => (t === "voxel" ? "overworld" : "voxel"));
    }, 250);
    window.setTimeout(() => {
      setThemeFlash(false);
      flashingRef.current = false;
    }, 550);
  }, [reduced]);

  const paused = panel !== null || !started;
  const skillsOpen = panel?.kind === "skills";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape" && panel) {
        if (panel.kind === "project") closeProject();
        else closePanel();
      }
      if (!started || e.repeat) return;
      // C abre y cierra la ventana de habilidades, sin pisar otro panel
      if (e.code === "KeyC" && (panel === null || panel.kind === "skills")) {
        if (panel) closePanel();
        else setPanel({ kind: "skills" });
      }
      // E usa lo que haya cerca; un solo sitio para todos los objetos del mundo
      if (panel === null && action && (e.code === "KeyE" || e.code === "Enter")) {
        if (!onFocusedControl(e)) action.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, started, action, closePanel, closeProject]);

  // En móvil la pista de controles se va sola: tapa medio pueblo
  useEffect(() => {
    if (!started || !touchDevice) return;
    const id = window.setTimeout(() => setHintVisible(false), 9000);
    return () => window.clearTimeout(id);
  }, [started, touchDevice]);

  // Entrar al pueblo: en escritorio captura el ratón para mirar como en un FPS
  const start = useCallback(() => {
    setStarted(true);
    requestLock();
  }, [requestLock]);

  const activeProject = panel?.kind === "project" ? panel.project : null;
  const activeIndex = activeProject
    ? dict.projects.items.findIndex((p) => p.slug === activeProject.slug)
    : -1;
  const activeColor =
    activeIndex >= 0
      ? VILLAGE_COLORS[activeIndex % VILLAGE_COLORS.length]
      : "#0ea5b7";

  const projectLines = useMemo(
    () =>
      activeProject
        ? [
            dict.world.greet.replace("{name}", activeProject.name),
            ...dialogPages(activeProject.description),
            // Lo mejor de cada proyecto; en Flypet, además, el crédito a Janelia
            ...dialogPages(activeProject.highlight),
            `${activeProject.tech.join(" · ")} · ${activeProject.role}`,
          ]
        : [],
    [activeProject, dict],
  );

  const elderLines = useMemo(
    () => [
      dict.world.elder.intro,
      ...dict.journey.items.flatMap((item) =>
        dialogPages(`${item.period}. ${item.title}. ${item.description}`),
      ),
      dict.world.elder.outro,
    ],
    [dict],
  );

  const contactLinks: PanelLink[] = [
    { label: siteLinks.email, href: `mailto:${siteLinks.email}` },
    { label: "LinkedIn", href: siteLinks.linkedin },
    { label: "GitHub", href: siteLinks.github },
  ];
  const newsItems = board.filter((b) => b.kind === "news");
  const guideItems = board.filter((b) => b.kind === "guide");
  const newsHref = locale === "es" ? "/es/noticias" : "/en/news";

  const showPlain = panel?.kind === "plain" || noCanvas;
  const inGame = started && panel === null && !noCanvas;

  // Con la vista en texto abierta, su copia para buscadores no debe contarse dos veces
  useEffect(() => {
    const copy = document.getElementById("world-plain-copy");
    if (copy) copy.inert = showPlain;
  }, [showPlain]);

  return (
    <MotionConfig reducedMotion="user">
      <div className={`fixed inset-0 select-none bg-[#6cb8ec] ${low ? "world-low" : ""}`}>
        {env && !noCanvas && (
          <CanvasBoundary onError={() => setCanvasFailed(true)}>
            <WorldCanvas
              dict={dict}
              touch={touchDevice}
              low={low}
              paused={paused}
              casting={skillsOpen}
              theme={worldTheme}
              visited={visited}
              onEnter={onEnter}
              onLibrary={onLibrary}
              onElder={onElder}
              onMailbox={onMailbox}
              onBoard={onBoard}
              onGoal={onGoal}
              onThemeButton={onThemeButton}
              reportNear={reportNear}
              externalMove={move}
            />
          </CanvasBoundary>
        )}

        {touchDevice && inGame && (
          <>
            <Joystick move={move} />
            <JumpButton move={move} label={dict.world.jump} />
          </>
        )}

        {/* Lo que se puede hacer ahora mismo, sin tener que acertar con el dedo */}
        {touchDevice && inGame && action && (
          <button
            type="button"
            onClick={() => action.run()}
            className="glass absolute bottom-24 left-1/2 z-10 min-h-12 -translate-x-1/2 rounded-full px-6 font-mono text-sm font-semibold uppercase tracking-wider text-accent"
          >
            {action.verb}
          </button>
        )}

        {/* HUD superior */}
        {!noCanvas && (
          <div
            inert={!started || showPlain}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-2 p-5"
          >
            <Link
              href={`/${locale}`}
              className="glass pointer-events-auto flex items-center rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/80 transition-colors hover:text-white pointer-coarse:min-h-11"
            >
              ← {dict.world.exit}
            </Link>
            <p className="glass hidden rounded-full px-5 py-2 font-mono text-xs uppercase tracking-[0.3em] text-white xl:block">
              {dict.world.title}
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {goals > 0 && (
                <p className="glass rounded-full px-3 py-2 font-mono text-xs text-white">⚽ {goals}</p>
              )}
              {started && (
                <button
                  type="button"
                  onClick={(e) => {
                    if (e.detail > 0) e.currentTarget.blur();
                    setPanel({ kind: "quest" });
                  }}
                  className={`glass pointer-events-auto flex items-center rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors pointer-coarse:min-h-11 ${questDone ? "text-emerald-300" : "text-amber-300"}`}
                >
                  {questDone ? "✓" : "!"} {dict.world.quest.pill} {visited.length}/{total}
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  if (e.detail > 0) e.currentTarget.blur();
                  if (panel?.kind === "skills") closePanel();
                  else setPanel({ kind: "skills" });
                }}
                className="glass pointer-events-auto flex items-center rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-300 transition-colors hover:text-cyan-100 pointer-coarse:min-h-11"
              >
                ⬡ {dict.world.status.open}
                {!touchDevice && " · C"}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  if (e.detail > 0) e.currentTarget.blur();
                  setPanel({ kind: "plain" });
                }}
                className="glass pointer-events-auto hidden items-center rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/80 transition-colors hover:text-white sm:flex"
              >
                {dict.world.plain.open}
              </button>
            </div>
          </div>
        )}

        {/* Mira central en modo escritorio (feel de FPS) */}
        {inGame && !touchDevice && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 shadow-[0_0_4px_rgba(0,0,0,0.6)]" />
        )}

        {/* Si el navegador no devuelve el ratón al cerrar un panel, se pide el clic */}
        {inGame && !touchDevice && !locked && (
          <p className="glass pointer-events-none absolute bottom-20 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 font-mono text-xs text-white">
            {dict.world.clickToLook}
          </p>
        )}

        {/* Recordatorio de Esc para liberar el ratón / salir (escritorio, en juego) */}
        {inGame && !touchDevice && locked && (
          <p className="glass pointer-events-none absolute bottom-6 right-6 z-10 hidden rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/80 2xl:block">
            {dict.world.escHint}
          </p>
        )}

        {/* Pista de controles (oculta antes de entrar y en cualquier panel) */}
        {inGame && (!touchDevice || (hintVisible && !action)) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center px-4">
            <p className="glass rounded-full px-5 py-2.5 text-center font-mono text-xs text-white/85">
              {touchDevice ? dict.world.hintTouch : dict.world.hint}
            </p>
          </div>
        )}

        {/* ¡Gol! */}
        <AnimatePresence>
          {goalToast && (
            <motion.p
              key="goal"
              role="status"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute left-1/2 top-1/3 z-20 -translate-x-1/2 rounded-2xl bg-[#0f121e]/85 px-8 py-4 text-3xl font-black text-amber-300"
            >
              ⚽ {dict.world.goalToast}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!started && !noCanvas && env && panel?.kind !== "plain" && (
            <Welcome
              key="welcome"
              dict={dict}
              touch={touchDevice}
              low={low}
              onStart={start}
              onPlain={() => setPanel({ kind: "plain" })}
            />
          )}
          {activeProject && (
            <TalkPanel
              key={`${activeProject.slug}-${openSeq.current}`}
              title={activeProject.name}
              badge={activeProject.status}
              color={activeColor}
              lines={projectLines}
              links={activeProject.links}
              dict={dict}
              touch={touchDevice}
              onClose={closeProject}
              onLastLine={() => markVisited(activeProject.slug)}
            />
          )}
          {panel?.kind === "elder" && (
            <TalkPanel
              key={`elder-${openSeq.current}`}
              title={dict.world.elder.title}
              badge={dict.journey.title}
              color={ELDER_COLOR}
              lines={elderLines}
              dict={dict}
              touch={touchDevice}
              onClose={closePanel}
            />
          )}
          {panel?.kind === "library" && (
            <TalkPanel
              key={`library-${openSeq.current}`}
              title={`📚 ${dict.world.personal.libraryTitle}`}
              color="#e0a82f"
              lines={dict.world.personal.libraryLines}
              dict={dict}
              touch={touchDevice}
              onClose={closePanel}
            />
          )}
          {panel?.kind === "skills" && (
            <StatusPanel key="status" dict={dict} onClose={closePanel} />
          )}
          {panel?.kind === "mailbox" && (
            <LinksPanel
              key="mailbox"
              title={`✉ ${dict.world.mailbox.title}`}
              color={MAIL_COLOR}
              intro={dict.contact.text}
              groups={[{ links: contactLinks }]}
              dict={dict}
              touch={touchDevice}
              onClose={closePanel}
            />
          )}
          {panel?.kind === "board" && (
            <LinksPanel
              key="board"
              title={`📌 ${dict.world.board.title}`}
              color="#e0a82f"
              groups={[
                {
                  heading: dict.world.board.news,
                  links: newsItems.map((b) => ({ label: b.title, href: b.href })),
                },
                {
                  heading: dict.world.board.articles,
                  links: guideItems.map((b) => ({ label: b.title, href: b.href })),
                },
                {
                  heading: dict.world.board.more,
                  links: [
                    { label: dict.world.board.training, href: `/${locale}/training` },
                    { label: dict.world.board.allNews, href: newsHref },
                    { label: dict.world.board.allArticles, href: `/${locale}/blog` },
                  ],
                },
              ]}
              dict={dict}
              touch={touchDevice}
              onClose={closePanel}
            />
          )}
          {panel?.kind === "quest" && (
            <LinksPanel
              key="quest"
              title={`${questDone ? "🏆" : "🗺"} ${dict.world.quest.title}`}
              color={questDone ? "#34d399" : "#fbbf24"}
              intro={questDone ? dict.world.quest.done : dict.world.quest.objective}
              groups={[
                {
                  heading: `${dict.world.quest.pill} ${visited.length}/${total}`,
                  checklist: dict.projects.items.map((p) => ({
                    label: p.name,
                    done: visited.includes(p.slug),
                  })),
                },
                ...(questDone
                  ? [
                      {
                        heading: dict.world.quest.reward,
                        links: [
                          ...contactLinks,
                          { label: dict.world.board.training, href: `/${locale}/training` },
                        ],
                      },
                    ]
                  : []),
              ]}
              dict={dict}
              touch={touchDevice}
              onClose={closePanel}
            />
          )}
          {themeFlash && (
            <motion.div
              key="theme-flash"
              className="pointer-events-none absolute inset-0 z-40 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
              transition={{ duration: 0.22, ease: "easeIn" }}
            />
          )}
        </AnimatePresence>

        {/* El pueblo en texto: a petición o si no se puede pintar el 3D */}
        {showPlain && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={dict.world.plain.title}
            className="absolute inset-0 z-50 select-text overflow-y-auto bg-[#0b0d18]"
          >
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-5 pt-5">
              <Link
                href={`/${locale}`}
                className="flex min-h-11 items-center font-mono text-xs uppercase tracking-wider text-white/80 hover:text-white"
              >
                ← {dict.world.exit}
              </Link>
              {!noCanvas && (
                <button
                  type="button"
                  autoFocus
                  onClick={() => setPanel(null)}
                  className="min-h-11 rounded-full bg-accent/15 px-5 text-sm font-semibold text-accent hover:bg-accent/25"
                >
                  {dict.world.plain.back} →
                </button>
              )}
            </div>
            {noCanvas && (
              <p role="status" className="mx-auto mt-4 max-w-3xl px-5 text-sm text-amber-300">
                {dict.world.plain.noWebgl}
              </p>
            )}
            <PlainWorld dict={dict} locale={locale} board={board} />
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
