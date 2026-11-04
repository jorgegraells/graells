"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

const MOTES = [
  { x: -30, d: 0 },
  { x: -12, d: 0.8 },
  { x: 0, d: 1.6 },
  { x: 14, d: 0.4 },
  { x: 32, d: 2.1 },
  { x: -22, d: 2.8 },
  { x: 22, d: 3.4 },
  { x: 6, d: 1.1 },
];

export default function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const holoRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = holoRef.current;
    if (!el) return;
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    el.style.transform = `translate3d(${dx * 20}px, ${dy * 14}px, 0) rotateY(${dx * 9}deg) rotateX(${-dy * 8}deg)`;
  };
  const onLeave = () => {
    if (holoRef.current) holoRef.current.style.transform = "";
  };

  return (
    <section
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="synth-sky relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6"
      style={{ perspective: "900px" }}
    >
      {/* Rejilla en perspectiva (plataforma proyectora) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[62%] overflow-hidden">
        <div className="synth-grid absolute inset-x-[-50%] bottom-0 top-0" />
      </div>
      {/* Resplandor cian que respira tras el holograma */}
      <div className="animate-glow-breathe pointer-events-none absolute left-1/2 top-[38%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.24)_0%,transparent_65%)]" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,5,16,0.65)_100%)]" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <p
          className="hero-in [--hero-delay:0.1s] [--hero-dur:0.5s] [--hero-y:10px] inline-block rounded-full border border-neon-pink/60 bg-[#0a0618]/85 px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-neon-pink backdrop-blur-sm"
        >
          ★ {dict.hero.playable}
        </p>

        {/* Holograma vivo */}
        <div
          ref={holoRef}
          className="hero-in [--hero-delay:0.2s] [--hero-dur:0.9s] [--hero-scale:0.9] relative mt-2 h-[42vh] max-h-[460px] min-h-[280px]"
          style={{ transition: "transform 0.16s ease-out" }}
        >
          <div className="animate-float-slow relative mx-auto h-full w-fit">
            <div className="holo-idle relative h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* lazy: en modo claro está oculta y así no se descarga. En oscuro la
                  precarga THEME_SCRIPT, de modo que no llega tarde */}
              <img
                src="/jorge-holo-hero.webp"
                width={698}
                height={800}
                loading="lazy"
                alt="Jorge Graells en holograma"
                className="holo-live holo-flicker h-full w-auto object-contain"
              />
              {/* Efectos ceñidos a la silueta (la imagen hace de máscara) */}
              <div className="holo-sil pointer-events-none absolute inset-0">
                <div className="holo-scanline" />
              </div>
              {/* Motas ascendentes desde la base */}
              {MOTES.map((m, i) => (
                <span
                  key={i}
                  className="holo-mote"
                  style={{
                    left: `calc(50% + ${m.x}px)`,
                    bottom: "12%",
                    animationDelay: `${m.d}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Nombre */}
        <h1
          className="hero-in [--hero-delay:0.45s] [--hero-y:16px] neon-text -mt-4 text-6xl font-black uppercase leading-[0.85] tracking-tight sm:text-7xl md:text-8xl"
        >
          <span className="text-gradient">Jorge Graells</span>
        </h1>

        <p
          className="hero-in [--hero-delay:0.55s] [--hero-y:12px] mt-4 font-mono text-sm uppercase tracking-[0.25em] text-neon-cyan sm:text-base"
        >
          {dict.hero.role}
        </p>

        <div
          className="hero-in [--hero-delay:0.65s] mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-muted"
        >
          <span>
            <span className="text-neon-lime">8</span> años XP
          </span>
          <span className="text-white/20">/</span>
          <span>
            <span className="text-neon-lime">5</span> proyectos
          </span>
          <span className="text-white/20">/</span>
          <span>
            IA · <span className="text-neon-lime">Full-Stack</span> · Cyber
          </span>
        </div>

        {/* Botón protagonista */}
        <div
          className="hero-in [--hero-delay:0.8s] [--hero-y:18px] [--hero-scale:0.96] relative mt-9 flex justify-center"
        >
          <span className="absolute inset-0 mx-auto h-full w-[min(90%,26rem)] animate-ping rounded-full bg-neon-violet/20" />
          <Link
            href={`/${locale}/world`}
            className="btn-neon clip-corner group relative inline-flex items-center gap-3 px-9 py-4 text-base font-black uppercase tracking-wide transition-transform hover:scale-[1.04]"
          >
            <span className="text-xl">▶</span>
            {dict.hero.ctaWorld}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div
          className="hero-in [--hero-delay:1s] mt-6 flex items-center justify-center gap-5 font-mono text-xs uppercase tracking-widest text-white/55"
        >
          <a href="#projects" className="transition-colors hover:text-neon-cyan">
            {dict.hero.ctaProjects}
          </a>
          <span className="text-white/25">·</span>
          <a href="#contact" className="transition-colors hover:text-neon-cyan">
            {dict.hero.ctaContact}
          </a>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-pulse font-mono text-xs uppercase tracking-widest text-white/55"
      >
        {dict.hero.scroll} ↓
      </a>
    </section>
  );
}
