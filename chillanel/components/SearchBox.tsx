"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/site";
import { cityLabel } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { themeLabel } from "@/lib/theme-labels";
import { districtLabel } from "@/lib/district-labels";

const MAX_RESULTS = 8;
const MIN_QUERY_LENGTH = 2;

type SearchEntry = {
  id: string;
  name: string;
  city: string;
  district: string | null;
  rating: number | null;
  reviewCount: number;
  themes: string[];
};

// Module-level cache: search-index.json is a slim, search-only projection
// of places-index.json (id/name/city/district/rating/reviewCount/themes,
// no address/phone/lat-lng/reviews) -- a search box gets touched far more
// often per session than favorites/compare, so it gets its own smaller
// asset instead of sharing the full-fidelity one. Caching after the first
// fetch avoids re-downloading it on every open.
let cachedEntries: SearchEntry[] | null = null;
let inFlight: Promise<SearchEntry[]> | null = null;

function loadEntries(): Promise<SearchEntry[]> {
  if (cachedEntries) return Promise.resolve(cachedEntries);
  if (!inFlight) {
    inFlight = fetch("/search-index.json")
      .then((res) => res.json())
      .then((all: SearchEntry[]) => {
        cachedEntries = all;
        return all;
      });
  }
  return inFlight;
}

// A place matches if the query hits its name, city, district, or any of
// its service/mood theme labels -- in whichever language the label is
// displayed in for this page, plus the raw English the data is stored in,
// so "Sukhumvit" and "타이 마사지" both find real results instead of only
// ever matching the place's own name.
function matches(entry: SearchEntry, lang: Lang, needle: string): boolean {
  const haystacks = [
    entry.name,
    cityLabel(entry.city),
    entry.district ? districtLabel(entry.district, lang) : "",
    entry.district ?? "",
    ...entry.themes.map((label) => themeLabel(label, lang)),
    ...entry.themes,
  ];
  return haystacks.some((h) => h.toLowerCase().includes(needle));
}

export function SearchBox({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<SearchEntry[] | null>(cachedEntries);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function ensureLoaded() {
    if (entries || loading) return;
    setLoading(true);
    loadEntries().then((all) => {
      setEntries(all);
      setLoading(false);
    });
  }

  const trimmed = query.trim().toLowerCase();
  const searching = trimmed.length >= MIN_QUERY_LENGTH;
  const results =
    entries && searching
      ? entries
          .filter((e) => matches(e, lang, trimmed))
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
        role="combobox"
        aria-expanded={open && searching}
        aria-controls="search-results-listbox"
        aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
        onFocus={() => {
          setOpen(true);
          ensureLoaded();
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
          ensureLoaded();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "ArrowDown" && results.length > 0) {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % results.length);
          } else if (e.key === "ArrowUp" && results.length > 0) {
            e.preventDefault();
            setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
          } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
            e.preventDefault();
            window.location.href = `/${lang}/place/${results[activeIndex].id}`;
          }
        }}
        className="w-full min-h-11 rounded-full border border-border bg-bg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
      {open && searching && (
        <div
          id="search-results-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border bg-bg-elev shadow-xl overflow-hidden z-40 max-h-96 overflow-y-auto"
        >
          {!entries && loading ? (
            <p className="px-4 py-3 text-sm text-muted">{t.nav.searchLoading}</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">{t.nav.searchNoResults}</p>
          ) : (
            results.map((place, i) => (
              <Link
                key={place.id}
                id={`search-result-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                href={`/${lang}/place/${place.id}`}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex items-center justify-between gap-3 min-h-11 px-4 py-3 transition-colors border-b border-border last:border-0 ${
                  i === activeIndex ? "bg-bg" : "hover:bg-bg"
                }`}
              >
                <span className="min-w-0 text-sm font-medium truncate">{place.name}</span>
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
