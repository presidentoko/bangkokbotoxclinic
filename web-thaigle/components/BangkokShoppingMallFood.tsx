const FOOD_COURTS = [
  {
    mall: "Terminal 21 — Pier 21",
    emoji: "✈️",
    floor: "5F",
    bestFor: "Budget meals, largest choice",
    price: "฿50–100 per dish",
    must: ["Pad Thai noodles ฿50", "Green curry with rice ฿60", "Mango sticky rice ฿70", "Thai iced tea ฿25"],
    why: "Best value food court in central Bangkok. Enormous choice. Crowded during lunch rush — go before 12pm or after 1:30pm.",
    bts: "Asok BTS / Sukhumvit MRT",
  },
  {
    mall: "ICONSIAM — SookSiam (Street food hall)",
    emoji: "🌊",
    floor: "G Floor (ground)",
    bestFor: "Premium street food, regional Thai specialties",
    price: "฿80–200 per dish",
    must: ["Chiang Mai khao soi ฿120", "Pattaya-style seafood", "Thai desserts by region", "Southern Thai massaman ฿150"],
    why: "ICONSIAM's ground floor has the most impressive food hall in Bangkok — representatives of all 77 Thai provinces. Not the cheapest but worth the experience.",
    bts: "Free shuttle from Saphan Taksin BTS",
  },
  {
    mall: "Central Embassy — Open House",
    emoji: "📚",
    floor: "6F",
    bestFor: "Hip dining + work café blend",
    price: "฿150–400 per meal",
    must: ["Akira Back Korea (Korean fusion ฿400–800)", "Omoté Japanese (฿250–500)", "Audrey Café (Thai-Western ฿200–400)"],
    why: "Best-designed food space in Bangkok. Mix of cafés, restaurants, bookshop. Day-pass dining atmosphere. Good WiFi.",
    bts: "Phloen Chit BTS",
  },
  {
    mall: "MBK Center — Top Floor Food Court",
    emoji: "🛍️",
    floor: "6F",
    bestFor: "Very budget Thai food",
    price: "฿40–80 per dish",
    must: ["Cash-only or food card system", "Classic padkrapao ฿50", "Boat noodles ฿35"],
    why: "Cheapest sit-down food in central Bangkok. Tourist-friendly despite being a local haunt. Slightly chaotic but fun.",
    bts: "National Stadium BTS",
  },
];

export function BangkokShoppingMallFood() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🏬 Bangkok mall food courts — best cheap eats inside malls
      </div>
      <div className="space-y-2.5">
        {FOOD_COURTS.map((f) => (
          <div key={f.mall} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{f.mall}</div>
                <div className="text-[10px] text-[var(--muted)]">Floor {f.floor} · {f.bts} · {f.bestFor}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{f.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1.5 leading-snug">{f.why}</div>
            <div className="flex flex-wrap gap-1">
              {f.must.map((m) => (
                <span key={m} className="text-[9px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full">{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
