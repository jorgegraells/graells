// Política de privacidad de la app Flypet (Android), en castellano e inglés.
// Se publica en /[locale]/flypet/privacidad y es el enlace que piden Google Play y la propia app.
// Si la app cambia lo que hace con los datos, se cambia aquí antes de publicar la versión.

import type { Locale } from "@/i18n/dictionaries";

export type PrivacySection = { heading: string; paragraphs: string[] };

export type PrivacyPolicy = {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
  contact: string;
};

export const flypetPrivacy: Record<Locale, PrivacyPolicy> = {
  es: {
    title: "Política de privacidad de Flypet",
    description:
      "Qué datos usa Flypet, la mosca virtual con el cerebro de una mosca real: ninguno sale de tu móvil.",
    updated: "Última actualización: 22 de octubre de 2026",
    intro:
      "Flypet es una app de Jorge Graells Garcia, desarrollador independiente con residencia en España. Esta página explica qué datos usa la app. En corto: Flypet no recoge datos tuyos. Todo lo que pasa en el juego se queda en tu móvil.",
    sections: [
      {
        heading: "Lo que no hay",
        paragraphs: [
          "No hay cuentas ni registro: no te pedimos nombre, correo ni edad.",
          "No hay analítica, seguimiento ni identificadores publicitarios.",
          "No enviamos nada a ningún servidor nuestro: no tenemos servidor.",
        ],
      },
      {
        heading: "Tu partida",
        paragraphs: [
          "La mosca, su sala, tus Flycoins y tus ajustes se guardan en el almacenamiento de la app, en tu móvil, y no salen de él. Si desinstalas la app o borras sus datos, la partida se borra y no la podemos recuperar. Lo que compras con dinero (PRO y el Pack fundador) sí lo puedes recuperar con «Restaurar compras», porque lo guarda Google Play.",
        ],
      },
      {
        heading: "El micrófono",
        paragraphs: [
          "Flypet usa el micrófono solo para saber si estás soplando a la mosca (el botón Soplar): mide lo fuerte que suena el aire en los graves. Ese análisis se hace en tu móvil, en el momento: no se graba audio, no se guarda y no se envía a nadie.",
          "Puedes negar el permiso o quitarlo cuando quieras en los ajustes de Android. Todo lo demás sigue funcionando.",
        ],
      },
      {
        heading: "Tus fotos como pósters (Flypet PRO)",
        paragraphs: [
          "Cuando esté disponible: si eliges una foto para colgarla en la sala, la app copia esa foto, reducida, a su propia carpeta en tu móvil. No sale de él y se borra si quitas el póster o desinstalas la app. La app no tiene acceso al resto de tus fotos, solo a la que eliges.",
        ],
      },
      {
        heading: "Pósters con enlace",
        paragraphs: [
          "Algunos pósters de la sala llevan un enlace. Si tocas uno, se abre esa web en tu navegador. Esa web no forma parte de Flypet y tiene su propia política de privacidad.",
        ],
      },
      {
        heading: "Compras",
        paragraphs: [
          "Las compras (PRO, Pack fundador y paquetes de Flycoins) las hace y las cobra Google Play con su propio sistema. Nosotros no vemos tu tarjeta ni tus datos de pago: Google nos dice qué producto se ha comprado para dártelo en el juego, y la app lo guarda en tu móvil. Lo que Google hace con tus datos lo explica su política de privacidad: https://policies.google.com/privacy",
          "Si un menor usa una cuenta supervisada con Family Link, las compras pueden quedar pendientes hasta que un adulto las apruebe. Mientras tanto, la app no entrega nada.",
        ],
      },
      {
        heading: "Vibración",
        paragraphs: [
          "La app hace vibrar el móvil un momento al tocar la mosca y en algunas acciones. Se puede apagar en el menú. No usa ningún dato.",
        ],
      },
      {
        heading: "Niños",
        paragraphs: [
          "Flypet está pensada para todas las edades. Como no recogemos datos de nadie, tampoco de niños. Si crees que algo de esta política no se cumple, escríbenos y lo miramos.",
        ],
      },
      {
        heading: "Ciencia y créditos",
        paragraphs: [
          "El cerebro de la mosca se simula con el conectoma MaleCNS (Janelia, licencia CC-BY 4.0). Son datos de una mosca, no de personas. Janelia no participa en la app ni la respalda.",
        ],
      },
      {
        heading: "Seguridad y conservación",
        paragraphs: [
          "Como los datos no salen del móvil, quedan protegidos por la seguridad de tu propio dispositivo. Se conservan mientras tengas la app instalada y se borran al desinstalarla. Nosotros no guardamos nada, así que no hay nada que tengamos que borrar ni conservar.",
        ],
      },
      {
        heading: "Cambios",
        paragraphs: [
          "Si la app cambia (por ejemplo, si un día hay copia en la nube), cambiaremos esta página antes y lo diremos en las novedades de la versión.",
        ],
      },
    ],
    contact: "Contacto: Jorge Graells Garcia · dev.graells@gmail.com",
  },
  en: {
    title: "Flypet privacy policy",
    description:
      "What data Flypet, the virtual fly with a real fly's brain, uses: none of it leaves your phone.",
    updated: "Last updated: 22 October 2026",
    intro:
      "Flypet is an app by Jorge Graells Garcia, an independent developer based in Spain. This page explains what data the app uses. Short version: Flypet doesn't collect any of your data. Everything that happens in the game stays on your phone.",
    sections: [
      {
        heading: "What isn't there",
        paragraphs: [
          "No accounts or sign-up: we don't ask for your name, email or age.",
          "No analytics, tracking or advertising IDs.",
          "We don't send anything to a server of ours: we don't have one.",
        ],
      },
      {
        heading: "Your game",
        paragraphs: [
          "The fly, its room, your Flycoins and your settings are saved in the app's storage on your phone and don't leave it. If you uninstall the app or clear its data, your game is gone and we can't get it back. What you buy with money (PRO and the Founder pack) you can get back with \"Restore purchases\", because Google Play keeps track of it.",
        ],
      },
      {
        heading: "The microphone",
        paragraphs: [
          "Flypet uses the microphone only to tell whether you're blowing on the fly (the Blow button): it measures how loud the low-pitched air noise is. That happens on your phone, in the moment: no audio is recorded, stored or sent to anyone.",
          "You can deny the permission or remove it at any time in Android's settings. Everything else keeps working.",
        ],
      },
      {
        heading: "Your photos as posters (Flypet PRO)",
        paragraphs: [
          "When available: if you choose a photo to hang in the room, the app copies it, scaled down, to its own folder on your phone. It doesn't leave the phone and is deleted if you take the poster down or uninstall the app. The app has no access to the rest of your photos, only the one you pick.",
        ],
      },
      {
        heading: "Posters with links",
        paragraphs: [
          "Some posters in the room have a link. If you tap one, that website opens in your browser. That website is not part of Flypet and has its own privacy policy.",
        ],
      },
      {
        heading: "Purchases",
        paragraphs: [
          "Purchases (PRO, the Founder pack and Flycoin packs) are made and charged by Google Play with its own system. We never see your card or payment details: Google tells us which product was bought so we can give it to you in the game, and the app stores that on your phone. What Google does with your data is explained in its privacy policy: https://policies.google.com/privacy",
          "If a child uses an account supervised with Family Link, purchases may stay pending until an adult approves them. Until then, the app doesn't deliver anything.",
        ],
      },
      {
        heading: "Vibration",
        paragraphs: [
          "The app vibrates the phone briefly when you touch the fly and in a few other actions. You can turn it off in the menu. It uses no data.",
        ],
      },
      {
        heading: "Children",
        paragraphs: [
          "Flypet is meant for all ages. Since we don't collect anyone's data, we don't collect children's data either. If you think something in this policy isn't being followed, write to us and we'll look into it.",
        ],
      },
      {
        heading: "Science and credits",
        paragraphs: [
          "The fly's brain is simulated with the MaleCNS connectome (Janelia, CC-BY 4.0 licence). It's data from a fly, not from people. Janelia isn't involved in the app and doesn't endorse it.",
        ],
      },
      {
        heading: "Security and retention",
        paragraphs: [
          "Since the data never leaves your phone, it's protected by your own device's security. It's kept while the app is installed and deleted when you uninstall it. We keep nothing, so there's nothing for us to delete or retain.",
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "If the app changes (for example, if one day there's a cloud backup), we'll update this page first and say so in the release notes.",
        ],
      },
    ],
    contact: "Contact: Jorge Graells Garcia · dev.graells@gmail.com",
  },
};
