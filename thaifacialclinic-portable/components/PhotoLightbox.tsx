"use client";

import { useEffect, useState } from "react";

export default function PhotoLightbox({
  photos,
  clinicName,
}: {
  photos: string[];
  clinicName: string;
}) {
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    if (idx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, photos.length]);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-4 sm:gap-3">
        {photos.slice(0, 8).map((p, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`group relative overflow-hidden rounded-xl ring-1 transition hover:ring-2 cursor-zoom-in ${i === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square sm:aspect-auto" : "aspect-square"}`}
            style={{ ["--tw-ring-color" as never]: "rgb(var(--border))" }}
            aria-label={`View photo ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} alt={`${clinicName} photo ${i + 1}`} loading="lazy" referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
            <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/40 text-white opacity-0 transition group-hover:opacity-100 backdrop-blur">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 21l-6-6M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-3-8h6M11 8v6"/></svg>
            </span>
          </button>
        ))}
      </div>

      {idx !== null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4 sm:p-8 animate-fade-up"
          onClick={() => setIdx(null)}
        >
          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(null); }}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setIdx((i) => i === null ? null : (i - 1 + photos.length) % photos.length); }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setIdx((i) => i === null ? null : (i + 1) % photos.length); }}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}

          {/* Image */}
          <div className="relative max-w-5xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[idx]} alt={`${clinicName} photo ${idx + 1}`}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-premium-lg"
              referrerPolicy="no-referrer" />
            <div className="mt-3 text-center text-xs text-white/80">
              {idx + 1} / {photos.length} · {clinicName}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
