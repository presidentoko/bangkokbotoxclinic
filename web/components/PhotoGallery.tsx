"use client";
// PhotoGallery — 클리닉 사진 그리드 + 라이트박스. lh3.googleusercontent.com CDN 사용.
// hero (큰 사진 1) + 작은 thumb 4-5 grid → 클릭 시 풀스크린 lightbox.

import { useState, useEffect } from "react";
import type { ClinicPhoto } from "@/lib/photos";

export function PhotoGallery({
  photos,
  clinicName,
  attribution = "Google Maps",
}: {
  photos: ClinicPhoto[];
  clinicName: string;
  attribution?: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // ESC 닫기 + arrow 키 네비
  useEffect(() => {
    if (openIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((cur) => (cur === null ? null : Math.min(photos.length - 1, cur + 1)));
      if (e.key === "ArrowLeft") setOpenIdx((cur) => (cur === null ? null : Math.max(0, cur - 1)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, photos.length]);

  if (photos.length === 0) return null;

  const hero = photos[0];
  const thumbs = photos.slice(1, 5);
  const extraCount = Math.max(0, photos.length - 5);

  return (
    <>
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[auto] md:grid-rows-2 gap-1.5 rounded-xl overflow-hidden">
          {/* Hero — 모바일: 전체 폭(2 cols), 데스크탑: 좌측 2x2 */}
          <button
            type="button"
            onClick={() => setOpenIdx(0)}
            className="col-span-2 md:col-span-2 md:row-span-2 relative bg-gray-100 aspect-[4/3] group cursor-zoom-in overflow-hidden"
            aria-label={`Open photo 1 of ${clinicName}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.large}
              alt={`${clinicName} — exterior`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </button>
          {/* Thumbs — right 2x2 grid */}
          {thumbs.map((p, i) => (
            <button
              key={p.idx}
              type="button"
              onClick={() => setOpenIdx(i + 1)}
              className="relative bg-gray-100 aspect-[4/3] group cursor-zoom-in overflow-hidden"
              aria-label={`Open photo ${i + 2} of ${clinicName}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.thumb}
                alt={`${clinicName} — photo ${i + 2}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {/* "+N" overlay on last thumb if more photos */}
              {i === thumbs.length - 1 && extraCount > 0 && (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-lg font-black">
                  +{extraCount}
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-[var(--muted)] text-right">
          Photos via {attribution}
        </p>
      </section>

      {/* Lightbox */}
      {openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpenIdx(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx(null);
            }}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 text-white p-2 hover:bg-white/10 rounded-full text-2xl leading-none w-10 h-10 flex items-center justify-center"
          >
            ×
          </button>
          {openIdx > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIdx(openIdx - 1);
              }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 hover:bg-black/60 rounded-full w-11 h-11 flex items-center justify-center"
            >
              ‹
            </button>
          )}
          {openIdx < photos.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIdx(openIdx + 1);
              }}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 hover:bg-black/60 rounded-full w-11 h-11 flex items-center justify-center"
            >
              ›
            </button>
          )}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[openIdx].large}
              alt={`${clinicName} — photo ${openIdx + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs tabular-nums bg-black/60 px-3 py-1 rounded-full">
            {openIdx + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
