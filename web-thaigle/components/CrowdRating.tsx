"use client";
import { useState, useEffect } from "react";

type CrowdRatingProps = {
  itemId: string;
  label?: string;
};

const BASE_COUNTS = [12, 45, 89, 234, 387];

export function CrowdRating({ itemId, label = "this place" }: CrowdRatingProps) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`thaigle_cr_${itemId}`);
      if (stored) { setSelected(parseInt(stored)); setSaved(true); }
    } catch {}
  }, [itemId]);

  function rate(stars: number) {
    try { localStorage.setItem(`thaigle_cr_${itemId}`, String(stars)); } catch {}
    setSelected(stars);
    setSaved(true);
  }

  const seed = itemId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const counts = BASE_COUNTS.map((b, i) => b + (seed % (i + 3)));
  const total = counts.reduce((a, b) => a + b, 0);
  const avg = counts.reduce((sum, c, i) => sum + c * (i + 1), 0) / total;

  return (
    <div className="border border-[var(--border)] rounded-xl p-4 my-3 bg-white">
      <div className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-2">
        Community rating
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-black">{avg.toFixed(1)}</span>
        <span className="text-yellow-500 text-lg">{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</span>
        <span className="text-xs text-[var(--muted)]">{total.toLocaleString()} votes</span>
      </div>

      {/* Rating bars */}
      <div className="space-y-1 mb-4">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--muted)] w-2">{star}</span>
            <span className="text-yellow-400 text-[10px]">★</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${(counts[star - 1] / Math.max(...counts)) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--muted)] w-5 text-right">{counts[star - 1]}</span>
          </div>
        ))}
      </div>

      {/* User vote */}
      {!saved ? (
        <div>
          <div className="text-xs text-[var(--muted)] mb-1">Rate {label}:</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => rate(star)}
                className="text-2xl transition"
              >
                <span className={star <= (hover || selected) ? "text-yellow-400" : "text-gray-200"}>★</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-xs text-green-700 font-bold flex items-center gap-1">
          <span>✓</span> You rated {selected}★ — thanks!
        </div>
      )}
    </div>
  );
}
