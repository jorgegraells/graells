import type { Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";

const NEON = ["#22d3ee", "#a855f7", "#ff3d9a"];

export default function Journey({ dict }: { dict: Dictionary }) {
  return (
    <Section id="journey">
      <SectionHead index="04" tag="QUEST LOG" title={dict.journey.title} />
      <ol className="mt-12 space-y-10 border-l-2 border-neon-violet/25 pl-8">
        {dict.journey.items.map((item, i) => {
          const c = NEON[i % NEON.length];
          return (
            <li key={item.title} className="relative">
              <span
                className="absolute -left-[41px] top-1 grid h-4 w-4 place-items-center rounded-sm"
                style={{
                  background: c,
                  boxShadow: `0 0 14px ${c}`,
                  transform: "rotate(45deg)",
                }}
              />
              <p
                className="font-mono text-xs font-bold uppercase tracking-widest"
                style={{ color: c }}
              >
                {item.period}
              </p>
              <h3 className="mt-1 text-xl font-bold uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
