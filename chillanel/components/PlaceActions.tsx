"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { isInCompare, toggleCompare, MAX_COMPARE } from "@/lib/compare";

type PlaceActionsStrings = Pick<
  Dict["place"],
  "addFavorite" | "removeFavorite" | "addToCompare" | "removeFromCompare" | "compareLimitReached"
>;

// Labeled version of CardActions for the place detail page — same
// localStorage-backed logic, bigger buttons with text since there's no
// tight card layout to fit into here. See CardActions.tsx for why this
// takes strings as a prop instead of calling tFor(lang) itself.
export function PlaceActions({ placeId, t }: { placeId: string; t: PlaceActionsStrings }) {
  const [favorited, setFavorited] = useState(false);
  const [compared, setCompared] = useState(false);
  const [limitMessage, setLimitMessage] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(placeId));
    setCompared(isInCompare(placeId));
  }, [placeId]);

  return (
    <div className="flex items-center flex-wrap gap-2 mb-6">
      <button
        type="button"
        onClick={() => setFavorited(toggleFavorite(placeId))}
        aria-pressed={favorited}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
          favorited
            ? "border-accent-warm bg-accent-warm/10 text-accent-warm"
            : "border-border text-muted hover:text-accent-warm hover:border-accent-warm/40"
        }`}
      >
        <span aria-hidden="true">{favorited ? "♥" : "♡"}</span>
        {favorited ? t.removeFavorite : t.addFavorite}
      </button>
      <button
        type="button"
        onClick={() => {
          const result = toggleCompare(placeId);
          setCompared(result.ids.includes(placeId));
          if (result.atLimit) {
            setLimitMessage(true);
            setTimeout(() => setLimitMessage(false), 2500);
          }
        }}
        aria-pressed={compared}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
          compared
            ? "border-accent bg-accent/10 text-accent"
            : "border-border text-muted hover:text-accent hover:border-accent/40"
        }`}
      >
        <span aria-hidden="true">{compared ? "✓" : "+"}</span>
        {compared ? t.removeFromCompare : t.addToCompare}
      </button>
      {limitMessage && (
        <span className="text-xs text-red-500 font-medium">
          {t.compareLimitReached.replace("{max}", String(MAX_COMPARE))}
        </span>
      )}
    </div>
  );
}
