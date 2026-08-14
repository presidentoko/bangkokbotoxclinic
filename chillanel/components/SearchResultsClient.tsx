"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { loadPlacesIndex } from "@/lib/places-index-client";
import { isRelevantCategory } from "@/lib/categories";
import { matchesQuery } from "@/lib/search-match";
import { PlaceCard } from "@/components/PlaceCard";
import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";

const SUGGESTION_COUNT = 6;

function placeThemeLabels(place: Place): string[] {
  return [...place.serviceThemes, ...place.moodKeywords].map((t) => t.label);
}

// The full results page SearchBox's dropdown links to -- that dropdown
// only ever shows the top 8 matches; this shows everything, using the same
// matchesQuery() rule against the full places-index.json (not the slim
// search-index.json the dropdown uses, since PlaceCard needs the full
// Place shape).
export function SearchResultsClient({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const [results, setResults] = useState<Place[] | null>(null);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setResults(null);
    const needle = query.toLowerCase();
    loadPlacesIndex()
      .then((all) => {
        const relevant = all.filter((p) => isRelevantCategory(p.primaryType));
        const matched = needle
          ? relevant.filter((p) =>
              matchesQuery({ name: p.name, city: p.city, district: p.district, themeLabels: placeThemeLabels(p) }, lang, needle)
            )
          : [];
        matched.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
        setResults(matched);
        if (matched.length === 0) {
          setSuggestions(
            [...relevant].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount).slice(0, SUGGESTION_COUNT)
          );
        }
      })
      .catch(() => setError(true));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [query]);

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-4">{t.favorites.loadError}</p>
        <button type="button" onClick={load} className="text-sm font-semibold text-accent hover:underline">
          {t.favorites.retry}
        </button>
      </div>
    );
  }

  if (results === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {Array.from({ length: 6 }, (_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div>
        <div className="text-center py-12">
          <p className="font-semibold mb-1">{t.search.noResults.replace("{query}", query)}</p>
          <p className="text-muted text-sm">{t.search.noResultsHint}</p>
        </div>
        {suggestions.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">{t.search.suggestedTitle}</h2>
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
    <div>
      <p className="text-sm text-muted mb-6">{t.search.resultCount.replace("{n}", String(results.length))}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {results.map((place) => (
          <PlaceCard key={place.id} place={place} lang={lang} />
        ))}
      </div>
    </div>
  );
}
