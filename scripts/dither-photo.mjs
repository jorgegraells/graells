// Retrato del modo expediente: recorta la foto a 4:5, la pasa a grises y la
// trama a 1 bit (Atkinson) con los dos tonos del papel. Sale un PNG de pocos KB.
//   node scripts/dither-photo.mjs [método] [salida]
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("./jorge-dossier-src.jpg", import.meta.url));
const METHOD = process.argv[2] ?? "atkinson";
const OUT = process.argv[3] ?? "public/jorge-expediente.png";
const W = 240;
const H = 300;
const GAMMA = Number(process.env.GAMMA ?? 0.55);
const CONTRAST = Number(process.env.CONTRAST ?? 1.35);
const DARK = [27, 27, 25]; // tóner
const LIGHT = [237, 237, 232]; // folio

const { data } = await sharp(SRC)
  .extract({ left: 640, top: 110, width: 800, height: 1000 }) // cara y hombros, 4:5
  .resize(W, H)
  .grayscale()
  .normalise()
  .sharpen()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Curva de tonos: aclara los medios (la cara está en sombra) y sube el contraste
const px = Float32Array.from(data, (v) => {
  const t = Math.pow(v / 255, GAMMA);
  return Math.min(255, Math.max(0, (t - 0.5) * CONTRAST * 255 + 128));
});
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const out = Buffer.alloc(W * H * 3);
const spread = (x, y, e, w) => {
  if (x >= 0 && x < W && y < H) px[y * W + x] += e * w;
};

for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const v = px[i];
    let on;
    if (METHOD === "bayer") on = v / 255 > (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
    else {
      on = v > 127;
      const e = v - (on ? 255 : 0);
      if (METHOD === "floyd") {
        spread(x + 1, y, e, 7 / 16);
        spread(x - 1, y + 1, e, 3 / 16);
        spread(x, y + 1, e, 5 / 16);
        spread(x + 1, y + 1, e, 1 / 16);
      } else {
        // Atkinson: reparte solo 6/8 del error, más contraste y menos ruido
        for (const [dx, dy] of [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]]) spread(x + dx, y + dy, e, 1 / 8);
      }
    }
    out.set(on ? LIGHT : DARK, i * 3);
  }

await sharp(out, { raw: { width: W, height: H, channels: 3 } })
  .png({ palette: true, colors: 2, compressionLevel: 9 })
  .toFile(OUT);
console.log(OUT);
