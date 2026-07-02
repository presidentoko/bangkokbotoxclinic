"use client";
import { useState, useEffect } from "react";

const KEY = "thaigle_stamps";

type StampProps = {
  venueId: string;
  venueName: string;
};

export function VenueStamp({ venueId, venueName }: StampProps) {
  const [stamped, setStamped] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    try {
      const stamps: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setStamped(stamps.includes(venueId));
      setCount(stamps.length);
    } catch {}
  }, [venueId]);

  const stamp = () => {
    if (stamped) return;
    try {
      const stamps: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (!stamps.includes(venueId)) {
        stamps.push(venueId);
        localStorage.setItem(KEY, JSON.stringify(stamps));
        setCount(stamps.length);
      }
      setStamped(true);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
    } catch {}
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={stamp}
        disabled={stamped}
        className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border font-bold transition-all duration-300 ${
          stamped
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-[var(--border)] hover:border-orange-400 hover:text-orange-700"
        } ${animating ? "scale-110" : "scale-100"}`}
      >
        {stamped ? "✓ Visited!" : "📍 Mark as visited"}
      </button>
      {count !== null && count > 0 && (
        <span className="text-xs text-[var(--muted)]">
          {count} {count === 1 ? "place" : "places"} visited
        </span>
      )}
    </div>
  );
}
