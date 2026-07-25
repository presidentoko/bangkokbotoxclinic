"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedIds, SAVED_CHANGE_EVENT } from "@/lib/savedRestaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Restaurant } from "@/lib/types";

// /api/restaurants caps each request at 100 ids — chunk so power users who
// saved >100 restaurants don't silently lose everything past the 100th.
const CHUNK_SIZE = 100;

async function fetchChunk(ids: string[]): Promise<Restaurant[]> {
  const res = await fetch(`/api/restaurants?ids=${ids.map(encodeURIComponent).join(",")}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.restaurants ?? [];
}

export function SavedListClient() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const ids = getSavedIds();
      if (ids.length === 0) {
        if (!cancelled) setRestaurants([]);
        return;
      }
      const chunks: string[][] = [];
      for (let i = 0; i < ids.length; i += CHUNK_SIZE) chunks.push(ids.slice(i, i + CHUNK_SIZE));
      try {
        const results = await Promise.all(chunks.map(fetchChunk));
        if (cancelled) return;
        const byId = new Map<string, Restaurant>(results.flat().map((r) => [r.id, r]));
        // Keep the user's save order, most-recently-saved first.
        setRestaurants(ids.map((id) => byId.get(id)).filter(Boolean).reverse() as Restaurant[]);
      } catch {
        if (!cancelled) setRestaurants([]);
      }
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
        <Link
          href="/"
          className="inline-flex min-h-[44px] px-5 items-center rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
        >
          Browse restaurants →
        </Link>
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
