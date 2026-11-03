"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { switchTheme, type Theme } from "./theme";

/** Botón "Leer / Jugar". Cada modo pinta el suyo y lleva al otro. */
export default function ThemeToggle({
  to,
  dict,
  className,
}: {
  to: Theme;
  dict: Dictionary;
  className?: string;
}) {
  const label = to === "dossier" ? dict.theme.toRead : dict.theme.toPlay;
  const aria = to === "dossier" ? dict.theme.toReadLabel : dict.theme.toPlayLabel;
  return (
    <button type="button" onClick={() => switchTheme(to)} aria-label={aria} title={aria} className={className}>
      {label}
    </button>
  );
}
