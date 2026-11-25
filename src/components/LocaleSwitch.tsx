"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/dictionaries";

/** Lleva a la misma página en el otro idioma. Toma la dirección del
 *  <link rel="alternate" hreflang> que ya declara cada página para SEO, así
 *  que sirve en todas (artículos, temas, sobre mí...) sin mapear rutas a mano.
 *  Si una página no lo tiene, usa `fallback` (la portada del otro idioma). */
export default function LocaleSwitch({
  to,
  fallback,
  className,
  ariaLabel,
  children,
}: {
  to: Locale;
  fallback: string;
  className?: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [href, setHref] = useState(fallback);

  useEffect(() => {
    // Tras una navegación interna, Next actualiza el <head> justo después
    const read = () => {
      const link = document.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${to}"]`,
      );
      if (!link) return setHref(fallback);
      const url = new URL(link.href, window.location.origin);
      setHref(url.pathname + url.search);
    };
    read();
    const id = window.setTimeout(read, 300);
    return () => window.clearTimeout(id);
  }, [pathname, to, fallback]);

  return (
    <Link href={href} className={className} aria-label={ariaLabel} hrefLang={to}>
      {children}
    </Link>
  );
}
