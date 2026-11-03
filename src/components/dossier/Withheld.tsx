/** Tachón de un dato que de verdad no se publica. Se puede enfocar y explica por qué falta. */
export default function Withheld({
  label,
  tip,
  children,
  className = "",
}: {
  label: string;
  tip: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`dx-red ${className}`} tabIndex={0} role="img" aria-label={label} data-tip={tip}>
      {children}
    </span>
  );
}
