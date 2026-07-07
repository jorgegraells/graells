import { siteLinks, type Dictionary } from "@/i18n/dictionaries";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-neon-violet/15 py-8 text-center font-mono text-xs text-muted">
      <p>
        <span className="text-neon-cyan">◆</span> © {new Date().getFullYear()}{" "}
        Jorge Graells · {dict.footer.rights}
      </p>
      <p className="mt-2 flex items-center justify-center gap-4">
        <a
          href={siteLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-neon-cyan"
        >
          GitHub
        </a>
        <a
          href={siteLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-neon-pink"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
