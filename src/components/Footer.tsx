import { siteLinks, type Dictionary } from "@/i18n/dictionaries";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-white/5 py-8 text-center font-mono text-xs text-muted">
      <p>
        © {new Date().getFullYear()} Jorge Graells · {dict.footer.rights}
      </p>
      <p className="mt-2 flex items-center justify-center gap-4">
        <a
          href={siteLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-accent"
        >
          GitHub
        </a>
        <a
          href={siteLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-accent"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
