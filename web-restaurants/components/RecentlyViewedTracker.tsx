"use client";
import { useEffect } from "react";
import { recordViewed } from "@/lib/recentlyViewed";

// Invisible — just records the current restaurant into the visitor's
// recently-viewed list so it can surface as a "next click" on later pages.
export function RecentlyViewedTracker({ id }: { id: string }) {
  useEffect(() => {
    recordViewed(id);
  }, [id]);
  return null;
}
