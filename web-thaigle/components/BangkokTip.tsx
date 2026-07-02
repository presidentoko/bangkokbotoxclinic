"use client";

import { useState, useEffect } from "react";

const TIPS = [
  { emoji: "🚕", tip: "Metered taxis are always cheaper than Grab in Bangkok — look for the green 'TAXI METER' sign on the roof.", category: "Getting around" },
  { emoji: "🌶️", tip: "Order 'pet nit noi' (very little spice) — Bangkok cooks default to tourist-level mild unless you specify.", category: "Food" },
  { emoji: "💧", tip: "Street food stalls that have been in the same spot for 20+ years are almost always safe and excellent.", category: "Food" },
  { emoji: "🏧", tip: "Bangkok ATMs charge ฿220 per withdrawal. Use a Wise or Revolut card to avoid foreign fees on top.", category: "Money" },
  { emoji: "🛺", tip: "Tuk-tuks are tourist traps for transport but fine for short hops — always agree on the price before you get in.", category: "Getting around" },
  { emoji: "🌤️", tip: "BTS Skytrain + MRT is the fastest way across the city. Get a Rabbit card for cheaper fares.", category: "Getting around" },
  { emoji: "🍜", tip: "Dinner before 6pm or after 9pm = smaller crowds and faster service at popular spots.", category: "Food" },
  { emoji: "💆", tip: "Traditional Thai massage (nuad boran) should be 300–500 THB per hour at a legitimate shop.", category: "Activities" },
  { emoji: "🥊", tip: "Muay Thai gyms offer tourist classes — book in advance for the morning session (less crowded, cheaper).", category: "Activities" },
  { emoji: "📱", tip: "True Move H SIM at the airport: 30 days unlimited 4G for ~300 THB. Best value for tourists.", category: "Tech" },
  { emoji: "🍺", tip: "7-Eleven beer is 46 THB. Can't sell alcohol 2–5pm or midnight–11am by law.", category: "Nightlife" },
  { emoji: "🕌", tip: "Always cover shoulders and knees at temples — or buy a sarong outside for 50 THB.", category: "Culture" },
  { emoji: "💊", tip: "Most medications are available OTC at Boots or Watsons — no prescription needed for common stuff.", category: "Health" },
  { emoji: "🌊", tip: "Chatuchak Weekend Market has 15,000 stalls — go at 9am before the crowds and heat peak.", category: "Shopping" },
  { emoji: "🍛", tip: "Pad Thai at a proper restaurant = 80–120 THB. If it's 350+ THB you're in tourist-trap territory.", category: "Food" },
];

export function BangkokTip() {
  const [tip, setTip] = useState<typeof TIPS[0] | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const idx = Math.floor(Date.now() / 86400000) % TIPS.length;
      setTip(TIPS[idx]);
    } catch {}
  }, []);

  if (!tip || dismissed) return null;

  return (
    <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 relative">
      <span className="text-2xl shrink-0">{tip.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-0.5">{tip.category} tip</div>
        <p className="text-sm text-amber-900 leading-snug">{tip.tip}</p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1">
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400 hover:text-amber-700 text-lg leading-none"
          aria-label="Dismiss tip"
        >
          ×
        </button>
        <a href="/local-tips" className="text-[10px] text-amber-600 hover:underline font-bold whitespace-nowrap">
          More tips →
        </a>
      </div>
    </div>
  );
}
