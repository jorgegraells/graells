import type { Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";

export default function Skills({ dict }: { dict: Dictionary }) {
  return (
    <Section id="skills">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
        03
      </p>
      <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        {dict.skills.title}
      </h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dict.skills.groups.map((group) => (
          <div key={group.name} className="glass rounded-2xl p-6">
            <h3 className="font-mono text-sm uppercase tracking-wider text-accent-2">
              {group.name}
            </h3>
            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-foreground/80">
                  <span className="mr-2 text-accent">▹</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
