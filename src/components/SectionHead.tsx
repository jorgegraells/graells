export default function SectionHead({
  index,
  title,
  tag,
}: {
  index: string;
  title: string;
  tag?: string;
}) {
  return (
    <div>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-neon-cyan">
        <span className="text-neon-pink">◢</span> {index}
        <span className="mx-2 text-white/25">//</span>
        <span className="text-neon-violet">{tag ?? "SYSTEM"}</span>
      </p>
      <h2 className="neon-text text-gradient mt-3 inline-block text-4xl font-black uppercase tracking-tight sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}
