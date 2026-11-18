import { socialProfiles, type Dictionary, type Locale } from "@/i18n/dictionaries";
import SubscribeForm from "@/components/SubscribeForm";
import { subscribeEnabled } from "@/lib/subscribe";

/** `subscribe`: idioma del alta al boletín. Sin él no hay formulario (Flypet, y las
 *  páginas que ya llevan el grande, como artículos y noticias). */
export default function Footer({ dict, subscribe }: { dict: Dictionary; subscribe?: Locale }) {
  return (
    <footer className="border-t border-neon-violet/15 py-8 text-center font-mono text-xs text-muted">
      {subscribe && subscribeEnabled && <SubscribeForm locale={subscribe} dict={{ subscribe: dict.subscribe, privacy: dict.privacy }} variant="arcade" compact />}
      <p>
        <span className="text-neon-cyan">◆</span> © {new Date().getFullYear()}{" "}
        Jorge Graells · {dict.footer.rights}
      </p>
      <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <a href={dict.aboutPage.href} className="transition-colors hover:text-neon-cyan">
          {dict.aboutPage.title}
        </a>
        <a href={dict.editorial.href} className="transition-colors hover:text-neon-cyan">
          {dict.editorial.title}
        </a>
        <a href={dict.privacy.href} className="transition-colors hover:text-neon-cyan">
          {dict.privacy.title}
        </a>
        <a href={dict.feed.href} className="transition-colors hover:text-neon-cyan">
          {dict.footer.rss}
        </a>
        {socialProfiles.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neon-cyan"
          >
            {p.label}
          </a>
        ))}
      </p>
    </footer>
  );
}
