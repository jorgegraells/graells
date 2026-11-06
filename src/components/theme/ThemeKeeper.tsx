"use client";

import { useLayoutEffect } from "react";
import { applyStoredTheme } from "./theme";

/** Cambiar de idioma recrea <html> sin recargar la página: THEME_SCRIPT no vuelve
 *  a ejecutarse y se perdería data-theme. Lo repone antes de pintar. */
export default function ThemeKeeper() {
  useLayoutEffect(applyStoredTheme, []);
  return null;
}
