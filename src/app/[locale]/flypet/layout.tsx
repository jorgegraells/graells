import { Nunito } from "next/font/google";
import "./flypet.css";

// Flypet es "una web dentro de la web", como ANTIDOP: su propia piel (la del juego y su anuncio:
// Nunito gruesa, tinta, crema y ámbar, tarjetas con borde de tinta) y su propia cabecera y pie.
// La piel cuelga de la clase .flypet, que solo lleva la página principal: las subpáginas (probar,
// privacidad, condiciones) siguen con el estilo general hasta que se pasen a esta piel. Por eso este
// envoltorio no pinta nada (display: contents): solo carga la letra y el CSS en estas rutas.

const nunito = Nunito({
  variable: "--font-fp",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export default function FlypetLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`fp-layout ${nunito.variable}`}>{children}</div>;
}
