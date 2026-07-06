import type { Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <Section id="about" className="bg-grid rounded-3xl">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
        01
      </p>
      <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        {dict.about.title}
      </h2>
      <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
        {dict.about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}
