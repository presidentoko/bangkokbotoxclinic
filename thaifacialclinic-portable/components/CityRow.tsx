"use client";
import { useRef } from "react";
import type { Clinic, Lang } from "@/lib/types";
import ClinicCard from "./ClinicCard";

export default function CityRow({
  city, clinics, lang, onSeeAll,
}: {
  city: string;
  clinics: Clinic[];
  lang: Lang;
  onSeeAll: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  }

  const top = clinics.slice(0, 12);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">{city}</div>
          <h3 className="mt-1 font-display text-2xl font-bold tracking-tighter-display sm:text-3xl">
            {city} · <span className="muted">{clinics.length} clinic{clinics.length === 1 ? "" : "s"}</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border bg-[rgb(var(--bg-elev))] transition hover:border-navy-700"
            style={{ borderColor: "rgb(var(--border))" }}
            aria-label="Scroll left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="grid h-10 w-10 place-items-center rounded-full border bg-[rgb(var(--bg-elev))] transition hover:border-navy-700"
            style={{ borderColor: "rgb(var(--border))" }}
            aria-label="Scroll right"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          {clinics.length > top.length && (
            <button
              type="button"
              onClick={onSeeAll}
              className="rounded-full border bg-[rgb(var(--bg-elev))] px-4 py-2 text-xs font-bold transition hover:border-navy-700"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              See all {clinics.length} →
            </button>
          )}
        </div>
      </div>

      <div className="relative -mx-4">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[rgb(var(--bg))] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[rgb(var(--bg))] to-transparent" />
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {top.map((c) => (
            <div key={c.id} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
              <ClinicCard c={c} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
