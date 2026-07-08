// Variante del holograma para el mundo 3D: recorta el disco proyector que
// viene pintado en la imagen (el pueblo ya tiene su propia peana 3D) y
// desvanece el borde inferior para que el corte no se note.
// Uso: node scripts/holo-head.mjs
import sharp from "sharp";

const SRC = "public/jorge-holo-cut.webp";
const OUT = "public/jorge-holo-head.webp";

const meta = await sharp(SRC).metadata();
const width = meta.width;
const keep = Math.round(meta.height * 0.74); // el disco vive en el ~26% inferior

// Máscara de alpha: opaca arriba, se funde a transparente en el borde de corte
const fade = Buffer.from(
  `<svg width="${width}" height="${keep}">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="#fff" stop-opacity="1"/>
         <stop offset="0.85" stop-color="#fff" stop-opacity="1"/>
         <stop offset="1" stop-color="#fff" stop-opacity="0"/>
       </linearGradient>
     </defs>
     <rect width="100%" height="100%" fill="url(#g)"/>
   </svg>`,
);

await sharp(SRC)
  .extract({ left: 0, top: 0, width, height: keep })
  .composite([{ input: fade, blend: "dest-in" }])
  .webp({ quality: 88 })
  .toFile(OUT);

console.log(`OK ${OUT} (${width}x${keep})`);
