import { socialProfiles, type Dictionary } from "@/i18n/dictionaries";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-neon-violet/15 py-8 text-center font-mono text-xs text-muted">
      <p>
        <span className="text-neon-cyan">◆</span> © {new Date().getFullYear()}{" "}
        Jorge Graells · {dict.footer.rights}
      </p>
      <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <a href={dict.aboutPage.href} className="transition-colors hover:text-neon-cyan">
          {dict.aboutPage.title}
        </a>
        <a href={dict.editorial.href} className="transition-colors hover:text-neon-cyan">
          {dict.editorial.title}
        </a>
        <a href={dict.privacy.href} className="transition-colors hover:text-neon-cyan">
          {dict.privacy.title}
        </a>
        <a href={dict.feed.href} className="transition-colors hover:text-neon-cyan">
          {dict.footer.rss}
        </a>
        {socialProfiles.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neon-cyan"
          >
            {p.label}
          </a>
        ))}
      </p>
    </footer>
  );
}
