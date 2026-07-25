"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { isInCompare, toggleCompare, MAX_COMPARE } from "@/lib/compare";

// Labeled version of CardActions for the place detail page — same
// localStorage-backed logic, bigger buttons with text since there's no
// tight card layout to fit into here.
export function PlaceActions({ placeId, lang }: { placeId: string; lang: Lang }) {
  const t = tFor(lang);
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
        {favorited ? t.place.removeFavorite : t.place.addFavorite}
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
        {compared ? t.place.removeFromCompare : t.place.addToCompare}
      </button>
      {limitMessage && (
        <span className="text-xs text-red-500 font-medium">
          {t.place.compareLimitReached.replace("{max}", String(MAX_COMPARE))}
        </span>
      )}
    </div>
  );
}
