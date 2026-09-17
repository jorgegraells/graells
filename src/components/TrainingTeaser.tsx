import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";

// Colores neón de cada formación (ciberseguridad, IA)
const NEON = ["#22d3ee", "#a855f7"];

export default function TrainingTeaser({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Section id="training">
      <SectionHead index="05" tag={dict.training.tag} title={dict.training.title} />
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        {dict.training.teaser}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {dict.training.courses.map((course, i) => {
          const c = NEON[i % NEON.length];
          return (
            <Link
              key={course.name}
              href={`/${locale}/training`}
              className="hud-panel clip-corner group flex flex-col p-6 transition-transform duration-300 hover:-translate-y-1.5"
              style={{ borderColor: `${c}55` }}
            >
              <h3
                className="text-xl font-black uppercase tracking-tight"
                style={{ color: c, textShadow: `0 0 20px ${c}44` }}
              >
                {course.name}
              </h3>
              <p className="mt-1 flex-1 text-sm text-foreground/80">
                {course.tagline}
              </p>
              <p
                className="mt-4 font-mono text-xs font-bold uppercase tracking-widest transition-transform group-hover:translate-x-1"
                style={{ color: c }}
              >
                {dict.training.teaserCta} →
              </p>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
