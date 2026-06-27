"use client";
import { useState, useDeferredValue, useMemo } from "react";
import Link from "next/link";
import type { PackageRow } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import { CompareProvider, CompareCheckbox, CompareDrawer } from "./CompareDrawer";

// ── Sub-components ────────────────────────────────────────────────────────────

function InclusionPill({ label, included }: { label: string; included: number | null }) {
  if (included === 1)
    return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-100">✓ {label}</span>;
  if (included === 0)
    return <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-400 text-[11px] px-2 py-0.5 rounded-full border border-slate-100 line-through">{label}</span>;
  return null;
}

function StarRating({ rating, count }: { rating: string | null; count: number | null }) {
  if (!rating) return null;
  const r = parseFloat(rating);
  const full = Math.floor(r);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`text-sm ${i < full ? "text-amber-400" : "text-slate-200"}`}>★</span>
        ))}
      </div>
      <span className="text-xs font-bold text-slate-700">{r.toFixed(1)}</span>
      {count && <span className="text-xs text-slate-400">({count.toLocaleString()})</span>}
    </div>
  );
}

function PriceTag({ price, cheapest }: { price: string | null; cheapest: number }) {
  if (!price) return <span className="text-slate-400 text-sm">POA</span>;
  const p = parseFloat(price);
  const diff = Math.round(((p - cheapest) / cheapest) * 100);
  return (
    <div className="text-right">
      <p className="text-2xl font-extrabold text-slate-900 leading-none">฿{p.toLocaleString()}</p>
      {diff === 0 && <p className="text-[10px] font-bold text-emerald-600 mt-0.5 uppercase tracking-wide">Cheapest</p>}
      {diff > 0 && diff <= 50 && <p className="text-[10px] text-slate-400 mt-0.5">+{diff}%</p>}
    </div>
  );
}

function PackageCard({ row, loc, cheapest }: { row: PackageRow; loc: Locale; cheapest: number }) {
  const bookUrl = row.source_url || row.checkup_url || "#";
  const inclusions = [
    { label: "MRI", val: row.has_mri },
    { label: "Cancer markers", val: row.has_cancer_marker },
    { label: "CT scan", val: row.has_ct },
    { label: "Blood tests", val: row.has_blood },
    { label: "Ultrasound", val: row.has_ultrasound },
    { label: "X-Ray", val: row.has_xray },
    { label: "Doctor consult", val: row.has_doctor_consult },
    { label: "Interpreter", val: row.has_interpreter },
  ];
  const included = inclusions.filter((i) => i.val === 1);
  const excluded = inclusions.filter((i) => i.val === 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col">
      <div className="px-5 pt-5 pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link href={`/${loc}/hospital/${row.hospital_slug}`}
              className="font-bold text-slate-900 text-base leading-tight hover:text-blue-700 transition-colors line-clamp-1">
              {row.hospital_name}
            </Link>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {row.jci === 1 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">JCI</span>
              )}
              {row.area && (
                <span className="text-slate-400 text-xs flex items-center gap-0.5">
                  <span className="text-[10px]">📍</span>{row.area}
                </span>
              )}
              {row.results_days != null && (
                <span className="text-slate-400 text-xs flex items-center gap-0.5">
                  <span className="text-[10px]">⏱</span>{row.results_days}d results
                </span>
              )}
            </div>
            <div className="mt-1.5">
              <StarRating rating={row.rating} count={row.review_count} />
            </div>
          </div>
          <PriceTag price={row.price} cheapest={cheapest} />
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50/60">
        <p className="text-sm text-slate-600 leading-snug font-medium">{row.package_name}</p>
      </div>

      <div className="px-5 py-3 flex-1">
        {included.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {included.map((i) => <InclusionPill key={i.label} label={i.label} included={1} />)}
          </div>
        )}
        {excluded.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {excluded.map((i) => <InclusionPill key={i.label} label={i.label} included={0} />)}
          </div>
        )}
      </div>

      <div className="px-5 pb-4 pt-2 flex items-center gap-2.5">
        <a href={`/api/track?pkg=${row.package_id}&url=${encodeURIComponent(bookUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-blue-700 active:scale-95 transition-all">
          Book / Enquire →
        </a>
        <Link href={`/${loc}/hospital/${row.hospital_slug}`}
          className="text-sm text-blue-600 border border-blue-100 px-3 py-3 rounded-xl hover:bg-blue-50 transition-colors font-medium">
          Details
        </Link>
      </div>
      <div className="px-5 pb-4">
        <CompareCheckbox row={row} />
      </div>
    </div>
  );
}

// ── Feature filters ───────────────────────────────────────────────────────────

const FEATURES = [
  { key: "has_mri", label: "MRI" },
  { key: "has_cancer_marker", label: "Cancer markers" },
  { key: "has_ct", label: "CT scan" },
  { key: "has_interpreter", label: "Interpreter" },
  { key: "jci", label: "JCI only" },
] as const;

type FeatureKey = (typeof FEATURES)[number]["key"];

// ── Main component ────────────────────────────────────────────────────────────

export function FilteredPackageGrid({ rows, loc }: { rows: PackageRow[]; loc: Locale }) {
  const [query, setQuery] = useState("");
  const [activeFeatures, setActiveFeatures] = useState<Set<FeatureKey>>(new Set());
  const deferred = useDeferredValue(query);

  const prices = useMemo(() => rows.map((r) => parseFloat(r.price ?? "0")).filter(Boolean), [rows]);
  const cheapest = prices.length ? Math.min(...prices) : 0;

  const filtered = useMemo(() => {
    let result = rows;
    if (deferred.trim()) {
      const q = deferred.toLowerCase();
      result = result.filter(
        (r) =>
          r.hospital_name.toLowerCase().includes(q) ||
          r.package_name.toLowerCase().includes(q) ||
          (r.area ?? "").toLowerCase().includes(q),
      );
    }
    for (const feat of activeFeatures) {
      if (feat === "jci") {
        result = result.filter((r) => r.jci === 1);
      } else {
        result = result.filter((r) => (r[feat as keyof PackageRow] as number) === 1);
      }
    }
    return result;
  }, [rows, deferred, activeFeatures]);

  function toggleFeature(key: FeatureKey) {
    setActiveFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const hasFilters = query.trim() || activeFeatures.size > 0;

  return (
    <CompareProvider>
    <div>
      {/* Search + filter bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 space-y-3">
        {/* Search input */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hospital or package name..."
            className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
          />
          {query && (
            <button onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
          )}
        </div>

        {/* Feature filter pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 font-medium">Filter:</span>
          {FEATURES.map((f) => {
            const active = activeFeatures.has(f.key);
            return (
              <button key={f.key} onClick={() => toggleFeature(f.key)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                  active
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
                }`}>
                {active ? "✓ " : ""}{f.label}
              </button>
            );
          })}
          {hasFilters && (
            <button onClick={() => { setQuery(""); setActiveFeatures(new Set()); }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors ml-auto underline underline-offset-2">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {hasFilters && (
        <p className="text-sm text-slate-500 mb-4">
          Showing <strong className="text-slate-800">{filtered.length}</strong> of {rows.length} packages
        </p>
      )}

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No packages match your filters.</p>
          <button onClick={() => { setQuery(""); setActiveFeatures(new Set()); }}
            className="mt-3 text-sm text-blue-600 hover:underline">Clear filters</button>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {filtered.map((row) => (
          <PackageCard key={row.package_id} row={row} loc={loc} cheapest={cheapest} />
        ))}
      </div>

      {/* Compare drawer */}
      <CompareDrawer />
    </div>
    </CompareProvider>
  );
}
