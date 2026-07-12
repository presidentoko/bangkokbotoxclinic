"use client";
import { useEffect, useState } from "react";
import { PersonalizedSection } from "./PersonalizedSection";

type SlimRestaurant = {
  id: string;
  name: string;
  district: string;
  city_label: string;
  rating: number;
  trust_score: number;
  cuisines: string[];
};

// Fetches the same search index instead of receiving all 3,630 restaurants
// as an inline prop — keeps them out of the page's RSC payload.
export function LazyPersonalized() {
  const [restaurants, setRestaurants] = useState<SlimRestaurant[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/search-index")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { if (!cancelled) setRestaurants(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return <PersonalizedSection restaurants={restaurants} />;
}
