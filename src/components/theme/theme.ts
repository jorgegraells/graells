// Dos modos con temática propia: "arcade" (oscuro, jugar) y "dossier" (claro,
// el expediente, leer). El modo vive en <html data-theme> y lo fija antes de
// pintar THEME_SCRIPT; las páginas sin versión expediente siguen en arcade.

export type Theme = "arcade" | "dossier";

const STORAGE_KEY = "jg-theme";

/** Se ejecuta en <head> antes del primer pintado: elección guardada o, si no, la del sistema */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="arcade"&&t!=="dossier"){t=matchMedia("(prefers-color-scheme: light)").matches?"dossier":"arcade"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="arcade"}})()`;

// Secciones equivalentes en los dos modos, para no perder el sitio al cambiar
const ANCHOR_MAP: Record<Theme, Record<string, string>> = {
  dossier: {
    top: "top",
    about: "about",
    skills: "about",
    projects: "projects",
    journey: "journey",
    training: "journey",
    blog: "blog",
    contact: "contact",
  },
  arcade: {
    top: "top",
    about: "about",
    proof: "skills",
    projects: "projects",
    journey: "journey",
    blog: "blog",
    contact: "contact",
  },
};

function currentAnchor(from: Theme): string {
  const tree = document.querySelector(from === "dossier" ? ".theme-dossier" : ".theme-arcade");
  let anchor = "top";
  tree?.querySelectorAll<HTMLElement>("[data-anchor]").forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.4) anchor = el.dataset.anchor ?? anchor;
  });
  return anchor;
}

function scrollToAnchor(to: Theme, anchor: string) {
  const target = ANCHOR_MAP[to][anchor] ?? "top";
  const tree = document.querySelector(to === "dossier" ? ".theme-dossier" : ".theme-arcade");
  const el = target === "top" ? null : tree?.querySelector<HTMLElement>(`[data-anchor="${target}"]`);
  const top = el ? el.getBoundingClientRect().top + window.scrollY - 70 : 0;
  window.scrollTo({ top, behavior: "instant" });
}

/** Cambia de modo con su animación: imprimir el expediente o encender el CRT */
export function switchTheme(next: Theme) {
  const root = document.documentElement;
  const from: Theme = root.dataset.theme === "dossier" ? "dossier" : "arcade";
  if (from === next) return;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {}

  const anchor = currentAnchor(from);
  const apply = () => {
    root.dataset.theme = next;
    scrollToAnchor(next, anchor);
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) {
    apply();
    return;
  }

  const cls = next === "dossier" ? "vt-print" : "vt-crt";
  root.classList.add(cls);
  const transition = document.startViewTransition(apply);
  transition.finished.finally(() => {
    root.classList.remove(cls);
    if (next === "dossier") {
      // El sello cae cuando el folio ya está impreso
      root.classList.add("dx-stamping");
      window.setTimeout(() => root.classList.remove("dx-stamping"), 600);
    }
  });
}
