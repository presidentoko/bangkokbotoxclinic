"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { getFavoriteIds } from "@/lib/favorites";
import { PlaceCard } from "@/components/PlaceCard";

// This whole page has to be client-rendered: favorites live in localStorage
// (no backend, no per-user data at build time), and the only way to turn a
// saved ID into a renderable card is to fetch the static places-index.json
// (built by scripts/build-data.mjs, stripped of review text) and filter it
// client-side.
export function FavoritesClient({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const [places, setPlaces] = useState<Place[] | null>(null);

  useEffect(() => {
    const ids = new Set(getFavoriteIds());
    if (ids.size === 0) {
      setPlaces([]);
      return;
    }
    fetch("/places-index.json")
      .then((res) => res.json())
      .then((all: Place[]) => setPlaces(all.filter((p) => ids.has(p.id))))
      .catch(() => setPlaces([]));
  }, []);

  if (places === null) return null;

  if (places.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-4">{t.favorites.empty}</p>
        <Link href={`/${lang}`} className="inline-block text-sm font-semibold text-accent hover:underline">
          {t.favorites.browseCta} →
        </Link>
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
