"use client";

import { useEffect, useState } from "react";
import { loadFavorites, subscribeFavorites, type FavoriteItem } from "@/lib/favorites";

// Reads the localStorage favorites list and re-renders on change (same- and cross-tab).
// `mounted` is false during SSR/first paint so callers can avoid hydration mismatch.
export function useFavorites(): { items: FavoriteItem[]; mounted: boolean } {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(loadFavorites());
    return subscribeFavorites(() => setItems(loadFavorites()));
  }, []);

  return { items, mounted };
}
