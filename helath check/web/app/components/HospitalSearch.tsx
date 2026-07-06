"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

type Hospital = {
  slug: string;
  name: string;
  city?: string | null;
  area?: string | null;
  jci?: number | null;
  min_price?: string | null;
  package_count: number;
  description?: string | null;
};

export function HospitalSearch({
  hospitals,
  locale,
}: {
  hospitals: Hospital[];
  locale: string;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.city || "").toLowerCase().includes(q) ||
        (h.area || "").toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query, hospitals]);

  return (
    <div className="relative mb-8">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hospitals by name or city…"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-base md:text-sm bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>
        )}
      </div>
      {query && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500">No hospitals found for &ldquo;{query}&rdquo;</div>
          ) : (
            results.map((h) => (
              <Link
                key={h.slug}
                href={`/${locale}/hospital/${h.slug}`}
                onClick={() => setQuery("")}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 border-b last:border-0 border-slate-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{h.name}</p>
                  <p className="text-xs text-slate-500">{h.city || h.area || "Thailand"}</p>
                </div>
                <div className="text-right shrink-0">
                  {h.jci === 1 && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold mr-1">JCI</span>}
                  {h.min_price && <span className="text-xs text-slate-500">฿{parseFloat(h.min_price).toLocaleString()}</span>}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
