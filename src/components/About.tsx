import type { Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <Section id="about" className="bg-grid rounded-3xl">
      <SectionHead index="01" tag="PLAYER" title={dict.about.title} />
      <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
        {dict.about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}
