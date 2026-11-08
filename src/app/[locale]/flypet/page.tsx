import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
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
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHead from "@/components/SectionHead";

// Página pública de la app Flypet: el gancho, qué hace (piezas de la serie explicativa),
// aspectos, lo que es y lo que no, dónde conseguirla, qué cuesta, privacidad y contacto.
// Sin animaciones de entrada ni JavaScript propio: es una página para leer, en el móvil.
// Imágenes con <img> y srcset ya optimizados: no pasan por el optimizador de Vercel.

const SITE = "https://jorgegraells.com";

// Colores neón de cada pieza, como en las tarjetas de proyectos
const NEON = ["#22d3ee", "#ff3d9a", "#c6ff2e", "#a855f7", "#38bdf8", "#fb7185"];

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

function Credit({ credit }: { credit: FlypetCredit }) {
  return (
    <p className="text-xs leading-relaxed text-muted">
      {credit.before}
      <a
        href={FLYPET_CONNECTOME_URL}
        target="_blank"
        rel="noopener"
        className="underline underline-offset-2 hover:text-neon-cyan"
      >
        {credit.source}
      </a>
      {credit.middle}
      <a
        href={FLYPET_LICENSE_URL}
        target="_blank"
        rel="noopener license"
        className="underline underline-offset-2 hover:text-neon-cyan"
      >
        {credit.license}
      </a>
      {credit.after}
    </p>
  );
}

const BUTTON =
  "btn-neon clip-corner inline-flex items-center gap-3 px-7 py-3.5 text-sm font-black uppercase tracking-wide transition-transform hover:scale-[1.04]";

function Feature({
  feature,
  locale,
  credit,
  color,
  flip,
}: {
  feature: FlypetFeature;
  locale: Locale;
  credit: FlypetCredit;
  color: string;
  flip: boolean;
}) {
  const base = `/flypet/${locale}/${feature.file}`;
  return (
    <article className="grid items-center gap-6 md:grid-cols-12 md:gap-10">
      <div className={`md:col-span-5 ${flip ? "md:order-2" : ""}`}>
        <p
          className="font-mono text-xs font-bold uppercase tracking-[0.25em]"
          style={{ color }}
        >
          ◢ {feature.label}
        </p>
        <h3 className="mt-3 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
          {feature.title}
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-foreground/85">{feature.text}</p>
        {feature.credit && (
          <div className="mt-5">
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
        className={`h-auto w-full rounded-2xl border border-white/10 md:col-span-7 ${
          flip ? "md:order-1" : ""
        }`}
        style={{ boxShadow: `0 24px 70px -36px ${color}` }}
      />
    </article>
  );
}

function Chapter({
  id,
  chapter,
  locale,
  credit,
  firstColor = 0,
}: {
  id?: string;
  chapter: FlypetChapter;
  locale: Locale;
  credit: FlypetCredit;
  firstColor?: number;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14 sm:px-6 md:py-20">
      <SectionHead index={chapter.index} tag={chapter.tag} title={chapter.title} />
      <div className="mt-10 space-y-16 md:mt-14 md:space-y-24">
        {chapter.features.map((feature, i) => (
          <Feature
            key={feature.file}
            feature={feature}
            locale={locale}
            credit={credit}
            color={NEON[(firstColor + i) % NEON.length]}
            flip={i % 2 === 1}
          />
        ))}
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
        className="h-auto w-full rounded-2xl border border-white/10"
      />
      <figcaption className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
        {photo.caption}
      </figcaption>
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
  const dict = getDictionary(locale);
  const p = flypetPage[locale];
  const [dorada, coleccionista, porcelana, anime] = p.photos;
  const half = "(min-width: 640px) 33vw, calc(50vw - 28px)";
  const wide = "(min-width: 1152px) 740px, (min-width: 640px) 66vw, calc(100vw - 40px)";

  return (
    <main className="flex-1 overflow-x-clip">
      <Nav locale={locale as Locale} dict={dict} />

      {/* Portada: la mosca y el gancho, ya en la primera pantalla del móvil */}
      <section className="bg-grid">
        <div className="mx-auto grid w-full max-w-6xl gap-x-12 gap-y-6 px-5 pb-14 pt-28 sm:px-6 md:grid-cols-2 md:items-center md:pb-20 md:pt-36">
          <div className="md:self-end">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/flypet/icon.webp"
                width={64}
                height={64}
                alt=""
                className="h-11 w-11 rounded-xl"
              />
              <span className="text-gradient neon-text text-2xl font-black uppercase tracking-tight">
                Flypet
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {p.title}
            </h1>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/flypet/fotos/mosca-1080.webp"
            srcSet="/flypet/fotos/mosca-640.webp 640w, /flypet/fotos/mosca-1080.webp 1080w"
            sizes="(min-width: 1152px) 540px, (min-width: 768px) 48vw, calc(100vw - 40px)"
            width={1080}
            height={1100}
            alt={p.heroAlt}
            fetchPriority="high"
            className="glow-ring h-auto w-full rounded-2xl md:col-start-2 md:row-span-2 md:row-start-1"
          />

          <div className="md:self-start">
            <p className="text-lg leading-relaxed text-foreground/90 sm:text-xl">{p.lead}</p>
            <p className="mt-4 text-xl font-bold text-neon-cyan sm:text-2xl">{p.hook}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.perks.map((perk) => (
                <li
                  key={perk}
                  className="rounded-full border border-neon-violet/40 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground/85"
                >
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
              {FLYPET_PLAY_URL ? (
                <a href={FLYPET_PLAY_URL} className={BUTTON}>
                  <span>▶</span>
                  {p.playCta}
                </a>
              ) : (
                <>
                  <a href="#como-funciona" className={BUTTON}>
                    {p.seeCta}
                    <span>↓</span>
                  </a>
                  <Link
                    href={`/${locale}/flypet/probar`}
                    className="font-mono text-xs font-semibold uppercase tracking-wider text-muted underline underline-offset-4 transition-colors hover:text-neon-cyan"
                  >
                    {p.testersCta} <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
            <div className="mt-6">
              <Credit credit={p.credit} />
            </div>
          </div>
        </div>
      </section>

      <Chapter id="como-funciona" chapter={p.brain} locale={locale} credit={p.credit} />
      <Chapter chapter={p.life} locale={locale} credit={p.credit} firstColor={4} />
      <Chapter chapter={p.yours} locale={locale} credit={p.credit} firstColor={2} />

      {/* Fotos limpias: el momento vistoso, sin marco ni texto encima */}
      <section className="bg-grid">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 md:py-20">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-neon-pink">
            ◢ {p.photosLabel}
          </p>
          <h3 className="text-gradient neon-text mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            {p.photosTitle}
          </h3>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5">
            <Photo photo={dorada} height={1320} sizes={half} />
            <Photo photo={coleccionista} height={1320} sizes={half} />
            <Photo
              photo={porcelana}
              height={1320}
              sizes="(min-width: 640px) 33vw, calc(100vw - 40px)"
              className="col-span-2 sm:col-span-1"
            />
            <Photo photo={anime} height={768} sizes={wide} className="col-span-2" />
            <div className="hud-panel clip-corner col-span-2 flex items-center p-6 sm:col-span-1">
              <p className="text-xl font-bold leading-snug text-foreground">{p.photosText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 md:py-20">
        <Feature
          feature={p.collection}
          locale={locale}
          credit={p.credit}
          color="#c6ff2e"
          flip={false}
        />
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 md:py-20">
        <SectionHead index="04" tag={p.truthTag} title={p.truthTitle} />
        <div className="hud-panel clip-corner mt-10 max-w-4xl space-y-4 p-6 sm:p-8">
          {p.truth.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
          <div className="border-t border-white/10 pt-4">
            <Credit credit={p.credit} />
            <p className="mt-2 text-xs leading-relaxed text-muted">{p.sampleNote}</p>
          </div>
        </div>
      </section>

      <section
        id="conseguirla"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pb-24 pt-14 sm:px-6 md:pt-20"
      >
        <SectionHead index="05" tag={p.getTag} title={p.getTitle} />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="hud-panel clip-corner p-6 sm:p-7">
            <h3 className="text-xl font-bold text-foreground">{p.availabilityHeading}</h3>
            {FLYPET_PLAY_URL ? (
              <a href={FLYPET_PLAY_URL} className={`${BUTTON} mt-4`}>
                <span>▶</span>
                {p.playCta}
              </a>
            ) : (
              <>
                <p className="mt-3 leading-relaxed text-foreground/80">{p.testing}</p>
                <Link href={`/${locale}/flypet/probar`} className={`${BUTTON} mt-4`}>
                  {p.testersCta}
                  <span>→</span>
                </Link>
              </>
            )}
            <h3 className="mt-8 text-xl font-bold text-foreground">{p.makersHeading}</h3>
            <p className="mt-3 leading-relaxed text-foreground/80">{p.makers}</p>
            <h3 className="mt-8 text-xl font-bold text-foreground">{p.privacyHeading}</h3>
            <p className="mt-3 leading-relaxed text-foreground/80">
              <Link
                href={`/${locale}/flypet/privacidad`}
                className="underline underline-offset-4 hover:text-neon-cyan"
              >
                {p.privacyLink}
              </Link>
              {" · "}
              <Link
                href={`/${locale}/flypet/condiciones`}
                className="underline underline-offset-4 hover:text-neon-cyan"
              >
                {p.termsLink}
              </Link>
            </p>
            <p className="mt-2 leading-relaxed text-foreground/80">
              {p.contactLabel}{" "}
              <a
                href={`mailto:${FLYPET_EMAIL}`}
                className="underline underline-offset-4 hover:text-neon-cyan"
              >
                {FLYPET_EMAIL}
              </a>
            </p>
          </div>
          <div className="hud-panel clip-corner p-6 sm:p-7">
            <h3 className="text-xl font-bold text-foreground">{p.priceHeading}</h3>
            <p className="mt-3 leading-relaxed text-foreground/80">{p.price}</p>
          </div>
        </div>
      </section>
      <Footer dict={dict} />
    </main>
  );
}
