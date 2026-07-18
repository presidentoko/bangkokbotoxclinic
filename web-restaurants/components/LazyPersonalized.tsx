"use client";
import { useEffect, useState } from "react";
import { PersonalizedSection } from "./PersonalizedSection";
import { fetchSearchIndex, type SearchIndexEntity } from "@/lib/searchIndexClient";

// Fetches the same search index instead of receiving all 3,630 restaurants
// as an inline prop — keeps them out of the page's RSC payload.
export function LazyPersonalized() {
  const [restaurants, setRestaurants] = useState<SearchIndexEntity[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchSearchIndex().then((data) => { if (!cancelled) setRestaurants(data); });
    return () => { cancelled = true; };
  }, []);

  return <PersonalizedSection restaurants={restaurants} />;
}
