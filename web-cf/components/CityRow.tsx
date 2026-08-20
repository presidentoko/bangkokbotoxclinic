"use client";
// Netflix-style horizontal scroll row. Accepts pre-rendered card nodes (so the
// parent server-component can pass async <ClinicCard /> children, while the
// scroll buttons stay client-only).

import { useRef, type ReactNode } from "react";

type Lang = "en" | "ko" | "th";
const COPY: Record<Lang, { clinic: string; clinics: string; seeAll: string; scrollLeft: string; scrollRight: string }> = {
  en: { clinic: "clinic", clinics: "clinics", seeAll: "See all {n} →", scrollLeft: "Scroll left", scrollRight: "Scroll right" },
  ko: { clinic: "곳", clinics: "곳", seeAll: "{n}곳 전체 보기 →", scrollLeft: "왼쪽으로 스크롤", scrollRight: "오른쪽으로 스크롤" },
  th: { clinic: "แห่ง", clinics: "แห่ง", seeAll: "ดูทั้งหมด {n} แห่ง →", scrollLeft: "เลื่อนซ้าย", scrollRight: "เลื่อนขวา" },
};

export default function CityRow({
  city,
  total,
  seeAllHref,
  children,
  lang = "en",
}: {
  city: string;
  total: number;
  seeAllHref?: string;
  children: ReactNode;
  lang?: Lang;
}) {
  const t = COPY[lang] ?? COPY.en;
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">{city}</div>
          <h3 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
            {city} <span className="text-[var(--muted)] font-bold">· {total} {total === 1 ? t.clinic : t.clinics}</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button" onClick={() => scroll(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border bg-white transition hover:border-black"
            style={{ borderColor: "var(--border)" }}
            aria-label={t.scrollLeft}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            type="button" onClick={() => scroll(1)}
            className="grid h-10 w-10 place-items-center rounded-full border bg-white transition hover:border-black"
            style={{ borderColor: "var(--border)" }}
            aria-label={t.scrollRight}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          {seeAllHref && (
            <a
              href={seeAllHref}
              className="rounded-full border bg-white px-4 py-2 text-xs font-bold transition hover:border-black"
              style={{ borderColor: "var(--border)" }}
            >
              {t.seeAll.replace("{n}", String(total))}
            </a>
          )}
        </div>
      </div>

      <div className="relative -mx-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[var(--bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[var(--bg)] to-transparent" />
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
