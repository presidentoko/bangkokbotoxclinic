"use client";
import { useState } from "react";

const RATE = 35.5;

const QUICK = [100, 500, 1000, 2000, 5000];

export function CurrencyHelper() {
  const [thb, setThb] = useState("");

  const usd = thb ? (parseFloat(thb) / RATE).toFixed(2) : "";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-sm font-black mb-1">💱 Quick THB → USD</div>
      <p className="text-xs text-[var(--muted)] mb-3">~฿{RATE} per $1 USD (approximate)</p>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">฿</span>
          <input
            type="number"
            value={thb}
            onChange={(e) => setThb(e.target.value)}
            placeholder="Enter THB"
            className="w-full pl-7 pr-3 py-2 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <span className="text-[var(--muted)]">=</span>
        <div className="flex-1 border border-[var(--border)] rounded-xl px-3 py-2 text-sm bg-[var(--bg)]">
          {usd ? <><span className="text-[var(--muted)]">$</span> {usd}</> : <span className="text-[var(--muted)]">USD</span>}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => setThb(String(q))}
            className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] hover:border-orange-400 hover:bg-orange-50 transition"
          >
            ฿{q.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
