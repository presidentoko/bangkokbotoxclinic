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

type MapPoint = { id: string; name: string; lat: number; lng: number; rating: number | null };
type Row = [string, string, number, number, number | null, string | null];

// Click-to-reveal rather than auto-shown: Leaflet + its tile requests are
// real weight (JS bundle + however many map tile images the viewport
// needs) that most visitors landing on a city/district listing don't ask
// for immediately -- unlike the IntersectionObserver-based lazy loads used
// elsewhere on this site (RecommendedForYou, RecentlyViewed), a map is
// substantial enough to gate behind an explicit tap, not just scroll
// position.
//
// The pins themselves are fetched on that tap too, from /map-points/<city>
// (app/map-points/[city]/route.ts) -- see that file for why they are no
// longer a prop. `district` narrows the city's pins for district pages.
export function CityMap({
  city,
  district,
  lang,
  showLabel,
  viewLabel,
}: {
  city: string;
  district?: string;
  lang: Lang;
  showLabel: string;
  viewLabel: string;
}) {
  const [points, setPoints] = useState<MapPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function show() {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch(`/map-points/${city}`);
      if (!res.ok) throw new Error(String(res.status));
      const rows = (await res.json()) as Row[];
      setPoints(
        rows
          .filter((r) => district == null || r[5] === district)
          .map(([id, name, lat, lng, rating]) => ({ id, name, lat, lng, rating })),
      );
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  if (points == null || points.length === 0) {
    return (
      <button
        type="button"
        onClick={show}
        disabled={loading}
        className="w-full h-40 sm:h-48 rounded-2xl border border-dashed border-border bg-bg-elev hover:border-accent hover:bg-bg transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-accent disabled:animate-pulse"
      >
        🗺️ {showLabel}
        {failed && <span aria-live="polite">↻</span>}
      </button>
    );
  }

  return <PlaceMap places={points} lang={lang} viewLabel={viewLabel} />;
}
