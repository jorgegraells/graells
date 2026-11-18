import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/dictionaries";
import {
  antidopPage,
  ANTIDOP_EMAIL,
  ANTIDOP_PLAY_URL,
  type AntidopShot,
} from "@/content/antidop";
import { AntidopFooter, AntidopHeader } from "@/components/antidop/AntidopChrome";

// Página pública de la app ANTIDOP: el gancho, cómo funciona, el juego, sin culpa, privacidad
// y permisos, dónde conseguirla y contacto. Lleva la piel de la app (antidop.css) y su propia
// cabecera y pie: es una web dentro de la web, sin la navegación del portfolio.
// Sin animaciones de entrada ni JavaScript propio: es una página para leer, en el móvil.
// Imágenes con <img> y srcset ya optimizados (pixel art sin reescalar con desenfoque).

const SITE = "https://jorgegraells.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = antidopPage[locale];
  const image = {
    url: `${SITE}/antidop/${locale}/og.jpg`,
    width: 1024,
    height: 500,
    alt: p.ogAlt,
  };
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: {
      canonical: `/${locale}/antidop`,
      languages: { es: "/es/antidop", en: "/en/antidop" },
    },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url: `${SITE}/${locale}/antidop`,
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

function Shot({ shot, locale }: { shot: AntidopShot; locale: Locale }) {
  const base = `/antidop/${locale}/${shot.file}`;
  return (
    <figure className="mx-auto w-full max-w-[300px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}-1080.webp`}
        srcSet={`${base}-540.webp 540w, ${base}-1080.webp 1080w`}
        sizes="(min-width: 768px) 300px, 70vw"
        width={1080}
        height={1920}
        alt={shot.alt}
        loading="lazy"
        decoding="async"
        className="dop-frame h-auto w-full"
      />
      <figcaption className="dop-pix dop-muted mt-4 text-center text-sm uppercase tracking-[0.12em]">
        {shot.caption}
      </figcaption>
    </figure>
  );
}

function Bullets({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-lg leading-relaxed">
          <span aria-hidden="true" className="dop-cyan mt-[0.55rem] h-2.5 w-2.5 shrink-0 bg-current" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Head({ index, tag, title }: { index: string; tag: string; title: string }) {
  return (
    <div>
      <p className="dop-pix dop-cyan text-base uppercase tracking-[0.2em]">
        {index} · {tag}
      </p>
      <h2 className="dop-pix mt-2 text-3xl leading-tight sm:text-4xl md:text-5xl">{title}</h2>
    </div>
  );
}

export default async function AntidopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = antidopPage[locale];

  return (
    <main className="overflow-x-clip">
      <AntidopHeader locale={locale} />

      {/* Portada: el cartel y el gancho, ya en la primera pantalla del móvil */}
      <section className="dop-wrap grid gap-x-12 gap-y-8 pb-16 pt-10 md:grid-cols-2 md:items-center md:pb-24 md:pt-16">
        <div>
          <h1 className="dop-pix text-4xl leading-[1.15] sm:text-5xl lg:text-6xl">{p.title}</h1>
          <p className="mt-6 text-lg leading-relaxed sm:text-xl">{p.lead}</p>
          <p className="dop-pix dop-cyan mt-5 text-2xl sm:text-3xl">{p.hook}</p>
          <ul className="dop-pix mt-6 flex flex-wrap gap-2">
            {p.perks.map((perk) => (
              <li key={perk} className="dop-chip">
                {perk}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            {ANTIDOP_PLAY_URL ? (
              <a href={ANTIDOP_PLAY_URL} className="dop-btn dop-pix">
                <span aria-hidden="true">▶</span>
                {p.playCta}
              </a>
            ) : (
              <>
                <Link href={`/${locale}/antidop/probar`} className="dop-btn dop-pix">
                  {p.testersCta}
                  <span aria-hidden="true">→</span>
                </Link>
                <a href="#como-funciona" className="dop-link dop-pix ml-5 inline-block align-middle">
                  {p.seeCta} <span aria-hidden="true">↓</span>
                </a>
              </>
            )}
          </div>
          {!ANTIDOP_PLAY_URL && (
            <p className="dop-pix dop-muted mt-5 text-sm uppercase tracking-[0.12em]">
              {p.availability}
            </p>
          )}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/antidop/${locale}/lamina-1080.webp`}
          srcSet={`/antidop/${locale}/lamina-540.webp 540w, /antidop/${locale}/lamina-1080.webp 1080w`}
          sizes="(min-width: 1152px) 340px, (min-width: 768px) 30vw, 70vw"
          width={1080}
          height={1920}
          alt={p.heroAlt}
          fetchPriority="high"
          className="dop-frame mx-auto h-auto w-full max-w-[340px]"
        />
      </section>

      <section id="como-funciona" className="dop-wrap scroll-mt-8 py-14 md:py-20">
        <Head index="01" tag={p.howTag} title={p.howTitle} />
        <figure className="mx-auto mt-10 max-w-4xl">
          <video
            className="dop-frame aspect-video w-full"
            controls
            playsInline
            preload="none"
            poster={`/antidop/${locale}/demo-poster.jpg`}
            aria-label={p.videoLabel}
          >
            <source src={`/antidop/${locale}/demo.mp4`} type="video/mp4" />
          </video>
          <figcaption className="dop-pix dop-muted mt-5 text-center text-sm uppercase tracking-[0.12em]">
            {p.videoCaption}
          </figcaption>
        </figure>
        <ol className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {p.steps.map((step, i) => (
            <li key={step.title} className="dop-card">
              <span className="dop-label dop-pix">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="dop-pix text-2xl leading-snug">{step.title}</h3>
              <p className="dop-muted mt-3 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 grid gap-12 sm:grid-cols-2">
          {p.howShots.map((shot) => (
            <Shot key={shot.file} shot={shot} locale={locale} />
          ))}
        </div>
      </section>

      <section className="dop-wrap py-14 md:py-20">
        <Head index="02" tag={p.doTag} title={p.doTitle} />
        <div className="mt-10 max-w-3xl">
          <p className="text-lg leading-relaxed">{p.doIntro}</p>
          <Bullets items={p.doItems} className="mt-6" />
          <p className="dop-pix dop-gold mt-7 text-xl leading-snug sm:text-2xl">{p.doOutro}</p>
        </div>
        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {p.doShots.map((shot) => (
            <Shot key={shot.file} shot={shot} locale={locale} />
          ))}
        </div>
      </section>

      <section className="dop-wrap py-14 md:py-20">
        <Head index="03" tag={p.guiltTag} title={p.guiltTitle} />
        <div className="dop-card mt-12 max-w-4xl sm:p-8">
          <Bullets items={p.guilt} />
        </div>
      </section>

      <section className="dop-wrap py-14 md:py-20">
        <Head index="04" tag={p.privacyTag} title={p.privacyTitle} />
        <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2">
          <div className="dop-card">
            <Bullets items={p.privacyItems} />
            <p className="mt-6 leading-relaxed">
              <Link href={`/${locale}/antidop/privacidad`} className="dop-link">
                {p.privacyLink}
              </Link>
            </p>
          </div>
          <div className="dop-card">
            <span className="dop-label dop-pix">{p.permissionsTitle}</span>
            <dl className="space-y-4">
              {p.permissions.map((perm) => (
                <div key={perm.name}>
                  <dt className="dop-pix dop-cyan text-lg">{perm.name}</dt>
                  <dd className="dop-muted mt-1 leading-relaxed">{perm.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-12 max-w-3xl">
          <h3 className="dop-pix text-2xl">{p.moreTitle}</h3>
          <Bullets items={p.more} className="mt-4" />
        </div>
      </section>

      <section id="conseguirla" className="dop-wrap scroll-mt-8 pb-20 pt-14 md:pt-20">
        <Head index="05" tag={p.getTag} title={p.getTitle} />
        <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2">
          <div className="dop-card">
            <h3 className="dop-pix text-2xl">{p.availabilityHeading}</h3>
            {ANTIDOP_PLAY_URL ? (
              <a href={ANTIDOP_PLAY_URL} className="dop-btn dop-pix mt-4">
                <span aria-hidden="true">▶</span>
                {p.playCta}
              </a>
            ) : (
              <>
                <p className="dop-muted mt-3 leading-relaxed">{p.availability}</p>
                <Link href={`/${locale}/antidop/probar`} className="dop-btn dop-pix mt-5">
                  {p.testersCta}
                  <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
            <h3 className="dop-pix mt-8 text-2xl">{p.makersHeading}</h3>
            <p className="dop-muted mt-3 leading-relaxed">{p.makers}</p>
            <h3 className="dop-pix mt-8 text-2xl">{p.privacyHeading}</h3>
            <p className="mt-3 leading-relaxed">
              <Link href={`/${locale}/antidop/privacidad`} className="dop-link">
                {p.privacyLink}
              </Link>
            </p>
            <p className="dop-muted mt-2 leading-relaxed">
              {p.contactLabel}{" "}
              <a href={`mailto:${ANTIDOP_EMAIL}`} className="dop-link">
                {ANTIDOP_EMAIL}
              </a>
            </p>
          </div>
          <div className="dop-card">
            <h3 className="dop-pix text-2xl">{p.priceHeading}</h3>
            <p className="dop-muted mt-3 leading-relaxed">{p.price}</p>
            <h3 className="dop-pix mt-8 text-2xl">{p.ageHeading}</h3>
            <p className="dop-muted mt-3 leading-relaxed">{p.age}</p>
          </div>
        </div>
      </section>

      <AntidopFooter locale={locale} />
    </main>
  );
}
