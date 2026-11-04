// Dos modos con temática propia: "arcade" (oscuro, jugar) y "dossier" (claro,
// el expediente, leer). El modo vive en <html data-theme> y lo fija antes de
// pintar THEME_SCRIPT; las páginas sin versión expediente siguen en arcade.

export type Theme = "arcade" | "dossier";

const STORAGE_KEY = "jg-theme";

/** Se ejecuta en <head> antes del primer pintado: elección guardada o, si no, la del sistema.
 *  En la portada oscura precarga el holograma, que en modo claro no se llega a descargar. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="arcade"&&t!=="dossier"){t=matchMedia("(prefers-color-scheme: light)").matches?"dossier":"arcade"}document.documentElement.dataset.theme=t;if(t==="arcade"&&/^\\/(es|en)\\/?$/.test(location.pathname)){var l=document.createElement("link");l.rel="preload";l.as="image";l.href="/jorge-holo-hero.webp";l.fetchPriority="high";document.head.appendChild(l)}}catch(e){document.documentElement.dataset.theme="arcade"}})()`;

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
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) {
    root.dataset.theme = next;
    scrollToAnchor(next, anchor);
    return;
  }

  // Al expediente, un cabezal de luz recorre la pantalla mientras "imprime".
  // Solo existe en el estado nuevo: la transición lo anima con su propio nombre.
  let head: HTMLDivElement | null = null;
  const apply = () => {
    root.dataset.theme = next;
    scrollToAnchor(next, anchor);
    if (next === "dossier") {
      head = document.createElement("div");
      head.className = "vt-head";
      head.setAttribute("aria-hidden", "true");
      document.body.appendChild(head);
    }
  };

  const cls = next === "dossier" ? "vt-print" : "vt-crt";
  root.classList.add(cls);
  const transition = document.startViewTransition(apply);
  transition.finished.finally(() => {
    head?.remove();
    root.classList.remove(cls);
    if (next === "dossier") {
      // El sello cae cuando el folio ya está impreso, y el papel acusa el golpe
      root.classList.add("dx-stamping");
      window.setTimeout(() => root.classList.remove("dx-stamping"), 700);
    }
  });
}
