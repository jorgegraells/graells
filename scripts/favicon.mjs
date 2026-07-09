// Genera el icono de marca "JG" (blanco sobre negro) en los tres formatos que
// usa Next 16 por convención de archivos en src/app/:
//   - icon.svg        -> pestaña del navegador (nítido y escalable)
//   - favicon.ico     -> navegadores antiguos y resultados de Google (16/32/48)
//   - apple-icon.png  -> pantalla de inicio en iOS (180x180)
// Uso: node scripts/favicon.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const BG = "#000000";
const FG = "#ffffff";

/** SVG del icono. `rounded` para la pestaña/ico; cuadrado a sangre para Apple. */
function svg({ rounded }) {
  const bg = rounded
    ? `<rect width="64" height="64" rx="13" ry="13" fill="${BG}"/>`
    : `<rect width="64" height="64" fill="${BG}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  ${bg}
  <text x="32" y="45" text-anchor="middle" fill="${FG}"
    font-family="Arial, Helvetica, sans-serif" font-size="33" font-weight="800"
    letter-spacing="-1">JG</text>
</svg>`;
}

/** Empaqueta varios PNG en un único .ico (formato Vista: PNG embebido). */
function pngsToIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = 6 + count * 16;
  const entries = [];
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const roundedSvg = Buffer.from(svg({ rounded: true }));
const squareSvg = Buffer.from(svg({ rounded: false }));

// 1) icon.svg (pestaña)
await writeFile("src/app/icon.svg", svg({ rounded: true }));

// 2) favicon.ico (16, 32, 48 embebidos como PNG)
const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map(async (size) => ({
    size,
    data: await sharp(roundedSvg).resize(size, size).png().toBuffer(),
  })),
);
await writeFile("src/app/favicon.ico", pngsToIco(pngs));

// 3) apple-icon.png (cuadrado a sangre, iOS redondea las esquinas)
await sharp(squareSvg).resize(180, 180).png().toFile("src/app/apple-icon.png");

console.log("OK: icon.svg, favicon.ico (16/32/48), apple-icon.png");
