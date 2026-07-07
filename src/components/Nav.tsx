"use client";

import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

export default function Nav({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const otherLocale: Locale = locale === "es" ? "en" : "es";

  const links = [
    { href: "#about", label: dict.nav.about },
    { href: "#projects", label: dict.nav.projects },
    { href: "#skills", label: dict.nav.skills },
    { href: "#journey", label: dict.nav.journey },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass hud-corners clip-corner mx-auto mt-4 flex max-w-5xl items-center justify-between border-neon-cyan/30 px-6 py-3">
        <Link
          href={`/${locale}`}
          className="font-mono text-sm font-black uppercase tracking-tight"
        >
          <span className="text-gradient">jorge</span>
          <span className="text-muted">graells</span>
          <span className="text-neon-pink">.exe</span>
        </Link>
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
        <Link
          href={`/${otherLocale}`}
          className="rounded-full border border-neon-pink/40 px-3 py-1 font-mono text-xs font-bold uppercase text-neon-pink transition-colors hover:bg-neon-pink/15"
          aria-label={otherLocale === "es" ? "Cambiar a español" : "Switch to English"}
        >
          {otherLocale}
        </Link>
      </nav>
    </header>
  );
}
