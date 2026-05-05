"use client";
// 클라이언트 검색 — master_db.json 의 클리닉 이름/지역에서 즉시 필터.

import { useState, useMemo, useEffect, useRef } from "react";
import type { Clinic } from "@/lib/types";

export function SearchBar({
  clinics, placeholder = "Search clinic, district, or service...",
}: {
  clinics: Pick<Clinic, "id" | "name" | "district" | "rating" | "trust_score">[];
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    return clinics
      .filter((c) =>
        c.name.toLowerCase().includes(lower) ||
        (c.district && c.district.toLowerCase().includes(lower))
      )
      .sort((a, b) => b.trust_score - a.trust_score)
      .slice(0, 10);
  }, [q, clinics]);

  return (
    <div ref={ref} className="relative">
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-sm"
      />
      {open && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-20 max-h-96 overflow-y-auto">
          {results.map((r) => (
            <li key={r.id}>
              <a
                href={`/clinic/${r.id}`}
                className="block px-4 py-3 hover:bg-gray-50 border-b border-[var(--border)] last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.name}</div>
                    <div className="text-xs text-[var(--muted)] truncate">{r.district}</div>
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
          No matches.
        </div>
      )}
    </div>
  );
}
