"use client";

import { useEffect, useState } from "react";
import { loadShortlist, subscribeShortlist, type ShortlistItem } from "@/lib/shortlist";

// Reads the localStorage shortlist and re-renders on change (same- and cross-tab).
// `mounted` is false during SSR/first paint so callers can avoid hydration mismatch.
export function useShortlist(): { items: ShortlistItem[]; mounted: boolean } {
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(loadShortlist());
    return subscribeShortlist(() => setItems(loadShortlist()));
  }, []);

  return { items, mounted };
}
