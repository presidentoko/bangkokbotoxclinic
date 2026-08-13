"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { priceMedian } from "@/lib/summary";
import { PlaceCard } from "./PlaceCard";

// A price-bucket filter, not a distance filter -- lat/lng is actually
// 100% covered in the live dataset (contrary to an earlier note here),
// so real "near me" distance sorting is buildable as a future feature;
// this component just doesn't attempt it yet.
//
// Operates on the `places` prop as given (already capped to the city
// page's MAX_SHOWN=90 "top by rating" slice, and stripped of `reviews`
// before it reaches this client component) rather than the full city
// dataset, to avoid re-inflating the page payload the MAX_SHOWN cap was
// added to fix in the first place.
type Bucket = "all" | "under300" | "300to500" | "500to800" | "over800";

const BUCKET_ORDER: Bucket[] = ["all", "under300", "300to500", "500to800", "over800"];

function matchesBucket(median: number | null, bucket: Bucket): boolean {
  if (bucket === "all") return true;
  if (median == null) return false;
  if (bucket === "under300") return median < 300;
  if (bucket === "300to500") return median >= 300 && median < 500;
  if (bucket === "500to800") return median >= 500 && median < 800;
  return median >= 800;
}

export function PriceFilterableGrid({ places, lang }: { places: Place[]; lang: Lang }) {
  const t = tFor(lang);
  const [bucket, setBucket] = useState<Bucket>("all");

  const withMedian = useMemo(() => places.map((p) => ({ place: p, median: priceMedian(p.priceMentions) })), [places]);
  const filtered = withMedian.filter(({ median }) => matchesBucket(median, bucket)).map(({ place }) => place);

  const labels: Record<Bucket, string> = {
    all: t.priceFilter.all,
    under300: t.priceFilter.under.replace("{price}", "300"),
    "300to500": t.priceFilter.range.replace("{min}", "300").replace("{max}", "500"),
    "500to800": t.priceFilter.range.replace("{min}", "500").replace("{max}", "800"),
    over800: t.priceFilter.over.replace("{price}", "800"),
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs uppercase tracking-wide text-muted font-semibold mr-1">{t.priceFilter.label}</span>
        {BUCKET_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setBucket(key)}
            aria-pressed={bucket === key}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              bucket === key ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-accent/40"
            }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-muted text-sm py-8">{t.priceFilter.noPriceData}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:auto-rows-[1fr] gap-5 mb-14">
          {filtered.map((place, i) => (
            <PlaceCard
              key={place.id}
              place={place}
              lang={lang}
              editorsPick={bucket === "all" && i === 0}
              size={bucket === "all" && i === 0 ? "large" : "default"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
