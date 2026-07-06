import type { Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";

export default function Journey({ dict }: { dict: Dictionary }) {
  return (
    <Section id="journey">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
        04
      </p>
      <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        {dict.journey.title}
      </h2>
      <ol className="mt-12 space-y-10 border-l border-white/10 pl-8">
        {dict.journey.items.map((item) => (
          <li key={item.title} className="relative">
            <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
            <p className="font-mono text-xs uppercase tracking-widest text-accent-2">
              {item.period}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
