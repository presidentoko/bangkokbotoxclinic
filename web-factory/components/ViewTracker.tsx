"use client";

import { useEffect } from "react";
import { recordView, type RecentItem } from "@/lib/recentlyViewed";

export function ViewTracker(props: RecentItem) {
  useEffect(() => {
    recordView(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);
  return null;
}
