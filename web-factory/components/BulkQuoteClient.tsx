"use client";

import { removeFromShortlist, clearShortlist } from "@/lib/shortlist";
import { useShortlist } from "./useShortlist";
import { RfqForm } from "./RfqForm";

// Client body of /quote: shows the shortlist + a single combined RFQ form.
export function BulkQuoteClient() {
  const { items, mounted } = useShortlist();

  // Avoid SSR/first-paint hydration mismatch (localStorage is client-only).
  if (!mounted) {
    return <div className="h-40" aria-hidden />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
        <div className="text-3xl mb-2">🗂️</div>
        <h2 className="font-bold text-lg mb-1">Your quote list is empty</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Browse suppliers and tap <span className="font-bold">＋ Add to bulk quote</span> to build a shortlist,
          then send one inquiry to all of them at once.
        </p>
        <a href="/" className="inline-block py-2.5 px-5 rounded-lg bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 transition">
          Browse suppliers →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">{items.length} selected supplier{items.length > 1 ? "s" : ""}</h2>
          <button
            type="button"
            onClick={() => clearShortlist()}
            className="text-xs font-bold text-[var(--muted)] hover:text-black"
          >
            Clear all
          </button>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {items.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <a href={`/supplier/${s.id}`} className="font-medium text-sm hover:underline truncate block">
                  {s.name}
                </a>
                <div className="text-xs text-[var(--muted)]">{s.cityLabel}</div>
              </div>
              <button
                type="button"
                onClick={() => removeFromShortlist(s.id)}
                aria-label={`Remove ${s.name}`}
                className="shrink-0 py-1.5 px-3 rounded-lg text-xs font-bold border border-[var(--border)] bg-white hover:border-black transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <RfqForm suppliers={items} />
    </div>
  );
}
