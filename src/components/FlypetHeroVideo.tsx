"use client";

import { useEffect, useRef } from "react";

// Vídeo de cabecera de /flypet: sin sonido y en bucle, encima de su póster.
// El póster es un <img> normal (cuenta para el LCP y se ve aunque no haya JavaScript); el vídeo lleva el
// mismo de `poster`, porque vacío se pinta opaco y lo taparía. El vídeo no
// descarga nada (preload="none") hasta que este efecto lo pone en marcha, y no lo hace si la persona
// ha pedido menos movimiento o ahorro de datos: entonces se queda el póster. Fuera de la pantalla, se para.

type Props = {
  /** Ruta sin extensión: <base>.mp4 y <base>-poster.webp (540x960) */
  base: string;
  alt: string;
  className?: string;
};

export default function FlypetHeroVideo({ base, alt, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reduced || saveData) return;
    video.muted = true; // (React no escribe `muted` en el HTML del servidor, y sin él no hay autoplay)
    video.play().catch(() => {}); // (ya: está en la primera pantalla; el observador solo la para y la reanuda)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

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
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
