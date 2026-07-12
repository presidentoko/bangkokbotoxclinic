"use client";
import { useState } from "react";

const PAIRINGS = [
  {
    food: "Thai massage after dinner",
    emoji: "💆🍜",
    why: "Heavy Thai food + 1hr massage = perfect evening combo",
    links: [
      { label: "Browse Thai restaurants →", url: "/restaurants/cuisine/thai" },
      { label: "Find Thai massage →", url: "/activities/spa" },
    ],
  },
  {
    food: "Muay Thai + big breakfast",
    emoji: "🥊🍳",
    why: "Train at 7am, refuel at a Thonglor café. Earned every calorie.",
    links: [
      { label: "Find Muay Thai gyms →", url: "/activities/muay-thai" },
      { label: "Cafés in Bangkok →", url: "/restaurants/cuisine/cafe" },
    ],
  },
  {
    food: "Cooking class + Khao San road",
    emoji: "👨‍🍳🌙",
    why: "Learn to cook Thai food at noon, celebrate on Khao San at night.",
    links: [
      { label: "Cooking classes →", url: "/activities/cooking" },
      { label: "Bangkok nightlife →", url: "/for/late-night" },
    ],
  },
  {
    food: "Yoga + healthy café",
    emoji: "🧘☕",
    why: "Morning yoga in Ari, then acai bowl and cold brew at the studio café.",
    links: [
      { label: "Yoga studios →", url: "/activities/yoga-pilates" },
      { label: "Health cafés →", url: "/restaurants/cuisine/cafe" },
    ],
  },
];

export function FoodPairing() {
  const [idx, setIdx] = useState(0);
  const p = PAIRINGS[idx];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-sm font-black mb-3">✨ Perfect Bangkok Combo</div>
      <div className="flex gap-2 mb-3 flex-wrap">
        {PAIRINGS.map((pair, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`text-xl transition hover:scale-110 ${idx === i ? "scale-125" : "opacity-60"}`}
            title={pair.food}
          >
            {pair.emoji}
          </button>
        ))}
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">
        <div className="font-bold text-sm mb-1">{p.food}</div>
        <div className="text-xs text-[var(--muted)]">{p.why}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {p.links.map((l, i) => (
          <a
            key={i}
            href={l.url}
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] hover:border-orange-400 hover:text-orange-700 transition font-medium"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
