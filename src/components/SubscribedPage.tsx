import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n/dictionaries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/** Destino del enlace de confirmación del boletín (/es/suscripcion-confirmada,
 *  /en/subscribed). Fuera del buscador: solo tiene sentido viniendo del correo. */

export function subscribedMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale).subscribe.confirmed;
  return {
    title: `${t.title} | Jorge Graells`,
    robots: { index: false, follow: true },
    alternates: { canonical: t.href },
  };
}

export default function SubscribedPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.subscribe.confirmed;
  return (
    <main className="flex-1">
      <Nav locale={locale} dict={dict} />
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <h1 className="text-gradient neon-text text-4xl font-black uppercase tracking-tight sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-foreground/85">{t.text}</p>
        <Link
          href={`/${locale}/blog`}
          className="mt-10 inline-block font-mono text-xs uppercase tracking-widest text-neon-cyan hover:underline"
        >
          {t.cta} →
        </Link>
      </section>
      <Footer dict={dict} />
    </main>
  );
}
