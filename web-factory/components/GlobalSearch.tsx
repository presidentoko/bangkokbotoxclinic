"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BrowseEntry } from "@/lib/browseIndex";
import { loadBrowseIndex } from "@/lib/browseIndexClient";
import { globalSearch, regionCounts } from "@/lib/globalSearch";
import { CATEGORY_ICONS } from "@/lib/types";

export function GlobalSearch() {
  const [entries, setEntries] = useState<BrowseEntry[]>([]);
  // undefined = "not loaded yet, don't filter regions" (regionCounts's documented
  // behavior) — must stay undefined on any failure, never become a defined empty
  // Set, which would instead filter out every region result.
  const [validCities, setValidCities] = useState<Set<string> | undefined>(undefined);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [open, setOpen] = useState(false);
  // 인덱스가 도착하기 전에는 "No matches." 를 띄우면 안 된다. 예전에는
  // entries 가 빈 배열인 채로 결과 0건 → 단정적인 "No matches." 가 나와서,
  // 모바일에서 2.0MB 가 도착하기 전 두 글자만 쳐도 "결과 없음" 이 떴다.
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // useRef, not useState: ensureFetched() can run twice before a state update
  // from the first call commits (rapid blur→refocus), so a state-backed guard
  // can't prevent duplicate fetches — a ref mutates synchronously.
  const fetchStarted = useRef(false);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  // Debounce the ~8,200-entry scan (matchSuppliers/matchRegions in lib/globalSearch.ts)
  // so it runs once after typing pauses instead of on every keystroke — avoids
  // input lag on slower/mobile devices while the input itself stays instant.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 150);
    return () => clearTimeout(t);
  }, [q]);

  function ensureFetched() {
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    setLoading(true);
    // loadBrowseIndex() 를 거친다. 예전에는 여기서 fetch 를 직접 불러서,
    // 중복 다운로드를 막으려고 만든 모듈 캐시를 그대로 지나쳤다.
    // GlobalSearch 는 레이아웃에서 데스크톱/모바일 두 번 마운트되고
    // fetchStarted 가드는 인스턴스별이라, 2.0MB 를 두 번 받을 수 있었다.
    loadBrowseIndex()
      .then((data) => {
        if (mounted.current && data.length) setEntries(data);
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });
    fetch("/city-index.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: string[] | null) => {
        if (mounted.current && data) setValidCities(new Set(data));
      })
      .catch(() => {});
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const counts = useMemo(() => regionCounts(entries, validCities), [entries, validCities]);
  const results = useMemo(() => globalSearch(debouncedQ, entries, counts), [debouncedQ, entries, counts]);
  const showDropdown = open && debouncedQ.trim().length >= 2;

  return (
    <div ref={ref} className="relative w-full">
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          ensureFetched();
          setOpen(true);
        }}
        placeholder="Search name, category, region..."
        aria-label="Search suppliers by name, category, or region"
        className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-light)] focus:border-transparent"
      />
      {showDropdown && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-30 max-h-96 overflow-y-auto">
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-[var(--muted)]">
              {loading || entries.length === 0 ? "Searching…" : "No matches."}
            </li>
          )}
          {results.map((r) => (
            <li
              key={
                r.kind === "supplier" ? `s-${r.id}` : r.kind === "category" ? `c-${r.key}` : `r-${r.label}`
              }
            >
              <a
                href={r.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 hover:bg-[var(--gold-bg)] border-b border-[var(--border)] last:border-0"
              >
                {r.kind === "category" && (
                  <span className="flex items-center gap-2 text-sm">
                    <span aria-hidden>{CATEGORY_ICONS[r.key] ?? "🏷"}</span>
                    <span className="font-medium">{r.label}</span>
                    <span className="text-xs text-[var(--muted)] ml-auto">Browse category →</span>
                  </span>
                )}
                {r.kind === "region" && (
                  <span className="flex items-center gap-2 text-sm">
                    <span aria-hidden>📍</span>
                    <span className="font-medium">{r.label}</span>
                    <span className="text-xs text-[var(--muted)] ml-auto tabular-nums">
                      {r.count.toLocaleString()} suppliers →
                    </span>
                  </span>
                )}
                {r.kind === "supplier" && (
                  <span className="block min-w-0">
                    <span className="flex items-center gap-2 text-sm">
                      <span aria-hidden>🏭</span>
                      <span className="font-medium truncate">{r.name}</span>
                    </span>
                    <span className="text-xs text-[var(--muted)] ml-6">
                      {[r.district, r.cityLabel].filter(Boolean).join(" · ")}
                      {" · "}Trust {r.trustScore}
                    </span>
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
