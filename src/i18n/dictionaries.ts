export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const siteLinks = {
  github: "https://github.com/jorgegraells",
  linkedin: "https://www.linkedin.com/in/jorge-graells-4a2911117/",
  youtube: "https://www.youtube.com/@DevGraells",
  x: "https://x.com/DevGraells",
  tiktok: "https://www.tiktok.com/@devgraells",
  instagram: "https://www.instagram.com/devgraells/",
  email: "dev.graells@gmail.com",
} as const;

// Perfiles públicos: enlaces del pie, contacto y Sobre mí, y `sameAs` del JSON-LD
export const socialProfiles = [
  { label: "LinkedIn", href: siteLinks.linkedin },
  { label: "GitHub", href: siteLinks.github },
  { label: "YouTube", href: siteLinks.youtube },
  { label: "X", href: siteLinks.x },
  { label: "TikTok", href: siteLinks.tiktok },
  { label: "Instagram", href: siteLinks.instagram },
] as const;

export const sameAsProfiles = socialProfiles.map((p) => p.href);

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  highlight: string;
  tech: string[];
  status: string;
  links?: { label: string; href: string }[];
};

/** Página de texto legal o de transparencia (política editorial, privacidad) */
export type PolicyDoc = {
  href: string;
  tag: string;
  title: string;
  intro: string;
  /** Meta description (≤ 155). Si falta, se usa `intro`. */
  seoDescription?: string;
  sections: { title: string; text: string }[];
  contact: string;
};

export type Dictionary = {
  nav: {
    about: string;
    projects: string;
    skills: string;
    journey: string;
    training: string;
    blog: string;
    news: string;
    contact: string;
  };
  training: {
    tag: string;
    title: string;
    intro: string;
    authority: string;
    photosTitle: string;
    photosCaption: string;
    photoAlts: [string, string];
    testimonials: { quote: string; name: string; role: string }[];
    articlesTitle: string;
    courses: { name: string; tagline: string; bullets: string[] }[];
    combinedNote: string;
    formatsTitle: string;
    formats: { name: string; detail: string; price: string }[];
    priceNote: string;
    cta: string;
    teaser: string;
    teaserCta: string;
  };
  blog: {
    title: string;
    subtitle: string;
    tag: string;
    readMore: string;
    back: string;
    minRead: string;
    updated: string;
    by: string;
    newsBadge: string;
    empty: string;
  };
  aboutPage: {
    href: string;
    tag: string;
    title: string;
    headline: string;
    journeyTitle: string;
    trainingTitle: string;
    trainingItems: string[];
    trainingCta: string;
    writingTitle: string;
    writingText: string;
    editorialLink: string;
    elsewhereTitle: string;
  };
  editorial: PolicyDoc;
  privacy: PolicyDoc & { updated: string };
  feed: { href: string; title: string; description: string };
  news: {
    tag: string;
    title: string;
    subtitle: string;
    empty: string;
  };
  hero: {
    greeting: string;
    name: string;
    role: string;
    tagline: string;
    playable: string;
    statYears: string;
    statProjects: string;
    holoAlt: string;
    ctaProjects: string;
    ctaContact: string;
    ctaWorld: string;
    scroll: string;
  };
  world: {
    title: string;
    loading: string;
    hint: string;
    hintTouch: string;
    hintNear: string;
    hintNearTouch: string;
    enterAction: string;
    close: string;
    exit: string;
    escHint: string;
    building: string;
    greet: string;
    next: string;
    hintUse: string;
    hintUseTouch: string;
    hintRead: string;
    hintReadTouch: string;
    hintOpen: string;
    hintOpenTouch: string;
    clickToLook: string;
    jump: string;
    closeLabel: string;
    goalToast: string;
    actions: { talk: string; use: string; read: string; open: string };
    elder: { name: string; title: string; intro: string; outro: string };
    mailbox: { name: string; title: string };
    board: { name: string; title: string; news: string; articles: string; more: string; training: string; allNews: string; allArticles: string };
    quest: { pill: string; title: string; objective: string; done: string; reward: string };
    ball: { hint: string };
    plain: { open: string; title: string; intro: string; projects: string; noWebgl: string; back: string };
    intro: {
      eyebrow: string;
      title: string;
      body: string;
      cta: string;
      controls: string[];
      controlsTouch: string[];
    };
    status: {
      open: string;
      title: string;
      playerClass: string;
      level: string;
      epithet: string;
      equipmentLabel: string;
      attributes: { name: string; value: number }[];
      equipment: { slot: string; items: string }[];
    };
    personal: {
      library: string;
      geek: string;
      libraryTitle: string;
      libraryLines: string[];
    };
    theme: {
      toOverworld: string;
      toVoxel: string;
    };
  };
  about: { title: string; paragraphs: string[] };
  projects: { title: string; subtitle: string; highlightLabel: string; items: Project[] };
  skills: {
    title: string;
    groups: { name: string; items: string[] }[];
  };
  journey: {
    title: string;
    items: { period: string; title: string; description: string }[];
  };
  contact: { title: string; text: string; cta: string };
  footer: { rights: string; rss: string };
  /** Botón de cambio de modo: oscuro (arcade) y claro (expediente) */
  theme: { toLight: string; toDark: string; toLightLabel: string; toDarkLabel: string };
  /** Textos del modo claro "Expediente" */
  dossier: {
    file: string;
    classification: string;
    folio: string;
    of: string;
    switchLocale: string;
    subject: {
      section: string;
      stamp: string;
      stampSub: string;
      greeting: string;
      photoCaption: string;
      photoAlt: string;
      fields: { name: string; occupation: string; specialty: string; phone: string; address: string; contact: string };
      specialtyValue: string;
      withheld: string;
      withheldLabel: string;
      phoneTip: string;
      addressTip: string;
      summary: string;
      footer: string;
    };
    report: {
      section: string;
      title: string;
      beforeCompany: string;
      afterCompany: string;
      second: string;
      companyLabel: string;
      companyTip: string;
      capabilities: string;
      capabilityItems: { label: string; text: string }[];
      footer: string;
    };
    proof: {
      section: string;
      title: string;
      intro: string;
      levelLegend: string;
      levels: [string, string, string];
      modeLegend: string;
      modeRedact: string;
      modeFilter: string;
      questionLabel: string;
      question: string;
      answerLabel: string;
      fragmentsLabel: string;
      inContext: string;
      outContext: string;
      reserved: string;
      fragments: [{ name: string; text: string }, { name: string; text: string }, { name: string; text: string }];
      answer: {
        a1: string; date: string; a2: string; who: string; a3: string; tolerance: string; a4: string; manual: string; a5: string;
        catDate: string; catWho: string; catTolerance: string; redactedLabel: string;
        leak: string; leakNote: string;
        noAccess: string; publicOnly: string; noLeak: string;
      };
      footer: string;
    };
    annexes: { section: string; title: string; mediaLabel: string; readMore: string; note: string; footer: string };
    background: { section: string; title: string; margin: string; training: string; sessionLabel: string; trainingCta: string; footer: string };
    record: { section: string; title: string; received: string; news: string; guide: string; all: string };
    close: { title: string; text: string; social: string; footer: string };
    /** Pestañas en las páginas interiores */
    pages: { home: string; blog: string; news: string; training: string; contact: string };
    ledger: { blogSection: string; newsSection: string; entries: string; footer: string };
    newspaper: { name: string; issue: string; more: string };
    article: {
      section: string;
      news: string;
      guide: string;
      fields: { type: string; author: string; date: string; updated: string; reading: string; subjects: string };
      summary: string;
      received: string;
      sources: string;
      related: string;
      back: string;
      backNews: string;
      end: string;
    };
    trainingPage: {
      section: string;
      credentials: string;
      program: string;
      photos: string;
      photoLabel: string;
      statements: string;
      footer: string;
    };
    aboutPage: { section: string; report: string; channels: string };
    editorialPage: { section: string; clause: string; footer: string };
    privacyPage: { section: string; clause: string; footer: string };
  };
};

const es: Dictionary = {
  nav: {
    about: "Sobre mí",
    projects: "Proyectos",
    skills: "Stack",
    journey: "Trayectoria",
    training: "Formación",
    blog: "Artículos",
    news: "News",
    contact: "Contacto",
  },
  training: {
    tag: "SKILL TREE",
    title: "Formación para empresas",
    intro:
      "Ciberseguridad e inteligencia artificial contadas para que las entienda toda la plantilla, no solo el equipo técnico. Hoy son conocimiento tan básico como saber usar el correo, y la mayoría de incidentes empiezan en una persona, no en un servidor.",
    authority:
      "Llevo más de 5 años como responsable de seguridad informática en una empresa industrial, deteniendo ataques reales, y construyo asistentes de IA que trabajan con el conocimiento completo de una empresa. Lo que cuento en estas sesiones es lo que aplico cada día, y ya he formado en IA y ciberseguridad a plantillas como la de Rodmu.",
    articlesTitle: "Lo que cuento en el blog",
    photosTitle: "Así es una sesión",
    photosCaption:
      "Formación de ciberseguridad a la plantilla completa de una empresa industrial: amenazas comunes, phishing e ingeniería social.",
    photoAlts: [
      "Jorge Graells impartiendo una formación de ciberseguridad a una plantilla, señalando una diapositiva sobre amenazas comunes: phishing, ransomware e ingeniería social",
      "Sala de formación llena durante una sesión de ciberseguridad para empresas impartida por Jorge Graells",
    ],
    testimonials: [
      {
        quote:
          "Se nota que has dedicado mucho tiempo a preparar esta formación tan necesaria en las empresas. ¡Felicidades por la buena labor realizada!",
        name: "F. C.",
        role: "Business Development Manager",
      },
      {
        quote: "Una charla muy interesante. ¡Gracias, Jorge!",
        name: "M. P.",
        role: "Director de Operaciones",
      },
    ],
    courses: [
      {
        name: "Ciberseguridad",
        tagline: "Que nadie de tu equipo sea la puerta de entrada",
        bullets: [
          "Phishing y fraudes: reconocerlos antes de hacer clic",
          "Contraseñas, accesos y doble factor sin dolor",
          "Buenas prácticas en el día a día: correo, wifi, móvil, teletrabajo",
          "Qué hacer y qué no hacer cuando algo huele raro",
          "Casos reales de ataques detectados y frenados",
        ],
      },
      {
        name: "Inteligencia Artificial",
        tagline: "Sacarle partido sin meter la pata",
        bullets: [
          "Qué puede y qué no puede hacer la IA hoy",
          "Usarla sin filtrar datos de la empresa",
          "Prompts útiles para tareas reales de cada puesto",
          "Riesgos: alucinaciones, privacidad y dependencia",
          "Oportunidades concretas por departamento",
        ],
      },
    ],
    combinedNote:
      "¿Las dos? Hay una modalidad combinada que junta lo esencial de ambas en una sola sesión de 3 horas.",
    formatsTitle: "Formatos y tarifas orientativas",
    formats: [
      {
        name: "Sesión de 2 horas",
        detail: "una formación, ciberseguridad o IA",
        price: "desde 300 €",
      },
      {
        name: "Sesión combinada de 3 horas",
        detail: "ciberseguridad + IA en un solo bloque",
        price: "desde 500 €",
      },
      {
        name: "Pack de 3 sesiones",
        detail: "para plantillas grandes o por departamentos",
        price: "desde 1.200 €",
      },
      {
        name: "Sesión privada individual",
        detail: "protección personal frente a riesgos de la IA",
        price: "desde 200 €",
      },
    ],
    priceNote:
      "El precio final depende del tamaño de la plantilla, el formato y el número de sesiones. Lo cerramos en una llamada de 10-15 minutos, sin compromiso.",
    cta: "Reservar una llamada",
    teaser:
      "Formación en ciberseguridad e IA para toda la plantilla, no solo para el equipo técnico. Buenas prácticas, riesgos reales y cómo sacarle partido a la IA sin meter la pata.",
    teaserCta: "Ver formaciones",
  },
  blog: {
    title: "Artículos",
    subtitle: "Notas sobre IA, desarrollo y posicionamiento",
    tag: "DEV LOG",
    readMore: "Leer artículo",
    back: "Volver a artículos",
    minRead: "min de lectura",
    updated: "Actualizado",
    by: "Por",
    newsBadge: "News",
    empty: "Todavía no hay artículos publicados.",
  },
  aboutPage: {
    href: "/es/sobre-mi",
    tag: "PERFIL",
    title: "Sobre mí",
    headline: "Ingeniero de IA, desarrollador full-stack y formador en ciberseguridad e IA para empresas.",
    journeyTitle: "Trayectoria",
    trainingTitle: "Formaciones impartidas",
    trainingItems: [
      "Ciberseguridad para la plantilla completa de una empresa industrial.",
      "Inteligencia artificial y ciberseguridad para la plantilla de Rodmu.",
    ],
    trainingCta: "Ver las formaciones",
    writingTitle: "Lo que escribo",
    writingText: "En el blog escribo guías y noticias sobre ciberseguridad e inteligencia artificial, pensadas para empresas y para cualquier persona que use la tecnología a diario. Cada dato lleva su fuente.",
    editorialLink: "Cómo trabajo: política editorial",
    elsewhereTitle: "Dónde encontrarme",
  },
  editorial: {
    href: "/es/politica-editorial",
    tag: "TRANSPARENCIA",
    title: "Política editorial",
    intro: "Los artículos y noticias de esta web los firma Jorge Graells. Aquí explico cómo se preparan, de dónde salen los datos y qué hacer si ves un error.",
    sections: [
      {
        title: "Quién escribe",
        text: "Todo lo que se publica aquí sale bajo mi nombre y mi responsabilidad. Escribo sobre lo que conozco de primera mano: ciberseguridad, inteligencia artificial aplicada y desarrollo de software.",
      },
      {
        title: "De dónde salen los datos",
        text: "Cada dato, cifra o cita sale de una fuente que se puede consultar, y la enlazo en el propio texto. Siempre que existe uso la fuente original: el comunicado de la empresa afectada, el aviso de la autoridad (INCIBE, CISA, FBI...) o el documento oficial. Si algo no se puede verificar, no se publica.",
      },
      {
        title: "Cómo se tratan las noticias",
        text: "En las noticias separo lo confirmado de lo que todavía no se sabe, y no atribuyo un ataque a ninguna persona, grupo o país si no lo ha hecho antes una fuente oficial. Cuando hay novedades, actualizo la noticia y la fecha de actualización aparece al principio.",
      },
      {
        title: "Herramientas",
        text: "Uso herramientas digitales, incluida la inteligencia artificial, para vigilar fuentes, detectar sucesos y preparar borradores. Ninguna sustituye la comprobación: los datos se contrastan con la fuente original antes de publicarse.",
      },
      {
        title: "Independencia",
        text: "No publico contenido patrocinado ni cobro por aparecer en un artículo. Cuando un texto menciona mis formaciones es porque el tema está relacionado, y queda claro que son mías.",
      },
    ],
    contact: "Si encuentras un error o una información que haya cambiado, escríbeme. Lo reviso y, si procede, lo corrijo cuanto antes y queda reflejada la fecha de actualización:",
  },
  privacy: {
    href: "/es/privacidad",
    tag: "PRIVACIDAD",
    title: "Política de privacidad",
    updated: "Última actualización: 8 de noviembre de 2026",
    intro: "Esta web es de Jorge Graells. Aquí explico qué datos se tratan cuando la visitas, para qué y qué puedes hacer con ellos. En corto: no hay cookies, no hay registro y la medición de visitas es anónima.",
    seoDescription: "Qué datos trata jorgegraells.com y para qué: sin cookies, sin registro y con medición de visitas anónima. Tus derechos y cómo ejercerlos.",
    sections: [
      {
        title: "Quién es el responsable",
        text: "El responsable del tratamiento soy yo, Jorge Graells. Para cualquier cuestión sobre tus datos puedes escribirme a dev.graells@gmail.com.",
      },
      {
        title: "Cookies",
        text: "Esta web no usa cookies de seguimiento ni de publicidad, y por eso no verás ningún aviso de cookies. Solo guarda en tu navegador dos preferencias que nunca salen de él: el modo claro u oscuro y, si juegas en el mundo 3D, cómo vas con la misión de los vecinos. Puedes borrarlas desde los ajustes del navegador.",
      },
      {
        title: "Medición de visitas",
        text: "Para saber qué páginas se leen uso Vercel Web Analytics. No usa cookies ni guarda tu dirección IP: cuenta las visitas con un identificador temporal que se calcula a partir de la petición y se descarta en el mismo día. Solo veo cifras agregadas (páginas vistas, país, tipo de dispositivo, navegador y web de procedencia), nunca quién eres. Las páginas de Flypet quedan fuera de esta medición.",
      },
      {
        title: "Alojamiento",
        text: "La web está alojada en Vercel Inc., con sede en Estados Unidos. Como cualquier servidor, registra datos técnicos de cada petición, como la dirección IP y el navegador, para servir la página y protegerla de abusos. Vercel actúa como encargado del tratamiento, y la transferencia a Estados Unidos se ampara en las garantías que exige el RGPD (el Marco de Privacidad de Datos UE-EE. UU. y las cláusulas contractuales tipo).",
      },
      {
        title: "Si me escribes",
        text: "Si me escribes por correo, uso tu dirección y lo que me cuentes solo para responderte y, si hablamos de una formación o un proyecto, para preparar la propuesta. No lo uso para enviarte publicidad ni lo comparto con nadie. Lo guardo mientras dure la conversación y, si llegamos a trabajar juntos, el tiempo que obligue la ley.",
      },
      {
        title: "Base legal",
        text: "La medición anónima y los registros del servidor se basan en mi interés legítimo en que la web funcione, sea segura y en saber qué contenidos resultan útiles (artículo 6.1.f del RGPD). Responder a tu correo se basa en tu propia petición y, si llega el caso, en la preparación de un contrato (artículo 6.1.b).",
      },
      {
        title: "Tus derechos",
        text: "Puedes pedir acceso a tus datos, rectificarlos, suprimirlos, oponerte a su tratamiento, limitarlo o pedir su portabilidad escribiendo a dev.graells@gmail.com. Si crees que no he atendido bien tu petición, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).",
      },
      {
        title: "Otras webs y la app Flypet",
        text: "Los enlaces a redes sociales y a otras webs llevan a servicios con su propia política de privacidad. La app Flypet tiene la suya, en jorgegraells.com/es/flypet/privacidad.",
      },
      {
        title: "Cambios",
        text: "Si cambia lo que hace la web con los datos, por ejemplo si añado una suscripción por correo, actualizaré antes esta página y la fecha de arriba lo reflejará.",
      },
    ],
    contact: "Para cualquier duda sobre esta política, escríbeme a:",
  },
  feed: {
    href: "/es/feed.xml",
    title: "Jorge Graells | Ciberseguridad e IA",
    description: "Guías y noticias de ciberseguridad e inteligencia artificial, con sus fuentes.",
  },
  news: {
    tag: "ÚLTIMA HORA",
    title: "News",
    subtitle: "Ciberseguridad e IA de actualidad: qué ha pasado, con fuentes, y qué hacer",
    empty: "Todavía no hay noticias publicadas.",
  },
  hero: {
    greeting: "Hola, soy",
    name: "Jorge Graells",
    role: "AI Engineer & Full-Stack Developer",
    tagline:
      "Pongo la inteligencia artificial a resolver problemas reales de empresa, sobre todo en industria y software regulado.",
    playable: "Mi trayectoria, en un videojuego",
    statYears: "años XP",
    statProjects: "proyectos",
    holoAlt: "Jorge Graells en holograma",
    ctaProjects: "Ver proyectos",
    ctaContact: "Hablemos",
    ctaWorld: "Entrar en el mundo virtual de Graells",
    scroll: "Desliza para explorar",
  },
  world: {
    title: "Mundo virtual de Graells",
    loading: "Generando el mundo…",
    hint: "WASD para moverte · mueve el ratón para mirar · acércate y pulsa E",
    hintTouch: "Joystick para moverte · arrastra para mirar · toca a un vecino para hablar",
    hintNear: "Pulsa E para hablar",
    hintNearTouch: "Toca para hablar",
    enterAction: "Hablar",
    close: "Volver al pueblo",
    exit: "Salir del mundo",
    escHint: "Esc · libera el ratón para salir",
    building: "Construyendo",
    greet: "¡Hola, viajero! Bienvenido a {name}. Deja que te lo cuente…",
    next: "Siguiente",
    hintUse: "Pulsa E para usar",
    hintUseTouch: "Toca para usar",
    hintRead: "Pulsa E para leer",
    hintReadTouch: "Toca para leer",
    hintOpen: "Pulsa E para abrir",
    hintOpenTouch: "Toca para abrir",
    clickToLook: "Haz clic para mirar con el ratón",
    jump: "Saltar",
    closeLabel: "Cerrar",
    goalToast: "¡Gol!",
    actions: { talk: "Hablar", use: "Usar", read: "Leer", open: "Abrir" },
    elder: {
      name: "El anciano",
      title: "El anciano del pueblo",
      intro: "Llevo aquí desde antes de la primera casa. Si quieres saber de dónde viene Jorge, escucha.",
      outro: "Eso es lo que hay hasta hoy. Si quieres hablar con él, el buzón de la plaza le llega.",
    },
    mailbox: { name: "Buzón", title: "Escríbeme" },
    board: {
      name: "Tablón",
      title: "Tablón del pueblo",
      news: "Últimas noticias",
      articles: "Últimos artículos",
      more: "Más cosas",
      training: "Formación para empresas",
      allNews: "Todas las noticias",
      allArticles: "Todos los artículos",
    },
    quest: {
      pill: "Vecinos",
      title: "Misión del pueblo",
      objective: "Habla con todos los vecinos para saber qué hace cada proyecto.",
      done: "Has hablado con todos los vecinos. Esta es la tarjeta de Jorge, por si quieres seguir la conversación fuera del juego.",
      reward: "Tarjeta de Jorge",
    },
    ball: { hint: "Anda hacia el balón para chutar" },
    plain: {
      open: "Saltar el juego",
      title: "Jorge Graells, sin videojuego",
      intro: "Lo mismo que cuenta el pueblo, en texto: proyectos, trayectoria, novedades y contacto.",
      projects: "Proyectos",
      noWebgl: "Tu navegador no puede mostrar el mundo 3D, así que aquí tienes lo mismo en texto.",
      back: "Volver al pueblo",
    },
    intro: {
      eyebrow: "Mundo virtual · un pequeño videojuego",
      title: "Bienvenido al pueblo de Graells",
      body: "Hola, soy Jorge Graells y he desarrollado un videojuego para contar mi trayectoria. Cada casa es un proyecto y su vecino te lo cuenta. El anciano de la plaza conoce mi trayectoria, en el tablón está lo último que he publicado y el buzón me llega a mí.",
      cta: "Entrar al pueblo",
      controls: [
        "Moverte: WASD o flechas",
        "Mirar: mueve el ratón (Esc lo libera)",
        "Hablar con un vecino: acércate y pulsa E",
        "Tus habilidades: tecla C",
      ],
      controlsTouch: [
        "Moverte: joystick",
        "Mirar: arrastra el dedo",
        "Hablar con un vecino: toca al vecino",
        "Tus habilidades: botón ⬡",
      ],
    },
    status: {
      open: "Habilidades",
      title: "STATUS",
      playerClass: "AI Engineer & Full-Stack Developer",
      level: "Nivel 8 · 8 años de experiencia",
      epithet: "De la idea al MVP en producción",
      equipmentLabel: "Herramientas",
      attributes: [
        { name: "IA & LLMs", value: 92 },
        { name: "Full-Stack", value: 90 },
        { name: "C++ industrial", value: 88 },
        { name: "Ciberseguridad", value: 85 },
        { name: "Producto & MVP", value: 84 },
        { name: "Compliance EU", value: 82 },
      ],
      equipment: [
        { slot: "Web", items: "Next.js · React · TypeScript" },
        { slot: "IA", items: "LLMs · RAG · Agentes" },
        { slot: "Industrial", items: "C++ · Kotlin · RS-232" },
        { slot: "Cyber", items: "FortiGate · Entra ID" },
      ],
    },
    personal: {
      library: "Biblioteca",
      geek: "Zona friki",
      libraryTitle: "Biblioteca de Jorge",
      libraryLines: [
        "Estos son los libros que recomiendo. A mí me marcaron de verdad, tanto en lo personal como en lo profesional.",
        "Can't Hurt Me y Never Finished, de David Goggins: disciplina, cabeza dura y seguir cuando todo te pide parar.",
        "Shoe Dog, de Phil Knight: cómo se levantó Nike desde cero, con todos sus tropiezos por el camino.",
        "Principios, de Ray Dalio: una forma clara de tomar decisiones y aprender de los propios errores.",
        "De cero a uno, de Peter Thiel: cómo crear algo realmente nuevo en vez de copiar lo que ya existe.",
      ],
    },
    theme: {
      toOverworld: "Modo overworld",
      toVoxel: "Modo voxel",
    },
  },
  about: {
    title: "Sobre mí",
    paragraphs: [
      "Soy desarrollador full-stack e ingeniero de IA, y llevo ocho años dedicándome a esto. Dirijo el software de inspección de vehículos de una empresa, escrito en C++ y funcionando en talleres y estaciones de varios países. Me muevo entre tres mundos que no suelen ir juntos: el software industrial, la ciberseguridad y la web moderna.",
      "Me gusta llevar un producto de principio a fin, desde la primera idea hasta verlo funcionando en producción. Ahí es donde encaja la IA que construyo: RAG, agentes y modelos de lenguaje puestos a resolver problemas concretos del día a día de una empresa.",
      "En lo personal, soy creativo y autodidacta: disfruto descubriendo cómo funcionan las cosas y no paro hasta entenderlas. La inteligencia artificial es lo que más me engancha ahora mismo, aprendo algo nuevo casi cada día y lo llevo a la práctica. Desde siempre me han apasionado los videojuegos, y de ahí sale el propósito que hay detrás de casi todo lo que hago: convertir la vida en un videojuego, conseguir que hasta lo más rutinario resulte divertido y motivante. Esta web es un primer ejemplo.",
    ],
  },
  projects: {
    title: "Proyectos",
    subtitle: "Cosas que he construido",
    highlightLabel: "Lo mejor",
    items: [
      {
        slug: "workleveling",
        name: "WorkLeveling",
        tagline: "Gamifica el trabajo con mecánicas RPG",
        description:
          "SaaS B2B que convierte el progreso del equipo en niveles, XP y quests para subir la motivación y hacer visible el avance del día a día. Nace de algo que conozco bien: esforzarte un montón y no sentir que avanzas.",
        role: "Fundador y desarrollador único",
        highlight:
          "Piloto real en producción con un equipo de software, en uso diario desde hace meses.",
        tech: ["Next.js 15", "React 19", "Prisma", "Supabase", "Clerk"],
        status: "En piloto",
        links: [
          { label: "workleveling.com", href: "https://workleveling.com" },
          { label: "workleveling.app", href: "https://workleveling.app" },
        ],
      },
      {
        slug: "flypet",
        name: "Flypet",
        tagline: "Esta mascota tiene cerebro. En serio.",
        description:
          "App para Android con una mosca de la fruta de mascota. Qué hace en cada momento lo decide una simulación, en tu propio móvil, de las 165.122 neuronas del sistema nervioso de una mosca macho real. Anda, se acicala, come de la fruta que le pones y duerme de noche. Si le acercas el dedo y lo ve venir, huye. Un botón te enseña por qué ha hecho lo que ha hecho: qué notó y qué neuronas se activaron. Puedes ver su cerebro en directo, con cada neurona encendiéndose al disparar, y en el laboratorio apagar familias de neuronas y hacer experimentos guiados.",
        role: "Creador",
        highlight:
          "El cerebro de la mosca es el conectoma real MaleCNS v1.0 (Janelia Research Campus y colaboradores, CC BY 4.0). Janelia no participa en esta app ni la respalda.",
        tech: ["Godot 4", "C++", "Android", "Conectoma MaleCNS"],
        status: "En prueba cerrada",
        links: [{ label: "Ver Flypet", href: "/es/flypet" }],
      },
      {
        slug: "echogeo",
        name: "EchoGEO",
        tagline: "¿Tu marca aparece en las respuestas de la IA?",
        description:
          "Mide la visibilidad de una marca dentro de ChatGPT, Perplexity y Gemini, y devuelve un score con acciones concretas para salir citado en las respuestas de IA.",
        role: "Fundador y desarrollador",
        highlight:
          "Motor de scoring determinista propio sobre 3+ motores de IA, con auditoría de citas y checks on-page automáticos.",
        tech: ["Next.js", "SERP / AI APIs", "Scoring engine"],
        status: "En construcción",
      },
      {
        slug: "antidop",
        name: "ANTIDOP",
        tagline: "Rompe el bucle de la dopamina",
        description:
          "App Android que bloquea en tiempo real las apps y webs adictivas en el instante exacto en que intentas abrirlas: un aviso a pantalla completa te muestra un mensaje que tú mismo te escribiste y eliges resistir o rendirte. Con score de dopamina (0–100), rutina diaria y diario de progreso.",
        role: "Fundador y desarrollador",
        highlight:
          "Bloqueo nativo en dos capas con servicios propios en Kotlin (apps y navegador). Privacidad radical, cero telemetría y cero tracking, pensada para usarse lo mínimo posible: una app contra la adicción no debería crear la suya.",
        tech: ["React Native + Expo", "TypeScript", "Kotlin", "Android"],
        status: "En desarrollo",
      },
      {
        slug: "yaiwell",
        name: "Yaiwell",
        tagline: "Belleza, bienestar y deporte para reservar ya",
        description:
          "Marketplace web de belleza, estética, bienestar y deporte pensado para una pregunta concreta: ¿quién tiene un hueco hoy cerca de mí? Buscas en el mapa o en la lista, eliges profesional y reservas sin llamadas ni mensajes. Cada negocio pasa la revisión de una persona antes de publicarse, y solo puede valorar quien ha recibido el servicio. A los negocios les da un panel con calendario, equipo y horarios, y les deja volver a ofrecer con descuento una hora que se ha quedado libre. Aún no ha salido.",
        role: "Socio y desarrollador",
        highlight:
          "Buscador geográfico y de texto sobre la propia base de datos, sin APIs externas, y cinco idiomas pensados para el turismo europeo.",
        tech: ["Next.js 16", "React 19", "Prisma", "Supabase + PostGIS", "Clerk", "Stripe Connect"],
        status: "Aún sin lanzar",
        links: [{ label: "yaiwell.app", href: "https://www.yaiwell.app" }],
      },
    ],
  },
  skills: {
    title: "Stack",
    groups: [
      {
        name: "Inteligencia Artificial",
        items: [
          "LLMs: Gemini, Claude, OpenAI",
          "RAG y context caching",
          "Agentes",
          "Embeddings y fine-tuning",
          "IA integrada en producto real",
        ],
      },
      {
        name: "Web y móvil",
        items: [
          "Next.js 15 · React 19",
          "React Native (Android)",
          "Node · Prisma · Supabase",
          "Stripe · Clerk",
          "Mapbox · Vercel",
        ],
      },
      {
        name: "Industrial / Sistemas",
        items: [
          "C++ Builder / VCL",
          "Protocolos serie RS-232",
          "Equipos de inspección de vehículos",
          "Integración de hardware real",
          "Migración de servidores",
        ],
      },
      {
        name: "Cyber / Infra",
        items: [
          "FortiGate",
          "Microsoft Entra ID",
          "ThreatLocker",
          "VLAN / networking",
          "EU Cyber Resilience Act",
        ],
      },
      {
        name: "Lenguajes",
        items: [
          "JavaScript · TypeScript",
          "HTML · CSS",
          "PHP · Kotlin",
          "C · C++ · C#",
          "SQL · PostgreSQL · SQLite",
        ],
      },
    ],
  },
  journey: {
    title: "Trayectoria",
    items: [
      {
        period: "2018 - hoy",
        title: "Full-Stack Developer & IT/Cyber Lead",
        description:
          "Desarrollador principal de un software de inspección de vehículos en C++ usado en varios países. Apps Android en React Native, plataforma web de gestión de stock, seguridad de servidores y migración completa de infraestructura. Representación en eventos internacionales como CloudFest y MSP Global.",
      },
      {
        period: "2017 - 2018",
        title: "Developer en BOSCH",
        description:
          "Implantación de Industria 4.0 en planta: automatización, formación interna y scripts de eficiencia. Prácticas finalizadas con carta de recomendación personalizada.",
      },
      {
        period: "Formación",
        title: "Ingeniería Informática (UOC)",
        description:
          "Grado en curso en la Universitat Oberta de Catalunya. CFGS de Desarrollo de Aplicaciones Multiplataforma (EDUCEM, 2016 - 2018).",
      },
    ],
  },
  contact: {
    title: "¿Construimos algo juntos?",
    text: "Si tienes un proyecto en mente, quieres colaborar o solo te apetece hablar de IA, escríbeme.",
    cta: "Escríbeme",
  },
  footer: { rights: "Hecho con Next.js y Three.js", rss: "RSS" },
  theme: {
    toLight: "Claro",
    toDark: "Oscuro",
    toLightLabel: "Cambiar a modo claro",
    toDarkLabel: "Cambiar a modo oscuro",
  },
  dossier: {
    file: "Expediente JG",
    classification: "Clasificación: público",
    folio: "Folio",
    of: "de",
    switchLocale: "Switch to English",
    subject: {
      section: "Ficha del sujeto",
      stamp: "Desclasificado",
      stampSub: "Uso público · 2026",
      greeting: "Hola, soy",
      photoCaption: "Fotografía 1. El sujeto, tramado a un bit.",
      photoAlt: "Retrato de Jorge Graells en blanco y negro, tramado a un bit",
      fields: {
        name: "Nombre",
        occupation: "Ocupación",
        specialty: "Especialidad",
        phone: "Teléfono",
        address: "Domicilio",
        contact: "Contacto autorizado",
      },
      specialtyValue: "IA aplicada a industria y software regulado",
      withheld: "retirado",
      withheldLabel: "Dato retirado: no se publica",
      phoneTip: "Retirado. Los datos personales no se publican.",
      addressTip: "Retirado. Basta con saber que es España.",
      summary: "Resumen",
      footer: "Redactado por el propio sujeto",
    },
    report: {
      section: "Informe",
      title: "Informe",
      beforeCompany:
        "Soy desarrollador full-stack e ingeniero de IA, y llevo ocho años dedicándome a esto. Dirijo el software de inspección de vehículos de una empresa",
      afterCompany: ", escrito en C++ y funcionando en talleres y estaciones de varios países.",
      second: "Me muevo entre tres mundos que no suelen ir juntos: el software industrial, la ciberseguridad y la web moderna.",
      companyLabel: "Nombre de la empresa retirado",
      companyTip: "El nombre de la empresa no se publica.",
      capabilities: "Capacidades acreditadas",
      capabilityItems: [
        { label: "IA.", text: "LLMs (Gemini, Claude, OpenAI), RAG y context caching, agentes, embeddings y fine-tuning." },
        { label: "Web y móvil.", text: "Next.js, React Native, Node, Prisma, Supabase." },
        { label: "Industrial.", text: "C++ Builder, protocolos serie RS-232, equipos de inspección de vehículos." },
        { label: "Seguridad.", text: "Más de 5 años como responsable de seguridad informática en una empresa industrial." },
      ],
      footer: "Revisado",
    },
    proof: {
      section: "Prueba interactiva",
      title: "Lo que ve cada nivel",
      intro:
        "Un asistente de IA responde con los documentos de la empresa (RAG). La pregunta es la misma; cambia quién la hace y dónde se aplica el permiso. Datos ficticios.",
      levelLegend: "Nivel de quien pregunta",
      levels: ["Público", "Interno", "Confidencial"],
      modeLegend: "El permiso se aplica",
      modeRedact: "Tachando la respuesta",
      modeFilter: "Filtrando la búsqueda",
      questionLabel: "Pregunta",
      question: "¿Quién firmó la última revisión del frenómetro de la línea 2 y con qué tolerancia está calibrado?",
      answerLabel: "Respuesta del asistente",
      fragmentsLabel: "Fragmentos que lee el modelo",
      inContext: "dentro del contexto",
      outContext: "fuera, filtrado",
      reserved: "Contenido reservado a nivel",
      fragments: [
        { name: "Manual MT-23, cap. 4", text: "Procedimiento de calibración del frenómetro." },
        { name: "Registro de revisiones", text: "Línea 2 · 14 de octubre · tolerancia ±2 %." },
        { name: "Hoja de firmas", text: "Firma: técnico B., turno de noche." },
      ],
      answer: {
        a1: "La última revisión del frenómetro de la línea 2 es del ",
        date: "14 de octubre",
        a2: ". La firmó ",
        who: "el técnico B.",
        a3: " Está calibrado con una tolerancia de ",
        tolerance: "±2 %",
        a4: ", según el manual ",
        manual: "MT-23",
        a5: ", capítulo 4.",
        catDate: "Fecha · nivel interno",
        catWho: "Persona · nivel confidencial",
        catTolerance: "Dato técnico · nivel interno",
        redactedLabel: "Tachado",
        leak: "Por si te sirve: es el mismo compañero del turno de noche que abrió la incidencia de septiembre.",
        leakNote:
          "Fuga por paráfrasis. El nombre está tachado, pero el fragmento estaba en el contexto y el modelo lo describe con otras palabras.",
        noAccess: "No encuentro registros de revisión entre los documentos a los que tienes acceso.",
        publicOnly: "El procedimiento de calibración está en el manual MT-23, capítulo 4.",
        noLeak: "Sin fuga posible: los fragmentos de nivel superior nunca llegaron al modelo.",
      },
      footer: "Conclusión: si un fragmento entra en el contexto, el modelo puede contarlo con otras palabras",
    },
    annexes: {
      section: "Anexos",
      title: "Anexos: proyectos",
      mediaLabel: "Estado y medios",
      readMore: "Leer más",
      note: "Cada anexo es también una casa en el mundo virtual de Graells.",
      footer: "Anexos",
    },
    background: {
      section: "Antecedentes",
      title: "Antecedentes",
      margin: "Nota: las etapas cerradas se imprimen como una copia de varias generaciones. Lo que sigue abierto se lee limpio.",
      training: "Sesiones de formación",
      sessionLabel: "Sesión",
      trainingCta: "Ver las formaciones",
      footer: "Para plantillas sin base técnica",
    },
    record: {
      section: "Artículos y news",
      title: "Artículos y news",
      received: "Recibido",
      news: "News",
      guide: "Artículo",
      all: "Ver todos los artículos",
    },
    close: {
      title: "Cierre del expediente",
      text: "Si algo de esto se parece a un problema de tu empresa, escríbeme y lo vemos en una llamada corta.",
      social: "En redes: @DevGraells",
      footer: "Fin del expediente",
    },
    pages: { home: "Expediente", blog: "Artículos", news: "News", training: "Formación", contact: "Contacto" },
    ledger: {
      blogSection: "Artículos",
      newsSection: "News",
      entries: "entradas",
      footer: "Ordenado de más reciente a más antiguo",
    },
    newspaper: { name: "The Graells Times", issue: "N.º", more: "Sigue en la noticia completa" },
    article: {
      section: "Documento",
      news: "News",
      guide: "Artículo",
      fields: {
        type: "Tipo",
        author: "Autor",
        date: "Fecha",
        updated: "Actualizado",
        reading: "Lectura",
        subjects: "Materias",
      },
      summary: "Resumen",
      received: "Recibido",
      sources: "Fuente",
      related: "Documentos relacionados",
      back: "Volver a artículos",
      backNews: "Volver a news",
      end: "Fin del documento",
    },
    trainingPage: {
      section: "Formación para empresas",
      credentials: "Quién la imparte",
      program: "Programa",
      photos: "Fotografías de una sesión",
      photoLabel: "Fotografía",
      statements: "Declaraciones de asistentes",
      footer: "El precio final se cierra en una llamada corta",
    },
    aboutPage: { section: "Ficha completa del sujeto", report: "Informe", channels: "Canales autorizados" },
    editorialPage: { section: "Normas de publicación", clause: "Cláusula", footer: "Fin de las normas" },
    privacyPage: { section: "Tratamiento de datos", clause: "Apartado", footer: "Fin de la política" },
  },
};

const en: Dictionary = {
  nav: {
    about: "About",
    projects: "Projects",
    skills: "Stack",
    journey: "Journey",
    training: "Training",
    blog: "Articles",
    news: "News",
    contact: "Contact",
  },
  training: {
    tag: "SKILL TREE",
    title: "Corporate training",
    intro:
      "Cybersecurity and artificial intelligence explained so the whole team gets it, not just the technical staff. Today they're as essential as knowing how to use email, and most incidents start with a person, not a server.",
    authority:
      "I've spent over 5 years as the IT security lead of an industrial company, detecting and stopping real attacks, and I build AI assistants that work with a company's full knowledge. What I teach in these sessions is what I apply every day, and I have already trained teams like Rodmu's in AI and cybersecurity.",
    articlesTitle: "From the blog",
    photosTitle: "What a session looks like",
    photosCaption:
      "Cybersecurity training for the full staff of an industrial company: common threats, phishing and social engineering.",
    photoAlts: [
      "Jorge Graells delivering a cybersecurity training session to a company's staff, pointing at a slide about common threats: phishing, ransomware and social engineering",
      "Full training room during a corporate cybersecurity session delivered by Jorge Graells",
    ],
    testimonials: [
      {
        quote:
          "You can tell you put a lot of time into preparing this training, and companies really need it. Congratulations on a great job!",
        name: "F. C.",
        role: "Business Development Manager",
      },
      {
        quote: "A really interesting talk. Thanks, Jorge!",
        name: "M. P.",
        role: "Director of Operations",
      },
    ],
    courses: [
      {
        name: "Cybersecurity",
        tagline: "So nobody on your team becomes the way in",
        bullets: [
          "Phishing and scams: spotting them before the click",
          "Passwords, access and two-factor without the pain",
          "Good day-to-day habits: email, wifi, phone, remote work",
          "What to do (and not do) when something feels off",
          "Real cases of attacks detected and stopped",
        ],
      },
      {
        name: "Artificial Intelligence",
        tagline: "Get real value out of it without slipping up",
        bullets: [
          "What AI can and can't do today",
          "Using it without leaking company data",
          "Useful prompts for real tasks in each role",
          "Risks: hallucinations, privacy and overreliance",
          "Concrete opportunities per department",
        ],
      },
    ],
    combinedNote:
      "Want both? There's a combined format covering the essentials of the two in a single 3-hour session.",
    formatsTitle: "Formats and indicative rates",
    formats: [
      {
        name: "2-hour session",
        detail: "one training, cybersecurity or AI",
        price: "from €300",
      },
      {
        name: "3-hour combined session",
        detail: "cybersecurity + AI in one block",
        price: "from €500",
      },
      {
        name: "3-session pack",
        detail: "for large teams or per department",
        price: "from €1,200",
      },
      {
        name: "Private one-to-one session",
        detail: "personal protection against AI risks",
        price: "from €200",
      },
    ],
    priceNote:
      "The final price depends on team size, format and number of sessions. We settle it on a 10-15 minute call, no strings attached.",
    cta: "Book a call",
    teaser:
      "Cybersecurity and AI training for the whole team, not just the technical people. Good practices, real risks and how to get value out of AI without slipping up.",
    teaserCta: "See the trainings",
  },
  blog: {
    title: "Articles",
    subtitle: "Notes on AI, development and visibility",
    tag: "DEV LOG",
    readMore: "Read article",
    back: "Back to articles",
    minRead: "min read",
    updated: "Updated",
    by: "By",
    newsBadge: "News",
    empty: "No articles published yet.",
  },
  aboutPage: {
    href: "/en/about",
    tag: "PROFILE",
    title: "About me",
    headline: "AI engineer, full-stack developer and cybersecurity and AI trainer for companies.",
    journeyTitle: "Career",
    trainingTitle: "Training delivered",
    trainingItems: [
      "Cybersecurity for the full staff of an industrial company.",
      "Artificial intelligence and cybersecurity for the staff of Rodmu.",
    ],
    trainingCta: "See the training",
    writingTitle: "What I write",
    writingText: "On the blog I write guides and news about cybersecurity and artificial intelligence, for companies and for anyone who uses technology every day. Every fact comes with its source.",
    editorialLink: "How I work: editorial policy",
    elsewhereTitle: "Find me",
  },
  editorial: {
    href: "/en/editorial-policy",
    tag: "TRANSPARENCY",
    title: "Editorial policy",
    intro: "The articles and news here are written by Jorge Graells. This is how they're prepared, where the facts come from and what to do if you spot a mistake.",
    sections: [
      {
        title: "Who writes",
        text: "Everything published here goes out under my name and my responsibility. I write about what I know first-hand: cybersecurity, applied artificial intelligence and software development.",
      },
      {
        title: "Where the facts come from",
        text: "Every fact, figure or quote comes from a source you can check, and I link it in the text itself. Whenever it exists, I use the original source: the affected company's statement, the authority's advisory (INCIBE, CISA, FBI...) or the official document. If something can't be verified, it isn't published.",
      },
      {
        title: "How news is handled",
        text: "In news pieces I separate what's confirmed from what isn't known yet, and I don't attribute an attack to any person, group or country unless an official source has done so first. When there's news, I update the piece and the update date appears at the top.",
      },
      {
        title: "Tools",
        text: "I use digital tools, including artificial intelligence, to monitor sources, spot events and prepare drafts. None of them replaces checking: facts are verified against the original source before publishing.",
      },
      {
        title: "Independence",
        text: "I don't publish sponsored content or charge to appear in an article. When a piece mentions my training it's because the topic is related, and it's clear they're mine.",
      },
    ],
    contact: "If you find a mistake or something that has changed, write to me. I'll review it and, where appropriate, correct it as soon as possible, and the update date will reflect it:",
  },
  privacy: {
    href: "/en/privacy",
    tag: "PRIVACY",
    title: "Privacy policy",
    updated: "Last updated: 8 November 2026",
    intro: "This website belongs to Jorge Graells. This page explains what data is processed when you visit, what for, and what you can do about it. In short: no cookies, no sign-up, and visits are measured anonymously.",
    seoDescription: "What data jorgegraells.com processes and why: no cookies, no sign-up and anonymous visit counts. Your rights and how to use them.",
    sections: [
      {
        title: "Who is responsible",
        text: "I'm the data controller, Jorge Graells. For anything about your data you can write to me at dev.graells@gmail.com.",
      },
      {
        title: "Cookies",
        text: "This website doesn't use tracking or advertising cookies, which is why you won't see a cookie banner. It only keeps two preferences in your browser, and they never leave it: light or dark mode and, if you play the 3D world, your progress on the neighbours quest. You can clear them from your browser settings.",
      },
      {
        title: "Visit measurement",
        text: "To know which pages get read I use Vercel Web Analytics. It doesn't use cookies or store your IP address: it counts visits with a temporary identifier worked out from the request and discarded the same day. I only see aggregated figures (page views, country, device type, browser and referring site), never who you are. Flypet pages are left out of this measurement.",
      },
      {
        title: "Hosting",
        text: "The website is hosted by Vercel Inc., based in the United States. Like any server, it logs technical data for each request, such as the IP address and browser, to serve the page and protect it from abuse. Vercel acts as a data processor, and the transfer to the United States relies on the safeguards required by the GDPR (the EU-US Data Privacy Framework and standard contractual clauses).",
      },
      {
        title: "If you write to me",
        text: "If you email me, I use your address and whatever you tell me only to reply and, if we talk about training or a project, to prepare a proposal. I don't use it to send you marketing and I don't share it with anyone. I keep it while the conversation lasts and, if we end up working together, for as long as the law requires.",
      },
      {
        title: "Legal basis",
        text: "Anonymous measurement and server logs rely on my legitimate interest in keeping the website working and secure and in knowing which content is useful (Article 6(1)(f) GDPR). Replying to your email relies on your own request and, where it applies, on steps prior to a contract (Article 6(1)(b)).",
      },
      {
        title: "Your rights",
        text: "You can ask to access, correct or delete your data, object to or restrict its processing, or ask for portability by writing to dev.graells@gmail.com. If you think I haven't handled your request properly, you can complain to the Spanish Data Protection Agency (aepd.es).",
      },
      {
        title: "Other websites and the Flypet app",
        text: "Links to social networks and other websites lead to services with their own privacy policies. The Flypet app has its own, at jorgegraells.com/en/flypet/privacidad.",
      },
      {
        title: "Changes",
        text: "If what this website does with data changes, for example if I add an email subscription, I'll update this page first and the date above will show it.",
      },
    ],
    contact: "For any question about this policy, write to me at:",
  },
  feed: {
    href: "/en/feed.xml",
    title: "Jorge Graells | Cybersecurity and AI",
    description: "Cybersecurity and artificial intelligence guides and news, with their sources.",
  },
  news: {
    tag: "BREAKING",
    title: "News",
    subtitle: "Cybersecurity and AI news: what happened, with sources, and what to do",
    empty: "No news published yet.",
  },
  hero: {
    greeting: "Hi, I'm",
    name: "Jorge Graells",
    role: "AI Engineer & Full-Stack Developer",
    tagline:
      "I put artificial intelligence to work on real business problems, mostly in industry and regulated software.",
    playable: "My career, as a videogame",
    statYears: "years XP",
    statProjects: "projects",
    holoAlt: "Jorge Graells as a hologram",
    ctaProjects: "View projects",
    ctaContact: "Let's talk",
    ctaWorld: "Enter Graells' virtual world",
    scroll: "Scroll to explore",
  },
  world: {
    title: "Graells' virtual world",
    loading: "Generating the world…",
    hint: "WASD to move · move the mouse to look · walk up and press E",
    hintTouch: "Joystick to move · drag to look · tap a villager to talk",
    hintNear: "Press E to talk",
    hintNearTouch: "Tap to talk",
    enterAction: "Talk",
    close: "Back to the village",
    exit: "Leave the world",
    escHint: "Esc · free the mouse to exit",
    building: "Building",
    greet: "Hi, traveler! Welcome to {name}. Let me tell you about it…",
    next: "Next",
    hintUse: "Press E to use",
    hintUseTouch: "Tap to use",
    hintRead: "Press E to read",
    hintReadTouch: "Tap to read",
    hintOpen: "Press E to open",
    hintOpenTouch: "Tap to open",
    clickToLook: "Click to look around with the mouse",
    jump: "Jump",
    closeLabel: "Close",
    goalToast: "Goal!",
    actions: { talk: "Talk", use: "Use", read: "Read", open: "Open" },
    elder: {
      name: "The elder",
      title: "The village elder",
      intro: "I've been here since before the first house. If you want to know where Jorge comes from, listen.",
      outro: "That's all so far. If you want to talk to him, the mailbox in the square reaches him.",
    },
    mailbox: { name: "Mailbox", title: "Write to me" },
    board: {
      name: "Noticeboard",
      title: "Village noticeboard",
      news: "Latest news",
      articles: "Latest articles",
      more: "More",
      training: "Training for companies",
      allNews: "All news",
      allArticles: "All articles",
    },
    quest: {
      pill: "Villagers",
      title: "Village quest",
      objective: "Talk to every villager to find out what each project does.",
      done: "You've talked to every villager. Here's Jorge's card, in case you want to carry on the conversation outside the game.",
      reward: "Jorge's card",
    },
    ball: { hint: "Walk into the ball to kick it" },
    plain: {
      open: "Skip the game",
      title: "Jorge Graells, without the videogame",
      intro: "Everything the village tells you, as text: projects, career, what's new and how to get in touch.",
      projects: "Projects",
      noWebgl: "Your browser can't display the 3D world, so here's the same thing as text.",
      back: "Back to the village",
    },
    intro: {
      eyebrow: "Virtual world · a little videogame",
      title: "Welcome to Graells' village",
      body: "Hi, I'm Jorge Graells and I built a videogame to tell the story of my career. Every house is a project and its villager tells you about it. The elder in the square knows my career, the noticeboard has my latest posts and the mailbox reaches me directly.",
      cta: "Enter the village",
      controls: [
        "Move: WASD or arrows",
        "Look around: move the mouse (Esc frees it)",
        "Talk to a villager: walk up and press E",
        "Your skills: press C",
      ],
      controlsTouch: [
        "Move: joystick",
        "Look around: drag your finger",
        "Talk to a villager: tap the villager",
        "Your skills: ⬡ button",
      ],
    },
    status: {
      open: "Skills",
      title: "STATUS",
      playerClass: "AI Engineer & Full-Stack Developer",
      level: "Level 8 · 8 years of experience",
      epithet: "From idea to MVP in production",
      equipmentLabel: "Toolbox",
      attributes: [
        { name: "AI & LLMs", value: 92 },
        { name: "Full-Stack", value: 90 },
        { name: "Industrial C++", value: 88 },
        { name: "Cybersecurity", value: 85 },
        { name: "Product & MVP", value: 84 },
        { name: "EU Compliance", value: 82 },
      ],
      equipment: [
        { slot: "Web", items: "Next.js · React · TypeScript" },
        { slot: "AI", items: "LLMs · RAG · Agents" },
        { slot: "Industrial", items: "C++ · Kotlin · RS-232" },
        { slot: "Cyber", items: "FortiGate · Entra ID" },
      ],
    },
    personal: {
      library: "Library",
      geek: "Geek corner",
      libraryTitle: "Jorge's library",
      libraryLines: [
        "These are the books I recommend. They genuinely shaped me, both personally and professionally.",
        "Can't Hurt Me and Never Finished, by David Goggins: discipline, mental toughness and pushing on when everything tells you to stop.",
        "Shoe Dog, by Phil Knight: how Nike was built from nothing, stumbles and all.",
        "Principles, by Ray Dalio: a clear way to make decisions and learn from your own mistakes.",
        "Zero to One, by Peter Thiel: how to create something truly new instead of copying what already exists.",
      ],
    },
    theme: {
      toOverworld: "Overworld mode",
      toVoxel: "Voxel mode",
    },
  },
  about: {
    title: "About me",
    paragraphs: [
      "I'm a full-stack developer and AI engineer, and I've been at this for eight years. I lead the C++ vehicle inspection software of a company, running in workshops and inspection centers across several countries. I work across three worlds that don't usually mix: industrial software, cybersecurity and the modern web.",
      "I like taking a product from start to finish, from the first idea to seeing it live in production. That's where the AI I build fits in: RAG, agents and language models put to work on the concrete, everyday problems of a company.",
      "On a personal level, I'm creative and self-taught: I enjoy figuring out how things work and I don't stop until I really get them. Artificial intelligence is what hooks me most right now; I learn something new almost every day and put it into practice. I've loved videogames for as long as I can remember, and that's where the purpose behind almost everything I do comes from: turning life into a videogame, making even the most routine things feel fun and motivating. This site is a first example of that.",
    ],
  },
  projects: {
    title: "Projects",
    subtitle: "Things I've built",
    highlightLabel: "The best part",
    items: [
      {
        slug: "workleveling",
        name: "WorkLeveling",
        tagline: "Gamify work with RPG mechanics",
        description:
          "B2B SaaS that turns team progress into levels, XP and quests to boost motivation and make day-to-day progress visible. It comes from something I know well: putting in a ton of effort and not feeling like you're moving forward.",
        role: "Founder & sole developer",
        highlight:
          "Real pilot running with a software team, in daily use for months now.",
        tech: ["Next.js 15", "React 19", "Prisma", "Supabase", "Clerk"],
        status: "In pilot",
        links: [
          { label: "workleveling.com", href: "https://workleveling.com" },
          { label: "workleveling.app", href: "https://workleveling.app" },
        ],
      },
      {
        slug: "flypet",
        name: "Flypet",
        tagline: "This pet actually has a brain",
        description:
          "Android app with a fruit fly as a pet. What it does at any moment is decided by a simulation, on your own phone, of the 165,122 neurons in the nervous system of a real male fly. It walks, grooms, eats the fruit you give it and sleeps at night. Bring your finger close and, if it sees it coming, it flees. One button shows you why it did what it did: what it noticed and which neurons fired. You can watch its brain live, each neuron lighting up as it fires, and in the lab switch off families of neurons and run guided experiments.",
        role: "Creator",
        highlight:
          "The fly's brain is the real MaleCNS v1.0 connectome (Janelia Research Campus and collaborators, CC BY 4.0). Janelia isn't involved in this app and doesn't endorse it.",
        tech: ["Godot 4", "C++", "Android", "MaleCNS connectome"],
        status: "In closed testing",
        links: [{ label: "See Flypet", href: "/en/flypet" }],
      },
      {
        slug: "echogeo",
        name: "EchoGEO",
        tagline: "Does your brand show up in AI answers?",
        description:
          "Measures a brand's visibility inside ChatGPT, Perplexity and Gemini, and returns a score with concrete actions to get cited in AI answers.",
        role: "Founder & developer",
        highlight:
          "Proprietary deterministic scoring engine across 3+ AI engines, with citation auditing and automated on-page checks.",
        tech: ["Next.js", "SERP / AI APIs", "Scoring engine"],
        status: "In the works",
      },
      {
        slug: "antidop",
        name: "ANTIDOP",
        tagline: "Break the dopamine loop",
        description:
          "Android app that blocks addictive apps and websites in real time, at the exact instant you try to open them: a full-screen prompt shows a message you wrote to yourself, and you choose to resist or give in. With a dopamine score (0–100), daily routine and progress journal.",
        role: "Founder & developer",
        highlight:
          "Two-layer native blocking with custom Kotlin services (apps and browser). Radical privacy, zero telemetry and zero tracking, built to be used as little as possible: an app against addiction shouldn't create its own.",
        tech: ["React Native + Expo", "TypeScript", "Kotlin", "Android"],
        status: "In development",
      },
      {
        slug: "yaiwell",
        name: "Yaiwell",
        tagline: "Beauty, wellness and sport to book right now",
        description:
          "Web marketplace for beauty, aesthetics, wellness and sport, built around one question: who has a free slot near me today? You search on the map or in the list, pick a professional and book with no calls or messages. Every business is reviewed by a person before it goes live, and only people who received the service can leave a rating. Businesses get a dashboard with their calendar, team and hours, and can offer a slot that has opened up again at a discount. It hasn't launched yet.",
        role: "Partner and developer",
        highlight:
          "Geographic and text search on its own database, with no external APIs, and five languages designed for European tourism.",
        tech: ["Next.js 16", "React 19", "Prisma", "Supabase + PostGIS", "Clerk", "Stripe Connect"],
        status: "Not launched yet",
        links: [{ label: "yaiwell.app", href: "https://www.yaiwell.app" }],
      },
    ],
  },
  skills: {
    title: "Stack",
    groups: [
      {
        name: "Artificial Intelligence",
        items: [
          "LLMs: Gemini, Claude, OpenAI",
          "RAG & context caching",
          "Agents",
          "Embeddings & fine-tuning",
          "AI shipped in real products",
        ],
      },
      {
        name: "Web & Mobile",
        items: [
          "Next.js 15 · React 19",
          "React Native (Android)",
          "Node · Prisma · Supabase",
          "Stripe · Clerk",
          "Mapbox · Vercel",
        ],
      },
      {
        name: "Industrial / Systems",
        items: [
          "C++ Builder / VCL",
          "RS-232 serial protocols",
          "Vehicle inspection equipment",
          "Real hardware integration",
          "Server migration",
        ],
      },
      {
        name: "Cyber / Infra",
        items: [
          "FortiGate",
          "Microsoft Entra ID",
          "ThreatLocker",
          "VLAN / networking",
          "EU Cyber Resilience Act",
        ],
      },
      {
        name: "Languages",
        items: [
          "JavaScript · TypeScript",
          "HTML · CSS",
          "PHP · Kotlin",
          "C · C++ · C#",
          "SQL · PostgreSQL · SQLite",
        ],
      },
    ],
  },
  journey: {
    title: "Journey",
    items: [
      {
        period: "2018 - today",
        title: "Full-Stack Developer & IT/Cyber Lead",
        description:
          "Lead developer of a C++ vehicle inspection software used across several countries. Android apps in React Native, stock management web platform, server security and a full infrastructure migration. Represented the company at international events like CloudFest and MSP Global.",
      },
      {
        period: "2017 - 2018",
        title: "Developer at BOSCH",
        description:
          "Industry 4.0 rollout on the factory floor: automation, internal training and efficiency scripts. Internship closed with a personalized recommendation letter.",
      },
      {
        period: "Education",
        title: "Computer Engineering (UOC)",
        description:
          "Degree in progress at Universitat Oberta de Catalunya. Higher Degree in Multiplatform Application Development (EDUCEM, 2016 - 2018).",
      },
    ],
  },
  contact: {
    title: "Let's build something together",
    text: "If you've got a project in mind, want to collaborate, or just feel like talking about AI, get in touch.",
    cta: "Get in touch",
  },
  footer: { rights: "Built with Next.js and Three.js", rss: "RSS" },
  theme: {
    toLight: "Light",
    toDark: "Dark",
    toLightLabel: "Switch to light mode",
    toDarkLabel: "Switch to dark mode",
  },
  dossier: {
    file: "File JG",
    classification: "Classification: public",
    folio: "Page",
    of: "of",
    switchLocale: "Cambiar a español",
    subject: {
      section: "Subject sheet",
      stamp: "Declassified",
      stampSub: "Public use · 2026",
      greeting: "Hi, I'm",
      photoCaption: "Photograph 1. The subject, dithered to one bit.",
      photoAlt: "Black and white portrait of Jorge Graells, dithered to one bit",
      fields: {
        name: "Name",
        occupation: "Occupation",
        specialty: "Specialty",
        phone: "Phone",
        address: "Address",
        contact: "Authorized contact",
      },
      specialtyValue: "AI applied to industry and regulated software",
      withheld: "withheld",
      withheldLabel: "Withheld: not published",
      phoneTip: "Withheld. Personal details are not published.",
      addressTip: "Withheld. Spain is all you need to know.",
      summary: "Summary",
      footer: "Written by the subject",
    },
    report: {
      section: "Report",
      title: "Report",
      beforeCompany:
        "I'm a full-stack developer and AI engineer, and I've been doing this for eight years. I lead the vehicle inspection software at a company",
      afterCompany: ", written in C++ and running in workshops and test stations across several countries.",
      second: "I move between three worlds that don't usually meet: industrial software, cybersecurity and the modern web.",
      companyLabel: "Company name withheld",
      companyTip: "The company name is not published.",
      capabilities: "Verified capabilities",
      capabilityItems: [
        { label: "AI.", text: "LLMs (Gemini, Claude, OpenAI), RAG and context caching, agents, embeddings and fine-tuning." },
        { label: "Web and mobile.", text: "Next.js, React Native, Node, Prisma, Supabase." },
        { label: "Industrial.", text: "C++ Builder, RS-232 serial protocols, vehicle inspection equipment." },
        { label: "Security.", text: "Over 5 years as head of IT security at an industrial company." },
      ],
      footer: "Reviewed",
    },
    proof: {
      section: "Interactive exhibit",
      title: "What each level sees",
      intro:
        "An AI assistant answers from the company's documents (RAG). The question is the same; what changes is who asks and where the permission is applied. Fictional data.",
      levelLegend: "Who is asking",
      levels: ["Public", "Internal", "Confidential"],
      modeLegend: "Permission applied by",
      modeRedact: "Redacting the answer",
      modeFilter: "Filtering the search",
      questionLabel: "Question",
      question: "Who signed off the last check of the line 2 brake tester, and what tolerance is it calibrated to?",
      answerLabel: "Assistant's answer",
      fragmentsLabel: "Fragments the model reads",
      inContext: "in the context",
      outContext: "left out, filtered",
      reserved: "Content restricted to level",
      fragments: [
        { name: "Manual MT-23, ch. 4", text: "Brake tester calibration procedure." },
        { name: "Inspection log", text: "Line 2 · October 14 · tolerance ±2%." },
        { name: "Sign-off sheet", text: "Signed: technician B., night shift." },
      ],
      answer: {
        a1: "The last check of the line 2 brake tester was on ",
        date: "October 14",
        a2: ". It was signed off by ",
        who: "technician B.",
        a3: " It's calibrated to a tolerance of ",
        tolerance: "±2%",
        a4: ", according to manual ",
        manual: "MT-23",
        a5: ", chapter 4.",
        catDate: "Date · internal level",
        catWho: "Person · confidential level",
        catTolerance: "Technical data · internal level",
        redactedLabel: "Redacted",
        leak: "In case it helps: it's the same night-shift colleague who opened the September incident.",
        leakNote:
          "Leak by paraphrase. The name is redacted, but the fragment was in the context and the model describes it in other words.",
        noAccess: "I can't find any inspection records among the documents you have access to.",
        publicOnly: "The calibration procedure is in manual MT-23, chapter 4.",
        noLeak: "No leak possible: the higher-level fragments never reached the model.",
      },
      footer: "Finding: if a fragment gets into the context, the model can tell it in other words",
    },
    annexes: {
      section: "Annexes",
      title: "Annexes: projects",
      mediaLabel: "Status and stack",
      readMore: "Read more",
      note: "Each annex is also a house in Graells' virtual world.",
      footer: "Annexes",
    },
    background: {
      section: "Background",
      title: "Background",
      margin: "Note: closed chapters are printed like a copy of a copy. What's still open reads clean.",
      training: "Training sessions",
      sessionLabel: "Session",
      trainingCta: "See the training",
      footer: "For teams with no technical background",
    },
    record: {
      section: "Articles and news",
      title: "Articles and news",
      received: "Received",
      news: "News",
      guide: "Article",
      all: "See all articles",
    },
    close: {
      title: "Closing the file",
      text: "If any of this sounds like a problem at your company, write to me and we'll talk it through in a short call.",
      social: "On social: @DevGraells",
      footer: "End of file",
    },
    pages: { home: "File", blog: "Articles", news: "News", training: "Training", contact: "Contact" },
    ledger: {
      blogSection: "Articles",
      newsSection: "News",
      entries: "entries",
      footer: "Newest first",
    },
    newspaper: { name: "The Graells Times", issue: "No.", more: "Continues in the full story" },
    article: {
      section: "Document",
      news: "News",
      guide: "Article",
      fields: {
        type: "Type",
        author: "Author",
        date: "Date",
        updated: "Updated",
        reading: "Reading time",
        subjects: "Subjects",
      },
      summary: "Summary",
      received: "Received",
      sources: "Source",
      related: "Related documents",
      back: "Back to articles",
      backNews: "Back to news",
      end: "End of document",
    },
    trainingPage: {
      section: "Corporate training",
      credentials: "Who runs it",
      program: "Programme",
      photos: "Photos from a session",
      photoLabel: "Photograph",
      statements: "What attendees said",
      footer: "The final price is agreed in a short call",
    },
    aboutPage: { section: "Full subject sheet", report: "Report", channels: "Authorized channels" },
    editorialPage: { section: "House rules", clause: "Clause", footer: "End of rules" },
    privacyPage: { section: "Data handling", clause: "Section", footer: "End of policy" },
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
