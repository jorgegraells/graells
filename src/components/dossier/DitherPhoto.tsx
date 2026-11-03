"use client";

import { useEffect, useRef } from "react";

// Una red neuronal dibujada en canvas y tramada a 1 bit (Bayer 4x4): la misma
// idea que el hero 3D del modo oscuro, a una fracción del coste de calcularla.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const LAYERS = [4, 6, 6, 3];

export default function DitherPhoto({ alt }: { alt: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const g = canvas?.getContext("2d");
    if (!canvas || !g) return;
    const { width: w, height: h } = canvas;

    const grd = g.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, "#d8d8d8");
    grd.addColorStop(1, "#6a6a6a");
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);

    const nodes = LAYERS.map((n, li) => {
      const x = 16 + li * ((w - 32) / (LAYERS.length - 1));
      return Array.from({ length: n }, (_, k) => [x + Math.sin(k * 1.7 + li) * 3, 18 + (k + 0.5) * ((h - 36) / n)]);
    });
    g.strokeStyle = "rgba(20,20,20,.55)";
    g.lineWidth = 0.7;
    for (let li = 0; li < nodes.length - 1; li++)
      for (const a of nodes[li])
        for (const b of nodes[li + 1]) {
          g.beginPath();
          g.moveTo(a[0], a[1]);
          g.lineTo(b[0], b[1]);
          g.stroke();
        }
    for (const col of nodes)
      for (const [x, y] of col) {
        const rg = g.createRadialGradient(x - 2, y - 2, 1, x, y, 8);
        rg.addColorStop(0, "#ffffff");
        rg.addColorStop(0.6, "#9a9a9a");
        rg.addColorStop(1, "#202020");
        g.fillStyle = rg;
        g.beginPath();
        g.arc(x, y, 7, 0, Math.PI * 2);
        g.fill();
      }

    const img = g.getImageData(0, 0, w, h);
    const d = img.data;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const lum = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255;
        const on = lum > (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
        d[i] = d[i + 1] = on ? 237 : 27;
        d[i + 2] = on ? 232 : 25;
        d[i + 3] = 255;
      }
    g.putImageData(img, 0, 0);
  }, []);

  return <canvas ref={ref} width={120} height={150} role="img" aria-label={alt} />;
}
