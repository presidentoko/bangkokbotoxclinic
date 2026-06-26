"use client";
import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const FEATURE_FILTERS = [
  { key: "mri", label: "MRI" },
  { key: "cancer", label: "Cancer markers" },
  { key: "ct", label: "CT scan" },
  { key: "interpreter", label: "Interpreter" },
  { key: "jci", label: "JCI only" },
];

const SORT_OPTIONS = [
  { key: "price", label: "Cheapest first" },
  { key: "price_desc", label: "Most expensive" },
  { key: "rating", label: "Highest rated" },
  { key: "results_days", label: "Fastest results" },
];

export function CompareFilters({ category, currentSort }: { category: string; currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [activeFeatures, setActiveFeatures] = useState<Set<string>>(new Set());

  function updateUrl(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    params.set("sort", sort);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function toggleFeature(key: string) {
    setActiveFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort:</span>
        <div className="flex flex-wrap gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.key} onClick={() => updateUrl(opt.key)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                currentSort === opt.key
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:block h-5 w-px bg-slate-200" />

      {/* Feature filters (client-only visual) */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filter:</span>
        <div className="flex flex-wrap gap-1.5">
          {FEATURE_FILTERS.map((f) => (
            <button key={f.key} onClick={() => toggleFeature(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeFeatures.has(f.key)
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-400"
              }`}>
              {activeFeatures.has(f.key) ? "✓ " : ""}{f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
