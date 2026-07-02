"use client";
import { useState } from "react";

const MOODS = [
  { label: "Hungry & casual", emoji: "🍜", cuisine: "thai", name: "Thai food", link: "/restaurants/cuisine/thai", desc: "Street-style, authentic, under ฿200" },
  { label: "Romantic date", emoji: "🕯️", cuisine: "italian", name: "Italian", link: "/restaurants/cuisine/italian", desc: "Pasta, wine, atmosphere" },
  { label: "Big group", emoji: "👥", cuisine: "japanese", name: "Japanese", link: "/restaurants/cuisine/japanese", desc: "Shabu, yakiniku — perfect for sharing" },
  { label: "Healthy vibes", emoji: "🥗", cuisine: "cafe", name: "Café & brunch", link: "/restaurants/cuisine/cafe", desc: "Acai bowls, smoothies, salads" },
  { label: "Budget eats", emoji: "💸", cuisine: "street_food", name: "Street food", link: "/restaurants/cuisine/street_food", desc: "Best value in Bangkok — from ฿50" },
  { label: "Special occasion", emoji: "🥂", cuisine: "western", name: "Western fine dining", link: "/restaurants/cuisine/western", desc: "Steaks, seafood, premium experience" },
];

export function CuisineMatch() {
  const [selected, setSelected] = useState<typeof MOODS[0] | null>(null);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-sm font-black mb-3">🎯 What are you in the mood for?</div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {MOODS.map((m, i) => (
          <button
            key={i}
            onClick={() => setSelected(m)}
            className={`text-left p-2.5 rounded-xl border text-xs font-medium transition ${
              selected?.label === m.label
                ? "border-orange-500 bg-orange-50 text-orange-800"
                : "border-[var(--border)] hover:border-orange-300"
            }`}
          >
            <span className="text-base mr-1.5">{m.emoji}</span>{m.label}
          </button>
        ))}
      </div>
      {selected && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
          <div className="font-bold text-sm mb-0.5">{selected.emoji} Try {selected.name}</div>
          <div className="text-xs text-[var(--muted)] mb-2">{selected.desc}</div>
          <a
            href={selected.link}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
          >
            Browse {selected.name} →
          </a>
        </div>
      )}
    </div>
  );
}
