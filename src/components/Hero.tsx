"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

const NeuralScene = dynamic(() => import("@/components/scene/NeuralScene"), {
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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <NeuralScene />
      </div>
      {/* Viñeta radial para que el texto respire sobre la escena */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,6,10,0.7)_75%,rgba(5,6,10,0.95)_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-mono text-sm uppercase tracking-[0.3em] text-accent"
        >
          {dict.hero.greeting}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-4 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl"
        >
          <span className="text-gradient">{dict.hero.name}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-xl font-medium text-foreground/90 sm:text-2xl"
        >
          {dict.hero.role}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mx-auto mt-4 max-w-xl text-balance text-muted"
        >
          {dict.hero.tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="glow-ring rounded-full bg-accent/10 px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
          >
            {dict.hero.ctaProjects}
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:border-white/40 hover:text-foreground"
          >
            {dict.hero.ctaContact}
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-6"
        >
          <Link
            href={`/${locale}/world`}
            className="group inline-flex items-center gap-3 rounded-full border border-accent-2/40 bg-accent-2/10 px-7 py-3.5 text-sm font-semibold text-foreground shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-all hover:border-accent-2/70 hover:bg-accent-2/20 hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.8)]"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            {dict.hero.ctaWorld}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse font-mono text-xs uppercase tracking-widest text-muted"
      >
        {dict.hero.scroll} ↓
      </motion.p>
    </section>
  );
}
