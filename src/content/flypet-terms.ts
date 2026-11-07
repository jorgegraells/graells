// Condiciones de uso de la app Flypet (Android), en castellano e inglés.
// Se publican en /[locale]/flypet/condiciones y es el enlace de «condiciones del servicio» de la
// declaración de comerciante de Google Play. Si cambian los productos o lo que se conserva, se cambia
// aquí antes de publicar la versión.

import type { Locale } from "@/i18n/dictionaries";
import type { PrivacyPolicy } from "@/content/flypet-privacy";

export const flypetTerms: Record<Locale, PrivacyPolicy> = {
  es: {
    title: "Condiciones de uso de Flypet",
    description:
      "Las reglas de Flypet, la mosca virtual con el cerebro de una mosca real: qué compras, qué se conserva y cómo contactar.",
    updated: "Última actualización: 7 de noviembre de 2026",
    intro:
      "Flypet es una app de Jorge Graells Garcia, desarrollador independiente con residencia en España. Al instalarla y usarla aceptas estas condiciones. Están escritas para que se entiendan; si algo no queda claro, escríbenos.",
    sections: [
      {
        heading: "Qué es Flypet",
        paragraphs: [
          "Flypet es un juego: una mosca virtual que se mueve según una simulación de su cerebro hecha con el conectoma MaleCNS (Janelia, licencia CC-BY 4.0). Tiene base científica, pero es un juego, no una herramienta de investigación ni de diagnóstico, y la simulación es una aproximación.",
          "La mosca vive su vida: puede tener hambre, envejecer y morir. Eso es parte del juego, no un fallo. Cuando muere nace otra, y tus Flycoins, tus compras y lo que has desbloqueado se quedan.",
        ],
      },
      {
        heading: "Uso de la app",
        paragraphs: [
          "Te damos permiso para usar Flypet en tus dispositivos para tu uso personal. No puedes revenderla, copiarla para distribuirla ni usarla para hacer trampas o dañar el servicio. Puedes compartir las fotos de tu mosca donde quieras.",
          "El código, el diseño, los textos y los gráficos de Flypet son de Jorge Graells Garcia, salvo los datos del conectoma, que son de Janelia con su licencia. Janelia no participa en la app ni la respalda.",
        ],
      },
      {
        heading: "Compras",
        paragraphs: [
          "Las compras con dinero se hacen y se cobran a través de Google Play, con sus condiciones y su política de reembolsos. El precio, con impuestos, es el que te muestra Google Play antes de pagar.",
          "Flypet PRO y el Pack fundador se pagan una sola vez y no caducan: si cambias de móvil o reinstalas, las recuperas con «Restaurar compras» desde la misma cuenta de Google.",
          "Los paquetes de Flycoins se gastan en el juego. Las Flycoins son una moneda del juego: no tienen valor en dinero, no se pueden cambiar por dinero ni pasar a otra persona, y no se recuperan con «Restaurar compras». Se guardan con tu partida: si borras la app o sus datos sin copia de seguridad de Android, se pierden con ella.",
          "Las Flycoins también se ganan jugando. Lo que consigas con ellas forma parte de tu partida.",
        ],
      },
      {
        heading: "Desistimiento y reembolsos",
        paragraphs: [
          "Lo que compras es contenido digital que se entrega en el momento (salvo los pagos pendientes de aprobación, que se entregan al aprobarse). Si al comprar das tu consentimiento expreso a esa entrega inmediata y reconoces que pierdes el derecho de desistimiento, una vez entregado ya no se aplica el plazo de 14 días (artículo 103.m de la Ley General para la Defensa de los Consumidores y Usuarios).",
          "Eso no quita tus derechos si algo no funciona: si pagas y no recibes lo comprado, o no funciona como se describe, escríbenos: lo arreglamos y, si no se puede, te devolvemos el dinero. Google Play también permite pedir reembolsos según su propia política.",
        ],
      },
      {
        heading: "Cambios en la app",
        paragraphs: [
          "Flypet se actualiza: podemos añadir, cambiar o quitar funciones y contenido. Mientras mantengamos la app, no quitaremos de ella lo que hayas comprado con dinero. Si algún día dejamos de mantener la app, lo diremos con antelación en esta página y en la ficha de Google Play.",
        ],
      },
      {
        heading: "Responsabilidad",
        paragraphs: [
          "Hacemos lo posible para que Flypet funcione bien, pero se ofrece tal cual: puede tener errores y no garantizamos que funcione en todos los móviles. En lo que permita la ley, no respondemos de daños indirectos por usarla. Nada de esto limita los derechos que te da la ley como consumidor.",
        ],
      },
      {
        heading: "Privacidad",
        paragraphs: [
          "Flypet no recoge datos tuyos. Los detalles están en la política de privacidad: https://jorgegraells.com/es/flypet/privacidad",
        ],
      },
      {
        heading: "Ley aplicable y cambios",
        paragraphs: [
          "Estas condiciones se rigen por la ley española, sin perjuicio de los derechos que te dé la ley de tu país de residencia como consumidor. Si cambian, pondremos aquí la fecha nueva; los cambios importantes los diremos también en las novedades de la versión.",
        ],
      },
    ],
    contact: "Contacto: Jorge Graells Garcia · dev.graells@gmail.com",
  },
  en: {
    title: "Flypet terms of use",
    description:
      "The rules of Flypet, the virtual fly with a real fly's brain: what you buy, what you keep and how to get in touch.",
    updated: "Last updated: 7 November 2026",
    intro:
      "Flypet is an app by Jorge Graells Garcia, an independent developer based in Spain. By installing and using it you accept these terms. They're written to be understood; if anything isn't clear, write to us.",
    sections: [
      {
        heading: "What Flypet is",
        paragraphs: [
          "Flypet is a game: a virtual fly that moves according to a simulation of its brain built from the MaleCNS connectome (Janelia, CC-BY 4.0 licence). It's science-based, but it's a game, not a research or diagnostic tool, and the simulation is an approximation.",
          "The fly lives its life: it can get hungry, grow old and die. That's part of the game, not a bug. When it dies another one is born, and your Flycoins, your purchases and what you've unlocked stay with you.",
        ],
      },
      {
        heading: "Using the app",
        paragraphs: [
          "We give you permission to use Flypet on your devices for your personal use. You may not resell it, copy it to distribute it, or use it to cheat or harm the service. You're free to share photos of your fly wherever you like.",
          "Flypet's code, design, text and graphics belong to Jorge Graells Garcia, except the connectome data, which belongs to Janelia under its licence. Janelia isn't involved in the app and doesn't endorse it.",
        ],
      },
      {
        heading: "Purchases",
        paragraphs: [
          "Purchases with money are made and charged through Google Play, under its terms and refund policy. The price, including taxes, is the one Google Play shows you before you pay.",
          "Flypet PRO and the Founder pack are paid for once and don't expire: if you change phones or reinstall, you get them back with \"Restore purchases\" from the same Google account.",
          "Flycoin packs are spent in the game. Flycoins are an in-game currency: they have no cash value, can't be exchanged for money or transferred to anyone else, and aren't returned by \"Restore purchases\". They're saved with your game: if you delete the app or its data without an Android backup, they're lost with it.",
          "You can also earn Flycoins by playing. What you get with them is part of your game.",
        ],
      },
      {
        heading: "Withdrawal and refunds",
        paragraphs: [
          "What you buy is digital content delivered immediately (except payments pending approval, which are delivered once approved). If, when buying, you expressly consent to that immediate delivery and acknowledge that you lose the right of withdrawal, the 14-day period no longer applies once it's delivered (article 103(m) of the Spanish General Law for the Defence of Consumers and Users).",
          "That doesn't take away your rights if something doesn't work: if you pay and don't get what you bought, or it doesn't work as described, write to us: we'll fix it and, if we can't, we'll refund you. Google Play also allows refund requests under its own policy.",
        ],
      },
      {
        heading: "Changes to the app",
        paragraphs: [
          "Flypet gets updated: we may add, change or remove features and content. While we maintain the app, we won't remove from it what you've bought with money. If we ever stop maintaining the app, we'll say so in advance on this page and on the Google Play listing.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "We do our best to make Flypet work well, but it's provided as is: it may have bugs and we don't guarantee it works on every phone. To the extent the law allows, we're not liable for indirect damages from using it. Nothing here limits the rights the law gives you as a consumer.",
        ],
      },
      {
        heading: "Privacy",
        paragraphs: [
          "Flypet doesn't collect your data. The details are in the privacy policy: https://jorgegraells.com/en/flypet/privacidad",
        ],
      },
      {
        heading: "Governing law and changes",
        paragraphs: [
          "These terms are governed by Spanish law, without prejudice to the rights the law of your country of residence gives you as a consumer. If they change, we'll put the new date here; important changes will also be mentioned in the release notes.",
        ],
      },
    ],
    contact: "Contact: Jorge Graells Garcia · dev.graells@gmail.com",
  },
};
