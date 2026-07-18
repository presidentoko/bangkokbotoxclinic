"use client";
import { useEffect, useState } from "react";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Restaurant } from "@/lib/types";

export function RecentlyViewedStrip({ excludeId }: { excludeId?: string }) {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    const ids = getRecentlyViewed().filter((id) => id !== excludeId);
    if (ids.length === 0) {
      setRestaurants([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/restaurants?ids=${ids.map(encodeURIComponent).join(",")}`)
      .then((res) => (res.ok ? res.json() : { restaurants: [] }))
      .then((data) => {
        if (cancelled) return;
        const byId = new Map<string, Restaurant>(
          (data.restaurants ?? []).map((r: Restaurant) => [r.id, r])
        );
        // Keep most-recently-viewed first.
        setRestaurants(ids.map((id) => byId.get(id)).filter(Boolean) as Restaurant[]);
      })
      .catch(() => { if (!cancelled) setRestaurants([]); });
    return () => { cancelled = true; };
  }, [excludeId]);

  if (!restaurants || restaurants.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
        Recently viewed
      </h2>
      <div className="grid gap-3">
        {restaurants.slice(0, 6).map((r) => (
          <RestaurantCard key={r.id} r={r} />
        ))}
      </div>
    </section>
  );
}
