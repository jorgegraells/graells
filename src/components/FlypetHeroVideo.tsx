"use client";

import { useEffect, useRef, useState } from "react";

// Vídeo de cabecera de /flypet: sin sonido y en bucle, encima de su póster.
// El póster es un <img> normal (cuenta para el LCP y se ve aunque no haya JavaScript); el vídeo lleva el
// mismo de `poster`, porque vacío se pinta opaco y lo taparía. El vídeo no descarga nada (preload="none")
// hasta que este efecto lo pone en marcha, y no lo hace si la persona ha pedido menos movimiento o ahorro
// de datos: entonces se queda el póster, con el botón para verlo si quiere. Fuera de la pantalla, se para.
// El botón de pausa (WCAG 2.2.2: lo que se mueve solo más de 5 s se tiene que poder parar) va encima,
// en una esquina: no mueve nada del diseño.

type Props = {
  /** Ruta sin extensión: <base>.mp4 y <base>-poster.webp (540x960) */
  base: string;
  alt: string;
  pauseLabel: string;
  playLabel: string;
  className?: string;
};

export default function FlypetHeroVideo({ base, alt, pauseLabel, playLabel, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const stopped = useRef(false); // lo ha parado la persona (o no debe arrancar solo): el observador no lo reanuda
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.muted = true; // (React no escribe `muted` en el HTML del servidor, y sin él no hay autoplay)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    stopped.current = reduced || saveData;
    if (!stopped.current) video.play().catch(() => {}); // (ya: está en la primera pantalla)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (stopped.current) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      stopped.current = false;
      video.play().catch(() => {});
    } else {
      stopped.current = true;
      video.pause();
    }
  };

  return (
    <div
      className={`glow-ring relative aspect-[9/16] overflow-hidden rounded-2xl bg-[#0e1018] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}-poster.webp`}
        width={540}
        height={960}
        alt={alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={ref}
        src={`${base}.mp4`}
        poster={`${base}-poster.webp`}
        width={540}
        height={960}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onClick={toggle}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        title={playing ? pauseLabel : playLabel}
        className="absolute bottom-2.5 right-2.5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.2v13.6L19 12z" />}
        </svg>
      </button>
    </div>
  );
}
