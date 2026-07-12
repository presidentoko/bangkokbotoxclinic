"use client";
import { useEffect, useState } from "react";

const FACTS = [
  { fact: "Bangkok has over 50,000 street food vendors — that's one for every 200 residents.", emoji: "🍜", source: "City of Bangkok 2023" },
  { fact: "Wat Arun (Temple of Dawn) gets over 1 million visitors per year — most arrive by boat for 5฿.", emoji: "⛩️", source: "Tourism Authority of Thailand" },
  { fact: "The BTS Skytrain carried 920,000 passengers per day in 2024. The cheapest way to skip traffic.", emoji: "🚇", source: "BTS Group 2024" },
  { fact: "Bangkok has the highest number of 5-star hotels per capita of any Asian city outside Tokyo.", emoji: "🏨", source: "STR Global 2023" },
  { fact: "The word 'Bangkok' in Thai (Krung Thep) is part of the world's longest city name — 168 letters.", emoji: "🌆", source: "Guinness World Records" },
  { fact: "Chatuchak Weekend Market has 15,000 stalls. Walking every aisle would cover ~27km.", emoji: "🛍️", source: "Tourism Authority of Thailand" },
  { fact: "Thai massage was inscribed on UNESCO's Intangible Cultural Heritage list in 2019.", emoji: "💆", source: "UNESCO 2019" },
  { fact: "Bangkok's Suvarnabhumi Airport handled 52 million passengers in 2023 — back above pre-COVID levels.", emoji: "✈️", source: "AOT 2023 Annual Report" },
];

export function BangkokFacts() {
  const [fact, setFact] = useState<typeof FACTS[number] | null>(null);

  useEffect(() => {
    const seed = Math.floor(Date.now() / 86400000);
    setFact(FACTS[seed % FACTS.length]);
  }, []);

  if (!fact) return null;

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 my-4">
      <div className="text-xs font-bold text-indigo-700 uppercase mb-2">🤓 Bangkok Fact of the Day</div>
      <div className="flex gap-3 items-start">
        <span className="text-2xl shrink-0">{fact.emoji}</span>
        <div>
          <p className="text-sm font-medium text-[var(--fg)] leading-relaxed">{fact.fact}</p>
          <p className="text-[10px] text-indigo-500 mt-1">Source: {fact.source}</p>
        </div>
      </div>
    </div>
  );
}
