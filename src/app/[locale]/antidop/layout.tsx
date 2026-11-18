import { DotGothic16, Montserrat } from "next/font/google";
import "./antidop.css";

// ANTIDOP es "una web dentro de la web": su propia piel (la de la app, en píxeles) y su propia
// cabecera y pie, sin la navegación del portfolio. Las fuentes se cargan solo en estas rutas.

const pixel = DotGothic16({
  variable: "--font-ad-pixel",
  subsets: ["latin"],
  weight: "400",
  // next/font no tiene métricas de DotGothic16 para generar el fallback
  adjustFontFallback: false,
});

const body = Montserrat({
  variable: "--font-ad-body",
  subsets: ["latin"],
});

export default function AntidopLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`antidop ${pixel.variable} ${body.variable}`}>{children}</div>;
}
