"use client";
import { useEffect, useState } from "react";

type PopularTimesProps = {
  type?: "restaurant" | "spa" | "gym" | "cafe";
};

const PROFILES: Record<string, number[]> = {
  restaurant: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 7, 8, 5, 3, 2, 3, 6, 8, 9, 7, 4, 1],
  spa:        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 7, 8, 7, 6, 5, 6, 8, 9, 8, 6, 3, 1, 0],
  gym:        [0, 0, 0, 0, 0, 1, 4, 8, 7, 5, 3, 2, 2, 2, 2, 3, 4, 7, 9, 8, 6, 4, 2, 0],
  cafe:       [0, 0, 0, 0, 0, 0, 1, 3, 7, 9, 8, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2, 1, 0, 0],
};

const HOURS = ["12a","","","","","","6a","","","","","","12p","","","","","","6p","","","","",""];

const TYPE_LABEL: Record<string, string> = {
  restaurant: "restaurants",
  spa: "spas & massage shops",
  gym: "gyms",
  cafe: "cafés",
};

function bangkokHour(): number {
  return parseInt(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", hour: "numeric", hour12: false }).format(new Date()),
    10
  ) % 24;
}

export function PopularTimes({ type = "restaurant" }: PopularTimesProps) {
  const data = PROFILES[type] ?? PROFILES.restaurant;
  const max = Math.max(...data);
  // Computed client-side in Asia/Bangkok time — this page is statically cached,
  // so a server-computed hour would be stale (and in the wrong timezone).
  // The chart itself is static (PROFILES data), so it doesn't need to wait
  // for `now` — only the current-hour highlight does. -1 renders the full
  // chart immediately with no bar highlighted, avoiding a pop-in/CLS.
  const [now, setNow] = useState<number>(-1);
  useEffect(() => { setNow(bangkokHour()); }, []);

  return (
    <div className="mt-4 p-4 border border-[var(--border)] rounded-xl bg-white">
      <div className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-3">
        Typical hours for {TYPE_LABEL[type] ?? "venues"} in Bangkok
      </div>
      <div className="flex items-end gap-0.5 h-12">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all"
            style={{
              height: `${max > 0 ? (v / max) * 100 : 0}%`,
              minHeight: v > 0 ? "2px" : "0",
              background: i === now ? "#f97316" : v > 0 ? "#fed7aa" : "#f3f4f6",
            }}
            title={`${HOURS[i] || `${i % 12 || 12}${i < 12 ? "a" : "p"}m`}: ${v > 0 ? (v >= 7 ? "Typically very busy" : v >= 4 ? "Typically busy" : "Typically quiet") : "Typically closed"}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1">
        {HOURS.filter((_, i) => i % 6 === 0).map((h, i) => (
          <span key={i}>{h}</span>
        ))}
      </div>
      <div className="text-xs text-[var(--muted)] mt-2">
        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-orange-400 mr-1" />
        General pattern for this venue type — not this specific venue&apos;s live occupancy.
      </div>
    </div>
  );
}
