"use client";

import { useEffect, useState } from "react";
import { encodeWishlist } from "@/lib/wishlist";
import { trackShare } from "@/lib/track";

const KEY = "thaigle_saved";

type SavedItem = {
  id: string;
  name: string;
  type: "activity" | "restaurant";
  url: string;
  icon?: string;
};

export function useSaved() {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const list: SavedItem[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setSaved(new Set(list.map((x) => x.id)));
    } catch {}
  }, []);

  const toggle = (item: SavedItem) => {
    try {
      const list: SavedItem[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      const exists = list.some((x) => x.id === item.id);
      const next = exists ? list.filter((x) => x.id !== item.id) : [...list, item];
      localStorage.setItem(KEY, JSON.stringify(next));
      setSaved(new Set(next.map((x) => x.id)));
    } catch {}
  };

  return { saved, toggle };
}

export function SaveButton({ item, size = "md" }: { item: SavedItem; size?: "sm" | "md" }) {
  const { saved, toggle } = useSaved();
  const isSaved = saved.has(item.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
      className={`inline-flex items-center justify-center rounded-full border transition active:scale-95 ${
        size === "sm"
          ? "w-7 h-7 text-sm"
          : "w-9 h-9 text-base"
      } ${
        isSaved
          ? "border-red-300 bg-red-50 text-red-500 hover:bg-red-100"
          : "border-[var(--border)] bg-white text-[var(--muted)] hover:border-red-300 hover:text-red-400"
      }`}
    >
      {isSaved ? "♥" : "♡"}
    </button>
  );
}

export function SavedListHome() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    try {
      const list: SavedItem[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setItems(list.slice(0, 6));
    } catch {}
  }, []);

  const shareWishlist = async () => {
    trackShare("native", "wishlist");
    const payload = encodeURIComponent(encodeWishlist(items));
    const shareUrl = `https://thaigle.com/my-trip?w=${payload}&utm_source=share&utm_medium=native&utm_campaign=wishlist`;
    const text = `🇹🇭 My Bangkok wishlist (${items.length} places):\n${items.map(i => `${i.icon ?? "📍"} ${i.name}`).join("\n")}\n\nAll ranked by real Google reviews → ${shareUrl}`;
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch {}
    }
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(lineUrl, "_blank");
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (items.length < 1) return null;

  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="text-lg font-black">❤️ Your wishlist</h2>
        <div className="flex items-center gap-3">
          {items.length >= 2 && (
            <button
              onClick={shareWishlist}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
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
            href={item.url}
            className="flex items-center gap-2 p-3 bg-white border border-[var(--border)] rounded-xl hover:border-red-200 hover:bg-red-50 transition group"
          >
            {item.icon && <span className="text-xl shrink-0">{item.icon}</span>}
            <div className="min-w-0">
              <div className="text-xs font-bold truncate group-hover:text-red-700 transition">{item.name}</div>
              <div className="text-[10px] text-[var(--muted)] capitalize">{item.type}</div>
            </div>
          </a>
        ))}
      </div>
      {items.length >= 2 && (
        <div className="mt-3 text-center">
          <a href="/day-plan" className="inline-flex items-center gap-1.5 text-xs text-orange-600 font-bold hover:underline">
            📅 Build a day plan with your saved places →
          </a>
        </div>
      )}
    </section>
  );
}
