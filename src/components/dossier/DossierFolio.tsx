/** Hoja del expediente: cabecera, contenido y pie con numeración */
export default function DossierFolio({
  head,
  folio,
  foot,
  id,
  anchor,
  children,
}: {
  head: React.ReactNode;
  folio: React.ReactNode;
  foot: React.ReactNode;
  id?: string;
  anchor?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="dx-folio" id={id} data-anchor={anchor}>
      <div className="dx-fh dx-lab">
        <span>{head}</span>
        <span>{folio}</span>
      </div>
      {children}
      <div className="dx-ff dx-lab">
        <span>{foot}</span>
        <span>{folio}</span>
      </div>
    </article>
  );
}
