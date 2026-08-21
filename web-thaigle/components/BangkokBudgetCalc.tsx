"use client";

import { useState } from "react";

const PRESETS = [
  { label: "Budget", accommodation: 600, food: 400, transport: 200, activities: 300 },
  { label: "Mid-range", accommodation: 1500, food: 800, transport: 400, activities: 800 },
  { label: "Luxury", accommodation: 5000, food: 2000, transport: 800, activities: 2000 },
];

export function BangkokBudgetCalc() {
  const [days, setDays] = useState(5);
  const [preset, setPreset] = useState(1); // mid-range

  const p = PRESETS[preset];
  const daily = p.accommodation + p.food + p.transport + p.activities;
  const total = daily * days;
  const usd = Math.round(total / 35);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🧮 Bangkok trip budget calculator
      </h2>
      <div className="flex gap-2 mb-4">
        {PRESETS.map((pr, i) => (
          <button
            key={pr.label}
            onClick={() => setPreset(i)}
            className={`flex-1 text-xs font-bold py-1.5 rounded-full border transition ${preset === i ? "bg-orange-500 text-white border-orange-500" : "border-[var(--border)] text-[var(--muted)] hover:border-orange-300"}`}
          >
            {pr.label}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold">Days in Bangkok</span>
          <span className="text-xs font-mono font-black text-orange-600">{days} days</span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full accent-orange-500"
        />
        <div className="flex justify-between text-[10px] text-[var(--muted)] mt-0.5">
          <span>1 day</span><span>30 days</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {[
          { label: "🏨 Accommodation", val: p.accommodation },
          { label: "🍜 Food", val: p.food },
          { label: "🚆 Transport", val: p.transport },
          { label: "🎯 Activities", val: p.activities },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-1.5 border border-[var(--border)]">
            <span className="text-[10px] text-[var(--muted)]">{item.label}</span>
            <span className="text-[10px] font-mono font-bold">฿{item.val.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-orange-900">Daily budget</span>
          <span className="font-mono font-black text-orange-700">฿{daily.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-orange-900">Total ({days} days)</span>
          <div className="text-right">
            <div className="font-mono font-black text-xl text-orange-700">฿{total.toLocaleString()}</div>
            <div className="text-[11px] text-orange-600">≈ ${usd.toLocaleString()} USD</div>
          </div>
        </div>
      </div>
    </div>
  );
}
