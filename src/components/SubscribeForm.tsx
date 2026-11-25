"use client";

import { useState } from "react";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { TOPIC_IDS, type TopicId } from "@/content/topics";

type Status = "idle" | "sending" | "ok" | "invalid" | "noTopic" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Alta en el boletín semanal (Brevo, doble confirmación vía /api/subscribe).
 *  La persona elige de qué temas quiere recibir; por defecto, todos, o solo
 *  `preselect` (p. ej. en la página de un tema). Solo se pinta si la web tiene
 *  Brevo configurado: ver `subscribeEnabled`. */
export default function SubscribeForm({
  locale,
  dict,
  variant,
  compact = false,
  preselect,
}: {
  locale: Locale;
  // Solo lo que usa: es un componente de cliente y sus props viajan en la página
  dict: { subscribe: Dictionary["subscribe"]; privacy: Pick<Dictionary["privacy"], "href" | "title"> };
  variant: "arcade" | "dossier";
  compact?: boolean;
  preselect?: TopicId[];
}) {
  const t = dict.subscribe;
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState<TopicId[]>(
    preselect && preselect.length > 0 ? preselect : [...TOPIC_IDS],
  );
  const [status, setStatus] = useState<Status>("idle");

  function toggle(id: TopicId) {
    setTopics((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : TOPIC_IDS.filter((x) => x === id || current.includes(x)),
    );
    if (status === "noTopic") setStatus("idle");
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = new FormData(e.currentTarget).get("website");
    if (!EMAIL_RE.test(email.trim())) return setStatus("invalid");
    if (topics.length === 0) return setStatus("noTopic");
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale, topics, website }),
      });
      if (res.ok) return setStatus("ok");
      setStatus(res.status === 400 ? "invalid" : "error");
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "ok"
      ? t.ok
      : status === "invalid"
        ? t.invalid
        : status === "noTopic"
          ? t.noTopic
          : status === "error"
            ? t.error
            : null;

  // Campo trampa para bots: invisible para personas y lectores de pantalla
  const honeypot = (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
    />
  );

  const privacyHref = dict.privacy.href;

  const topicBoxes = (className: string, labelClassName: string, legendClassName: string) => (
    <fieldset className={className}>
      <legend className={legendClassName}>{t.topicsLegend}</legend>
      {TOPIC_IDS.map((id) => (
        <label key={id} className={labelClassName}>
          <input
            type="checkbox"
            name="topics"
            value={id}
            checked={topics.includes(id)}
            onChange={() => toggle(id)}
          />
          {t.topicNames[id]}
        </label>
      ))}
    </fieldset>
  );

  if (variant === "dossier") {
    return (
      <form className="dx-sub" onSubmit={submit} noValidate>
        {!compact && <h2>{t.title}</h2>}
        <p>{t.text}</p>
        {status === "ok" ? (
          <p className="dx-sub-msg" role="status">{message}</p>
        ) : (
          <>
            {topicBoxes("dx-sub-topics", "dx-sub-topic", "dx-lab")}
            <div className="dx-sub-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                autoComplete="email"
              />
              <button type="submit" className="dx-btn dx-btn--solid" disabled={status === "sending"}>
                {status === "sending" ? t.sending : t.button}
              </button>
              {honeypot}
            </div>
          </>
        )}
        {message && status !== "ok" && <p className="dx-sub-msg" role="alert">{message}</p>}
        <p className="dx-lab dx-sub-note">
          {t.note} <a href={privacyHref}>{dict.privacy.title}</a>
        </p>
      </form>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={compact ? "mx-auto mb-6 max-w-md px-6 text-left" : "hud-panel clip-corner mt-14 p-6"}
    >
      {!compact && (
        <h2 className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">{t.title}</h2>
      )}
      <p className={`${compact ? "" : "mt-2 "}font-sans text-sm leading-relaxed text-foreground/80`}>{t.text}</p>
      {status === "ok" ? (
        <p className="mt-4 font-sans text-sm text-neon-cyan" role="status">{message}</p>
      ) : (
        <>
          {topicBoxes(
            "mt-4 flex flex-wrap items-center gap-x-4 gap-y-2",
            "flex cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground/85 [&>input]:accent-[#22d3ee]",
            "mb-1 w-full font-mono text-[11px] uppercase tracking-widest text-muted",
          )}
          <div className="relative mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              autoComplete="email"
              className="min-w-0 flex-1 border border-neon-cyan/40 bg-black/40 px-3 py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted focus:border-neon-cyan"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="border border-neon-cyan bg-neon-cyan/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-neon-cyan transition-colors hover:bg-neon-cyan hover:text-black disabled:opacity-60"
            >
              {status === "sending" ? t.sending : t.button}
            </button>
            {honeypot}
          </div>
        </>
      )}
      {message && status !== "ok" && (
        <p className="mt-2 font-sans text-sm text-neon-pink" role="alert">{message}</p>
      )}
      <p className="mt-3 font-mono text-[11px] text-muted">
        {t.note}{" "}
        <a href={privacyHref} className="underline hover:text-neon-cyan">
          {dict.privacy.title}
        </a>
      </p>
    </form>
  );
}
