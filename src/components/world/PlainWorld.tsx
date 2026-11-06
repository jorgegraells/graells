import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { siteLinks } from "@/i18n/dictionaries";

/** Una entrada del tablón del pueblo: lo último publicado en la web. */
export type BoardItem = {
  title: string;
  href: string;
  kind: "news" | "guide";
  date: string;
};

/** Todo lo que cuenta el pueblo, en texto. Es a la vez la vista "saltar el juego",
 *  la alternativa sin WebGL y lo que leen buscadores y lectores de pantalla. */
export default function PlainWorld({
  dict,
  locale,
  board,
}: {
  dict: Dictionary;
  locale: Locale;
  board: BoardItem[];
}) {
  const t = dict.world.plain;
  return (
    <div className="mx-auto max-w-3xl px-5 pb-16 pt-6 text-left text-foreground/90">
      <h2 className="text-3xl font-bold text-white">{t.title}</h2>
      <p className="mt-3 leading-relaxed">{t.intro}</p>

      <h3 className="mt-10 text-xl font-bold text-white">{t.projects}</h3>
      <ul className="mt-4 space-y-6">
        {dict.projects.items.map((p) => (
          <li key={p.slug} className="border-l-2 border-accent/50 pl-4">
            <p className="text-lg font-semibold text-white">
              {p.name}{" "}
              <span className="ml-1 font-mono text-xs uppercase tracking-wider text-accent">
                {p.status}
              </span>
            </p>
            <p className="mt-1 font-medium text-white/90">{p.tagline}</p>
            <p className="mt-2 text-sm leading-relaxed">{p.description}</p>
            <p className="mt-2 text-sm leading-relaxed">{p.highlight}</p>
            <p className="mt-2 font-mono text-xs text-muted">
              {p.tech.join(" · ")} · {p.role}
            </p>
            {p.links?.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="mr-4 mt-2 inline-block text-sm font-semibold text-accent underline underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </li>
        ))}
      </ul>

      <h3 className="mt-10 text-xl font-bold text-white">{dict.journey.title}</h3>
      <ul className="mt-4 space-y-4">
        {dict.journey.items.map((item) => (
          <li key={item.title}>
            <p className="font-mono text-xs uppercase tracking-wider text-accent">{item.period}</p>
            <p className="font-semibold text-white">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed">{item.description}</p>
          </li>
        ))}
      </ul>

      {board.length > 0 && (
        <>
          <h3 className="mt-10 text-xl font-bold text-white">{dict.world.board.title}</h3>
          <ul className="mt-4 space-y-2">
            {board.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm underline underline-offset-4">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-10 text-xl font-bold text-white">{dict.contact.title}</h3>
      <p className="mt-2 text-sm leading-relaxed">{dict.contact.text}</p>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-accent">
        <a className="underline underline-offset-4" href={`mailto:${siteLinks.email}`}>
          {siteLinks.email}
        </a>
        <a className="underline underline-offset-4" href={siteLinks.linkedin}>
          LinkedIn
        </a>
        <a className="underline underline-offset-4" href={siteLinks.github}>
          GitHub
        </a>
        <a className="underline underline-offset-4" href={`/${locale}/training`}>
          {dict.world.board.training}
        </a>
      </p>
    </div>
  );
}
