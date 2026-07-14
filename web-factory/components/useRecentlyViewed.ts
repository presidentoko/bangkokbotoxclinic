"use client";

import { useEffect, useState } from "react";
import { loadRecent, subscribeRecent, type RecentItem } from "@/lib/recentlyViewed";

// Mirrors components/useShortlist.ts's shape for the recently-viewed store.
// `mounted` is false during SSR/first paint so callers can avoid hydration mismatch.
export function useRecentlyViewed(): { items: RecentItem[]; mounted: boolean } {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(loadRecent());
    return subscribeRecent(() => setItems(loadRecent()));
  }, []);

  return { items, mounted };
}
