"use client";

import { useCallback, useEffect, useState } from "react";
import Markdown from "@/components/blog/Markdown";

/** Panel de administración de contenido. Fase 1: artículos del blog.
 *  En dev guarda directo a disco; en producción publica haciendo un commit
 *  al repo vía GitHub, y Vercel despliega solo. */

type LocaleData = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  body: string;
};

type ArticleFile = { date: string; es: LocaleData; en: LocaleData };
type Entry = { file: string; data: ArticleFile };

const EMPTY_LOCALE: LocaleData = {
  slug: "",
  title: "",
  description: "",
  tags: [],
  body: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [tab, setTab] = useState<"es" | "en">("es");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const loadArticles = useCallback(async () => {
    const res = await fetch("/api/admin/articles");
    if (res.ok) setEntries((await res.json()).articles);
    else setMsg({ ok: false, text: (await res.json()).error || "Error al cargar" });
  }, []);

  useEffect(() => {
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((j) => setAuthed(j.authenticated));
  }, []);

  useEffect(() => {
    if (authed) loadArticles();
  }, [authed, loadArticles]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      setAuthed(true);
      setMsg(null);
    } else {
      setMsg({ ok: false, text: "Contraseña incorrecta" });
    }
  };

  const newArticle = () => {
    setEditing({
      file: "",
      data: {
        date: new Date().toISOString().slice(0, 10),
        es: { ...EMPTY_LOCALE },
        en: { ...EMPTY_LOCALE },
      },
    });
    setTab("es");
    setPreview(false);
    setMsg(null);
  };

  const publish = async () => {
    if (!editing) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: editing.file || undefined, data: editing.data }),
    });
    const j = await res.json();
    setBusy(false);
    if (res.ok) {
      setMsg({
        ok: true,
        text: j.committed
          ? "Publicado: commit hecho, Vercel está desplegando (~2 min)"
          : "Guardado en local: recarga el blog del dev server para verlo",
      });
      setEditing((prev) => (prev ? { ...prev, file: j.file } : prev));
      loadArticles();
    } else {
      setMsg({ ok: false, text: j.error || "Error al guardar" });
    }
  };

  const setLocaleField = (
    locale: "es" | "en",
    field: keyof LocaleData,
    value: string,
  ) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const current = prev.data[locale];
      const next: LocaleData = {
        ...current,
        [field]: field === "tags" ? value.split(",").map((s) => s.trim()).filter(Boolean) : value,
      };
      // En artículos nuevos, el slug se propone solo a partir del título
      if (field === "title" && !prev.file) next.slug = slugify(value);
      return { ...prev, data: { ...prev.data, [locale]: next } };
    });
  };

  // ---- Pantalla de login -------------------------------------------------
  if (authed === null) {
    return <p className="p-10 font-mono text-sm text-muted">Cargando…</p>;
  }
  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={login} className="glass clip-corner w-full max-w-sm p-8">
          <h1 className="font-mono text-sm font-black uppercase tracking-widest">
            <span className="text-gradient">jorge</span>
            <span className="text-muted">graells</span>
            <span className="text-neon-pink">.admin</span>
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            className="mt-6 w-full rounded-md border border-white/15 bg-black/30 px-4 py-3 text-sm outline-none focus:border-neon-cyan/60"
          />
          {msg && !msg.ok && (
            <p className="mt-3 text-sm text-neon-pink">{msg.text}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="btn-neon clip-corner mt-5 w-full px-6 py-3 text-sm font-black uppercase tracking-wide disabled:opacity-50"
          >
            Entrar
          </button>
        </form>
      </main>
    );
  }

  // ---- Editor ------------------------------------------------------------
  if (editing) {
    const d = editing.data[tab];
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-neon-cyan"
          >
            ← Volver a la lista
          </button>
          <div className="flex items-center gap-3">
            <label className="font-mono text-xs uppercase text-muted">
              Fecha{" "}
              <input
                type="date"
                value={editing.data.date}
                onChange={(e) =>
                  setEditing((p) =>
                    p ? { ...p, data: { ...p.data, date: e.target.value } } : p,
                  )
                }
                className="ml-1 rounded-md border border-white/15 bg-black/30 px-2 py-1 text-xs text-foreground"
              />
            </label>
            <button
              type="button"
              onClick={publish}
              disabled={busy}
              className="btn-neon clip-corner px-6 py-2.5 text-sm font-black uppercase tracking-wide disabled:opacity-50"
            >
              {busy ? "Publicando…" : "▶ Publicar"}
            </button>
          </div>
        </div>

        {msg && (
          <p
            className={`mt-4 rounded-md border px-4 py-2.5 text-sm ${
              msg.ok
                ? "border-neon-lime/40 text-neon-lime"
                : "border-neon-pink/40 text-neon-pink"
            }`}
          >
            {msg.text}
          </p>
        )}

        {/* Pestañas de idioma + vista previa */}
        <div className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
          {(["es", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setTab(l)}
              className={`clip-corner px-4 py-2 font-bold ${
                tab === l
                  ? "bg-neon-cyan/15 text-neon-cyan"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
          <span className="mx-2 text-white/20">|</span>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className={`clip-corner px-4 py-2 font-bold ${
              preview ? "bg-neon-violet/15 text-neon-violet" : "text-muted hover:text-foreground"
            }`}
          >
            {preview ? "Editar" : "Vista previa"}
          </button>
        </div>

        {preview ? (
          <div className="hud-panel clip-corner mt-4 p-8">
            <h1 className="text-gradient text-3xl font-black uppercase leading-tight tracking-tight">
              {d.title || "(sin título)"}
            </h1>
            <p className="mt-4 border-l-2 border-neon-cyan/50 pl-4 text-lg text-foreground/90">
              {d.description}
            </p>
            <div className="mt-6">
              <Markdown>{d.body}</Markdown>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            <input
              value={d.title}
              onChange={(e) => setLocaleField(tab, "title", e.target.value)}
              placeholder={tab === "es" ? "Título" : "Title"}
              className="w-full rounded-md border border-white/15 bg-black/30 px-4 py-3 text-lg font-bold outline-none focus:border-neon-cyan/60"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={d.slug}
                onChange={(e) => setLocaleField(tab, "slug", e.target.value)}
                placeholder="slug-del-articulo"
                className="w-full rounded-md border border-white/15 bg-black/30 px-4 py-2.5 font-mono text-sm outline-none focus:border-neon-cyan/60"
              />
              <input
                value={d.tags.join(", ")}
                onChange={(e) => setLocaleField(tab, "tags", e.target.value)}
                placeholder="Tags separados por comas"
                className="w-full rounded-md border border-white/15 bg-black/30 px-4 py-2.5 font-mono text-sm outline-none focus:border-neon-cyan/60"
              />
            </div>
            <textarea
              value={d.description}
              onChange={(e) => setLocaleField(tab, "description", e.target.value)}
              placeholder={
                tab === "es"
                  ? "Descripción: respuesta directa que hace de entradilla y meta description"
                  : "Description: direct answer used as lead and meta description"
              }
              rows={3}
              className="w-full resize-y rounded-md border border-white/15 bg-black/30 px-4 py-3 text-sm leading-relaxed outline-none focus:border-neon-cyan/60"
            />
            <textarea
              value={d.body}
              onChange={(e) => setLocaleField(tab, "body", e.target.value)}
              placeholder={
                tab === "es"
                  ? "Cuerpo en Markdown (## para secciones, **negrita**, listas con -)"
                  : "Body in Markdown"
              }
              rows={24}
              className="w-full resize-y rounded-md border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-neon-cyan/60"
            />
          </div>
        )}
      </main>
    );
  }

  // ---- Lista -------------------------------------------------------------
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-mono text-sm font-black uppercase tracking-widest">
          <span className="text-gradient">jorge</span>
          <span className="text-muted">graells</span>
          <span className="text-neon-pink">.admin</span>
          <span className="ml-3 text-muted">/ artículos</span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={newArticle}
            className="btn-neon clip-corner px-5 py-2.5 text-sm font-black uppercase tracking-wide"
          >
            + Nuevo artículo
          </button>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/admin/login", { method: "DELETE" });
              setAuthed(false);
            }}
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-neon-pink"
          >
            Salir
          </button>
        </div>
      </div>

      {msg && !msg.ok && (
        <p className="mt-4 rounded-md border border-neon-pink/40 px-4 py-2.5 text-sm text-neon-pink">
          {msg.text}
        </p>
      )}

      <div className="mt-8 grid gap-4">
        {entries === null && (
          <p className="font-mono text-sm text-muted">Cargando artículos…</p>
        )}
        {entries?.map((e) => (
          <button
            key={e.file}
            type="button"
            onClick={() => {
              setEditing(e);
              setTab("es");
              setPreview(false);
              setMsg(null);
            }}
            className="hud-panel clip-corner flex flex-wrap items-baseline justify-between gap-3 p-5 text-left transition-transform hover:-translate-y-0.5"
          >
            <span className="font-bold text-foreground/90">{e.data.es.title}</span>
            <span className="font-mono text-xs text-muted">
              {e.data.date} · {e.file}
            </span>
          </button>
        ))}
        {entries?.length === 0 && (
          <p className="text-sm text-muted">No hay artículos todavía.</p>
        )}
      </div>
    </main>
  );
}
