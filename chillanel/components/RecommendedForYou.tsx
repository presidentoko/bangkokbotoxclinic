"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/site";
import type { Place, ThemeCount } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { getFavoriteIds } from "@/lib/favorites";
import { loadPlacesIndex } from "@/lib/places-index-client";
import { PlaceCard } from "@/components/PlaceCard";
import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";

const RECOMMEND_COUNT = 6;
const MIN_MATCHES_TO_USE_FAVORITES = 3;
const QUALITY_MIN_RATING = 4.5;
const QUALITY_MIN_REVIEWS = 20;

function placeLabels(place: Place): ThemeCount[] {
  return [...place.serviceThemes, ...place.moodKeywords];
}

// The 2 mood/service labels that show up most across a visitor's favorited
// places -- e.g. favoriting 3 "Quiet & relaxing" places surfaces more
// quiet places, not just more of whatever's overall top-rated.
function topLabels(favorited: Place[], max = 2): Set<string> {
  const counts = new Map<string, number>();
  for (const place of favorited) {
    for (const item of placeLabels(place)) {
      counts.set(item.label, (counts.get(item.label) ?? 0) + 1);
    }
  }
  return new Set([...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, max).map(([label]) => label));
}

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function RecommendedForYou({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const [items, setItems] = useState<Place[] | null>(null);
  const [basedOnFavorites, setBasedOnFavorites] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // This section sits below the fold on the homepage, but used to fire the
  // places-index.json fetch (several MB) on every mount regardless of
  // whether the visitor ever scrolled to it. Deferring to an
  // IntersectionObserver means a visitor who bounces from the hero never
  // pays for it, and the ones who do scroll trigger it right as it's about
  // to become visible instead of at page load.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    let triggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (triggered || !entries.some((e) => e.isIntersecting)) return;
        triggered = true;
        observer.disconnect();
        load();
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function load() {
    const favIds = new Set(getFavoriteIds());
    loadPlacesIndex()
      .then((all) => {
        if (favIds.size > 0) {
          const favorited = all.filter((p) => favIds.has(p.id));
          const labels = topLabels(favorited);
          if (labels.size > 0) {
            const matches = all
              .filter((p) => !favIds.has(p.id) && placeLabels(p).some((item) => labels.has(item.label)))
              .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
            if (matches.length >= MIN_MATCHES_TO_USE_FAVORITES) {
              setBasedOnFavorites(true);
              setItems(matches.slice(0, RECOMMEND_COUNT));
              return;
            }
          }
        }
        // No favorites yet, or too few to find a real pattern in -- a
        // random pick from a quality-gated pool instead of leaving this
        // section empty or just repeating "Featured places" verbatim.
        const pool = all.filter((p) => (p.rating ?? 0) >= QUALITY_MIN_RATING && p.reviewCount >= QUALITY_MIN_REVIEWS);
        setBasedOnFavorites(false);
        setItems(shuffled(pool).slice(0, RECOMMEND_COUNT));
      })
      .catch(() => setItems([]));
  }

  if (items === null) {
    return (
      <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-16">
        {Array.from({ length: 3 }, (_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (items.length === 0) return <div ref={rootRef} />;

  return (
    <section ref={rootRef} className="mb-16">
      <h2 className="font-display italic text-2xl sm:text-3xl mb-6">
        {basedOnFavorites ? t.home.recommendedTitle : t.home.discoverTitle}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((place) => (
          <PlaceCard key={place.id} place={place} lang={lang} />
        ))}
      </div>
    </section>
  );
}
