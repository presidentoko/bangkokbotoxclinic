"use client";

import { useEffect, useState } from "react";
import { loadRecent, subscribeRecent, type RecentItem } from "@/lib/recentlyViewed";
import { CATEGORY_ICONS } from "@/lib/types";

/** `layout="row"` → horizontal scroll strip (homepage); `layout="col"` → vertical list (aside) */
export function RecentlyViewed({
  excludeId,
  layout = "row",
  maxItems = 8,
}: {
  excludeId?: string;
  layout?: "row" | "col";
  maxItems?: number;
}) {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(loadRecent().filter((x) => x.id !== excludeId).slice(0, maxItems));
    const unsub = subscribeRecent(() =>
      setItems(loadRecent().filter((x) => x.id !== excludeId).slice(0, maxItems))
    );
    return unsub;
  }, [excludeId, maxItems]);

  if (!mounted || items.length === 0) return null;

  if (layout === "col") {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-5">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-3">Recently viewed</h3>
        <div className="divide-y divide-stone-100">
          {items.map((r) => (
            <a key={r.id} href={`/supplier/${r.id}`} className="block py-2.5 group">
              <div className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 leading-tight line-clamp-1">
                {r.categories.slice(0, 1).map((c) => (
                  <span key={c} aria-hidden className="mr-1">{CATEGORY_ICONS[c] ?? "🏭"}</span>
                ))}
                {r.name}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                {r.cityLabel || "Thailand"} · Trust {r.trustScore}
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Recently viewed</h2>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((r) => (
          <a
            key={r.id}
            href={`/supplier/${r.id}`}
            className="flex-shrink-0 block w-44 p-3 rounded-xl border border-[var(--border)] bg-white hover:border-emerald-400 hover:shadow-sm transition"
          >
            <div className="text-[10px] text-[var(--muted)] mb-1 flex items-center gap-1">
              {r.categories.slice(0, 1).map((c) => (
                <span key={c} aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
              ))}
              <span className="truncate">{r.cityLabel || "Thailand"}</span>
            </div>
            <div className="font-bold text-sm leading-snug line-clamp-2 mb-1">{r.name}</div>
            <div className="text-[10px] font-bold text-emerald-700">
              Trust {r.trustScore}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
