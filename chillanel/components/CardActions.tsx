"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { isInCompare, toggleCompare, MAX_COMPARE } from "@/lib/compare";
import { HeartIcon, CheckIcon, PlusIcon } from "./Icon";

type CardActionsStrings = Pick<
  Dict["place"],
  "addFavorite" | "removeFavorite" | "addToCompare" | "removeFromCompare" | "compareLimitReached"
>;

// Small client island rendered inside PlaceCard's <Link> — PlaceCard itself
// stays a plain (server-renderable) component. localStorage doesn't exist
// during SSR, so both buttons start unchecked and sync to real state in a
// mount-time effect; this avoids a hydration mismatch at the cost of a
// one-frame flash from unchecked -> checked on pages loaded with existing
// favorites/compare selections, which is an acceptable tradeoff for a
// purely client-side feature with no backend.
//
// Takes its strings as a prop instead of calling tFor(lang) itself: this
// is the one client leaf rendered on every single PlaceCard -- a
// server-rendered city/district/service/home page with a 90-card grid
// used to ship the full ~56KB 3-language i18n dict to the browser for
// nothing but 5 button labels. PlaceCard already computes the full dict
// (server-side, free, when rendered from a server page) and just forwards
// the slice this needs.
export function CardActions({ placeId, t }: { placeId: string; t: CardActionsStrings }) {
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
        aria-label={favorited ? t.removeFavorite : t.addFavorite}
        aria-pressed={favorited}
        className={`flex items-center justify-center w-11 h-11 rounded-full shadow-sm backdrop-blur-sm transition-colors active:scale-95 ${
          favorited ? "bg-accent-warm text-ink" : "bg-bg-elev/90 text-muted hover:text-accent-warm"
        }`}
      >
        <HeartIcon filled={favorited} className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onCompareClick}
        aria-label={compared ? t.removeFromCompare : t.addToCompare}
        aria-pressed={compared}
        title={compareAtLimit ? t.compareLimitReached.replace("{max}", String(MAX_COMPARE)) : undefined}
        className={`flex items-center justify-center w-11 h-11 rounded-full shadow-sm backdrop-blur-sm transition-colors active:scale-95 ${
          compared
            ? "bg-accent text-on-ink"
            : compareAtLimit
              ? "bg-bg-elev/90 text-red-500"
              : "bg-bg-elev/90 text-muted hover:text-accent"
        }`}
      >
        {compared ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}
