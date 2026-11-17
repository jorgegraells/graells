// Política de privacidad de la app ANTIDOP (Android), en castellano e inglés.
// Se publica en /[locale]/antidop/privacidad y es el enlace que pide Google Play.
// Si la app cambia lo que hace con los datos, se cambia aquí antes de publicar la versión.
// Origen: docs/play/politica-privacidad-es.md del repo de la app (el inglés es traducción).

import type { Locale } from "@/i18n/dictionaries";

export type AntidopPrivacyBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export type AntidopPrivacySection = { heading: string; blocks: AntidopPrivacyBlock[] };

export type AntidopPrivacyPolicy = {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: AntidopPrivacySection[];
  contact: string;
};

export const antidopPrivacy: Record<Locale, AntidopPrivacyPolicy> = {
  es: {
    title: "Política de privacidad de ANTIDOP",
    description:
      "Qué datos maneja ANTIDOP, la app de Android que bloquea las apps y webs que te roban el tiempo: todo se queda en tu móvil y no envía nada a ningún servidor.",
    updated: "Última actualización: 17 de noviembre de 2026",
    intro:
      "ANTIDOP es una aplicación para Android que te ayuda a usar menos las apps y las webs que tú decides bloquear. Esta página explica qué datos maneja y qué hace con ellos.",
    sections: [
      {
        heading: "En pocas palabras",
        blocks: [
          {
            type: "ul",
            items: [
              "Todo lo que ANTIDOP guarda se queda en tu móvil.",
              "ANTIDOP no envía tus datos a ningún servidor, ni nuestro ni de terceros.",
              "No hay cuentas, ni anuncios, ni herramientas de análisis o seguimiento.",
              "Tú puedes borrarlo todo cuando quieras.",
            ],
          },
        ],
      },
      {
        heading: "Quién es el responsable",
        blocks: [
          { type: "p", text: "Jorge Graells García, España. Contacto: dev.graells@gmail.com" },
          {
            type: "p",
            text: "Como ANTIDOP no recibe ningún dato tuyo, no podemos ver, recuperar ni borrar nada de lo que hay en tu móvil. Eso solo puedes hacerlo tú.",
          },
        ],
      },
      {
        heading: "Qué datos maneja la app y para qué",
        blocks: [
          { type: "p", text: "Todos estos datos se guardan únicamente en tu dispositivo." },
          { type: "h3", text: "Lo que tú escribes" },
          {
            type: "ul",
            items: [
              "Tu nombre o apodo, el motivo por el que usas la app y lo que quieres recuperar.",
              "La lista de apps y webs que quieres bloquear, tus planes, descansos y rutina.",
              "Tus mensajes personales, tus citas, tu diario y tus logros.",
              "Si tu personaje es mujer u hombre y los retoques de su aspecto.",
            ],
          },
          {
            type: "p",
            text: "Sirven para configurar el bloqueo y para enseñarte tus propios mensajes en la pantalla de bloqueo.",
          },
          { type: "h3", text: "Lo que la app mide" },
          {
            type: "ul",
            items: [
              "Cuánto usas las apps que has bloqueado y a qué horas.",
              "Cuántas veces resistes o te rindes ante la pantalla de bloqueo, con su hora y con el nombre de la app o de la web. Este registro se borra solo a los 40 días.",
              "Cuánto tiempo pasas dentro de ANTIDOP cada día, para avisarte si te pasas de 30 minutos.",
            ],
          },
          {
            type: "p",
            text: "Sirven para calcular tu tiempo recuperado, tu reto diario y el progreso de tu personaje.",
          },
          { type: "h3", text: "El historial de uso anterior a la instalación" },
          {
            type: "p",
            text: "Solo se lee si tú lo permites de forma expresa dentro de la app. Se limita a las apps que has elegido y a los 14 días anteriores, y se usa para calcular tu punto de partida. Puedes cambiar esa decisión en Ajustes cuando quieras.",
          },
        ],
      },
      {
        heading: "Permisos de Android y para qué se usan",
        blocks: [
          {
            type: "ul",
            items: [
              "Acceso al uso: saber qué app tienes abierta, para bloquearla, y medir cuánto usas las apps que has bloqueado.",
              "Servicio de accesibilidad: leer la barra de direcciones de tu navegador y comprobar si la web está en tu lista de bloqueo. ANTIDOP no lee el contenido de las páginas. Lo que lee se comprueba en tu móvil y se descarta; solo se guarda el nombre de la web bloqueada cuando resistes o te rindes. Este permiso es opcional.",
              "Mostrar sobre otras apps: enseñar la pantalla de bloqueo.",
              "Acceso a notificaciones (opcional): ocultar los avisos de las apps que has bloqueado mientras haces una tarea de tu rutina. ANTIDOP solo mira qué app envía el aviso, no su contenido.",
              "Notificaciones: el aviso fijo del guardián, el aviso diario del reto si lo activas y los recordatorios de tu rutina.",
              "Inicio al encender: volver a activar el bloqueo cuando reinicias el móvil.",
            ],
          },
        ],
      },
      {
        heading: "Con quién se comparten tus datos",
        blocks: [
          {
            type: "p",
            text: "Con nadie. ANTIDOP no comparte, vende ni cede datos, porque no los recibe.",
          },
        ],
      },
      {
        heading: "Copias de seguridad",
        blocks: [
          {
            type: "ul",
            items: [
              "La copia de seguridad automática de Android está desactivada para ANTIDOP: tus datos no se suben a tu cuenta de Google.",
              "Puedes exportar una copia manual a un fichero. Ese fichero es tuyo y tú decides dónde guardarlo y con quién compartirlo.",
            ],
          },
        ],
      },
      {
        heading: "Cuánto tiempo se guardan y cómo borrarlos",
        blocks: [
          {
            type: "p",
            text: "Tus datos permanecen en tu móvil mientras tengas la app instalada. Para borrarlos:",
          },
          {
            type: "ul",
            items: [
              "Desinstala ANTIDOP, o borra sus datos desde los ajustes de Android. Se elimina todo.",
              "Desde Ajustes → «Zona de peligro» puedes borrar tu personaje y su progreso sin desinstalar.",
            ],
          },
        ],
      },
      {
        heading: "Menores",
        blocks: [{ type: "p", text: "ANTIDOP está pensada para mayores de 16 años." }],
      },
      {
        heading: "Cambios en esta política",
        blocks: [
          {
            type: "p",
            text: "Si la app cambia y empieza a manejar datos de otra forma, actualizaremos esta página y lo indicaremos en la fecha de arriba antes de publicar la versión que lo incluya.",
          },
        ],
      },
    ],
    contact: "Contacto: dev.graells@gmail.com",
  },
  en: {
    title: "ANTIDOP privacy policy",
    description:
      "What data ANTIDOP handles, the Android app that blocks the apps and websites that steal your time: everything stays on your phone and nothing is sent to any server.",
    updated: "Last updated: November 17, 2026",
    intro:
      "ANTIDOP is an Android app that helps you use less the apps and websites you decide to block. This page explains what data it handles and what it does with it.",
    sections: [
      {
        heading: "In short",
        blocks: [
          {
            type: "ul",
            items: [
              "Everything ANTIDOP stores stays on your phone.",
              "ANTIDOP does not send your data to any server, neither ours nor a third party's.",
              "There are no accounts, no ads, and no analytics or tracking tools.",
              "You can delete everything whenever you want.",
            ],
          },
        ],
      },
      {
        heading: "Who is responsible",
        blocks: [
          { type: "p", text: "Jorge Graells García, Spain. Contact: dev.graells@gmail.com" },
          {
            type: "p",
            text: "Because ANTIDOP receives none of your data, we cannot see, recover or delete anything that is on your phone. Only you can do that.",
          },
        ],
      },
      {
        heading: "What data the app handles and why",
        blocks: [
          { type: "p", text: "All of this data is stored only on your device." },
          { type: "h3", text: "What you write" },
          {
            type: "ul",
            items: [
              "Your name or nickname, your reason for using the app and what you want to win back.",
              "The list of apps and websites you want to block, your plans, breaks and routine.",
              "Your personal messages, your quotes, your journal and your achievements.",
              "Whether your character is a woman or a man, and the tweaks you make to its look.",
            ],
          },
          {
            type: "p",
            text: "They are used to set up the blocking and to show you your own messages on the block screen.",
          },
          { type: "h3", text: "What the app measures" },
          {
            type: "ul",
            items: [
              "How much you use the apps you have blocked, and at what times.",
              "How many times you resist or give up at the block screen, with the time and the name of the app or website. This log is deleted automatically after 40 days.",
              "How much time you spend inside ANTIDOP each day, to warn you if you go over 30 minutes.",
            ],
          },
          {
            type: "p",
            text: "They are used to work out your time won back, your daily challenge and your character's progress.",
          },
          { type: "h3", text: "Usage history from before installation" },
          {
            type: "p",
            text: "It is only read if you expressly allow it inside the app. It is limited to the apps you have chosen and the previous 14 days, and it is used to work out your starting point. You can change that decision in Settings whenever you want.",
          },
        ],
      },
      {
        heading: "Android permissions and what they are used for",
        blocks: [
          {
            type: "ul",
            items: [
              "Usage access: to know which app you have open, so it can be blocked, and to measure how much you use the apps you have blocked.",
              "Accessibility service: to read your browser's address bar and check whether the website is on your block list. ANTIDOP does not read the content of pages. What it reads is checked on your phone and discarded; only the name of the blocked website is stored, when you resist or give up. This permission is optional.",
              "Display over other apps: to show the block screen.",
              "Notification access (optional): to hide notifications from the apps you have blocked while you do a task from your routine. ANTIDOP only looks at which app sent the notification, not its content.",
              "Notifications: the guardian's ongoing notification, the daily challenge reminder if you turn it on, and your routine reminders.",
              "Start at boot: to turn blocking back on when you restart your phone.",
            ],
          },
        ],
      },
      {
        heading: "Who your data is shared with",
        blocks: [
          {
            type: "p",
            text: "No one. ANTIDOP does not share, sell or hand over data, because it does not receive it.",
          },
        ],
      },
      {
        heading: "Backups",
        blocks: [
          {
            type: "ul",
            items: [
              "Android's automatic backup is turned off for ANTIDOP: your data is not uploaded to your Google account.",
              "You can export a manual backup to a file. That file is yours, and you decide where to keep it and who to share it with.",
            ],
          },
        ],
      },
      {
        heading: "How long data is kept and how to delete it",
        blocks: [
          {
            type: "p",
            text: "Your data stays on your phone for as long as the app is installed. To delete it:",
          },
          {
            type: "ul",
            items: [
              "Uninstall ANTIDOP, or clear its data from Android's settings. Everything is removed.",
              "From Settings → “Danger zone” you can delete your character and its progress without uninstalling.",
            ],
          },
        ],
      },
      {
        heading: "Minors",
        blocks: [{ type: "p", text: "ANTIDOP is intended for people aged 16 and over." }],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          {
            type: "p",
            text: "If the app changes and starts handling data in a different way, we will update this page and reflect it in the date above before publishing the version that includes the change.",
          },
        ],
      },
    ],
    contact: "Contact: dev.graells@gmail.com",
  },
};
