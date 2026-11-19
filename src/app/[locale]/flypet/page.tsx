import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/dictionaries";
import {
  flypetPage,
  FLYPET_CONNECTOME_URL,
  FLYPET_EMAIL,
  FLYPET_LICENSE_URL,
  FLYPET_PLAY_URL,
  type FlypetChapter,
  type FlypetCredit,
  type FlypetFeature,
  type FlypetPhoto,
} from "@/content/flypet";
import { FlypetFooter, FlypetHeader } from "@/components/flypet/FlypetChrome";
import FlypetHeroVideo from "@/components/FlypetHeroVideo";

// Página pública de la app Flypet: el gancho, qué hace (piezas de la serie explicativa),
// aspectos, lo que es y lo que no, dónde conseguirla, qué cuesta, privacidad y contacto.
// Lleva la piel del juego (flypet.css, cargada por su layout) y su propia cabecera y pie: es una
// web dentro de la web, sin la navegación del portfolio, como ANTIDOP. Cada sección tiene el color
// de su escena en el anuncio (crema, noche del cerebro, coral, verde, oro, cian, naranja).
// Sin animaciones de entrada: es una página para leer, en el móvil. Solo flotan las pegatinas (CSS,
// y quietas si se pide menos movimiento). El único JavaScript propio es el del vídeo de la portada
// (FlypetHeroVideo), que sin él se queda en su póster.
// Imágenes con <img> y srcset ya optimizados: no pasan por el optimizador de Vercel.

const SITE = "https://jorgegraells.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = flypetPage[locale];
  const image = {
    url: `${SITE}/flypet/${locale}/og.jpg`,
    width: 1024,
    height: 500,
    alt: p.ogAlt,
  };
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: {
      canonical: `/${locale}/flypet`,
      languages: { es: "/es/flypet", en: "/en/flypet" },
    },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url: `${SITE}/${locale}/flypet`,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: p.metaTitle,
      description: p.metaDescription,
      images: [image],
    },
  };
}

type Tone = "crema" | "cerebro" | "coral" | "verde" | "oro" | "cian" | "naranja" | "cierre";

/** Pegatinas recortadas de las tomas del anuncio (public/flypet/pegatinas/<nombre>.webp, 192x192) */
type PegName = "comida" | "gota" | "luz" | "susto" | "estrella" | "dorada" | "neon" | "perla";

/** El texto con su trozo clave en color y con contorno de tinta. Si la clave no está, va tal cual. */
function Keyed({ text, k }: { text: string; k?: string }) {
  const i = k ? text.indexOf(k) : -1;
  if (!k || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="fp-key">{k}</span>
      {text.slice(i + k.length)}
    </>
  );
}

function Peg({
  name,
  className = "",
  rot = -6,
  delay = 0,
  style,
}: {
  name: PegName;
  className?: string;
  rot?: number;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flypet/pegatinas/${name}.webp`}
      width={192}
      height={192}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={`fp-peg ${className}`}
      style={{ "--fp-rot": `${rot}deg`, "--fp-delay": `${delay}s`, ...style } as React.CSSProperties}
    />
  );
}

function Head({
  index,
  tag,
  title,
  k,
  pegs = [],
}: {
  index: string;
  tag: string;
  title: string;
  k?: string;
  pegs?: PegName[];
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="fp-chip fp-chip--tag">
          {index} · {tag}
        </p>
        {pegs.map((name, i) => (
          <Peg
            key={`${name}-${i}`}
            name={name}
            rot={i % 2 ? 7 : -7}
            delay={-i * 1.3}
            className="h-11 w-11 sm:h-14 sm:w-14"
          />
        ))}
      </div>
      <h2 className="fp-display mt-5 text-[2.6rem] sm:text-6xl lg:text-7xl">
        <Keyed text={title} k={k} />
      </h2>
    </div>
  );
}

function Credit({ credit }: { credit: FlypetCredit }) {
  return (
    <p className="fp-muted text-sm leading-relaxed">
      {credit.before}
      <a href={FLYPET_CONNECTOME_URL} target="_blank" rel="noopener" className="fp-link">
        {credit.source}
      </a>
      {credit.middle}
      <a href={FLYPET_LICENSE_URL} target="_blank" rel="noopener license" className="fp-link">
        {credit.license}
      </a>
      {credit.after}
    </p>
  );
}

function Feature({
  feature,
  locale,
  credit,
  flip,
}: {
  feature: FlypetFeature;
  locale: Locale;
  credit: FlypetCredit;
  flip: boolean;
}) {
  const base = `/flypet/${locale}/${feature.file}`;
  return (
    <article className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
      <div className={`fp-card md:col-span-5 ${flip ? "md:order-2" : ""}`}>
        <p className="fp-label">{feature.label}</p>
        <h3 className="fp-display mt-4 text-[1.75rem] sm:text-4xl">{feature.title}</h3>
        <p className="fp-body mt-4">{feature.text}</p>
        {feature.credit && (
          <div className="mt-5">
            <div className="fp-bullet-sep mb-4" aria-hidden="true" />
            <Credit credit={credit} />
          </div>
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}-1200.webp`}
        srcSet={`${base}-720.webp 720w, ${base}-1200.webp 1200w`}
        sizes="(min-width: 1152px) 640px, (min-width: 768px) 56vw, calc(100vw - 40px)"
        width={1200}
        height={1500}
        alt={feature.alt}
        loading="lazy"
        decoding="async"
        className={`fp-shot h-auto w-full md:col-span-7 ${flip ? "md:order-1" : ""}`}
      />
    </article>
  );
}

function Chapter({
  id,
  chapter,
  locale,
  credit,
  tone,
  pegs,
}: {
  id?: string;
  chapter: FlypetChapter;
  locale: Locale;
  credit: FlypetCredit;
  tone: Tone;
  pegs?: PegName[];
}) {
  return (
    <section id={id} className={`fp-sec fp-sec--${tone} scroll-mt-6`}>
      <div className="fp-wrap py-16 md:py-24">
        <Head index={chapter.index} tag={chapter.tag} title={chapter.title} k={chapter.key} pegs={pegs} />
        <div className="mt-10 space-y-14 md:mt-14 md:space-y-24">
          {chapter.features.map((feature, i) => (
            <Feature
              key={feature.file}
              feature={feature}
              locale={locale}
              credit={credit}
              flip={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Photo({
  photo,
  height,
  sizes,
  className = "",
}: {
  photo: FlypetPhoto;
  height: number;
  sizes: string;
  className?: string;
}) {
  const base = `/flypet/fotos/${photo.file}`;
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}-1080.webp`}
        srcSet={`${base}-640.webp 640w, ${base}-1080.webp 1080w`}
        sizes={sizes}
        width={1080}
        height={height}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="fp-photo h-auto w-full"
      />
      <figcaption className="mt-3 text-[0.95rem] font-extrabold leading-snug">{photo.caption}</figcaption>
    </figure>
  );
}

export default async function FlypetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = flypetPage[locale];
  const [dorada, coleccionista, porcelana, anime] = p.photos;
  const half = "(min-width: 640px) 33vw, calc(50vw - 28px)";
  const wide = "(min-width: 1152px) 740px, (min-width: 640px) 66vw, calc(100vw - 40px)";
  const cta = FLYPET_PLAY_URL
    ? { href: FLYPET_PLAY_URL, label: p.playCta, external: true }
    : { href: `/${locale}/flypet/probar`, label: p.testersCta };

  return (
    <main className="flypet">
      {/* Portada: la mosca y el gancho, ya en la primera pantalla del móvil */}
      <section className="fp-sec fp-sec--crema">
        <FlypetHeader locale={locale} cta={cta} />
        <div className="fp-wrap grid gap-x-12 gap-y-8 pb-16 pt-8 md:grid-cols-2 md:items-center md:pb-24 md:pt-14">
          <div className="md:self-end">
            <h1 className="fp-display text-[2.7rem] sm:text-6xl lg:text-7xl">
              <Keyed text={p.title} k={p.titleKey} />
            </h1>
          </div>

          {/* Vídeo vertical, como la pantalla del móvil, con pegatinas del juego flotando a los lados.
              Estrecho en el móvil para que el texto asome debajo. */}
          <div className="relative mx-auto w-[64%] max-w-[280px] md:col-start-2 md:row-span-2 md:row-start-1 md:w-full md:max-w-[340px]">
            <FlypetHeroVideo
              base={`/flypet/${locale}/hero`}
              alt={p.heroAlt}
              pauseLabel={p.heroPause}
              playLabel={p.heroPlay}
              className="w-full"
            />
            <Peg
              name="comida"
              rot={-10}
              className="fp-peg--abs h-14 w-14 md:h-20 md:w-20"
              style={{ left: "-24%", top: "7%" }}
            />
            <Peg
              name="gota"
              rot={8}
              delay={-1.6}
              className="fp-peg--abs h-14 w-14 md:h-[72px] md:w-[72px]"
              style={{ right: "-23%", top: "26%" }}
            />
            <Peg
              name="luz"
              rot={-5}
              delay={-3.1}
              className="fp-peg--abs h-12 w-12 md:h-[68px] md:w-[68px]"
              style={{ left: "-21%", top: "58%" }}
            />
            <Peg
              name="estrella"
              rot={9}
              delay={-4.4}
              className="fp-peg--abs h-14 w-14 md:h-[76px] md:w-[76px]"
              style={{ right: "-20%", top: "74%" }}
            />
          </div>

          <div className="md:self-start">
            <p className="fp-lead">{p.lead}</p>
            <p className="mt-5 text-xl font-black leading-snug sm:text-2xl">{p.hook}</p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {p.perks.map((perk) => (
                <li key={perk} className="fp-chip">
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-5">
              {FLYPET_PLAY_URL ? (
                <a href={FLYPET_PLAY_URL} className="fp-btn">
                  <span aria-hidden="true">▶</span>
                  {p.playCta}
                </a>
              ) : (
                <>
                  <a href="#como-funciona" className="fp-btn">
                    {p.seeCta}
                    <span aria-hidden="true">↓</span>
                  </a>
                  <Link href={`/${locale}/flypet/probar`} className="fp-btn fp-btn--white">
                    {p.testersCta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
            <div className="mt-7">
              <Credit credit={p.credit} />
            </div>
          </div>
        </div>
      </section>

      <Chapter id="como-funciona" chapter={p.brain} locale={locale} credit={p.credit} tone="cerebro" />
      <Chapter chapter={p.life} locale={locale} credit={p.credit} tone="coral" pegs={["comida"]} />
      <Chapter
        chapter={p.rastro}
        locale={locale}
        credit={p.credit}
        tone="verde"
        pegs={["gota", "luz", "susto"]}
      />
      <Chapter chapter={p.yours} locale={locale} credit={p.credit} tone="oro" pegs={["estrella"]} />

      {/* Fotos limpias: el momento vistoso, sin marco de pieza ni texto encima */}
      <section className="fp-sec fp-sec--cian">
        <div className="fp-wrap py-16 md:py-24">
          <div className="flex flex-wrap items-center gap-3">
            <p className="fp-chip fp-chip--tag">{p.photosLabel}</p>
            <Peg name="dorada" rot={-7} className="h-11 w-11 sm:h-14 sm:w-14" />
            <Peg name="perla" rot={7} delay={-1.3} className="h-11 w-11 sm:h-14 sm:w-14" />
            <Peg name="neon" rot={-7} delay={-2.6} className="h-11 w-11 sm:h-14 sm:w-14" />
          </div>
          <h3 className="fp-display mt-5 text-[2.6rem] sm:text-6xl">
            <Keyed text={p.photosTitle} k={p.photosKey} />
          </h3>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
            <Photo photo={dorada} height={1320} sizes={half} />
            <Photo photo={coleccionista} height={1320} sizes={half} />
            <Photo
              photo={porcelana}
              height={1320}
              sizes="(min-width: 640px) 33vw, calc(100vw - 40px)"
              className="col-span-2 sm:col-span-1"
            />
            <Photo photo={anime} height={768} sizes={wide} className="col-span-2" />
            <div className="fp-card col-span-2 flex items-center sm:col-span-1">
              <p className="text-xl font-black leading-snug">{p.photosText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="fp-sec fp-sec--naranja">
        <div className="fp-wrap py-16 md:py-24">
          <Feature feature={p.collection} locale={locale} credit={p.credit} flip={false} />
        </div>
      </section>

      <section className="fp-sec fp-sec--crema">
        <div className="fp-wrap py-16 md:py-24">
          <Head index="05" tag={p.truthTag} title={p.truthTitle} />
          <div className="fp-card mt-10 max-w-4xl space-y-4">
            {p.truth.map((paragraph) => (
              <p key={paragraph} className="fp-body">
                {paragraph}
              </p>
            ))}
            <div className="fp-bullet-sep" aria-hidden="true" />
            <div className="pt-1">
              <Credit credit={p.credit} />
              <p className="fp-muted mt-2 text-sm leading-relaxed">{p.sampleNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="conseguirla" className="fp-sec fp-sec--cierre scroll-mt-6">
        <div className="fp-wrap pb-24 pt-16 md:pt-24">
          <Head
            index="06"
            tag={p.getTag}
            title={p.getTitle}
            k={p.getKey}
            pegs={["comida", "estrella"]}
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="fp-card">
              <h3 className="text-2xl font-black">{p.availabilityHeading}</h3>
              {FLYPET_PLAY_URL ? (
                <a href={FLYPET_PLAY_URL} className="fp-btn mt-5">
                  <span aria-hidden="true">▶</span>
                  {p.playCta}
                </a>
              ) : (
                <>
                  <p className="fp-body mt-3">{p.testing}</p>
                  <Link href={`/${locale}/flypet/probar`} className="fp-btn mt-5">
                    {p.testersCta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
              <h3 className="mt-9 text-2xl font-black">{p.makersHeading}</h3>
              <p className="fp-body mt-3">{p.makers}</p>
              <h3 className="mt-9 text-2xl font-black">{p.privacyHeading}</h3>
              <p className="fp-body mt-3">
                <Link href={`/${locale}/flypet/privacidad`} className="fp-link">
                  {p.privacyLink}
                </Link>
                {" · "}
                <Link href={`/${locale}/flypet/condiciones`} className="fp-link">
                  {p.termsLink}
                </Link>
              </p>
              <p className="fp-body mt-2">
                {p.contactLabel}{" "}
                <a href={`mailto:${FLYPET_EMAIL}`} className="fp-link break-all">
                  {FLYPET_EMAIL}
                </a>
              </p>
            </div>
            <div className="fp-card self-start">
              <h3 className="text-2xl font-black">{p.priceHeading}</h3>
              <p className="fp-body mt-3">{p.price}</p>
            </div>
          </div>
        </div>
      </section>

      <FlypetFooter locale={locale} />
    </main>
  );
}
