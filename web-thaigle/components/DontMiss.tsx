"use client";
import { useEffect, useState } from "react";

const MONTHLY = [
  { month: 1, items: ["🎆 New Year celebrations at CentralWorld", "🌸 Cool season — best outdoor dining", "🏖️ Beaches accessible from BKK (Koh Samet, Hua Hin)"] },
  { month: 2, items: ["❤️ Valentine's dinners — book early", "🌺 Flower markets in full bloom", "🍜 Thai New Year food festivals"] },
  { month: 3, items: ["🌡️ Heat is rising — indoor activities perfect", "🎨 Bangkok Art Biennale events", "🥊 Muay Thai championship season"] },
  { month: 4, items: ["💦 Songkran (Thai New Year) — Apr 13-15!", "🎉 Water festival street parties", "🌊 Best time to visit Pattaya"] },
  { month: 5, items: ["🌧️ Early rains — great deals on dining", "🏛️ Visakha Bucha Buddhist holiday", "🎭 Theater & cultural shows"] },
  { month: 6, items: ["🌧️ Rainy season starts — indoor spa season", "🛒 End-of-season sales at malls", "🍜 Street food thrives in rain"] },
  { month: 7, items: ["🌧️ Mid-rainy season — cooking class perfect", "🕯️ Asalha Bucha Buddhist holiday", "🛍️ Mid-year sales at Siam malls"] },
  { month: 8, items: ["👑 Queen's Birthday — national holiday", "🎆 Fireworks along Chao Phraya", "🌾 Lush greenery — best Muay Thai photos"] },
  { month: 9, items: ["🌧️ Heaviest rains — SPA & massage season", "🍜 Thai food festivals indoors", "📸 Moody Bangkok photography"] },
  { month: 10, items: ["🪔 Vegetarian Festival (Phuket + BKK)", "👻 Dress up for Awk Phansa holiday", "🌅 Rains clearing — sunsets return"] },
  { month: 11, items: ["🕯️ Loi Krathong — floating lanterns on Chao Phraya", "🌙 Cool evenings perfect for rooftop dining", "🎆 Yi Peng lantern festival (if in CM)"] },
  { month: 12, items: ["❄️ Peak cool season — perfect weather!", "🎄 Christmas celebrations at malls", "🎆 New Year countdown at CentralWorld"] },
];

export function DontMiss() {
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    setMonth(new Date().getMonth() + 1);
  }, []);

  if (!month) return null;
  const data = MONTHLY.find((m) => m.month === month)!;
  const monthName = new Date(2026, month - 1, 1).toLocaleString("en", { month: "long" });

  return (
    <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4 my-4">
      <div className="text-xs font-bold uppercase tracking-wide text-purple-700 mb-2">📅 Don&apos;t miss this {monthName}</div>
      <ul className="space-y-2">
        {data.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="shrink-0 mt-0.5">{item.split(" ")[0]}</span>
            <span className="text-[var(--fg)]">{item.slice(item.indexOf(" ") + 1)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
