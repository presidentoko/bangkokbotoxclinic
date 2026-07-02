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

export function RecentlyViewedHome() {
  const [items, setItems] = useState<ViewedItem[]>([]);
  const [shared, setShared] = useState(false);

  const shareRecent = async () => {
    const text = `Places I've been exploring on Thaigle:\n${items.slice(0, 4).map(i => `${i.icon} ${i.name}`).join("\n")}\nhttps://thaigle.com`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch {} }
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  useEffect(() => {
    try {
      const stored: ViewedItem[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setItems(stored.slice(0, 6));
    } catch {}
  }, []);

  if (items.length < 2) return null;

  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="text-lg font-black">Continue browsing</h2>
        <div className="flex items-center gap-2">
          {items.length >= 2 && (
            <button onClick={shareRecent} className="text-xs font-bold text-orange-600 hover:underline">
              {shared ? "✓ Shared!" : "Share →"}
            </button>
          )}
          <button
            onClick={() => {
              try { localStorage.removeItem(KEY); } catch {}
              setItems([]);
            }}
            className="text-xs text-[var(--muted)] hover:text-red-500 transition"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/activities/${item.nicheSlug}/${item.slug}`}
            className="flex items-center gap-2 p-3 bg-white border border-[var(--border)] rounded-xl hover:border-orange-300 hover:bg-orange-50 transition group"
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate group-hover:text-orange-700 transition">{item.name}</div>
              <div className="text-[10px] text-[var(--muted)]">Trust {Math.min(100, item.trust_score)}</div>
            </div>
          </a>
        ))}
      </div>
      {items.length >= 3 && (
        <div className="mt-3 text-center">
          <a href="/day-plan" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline">
            📅 Build a full day plan →
          </a>
        </div>
      )}
    </section>
  );
}
