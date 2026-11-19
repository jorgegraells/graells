"use client";

import { useEffect, useRef, useState } from "react";

// Vídeo de cabecera de /flypet: sin sonido y en bucle, encima de su póster.
// El póster es un <img> normal (cuenta para el LCP y se ve aunque no haya JavaScript); el vídeo lleva el
// mismo de `poster`, porque vacío se pinta opaco y lo taparía. El vídeo no descarga nada (preload="none")
// hasta que este efecto lo pone en marcha, y no lo hace si la persona ha pedido menos movimiento o ahorro
// de datos: entonces se queda el póster, con el botón para verlo si quiere. Fuera de la pantalla, se para.
// El botón de pausa (WCAG 2.2.2: lo que se mueve solo más de 5 s se tiene que poder parar) va encima,
// en una esquina: no mueve nada del diseño. Marco y botón llevan la piel de Flypet (flypet.css).

type Props = {
  /** Ruta sin extensión: <base>.mp4 y <base>-poster.webp, los dos de width x height */
  base: string;
  /** Medidas del vídeo y su póster (por defecto 540x960, vertical); dan la proporción del marco */
  width?: number;
  height?: number;
  alt: string;
  pauseLabel: string;
  playLabel: string;
  className?: string;
};

export default function FlypetHeroVideo({
  base,
  alt,
  pauseLabel,
  playLabel,
  width = 540,
  height = 960,
  className = "",
}: Props) {
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
      className={`fp-screen relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}-poster.webp`}
        width={width}
        height={height}
        alt={alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={ref}
        src={`${base}.mp4`}
        poster={`${base}-poster.webp`}
        width={width}
        height={height}
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
        className="fp-pause absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.2v13.6L19 12z" />}
        </svg>
      </button>
    </div>
  );
}
