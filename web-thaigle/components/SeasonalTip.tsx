"use client";

import { useState, useEffect } from "react";

const SEASONS = [
  {
    months: [11, 0, 1, 2],
    label: "Cool & Dry Season",
    emoji: "🌤️",
    temp: "25–32°C",
    tip: "Best time to visit. Low humidity, clear skies. Book popular spots early — peak tourist season.",
    what: "Outdoor activities, Muay Thai, cycling, open-air dining",
    watch: "Popular venues may have queues. Book lessons/classes in advance.",
    color: "blue",
  },
  {
    months: [3, 4],
    label: "Hot Season",
    emoji: "☀️",
    temp: "35–40°C",
    tip: "Very hot midday. Plan outdoor activities before 10am or after 5pm. Rooftop bars are great at sunset.",
    what: "Indoor spas, cooking classes, Muay Thai (early morning), pool bars",
    watch: "Heatstroke risk. Stay hydrated — coconut water from street vendors = ฿20.",
    color: "orange",
  },
  {
    months: [5, 6, 7, 8, 9],
    label: "Rainy Season",
    emoji: "🌧️",
    temp: "28–35°C",
    tip: "Short heavy showers, usually done in 1 hour. Hotels and restaurants are less crowded — better deals.",
    what: "Indoor climbing, spas, cooking schools, rooftop bars between showers",
    watch: "Carry a small umbrella. Flash flooding in low-lying areas is possible.",
    color: "teal",
  },
  {
    months: [10],
    label: "End of Rainy Season",
    emoji: "🌦️",
    temp: "27–33°C",
    tip: "Rain tapering off. Fewer tourists, great prices. Loy Krathong (Nov) is one of Bangkok's best festivals.",
    what: "Everything — transition season is great for most activities",
    watch: "Check Loy Krathong dates for river boat schedules.",
    color: "green",
  },
];

const COLOR_MAP: Record<string, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  orange: "border-orange-200 bg-orange-50 text-orange-800",
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  green: "border-green-200 bg-green-50 text-green-800",
};

export function SeasonalTip() {
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    setMonth(new Date().getMonth());
  }, []);

  if (month === null) return null;

  const season = SEASONS.find((s) => s.months.includes(month)) ?? SEASONS[0];
  const cls = COLOR_MAP[season.color] ?? COLOR_MAP.blue;

  return (
    <div className={`rounded-2xl border p-4 my-4 ${cls}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{season.emoji}</span>
        <div>
          <div className="font-black text-sm">{season.label}</div>
          <div className="text-xs opacity-75">{season.temp} right now in Bangkok</div>
        </div>
      </div>
      <p className="text-xs leading-relaxed mb-2">{season.tip}</p>
      <div className="text-xs font-medium mb-0.5">Best for: <span className="font-normal opacity-90">{season.what}</span></div>
      <div className="text-xs font-medium">Watch out: <span className="font-normal opacity-90">{season.watch}</span></div>
    </div>
  );
}
