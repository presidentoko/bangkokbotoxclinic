"use client";
// 클라이언트 검색 — entities (clinic / restaurant / course)에서 즉시 필터.
// site별 차이는 props 로 흡수: hrefBase ("/clinic" | "/restaurant" | "/course"),
// lang (en/ko/th), placeholder.

import { useState, useMemo, useEffect, useRef } from "react";

export type SearchableEntity = {
  id: string;
  name: string;
  district?: string;
  city_label?: string;
  rating: number;
  trust_score: number;
};

type Lang = "en" | "ko" | "th";
const COPY: Record<Lang, { defaultPlaceholder: string; noMatches: string }> = {
  en: { defaultPlaceholder: "Search name or location...", noMatches: "No matches." },
  ko: { defaultPlaceholder: "이름, 지역 검색...", noMatches: "검색 결과 없음" },
  th: { defaultPlaceholder: "ค้นหาชื่อ หรือพื้นที่...", noMatches: "ไม่พบผลลัพธ์" },
};

export function SearchBar({
  entities,
  hrefBase,
  placeholder,
  lang = "en",
}: {
  entities: SearchableEntity[];
  hrefBase: string; // "/clinic" | "/restaurant" | "/course"
  placeholder?: string;
  lang?: Lang;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const copy = COPY[lang];
  const ph = placeholder ?? copy.defaultPlaceholder;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const lower = q.toLowerCase();
    return entities
      .filter((e) =>
        e.name.toLowerCase().includes(lower) ||
        (e.district && e.district.toLowerCase().includes(lower)) ||
        (e.city_label && e.city_label.toLowerCase().includes(lower))
      )
      .sort((a, b) => b.trust_score - a.trust_score)
      .slice(0, 10);
  }, [q, entities]);

  return (
    <div ref={ref} className="relative">
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={ph}
        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-sm"
      />
      {open && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-20 max-h-96 overflow-y-auto">
          {results.map((r) => (
            <li key={r.id}>
              <a
                href={`${hrefBase}/${r.id}`}
                className="block px-4 py-3 hover:bg-gray-50 border-b border-[var(--border)] last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.name}</div>
                    <div className="text-xs text-[var(--muted)] truncate">
                      {[r.district, r.city_label].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--muted)] tabular-nums whitespace-nowrap">
                    ★ {r.rating.toFixed(1)}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
      {open && q.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--border)] rounded-xl shadow-lg px-4 py-3 text-sm text-[var(--muted)] z-20">
          {copy.noMatches}
        </div>
      )}
    </div>
  );
}
