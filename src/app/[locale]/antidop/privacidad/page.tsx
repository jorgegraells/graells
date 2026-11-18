import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { antidopPrivacy } from "@/content/antidop-privacy";
import { AntidopFooter, AntidopHeader } from "@/components/antidop/AntidopChrome";

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
  const p = antidopPrivacy[locale];

  return (
    <main>
      <AntidopHeader locale={locale} path="/privacidad" />
      <section className="mx-auto w-full max-w-3xl px-6 pb-20 pt-14">
        <h1 className="dop-pix text-4xl leading-tight sm:text-5xl">
          {p.title}
        </h1>
        <p className="dop-pix dop-muted mt-4 text-sm uppercase tracking-[0.12em]">
          {p.updated}
        </p>
        <p className="mt-8 text-lg leading-relaxed">{p.intro}</p>
        {p.sections.map((s) => (
          <div key={s.heading} className="mt-10">
            <h2 className="dop-pix dop-cyan text-2xl">{s.heading}</h2>
            {s.blocks.map((block) => {
              if (block.type === "h3") {
                return (
                  <h3 key={block.text} className="mt-5 font-bold">
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul
                    key={block.items[0]}
                    className="dop-muted mt-3 list-disc space-y-2 pl-5 leading-relaxed"
                  >
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={block.text} className="dop-muted mt-3 leading-relaxed">
                  {block.text}
                </p>
              );
            })}
          </div>
        ))}
        <p className="dop-muted mt-12 text-sm">{p.contact}</p>
      </section>
      <AntidopFooter locale={locale} path="/privacidad" />
    </main>
  );
}
