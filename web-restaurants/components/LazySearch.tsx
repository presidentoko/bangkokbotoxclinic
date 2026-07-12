"use client";
import { useEffect, useState } from "react";
import { HeroSearch } from "./HeroSearch";
import type { SearchableEntity } from "./SearchBar";

// Fetches the search index client-side instead of receiving all 3,630
// restaurants as an inline prop — keeps them out of the page's RSC payload.
export function LazySearch(props: {
  hrefBase: string;
  hero?: string;
  heroSub?: string;
  popularSearches: { label: string; href: string }[];
  popularLabel?: string;
  searchPlaceholder?: string;
  searchLang?: "en" | "ko" | "th";
  noMatchesText?: string;
  resultsHeader?: string;
}) {
  const [entities, setEntities] = useState<SearchableEntity[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/search-index")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { if (!cancelled) setEntities(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return <HeroSearch {...props} entities={entities} />;
}
