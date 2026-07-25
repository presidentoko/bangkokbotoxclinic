"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { isInCompare, toggleCompare, MAX_COMPARE } from "@/lib/compare";

// Small client island rendered inside PlaceCard's <Link> — PlaceCard itself
// stays a plain (server-renderable) component. localStorage doesn't exist
// during SSR, so both buttons start unchecked and sync to real state in a
// mount-time effect; this avoids a hydration mismatch at the cost of a
// one-frame flash from unchecked -> checked on pages loaded with existing
// favorites/compare selections, which is an acceptable tradeoff for a
// purely client-side feature with no backend.
export function CardActions({ placeId, lang }: { placeId: string; lang: Lang }) {
  const t = tFor(lang);
  const [favorited, setFavorited] = useState(false);
  const [compared, setCompared] = useState(false);
  const [compareAtLimit, setCompareAtLimit] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(placeId));
    setCompared(isInCompare(placeId));
  }, [placeId]);

  function onFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(toggleFavorite(placeId));
  }

  function onCompareClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(placeId);
    setCompared(result.ids.includes(placeId));
    setCompareAtLimit(result.atLimit);
    if (result.atLimit) {
      setTimeout(() => setCompareAtLimit(false), 1500);
    }
  }

  return (
    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
      <button
        type="button"
        onClick={onFavoriteClick}
        aria-label={favorited ? t.place.removeFavorite : t.place.addFavorite}
        aria-pressed={favorited}
        className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm backdrop-blur-sm transition-colors ${
          favorited ? "bg-accent-warm text-ink" : "bg-bg-elev/90 text-muted hover:text-accent-warm"
        }`}
      >
        <span aria-hidden="true">{favorited ? "♥" : "♡"}</span>
      </button>
      <button
        type="button"
        onClick={onCompareClick}
        aria-label={compared ? t.place.removeFromCompare : t.place.addToCompare}
        aria-pressed={compared}
        title={compareAtLimit ? t.place.compareLimitReached.replace("{max}", String(MAX_COMPARE)) : undefined}
        className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm backdrop-blur-sm text-[11px] font-bold transition-colors ${
          compared
            ? "bg-accent text-on-ink"
            : compareAtLimit
              ? "bg-bg-elev/90 text-red-500"
              : "bg-bg-elev/90 text-muted hover:text-accent"
        }`}
      >
        <span aria-hidden="true">{compared ? "✓" : "+"}</span>
      </button>
    </div>
  );
}
