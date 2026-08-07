"use client";

// Wraps the shared HeroSearch component (do not edit HeroSearch/SearchBar directly —
// they're synced from shared/components/*) and lazy-fetches the search index client-side
// instead of the page embedding all ~5,000 suppliers in server-rendered HTML.

import { useEffect, useState } from "react";
import { HeroSearch } from "./HeroSearch";
import { loadBrowseIndex } from "@/lib/browseIndexClient";
import type { SearchableEntity } from "./SearchBar";

export function LazyHeroSearch({
  hrefBase,
  hero,
  heroSub,
  popularSearches,
  popularLabel,
  searchPlaceholder,
  searchLang,
}: {
  hrefBase: string;
  hero?: string;
  heroSub?: string;
  popularSearches: { label: string; href: string }[];
  popularLabel?: string;
  searchPlaceholder?: string;
  searchLang?: "en" | "ko" | "th";
}) {
  const [entities, setEntities] = useState<SearchableEntity[]>([]);

  useEffect(() => {
    let on = true;
    loadBrowseIndex().then((data) => {
      if (on) setEntities(data as unknown as SearchableEntity[]);
    });
    return () => {
      on = false;
    };
  }, []);

  return (
    <HeroSearch
      entities={entities}
      hrefBase={hrefBase}
      hero={hero}
      heroSub={heroSub}
      popularSearches={popularSearches}
      popularLabel={popularLabel}
      searchPlaceholder={searchPlaceholder}
      searchLang={searchLang}
    />
  );
}
