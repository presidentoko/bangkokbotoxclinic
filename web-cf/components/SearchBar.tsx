// ⚠️ AUTO-GENERATED from shared/components/SearchBar.tsx
// DO NOT edit directly — edit shared/components/SearchBar.tsx, then run `python scripts/sync_shared.py`.

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
  entitiesUrl,
  hrefBase,
  placeholder,
  lang = "en",
  noMatchesText,
  resultsHeader,
}: {
  entities: SearchableEntity[];
  // 선택적 — 주면 entities 는 "타이핑 시작 직후 바로 보여줄 소량 시드"로만 쓰고,
  // 전체 색인은 첫 포커스 때 이 URL 에서 한 번만 받아온다.
  //
  // 왜 필요한가: SearchBar 는 클라이언트 컴포넌트라 entities 로 넘긴 배열이
  // 통째로 RSC 페이로드(self.__next_f)에 직렬화된다. bangkokbestclinic 홈은
  // 클리닉 1,829곳을 넘기고 있었고, HeroSearch 가 SearchBar 를 데스크톱/모바일
  // 두 번 렌더해서 같은 배열이 두 벌 실렸다 — 홈 HTML 1,083 KB 중 801 KB(73%)가
  // 이 페이로드였다 (2026-08-06 실측). 정적 JSON 으로 빼면 CDN 캐시를 타고,
  // 검색을 실제로 쓰는 방문자에게만 전송된다.
  entitiesUrl?: string;
  hrefBase: string; // "/clinic" | "/restaurant" | "/course"
  placeholder?: string;
  lang?: Lang;
  noMatchesText?: string;
  resultsHeader?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [fetched, setFetched] = useState<SearchableEntity[] | null>(null);
  const fetchStarted = useRef(false);

  // 첫 포커스에서 한 번만. 실패하면 시드 entities 로 계속 동작한다 —
  // 검색이 아예 죽는 것보다 상위 N개만 찾히는 쪽이 낫다.
  function loadFullIndex() {
    if (!entitiesUrl || fetchStarted.current) return;
    fetchStarted.current = true;
    fetch(entitiesUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (Array.isArray(d)) setFetched(d); })
      .catch(() => { /* 시드로 폴백 */ });
  }

  const pool = fetched ?? entities;

  const copy = COPY[lang];
  const ph = placeholder ?? copy.defaultPlaceholder;
  const noMatch = noMatchesText ?? copy.noMatches;

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
    return pool
      .filter((e) =>
        e.name.toLowerCase().includes(lower) ||
        (e.district && e.district.toLowerCase().includes(lower)) ||
        (e.city_label && e.city_label.toLowerCase().includes(lower))
      )
      .sort((a, b) => b.trust_score - a.trust_score)
      .slice(0, 10);
  }, [q, pool]);

  return (
    <div ref={ref} className="relative">
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); loadFullIndex(); }}
        onFocus={() => { setOpen(true); loadFullIndex(); }}
        placeholder={ph}
        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-sm"
      />
      {open && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-20 max-h-96 overflow-y-auto">
          {resultsHeader && (
            <li className="px-4 py-2 text-xs font-semibold text-[var(--muted)] bg-gray-50 border-b border-[var(--border)] uppercase tracking-wide">
              {resultsHeader}
            </li>
          )}
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
          {noMatch}
        </div>
      )}
    </div>
  );
}
