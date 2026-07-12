"use client";
import { useEffect, useState } from "react";
import { getSavedIds, SAVED_CHANGE_EVENT } from "@/lib/savedRestaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Restaurant } from "@/lib/types";

export function SavedListClient() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    function load() {
      const ids = getSavedIds();
      if (ids.length === 0) {
        if (!cancelled) setRestaurants([]);
        return;
      }
      fetch(`/api/restaurants?ids=${ids.map(encodeURIComponent).join(",")}`)
        .then((res) => (res.ok ? res.json() : { restaurants: [] }))
        .then((data) => {
          if (cancelled) return;
          const byId = new Map<string, Restaurant>(
            (data.restaurants ?? []).map((r: Restaurant) => [r.id, r])
          );
          // Keep the user's save order, most-recently-saved first.
          setRestaurants(ids.map((id) => byId.get(id)).filter(Boolean).reverse() as Restaurant[]);
        })
        .catch(() => { if (!cancelled) setRestaurants([]); });
    }

    load();
    window.addEventListener(SAVED_CHANGE_EVENT, load);
    return () => { cancelled = true; window.removeEventListener(SAVED_CHANGE_EVENT, load); };
  }, []);

  if (restaurants === null) {
    return <p className="text-sm text-[var(--muted)]">Loading your saved restaurants...</p>;
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-3xl">
        <div className="text-4xl mb-3">🤍</div>
        <p className="font-bold text-[var(--fg)] mb-1">No saved restaurants yet</p>
        <p className="text-sm text-[var(--muted)] mb-5">
          Tap the heart on any restaurant card to save it for later.
        </p>
        <a
          href="/"
          className="inline-flex min-h-[44px] px-5 items-center rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
        >
          Browse restaurants →
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} r={r} />
      ))}
    </div>
  );
}
