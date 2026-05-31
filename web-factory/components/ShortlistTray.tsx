"use client";

import { clearShortlist } from "@/lib/shortlist";
import { useShortlist } from "./useShortlist";

// Fixed bottom bar shown only when the shortlist is non-empty. Mounted once in
// the root layout. Links to /quote for a single combined inquiry.
export function ShortlistTray() {
  const { items, mounted } = useShortlist();
  if (!mounted || items.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-white/95 backdrop-blur-sm shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">
          <span className="tabular-nums">{items.length}</span> supplier{items.length > 1 ? "s" : ""} selected
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => clearShortlist()}
            className="py-2 px-3 rounded-lg text-xs font-bold border border-[var(--border)] bg-white hover:border-black transition"
          >
            Clear
          </button>
          <a
            href="/quote"
            className="py-2 px-4 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition"
          >
            Request one quote →
          </a>
        </div>
      </div>
    </div>
  );
}
