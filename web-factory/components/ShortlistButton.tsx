"use client";

import { addToShortlist, removeFromShortlist, type ShortlistItem } from "@/lib/shortlist";
import { useShortlist } from "./useShortlist";

// Toggle a supplier in the shared shortlist (used by the bulk-quote feature).
// `variant="icon"` is a compact square button for SupplierCard's action row;
// `variant="full"` is a labelled button for the supplier detail page.
export function ShortlistButton({
  id,
  name,
  cityLabel,
  variant = "icon",
}: ShortlistItem & { variant?: "icon" | "full" }) {
  const { items, mounted } = useShortlist();
  const added = mounted && items.some((x) => x.id === id);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (added) removeFromShortlist(id);
    else addToShortlist({ id, name, cityLabel });
  }

  const label = added ? "In your quote list" : "Add to bulk quote";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={added}
        className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition border ${
          added
            ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
            : "bg-white text-stone-900 border-stone-300 hover:border-stone-900"
        }`}
      >
        {added ? "✓ Added to quote" : "＋ Add to bulk quote"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={added}
      title={label}
      aria-label={label}
      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center border ${
        added
          ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
          : "bg-white border-[var(--border)] hover:border-black"
      }`}
    >
      {added ? "✓" : "＋"}
    </button>
  );
}
