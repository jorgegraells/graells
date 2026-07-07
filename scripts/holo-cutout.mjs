// Recorta la cabeza holográfica de public/jorge-holo.jpg con segmentación
// local (@imgly/background-removal-node) y la guarda como WebP con alfa.
// Uso: node scripts/holo-cutout.mjs
import { removeBackground } from "@imgly/background-removal-node";
import sharp from "sharp";
import { writeFileSync, readFileSync } from "node:fs";

const SRC = new URL("./jorge-holo-src.jpg", import.meta.url).pathname.slice(1);
const OUT = "C:/Users/User/Documents/jorgegraells/public/jorge-holo-cut.webp";

console.log("Segmentando (la primera vez descarga el modelo)...");
const srcBlob = new Blob([readFileSync(SRC)], { type: "image/jpeg" });
const blob = await removeBackground(srcBlob, {
  output: { format: "image/png" },
});
const buf = Buffer.from(await blob.arrayBuffer());

// Recortar el aire transparente y comprimir a WebP
const trimmed = await sharp(buf).trim().resize(900).webp({ quality: 88 }).toBuffer();
writeFileSync(OUT, trimmed);

const meta = await sharp(OUT).metadata();
console.log(`OK ${meta.width}x${meta.height}, ${(trimmed.length / 1024) | 0} KB`);
