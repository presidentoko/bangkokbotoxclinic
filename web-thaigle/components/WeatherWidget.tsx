"use client";
import { useEffect, useState } from "react";

const SEASONS = [
  {
    months: [11, 12, 1, 2],
    label: "Cool & dry season",
    icon: "☀️",
    tip: "Best time to visit! Outdoor markets, rooftop dining & street food are ideal now.",
    suggestions: ["Night markets", "Boat tours", "Rooftop bars"],
    links: ["/activities", "/activities/yoga-pilates", "/restaurants/cuisine/thai"],
    color: "from-amber-50 to-orange-50",
    border: "border-amber-200",
  },
  {
    months: [3, 4, 5],
    label: "Hot season",
    icon: "🌡️",
    tip: "Peak heat — seek AC restaurants, indoor gyms, rooftop pools & SPAs.",
    suggestions: ["Indoor dining", "Thai massage", "Swimming pools"],
    links: ["/restaurants/cuisine/thai", "/activities/spa", "/activities/muay-thai"],
    color: "from-red-50 to-orange-50",
    border: "border-red-200",
  },
  {
    months: [6, 7, 8, 9, 10],
    label: "Rainy season",
    icon: "🌧️",
    tip: "Short afternoon showers — great deals, fewer tourists. Perfect for indoor experiences.",
    suggestions: ["Cooking classes", "Thai massage", "Food tours"],
    links: ["/activities/cooking", "/activities/spa", "/guide/best-thai-food-bangkok"],
    color: "from-blue-50 to-cyan-50",
    border: "border-blue-200",
  },
];

export function WeatherWidget() {
  const [season, setSeason] = useState<typeof SEASONS[0] | null>(null);

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    setSeason(SEASONS.find((s) => s.months.includes(month)) ?? SEASONS[0]);
  }, []);

  if (!season) return null;

  return (
    <div className={`rounded-2xl border ${season.border} bg-gradient-to-br ${season.color} p-4 my-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{season.icon}</span>
        <div>
          <div className="font-bold text-sm">Bangkok — {season.label}</div>
          <div className="text-xs text-[var(--muted)]">{season.tip}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {season.suggestions.map((s, i) => (
          <a
            key={i}
            href={season.links[i]}
            className="text-xs px-3 py-1 rounded-full bg-white border border-[var(--border)] hover:border-orange-400 hover:text-orange-700 transition font-medium"
          >
            {s} →
          </a>
        ))}
      </div>
    </div>
  );
}
