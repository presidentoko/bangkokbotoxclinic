"use client";
import { useEffect, useState } from "react";

const SAVINGS_TIPS = [
  { tip: "Book direct instead of via booking apps", saves: "15-20%", emoji: "📱" },
  { tip: "Grab taxi vs BTS for Sukhumvit hops", saves: "฿80 avg", emoji: "🚕" },
  { tip: "Set lunch menu vs dinner at same restaurant", saves: "40%", emoji: "🍽️" },
  { tip: "Airport taxi meter vs fixed price touts", saves: "฿200-400", emoji: "✈️" },
  { tip: "7-Eleven SIM card vs hotel WiFi roaming", saves: "฿3,000+", emoji: "📶" },
];

export function SavingsCounter() {
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    const seed = Math.floor(Date.now() / 86400000) % SAVINGS_TIPS.length;
    setIdx(seed);
  }, []);

  if (idx === null) return null;
  const tip = SAVINGS_TIPS[idx];

  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-4 my-4">
      <div className="text-xs font-bold text-green-700 uppercase mb-2">💰 Today&apos;s Money-Saving Tip</div>
      <div className="flex gap-3 items-start">
        <span className="text-2xl">{tip.emoji}</span>
        <div>
          <div className="font-bold text-sm">{tip.tip}</div>
          <div className="text-xs text-green-700 font-bold mt-1">Save: {tip.saves}</div>
        </div>
      </div>
      <div className="mt-3 flex gap-2 text-[10px] text-[var(--muted)]">
        {SAVINGS_TIPS.map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i === idx ? "bg-green-600" : "bg-green-200"}`}
          />
        ))}
      </div>
    </div>
  );
}
