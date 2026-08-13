"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { getFavoriteIds } from "@/lib/favorites";
import { PlaceCard } from "@/components/PlaceCard";
import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";
import { ArrowRightIcon } from "@/components/Icon";

// This whole page has to be client-rendered: favorites live in localStorage
// (no backend, no per-user data at build time), and the only way to turn a
// saved ID into a renderable card is to fetch the static places-index.json
// (built by scripts/build-data.mjs, stripped of review text) and filter it
// client-side.
const SUGGESTION_COUNT = 3;

export function FavoritesClient({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const [places, setPlaces] = useState<Place[] | null>(null);
  // Populated only when favorites are empty, so the empty state isn't a
  // dead end — real top-rated places, not placeholder content.
  const [suggestions, setSuggestions] = useState<Place[]>([]);

  useEffect(() => {
    const ids = new Set(getFavoriteIds());
    fetch("/places-index.json")
      .then((res) => res.json())
      .then((all: Place[]) => {
        setPlaces(all.filter((p) => ids.has(p.id)));
        if (ids.size === 0) {
          setSuggestions(
            [...all]
              .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
              .slice(0, SUGGESTION_COUNT)
          );
        }
      })
      .catch(() => setPlaces([]));
  }, []);

  if (places === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }, (_, i) => (
          // Fixed-length placeholder array, not a reorderable list.
          // eslint-disable-next-line react/no-array-index-key
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div>
        <div className="text-center py-16">
          <p className="text-muted mb-4">{t.favorites.empty}</p>
          <Link href={`/${lang}`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
            {t.favorites.browseCta} <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
        {suggestions.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">
              {t.favorites.suggestedTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {suggestions.map((place) => (
                <PlaceCard key={place.id} place={place} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} lang={lang} />
      ))}
    </div>
  );
}
