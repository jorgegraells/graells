"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";

const NEON = ["#22d3ee", "#a855f7", "#ff3d9a", "#c6ff2e"];
const LEVEL = [96, 92, 90, 88];

export default function Skills({ dict }: { dict: Dictionary }) {
  return (
    <Section id="skills">
      <SectionHead index="03" tag="STATS" title={dict.skills.title} />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dict.skills.groups.map((group, gi) => {
          const c = NEON[gi % NEON.length];
          return (
            <div key={group.name} className="hud-panel clip-corner p-6" style={{ borderColor: `${c}44` }}>
              <div className="flex items-baseline justify-between">
                <h3
                  className="font-mono text-xs font-bold uppercase tracking-wider"
                  style={{ color: c }}
                >
                  {group.name}
                </h3>
                <span className="font-mono text-[10px] text-muted">
                  LV.<span style={{ color: c }}>{LEVEL[gi % LEVEL.length]}</span>
                </span>
              </div>
              {/* Barra de XP */}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${LEVEL[gi % LEVEL.length]}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: gi * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: c, boxShadow: `0 0 10px ${c}` }}
                />
              </div>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-foreground/80">
                    <span className="mr-2" style={{ color: c }}>
                      ▹
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
