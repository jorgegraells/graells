"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import Section from "@/components/Section";

export default function Projects({ dict }: { dict: Dictionary }) {
  return (
    <Section id="projects">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
        02 · {dict.projects.subtitle}
      </p>
      <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        {dict.projects.title}
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {dict.projects.items.map((project, i) => (
          <motion.article
            key={project.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.12 }}
            className="glass group relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold">{project.name}</h3>
                <p className="mt-1 text-sm font-medium text-accent/90">
                  {project.tagline}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-accent-2/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-2">
                {project.status}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              {project.description}
            </p>

            <div className="mt-4 rounded-xl border border-accent/15 bg-accent/5 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
                {dict.projects.highlightLabel}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
                {project.highlight}
              </p>
            </div>

            <div className="mt-5 flex flex-1 flex-wrap items-end gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-foreground/70"
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className="mt-4 font-mono text-xs text-muted">
              {project.role}
            </p>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm font-semibold text-accent hover:underline"
              >
                {project.url.replace(/^https?:\/\//, "")} ↗
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
