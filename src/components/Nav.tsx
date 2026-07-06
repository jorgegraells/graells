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
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="glass mx-auto mt-4 flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
        <Link
          href={`/${locale}`}
          className="font-mono text-sm font-semibold tracking-tight"
        >
          <span className="text-gradient">jorge</span>
          <span className="text-muted">graells.com</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
        <Link
          href={`/${otherLocale}`}
          className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs uppercase text-muted transition-colors hover:border-accent/50 hover:text-accent"
          aria-label={otherLocale === "es" ? "Cambiar a español" : "Switch to English"}
        >
          {otherLocale}
        </Link>
      </nav>
    </header>
  );
}
