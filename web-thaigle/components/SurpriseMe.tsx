"use client";

import { useState, useCallback } from "react";
import { SaveButton } from "@/components/SaveButton";

export type SurpriseVenue = {
  name: string;
  url: string;
  type: "restaurant" | "activity";
  rating: number;
  reviews: number;
  tag: string;
  trust: number;
  location: string;
  emoji?: string;
};

type Filter = "all" | "restaurant" | "activity";

export function SurpriseMe({ venues }: { venues: SurpriseVenue[] }) {
  const [pick, setPick] = useState<SurpriseVenue | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [rolling, setRolling] = useState(false);

  const roll = useCallback(() => {
    const pool = filter === "all" ? venues : venues.filter((v) => v.type === filter);
    if (!pool.length) return;
    setRolling(true);
    setTimeout(() => {
      const v = pool[Math.floor(Math.random() * pool.length)];
      setPick(v);
      setRolling(false);
    }, 300);
  }, [venues, filter]);

  return (
    <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="text-center mb-5">
        <div className="text-4xl mb-2">🎲</div>
        <h2 className="text-xl font-black mb-1">Can&apos;t decide? Let us pick.</h2>
        <p className="text-sm text-[var(--muted)]">Random top-rated pick from real Google reviews — no ads, no paid picks.</p>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        {(["all", "restaurant", "activity"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPick(null); }}
            className={`px-3 py-1 rounded-full text-sm font-bold transition ${
              filter === f
                ? "bg-orange-500 text-white"
                : "bg-white border border-[var(--border)] hover:border-orange-400 hover:text-orange-700"
            }`}
          >
            {f === "all" ? "🌟 Anything" : f === "restaurant" ? "🍽️ Restaurant" : "🎯 Activity"}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={roll}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-black text-lg hover:bg-orange-600 active:scale-95 transition shadow-lg hover:shadow-orange-300"
        >
          <span className={rolling ? "animate-spin" : ""}>🎲</span>
          {pick ? "Roll again" : "Surprise me!"}
        </button>
      </div>

      {pick && !rolling && (
        <div className="bg-white rounded-xl border border-orange-200 p-5 shadow-md animate-in fade-in duration-300">
          <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-2">🎲 Today&apos;s random pick</div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  {pick.type === "restaurant" ? "🍽️ Restaurant" : `🎯 ${pick.tag}`}
                </span>
              </div>
              <h3 className="font-black text-lg leading-tight">{pick.name}</h3>
              <p className="text-sm text-[var(--muted)]">📍 {pick.location}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-green-600">{pick.trust}</div>
              <div className="text-xs text-[var(--muted)]">Trust Score</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-[var(--muted)] mb-4">
            <span className="text-yellow-700 font-bold">★ {pick.rating.toFixed(1)}</span>
            <span>·</span>
            <span>{pick.reviews.toLocaleString()} Google reviews</span>
            <span>·</span>
            <span className="font-medium text-orange-700">{pick.tag}</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <a
              href={pick.url}
              className="flex-1 text-center px-4 py-2.5 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
            >
              See full details →
            </a>
            <SaveButton
              item={{
                id: pick.url,
                name: pick.name,
                type: pick.type,
                url: pick.url,
                icon: pick.emoji,
              }}
              size="md"
            />
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent(`🎲 Thaigle picked for me: ${pick.name}\n★${pick.rating} · Trust ${pick.trust}\nhttps://thaigle.com${pick.url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2.5 rounded-full font-bold text-sm text-white transition"
              style={{ backgroundColor: "#06C755" }}
              aria-label="Share on LINE"
            >
              LINE
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`🎲 Thaigle picked for me: ${pick.name}\n★${pick.rating} · Trust ${pick.trust}\nhttps://thaigle.com${pick.url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2.5 rounded-full font-bold text-sm text-white transition"
              style={{ backgroundColor: "#25D366" }}
              aria-label="Share on WhatsApp"
            >
              WA
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
