// Página pública de la app ANTIDOP (Android), en castellano e inglés.
// Se publica en /[locale]/antidop. Nada de cifras en euros ni de usuarios.
// Hasta que la app salga en producción en Google Play no se pone botón ni enlace de descarga:
// cuando salga, pon la URL en ANTIDOP_PLAY_URL y aparecerá el botón arriba y abajo.
// Tono y hechos: los de la ficha de Play (docs/play/ficha-es.md y ficha-en.md en el repo de la app).

import type { Locale } from "@/i18n/dictionaries";

export const ANTIDOP_PLAY_URL: string | null = null;

export const ANTIDOP_EMAIL = "dev.graells@gmail.com";

/** Captura de public/antidop/<locale>/<file>-{540,1080}.webp (1080x1920). */
export type AntidopShot = { file: string; caption: string; alt: string };

export type AntidopStep = { title: string; text: string };

export type AntidopPermission = { name: string; text: string };

export type AntidopPage = {
  metaTitle: string;
  metaDescription: string;
  ogAlt: string;
  title: string;
  heroAlt: string;
  lead: string;
  hook: string;
  perks: string[];
  seeCta: string;
  /** Enlace a /antidop/probar mientras la app está en prueba cerrada. */
  testersCta: string;
  /** Etiqueta accesible del vídeo y frase que lo acompaña. */
  videoLabel: string;
  videoCaption: string;
  howTag: string;
  howTitle: string;
  steps: AntidopStep[];
  howShots: AntidopShot[];
  doTag: string;
  doTitle: string;
  doIntro: string;
  doItems: string[];
  doOutro: string;
  doShots: AntidopShot[];
  guiltTag: string;
  guiltTitle: string;
  guilt: string[];
  privacyTag: string;
  privacyTitle: string;
  privacyItems: string[];
  permissionsTitle: string;
  permissions: AntidopPermission[];
  moreTitle: string;
  more: string[];
  getTag: string;
  getTitle: string;
  availabilityHeading: string;
  availability: string;
  playCta: string;
  ageHeading: string;
  age: string;
  priceHeading: string;
  price: string;
  makersHeading: string;
  makers: string;
  privacyHeading: string;
  privacyLink: string;
  contactLabel: string;
};

export const antidopPage: Record<Locale, AntidopPage> = {
  es: {
    metaTitle: "ANTIDOP: bloquea y resiste",
    metaDescription:
      "App para Android que bloquea las apps y webs que te roban el tiempo. Tu personaje crece con lo que resistes. Gratis, sin cuentas, sin anuncios y sin seguimiento.",
    ogAlt: "ANTIDOP. Bloquea. Resiste. Crece.",
    title: "Bloquea lo que te roba el tiempo.",
    heroAlt:
      "Cartel de ANTIDOP: un personaje de píxeles con escudo, tres iconos de apps que se acercan, el mensaje «No lo abras» y los botones Resistir y Rendirme.",
    lead: "ANTIDOP te ayuda a dejar de abrir por inercia las apps y las webs que te quitan horas: redes sociales, vídeo corto, juegos o lo que tú elijas.",
    hook: "Tu personaje crece si resistes.",
    perks: ["Gratis", "Sin anuncios", "Sin cuentas", "Sin seguimiento"],
    seeCta: "Mira cómo funciona",
    testersCta: "Hazte probador",
    videoLabel: "Vídeo: ANTIDOP en 40 segundos",
    videoCaption: "ANTIDOP en 40 segundos. Con sonido.",
    howTag: "CÓMO FUNCIONA",
    howTitle: "Un aviso, una decisión",
    steps: [
      { title: "Eliges", text: "Qué apps y qué webs quieres bloquear." },
      {
        title: "Aparece tu personaje",
        text: "Cuando intentas abrir una, sale tu personaje con su escudo y un mensaje que escribiste tú mismo, junto a una cita.",
      },
      {
        title: "Decides",
        text: "Resistir o Rendirte. Si te rindes, tienes 10 minutos de tregua. Nadie te castiga.",
      },
    ],
    howShots: [
      {
        file: "inicio",
        caption: "Tu inicio",
        alt: "Pantalla de inicio de ANTIDOP: el personaje, el tiempo recuperado hoy, tu reto del día y el resumen de lo que ha pasado en el bloqueo.",
      },
      {
        file: "bloqueo",
        caption: "El aviso de bloqueo",
        alt: "El aviso de bloqueo: el personaje con su escudo, el mensaje «No lo abras» escrito por el propio usuario, una cita y los botones Resistir y Rendirme.",
      },
    ],
    doTag: "ERES LO QUE HACES",
    doTitle: "Un juego de rol en píxeles",
    doIntro:
      "ANTIDOP es también un juego de rol en píxeles, con una regla: tu personaje solo crece con lo que el móvil mide.",
    doItems: [
      "Tiempo recuperado: cuánto menos usas esas apps frente a tu media de siempre.",
      "Resistencias: las veces que dijiste que no delante del bloqueo.",
      "Un reto al día, calculado con tus propios datos.",
      "Clase, rango y aspecto que cambian con tu constancia. Nada se compra.",
    ],
    doOutro: "No ganas nada por marcar casillas ni por decir que lo has hecho. Solo cuenta lo que haces.",
    doShots: [
      {
        file: "personaje",
        caption: "Mi personaje",
        alt: "La pantalla de tu personaje: su nombre, su clase y su rango, y lo que has hecho para llegar hasta ahí.",
      },
      {
        file: "resumen",
        caption: "El resumen del día",
        alt: "El resumen del día: la experiencia ganada, el tiempo recuperado, las veces que has resistido y si has cumplido el reto.",
      },
      {
        file: "retocar",
        caption: "Retocar tu aspecto",
        alt: "El editor de aspecto: piel, peinado, color de pelo y de ojos, con el personaje arriba.",
      },
    ],
    guiltTag: "SIN CULPA",
    guiltTitle: "Aquí nadie te castiga",
    guilt: [
      "Lo que has conseguido nunca se pierde: ni por rendirte ni por fallar un reto.",
      "Un aviso al día como mucho, a la hora que tú elijas, y está apagado de serie.",
      "Si pasas 30 minutos dentro de ANTIDOP, la propia app te recuerda que la cierres.",
    ],
    privacyTag: "TU PRIVACIDAD",
    privacyTitle: "Todo se queda en tu móvil",
    privacyItems: [
      "ANTIDOP no envía tus datos a ningún servidor.",
      "Sin cuentas, sin anuncios y sin seguimiento.",
      "El historial de uso anterior a la instalación solo se lee si tú lo permites.",
      "Copia de seguridad manual, tuya y gratis.",
    ],
    permissionsTitle: "Permisos que pide y para qué",
    permissions: [
      {
        name: "Acceso al uso",
        text: "Saber qué app tienes abierta y cuánto la usas, para bloquearla y medir tu tiempo recuperado.",
      },
      {
        name: "Accesibilidad",
        text: "Leer la barra de direcciones del navegador, solo para comprobar si la web está en tu lista de bloqueo. No lee el contenido de las páginas. Solo guarda el nombre de la web bloqueada cuando resistes o te rindes, y nada sale del móvil.",
      },
      { name: "Mostrar sobre otras apps", text: "Enseñar la pantalla de bloqueo." },
      {
        name: "Notificaciones",
        text: "El aviso fijo del guardián y, si lo activas, el aviso del reto.",
      },
    ],
    moreTitle: "Y además",
    more: [
      "Varios planes de bloqueo, con descansos y rutina opcional.",
      "Diario e historial de tus días.",
      "13 idiomas.",
    ],
    getTag: "DÓNDE",
    getTitle: "Disponible pronto",
    availabilityHeading: "Dónde conseguirla",
    availability: "En prueba cerrada en Google Play: si tienes Android, puedes probarla ya. Disponible para todos pronto.",
    playCta: "Ver en Google Play",
    ageHeading: "Para quién",
    age: "Para mayores de 16 años.",
    priceHeading: "Qué cuesta",
    price: "Es gratis y no tiene anuncios.",
    makersHeading: "Quién la hace",
    makers: "ANTIDOP lo crea Jorge Graells.",
    privacyHeading: "Privacidad y contacto",
    privacyLink: "Política de privacidad de ANTIDOP",
    contactLabel: "Contacto:",
  },
  en: {
    metaTitle: "ANTIDOP: block and resist",
    metaDescription:
      "Android app that blocks the apps and websites that steal your time. Your character grows with what you resist. Free, no accounts, no ads and no tracking.",
    ogAlt: "ANTIDOP. Block. Resist. Grow.",
    title: "Block what steals your time.",
    heroAlt:
      "ANTIDOP poster: a pixel-art character with a shield, three app icons drifting closer, the message “Don't open it” and the Resist and Give up buttons.",
    lead: "ANTIDOP helps you stop opening, out of habit, the apps and websites that eat your hours: social media, short videos, games, or whatever you choose.",
    hook: "Your character grows as you resist.",
    perks: ["Free", "No ads", "No accounts", "No tracking"],
    seeCta: "See how it works",
    testersCta: "Become a tester",
    videoLabel: "Video: ANTIDOP in 40 seconds",
    videoCaption: "ANTIDOP in 40 seconds. With sound.",
    howTag: "HOW IT WORKS",
    howTitle: "One prompt, one decision",
    steps: [
      { title: "You pick", text: "The apps and websites you want to block." },
      {
        title: "Your character appears",
        text: "When you try to open one, your character shows up with its shield, along with a message you wrote yourself and a quote.",
      },
      {
        title: "You decide",
        text: "Resist or Give up. If you give up, you get a 10-minute truce. Nobody punishes you.",
      },
    ],
    howShots: [
      {
        file: "inicio",
        caption: "Your home screen",
        alt: "ANTIDOP's home screen: the character, the time won back today, your challenge of the day and a summary of what happened at the block screen.",
      },
      {
        file: "bloqueo",
        caption: "The block prompt",
        alt: "The block prompt: the character with its shield, a message written by the user, a quote and the Resist and Give up buttons.",
      },
    ],
    doTag: "YOU ARE WHAT YOU DO",
    doTitle: "A pixel-art role-playing game",
    doIntro:
      "ANTIDOP is also a pixel-art role-playing game with one rule: your character only grows with what your phone can measure.",
    doItems: [
      "Time won back: how much less you use those apps compared with your usual average.",
      "Resistances: the times you said no at the block screen.",
      "One challenge a day, calculated from your own data.",
      "Class, rank and look that change with your consistency. Nothing can be bought.",
    ],
    doOutro: "You gain nothing by ticking boxes or by saying you did it. Only what you do counts.",
    doShots: [
      {
        file: "personaje",
        caption: "My character",
        alt: "Your character's screen: its name, class and rank, and what you did to get there.",
      },
      {
        file: "resumen",
        caption: "The day summary",
        alt: "The day summary: the experience earned, the time won back, the times you resisted and whether you completed the challenge.",
      },
      {
        file: "retocar",
        caption: "Customise your look",
        alt: "The look editor: skin, hairstyle, hair and eye colour, with the character on top.",
      },
    ],
    guiltTag: "NO GUILT",
    guiltTitle: "Nobody punishes you here",
    guilt: [
      "What you have earned is never lost: not by giving up, not by failing a challenge.",
      "One reminder a day at most, at the time you choose, and it is off by default.",
      "If you spend 30 minutes inside ANTIDOP, the app itself reminds you to close it.",
    ],
    privacyTag: "YOUR PRIVACY",
    privacyTitle: "Everything stays on your phone",
    privacyItems: [
      "ANTIDOP does not send your data to any server.",
      "No accounts, no ads and no tracking.",
      "Your usage history from before installing is only read if you allow it.",
      "Manual backup, yours and free.",
    ],
    permissionsTitle: "Permissions it asks for, and why",
    permissions: [
      {
        name: "Usage access",
        text: "To know which app you have open and how much you use it, so it can block it and measure the time you win back.",
      },
      {
        name: "Accessibility",
        text: "To read your browser's address bar, only to check whether the website is on your block list. It does not read page content. It only stores the name of the blocked website when you resist or give up, and nothing leaves your phone.",
      },
      { name: "Display over other apps", text: "To show the block screen." },
      {
        name: "Notifications",
        text: "The guardian's ongoing notification and, if you turn it on, the challenge reminder.",
      },
    ],
    moreTitle: "And also",
    more: [
      "Several block plans, with breaks and an optional routine.",
      "Journal and history of your days.",
      "13 languages.",
    ],
    getTag: "WHERE",
    getTitle: "Coming soon",
    availabilityHeading: "Where to get it",
    availability: "In closed testing on Google Play: if you have Android, you can try it now. Available to everyone soon.",
    playCta: "See on Google Play",
    ageHeading: "Who it is for",
    age: "For ages 16 and up.",
    priceHeading: "What it costs",
    price: "It is free and has no ads.",
    makersHeading: "Who makes it",
    makers: "ANTIDOP is made by Jorge Graells.",
    privacyHeading: "Privacy and contact",
    privacyLink: "ANTIDOP privacy policy",
    contactLabel: "Contact:",
  },
};

/** Cabecera y pie propios de las páginas de ANTIDOP (no llevan la navegación del portfolio). */
export type AntidopChrome = {
  home: string;
  switchLabel: string;
  madeBy: string;
  siteLabel: string;
  privacy: string;
  contact: string;
  backToApp: string;
};

export const antidopChrome: Record<Locale, AntidopChrome> = {
  es: {
    home: "ANTIDOP, inicio",
    switchLabel: "Idioma",
    madeBy: "Una app de Jorge Graells.",
    siteLabel: "Ver su web",
    privacy: "Política de privacidad",
    contact: "Contacto",
    backToApp: "Volver a ANTIDOP",
  },
  en: {
    home: "ANTIDOP, home",
    switchLabel: "Language",
    madeBy: "An app by Jorge Graells.",
    siteLabel: "Visit his site",
    privacy: "Privacy policy",
    contact: "Contact",
    backToApp: "Back to ANTIDOP",
  },
};
