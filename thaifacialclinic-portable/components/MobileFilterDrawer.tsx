"use client";
// Mobile bottom-sheet filter drawer. Hidden ≥sm. Trigger button at top of clinic browse.
// Uses URLSearchParams so filter state survives back/refresh.

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Lang = "en" | "ko" | "th" | "any";
type Sort = "trust" | "rating" | "reviews" | "newest";

const LANG_LABELS: Record<Lang, string> = { en: "English", ko: "한국어", th: "ภาษาไทย", any: "Any" };
const SORTS: { v: Sort; label: string }[] = [
  { v: "trust",   label: "Trust score" },
  { v: "rating",  label: "Highest rating" },
  { v: "reviews", label: "Most reviews" },
  { v: "newest",  label: "Newest" },
];

export default function MobileFilterDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [open, setOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [lang, setLang] = useState<Lang>("any");
  const [sort, setSort] = useState<Sort>("trust");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMinRating(Number(sp.get("rating") || 0));
    setLang((sp.get("lang") as Lang) || "any");
    setSort((sp.get("sort") as Sort) || "trust");
  }, [sp]);

  function applyAndClose() {
    const params = new URLSearchParams(sp.toString());
    if (minRating > 0) params.set("rating", String(minRating)); else params.delete("rating");
    if (lang !== "any") params.set("lang", lang); else params.delete("lang");
    if (sort !== "trust") params.set("sort", sort); else params.delete("sort");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    setOpen(false);
  }

  function reset() {
    setMinRating(0); setLang("any"); setSort("trust");
  }

  if (!mounted) return null;

  const activeCount = [minRating > 0, lang !== "any", sort !== "trust"].filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-bold shadow-sm hover:shadow"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
        Filter
        {activeCount > 0 && (
          <span className="grid place-items-center h-5 min-w-[20px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-black">{activeCount}</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 toast-fade-up" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true"
            className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl bg-white shadow-2xl toast-fade-up max-h-[85vh] flex flex-col"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <div className="grid place-items-center pt-3 pb-2"><span className="h-1.5 w-12 rounded-full bg-slate-300" /></div>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgb(var(--border))" }}>
              <h3 className="text-lg font-black">Filter clinics</h3>
              <button onClick={reset} className="text-xs font-bold text-slate-600 hover:underline">Reset</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Min rating */}
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))] mb-2">Minimum rating</div>
                <div className="flex gap-2 flex-wrap">
                  {[0, 4, 4.3, 4.5, 4.7].map((r) => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`rounded-xl border-2 px-4 py-2 text-sm font-bold ${minRating === r ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-slate-200 hover:border-slate-400"}`}>
                      {r === 0 ? "Any" : `★${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))] mb-2">Staff language</div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                    <button key={l} onClick={() => setLang(l)}
                      className={`rounded-xl border-2 px-4 py-2 text-sm font-bold ${lang === l ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-slate-200 hover:border-slate-400"}`}>
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))] mb-2">Sort by</div>
                <div className="grid grid-cols-2 gap-2">
                  {SORTS.map((s) => (
                    <button key={s.v} onClick={() => setSort(s.v)}
                      className={`rounded-xl border-2 px-4 py-2 text-sm font-bold ${sort === s.v ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-slate-200 hover:border-slate-400"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t bg-white p-3 grid gap-2" style={{ borderColor: "rgb(var(--border))" }}>
              <button onClick={applyAndClose}
                className="w-full rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-3 text-base font-black hover:opacity-90">
                Apply {activeCount > 0 ? `(${activeCount})` : ""}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
