export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const siteLinks = {
  github: "https://github.com/jorgegraells",
  linkedin: "https://www.linkedin.com/in/jorge-graells-4a2911117/",
  email: "dev.graells@gmail.com",
} as const;

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

export type Dictionary = {
  nav: {
    about: string;
    projects: string;
    skills: string;
    journey: string;
    blog: string;
    contact: string;
  };
  blog: {
    title: string;
    subtitle: string;
    tag: string;
    readMore: string;
    back: string;
    minRead: string;
    empty: string;
  };
  hero: {
    greeting: string;
    name: string;
    role: string;
    tagline: string;
    playable: string;
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
    style: { blocky: string; rounded: string };
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
      librarySubtitle: string;
      geek: string;
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
  footer: { rights: string };
};

const es: Dictionary = {
  nav: {
    about: "Sobre mí",
    projects: "Proyectos",
    skills: "Stack",
    journey: "Trayectoria",
    blog: "Artículos",
    contact: "Contacto",
  },
  blog: {
    title: "Artículos",
    subtitle: "Notas sobre IA, desarrollo y posicionamiento",
    tag: "DEV LOG",
    readMore: "Leer artículo",
    back: "Volver a artículos",
    minRead: "min de lectura",
    empty: "Todavía no hay artículos publicados.",
  },
  hero: {
    greeting: "Hola, soy",
    name: "Jorge Graells",
    role: "AI Engineer & Full-Stack Developer",
    tagline:
      "IA aplicada de verdad para industria y software regulado: RAG, agentes y LLMs resolviendo problemas reales de empresa.",
    playable: "Un currículum que se juega",
    ctaProjects: "Ver proyectos",
    ctaContact: "Hablemos",
    ctaWorld: "Entrar en el mundo virtual de Graells",
    scroll: "Desliza para explorar",
  },
  world: {
    title: "Mundo virtual de Graells",
    loading: "Generando el mundo…",
    hint: "WASD para moverte · mueve el ratón para mirar · acércate y pulsa E · Esc libera el ratón",
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
    style: { blocky: "Cuadrado", rounded: "Redondo" },
    intro: {
      eyebrow: "Mundo virtual · un pequeño videojuego",
      title: "Bienvenido al pueblo de Graells",
      body: "Hola, soy Jorge Graells y he desarrollado un videojuego para presentar mi currículum. Cada casa es un proyecto y cada vecino te cuenta un capítulo de mi carrera como desarrollador e ingeniero de IA. Acércate a un vecino y deja que te cuente su historia.",
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
      librarySubtitle: "Lecturas que recomiendo",
      geek: "Zona friki",
    },
  },
  about: {
    title: "Sobre mí",
    paragraphs: [
      "Desarrollador full-stack e ingeniero de IA con 8 años de experiencia. Líder técnico de un software de inspección de vehículos en C++ desplegado en talleres y centros de inspección de varios países, a caballo entre el software industrial, la ciberseguridad y el stack web moderno.",
      "Construyo productos de principio a fin, de la idea al MVP en producción, con foco en IA aplicada de verdad: RAG, agentes y LLMs resolviendo problemas reales de empresa.",
      "Soy creativo y autodidacta, y lo que más me gusta es coger una idea y convertirla en algo real. Ahora mismo estoy volcado en la inteligencia artificial, aprendiendo algo nuevo cada día y llevándolo a la práctica. Desde siempre me han apasionado los videojuegos, y de ahí nace el objetivo que hay detrás de casi todo lo que hago: convertir la vida en un videojuego, conseguir que hasta lo más rutinario resulte divertido y motivante. Esta web es un primer ejemplo.",
    ],
  },
  projects: {
    title: "Proyectos",
    subtitle: "Cosas que he construido",
    highlightLabel: "Lo que impresiona",
    items: [
      {
        slug: "workleveling",
        name: "WorkLeveling",
        tagline: "Gamifica el trabajo con mecánicas RPG",
        description:
          "SaaS B2B que convierte el progreso del equipo en niveles, XP y quests para aumentar la motivación y dar visibilidad al avance diario. Resuelve la desconexión entre el esfuerzo y la sensación de avance.",
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
        slug: "enterprise-ai",
        name: "IA para empresas",
        tagline: "Asistente RAG sobre documentación técnica",
        description:
          "He desarrollado una IA para una empresa: un asistente con RAG sobre ~50 manuales técnicos que da respuestas precisas al personal sin bucear en cientos de páginas de documentación compleja.",
        role: "Diseño y desarrollo completo",
        highlight:
          "Multi-idioma (6), auth completa y panel de administración. Coste de tokens optimizado con context caching y filtrado estricto de PDFs por query.",
        tech: ["PHP", "Gemini API", "RAG", "Stripe"],
        status: "En producción",
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
        slug: "industrial-ai",
        name: "IA en la industria",
        tagline: "IA, cyber y compliance en industria real",
        description:
          "Integración de IA, ciberseguridad y cumplimiento europeo dentro de una empresa industrial en producción diaria. Caso real, no producto.",
        role: "IT/cyber lead + desarrollo",
        highlight:
          "Liderazgo del cumplimiento del EU Cyber Resilience Act e integración de hardware real (analizadores de gas, protocolos serie) en software de inspección.",
        tech: ["Entra ID", "FortiGate", "ThreatLocker", "C++ Builder"],
        status: "Caso real",
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
          "TypeScript · Node",
          "React Native (Android)",
          "Prisma · Supabase · PostgreSQL",
          "Stripe · Clerk · Mapbox · Vercel",
        ],
      },
      {
        name: "Industrial / Sistemas",
        items: [
          "C++ Builder / VCL · C#",
          "Protocolos serie RS-232",
          "Equipos de inspección de vehículos",
          "PostgreSQL · SQLite",
          "PHP",
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
    text: "Estoy abierto a proyectos, colaboraciones y buenas conversaciones sobre IA aplicada.",
    cta: "Escríbeme",
  },
  footer: { rights: "Hecho con Next.js y Three.js" },
};

const en: Dictionary = {
  nav: {
    about: "About",
    projects: "Projects",
    skills: "Stack",
    journey: "Journey",
    blog: "Articles",
    contact: "Contact",
  },
  blog: {
    title: "Articles",
    subtitle: "Notes on AI, development and visibility",
    tag: "DEV LOG",
    readMore: "Read article",
    back: "Back to articles",
    minRead: "min read",
    empty: "No articles published yet.",
  },
  hero: {
    greeting: "Hi, I'm",
    name: "Jorge Graells",
    role: "AI Engineer & Full-Stack Developer",
    tagline:
      "Applied AI for industry and regulated software: RAG, agents and LLMs solving real business problems.",
    playable: "A résumé you can play",
    ctaProjects: "View projects",
    ctaContact: "Let's talk",
    ctaWorld: "Enter Graells' virtual world",
    scroll: "Scroll to explore",
  },
  world: {
    title: "Graells' virtual world",
    loading: "Generating the world…",
    hint: "WASD to move · move the mouse to look · walk up and press E · Esc frees the mouse",
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
    style: { blocky: "Blocky", rounded: "Rounded" },
    intro: {
      eyebrow: "Virtual world · a little videogame",
      title: "Welcome to Graells' village",
      body: "Hi, I'm Jorge Graells and I built a videogame to present my résumé. Every house is a project and every villager tells you a chapter of my career as a developer and AI engineer. Walk up to a villager and let them tell you their story.",
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
      librarySubtitle: "Reads I recommend",
      geek: "Geek corner",
    },
  },
  about: {
    title: "About me",
    paragraphs: [
      "Full-stack developer and AI engineer with 8 years of experience. Tech lead of a C++ vehicle inspection software deployed in workshops and inspection centers across several countries, straddling industrial software, cybersecurity and the modern web stack.",
      "I build products end to end, from idea to MVP in production, focused on AI that actually ships: RAG, agents and LLMs solving real business problems.",
      "I'm creative and self-taught, and what I enjoy most is taking an idea and turning it into something real. Right now I'm all in on artificial intelligence, learning something new every day and putting it into practice. I've loved videogames for as long as I can remember, and that's where the goal behind almost everything I do comes from: turning life into a videogame, making even the most routine things feel fun and motivating. This site is a first example of that.",
    ],
  },
  projects: {
    title: "Projects",
    subtitle: "Things I've built",
    highlightLabel: "The impressive bit",
    items: [
      {
        slug: "workleveling",
        name: "WorkLeveling",
        tagline: "Gamify work with RPG mechanics",
        description:
          "B2B SaaS that turns team progress into levels, XP and quests to boost motivation and make daily progress visible. It fixes the disconnect between effort and the feeling of moving forward.",
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
        slug: "enterprise-ai",
        name: "Enterprise AI",
        tagline: "RAG assistant over technical documentation",
        description:
          "I built an AI for a company: an assistant with RAG over ~50 technical manuals, giving staff precise answers without diving through hundreds of pages of complex documentation.",
        role: "Full design & development",
        highlight:
          "Multi-language (6), full auth and an admin panel. Token cost optimized via context caching and strict per-query PDF filtering.",
        tech: ["PHP", "Gemini API", "RAG", "Stripe"],
        status: "In production",
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
        slug: "industrial-ai",
        name: "AI in industry",
        tagline: "AI, cyber and compliance in real industry",
        description:
          "Integrating AI, cybersecurity and EU compliance inside an industrial company running in daily production. A real case, not a product.",
        role: "IT/cyber lead + development",
        highlight:
          "Led EU Cyber Resilience Act compliance and integrated real hardware (gas analyzers, serial protocols) into inspection software.",
        tech: ["Entra ID", "FortiGate", "ThreatLocker", "C++ Builder"],
        status: "Case study",
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
          "TypeScript · Node",
          "React Native (Android)",
          "Prisma · Supabase · PostgreSQL",
          "Stripe · Clerk · Mapbox · Vercel",
        ],
      },
      {
        name: "Industrial / Systems",
        items: [
          "C++ Builder / VCL · C#",
          "RS-232 serial protocols",
          "Vehicle inspection equipment",
          "PostgreSQL · SQLite",
          "PHP",
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
    text: "I'm open to projects, collaborations and good conversations about applied AI.",
    cta: "Get in touch",
  },
  footer: { rights: "Built with Next.js and Three.js" },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
