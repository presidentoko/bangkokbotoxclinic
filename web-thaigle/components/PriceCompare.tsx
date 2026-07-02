"use client";

import { useState } from "react";

type PriceRow = {
  activity: string;
  emoji: string;
  url: string;
  budget: { label: string; thb: number };
  mid: { label: string; thb: number };
  premium: { label: string; thb: number };
};

const ROWS: PriceRow[] = [
  {
    activity: "Thai Massage",
    emoji: "💆",
    url: "/activities/spa",
    budget: { label: "Roadside parlour", thb: 200 },
    mid: { label: "Spa in mall", thb: 500 },
    premium: { label: "Hotel spa", thb: 2000 },
  },
  {
    activity: "Muay Thai Class",
    emoji: "🥊",
    url: "/activities/muay-thai",
    budget: { label: "Drop-in 1hr", thb: 300 },
    mid: { label: "Full session", thb: 700 },
    premium: { label: "Private training", thb: 2000 },
  },
  {
    activity: "Cooking Class",
    emoji: "👨‍🍳",
    url: "/activities/cooking",
    budget: { label: "Street market", thb: 800 },
    mid: { label: "School + market", thb: 1500 },
    premium: { label: "Chef school", thb: 3000 },
  },
  {
    activity: "Yoga Class",
    emoji: "🧘",
    url: "/activities/yoga-pilates",
    budget: { label: "Drop-in 1hr", thb: 300 },
    mid: { label: "Monthly pass", thb: 2500 },
    premium: { label: "Private 1hr", thb: 1500 },
  },
  {
    activity: "Diving Day Trip",
    emoji: "🤿",
    url: "/activities/diving",
    budget: { label: "Snorkeling only", thb: 1500 },
    mid: { label: "2 dives + boat", thb: 3500 },
    premium: { label: "3 dives PADI", thb: 6000 },
  },
  {
    activity: "Pad Thai",
    emoji: "🍜",
    url: "/restaurants/cuisine/street_food",
    budget: { label: "Street cart", thb: 60 },
    mid: { label: "Restaurant", thb: 180 },
    premium: { label: "Hotel", thb: 450 },
  },
];

type Tier = "budget" | "mid" | "premium";

const TIER_LABELS: Record<Tier, string> = {
  budget: "฿ Budget",
  mid: "฿฿ Mid",
  premium: "฿฿฿ Premium",
};

const TIER_COLORS: Record<Tier, string> = {
  budget: "bg-green-100 text-green-800",
  mid: "bg-blue-100 text-blue-800",
  premium: "bg-purple-100 text-purple-800",
};

export function PriceCompare() {
  const [tier, setTier] = useState<Tier>("mid");

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-[var(--border)]">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-black text-lg">Bangkok Price Guide 2026</h2>
            <p className="text-sm text-[var(--muted)] mt-0.5">How much does it actually cost?</p>
          </div>
          <div className="flex gap-1.5">
            {(["budget", "mid", "premium"] as Tier[]).map((t) => (
              <button key={t} onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  tier === t ? TIER_COLORS[t] + " ring-2 ring-offset-1 ring-current" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}>
                {TIER_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {ROWS.map((row) => (
          <a key={row.activity} href={row.url}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-orange-50 transition group">
            <span className="text-2xl shrink-0">{row.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm group-hover:text-orange-700 transition">{row.activity}</div>
              <div className="text-xs text-[var(--muted)]">{row[tier].label}</div>
            </div>
            <div className={`shrink-0 px-2.5 py-1 rounded-lg text-sm font-black tabular-nums ${TIER_COLORS[tier]}`}>
              ฿{row[tier].thb.toLocaleString()}
            </div>
          </a>
        ))}
      </div>
      <div className="px-5 py-3 bg-gray-50 text-xs text-[var(--muted)] border-t border-[var(--border)]">
        Prices based on 2026 Bangkok averages · Tap any row to find venues
      </div>
    </div>
  );
}
