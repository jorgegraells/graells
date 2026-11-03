import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Element, ElementContent } from "hast";

type Link = { href: string; text: string };

function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  return node.type === "element" ? node.children.map(textOf).join("") : "";
}

/** Enlaces externos de un bloque, en orden de aparición, con su texto */
function externalLinks(node: Element | ElementContent | undefined, out: Link[] = []): Link[] {
  if (!node || node.type !== "element") return out;
  const href = node.properties?.href;
  if (node.tagName === "a" && typeof href === "string" && href.startsWith("http"))
    out.push({ href, text: textOf(node).trim() });
  node.children.forEach((c) => externalLinks(c, out));
  return out;
}

function host(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

/**
 * Cuerpo Markdown de un artículo. Un solo árbol para los dos modos: las clases
 * de Tailwind dan la estética HUD/neón del modo oscuro y las clases md-* las
 * recoge el modo expediente (dossier.css). En el expediente, cada fuente
 * externa se numera en el texto y se anota al margen, como lápiz rojo.
 */
export default function Markdown({ children }: { children: string }) {
  // Numeración de fuentes por artículo: el bloque que cita una fuente por
  // primera vez la numera y la anota; las repeticiones reutilizan el número.
  const refs = new Map<string, number>();
  const notesFor = (node: Element | undefined) => {
    const fresh: Link[] = [];
    for (const l of externalLinks(node)) {
      if (refs.has(l.href)) continue;
      refs.set(l.href, refs.size + 1);
      fresh.push(l);
    }
    return fresh;
  };
  const withNotes = (block: React.ReactNode, notes: Link[]) =>
    notes.length === 0 ? (
      block
    ) : (
      <div className="md-block">
        {block}
        <aside className="md-notes">
          <ol>
            {notes.map((l) => (
              <li key={l.href}>
                <span className="md-n">{refs.get(l.href)}</span>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {host(l.href)}
                  {l.text && <span className="md-nt"> · {l.text}</span>}
                </a>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="md-h2 mt-12 text-2xl font-black uppercase tracking-tight text-neon-cyan sm:text-3xl">
            <span className="md-glyph mr-2 text-neon-pink">◢</span>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="md-h3 mt-8 text-lg font-bold text-neon-violet sm:text-xl">{children}</h3>
        ),
        p: ({ node, children }) => {
          const notes = notesFor(node);
          return withNotes(<p className="md-p mt-4 leading-relaxed text-foreground/85">{children}</p>, notes);
        },
        a: ({ href, children }) => {
          const external = href?.startsWith("http");
          const n = href ? refs.get(href) : undefined;
          return (
            <>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="md-a font-semibold text-neon-cyan underline decoration-neon-cyan/40 underline-offset-2 hover:decoration-neon-cyan"
              >
                {children}
              </a>
              {external && n && <sup className="md-ref">{n}</sup>}
            </>
          );
        },
        strong: ({ children }) => <strong className="md-strong font-bold text-foreground">{children}</strong>,
        ul: ({ node, children }) => {
          const notes = notesFor(node);
          return withNotes(<ul className="md-ul mt-4 space-y-2 text-foreground/85">{children}</ul>, notes);
        },
        ol: ({ node, children }) => {
          const notes = notesFor(node);
          return withNotes(
            <ol className="md-ol mt-4 list-decimal space-y-2 pl-5 text-foreground/85">{children}</ol>,
            notes,
          );
        },
        li: ({ children }) => (
          <li className="md-li flex gap-2 leading-relaxed">
            <span className="md-glyph mt-1 shrink-0 text-neon-lime">▹</span>
            <span>{children}</span>
          </li>
        ),
        blockquote: ({ node, children }) => {
          const notes = notesFor(node);
          return withNotes(
            <blockquote className="md-quote mt-6 border-l-2 border-neon-pink/50 pl-4 italic text-muted">
              {children}
            </blockquote>,
            notes,
          );
        },
        code: ({ className, children }) => {
          const isBlock = /language-/.test(className ?? "");
          if (isBlock) return <code className={className}>{children}</code>;
          return (
            <code className="md-code rounded bg-neon-violet/15 px-1.5 py-0.5 font-mono text-[0.85em] text-neon-cyan">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="md-pre hud-panel clip-corner mt-6 overflow-x-auto p-4 font-mono text-sm leading-relaxed text-foreground/90">
            {children}
          </pre>
        ),
        table: ({ node, children }) => {
          const notes = notesFor(node);
          return withNotes(
            <div className="md-table mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>,
            notes,
          );
        },
        th: ({ children }) => (
          <th className="border-b border-neon-cyan/30 px-3 py-2 text-left font-mono text-xs uppercase tracking-wider text-neon-cyan">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-white/8 px-3 py-2 align-top text-foreground/85">{children}</td>
        ),
        hr: () => <hr className="md-hr mt-10 border-white/10" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
