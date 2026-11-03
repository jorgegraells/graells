import type { Dictionary } from "@/i18n/dictionaries";
import ProofDemo from "@/components/dossier/ProofDemo";

/**
 * Figuras interactivas que un artículo puede insertar en su Markdown con un
 * bloque de código de lenguaje `figura` cuyo contenido es el id:
 *
 *     ```figura
 *     rag-niveles
 *     ```
 */
export function articleFigures(dict: Dictionary): Record<string, React.ReactNode> {
  const proof = dict.dossier.proof;
  return {
    "rag-niveles": (
      <>
        <div className="md-figure-head dx-lab">
          <span>{proof.section}</span>
          <span>{proof.title}</span>
        </div>
        <p className="md-figure-intro">{proof.intro}</p>
        <ProofDemo t={proof} />
        <figcaption className="md-figure-cap dx-lab">{proof.footer}</figcaption>
      </>
    ),
  };
}
