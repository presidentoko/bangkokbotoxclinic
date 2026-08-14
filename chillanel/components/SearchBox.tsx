"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/site";
import type { Dict } from "@/lib/i18n";
import { matchesQuery } from "@/lib/search-match";

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
    // See lib/places-index-client.ts for why inFlight must reset on
    // failure: without it, one transient network error leaves every future
    // keystroke stuck on the loading state for the rest of the session.
    inFlight = fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(`search-index.json: HTTP ${res.status}`);
        return res.json() as Promise<SearchEntry[]>;
      })
      .then((all) => {
        cachedEntries = all;
        return all;
      })
      .catch((err) => {
        inFlight = null;
        throw err;
      });
  }
  return inFlight;
}

function matches(entry: SearchEntry, lang: Lang, needle: string): boolean {
  return matchesQuery({ name: entry.name, city: entry.city, district: entry.district, themeLabels: entry.themes }, lang, needle);
}

// Takes the already-resolved nav dict slice as a prop, not `lang` alone --
// SearchBox is a shared client chunk mounted on every single page (via
// Header + MobileNav), so if it called tFor(lang) itself it would need to
// bundle all 3 languages' full site copy (lib/i18n.ts, ~56KB) into that
// chunk to cover every possible `lang` value at runtime. Header/MobileNav
// are Server/parent components that already compute the full dict
// server-side or receive it as a prop themselves -- passing just the nav
// slice down keeps lib/i18n out of this component's client bundle entirely.
export function SearchBox({ lang, t }: { lang: Lang; t: Dict["nav"] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<SearchEntry[] | null>(cachedEntries);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
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
    setFailed(false);
    loadEntries()
      .then((all) => {
        setEntries(all);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setFailed(true);
      });
  }

  const trimmed = query.trim().toLowerCase();
  const searching = trimmed.length >= MIN_QUERY_LENGTH;
  const matchingEntries = entries && searching ? entries.filter((e) => matches(e, lang, trimmed)) : [];
  const results = matchingEntries
    .slice()
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
    .slice(0, MAX_RESULTS);

  function goToResultsPage() {
    setOpen(false);
    router.push(`/${lang}/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <input
        type="search"
        value={query}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchOpen}
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
            setOpen(false);
            router.push(`/${lang}/place/${results[activeIndex].id}`);
          } else if (e.key === "Enter" && searching) {
            // No result highlighted (user typed and hit Enter without
            // arrowing down) -- used to just do nothing. Now goes to a real
            // results page instead of silently eating the keystroke.
            e.preventDefault();
            goToResultsPage();
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
            <p className="px-4 py-3 text-sm text-muted">{t.searchLoading}</p>
          ) : !entries && failed ? (
            <button
              type="button"
              onClick={ensureLoaded}
              className="w-full px-4 py-3 text-left text-sm text-muted hover:text-ink"
            >
              {t.searchError}
            </button>
          ) : results.length === 0 ? (
            <div>
              <p className="px-4 py-3 text-sm text-muted">{t.searchNoResults}</p>
              <button
                type="button"
                onClick={goToResultsPage}
                className="w-full min-h-11 px-4 py-3 text-left text-sm font-semibold text-accent hover:bg-bg border-t border-border"
              >
                {t.searchSeeAllResults.replace("{query}", query.trim())}
              </button>
            </div>
          ) : (
            <>
              {results.map((place, i) => (
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
              ))}
              {matchingEntries.length > MAX_RESULTS && (
                <button
                  type="button"
                  onClick={goToResultsPage}
                  className="w-full min-h-11 px-4 py-3 text-left text-sm font-semibold text-accent hover:bg-bg"
                >
                  {t.searchSeeAllResults.replace("{query}", query.trim())}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
