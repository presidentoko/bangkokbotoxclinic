"use client";

import { useEffect, useState } from "react";

type ViewedItem = {
  id: string;
  name: string;
  nicheSlug: string;
  slug: string;
  icon: string;
  trust_score: number;
};

const KEY = "thaigle_recent";

export function RecentlyViewed({ currentId }: { currentId: string }) {
  const [items, setItems] = useState<ViewedItem[]>([]);

  useEffect(() => {
    try {
      const stored: ViewedItem[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setItems(stored.filter((v) => v.id !== currentId).slice(0, 4));
    } catch {
      // localStorage unavailable
    }
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <section className="mb-6 border border-[var(--border)] rounded-2xl p-4 bg-white">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-3">Recently viewed</h2>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/activities/${item.nicheSlug}/${item.slug}`}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-orange-50 transition group"
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate group-hover:text-orange-700 transition">{item.name}</div>
              <div className="text-[10px] text-[var(--muted)] tabular-nums">Trust {Math.min(100, item.trust_score)}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
