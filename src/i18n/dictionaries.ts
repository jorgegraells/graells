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
  url?: string;
};

export type Dictionary = {
  nav: { about: string; projects: string; skills: string; contact: string };
  hero: {
    greeting: string;
    name: string;
    role: string;
    tagline: string;
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
    greet: string;
    next: string;
  };
  about: { title: string; paragraphs: string[] };
  projects: { title: string; subtitle: string; highlightLabel: string; items: Project[] };
  skills: {
    title: string;
    groups: { name: string; items: string[] }[];
  };
  contact: { title: string; text: string; cta: string };
  footer: { rights: string };
};

const es: Dictionary = {
  nav: {
    about: "Sobre mí",
    projects: "Proyectos",
    skills: "Stack",
    contact: "Contacto",
  },
  hero: {
    greeting: "Hola, soy",
    name: "Jorge Graells",
    role: "AI Engineer & Full-Stack Developer",
    tagline:
      "IA aplicada de verdad para industria y software regulado: RAG, agentes y LLMs resolviendo problemas reales de empresa.",
    ctaProjects: "Ver proyectos",
    ctaContact: "Hablemos",
    ctaWorld: "Entrar en el mundo virtual de Graells",
    scroll: "Desliza para explorar",
  },
  world: {
    title: "Mundo virtual de Graells",
    loading: "Generando el mundo…",
    hint: "WASD / flechas para moverte · arrastra para mirar · acércate a un vecino y pulsa E",
    hintTouch: "Joystick para moverte · arrastra para mirar · toca a un vecino para hablar",
    hintNear: "Pulsa E para hablar",
    hintNearTouch: "Toca para hablar",
    enterAction: "Hablar",
    close: "Volver al pueblo",
    exit: "Salir del mundo",
    greet: "¡Hola, viajero! Bienvenido a {name}. Deja que te lo cuente…",
    next: "Siguiente",
  },
  about: {
    title: "Sobre mí",
    paragraphs: [
      "Desarrollador full-stack e ingeniero de IA con más de 7 años de experiencia, a caballo entre el software industrial —C++ Builder/VCL para equipos de inspección de vehículos—, la ciberseguridad y el stack web moderno.",
      "Construyo productos de principio a fin, de la idea al MVP en producción, con foco en IA aplicada de verdad: RAG, agentes y LLMs resolviendo problemas reales de empresa.",
      "Lo que me diferencia es el cruce raro de perfiles: entiendo la fábrica y el reglamento europeo, y sé enviar el código.",
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
          "Piloto real en producción con un equipo de software: producto validado en uso diario, no una demo.",
        tech: ["Next.js 15", "React 19", "Prisma", "Supabase", "Clerk"],
        status: "En piloto",
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
        tagline: "Próximamente",
        description:
          "Proyecto en desarrollo. Descripción provisional pendiente del contenido real.",
        role: "Fundador y desarrollador",
        highlight: "Muy pronto más detalles.",
        tech: ["Por definir"],
        status: "En construcción",
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
          "Optimización de coste de tokens",
          "IA integrada en producto real",
        ],
      },
      {
        name: "Web",
        items: [
          "Next.js 15 · React 19",
          "TypeScript · Node",
          "Prisma · Supabase · PostgreSQL",
          "Stripe · Stripe Connect · Clerk",
          "Mapbox · Vercel",
        ],
      },
      {
        name: "Industrial / Sistemas",
        items: [
          "C++ Builder / VCL",
          "Protocolos serie RS-232",
          "Equipos de inspección de vehículos",
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
    contact: "Contact",
  },
  hero: {
    greeting: "Hi, I'm",
    name: "Jorge Graells",
    role: "AI Engineer & Full-Stack Developer",
    tagline:
      "Applied AI for industry and regulated software: RAG, agents and LLMs solving real business problems.",
    ctaProjects: "View projects",
    ctaContact: "Let's talk",
    ctaWorld: "Enter Graells' virtual world",
    scroll: "Scroll to explore",
  },
  world: {
    title: "Graells' virtual world",
    loading: "Generating the world…",
    hint: "WASD / arrows to move · drag to look · walk up to a villager and press E",
    hintTouch: "Joystick to move · drag to look · tap a villager to talk",
    hintNear: "Press E to talk",
    hintNearTouch: "Tap to talk",
    enterAction: "Talk",
    close: "Back to the village",
    exit: "Leave the world",
    greet: "Hi, traveler! Welcome to {name}. Let me tell you about it…",
    next: "Next",
  },
  about: {
    title: "About me",
    paragraphs: [
      "Full-stack developer and AI engineer with 7+ years of experience, straddling industrial software —C++ Builder/VCL for vehicle inspection equipment—, cybersecurity and the modern web stack.",
      "I build products end to end, from idea to MVP in production, focused on AI that actually ships: RAG, agents and LLMs solving real business problems.",
      "What sets me apart is a rare mix of profiles: I understand the factory floor and European regulation, and I know how to ship the code.",
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
          "Real pilot in production with a software team: a product validated in daily use, not a demo.",
        tech: ["Next.js 15", "React 19", "Prisma", "Supabase", "Clerk"],
        status: "In pilot",
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
        tagline: "Coming soon",
        description:
          "Project in development. Placeholder description pending real content.",
        role: "Founder & developer",
        highlight: "More details very soon.",
        tech: ["TBD"],
        status: "In the works",
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
          "Token cost optimization",
          "AI shipped in real products",
        ],
      },
      {
        name: "Web",
        items: [
          "Next.js 15 · React 19",
          "TypeScript · Node",
          "Prisma · Supabase · PostgreSQL",
          "Stripe · Stripe Connect · Clerk",
          "Mapbox · Vercel",
        ],
      },
      {
        name: "Industrial / Systems",
        items: [
          "C++ Builder / VCL",
          "RS-232 serial protocols",
          "Vehicle inspection equipment",
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
