"use client";
import { useState } from "react";

const MOMENTS = [
  { emoji: "🌅", title: "Sunrise at Wat Arun", desc: "Cross the river before 7am. You'll have it almost to yourself. Costs 100฿.", cta: "Plan your morning →", url: "/day-plan" },
  { emoji: "🥊", title: "First Muay Thai training session", desc: "Most gyms welcome total beginners. 1 session is about 300฿ and you'll be hooked.", cta: "Find gyms →", url: "/activities/muay-thai" },
  { emoji: "🍜", title: "Midnight street noodles in Yaowarat", desc: "Chinatown after dark is pure sensory overload. Best at 10pm–midnight.", cta: "Find street food →", url: "/restaurants/cuisine/street_food" },
  { emoji: "🧘", title: "Rooftop yoga at sunrise", desc: "Several Silom and Sukhumvit studios run 7am classes with city views.", cta: "Find yoga →", url: "/activities/yoga-pilates" },
  { emoji: "🛺", title: "Tuk-tuk crawl through the old city", desc: "Negotiate 100฿ per stop. Get to Khao San, Grand Palace, Wat Pho in one loop.", cta: "Plan your route →", url: "/day-plan/thonglor/foodie" },
  { emoji: "💆", title: "Traditional Thai massage at Wat Pho", desc: "School massages run 420฿/hr. The most legit massage in all of Bangkok.", cta: "More spa options →", url: "/activities/spa" },
];

export function HighlightReel() {
  const [idx, setIdx] = useState(0);
  const m = MOMENTS[idx];

  return (
    <div className="my-4 rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 pt-4 pb-3">
        <div className="text-xs font-bold text-orange-700 uppercase mb-1">✨ Bangkok Bucket Moments</div>
        <div className="text-3xl mb-2">{m.emoji}</div>
        <div className="font-black text-base mb-1">{m.title}</div>
        <div className="text-xs text-[var(--muted)] leading-relaxed">{m.desc}</div>
      </div>
      <div className="px-4 py-3 flex items-center justify-between border-t border-[var(--border)]">
        <a href={m.url} className="text-xs font-bold text-orange-600 hover:underline">{m.cta}</a>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setIdx((idx - 1 + MOMENTS.length) % MOMENTS.length)}
            className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-black transition text-sm"
          >‹</button>
          <span className="text-[10px] text-[var(--muted)]">{idx + 1}/{MOMENTS.length}</span>
          <button
            onClick={() => setIdx((idx + 1) % MOMENTS.length)}
            className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-black transition text-sm"
          >›</button>
        </div>
      </div>
    </div>
  );
}
