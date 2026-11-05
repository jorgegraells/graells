// Página pública de la app Flypet, en castellano e inglés.
// Se publica en /[locale]/flypet. Nada de cifras en euros: las pone Google Play en cada país.
// Cuando la app salga en Google Play, pon la URL en FLYPET_PLAY_URL y aparecerá el enlace.

import type { Locale } from "@/i18n/dictionaries";

export const FLYPET_PLAY_URL: string | null = null;

export const FLYPET_EMAIL = "dev.graells@gmail.com";

export type FlypetShot = { file: string; alt: string };

export type FlypetPage = {
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  intro: string;
  shots: FlypetShot[];
  availabilityHeading: string;
  testing: string;
  playCta: string;
  priceHeading: string;
  price: string;
  makersHeading: string;
  makers: string;
  credits: string;
  privacyHeading: string;
  privacyLink: string;
  contactLabel: string;
};

export const flypetPage: Record<Locale, FlypetPage> = {
  es: {
    metaTitle: "Flypet: mosca con cerebro real para Android",
    metaDescription:
      "Flypet es una mosca de la fruta de mascota para Android. Qué hace en cada momento lo decide una simulación de sus 165.122 neuronas, en tu móvil.",
    tagline: "Esta mosca no tiene guion.",
    intro:
      "Flypet es una app para Android con una mosca de la fruta de mascota. Qué hace en cada momento lo decide una simulación, en tu propio móvil, de las 165.122 neuronas del sistema nervioso de una mosca macho real.",
    shots: [
      {
        file: "porque",
        alt: "La mosca sale volando y una hoja explica qué neuronas lo decidieron: las de la vista y las de despegue.",
      },
      {
        file: "cerebro",
        alt: "Su sistema nervioso en 3D: miles de puntos, uno por neurona, que se iluminan al disparar.",
      },
      {
        file: "comida",
        alt: "La mosca comiendo encima de una uva, con una tarjeta que dice lo madura que está y cuánto le falta para pudrirse.",
      },
      {
        file: "cara",
        alt: "La cara de la mosca de frente: los ojos rojos, las antenas y las patas delanteras, en su sala.",
      },
    ],
    availabilityHeading: "Dónde conseguirla",
    testing:
      "Ahora mismo está en prueba cerrada en Google Play. El enlace aparecerá aquí cuando salga.",
    playCta: "Ver en Google Play",
    priceHeading: "Qué cuesta",
    price:
      "Gratis, sin anuncios. Compras opcionales: Flypet PRO (un solo pago, sin suscripción), el Pack fundador, para quien quiera apoyar el proyecto, y paquetes de Flycoins, la moneda del juego, que también se gana jugando. La placa conmemorativa de fundador, de 2026, es un regalo para quien juegue en los primeros seis meses tras la salida, sin comprar nada.",
    makersHeading: "Quién la hace",
    makers:
      "Flypet lo crea Jorge Graells. El código lo escribe Claude Code, la IA de Anthropic, siguiendo el diseño, las decisiones y las pruebas de Jorge. El cerebro de la mosca es el conectoma real MaleCNS (Janelia, CC-BY).",
    credits:
      "Datos del conectoma: MaleCNS v1.0, Janelia Research Campus (FlyEM) y colaboradores, licencia CC BY 4.0. Janelia no participa en esta app ni la respalda. Anthropic tampoco patrocina ni respalda Flypet.",
    privacyHeading: "Privacidad y contacto",
    privacyLink: "Política de privacidad de Flypet",
    contactLabel: "Contacto:",
  },
  en: {
    metaTitle: "Flypet: a fly with a real brain for Android",
    metaDescription:
      "Flypet is a pet fruit fly for Android. What it does at any moment is decided by a simulation of its 165,122 neurons, running on your phone.",
    tagline: "This fly has no script.",
    intro:
      "Flypet is an Android app with a fruit fly as a pet. What it does at any moment is decided by a simulation, on your own phone, of the 165,122 neurons in the nervous system of a real male fly.",
    shots: [
      {
        file: "porque",
        alt: "The fly takes off and a panel explains which neurons decided it: visual neurons and takeoff neurons.",
      },
      {
        file: "cerebro",
        alt: "Its nervous system in 3D: thousands of dots, one per neuron, lighting up as they fire.",
      },
      {
        file: "comida",
        alt: "The fly eating on top of a grape, with a card showing how ripe it is and how long until it rots.",
      },
      {
        file: "cara",
        alt: "The fly's face head-on: red eyes, antennae and front legs, in its room.",
      },
    ],
    availabilityHeading: "Where to get it",
    testing:
      "It's currently in closed testing on Google Play. The link will appear here when it comes out.",
    playCta: "View on Google Play",
    priceHeading: "What it costs",
    price:
      "Free, with no ads. Optional purchases: Flypet PRO (one payment, no subscription), the Founder pack, for anyone who wants to support the project, and Flycoin packs, the in-game currency, which you also earn by playing. The commemorative 2026 founder plaque is a gift for anyone who plays in the first six months after launch, with nothing to buy.",
    makersHeading: "Who makes it",
    makers:
      "Flypet is created by Jorge Graells. The code is written by Claude Code, Anthropic's AI, following Jorge's design, decisions and testing. The fly's brain is the real MaleCNS connectome (Janelia, CC-BY).",
    credits:
      "Connectome data: MaleCNS v1.0, Janelia Research Campus (FlyEM) and collaborators, CC BY 4.0 licence. Janelia isn't involved in this app and doesn't endorse it. Anthropic doesn't sponsor or endorse Flypet either.",
    privacyHeading: "Privacy and contact",
    privacyLink: "Flypet privacy policy",
    contactLabel: "Contact:",
  },
};
