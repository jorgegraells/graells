// Página pública de la app Flypet, en castellano e inglés.
// Se publica en /[locale]/flypet. Nada de cifras en euros: las pone Google Play en cada país.
// Cuando la app salga en Google Play, pon la URL en FLYPET_PLAY_URL y aparecerá el botón
// arriba y abajo de la página. Hasta entonces no se promete descarga pública.
// Tono y hechos: los de la ficha de Play (marketing/2026-11-06-ficha-play en el repo de la app).
// Piezas, vídeo de cabecera y cifras, al día con la v0.18 (marketing/2026-11-18-web, 2026-11-18).

import type { Locale } from "@/i18n/dictionaries";

export const FLYPET_PLAY_URL: string | null = null;

export const FLYPET_EMAIL = "dev.graells@gmail.com";

export const FLYPET_CONNECTOME_URL = "https://male-cns.janelia.org/download/";
export const FLYPET_LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

/** Una pieza de public/flypet/<locale>/<file>-{720,1200}.webp (1200x1500) con su texto. */
export type FlypetFeature = {
  file: string;
  label: string;
  title: string;
  text: string;
  alt: string;
  /** Explica el conectoma: lleva el crédito debajo del texto */
  credit?: boolean;
};

/** Foto limpia de public/flypet/fotos/<file>-{640,1080}.webp */
export type FlypetPhoto = { file: string; caption: string; alt: string };

export type FlypetChapter = {
  index: string;
  tag: string;
  title: string;
  features: FlypetFeature[];
};

/** El crédito, troceado para enlazar la fuente y la licencia sin cambiar la frase. */
export type FlypetCredit = {
  before: string;
  source: string;
  middle: string;
  license: string;
  after: string;
};

export type FlypetPage = {
  metaTitle: string;
  metaDescription: string;
  ogAlt: string;
  title: string;
  heroAlt: string;
  heroPause: string;
  heroPlay: string;
  lead: string;
  hook: string;
  perks: string[];
  seeCta: string;
  brain: FlypetChapter;
  life: FlypetChapter;
  rastro: FlypetChapter;
  yours: FlypetChapter;
  photosLabel: string;
  photosTitle: string;
  photosText: string;
  photos: FlypetPhoto[];
  collection: FlypetFeature;
  truthTag: string;
  truthTitle: string;
  truth: string[];
  sampleNote: string;
  getTag: string;
  getTitle: string;
  availabilityHeading: string;
  testing: string;
  testersCta: string;
  playCta: string;
  priceHeading: string;
  price: string;
  makersHeading: string;
  makers: string;
  credit: FlypetCredit;
  privacyHeading: string;
  privacyLink: string;
  termsLink: string;
  contactLabel: string;
};

export const flypetPage: Record<Locale, FlypetPage> = {
  es: {
    metaTitle: "Flypet: esta mascota tiene cerebro. En serio.",
    metaDescription:
      "Una mosca de mascota para Android con el cableado de una mosca macho real: 165.122 neuronas simuladas en tu móvil. Asústala, cuídala y pregúntale por qué.",
    ogAlt:
      "Flypet. ¿Qué hará ahora? Huir, comer, limpiarse: lo decide su cerebro. 165.122 neuronas de una mosca real, en tu móvil.",
    title: "Esta mascota tiene cerebro. En serio.",
    heroAlt:
      "Vídeo sin sonido de Flypet. La mosca de cerca y, encima, sus neuronas encendiéndose: «¿Huirá? Lo decide su cerebro». Después huye de un toque, cuenta por qué, come, duerme, recorre un laberinto y enseña su Flydex.",
    heroPause: "Parar el vídeo",
    heroPlay: "Reproducir el vídeo",
    lead: "Lleva dentro el cableado de una mosca macho real: 165.122 neuronas con sus conexiones, simuladas en tu móvil mientras la miras. Cuando huye, come o se limpia, lo decide ese cerebro.",
    hook: "Así que, ¿qué hará ahora? Vas a tener que verlo.",
    perks: ["Gratis", "Sin anuncios", "Sin cuentas", "Sin conexión para jugar"],
    seeCta: "Mira lo que hace",
    brain: {
      index: "01",
      tag: "SU CEREBRO",
      title: "Ábrele la cabeza",
      features: [
        {
          file: "01_como_funciona",
          label: "Cómo funciona",
          title: "El cableado es real. Y ella decide.",
          text: "Sale del microscopio electrónico. Tu móvil lo pone en marcha, con un modelo sencillo para cada neurona. Y según cuáles disparen, ella huye, come, se limpia o echa a andar. Lo que hoy no se puede leer de un conectoma, como el cuerpo o las hormonas del hambre y del sueño, lo simulamos aparte con los estudios publicados hasta 2026, lo más fiel que hemos sabido. En el esquema lo ves.",
          alt: "Esquema en tres pasos: un cableado de verdad, con 165.122 neuronas de una mosca macho; tu móvil lo pone en marcha, con un modelo sencillo de cada neurona; y ella decide. Debajo, dos listas. Lo decide su cerebro: huir, sacar la trompa y comer, limpiarse y andar, si manda su cerebro. Lo simulamos aparte: sentidos, cuerpo y marcha; hambre, sueño y digestión; buscar comida por el olor; echar a andar sin motivo. Debajo, por qué: Un conectoma recoge las conexiones entre neuronas, pero no el cuerpo ni las hormonas del hambre y del sueño. Eso hoy no se puede leer de él, así que lo simulamos con los estudios publicados hasta 2026, lo más fiel que hemos sabido. El olfato sigue un algoritmo publicado, y echar a andar sin motivo es un empujón de la app.",
          credit: true,
        },
        {
          file: "02_porque",
          label: "Por qué",
          title: "Asústala. Luego pregúntale por qué.",
          text: "Dale un toque rápido y suele salir volando. Toca «¿Por qué?» y te cuenta qué vio y qué neuronas saltaron, con nombre y apellidos.",
          alt: "La mosca de cerca y, encima, la hoja «¿Por qué ha huido?»: vio algo grande que se le echaba encima muy deprisa, con las neuronas de la vista LC4 y LPLC2; se activaron sus neuronas de despegue, la fibra gigante DNp01; y saltó y salió volando.",
        },
        {
          file: "03_cerebro",
          label: "Su cerebro, en directo",
          title: "Mira cómo se enciende.",
          text: "165.122 neuronas, y cada chispa es una disparando ahora mismo. Gíralo con un dedo, pellizca para acercarte y toca uno de sus 162 grupos con nombre para saber qué hace.",
          alt: "Su sistema nervioso en 3D sobre fondo negro: 165.122 neuronas, con las que disparan encendidas en dorado, y debajo la lista de 162 grupos de neuronas con nombre.",
        },
        {
          file: "04_laboratorio",
          label: "Laboratorio",
          title: "Apágale una neurona. A ver qué hace.",
          text: "Enciendes y apagas neuronas, adivinas qué hará y lo comparas con lo publicado sobre moscas reales. Los experimentos que empiezan por un sentido (azúcar, algo que se le echa encima, polvo en las alas) son la prueba de fuego: si esta vez no hace lo mismo que las reales, te lo dice. Los que encienden la neurona que da la orden (andar, girar, marcha atrás) no prueban nada, y la app lo avisa: lee esa misma neurona. Sirven para ver qué hace cada orden.",
          alt: "Dos pantallas del experimento «Sin la MN9». La apuesta: «Ahora apagamos la MN9 y le damos azúcar otra vez. ¿Come?», con dos respuestas, «Sí, saca la trompa» y «No, no come». Y el resultado: «Hace lo mismo que las reales»; ni las moscas reales ni la tuya sacan la trompa, y se quedó quieta todo el rato.",
        },
        {
          file: "05_anatomia",
          label: "Anatomía",
          title: "Busca las neuronas de ir marcha atrás.",
          text: "La forma real de sus neuronas en 3D, capa a capa, sacada del mismo escaneado. Las verdes son las MDN: actívalas en el laboratorio y andará hacia atrás.",
          alt: "Dos vistas en 3D de su sistema nervioso: el cerebro translúcido salpicado de puntos dorados y, debajo, las neuronas MDN en verde, entre el cerebro y el cordón nervioso.",
        },
      ],
    },
    life: {
      index: "02",
      tag: "SU VIDA",
      title: "Solo tiene una",
      features: [
        {
          file: "06_dia",
          label: "Día a día",
          title: "¿Le has dado de comer hoy?",
          text: "Le entra hambre, le entra sueño y de noche duerme, con la hora de tu móvil. Ponle uva, plátano, manzana o fresa y mira cómo sube a comer. La fruta madura y se pudre, y lo que ensucia toca barrerlo. Con la app cerrada el tiempo sigue, y al volver te cuenta qué ha pasado.",
          alt: "Dos pantallas de su sala: de día, la mosca comiendo, con su hambre y su sueño en la tarjeta de arriba; y de noche, la misma sala a oscuras con la mosca dormida.",
        },
        {
          file: "13_cuaderno",
          label: "Cuaderno de campo",
          title: "La primera vez que lo hace, queda apuntado.",
          text: "Andar, huir volando, limpiarse la cabeza, comer fruta: cada conducta se apunta sola la primera vez que la hace de verdad, con la neurona que más la empujó y a cuánto disparaba. Si la llevaba una capa de la app y no su cerebro, también lo pone. En la pestaña de al lado esperan 22 logros. Cada tarjeta nueva trae Flycoins.",
          alt: "Dos pantallas del cuaderno de campo. Conductas: «Has visto 6 de 9 conductas», con las tarjetas de Andar, Huir volando, Limpiarse la cabeza y Comer fruta, cada una con la neurona que la empujó y sus Flycoins por recoger. Logros: «Tienes 6 de 22 logros», con el de la uva conseguido y los de las otras frutas por hacer.",
        },
        {
          file: "07_vida",
          label: "Su vida",
          title: "¿Hasta dónde llegará la tuya?",
          text: "Vive unos dos meses, con el reloj de verdad. Y menos si se pasa más de dos días sin comer. Cuando se va, te despides, se queda en tu historial y nace otra.",
          alt: "La mosca patas arriba con la tarjeta «Ha terminado su vida»: vivió 47 días y murió de vieja. Al lado, el historial de moscas: las tres anteriores, cuánto vivió cada una, y la cuarta, recién nacida.",
        },
      ],
    },
    rastro: {
      index: "03",
      tag: "RASTRO",
      title: "No la mueves. La convences.",
      features: [
        {
          file: "11_rastro_nivel",
          label: "El laberinto",
          title: "Una gota, una luz y un susto.",
          text: "Está metida en un laberinto y tiene que salir. Tú no la tocas: le pones una gota de azúcar, enciendes una luz pequeña o le das un susto, y lo que haga con eso lo decide su cerebro. Las herramientas están contadas y el reloj corre. Lo que ve, lo sigue ella. Detrás de una esquina no ve la gota: ahí la lleva la búsqueda por olor, que es una capa de la app, y el juego te lo dice al acabar. Ah, y trepa por las paredes.",
          alt: "Dos pantallas de Rastro, en el mundo Jardín de juguete. La tarjeta del nivel 12, «El rescate»: tres estrellas (salir, en 15 s, con 4 herramientas o menos) y lo que tienes: 2 gotas, 3 luces y 2 sustos. Y el nivel en marcha: un laberinto de setos visto desde arriba, con la mosca yendo hacia una luz y, abajo, los botones Gota, Luz y Susto.",
        },
        {
          file: "12_rastro_mundos",
          label: "Tres mundos",
          title: "20 laberintos. ¿Con cuántas estrellas?",
          text: "Caramelo, Jardín de juguete y Terracota y musgo: 20 niveles, cada vez más retorcidos. Cada uno da hasta tres estrellas: salir, salir rápido y salir gastando pocas herramientas. La primera vez que ganas cada estrella, te llevas Flycoins.",
          alt: "El selector de niveles de Rastro en sus tres mundos: Caramelo, sobre una galleta; Jardín de juguete, sobre césped con flores, y Terracota y musgo, sobre ladrillo. En cada uno, un camino de niveles numerados con sus estrellas; el 18 es el siguiente por jugar y el 19 y el 20 tienen candado.",
        },
      ],
    },
    yours: {
      index: "04",
      tag: "TU PARTE",
      title: "Hazla tuya",
      features: [
        {
          file: "08_decorar",
          label: "Su cuarto",
          title: "Monta su cuarto. Luego entra tú.",
          text: "Una cama, un escritorio, un dado, una geoda: todo a su tamaño, y luces que encender. Cambia el suelo y las paredes. Por la ventana, el sol y la luna van a su hora de verdad, y la luna con su fase. Después abre el candado y pasea por la sala con el mando, a su lado. Con PRO puedes colgar tus propias fotos en sus paredes, con marco. Hay música y efectos, que se ajustan en el menú. La mosca no hace ningún ruido.",
          alt: "Paseo con el mando por un cuarto con mesa y ordenador, cama, mesita y suelo de barro. Al lado, el panel de Decoración, con dado, canica, piedra, flor, minicama, minimesa y más objetos.",
        },
        {
          file: "14_foto",
          label: "Foto",
          title: "Hazle una foto. Sale con su porqué.",
          text: "El botón de la cámara guarda la foto y le escribe debajo qué acaba de hacer y qué neurona lo empujó. Esta dice que sacó la trompa y se puso a comer, con su MN9 a 100 impulsos por segundo en el modelo. Si no acaba de hacer nada que tenga explicación, sale la foto sin porqué. Y desde ahí, la compartes con quien quieras.",
          alt: "Una foto hecha en el juego, como se comparte: la mosca de espaldas, comiendo encima de una uva verde, y debajo su pie: «Sacó la trompa y se puso a comer. Pisó algo dulce: lo notó con las patas. Se activó la neurona que saca la trompa: Motoneurona de la trompa (MN9), 100 impulsos por segundo en el modelo».",
          credit: true,
        },
        {
          file: "09_flycoins",
          label: "Flycoins",
          title: "Cuídala y te lo pagará.",
          text: "Las Flycoins se ganan dándole de comer cuando tiene hambre, limpiando, volviendo cada día, recogiendo lo que se apunta en el libro y sacando estrellas en Rastro, el laberinto. Se gastan en aspectos, decoración y aparatos. Si lo prefieres, también se pueden comprar.",
          alt: "Cómo ganar Flycoins: limpiar con la Escoba, +1; darle de comer cuando tiene hambre, +2, una vez cada 30 minutos; venir cada día, +5 y +1 más por día seguido, hasta 7 días. Debajo, 6 de 22 logros con Flycoins por recoger y tres cosas para las que ahorrar: la Dorada, una casita y un dispensador de comida.",
        },
      ],
    },
    photosLabel: "Aspectos",
    photosTitle: "Cámbiale la pinta.",
    photosText:
      "Cambia su pinta y sigue siendo ella: el aspecto no toca nada de la simulación.",
    photos: [
      {
        file: "dorada",
        caption: "La Dorada no se regala.",
        alt: "La mosca Dorada de cerca, toda de oro pulido con los ojos rojos, en el borde de una geoda de amatista.",
      },
      {
        file: "coleccionista",
        caption: "La Coleccionista no se compra.",
        alt: "La mosca Coleccionista, holográfica y tallada en facetas de colores, como una carta brillante, en el borde de una geoda de amatista.",
      },
      {
        file: "porcelana",
        caption: "La Porcelana, a lo suyo con una fresa.",
        alt: "La mosca Porcelana, blanca con dibujos azules, comiendo encima de una fresa cortada mucho más grande que ella.",
      },
      {
        file: "anime",
        caption: "La Anime, en un salón de los que se decoran.",
        alt: "La mosca Anime, de dibujo animado con ojos grandes, delante de un sofá verde en un salón de paredes rosas.",
      },
    ],
    collection: {
      file: "10_flydex",
      label: "Flydex",
      title: "Que no se te escape ni una.",
      text: "La Flydex tiene 12 moscas: Dorada, Neón, Robot, Anime... Unas se pagan con Flycoins y otras hay que sudarlas: la Leyenda pide todos los logros; la Científica, todo el laboratorio; la Perla, abrir Flypet 30 días seguidos, y la Espectro, tres moscas que lleguen a viejas contigo. Con las 12, te llevas la Coleccionista, un premio que no se compra.",
      alt: "La Flydex del libro: 7 de 12 moscas. Arriba, la Clásica, la Dorada y la Neón; debajo, tres de premio en sombra con lo que piden (la Científica, el laboratorio; la Leyenda, los logros; la Perla, 30 días) y la Coleccionista, también en sombra, el premio por completarla. Al lado, la Coleccionista ya conseguida, holográfica y tallada en facetas, junto a una geoda de amatista.",
    },
    truthTag: "SIN TRUCOS",
    truthTitle: "Lo que es y lo que no",
    truth: [
      "El cableado es real. El modelo de cada neurona es una simplificación (integración y disparo), del tipo que se usa en investigación. Sus sentidos, su cuerpo, el hambre y el sueño los simulamos aparte, a partir de estudios publicados, porque hoy no se pueden leer de un conectoma.",
      "La búsqueda de comida por el olor es un algoritmo publicado, no sale del conectoma, y cuando echa a andar sin motivo es porque la app le da un empujón: sin él se quedaría quieta.",
      "No es una mosca de verdad: es lo más parecido que hemos sabido hacer.",
    ],
    sampleNote:
      "Las pantallas son del juego. Los datos de partida que se ven en ellas (días, monedas, historial, colección) son de ejemplo.",
    getTag: "DÓNDE",
    getTitle: "¿Qué hará ahora?",
    availabilityHeading: "Dónde conseguirla",
    testing:
      "Ahora mismo está en prueba cerrada en Google Play. Si tienes Android, puedes probarla ya y ayudarme a publicarla. Y si la abres 7 días seguidos antes de que salga, te llevas una mosca y una placa que nadie más podrá tener.",
    testersCta: "Hazte probador",
    playCta: "Ver en Google Play",
    priceHeading: "Qué cuesta",
    price:
      "Gratis, sin anuncios. Compras opcionales: Flypet PRO (un solo pago, sin suscripción), el Pack fundador, para quien quiera apoyar el proyecto, y paquetes de Flycoins, la moneda del juego, que también se gana jugando. La placa conmemorativa de fundador, de 2026, es un regalo para quien juegue en los primeros seis meses tras la salida, sin comprar nada.",
    makersHeading: "Quién la hace",
    makers:
      "Flypet lo crea Jorge Graells. El cerebro de la mosca es el conectoma real MaleCNS (Janelia, CC BY).",
    credit: {
      before: "Datos del conectoma: ",
      source: "MaleCNS v1.0",
      middle: ", Janelia Research Campus (FlyEM) y colaboradores, licencia ",
      license: "CC BY 4.0",
      after: ". Janelia no participa en esta app ni la respalda.",
    },
    privacyHeading: "Privacidad y contacto",
    privacyLink: "Política de privacidad de Flypet",
    termsLink: "Condiciones de uso",
    contactLabel: "Contacto:",
  },
  en: {
    metaTitle: "Flypet: this pet actually has a brain.",
    metaDescription:
      "A pet fly for Android, wired like a real male fly: 165,122 neurons simulated on your phone. Spook it, look after it, then ask it why.",
    ogAlt:
      "Flypet. What will it do next? Fleeing, eating, grooming: its brain decides. 165,122 neurons from a real fly, on your phone.",
    title: "This pet actually has a brain.",
    heroAlt:
      'Silent video of Flypet. The fly up close and, above it, its neurons lighting up: "Will it bolt? Its brain decides." Then it bolts from a tap, eats, sleeps and stands in its room.',
    heroPause: "Pause the video",
    heroPlay: "Play the video",
    lead: "Inside is the wiring of a real male fly: 165,122 neurons and their connections, simulated on your phone while you watch. When it bolts, eats or grooms, that brain makes the call.",
    hook: "So what will it do next? You'll have to see.",
    perks: ["Free", "No ads", "No accounts", "No connection needed to play"],
    seeCta: "See what it does",
    brain: {
      index: "01",
      tag: "ITS BRAIN",
      title: "Crack open its head",
      features: [
        {
          file: "01_como_funciona",
          label: "How it works",
          title: "The wiring is real. Then it decides.",
          text: "It was mapped with an electron microscope. Your phone switches it on, with a simple model for each neuron. And depending on which ones fire, it flees, eats, grooms or sets off walking. What can't be read from a connectome yet, like the body or the hormones behind hunger and sleep, we simulate separately using studies published up to 2026, as faithfully as we know how. The diagram shows the split.",
          alt: "Diagram in three steps: real wiring, with 165,122 neurons from a male fly; your phone switches it on, with a simple model of each neuron; then it decides. Below, two lists. Its brain decides: fleeing, extending its proboscis, grooming, and walking if its brain says so. Simulated separately: senses, body and gait; hunger, sleep and digestion; finding food by smell; setting off for no reason. Below, why: A connectome maps the connections between neurons, but not the body or the hormones behind hunger and sleep. Those can't be read from it yet, so we simulate them using studies published up to 2026, as faithfully as we know how. Smell-tracking is a published algorithm, and setting off for no reason is a nudge from the app.",
          credit: true,
        },
        {
          file: "02_porque",
          label: "Why",
          title: "Spook it. Then ask it why.",
          text: 'Give it a quick tap and it\'ll usually take off. Tap "Why?" and it shows you what it saw and which neurons fired, names and all.',
          alt: 'The fly up close with the "Why did it escape?" sheet on top: it saw something big coming at it very fast, through visual neurons LC4 and LPLC2; its takeoff neurons switched on, the giant fiber DNp01; and it jumped and flew off.',
        },
        {
          file: "03_cerebro",
          label: "Its brain, live",
          title: "Watch it light up.",
          text: "165,122 neurons, and every spark is one firing right now. Turn it with one finger, pinch to zoom, and tap any of its 162 named groups to see what it does.",
          alt: "Its nervous system in 3D on a black background: 165,122 neurons, with the ones firing lit up in gold, and below it the list of 162 named groups of neurons.",
        },
        {
          file: "04_laboratorio",
          label: "The lab",
          title: "Switch off a neuron. See what happens.",
          text: "Turn neurons on and off, guess what it'll do, and compare with what's been published about real flies. Experiments that start from a sense (sugar, something looming, dust on its wings) are the real test: if it doesn't do what real flies do this time, it tells you. The ones that switch on the neuron giving the order (walk, turn, reverse) prove nothing, and the app says so: it reads that very neuron. They're there to show what each order does.",
          alt: 'Two screens of the "Without MN9" experiment. The guess: "Now we switch off MN9 and give it sugar again. Does it eat?", with two answers, "Yes, it puts out its proboscis" and "No, it doesn\'t eat". And the result: "It does the same as real flies"; neither real flies nor yours put out the proboscis, and it stayed still the whole time.',
        },
        {
          file: "05_anatomia",
          label: "Anatomy",
          title: "Find the neurons that make it reverse.",
          text: "The real shape of its neurons in 3D, layer by layer, from the same scan. The green ones are MDNs: switch them on in the lab and it walks backward.",
          alt: "Two 3D views of its nervous system: the translucent brain dotted with gold points and, below it, the MDN neurons in green, running between the brain and the nerve cord.",
        },
      ],
    },
    life: {
      index: "02",
      tag: "ITS LIFE",
      title: "It only gets one",
      features: [
        {
          file: "06_dia",
          label: "Day to day",
          title: "Have you fed it today?",
          text: "It gets hungry, it gets sleepy, and it sleeps at night on your phone's clock. Put out some grape, banana, apple or strawberry and watch it climb up to eat. Fruit ripens and rots, and whatever it leaves behind is yours to sweep up. Time keeps going when the app is closed, and when you come back it tells you what you missed.",
          alt: "Two screens of its room: by day, the fly eating, with its hunger and sleep on the card at the top; and at night, the same room in the dark with the fly asleep.",
        },
        {
          file: "13_cuaderno",
          label: "Field notebook",
          title: "First time it does it, it's on record.",
          text: "Walking, flying off, grooming its head, eating fruit: each behaviour gets written down by itself the first time it really happens, with the neuron that pushed hardest and how fast it was firing. If a layer of the app was driving and not its brain, it says that too. One tab over, 22 achievements are waiting. Every new card comes with Flycoins.",
          alt: "Two screens of the field notebook. Behaviours: \"You've seen 6 of 9 behaviours\", with cards for Walking, Fly away in fright, Clean its head and Eat fruit, each with the neuron that drove it and Flycoins to collect. Achievements: \"You have 6 of 22 achievements\", with the grape one earned and the other fruits still to do.",
        },
        {
          file: "07_vida",
          label: "Its life",
          title: "How far will yours make it?",
          text: "It lives about two months, in real time. Fewer if it goes more than two days without food. When it's gone, you say goodbye, it stays in your history, and a new one hatches.",
          alt: 'The fly on its back with the card "Its life has come to an end": it lived 47 days and died of old age. Beside it, the fly history: the three before it, how long each one lived, and the fourth, just hatched.',
        },
      ],
    },
    rastro: {
      index: "03",
      tag: "TRAIL",
      title: "You can't move it. Persuade it.",
      features: [
        {
          file: "11_rastro_nivel",
          label: "The maze",
          title: "A drop, a light and a startle.",
          text: "It's stuck in a maze and has to get out. You don't touch it: you place a sugar drop, switch on a small light or startle it, and its brain decides what to do about that. Tools are limited and the clock is running. What it can see, it follows on its own. Round a corner it can't see the drop: there, smell-tracking takes over, which is a layer of the app, and the game tells you so at the end. Oh, and it climbs the walls.",
          alt: "Two screens of Trail, in the Toy garden world. The card for level 12, \"The rescue\": three stars (exit, in 15 s, with 4 tools or fewer) and what you get: 2 drops, 3 lights and 2 startles. And the level under way: a hedge maze seen from above, with the fly heading for a light and, below, the Drop, Light and Startle buttons.",
        },
        {
          file: "12_rastro_mundos",
          label: "Three worlds",
          title: "20 mazes. How many stars?",
          text: "Candy, Toy garden and Terracotta & moss: 20 levels that keep getting twistier. Each one gives up to three stars: get out, get out fast, and get out using few tools. The first time you win each star, you earn Flycoins.",
          alt: "The Trail level picker in its three worlds: Candy, on a biscuit; Toy garden, on a flowery lawn; and Terracotta & moss, on brick. Each has a path of numbered levels with their stars; level 18 is next to play and 19 and 20 are locked.",
        },
      ],
    },
    yours: {
      index: "04",
      tag: "YOUR MOVE",
      title: "Make it yours",
      features: [
        {
          file: "08_decorar",
          label: "Its room",
          title: "Build its room. Then step inside.",
          text: "A bed, a desk, a die, a geode, all at its scale, plus lights to switch on. Change the floor and walls. Out the window, the sun and moon keep real time, and the moon shows its real phase. Then open the lock and walk around the room with the joystick, right next to it. With PRO you can hang your own photos on its walls, framed. There's music and sound effects, adjustable in the menu. The fly itself makes no sound.",
          alt: "Walking with the joystick around a room with a desk and computer, a bed, a side table and a clay floor. Beside it, the Decoration panel, with a die, marble, stone, flower, mini bed, mini table and more objects.",
        },
        {
          file: "14_foto",
          label: "Photo",
          title: "Take its picture. The why comes with it.",
          text: "The camera button saves the photo and writes underneath what the fly just did and which neuron drove it. This one says it extended its proboscis and started eating, because it stepped on something sweet. If it hasn't just done anything that can be explained, the photo comes out without a why. From there, share it with whoever you like.",
          alt: "A photo taken in the game, as it gets shared: the fly from behind, eating on top of a green grape, with its caption below: \"It extended its proboscis and started eating. It stepped on something sweet: it tasted it with its legs.\"",
          credit: true,
        },
        {
          file: "09_flycoins",
          label: "Flycoins",
          title: "Look after it. It pays off.",
          text: "You earn Flycoins by feeding it when it's hungry, cleaning up, coming back each day, collecting what's noted in the book and winning stars in Trail, the maze game. You spend them on looks, decorations and gadgets. If you'd rather, you can also buy them.",
          alt: "How to earn Flycoins: cleaning up with the Broom, +1; feeding it when it's hungry, +2, once every 30 minutes; coming back every day, +5 plus 1 more for each day in a row, up to 7 days. Below, 6 of 22 achievements with Flycoins to collect and three things worth saving for: the Golden fly, a little house and a food dispenser.",
        },
      ],
    },
    photosLabel: "Looks",
    photosTitle: "Change its look.",
    photosText:
      "Change how it looks and it's still the same fly: its looks don't touch the simulation.",
    photos: [
      {
        file: "dorada",
        caption: "The Golden fly doesn't come cheap.",
        alt: "The Golden fly up close, all polished gold with red eyes, on the edge of an amethyst geode.",
      },
      {
        file: "coleccionista",
        caption: "The Collector can't be bought.",
        alt: "The Collector fly, holographic and cut into coloured facets like a shiny trading card, on the edge of an amethyst geode.",
      },
      {
        file: "porcelana",
        caption: "The Porcelain fly, busy with a strawberry.",
        alt: "The Porcelain fly, white with blue patterns, eating on top of a cut strawberry much bigger than it is.",
      },
      {
        file: "anime",
        caption: "The Anime fly, in a living room you can decorate.",
        alt: "The Anime fly, cartoon-style with big eyes, in front of a green sofa in a room with pink walls.",
      },
    ],
    collection: {
      file: "10_flydex",
      label: "Flydex",
      title: "Don't let a single fly get away.",
      text: "The Flydex has 12 flies: Golden, Neon, Robot, Anime and more. Some cost Flycoins and some you have to really earn: the Legend needs every achievement, the Scientist the whole lab, the Pearl opening Flypet 30 days in a row, and the Specter three flies that reach old age with you. Get all 12 and the Collector is yours, a reward you can't buy.",
      alt: "The Flydex in the book: 7 of 12 flies. At the top, the Classic, the Golden and the Neon; below, three reward flies in shadow with what each takes (the Scientist, the lab; the Legend, achievements; the Pearl, 30 days) and the Collector, also in shadow, the reward for completing it. Next to it, the Collector once earned, holographic and cut into facets, by an amethyst geode.",
    },
    truthTag: "NO TRICKS",
    truthTitle: "What this is and isn't",
    truth: [
      "The wiring is real. The model of each neuron is a simplification (integrate-and-fire), the kind used in research. Its senses, body, hunger and sleep are simulated separately from published studies, because they can't be read from a connectome yet.",
      "Finding food by smell is a published algorithm and doesn't come from the connectome, and when it sets off for no reason, the app gave it a nudge: without one it would just stand there.",
      "It isn't a real fly. It's the closest we've managed.",
    ],
    sampleNote:
      "The screens are from the game. The save data you can see in them (days, coins, history, collection) is sample data.",
    getTag: "WHERE",
    getTitle: "What will it do next?",
    availabilityHeading: "Where to get it",
    testing:
      "It's currently in closed testing on Google Play. If you have Android, you can try it now and help me publish it. Open it 7 days in a row before launch and you'll get a fly and a plaque no one else will ever have.",
    testersCta: "Become a tester",
    playCta: "View on Google Play",
    priceHeading: "What it costs",
    price:
      "Free, with no ads. Optional purchases: Flypet PRO (one payment, no subscription), the Founder pack, for anyone who wants to support the project, and Flycoin packs, the in-game currency, which you also earn by playing. The commemorative 2026 founder plaque is a gift for anyone who plays in the first six months after launch, with nothing to buy.",
    makersHeading: "Who makes it",
    makers:
      "Flypet is created by Jorge Graells. The fly's brain is the real MaleCNS connectome (Janelia, CC BY).",
    credit: {
      before: "Connectome data: ",
      source: "MaleCNS v1.0",
      middle: ", Janelia Research Campus (FlyEM) and collaborators, ",
      license: "CC BY 4.0",
      after: ". Janelia is not involved with and does not endorse this app.",
    },
    privacyHeading: "Privacy and contact",
    privacyLink: "Flypet privacy policy",
    termsLink: "Terms of use",
    contactLabel: "Contact:",
  },
};
