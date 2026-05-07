"use client";
// 클라이언트 검색 — master_db.json 의 코스 이름/지역에서 즉시 필터.

import { useState, useMemo, useEffect, useRef } from "react";
import type { Restaurant } from "@/lib/types";

type Lang = "en" | "ko" | "th";

const COPY: Record<Lang, { placeholder: string; noMatches: string }> = {
  en: { placeholder: "Search course, region, or district...", noMatches: "No matches." },
  ko: { placeholder: "코스, 지역, 구 검색...", noMatches: "검색 결과 없음" },
  th: { placeholder: "ค้นหาสนาม จังหวัด หรือเขต...", noMatches: "ไม่พบผลลัพธ์" },
};

export function SearchBar({
  restaurants, lang = "en", placeholder,
}: {
  restaurants: Pick<Restaurant, "id" | "name" | "district" | "city_label" | "rating" | "trust_score">[];
  lang?: Lang;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const copy = COPY[lang];
  const ph = placeholder ?? copy.placeholder;

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
    return restaurants
      .filter((r) =>
        r.name.toLowerCase().includes(lower) ||
        (r.district && r.district.toLowerCase().includes(lower)) ||
        (r.city_label && r.city_label.toLowerCase().includes(lower))
      )
      .sort((a, b) => b.trust_score - a.trust_score)
      .slice(0, 10);
  }, [q, restaurants]);

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
                href={`/course/${r.id}`}
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
