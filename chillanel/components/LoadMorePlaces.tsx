"use client";

import { useState } from "react";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { loadPlacesIndex } from "@/lib/places-index-client";
import { isRelevantCategory } from "@/lib/categories";
import { placeMatchesLabel } from "@/lib/theme-stats";
import { PlaceCard } from "@/components/PlaceCard";

// city/district/service listing pages server-render only the top
// MAX_SHOWN=90 places (by design -- a full Bangkok render was 1.6MB of
// static HTML in one page). That cap meant ~97% of the 6,204-place
// catalog (mainly Bangkok's long tail) was only reachable via search or
// the sitemap, never by browsing. This picks up right where the
// server-rendered grid stops: places-index.json already ships every place
// in every city (favorites/compare/recommendations already fetch it
// client-side), so "load more" re-filters/re-sorts that same client index
// with the identical predicate + sort order the server page used, and
// reveals it in batches -- no new build-time data, no server payload
// growth for visitors who never click the button.
export type PlaceFilter =
  | { type: "city"; city: string }
  | { type: "district"; district: string }
  | { type: "theme"; label: string };

const BATCH_SIZE = 60;

function matchesFilter(p: Place, filter: PlaceFilter): boolean {
  if (!isRelevantCategory(p.primaryType)) return false;
  if (filter.type === "city") return p.city === filter.city;
  if (filter.type === "district") return p.district === filter.district;
  return placeMatchesLabel(p, filter.label);
}

function sortPlaces(places: Place[]): Place[] {
  return places.slice().sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
}

export function LoadMorePlaces({
  filter,
  alreadyShownIds,
  totalCount,
  lang,
}: {
  filter: PlaceFilter;
  /** IDs already rendered by the server so the client pool never duplicates them. */
  alreadyShownIds: string[];
  /** True count of matching places (server already computed this for the "showing top N of X" copy). */
  totalCount: number;
  lang: Lang;
}) {
  const t = tFor(lang);
  const [pool, setPool] = useState<Place[] | null>(null);
  const [visible, setVisible] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const remaining = totalCount - alreadyShownIds.length;
  if (remaining <= 0) return null;

  async function loadMore() {
    setLoading(true);
    setFailed(false);
    try {
      let currentPool = pool;
      if (currentPool === null) {
        const shownIds = new Set(alreadyShownIds);
        const all = await loadPlacesIndex();
        currentPool = sortPlaces(all.filter((p) => !shownIds.has(p.id) && matchesFilter(p, filter)));
        setPool(currentPool);
      }
      setVisible((v) => Math.min(v + BATCH_SIZE, currentPool!.length));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  const shown = pool ? pool.slice(0, visible) : [];
  const doneLoadingAll = pool !== null && visible >= pool.length;

  return (
    <div>
      {shown.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          {shown.map((place) => (
            <PlaceCard key={place.id} place={place} lang={lang} />
          ))}
        </div>
      )}
      {!doneLoadingAll && (
        <div className="flex flex-col items-center mt-8">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="min-h-11 rounded-full border border-border bg-bg-elev px-6 font-semibold hover:border-accent hover:text-accent transition disabled:opacity-60"
          >
            {loading ? t.city.loadMoreLoading : t.city.loadMore}
          </button>
          {failed && <p className="text-xs text-red-500 mt-2">{t.favorites.loadError}</p>}
        </div>
      )}
    </div>
  );
}
