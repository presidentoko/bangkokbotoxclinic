"use client";
import { useState, useDeferredValue, useMemo, useCallback, useRef, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { SaveButton } from "./SaveButton";

const PAGE_SIZE = 36;
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
  if (!price) return (
    <div className="text-right">
      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg whitespace-nowrap">Contact for price</span>
    </div>
  );
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

function valueScore(r: PackageRow): number {
  if (!r.price || parseFloat(r.price) === 0) return 0;
  const inclusions = [r.has_blood, r.has_xray, r.has_ultrasound, r.has_ct, r.has_mri, r.has_ecg, r.has_treadmill, r.has_cancer_marker, r.has_doctor_consult, r.has_interpreter].filter(v => v === 1).length;
  return inclusions / (parseFloat(r.price) / 1000);
}

function PackageCard({ row, loc, cheapest, topValueScore }: { row: PackageRow; loc: Locale; cheapest: number; topValueScore: number }) {
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

  const isTopValue = topValueScore > 0 && valueScore(row) >= topValueScore * 0.9;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col">
      {isTopValue && (
        <div className="bg-amber-400 text-white text-[10px] font-bold px-3 py-1 text-center tracking-wide uppercase">
          ⭐ Best Value Pick
        </div>
      )}
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
      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CompareCheckbox row={row} />
          <SaveButton packageId={row.package_id} />
        </div>
        <ReportLink packageId={row.package_id} hospitalName={row.hospital_name} />
      </div>
    </div>
  );
}

function ReportLink({ packageId, hospitalName }: { packageId: number; hospitalName: string }) {
  const [sent, setSent] = useState(false);
  async function report() {
    if (sent) return;
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "correction",
        name: "User report",
        message: `Wrong data reported\nHospital: ${hospitalName}\nPackage ID: ${packageId}`,
        url: typeof window !== "undefined" ? window.location.href : "",
      }),
    });
    setSent(true);
  }
  return (
    <button onClick={report} className={`text-xs transition-colors ${sent ? "text-green-500" : "text-slate-300 hover:text-red-400"}`} title="Report wrong data">
      {sent ? "✓ Reported" : "⚑ Report"}
    </button>
  );
}

// ── Feature filters ───────────────────────────────────────────────────────────

const FEATURES = [
  { key: "has_mri", label: "MRI" },
  { key: "has_cancer_marker", label: "Cancer markers" },
  { key: "has_ct", label: "CT scan" },
  { key: "has_ultrasound", label: "Ultrasound" },
  { key: "has_ecg", label: "ECG" },
  { key: "has_doctor_consult", label: "Doctor consult" },
  { key: "has_interpreter", label: "Interpreter" },
  { key: "jci", label: "JCI only" },
] as const;

type FeatureKey = (typeof FEATURES)[number]["key"];

const CITIES = ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Hua Hin", "Ko Samui", "Krabi", "Chiang Rai", "Hat Yai", "Khon Kaen", "Koh Chang", "Udon Thani", "Korat", "Ayutthaya", "Chon Buri", "Nakhon Si Thammarat", "Lampang", "Nakhon Pathom", "Rayong", "Surat Thani", "Phitsanulok", "Trang"] as const;
type City = (typeof CITIES)[number];

const CATEGORIES = [
  { key: "basic",         label: "Basic",          emoji: "🩺" },
  { key: "standard",      label: "Standard",       emoji: "📋" },
  { key: "executive",     label: "Executive",      emoji: "💼" },
  { key: "comprehensive", label: "Comprehensive",  emoji: "🔬" },
  { key: "women",         label: "Women",          emoji: "👩" },
  { key: "cancer",        label: "Cancer",         emoji: "🎗️" },
  { key: "heart",         label: "Heart",          emoji: "❤️" },
  { key: "cardiac",       label: "Cardiac",        emoji: "🫀" },
  { key: "men",           label: "Men",            emoji: "👨" },
  { key: "senior",        label: "Senior (60+)",   emoji: "👴" },
  { key: "diabetes",      label: "Diabetes",       emoji: "🩸" },
  { key: "eye",           label: "Eye Exam",       emoji: "👁️" },
  { key: "liver",         label: "Liver",          emoji: "🫁" },
  { key: "kidney",        label: "Kidney",         emoji: "💧" },
  { key: "brain",         label: "Brain MRI",      emoji: "🧠" },
  { key: "dental",        label: "Dental",         emoji: "🦷" },
] as const;

const PRICE_RANGES = [
  { key: "u3k",   label: "Under ฿3k",   min: 0,     max: 3000  },
  { key: "3to8k", label: "฿3k – ฿8k",   min: 3000,  max: 8000  },
  { key: "8to20k",label: "฿8k – ฿20k",  min: 8000,  max: 20000 },
  { key: "o20k",  label: "฿20k+",       min: 20000, max: Infinity },
] as const;
type PriceKey = (typeof PRICE_RANGES)[number]["key"];

function getCity(r: PackageRow): string {
  return r.city ?? (r.area === "Chiang Mai" ? "Chiang Mai" : r.area === "Phuket" ? "Phuket" : "Bangkok");
}

// ── Main component ────────────────────────────────────────────────────────────

export function FilteredPackageGrid({ rows, loc, serverCategory }: { rows: PackageRow[]; loc: Locale; serverCategory?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFeatures, setActiveFeatures] = useState<Set<FeatureKey>>(new Set());
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePriceKey, setActivePriceKey] = useState<PriceKey | null>(null);
  const [sortKey, setSortKey] = useState<"price" | "price_desc" | "rating" | "name" | "value">("price");
  const [page, setPage] = useState(1);
  const deferred = useDeferredValue(query);

  const resetPage = useCallback(() => setPage(1), []);

  const prices = useMemo(() => rows.map((r) => parseFloat(r.price ?? "0")).filter(Boolean), [rows]);
  const cheapest = prices.length ? Math.min(...prices) : 0;
  const topValueScore = useMemo(() => {
    const scores = rows.map(valueScore).filter(s => s > 0);
    return scores.length ? Math.max(...scores) : 0;
  }, [rows]);

  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CITIES.forEach((c) => (counts[c] = 0));
    rows.forEach((r) => {
      const c = getCity(r);
      if (c in counts) counts[c]++;
    });
    return counts;
  }, [rows]);

  const filtered = useMemo(() => {
    let result = rows;
    if (activeCity) {
      result = result.filter((r) => getCity(r) === activeCity);
    }
    if (activeCategory) {
      result = result.filter((r) => r.category === activeCategory);
    }
    if (activePriceKey) {
      const range = PRICE_RANGES.find((p) => p.key === activePriceKey);
      if (range) {
        result = result.filter((r) => {
          const p = parseFloat(r.price ?? "0");
          return p >= range.min && p < range.max;
        });
      }
    }
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
    // Sort
    return [...result].sort((a, b) => {
      if (a.price && !b.price) return -1;
      if (!a.price && b.price) return 1;
      if (sortKey === "price") return parseFloat(a.price ?? "9999999") - parseFloat(b.price ?? "9999999");
      if (sortKey === "price_desc") return parseFloat(b.price ?? "0") - parseFloat(a.price ?? "0");
      if (sortKey === "rating") return parseFloat(b.rating ?? "0") - parseFloat(a.rating ?? "0");
      if (sortKey === "name") return a.hospital_name.localeCompare(b.hospital_name);
      if (sortKey === "value") {
        const score = (r: PackageRow) => {
          if (!r.price || parseFloat(r.price) === 0) return 0;
          const inclusions = [r.has_blood, r.has_xray, r.has_ultrasound, r.has_ct, r.has_mri, r.has_ecg, r.has_treadmill, r.has_cancer_marker, r.has_doctor_consult, r.has_interpreter].filter(v => v === 1).length;
          const ratingBonus = parseFloat(r.rating ?? "0") * 0.5;
          return (inclusions + ratingBonus) / (parseFloat(r.price) / 1000);
        };
        return score(b) - score(a);
      }
      return 0;
    });
  }, [rows, deferred, activeFeatures, activeCity, activeCategory, activePriceKey, sortKey]);

  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = filtered.length > page * PAGE_SIZE;

  function toggleFeature(key: FeatureKey) {
    setActiveFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    resetPage();
  }

  const hasFilters = query.trim() || activeFeatures.size > 0 || activeCity !== null || activeCategory !== null || activePriceKey !== null;

  return (
    <CompareProvider>
    <div>
      {/* Search + filter bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 space-y-3">
        {/* City tabs – horizontally scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          <button
            onClick={() => { setActiveCity(null); resetPage(); }}
            className={`flex-shrink-0 text-sm px-4 py-2 rounded-xl font-semibold transition-colors border ${
              activeCity === null
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
            }`}>
            All cities
          </button>
          {CITIES.filter((city) => (cityCounts[city] ?? 0) > 0).map((city) => (
            <button key={city}
              onClick={() => { setActiveCity(city); resetPage(); }}
              className={`flex-shrink-0 text-sm px-4 py-2 rounded-xl font-semibold transition-colors border ${
                activeCity === city
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              }`}>
              {city} <span className="text-[11px] opacity-70">({cityCounts[city]})</span>
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          {CATEGORIES.map((c) => (
            <button key={c.key}
              onClick={() => {
                // When the server pre-filtered rows to one category (compare
                // pages), filtering client-side by a different category always
                // yields zero results — navigate to that category's page
                // instead of silently emptying the grid.
                if (serverCategory && c.key !== serverCategory) {
                  router.push(c.key === "executive" ? `/${loc}/compare` : `/${loc}/compare/${c.key}`);
                  return;
                }
                setActiveCategory(activeCategory === c.key ? null : c.key);
                resetPage();
              }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                activeCategory === c.key
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-700"
              }`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* Price range filter */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-500 font-medium">Budget:</span>
          {PRICE_RANGES.map((p) => (
            <button key={p.key}
              onClick={() => { setActivePriceKey(activePriceKey === p.key ? null : p.key); resetPage(); }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                activePriceKey === p.key
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-700"
              }`}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hospital or package name..."
            className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
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
            <button onClick={() => { setQuery(""); setActiveFeatures(new Set()); setActiveCity(null); setActiveCategory(null); setActivePriceKey(null); }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors ml-auto underline underline-offset-2">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results count + sort */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <p className="text-sm text-slate-500">
          {hasFilters
            ? <><strong className="text-slate-800">{filtered.length}</strong> matching packages</>
            : <><strong className="text-slate-800">{rows.length}</strong> packages · <strong className="text-slate-800">{new Set(rows.map(r => r.hospital_slug)).size}</strong> hospitals</>
          }
        </p>
        <select
          value={sortKey}
          onChange={(e) => { setSortKey(e.target.value as typeof sortKey); resetPage(); }}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300 cursor-pointer"
        >
          <option value="price">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="value">Best Value (inclusions / price)</option>
          <option value="rating">Best rated</option>
          <option value="name">Hospital A → Z</option>
        </select>
      </div>

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
        {visible.map((row) => (
          <PackageCard key={row.package_id} row={row} loc={loc} cheapest={cheapest} topValueScore={topValueScore} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="text-center py-6">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors shadow-sm">
            Load more packages ({filtered.length - visible.length} remaining)
          </button>
        </div>
      )}

      {/* Compare drawer */}
      <CompareDrawer />
    </div>
    </CompareProvider>
  );
}
