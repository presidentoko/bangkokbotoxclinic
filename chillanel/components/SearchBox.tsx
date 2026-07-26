"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";

const MAX_RESULTS = 8;
const MIN_QUERY_LENGTH = 2;

// Module-level cache: places-index.json (~2,271 places, no review text) is
// the same static asset favorites/compare already fetch client-side, but a
// search box gets touched far more often per session -- caching after the
// first fetch avoids re-downloading it on every open.
let cachedPlaces: Place[] | null = null;
let inFlight: Promise<Place[]> | null = null;

function loadPlaces(): Promise<Place[]> {
  if (cachedPlaces) return Promise.resolve(cachedPlaces);
  if (!inFlight) {
    inFlight = fetch("/places-index.json")
      .then((res) => res.json())
      .then((all: Place[]) => {
        cachedPlaces = all;
        return all;
      });
  }
  return inFlight;
}

export function SearchBox({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [places, setPlaces] = useState<Place[] | null>(cachedPlaces);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const results =
    places && query.trim().length >= MIN_QUERY_LENGTH
      ? places
          .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
          .slice(0, MAX_RESULTS)
      : [];

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <input
        type="search"
        value={query}
        placeholder={t.nav.searchPlaceholder}
        aria-label={t.nav.searchOpen}
        onFocus={() => {
          setOpen(true);
          if (!places) loadPlaces().then(setPlaces);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!places) loadPlaces().then(setPlaces);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-full rounded-full border border-border bg-bg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
      {open && query.trim().length >= MIN_QUERY_LENGTH && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border bg-bg-elev shadow-xl overflow-hidden z-40 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">{t.nav.searchNoResults}</p>
          ) : (
            results.map((place) => (
              <Link
                key={place.id}
                href={`/${lang}/place/${place.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-bg transition-colors border-b border-border last:border-0"
              >
                <span className="text-sm font-medium truncate">{place.name}</span>
                {place.rating != null && (
                  <span className="shrink-0 text-xs font-bold text-accent-warm">★ {place.rating.toFixed(1)}</span>
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
