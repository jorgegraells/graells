// Datos del mundo que también necesita la capa de interfaz. Van aquí, sin nada de
// Three, para que importarlos no meta el motor 3D en la carga inicial de la página.

/** Tema visual del mundo: "voxel" (el pueblo cuadrado) u "overworld" (pastel y
 *  redondeado, aire de RPG japonés). Se alterna con el botón arcade de la plaza. */
export type WorldTheme = "voxel" | "overworld";

export type MoveInput = { x: number; y: number; jump: boolean };

/** Color de tejado y camiseta del aldeano de cada proyecto. */
export const VILLAGE_COLORS = [
  "#0ea5b7",
  "#7c5cd6",
  "#d6558e",
  "#e0912f",
  "#2f9e57",
  "#c94f4f",
];

/** Colores de la plaza: anciano, buzón y tablón. */
export const ELDER_COLOR = "#c9a13b";
export const MAIL_COLOR = "#d6453d";
export const BOARD_COLOR = "#8a5a34";
