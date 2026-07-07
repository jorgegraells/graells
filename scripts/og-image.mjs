// Genera public/og.jpg (1200x630) para compartir en redes,
// recortando la foto holográfica original (con su fondo de laboratorio).
// Uso: node scripts/og-image.mjs
import sharp from "sharp";

const SRC = new URL("./jorge-holo-src.jpg", import.meta.url).pathname.slice(1);
const OUT = "C:/Users/User/Documents/jorgegraells/public/og.jpg";

await sharp(SRC)
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 82 })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`OK ${meta.width}x${meta.height}`);
