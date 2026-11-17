import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
import {
  antidopPage,
  ANTIDOP_EMAIL,
  ANTIDOP_PLAY_URL,
  type AntidopShot,
} from "@/content/antidop";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHead from "@/components/SectionHead";

// Página pública de la app ANTIDOP: el gancho, cómo funciona, el juego, sin culpa, privacidad
// y permisos, dónde conseguirla y contacto. Misma estructura que la de Flypet.
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

const BUTTON =
  "btn-neon clip-corner inline-flex items-center gap-3 px-7 py-3.5 text-sm font-black uppercase tracking-wide transition-transform hover:scale-[1.04]";

const NEON = ["#22d3ee", "#ff3d9a", "#c6ff2e", "#a855f7"];

function Shot({ shot, locale, color }: { shot: AntidopShot; locale: Locale; color: string }) {
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
        className="h-auto w-full rounded-2xl border border-white/10"
        style={{ boxShadow: `0 24px 70px -36px ${color}` }}
      />
      <figcaption className="mt-3 text-center font-mono text-xs uppercase tracking-wider text-muted">
        {shot.caption}
      </figcaption>
    </figure>
  );
}

function Bullets({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-lg leading-relaxed text-foreground/90">
          <span aria-hidden="true" className="mt-0.5 text-neon-cyan">
            ◢
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function AntidopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const p = antidopPage[locale];

  return (
    <main className="flex-1 overflow-x-clip">
      <Nav locale={locale as Locale} dict={dict} />

      {/* Portada: el cartel y el gancho, ya en la primera pantalla del móvil */}
      <section className="bg-grid">
        <div className="mx-auto grid w-full max-w-6xl gap-x-12 gap-y-6 px-5 pb-14 pt-28 sm:px-6 md:grid-cols-2 md:items-center md:pb-20 md:pt-36">
          <div className="md:self-end">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/antidop/icon.webp"
                width={192}
                height={192}
                alt=""
                className="h-11 w-11 rounded-xl"
                style={{ imageRendering: "pixelated" }}
              />
              <span className="text-gradient neon-text text-2xl font-black uppercase tracking-tight">
                ANTIDOP
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {p.title}
            </h1>
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
            className="glow-ring mx-auto h-auto w-full max-w-[340px] rounded-2xl md:col-start-2 md:row-span-2 md:row-start-1"
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
              {ANTIDOP_PLAY_URL ? (
                <a href={ANTIDOP_PLAY_URL} className={BUTTON}>
                  <span>▶</span>
                  {p.playCta}
                </a>
              ) : (
                <a href="#como-funciona" className={BUTTON}>
                  {p.seeCta}
                  <span>↓</span>
                </a>
              )}
            </div>
            {!ANTIDOP_PLAY_URL && (
              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">
                {p.availability}
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14 sm:px-6 md:py-20"
      >
        <SectionHead index="01" tag={p.howTag} title={p.howTitle} />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {p.steps.map((step, i) => (
            <li key={step.title} className="hud-panel clip-corner p-6">
              <p
                className="font-mono text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: NEON[i % NEON.length] }}
              >
                ◢ {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-foreground/80">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {p.howShots.map((shot, i) => (
            <Shot key={shot.file} shot={shot} locale={locale} color={NEON[i]} />
          ))}
        </div>
      </section>

      <section className="bg-grid">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 md:py-20">
          <SectionHead index="02" tag={p.doTag} title={p.doTitle} />
          <div className="mt-10 max-w-3xl">
            <p className="text-lg leading-relaxed text-foreground/90">{p.doIntro}</p>
            <Bullets items={p.doItems} className="mt-6" />
            <p className="mt-6 text-lg font-bold text-neon-cyan">{p.doOutro}</p>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {p.doShots.map((shot, i) => (
              <Shot
                key={shot.file}
                shot={shot}
                locale={locale}
                color={NEON[(i + 2) % NEON.length]}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 md:py-20">
        <SectionHead index="03" tag={p.guiltTag} title={p.guiltTitle} />
        <div className="hud-panel clip-corner mt-10 max-w-4xl p-6 sm:p-8">
          <Bullets items={p.guilt} />
        </div>
      </section>

      <section className="bg-grid">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 md:py-20">
          <SectionHead index="04" tag={p.privacyTag} title={p.privacyTitle} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="hud-panel clip-corner p-6 sm:p-7">
              <Bullets items={p.privacyItems} />
              <p className="mt-6 leading-relaxed text-foreground/80">
                <Link
                  href={`/${locale}/antidop/privacidad`}
                  className="underline underline-offset-4 hover:text-neon-cyan"
                >
                  {p.privacyLink}
                </Link>
              </p>
            </div>
            <div className="hud-panel clip-corner p-6 sm:p-7">
              <h3 className="text-xl font-bold text-foreground">{p.permissionsTitle}</h3>
              <dl className="mt-4 space-y-4">
                {p.permissions.map((perm) => (
                  <div key={perm.name}>
                    <dt className="font-bold text-foreground">{perm.name}</dt>
                    <dd className="mt-1 leading-relaxed text-foreground/80">{perm.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="mt-8 max-w-3xl">
            <h3 className="text-xl font-bold text-foreground">{p.moreTitle}</h3>
            <Bullets items={p.more} className="mt-3" />
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
            {ANTIDOP_PLAY_URL ? (
              <a href={ANTIDOP_PLAY_URL} className={`${BUTTON} mt-4`}>
                <span>▶</span>
                {p.playCta}
              </a>
            ) : (
              <p className="mt-3 leading-relaxed text-foreground/80">{p.availability}</p>
            )}
            <h3 className="mt-8 text-xl font-bold text-foreground">{p.makersHeading}</h3>
            <p className="mt-3 leading-relaxed text-foreground/80">{p.makers}</p>
            <h3 className="mt-8 text-xl font-bold text-foreground">{p.privacyHeading}</h3>
            <p className="mt-3 leading-relaxed text-foreground/80">
              <Link
                href={`/${locale}/antidop/privacidad`}
                className="underline underline-offset-4 hover:text-neon-cyan"
              >
                {p.privacyLink}
              </Link>
            </p>
            <p className="mt-2 leading-relaxed text-foreground/80">
              {p.contactLabel}{" "}
              <a
                href={`mailto:${ANTIDOP_EMAIL}`}
                className="underline underline-offset-4 hover:text-neon-cyan"
              >
                {ANTIDOP_EMAIL}
              </a>
            </p>
          </div>
          <div className="hud-panel clip-corner p-6 sm:p-7">
            <h3 className="text-xl font-bold text-foreground">{p.priceHeading}</h3>
            <p className="mt-3 leading-relaxed text-foreground/80">{p.price}</p>
            <h3 className="mt-8 text-xl font-bold text-foreground">{p.ageHeading}</h3>
            <p className="mt-3 leading-relaxed text-foreground/80">{p.age}</p>
          </div>
        </div>
      </section>
      <Footer dict={dict} />
    </main>
  );
}
