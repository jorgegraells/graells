"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";

// Color neón por tarjeta (selector de niveles)
const NEON = ["#22d3ee", "#a855f7", "#ff3d9a", "#c6ff2e", "#38bdf8", "#fb7185"];

export default function Projects({ dict }: { dict: Dictionary }) {
  return (
    <Section id="projects">
      <SectionHead index="02" tag="LEVEL SELECT" title={dict.projects.title} />
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
        {dict.projects.subtitle}
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {dict.projects.items.map((project, i) => {
          const c = NEON[i % NEON.length];
          return (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.12 }}
              className="hud-panel clip-corner group relative flex flex-col p-7 transition-all duration-300 hover:-translate-y-1.5"
              style={
                {
                  borderColor: `${c}55`,
                  "--tw-shadow": "none",
                } as React.CSSProperties
              }
            >
              {/* Etiqueta de nivel */}
              <span
                className="absolute right-5 top-5 font-mono text-[10px] font-bold uppercase tracking-widest"
                style={{ color: c }}
              >
                LVL {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3
                    className="text-2xl font-black uppercase tracking-tight"
                    style={{ color: c, textShadow: `0 0 20px ${c}55` }}
                  >
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-foreground/80">
                    {project.tagline}
                  </p>
                </div>
              </div>

              <span
                className="mt-3 w-fit rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                style={{ borderColor: `${c}88`, color: c, background: `${c}12` }}
              >
                ● {project.status}
              </span>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {project.description}
              </p>

              <div
                className="mt-4 rounded-lg border p-4"
                style={{ borderColor: `${c}25`, background: `${c}0c` }}
              >
                <p
                  className="font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: c }}
                >
                  ★ {dict.projects.highlightLabel}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
                  {project.highlight}
                </p>
              </div>

              <div className="mt-5 flex flex-1 flex-wrap items-end gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-foreground/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">
                {project.role}
              </p>

              {project.links && (
                <div className="mt-2 flex flex-wrap gap-4">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm font-bold hover:underline"
                      style={{ color: c }}
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
