"use client";
import { useState } from "react";

type Q = { question: string; options: { label: string; emoji: string; value: string }[] };
type Result = { name: string; emoji: string; desc: string; url: string };

const Q1: Q = {
  question: "What's your travel style?",
  options: [
    { label: "Luxury & nightlife", emoji: "🌃", value: "luxury" },
    { label: "Hip & local cafés", emoji: "☕", value: "hip" },
    { label: "Culture & history", emoji: "🏛️", value: "culture" },
    { label: "Budget & markets", emoji: "🛍️", value: "budget" },
  ],
};

const RESULTS: Record<string, Result> = {
  luxury: { name: "Thonglor / Ekkamai", emoji: "✨", desc: "Rooftop bars, Japanese restaurants, high-end spas, upscale clubs.", url: "/restaurants/bangkok/thonglor" },
  hip: { name: "Ari / Phahonyothin", emoji: "🌿", desc: "Indie cafés, creative spaces, yoga studios, local food scene.", url: "/restaurants/bangkok/ari" },
  culture: { name: "Rattanakosin / Chinatown", emoji: "🏮", desc: "Grand Palace, Wat Pho, Yaowarat street food, historic temples.", url: "/restaurants/bangkok/chinatown" },
  budget: { name: "Pratunam / Victory Monument", emoji: "🛺", desc: "Street markets, cheap eats, local Thai food, easy BTS access.", url: "/restaurants/bangkok" },
};

export function NeighborhoodMatcher() {
  const [selected, setSelected] = useState<string | null>(null);
  const result = selected ? RESULTS[selected] : null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🗺️ Which Bangkok neighborhood suits you?
      </div>

      {!result ? (
        <div className="grid grid-cols-2 gap-2">
          {Q1.options.map((o) => (
            <button
              key={o.value}
              onClick={() => setSelected(o.value)}
              className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border)] text-left hover:border-orange-400 hover:bg-orange-50 transition"
            >
              <span className="text-xl">{o.emoji}</span>
              <span className="text-xs font-bold text-[var(--fg)]">{o.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <span className="text-3xl">{result.emoji}</span>
          <div className="flex-1">
            <div className="font-black text-sm text-[var(--fg)] mb-1">You&apos;d love {result.name}</div>
            <div className="text-xs text-[var(--muted)] leading-snug mb-3">{result.desc}</div>
            <div className="flex gap-2 flex-wrap">
              <a
                href={result.url}
                className="text-xs font-bold text-orange-600 border border-orange-300 rounded-full px-3 py-1 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
              >
                Explore {result.name} →
              </a>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-[var(--muted)] border border-[var(--border)] rounded-full px-3 py-1 hover:border-gray-400 transition"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
