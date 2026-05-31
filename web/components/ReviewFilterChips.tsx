"use client";
// Chips that filter the parent's review-list display. Calls onFilter() with key.
// Used above sample-review section on clinic detail.

import { useState } from "react";

type Filter = "all" | "neg" | "kr" | "price" | "staff" | "recent";

const CHIPS: { v: Filter; label: string; emoji: string }[] = [
  { v: "all",    label: "All reviews",    emoji: "📋" },
  { v: "recent", label: "Last 12 months", emoji: "🕒" },
  { v: "neg",    label: "Negative only",  emoji: "👎" },
  { v: "kr",     label: "Korean speakers", emoji: "🇰🇷" },
  { v: "price",  label: "About price",     emoji: "💰" },
  { v: "staff",  label: "About staff",     emoji: "👥" },
];

export default function ReviewFilterChips({
  onFilter,
  counts,
}: {
  onFilter: (f: Filter) => void;
  counts?: Partial<Record<Filter, number>>;
}) {
  const [active, setActive] = useState<Filter>("all");

  function pick(f: Filter) {
    setActive(f);
    onFilter(f);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {CHIPS.map((c) => {
        const count = counts?.[c.v];
        const isOn = active === c.v;
        return (
          <button key={c.v} onClick={() => pick(c.v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border-2 transition ${
              isOn
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-[var(--border)] bg-white text-[var(--fg)] hover:border-slate-400"
            }`}>
            <span>{c.emoji}</span>
            <span>{c.label}</span>
            {typeof count === "number" && (
              <span className={`tabular-nums ${isOn ? "text-emerald-700" : "text-[var(--muted)]"}`}>· {count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type { Filter as ReviewFilter };
