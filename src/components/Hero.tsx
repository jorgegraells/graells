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
    <section className="synth-sky relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6">
      {/* Rejilla en perspectiva (plataforma proyectora) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[62%] overflow-hidden">
        <div className="synth-grid absolute inset-x-[-50%] bottom-0 top-0" />
      </div>
      {/* Resplandor cian tras el holograma */}
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22)_0%,transparent_65%)]" />
      {/* Líneas de escaneo + viñeta */}
      <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,5,16,0.65)_100%)]" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block rounded-full border border-neon-pink/60 bg-[#0a0618]/85 px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-neon-pink backdrop-blur-sm"
        >
          ★ {dict.hero.playable}
        </motion.p>

        {/* Holograma */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="animate-float-slow relative mt-2 h-[42vh] max-h-[460px] min-h-[280px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/jorge-holo.jpg"
            alt="Jorge Graells en holograma"
            className="holo-mask holo-flicker h-full w-auto object-contain"
          />
        </motion.div>

        {/* Nombre (se integra bajo el haz del proyector) */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="neon-text -mt-4 text-6xl font-black uppercase leading-[0.85] tracking-tight sm:text-7xl md:text-8xl"
        >
          <span className="text-gradient">Jorge Graells</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-4 font-mono text-sm uppercase tracking-[0.25em] text-neon-cyan sm:text-base"
        >
          {dict.hero.role}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-muted"
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

        {/* Botón protagonista */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 200 }}
          className="relative mt-9 flex justify-center"
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
          transition={{ duration: 0.6, delay: 1 }}
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
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-pulse font-mono text-xs uppercase tracking-widest text-white/55"
      >
        {dict.hero.scroll} ↓
      </a>
    </section>
  );
}
