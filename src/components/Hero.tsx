"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

export default function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="synth-sky relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Sol synthwave */}
      <div className="animate-float-slow pointer-events-none absolute left-1/2 top-[26%] h-64 w-64 -translate-x-1/2 sm:h-80 sm:w-80">
        <div className="synth-sun relative h-full w-full rounded-full" />
      </div>

      {/* Rejilla en perspectiva (suelo outrun) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[60%] overflow-hidden">
        <div className="synth-grid absolute inset-x-[-50%] bottom-0 top-0" />
      </div>

      {/* Líneas de escaneo + viñeta */}
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(7,5,16,0.7)_100%)]" />

      {/* Contenido HUD */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6">
        <div className="hud-corners relative px-4 py-2 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto inline-block rounded-full border border-neon-pink/60 bg-[#0a0618]/85 px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-neon-pink backdrop-blur-sm"
          >
            ★ {dict.hero.playable}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="neon-text mt-5 text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl md:text-8xl"
          >
            <span className="text-gradient">Jorge</span>
            <br />
            <span className="text-gradient">Graells</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 font-mono text-sm uppercase tracking-[0.25em] text-neon-cyan sm:text-base"
          >
            {dict.hero.role}
          </motion.p>

          {/* Tira de stats tipo HUD */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-muted"
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
          </motion.div>
        </div>

        {/* Botón protagonista */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.65, type: "spring", stiffness: 200 }}
          className="relative mt-10 flex justify-center"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-6 flex items-center justify-center gap-5 font-mono text-xs uppercase tracking-widest text-white/55"
        >
          <a href="#projects" className="transition-colors hover:text-neon-cyan">
            {dict.hero.ctaProjects}
          </a>
          <span className="text-white/25">·</span>
          <a href="#contact" className="transition-colors hover:text-neon-cyan">
            {dict.hero.ctaContact}
          </a>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-pulse font-mono text-xs uppercase tracking-widest text-white/55"
      >
        {dict.hero.scroll} ↓
      </a>
    </section>
  );
}
