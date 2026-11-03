"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import Withheld from "./Withheld";

// Figura interactiva de artículo: el mismo asistente RAG a tres niveles de acceso. Tachar la
// respuesta llega tarde (el modelo ya leyó el dato y lo parafrasea); filtrar
// la búsqueda impide que el fragmento entre en el contexto.
type Mode = "redact" | "filter";
const FRAGMENT_LEVEL = [0, 1, 2];

export default function ProofDemo({ t }: { t: Dictionary["dossier"]["proof"] }) {
  const a = t.answer;
  const [level, setLevel] = useState(0);
  const [mode, setMode] = useState<Mode>("redact");

  const shown = (text: string, cat: string, needed: number) =>
    level >= needed ? <b>{text}</b> : <Withheld label={`${a.redactedLabel}: ${cat}`} tip={cat}>{text}</Withheld>;

  return (
    <>
      <div className="dx-lv">
        <fieldset>
          <legend className="dx-lab">{t.levelLegend}</legend>
          {t.levels.map((name, i) => (
            <label key={name}>
              <input type="radio" name="dx-level" checked={level === i} onChange={() => setLevel(i)} />
              <span>{name}</span>
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend className="dx-lab">{t.modeLegend}</legend>
          <label>
            <input type="radio" name="dx-mode" checked={mode === "redact"} onChange={() => setMode("redact")} />
            <span>{t.modeRedact}</span>
          </label>
          <label>
            <input type="radio" name="dx-mode" checked={mode === "filter"} onChange={() => setMode("filter")} />
            <span>{t.modeFilter}</span>
          </label>
        </fieldset>
      </div>

      <div className="dx-demo">
        <div className="dx-qa">
          <span className="dx-lab">{t.questionLabel}</span>
          <p>{t.question}</p>
          <span className="dx-lab">{t.answerLabel}</span>
          <div className="dx-ans" aria-live="polite">
            {mode === "redact" ? (
              <>
                <p>
                  {a.a1}
                  {shown(a.date, a.catDate, 1)}
                  {a.a2}
                  {shown(a.who, a.catWho, 2)}
                  {a.a3}
                  {shown(a.tolerance, a.catTolerance, 1)}
                  {a.a4}
                  <b>{a.manual}</b>
                  {a.a5}
                </p>
                {level < 2 && (
                  <>
                    <p>
                      <span className="dx-leak">{a.leak}</span>
                    </p>
                    <p className="dx-leaknote">{a.leakNote}</p>
                  </>
                )}
              </>
            ) : (
              <>
                {level === 0 ? (
                  <p>
                    <span className="dx-noacc">{a.noAccess}</span> {a.publicOnly}
                  </p>
                ) : (
                  <p>
                    {a.a1}
                    <b>{a.date}</b>
                    {level >= 2 ? (
                      <>
                        {a.a2}
                        <b>{a.who}</b>
                      </>
                    ) : (
                      "."
                    )}
                    {a.a3}
                    <b>{a.tolerance}</b>
                    {a.a4}
                    <b>{a.manual}</b>
                    {a.a5}
                  </p>
                )}
                {level < 2 && <p className="dx-noacc">{a.noLeak}</p>}
              </>
            )}
          </div>
        </div>
        <div>
          <span className="dx-lab dx-graph" style={{ display: "block", marginBottom: 6 }}>
            {t.fragmentsLabel}
          </span>
          <ul className="dx-frags">
            {t.fragments.map((f, i) => {
              const needed = FRAGMENT_LEVEL[i];
              const inContext = mode === "redact" || level >= needed;
              return (
                <li key={f.name} className={inContext ? "" : "is-out"}>
                  <span className="dx-lab">
                    {t.levels[needed]} · {inContext ? t.inContext : t.outContext}
                  </span>
                  {f.name}. {level >= needed ? f.text : `${t.reserved} ${t.levels[needed].toLowerCase()}.`}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
