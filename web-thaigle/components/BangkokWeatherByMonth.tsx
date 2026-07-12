"use client";
import { useEffect, useState } from "react";

const MONTHS = [
  { month: "Jan", emoji: "☀️", temp: "24–33°C", rain: "Low", label: "Peak season", color: "bg-green-100 text-green-800" },
  { month: "Feb", emoji: "☀️", temp: "25–34°C", rain: "Low", label: "Peak season", color: "bg-green-100 text-green-800" },
  { month: "Mar", emoji: "🌤️", temp: "26–36°C", rain: "Low", label: "Hot & dry", color: "bg-yellow-100 text-yellow-800" },
  { month: "Apr", emoji: "🔥", temp: "28–38°C", rain: "Low", label: "Hottest + Songkran", color: "bg-orange-100 text-orange-800" },
  { month: "May", emoji: "⛈️", temp: "27–36°C", rain: "Medium", label: "Rains begin", color: "bg-blue-100 text-blue-800" },
  { month: "Jun", emoji: "🌧️", temp: "27–35°C", rain: "High", label: "Wet season", color: "bg-blue-200 text-blue-900" },
  { month: "Jul", emoji: "🌧️", temp: "26–34°C", rain: "High", label: "Wet season", color: "bg-blue-200 text-blue-900" },
  { month: "Aug", emoji: "🌧️", temp: "26–34°C", rain: "Highest", label: "Wettest month", color: "bg-indigo-200 text-indigo-900" },
  { month: "Sep", emoji: "🌧️", temp: "25–33°C", rain: "Highest", label: "Wettest month", color: "bg-indigo-200 text-indigo-900" },
  { month: "Oct", emoji: "⛅", temp: "25–33°C", rain: "Medium", label: "Loy Krathong", color: "bg-yellow-100 text-yellow-800" },
  { month: "Nov", emoji: "🌤️", temp: "24–32°C", rain: "Low", label: "Best season starts", color: "bg-green-100 text-green-800" },
  { month: "Dec", emoji: "☀️", temp: "22–31°C", rain: "Low", label: "Peak season", color: "bg-green-100 text-green-800" },
];

export function BangkokWeatherByMonth() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState<number | null>(null);

  useEffect(() => {
    setCurrentMonthIdx(new Date().getMonth());
  }, []);

  if (currentMonthIdx === null) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🌡️ Bangkok weather — month by month
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {MONTHS.map((m, i) => (
          <div
            key={m.month}
            className={`rounded-xl p-2.5 border ${i === currentMonthIdx ? "border-orange-400 ring-1 ring-orange-300" : "border-[var(--border)]"}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-lg">{m.emoji}</span>
              <div>
                <span className="font-black text-xs">{m.month}</span>
                {i === currentMonthIdx && <span className="ml-1 text-[8px] font-black text-orange-600">NOW</span>}
              </div>
            </div>
            <div className="text-[10px] font-mono font-bold text-[var(--fg)]">{m.temp}</div>
            <div className="text-[10px] text-[var(--muted)]">Rain: {m.rain}</div>
            <span className={`mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${m.color}`}>{m.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5">
        <strong>Rain tip:</strong> Even in wet season, rain is usually afternoon showers (3–6pm). Mornings are clear. Rain lasts 1–2 hours max.
      </div>
    </div>
  );
}
