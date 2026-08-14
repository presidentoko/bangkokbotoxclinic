"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { priceMedian } from "@/lib/summary";
import { distanceKm } from "@/lib/geo";
import { PlaceCard } from "./PlaceCard";

// Price-bucket filter plus an opt-in "near me" distance sort -- lat/lng is
// 100% covered in the live dataset, but nothing on the site used the
// visitor's own location until this (see lib/related.ts for the
// place-to-place proximity used in "similar places" instead, which is a
// different feature: that ranks by distance between two *listings*, this
// ranks by distance from the *visitor*, the actual "what's near me right
// now" use case flagged as the top mobile retention opportunity).
//
// Operates on the `places` prop as given (already capped to the city
// page's MAX_SHOWN=90 "top by rating" slice, and stripped of `reviews`
// before it reaches this client component) rather than the full city
// dataset, to avoid re-inflating the page payload the MAX_SHOWN cap was
// added to fix in the first place.
type Bucket = "all" | "under300" | "300to500" | "500to800" | "over800";
type GeoState = "idle" | "loading" | "active" | "denied" | "unavailable";

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
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const withMedian = useMemo(() => places.map((p) => ({ place: p, median: priceMedian(p.priceMentions) })), [places]);
  const bucketFiltered = withMedian.filter(({ median }) => matchesBucket(median, bucket)).map(({ place }) => place);

  const nearMeActive = geoState === "active" && userCoords != null;
  const withDistance = useMemo(() => {
    if (!nearMeActive || !userCoords) return null;
    return bucketFiltered
      .filter((p) => p.lat != null && p.lng != null)
      .map((p) => ({ place: p, km: distanceKm(userCoords, { lat: p.lat as number, lng: p.lng as number }) }))
      .sort((a, b) => a.km - b.km);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearMeActive, bucketFiltered.map((p) => p.id).join(","), userCoords?.lat, userCoords?.lng]);

  const filtered = withDistance ? withDistance.map((d) => d.place) : bucketFiltered;

  function toggleNearMe() {
    if (nearMeActive) {
      setGeoState("idle");
      return;
    }
    if (userCoords) {
      setGeoState("active");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoState("unavailable");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState("active");
      },
      () => setGeoState("denied"),
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }

  const labels: Record<Bucket, string> = {
    all: t.priceFilter.all,
    under300: t.priceFilter.under.replace("{price}", "300"),
    "300to500": t.priceFilter.range.replace("{min}", "300").replace("{max}", "500"),
    "500to800": t.priceFilter.range.replace("{min}", "500").replace("{max}", "800"),
    over800: t.priceFilter.over.replace("{price}", "800"),
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted font-semibold mr-1">{t.priceFilter.label}</span>
          {BUCKET_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setBucket(key)}
              aria-pressed={bucket === key}
              className={`min-h-11 rounded-full border px-3.5 text-xs font-semibold transition-colors ${
                bucket === key ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-accent/40"
              }`}
            >
              {labels[key]}
            </button>
          ))}
          <button
            type="button"
            onClick={toggleNearMe}
            disabled={geoState === "loading"}
            aria-pressed={nearMeActive}
            className={`min-h-11 rounded-full border px-3.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
              nearMeActive ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-accent/40"
            }`}
          >
            📍 {geoState === "loading" ? t.city.nearMeLoading : t.city.nearMeLabel}
          </button>
        </div>
        {(geoState === "denied" || geoState === "unavailable") && (
          <p className="text-xs text-red-500 mt-2">
            {geoState === "denied" ? t.city.nearMeDenied : t.city.nearMeUnavailable}
          </p>
        )}
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
              editorsPick={!nearMeActive && bucket === "all" && i === 0}
              size={!nearMeActive && bucket === "all" && i === 0 ? "large" : "default"}
              distanceLabel={
                withDistance
                  ? t.city.nearMeDistance.replace("{km}", withDistance[i].km.toFixed(1))
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
