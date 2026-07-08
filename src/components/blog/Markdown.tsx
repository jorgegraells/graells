import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renderiza el cuerpo Markdown de un artículo con la estética HUD/neón. */
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="mt-12 text-2xl font-black uppercase tracking-tight text-neon-cyan sm:text-3xl">
            <span className="mr-2 text-neon-pink">◢</span>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 text-lg font-bold text-neon-violet sm:text-xl">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mt-4 leading-relaxed text-foreground/85">{children}</p>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="font-semibold text-neon-cyan underline decoration-neon-cyan/40 underline-offset-2 hover:decoration-neon-cyan"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-foreground">{children}</strong>
        ),
        ul: ({ children }) => (
          <ul className="mt-4 space-y-2 text-foreground/85">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-foreground/85">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="flex gap-2 leading-relaxed">
            <span className="mt-1 shrink-0 text-neon-lime">▹</span>
            <span>{children}</span>
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mt-6 border-l-2 border-neon-pink/50 pl-4 italic text-muted">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const isBlock = /language-/.test(className ?? "");
          if (isBlock) return <code className={className}>{children}</code>;
          return (
            <code className="rounded bg-neon-violet/15 px-1.5 py-0.5 font-mono text-[0.85em] text-neon-cyan">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="hud-panel clip-corner mt-6 overflow-x-auto p-4 font-mono text-sm leading-relaxed text-foreground/90">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b border-neon-cyan/30 px-3 py-2 text-left font-mono text-xs uppercase tracking-wider text-neon-cyan">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-white/8 px-3 py-2 align-top text-foreground/85">
            {children}
          </td>
        ),
        hr: () => <hr className="mt-10 border-white/10" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
