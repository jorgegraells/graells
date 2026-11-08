// Página para apuntarse a la prueba cerrada de Flypet en Google Play, en castellano e inglés.
// Se publica en /[locale]/flypet/probar. Google pide 12 probadores durante 14 días antes de dejar
// publicar la app: esta página es el enlace que se comparte para conseguirlos. La prueba usa el
// Grupo de Google flypet-probadores; si cambia, se cambia FLYPET_TEST_GROUP_URL.

import type { Locale } from "@/i18n/dictionaries";

export const FLYPET_TEST_GROUP_URL = "https://groups.google.com/g/flypet-probadores";
export const FLYPET_TEST_OPTIN_URL = "https://play.google.com/apps/testing/com.jorgegraells.flypet";
export const FLYPET_TEST_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.jorgegraells.flypet";

export type FlypetTestStep = {
  title: string;
  text: string;
  cta: string;
  url: string;
};

export type FlypetTestPage = {
  metaTitle: string;
  metaDescription: string;
  tag: string;
  title: string;
  lead: string;
  why: string;
  startCta: string;
  newTab: string;
  reward: {
    tag: string;
    heading: string;
    text: string;
    note: string;
    flyAlt: string;
    plaqueAlt: string;
  };
  needsHeading: string;
  needs: string[];
  stepsHeading: string;
  steps: FlypetTestStep[];
  askHeading: string;
  ask: string[];
  faqHeading: string;
  faq: { q: string; a: string }[];
  thanks: string;
  contactLabel: string;
  backLink: string;
};

export const flypetTest: Record<Locale, FlypetTestPage> = {
  es: {
    metaTitle: "Prueba Flypet antes que nadie",
    metaDescription:
      "Hazte probador de Flypet, la mosca virtual con el cerebro de una mosca real. Gratis, en Android, en tres pasos.",
    tag: "PRUEBA CERRADA",
    title: "Prueba Flypet antes que nadie",
    lead: "Una mosca de mascota con el cableado de una mosca macho real: 165.122 neuronas simuladas en tu móvil mientras la miras. Le acercas el dedo y huye. Le das fruta y saca la trompa para comer. Se limpia las patas y las alas. Lo decide ese cerebro, no un guion.",
    why: "Para que Google me deje publicarla necesito 12 personas que la prueben durante 14 días. Si tienes un móvil Android, me ayudas mucho.",
    startCta: "Empezar",
    newTab: "(se abre en otra pestaña)",
    reward: {
      tag: "SOLO PARA PROBADORES",
      heading: "Llévate algo que nadie más tendrá",
      text: "Abre Flypet 7 días seguidos antes de que salga para todos y te llevas la Prototipo, una mosca dibujada como un plano azul, y su placa grabada «Probó Flypet antes que nadie» para colgarla en tu sala. Cuando la app salga, ya no se podrá conseguir.",
      note: "Basta con abrirla una vez al día. Si te saltas uno, la cuenta vuelve a empezar.",
      flyAlt: "La mosca Prototipo, azul con líneas blancas de plano, ojos blancos y patas azules finas, de tres cuartos en el suelo de la sala.",
      plaqueAlt: "Placa de madera con una chapa azul, una estrella dorada y el texto «Probó Flypet antes que nadie · 2026».",
    },
    needsHeading: "Qué necesitas",
    needs: [
      "Un móvil o tableta Android (en iPhone no se puede).",
      "La misma cuenta de Google en los tres pasos: la que usas en Google Play. Si abres los enlaces desde WhatsApp y no sale tu cuenta, ábrelos en Chrome.",
      "Dos minutos.",
    ],
    stepsHeading: "Tres pasos",
    steps: [
      {
        title: "Únete al grupo de probadores",
        text: "Pulsa «Unirse al grupo». El grupo solo sirve para darte acceso a la prueba.",
        cta: "Unirme al grupo",
        url: FLYPET_TEST_GROUP_URL,
      },
      {
        title: "Apúntate a la prueba",
        text: "Pulsa «Convertirse en tester». Si dice que no tienes acceso, espera unos minutos tras el paso 1 y vuelve a abrirlo.",
        cta: "Hacerme probador",
        url: FLYPET_TEST_OPTIN_URL,
      },
      {
        title: "Descárgala de Google Play",
        text: "Instálala como cualquier otra app. Si Google Play no la encuentra, revisa que estás con la misma cuenta del paso 2.",
        cta: "Abrir en Google Play",
        url: FLYPET_TEST_STORE_URL,
      },
    ],
    askHeading: "Lo único que te pido",
    ask: [
      "Ábrela un rato cada pocos días durante dos semanas: Google mira que de verdad se use. Y si la abres 7 días seguidos, te llevas el premio de arriba.",
      "No te salgas de la prueba ni la desinstales hasta que acabe.",
      "Si ves algo raro, algo que no se entiende o algo que te hace gracia, cuéntamelo.",
    ],
    faqHeading: "Preguntas",
    faq: [
      {
        q: "¿Cuesta algo?",
        a: "No. Es gratis y sin anuncios. Tiene compras opcionales que no hacen falta para probarla; si compras algo, es un pago de verdad, como en cualquier app.",
      },
      {
        q: "¿Qué pasa con mi correo?",
        a: "Solo lo veo yo, como dueño del grupo, y solo sirve para que Google te deje entrar en la prueba. Los demás probadores no lo ven. La app no recoge datos tuyos.",
      },
      {
        q: "¿Y cuando acabe la prueba?",
        a: "Te quedas la app y tu mosca. Las versiones nuevas te llegan por Google Play, como las de cualquier app.",
      },
    ],
    thanks: "¡Mil gracias! Sin probadores no hay mosca.",
    contactLabel: "¿Dudas o fallos? Escríbeme a",
    backLink: "Qué es Flypet",
  },
  en: {
    metaTitle: "Try Flypet before anyone else",
    metaDescription:
      "Become a Flypet tester: the virtual fly with a real fly's brain. Free, on Android, in three steps.",
    tag: "CLOSED TEST",
    title: "Try Flypet before anyone else",
    lead: "A pet fly wired like a real male fly: 165,122 neurons simulated on your phone while you watch. Bring your finger close and it bolts. Give it fruit and it sticks out its proboscis to eat. It cleans its legs and wings. That brain makes the call, not a script.",
    why: "Before Google lets me publish it, I need 12 people to test it for 14 days. If you have an Android phone, you'd be a huge help.",
    startCta: "Get started",
    newTab: "(opens in a new tab)",
    reward: {
      tag: "TESTERS ONLY",
      heading: "Get something no one else will have",
      text: "Open Flypet 7 days in a row before it's out for everyone and you'll get the Prototype, a fly drawn like a blue blueprint, plus its engraved plaque, \"Tested Flypet before anyone else\", to hang in your room. Once the app launches, it can't be earned anymore.",
      note: "Opening it once a day is enough. Miss a day and the count starts over.",
      flyAlt: "The Prototype fly, blue with white blueprint lines, white eyes and thin blue legs, in three-quarter view on the floor of the room.",
      plaqueAlt: "Wooden plaque with a blue plate, a gold star and the text \"Tested Flypet before anyone else · 2026\".",
    },
    needsHeading: "What you need",
    needs: [
      "An Android phone or tablet (it doesn't work on iPhone).",
      "The same Google account in all three steps: the one you use on Google Play. If you open the links from WhatsApp and your account doesn't show up, open them in Chrome.",
      "Two minutes.",
    ],
    stepsHeading: "Three steps",
    steps: [
      {
        title: "Join the testers group",
        text: "Tap \"Join group\". The group only gives you access to the test.",
        cta: "Join the group",
        url: FLYPET_TEST_GROUP_URL,
      },
      {
        title: "Sign up for testing",
        text: "Tap \"Become a tester\". If it says you don't have access, wait a few minutes after step 1 and open it again.",
        cta: "Become a tester",
        url: FLYPET_TEST_OPTIN_URL,
      },
      {
        title: "Get it on Google Play",
        text: "Install it like any other app. If Google Play can't find it, check you're using the same account as in step 2.",
        cta: "Open in Google Play",
        url: FLYPET_TEST_STORE_URL,
      },
    ],
    askHeading: "All I ask",
    ask: [
      "Open it for a while every few days for two weeks: Google checks that it's really being used. Open it 7 days in a row and the reward above is yours.",
      "Don't leave the test or uninstall it until it's over.",
      "If you see something odd, something unclear or something that makes you laugh, tell me.",
    ],
    faqHeading: "Questions",
    faq: [
      {
        q: "Does it cost anything?",
        a: "No. It's free with no ads. It has optional purchases you don't need to test it; if you buy something, it's a real payment, like in any app.",
      },
      {
        q: "What happens to my email?",
        a: "Only I can see it, as the group owner, and it's only used so Google can let you into the test. Other testers can't see it. The app doesn't collect your data.",
      },
      {
        q: "And when the test ends?",
        a: "You keep the app and your fly. New versions reach you through Google Play, like any other app.",
      },
    ],
    thanks: "Thank you so much! No testers, no fly.",
    contactLabel: "Questions or bugs? Write to me at",
    backLink: "About Flypet",
  },
};
