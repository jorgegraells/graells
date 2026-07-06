import { siteLinks, type Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";

export default function Contact({ dict }: { dict: Dictionary }) {
  return (
    <Section id="contact" className="text-center">
      <h2 className="text-gradient mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        {dict.contact.title}
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
        {dict.contact.text}
      </p>
      <a
        href={`mailto:${siteLinks.email}`}
        className="glow-ring mt-10 inline-block rounded-full bg-accent/10 px-8 py-4 font-semibold text-accent transition-colors hover:bg-accent/20"
      >
        {dict.contact.cta}
      </a>
      <div className="mt-10 flex items-center justify-center gap-6 font-mono text-sm text-muted">
        <a
          href={siteLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-accent"
        >
          GitHub ↗
        </a>
        <a
          href={siteLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-accent"
        >
          LinkedIn ↗
        </a>
        <a
          href={`mailto:${siteLinks.email}`}
          className="transition-colors hover:text-accent"
        >
          {siteLinks.email}
        </a>
      </div>
    </Section>
  );
}
