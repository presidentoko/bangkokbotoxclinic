"use client";

import { toggleFavorite, type FavoriteItem } from "@/lib/favorites";
import { useFavorites } from "./useFavorites";

// Heart toggle to save/bookmark a supplier. `variant="icon"` is a compact button
// for cards; `variant="full"` is labelled for the supplier detail page.
export function FavoriteButton({
  id,
  name,
  cityLabel,
  variant = "icon",
}: FavoriteItem & { variant?: "icon" | "full" }) {
  const { items, mounted } = useFavorites();
  const saved = mounted && items.some((x) => x.id === id);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ id, name, cityLabel });
  }

  const label = saved ? "Saved to favorites" : "Save to favorites";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition border ${
          saved ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100" : "bg-white text-stone-900 border-stone-300 hover:border-stone-900"
        }`}
      >
        {saved ? "♥ Saved" : "♡ Save supplier"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm transition ${
        saved ? "text-rose-600 hover:text-rose-700" : "text-stone-400 hover:text-rose-500"
      }`}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
