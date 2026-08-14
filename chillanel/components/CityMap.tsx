"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Lang } from "@/lib/site";

// Leaflet touches `window`/DOM APIs at module load, so it can only ever run
// client-side -- ssr:false is only legal inside a "use client" file (the
// restriction next/dynamic enforces is on Server Components), which is
// this wrapper's whole reason for existing separately from PlaceMap.tsx.
const PlaceMap = dynamic(() => import("./PlaceMap").then((m) => m.PlaceMap), {
  ssr: false,
  loading: () => <div className="h-80 sm:h-96 rounded-2xl border border-border bg-bg-elev animate-pulse" />,
});

type MapPlace = { id: string; name: string; lat: number | null; lng: number | null; rating: number | null };

// Click-to-reveal rather than auto-shown: Leaflet + its tile requests are
// real weight (JS bundle + however many map tile images the viewport
// needs) that most visitors landing on a city/district listing don't ask
// for immediately -- unlike the IntersectionObserver-based lazy loads used
// elsewhere on this site (RecommendedForYou, RecentlyViewed), a map is
// substantial enough to gate behind an explicit tap, not just scroll
// position.
export function CityMap({
  places,
  lang,
  showLabel,
  viewLabel,
}: {
  places: MapPlace[];
  lang: Lang;
  showLabel: string;
  viewLabel: string;
}) {
  const [shown, setShown] = useState(false);
  const points = places.filter((p): p is MapPlace & { lat: number; lng: number } => p.lat != null && p.lng != null);
  if (points.length === 0) return null;

  if (!shown) {
    return (
      <button
        type="button"
        onClick={() => setShown(true)}
        className="w-full h-40 sm:h-48 rounded-2xl border border-dashed border-border bg-bg-elev hover:border-accent hover:bg-bg transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-accent"
      >
        🗺️ {showLabel}
      </button>
    );
  }

  return <PlaceMap places={points} lang={lang} viewLabel={viewLabel} />;
}
