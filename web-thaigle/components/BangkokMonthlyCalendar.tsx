"use client";
import { useEffect, useState } from "react";

const EVENTS: Record<number, { name: string; emoji: string; desc: string }[]> = {
  1: [{ name: "New Year's recovery", emoji: "🎆", desc: "Peak tourist season. Hotels expensive. Rooftop parties on 31st." }],
  2: [{ name: "Valentine's Day Bangkok", emoji: "💕", desc: "Flower markets go wild. Best rooftop dinner reservations fill up fast." }],
  3: [{ name: "Cool season ends", emoji: "🌤️", desc: "Last month of comfortable weather before heat. Best time to explore outdoors." }],
  4: [{ name: "Songkran", emoji: "💦", desc: "Thai New Year. 13–15 Apr. Massive water fights. Don't go out with electronics unprotected." }],
  5: [{ name: "Visakha Bucha", emoji: "🪔", desc: "Buddhist holiday. No alcohol sales this day. Candle ceremonies at temples." }],
  6: [{ name: "Rainy season begins", emoji: "🌧️", desc: "Afternoon downpours. Bring umbrella. Prices drop 15–30%. Great food value." }],
  7: [{ name: "King's Birthday", emoji: "🇹🇭", desc: "July 28. City decorated. Avoid disrespectful content this week." }],
  8: [{ name: "Mid rainy season", emoji: "⛈️", desc: "Hottest & wettest month. Indoor activities dominate. Temple hopping OK in mornings." }],
  9: [{ name: "Vegetarian Festival", emoji: "🥬", desc: "9 days, city-wide. Chinese vegetarian food only. Incredible Chinatown processions." }],
  10: [{ name: "Loy Krathong", emoji: "🪔", desc: "Full moon night. Float krathong (banana leaf boats) on river. Magical atmosphere." }],
  11: [{ name: "Cool season begins", emoji: "🌤️", desc: "Nov–Feb: best weather. Comfortable 25–32°C. Peak booking season — plan ahead." }],
  12: [{ name: "King Bhumibol Day", emoji: "🇹🇭", desc: "Dec 5. Father's Day. Dec 31 countdown at CentralWorld and Iconsiam is massive." }],
};

export function BangkokMonthlyCalendar() {
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    setMonth(new Date().getMonth() + 1);
  }, []);

  if (month === null) return null;

  const events = EVENTS[month] ?? [];
  const monthName = new Date(2026, month - 1, 1).toLocaleString("en-US", { month: "long" });

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📅 Bangkok this month — {monthName}
      </div>
      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map((e) => (
            <div key={e.name} className="flex gap-3 items-start p-3 rounded-xl bg-blue-50 border border-blue-100">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div>
                <div className="font-bold text-xs text-blue-900">{e.name}</div>
                <div className="text-[11px] text-blue-800 leading-snug mt-0.5">{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-[var(--muted)] italic">No major events this month — a quiet, good time to visit.</div>
      )}
      <a
        href="/guide"
        className="mt-3 block text-center text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 rounded-full py-1.5 hover:bg-blue-100 transition"
      >
        Full Bangkok seasonal guide →
      </a>
    </div>
  );
}
