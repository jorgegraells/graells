"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { switchTheme, type Theme } from "./theme";

/** Botón "Claro / Oscuro". Cada modo pinta el suyo y lleva al otro. */
export default function ThemeToggle({
  to,
  dict,
  className,
}: {
  to: Theme;
  dict: Dictionary;
  className?: string;
}) {
  const label = to === "dossier" ? dict.theme.toLight : dict.theme.toDark;
  const aria = to === "dossier" ? dict.theme.toLightLabel : dict.theme.toDarkLabel;
  return (
    <button type="button" onClick={() => switchTheme(to)} aria-label={aria} title={aria} className={className}>
      {label}
    </button>
  );
}
