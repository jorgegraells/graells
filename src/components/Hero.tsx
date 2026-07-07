"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

const TitleDiorama = dynamic(() => import("@/components/scene/TitleDiorama"), {
  ssr: false,
});

export default function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Cielo de atardecer (degradado) que enlaza con las secciones oscuras */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#070812_0%,#141539_38%,#2a2154_66%,#3a2a63_82%,#0a0a14_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,180,120,0.18)_0%,transparent_55%)]" />

      {/* Diorama voxel giratorio */}
      <div className="absolute inset-x-0 top-[6%] bottom-0">
        <TitleDiorama />
      </div>

      {/* Viñeta inferior para asentar el texto y fundir con la sección siguiente */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(6,7,14,0.55)_78%,#05060a_100%)]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.3em] text-accent backdrop-blur-sm"
        >
          ▸ {dict.hero.playable}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-5 text-6xl font-black tracking-tight drop-shadow-[0_6px_30px_rgba(0,0,0,0.5)] sm:text-7xl md:text-8xl"
        >
          <span className="text-gradient">{dict.hero.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-lg font-semibold text-white/90 sm:text-2xl"
        >
          {dict.hero.role}
        </motion.p>

        {/* Botón protagonista: entrar al mundo */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 200 }}
          className="relative mt-10"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
          <Link
            href={`/${locale}/world`}
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-9 py-4 text-base font-bold text-[#05060a] shadow-[0_10px_40px_-8px_rgba(139,92,246,0.8)] transition-transform hover:scale-[1.04]"
          >
            <span className="text-xl">▶</span>
            {dict.hero.ctaWorld}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        {/* Acceso secundario al CV clásico */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-6 flex items-center gap-5 font-mono text-xs uppercase tracking-widest text-white/60"
        >
          <a href="#projects" className="transition-colors hover:text-white">
            {dict.hero.ctaProjects}
          </a>
          <span className="text-white/25">·</span>
          <a href="#contact" className="transition-colors hover:text-white">
            {dict.hero.ctaContact}
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-pulse font-mono text-xs uppercase tracking-widest text-white/60"
      >
        {dict.hero.scroll} ↓
      </motion.a>
    </section>
  );
}
