import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";
import { antidopPrivacy } from "@/content/antidop-privacy";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Política de privacidad de la app ANTIDOP: el enlace que pide Google Play y la propia app.

const SITE = "https://jorgegraells.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = antidopPrivacy[locale];
  return {
    title: p.title,
    description: p.description,
    alternates: {
      canonical: `/${locale}/antidop/privacidad`,
      languages: { es: "/es/antidop/privacidad", en: "/en/antidop/privacidad" },
    },
    openGraph: {
      title: p.title,
      description: p.description,
      url: `${SITE}/${locale}/antidop/privacidad`,
      type: "website",
    },
  };
}

export default async function AntidopPrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const p = antidopPrivacy[locale];

  return (
    <main className="flex-1">
      <Nav locale={locale as Locale} dict={dict} />
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <h1 className="text-gradient neon-text text-4xl font-black uppercase tracking-tight sm:text-5xl">
          {p.title}
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {p.updated}
        </p>
        <p className="mt-8 text-lg leading-relaxed text-foreground/90">{p.intro}</p>
        {p.sections.map((s) => (
          <div key={s.heading} className="mt-10">
            <h2 className="text-xl font-bold text-foreground">{s.heading}</h2>
            {s.blocks.map((block) => {
              if (block.type === "h3") {
                return (
                  <h3 key={block.text} className="mt-5 font-bold text-foreground">
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul
                    key={block.items[0]}
                    className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-foreground/80 marker:text-neon-cyan"
                  >
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={block.text} className="mt-3 leading-relaxed text-foreground/80">
                  {block.text}
                </p>
              );
            })}
          </div>
        ))}
        <p className="mt-12 text-sm text-muted">{p.contact}</p>
      </section>
      <Footer dict={dict} />
    </main>
  );
}
