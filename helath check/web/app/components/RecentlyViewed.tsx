"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "bkk_recently_viewed";
const MAX = 5;

export type RecentHospital = {
  slug: string;
  name: string;
  city: string | null;
  minPrice: number | null;
};

export function trackHospitalView(h: RecentHospital) {
  try {
    const existing: RecentHospital[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const filtered = existing.filter((x) => x.slug !== h.slug);
    const updated = [h, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

export function RecentlyViewedBar({ locale }: { locale: string }) {
  const [recent, setRecent] = useState<RecentHospital[]>([]);

  useEffect(() => {
    try {
      const data: RecentHospital[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setRecent(data);
    } catch { /* ignore */ }
  }, []);

  if (!recent.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Recently viewed</p>
      <div className="flex flex-wrap gap-2">
        {recent.map((h) => (
          <Link key={h.slug} href={`/${locale}/hospital/${h.slug}`}
            className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700">{h.name}</span>
            {h.minPrice && <span className="text-[11px] text-blue-600 font-semibold">฿{h.minPrice.toLocaleString()}</span>}
          </Link>
        ))}
        <button
          onClick={() => { localStorage.removeItem(KEY); setRecent([]); }}
          className="text-[11px] text-slate-300 hover:text-slate-500 px-1 self-center"
        >clear</button>
      </div>
    </div>
  );
}
