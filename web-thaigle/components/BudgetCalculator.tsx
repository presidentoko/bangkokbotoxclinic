"use client";
import { useState } from "react";

const TIERS = [
  { label: "Budget", emoji: "💸", food: 200, massage: 250, activity: 300, hotel: 600 },
  { label: "Mid-range", emoji: "💰", food: 600, massage: 600, activity: 800, hotel: 1800 },
  { label: "Luxury", emoji: "💎", food: 1500, massage: 1500, activity: 2500, hotel: 5000 },
];

export function BudgetCalculator() {
  const [tier, setTier] = useState(0);
  const [days, setDays] = useState(3);
  const t = TIERS[tier];
  const perDay = t.food * 3 + t.massage + t.activity + t.hotel;
  const total = perDay * days;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 my-4">
      <div className="text-sm font-black mb-4">🧮 Bangkok Daily Budget Calculator</div>

      <div className="flex gap-2 mb-4">
        {TIERS.map((t, i) => (
          <button
            key={i}
            onClick={() => setTier(i)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${tier === i ? "bg-orange-500 text-white border-orange-500" : "border-[var(--border)] text-[var(--muted)] hover:border-orange-300"}`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-[var(--muted)] shrink-0">Days:</span>
        <input
          type="range" min={1} max={14} value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="flex-1 accent-orange-500"
        />
        <span className="text-sm font-bold w-8 text-right">{days}</span>
      </div>

      <div className="space-y-1.5 text-sm mb-4">
        <div className="flex justify-between text-[var(--muted)]">
          <span>🍜 Food (3 meals)</span>
          <span>฿{(t.food * 3).toLocaleString()}/day</span>
        </div>
        <div className="flex justify-between text-[var(--muted)]">
          <span>💆 Thai massage</span>
          <span>฿{t.massage.toLocaleString()}/day</span>
        </div>
        <div className="flex justify-between text-[var(--muted)]">
          <span>🥊 Activity</span>
          <span>฿{t.activity.toLocaleString()}/day</span>
        </div>
        <div className="flex justify-between text-[var(--muted)]">
          <span>🏨 Hotel</span>
          <span>฿{t.hotel.toLocaleString()}/night</span>
        </div>
        <div className="border-t border-[var(--border)] pt-2 flex justify-between font-black">
          <span>Total ({days} days)</span>
          <span className="text-orange-600">฿{total.toLocaleString()} <span className="text-xs font-normal text-[var(--muted)]">≈ ${Math.round(total / 35).toLocaleString()} USD</span></span>
        </div>
      </div>

      <div className="flex gap-2">
        <a href="/for/budget" className="flex-1 text-center text-xs px-3 py-2 rounded-full border border-[var(--border)] hover:border-orange-400 hover:text-orange-700 transition font-medium">Budget picks →</a>
        <a href="/activities" className="flex-1 text-center text-xs px-3 py-2 rounded-full border border-[var(--border)] hover:border-orange-400 hover:text-orange-700 transition font-medium">Browse activities →</a>
      </div>
    </div>
  );
}
