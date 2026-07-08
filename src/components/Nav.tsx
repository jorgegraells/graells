"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

export default function Nav({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const otherLocale: Locale = locale === "es" ? "en" : "es";
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#projects`, label: dict.nav.projects },
    { href: `/${locale}#skills`, label: dict.nav.skills },
    { href: `/${locale}#journey`, label: dict.nav.journey },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass hud-corners clip-corner mx-auto mt-4 flex max-w-5xl items-center justify-between border-neon-cyan/30 px-6 py-3">
        <Link
          href={`/${locale}`}
          onClick={() => setOpen(false)}
          className="font-mono text-sm font-black uppercase tracking-tight"
        >
          <span className="text-gradient">jorge</span>
          <span className="text-muted">graells</span>
          <span className="text-neon-pink">.exe</span>
        </Link>

        {/* Enlaces en escritorio */}
        <div className="hidden items-center gap-6 font-mono text-xs uppercase tracking-wider text-muted sm:flex">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-neon-cyan"
            >
              <span className="text-neon-violet/70">
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${otherLocale}`}
            className="rounded-full border border-neon-pink/40 px-3 py-1 font-mono text-xs font-bold uppercase text-neon-pink transition-colors hover:bg-neon-pink/15"
            aria-label={
              otherLocale === "es" ? "Cambiar a español" : "Switch to English"
            }
          >
            {otherLocale}
          </Link>
          {/* Botón menú (solo móvil) */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menú"
            aria-expanded={open}
            className="grid h-8 w-8 place-items-center rounded-md border border-neon-cyan/40 text-neon-cyan transition-colors hover:bg-neon-cyan/10 sm:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Menú desplegable (solo móvil) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="glass clip-corner mx-auto mt-2 max-w-5xl overflow-hidden border-neon-cyan/30 px-4 py-2 sm:hidden"
          >
            <ul className="divide-y divide-white/10">
              {links.map((link, i) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-2 py-3 font-mono text-sm uppercase tracking-wider text-foreground/85 transition-colors hover:text-neon-cyan"
                  >
                    <span className="text-neon-violet/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
