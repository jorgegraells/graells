// Página para apuntarse a la prueba cerrada de ANTIDOP en Google Play, en castellano e inglés.
// Se publica en /[locale]/antidop/probar. La prueba usa el mismo Grupo de Google que Flypet
// (flypet-probadores): quien se une una vez puede probar las dos apps.

import type { Locale } from "@/i18n/dictionaries";
import { FLYPET_TEST_GROUP_URL } from "@/content/flypet-test";

export const ANTIDOP_TEST_GROUP_URL = FLYPET_TEST_GROUP_URL;
export const ANTIDOP_TEST_OPTIN_URL = "https://play.google.com/apps/testing/com.graells.antidop";
export const ANTIDOP_TEST_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.graells.antidop";

export type AntidopTestStep = {
  title: string;
  text: string;
  cta: string;
  url: string;
};

export type AntidopTestPage = {
  metaTitle: string;
  metaDescription: string;
  tag: string;
  title: string;
  lead: string;
  why: string;
  startCta: string;
  newTab: string;
  needsHeading: string;
  needs: string[];
  stepsHeading: string;
  steps: AntidopTestStep[];
  askHeading: string;
  ask: string[];
  faqHeading: string;
  faq: { q: string; a: string }[];
  thanks: string;
  contactLabel: string;
  backLink: string;
};

export const antidopTest: Record<Locale, AntidopTestPage> = {
  es: {
    metaTitle: "Prueba ANTIDOP antes que nadie",
    metaDescription:
      "Hazte probador de ANTIDOP, la app que bloquea las apps y webs que te roban el tiempo y te da un personaje que crece si resistes. Gratis, en Android, en tres pasos.",
    tag: "PRUEBA CERRADA",
    title: "Prueba ANTIDOP antes que nadie",
    lead: "Eliges qué apps y webs te roban el tiempo. Cuando intentas abrir una, aparece tu personaje con un mensaje que escribiste tú. Si resistes, crece. Todo se queda en tu móvil.",
    why: "Está en prueba cerrada en Google Play. Si tienes un móvil Android, puedes probarla ya y ayudarme a publicarla.",
    startCta: "Empezar",
    newTab: "(se abre en otra pestaña)",
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
        text: "Pulsa «Unirse al grupo». Es el grupo común de mis apps (por eso se llama flypet-probadores): solo sirve para darte acceso a las pruebas. Si ya estás dentro por Flypet, sáltate este paso.",
        cta: "Unirme al grupo",
        url: ANTIDOP_TEST_GROUP_URL,
      },
      {
        title: "Apúntate a la prueba",
        text: "Pulsa «Convertirse en tester». Si dice que no tienes acceso, espera unos minutos tras el paso 1 y vuelve a abrirlo.",
        cta: "Hacerme probador",
        url: ANTIDOP_TEST_OPTIN_URL,
      },
      {
        title: "Descárgala de Google Play",
        text: "Instálala como cualquier otra app y sigue los pasos del principio: te pedirá permisos para poder bloquear. Si Google Play no la encuentra, revisa que estás con la misma cuenta del paso 2.",
        cta: "Abrir en Google Play",
        url: ANTIDOP_TEST_STORE_URL,
      },
    ],
    askHeading: "Lo único que te pido",
    ask: [
      "Úsala de verdad durante dos semanas, con alguna app que te quite tiempo: Google mira que se use.",
      "No te salgas de la prueba ni la desinstales hasta que acabe.",
      "Si ves algo raro, algo que no se entiende o algo que te hace gracia, cuéntamelo.",
    ],
    faqHeading: "Preguntas",
    faq: [
      {
        q: "¿Cuesta algo?",
        a: "No. Es gratis, sin anuncios y sin compras.",
      },
      {
        q: "¿Qué pasa con mi correo?",
        a: "Solo lo veo yo, como dueño del grupo, y solo sirve para que Google te deje entrar en la prueba. Los demás probadores no lo ven. La app no envía ningún dato tuyo fuera del móvil.",
      },
      {
        q: "¿Por qué pide tantos permisos?",
        a: "Para bloquear necesita saber qué app tienes abierta, mostrarse encima y, si quieres bloquear webs, leer la barra de direcciones del navegador. En la página de ANTIDOP se explica cada permiso.",
      },
      {
        q: "¿Y cuando acabe la prueba?",
        a: "Te quedas la app y tu personaje. Las versiones nuevas te llegan por Google Play, como las de cualquier app.",
      },
    ],
    thanks: "¡Mil gracias! Sin probadores no hay personaje.",
    contactLabel: "¿Dudas o fallos? Escríbeme a",
    backLink: "Qué es ANTIDOP",
  },
  en: {
    metaTitle: "Try ANTIDOP before anyone else",
    metaDescription:
      "Become an ANTIDOP tester: the app that blocks the apps and sites that steal your time and gives you a character that grows as you resist. Free, on Android, in three steps.",
    tag: "CLOSED TEST",
    title: "Try ANTIDOP before anyone else",
    lead: "You choose which apps and sites steal your time. When you try to open one, your character shows up with a message you wrote yourself. Resist, and it grows. Everything stays on your phone.",
    why: "It's in closed testing on Google Play. If you have an Android phone, you can try it now and help me publish it.",
    startCta: "Get started",
    newTab: "(opens in a new tab)",
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
        text: "Tap \"Join group\". It's the shared group for my apps (that's why it's called flypet-probadores): it only gives you access to the tests. If you're already in it for Flypet, skip this step.",
        cta: "Join the group",
        url: ANTIDOP_TEST_GROUP_URL,
      },
      {
        title: "Sign up for testing",
        text: "Tap \"Become a tester\". If it says you don't have access, wait a few minutes after step 1 and open it again.",
        cta: "Become a tester",
        url: ANTIDOP_TEST_OPTIN_URL,
      },
      {
        title: "Get it on Google Play",
        text: "Install it like any other app and follow the setup: it will ask for permissions so it can block. If Google Play can't find it, check you're using the same account as in step 2.",
        cta: "Open in Google Play",
        url: ANTIDOP_TEST_STORE_URL,
      },
    ],
    askHeading: "All I ask",
    ask: [
      "Really use it for two weeks, with an app that eats your time: Google checks that it's being used.",
      "Don't leave the test or uninstall it until it's over.",
      "If you see something odd, something unclear or something that makes you laugh, tell me.",
    ],
    faqHeading: "Questions",
    faq: [
      {
        q: "Does it cost anything?",
        a: "No. It's free, with no ads and no purchases.",
      },
      {
        q: "What happens to my email?",
        a: "Only I can see it, as the group owner, and it's only used so Google can let you into the test. Other testers can't see it. The app doesn't send any of your data off your phone.",
      },
      {
        q: "Why does it ask for so many permissions?",
        a: "To block, it needs to know which app is open, show itself on top and, if you want to block websites, read the browser's address bar. The ANTIDOP page explains each permission.",
      },
      {
        q: "And when the test ends?",
        a: "You keep the app and your character. New versions reach you through Google Play, like any other app.",
      },
    ],
    thanks: "Thank you so much! No testers, no character.",
    contactLabel: "Questions or bugs? Write to me at",
    backLink: "About ANTIDOP",
  },
};
