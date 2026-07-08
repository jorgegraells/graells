import { siteLinks, type Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";

export default function Contact({ dict }: { dict: Dictionary }) {
  return (
    <Section id="contact" className="text-center">
      <div className="hud-panel hud-corners clip-corner mx-auto max-w-3xl px-6 py-14">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-neon-pink">
          ◢ 06 <span className="mx-2 text-white/25">//</span>
          <span className="text-neon-violet">GAME OVER?</span>
        </p>
        <h2 className="text-gradient neon-text mx-auto mt-4 max-w-2xl text-4xl font-black uppercase tracking-tight sm:text-5xl">
          {dict.contact.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          {dict.contact.text}
        </p>
        <a
          href={`mailto:${siteLinks.email}`}
          className="btn-neon clip-corner mt-9 inline-block px-9 py-4 font-black uppercase tracking-wide transition-transform hover:scale-[1.04]"
        >
          ▶ {dict.contact.cta}
        </a>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-6 font-mono text-sm text-muted">
          <a
            href={siteLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neon-cyan"
          >
            GitHub ↗
          </a>
          <a
            href={siteLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neon-cyan"
          >
            LinkedIn ↗
          </a>
          <a
            href={`mailto:${siteLinks.email}`}
            className="transition-colors hover:text-neon-cyan"
          >
            {siteLinks.email}
          </a>
        </div>
      </div>
    </Section>
  );
}
