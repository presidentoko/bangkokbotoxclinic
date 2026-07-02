"use client";
import { useEffect, useState } from "react";

type SavedItem = { id: string; name: string; type: "restaurant" | "activity"; url: string };

export function WishlistHighlight() {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("thaigle_saved");
      if (raw) setItems(JSON.parse(raw).slice(0, 5));
    } catch {}
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-black">❤️ Your saved places</div>
        <a href="/my-trip" className="text-xs text-orange-600 font-bold hover:underline">See all →</a>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border)] hover:border-orange-400 hover:bg-orange-50 transition group"
          >
            <span className="text-base">{item.type === "restaurant" ? "🍜" : "🏋️"}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate group-hover:text-orange-700 transition">{item.name}</div>
              <div className="text-[10px] text-[var(--muted)] capitalize">{item.type}</div>
            </div>
            <span className="text-[var(--muted)] group-hover:text-orange-500 transition text-xs">→</span>
          </a>
        ))}
      </div>
      {items.length >= 3 && (
        <a href="/plan" className="mt-3 block text-center text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-full py-1.5 hover:bg-orange-100 transition">
          Plan your day with these →
        </a>
      )}
    </div>
  );
}
