const MALLS = [
  {
    name: "Siam Paragon",
    emoji: "👑",
    bts: "BTS Siam (CEN)",
    tier: "Luxury",
    why: "Ferrari showroom, Lamborghini, Gucci, LV, YSL. Ocean World aquarium in basement. Bangkok's most-visited mall.",
    best: "Luxury brands, Gourmet Market (basement), cinema, kids zone (Sea Life)",
    food: "Gourmet Market basement: best supermarket in Bangkok",
  },
  {
    name: "Terminal 21",
    emoji: "✈️",
    bts: "BTS Asok / MRT Sukhumvit (E4)",
    tier: "Mid-range",
    why: "Each floor = different world city theme (Tokyo, Paris, Istanbul). Known for ฿39 somtam in the food court.",
    best: "Pit stop stop food court (consistently voted Bangkok's best), Korean fashion floors",
    food: "Pier 21 food court Level 5 — cheapest + best variety in the area",
  },
  {
    name: "CentralWorld",
    emoji: "🌐",
    bts: "BTS Chit Lom (E2)",
    tier: "Mid–high",
    why: "Largest mall in Bangkok. 7 floors. Connects to Gaysorn, Isetan. New Year countdown venue.",
    best: "Se-Ed bookstore, Tops Supermarket, Uniqlo, H&M, Muji, multiplex cinema",
    food: "Food Court 7F, Groove zone outdoor dining",
  },
  {
    name: "MBK Center",
    emoji: "📱",
    bts: "BTS National Stadium (W1)",
    tier: "Budget",
    why: "Bangkok's electronics + knock-off market in mall format. Phones, accessories, tailor shops, budget food.",
    best: "Electronics at prices 20–40% below retail. SIM cards, phone cases, cables, fashion copies.",
    food: "Food court level 6 — around ฿50–80/plate, authentic Thai",
  },
  {
    name: "ICONSIAM",
    emoji: "🏆",
    bts: "Gold Line BTS + free ferry from Saphan Taksin",
    tier: "Premium + Experience",
    why: "Riverside mega-mall. Indoor floating market (ICONIX). Best Chao Phraya river views from Level 7.",
    best: "ICONIX indoor floating market (must-see), Apple Store, river dining, massive Takashimaya",
    food: "ICONIX floating market = Michelin-level street food under one roof. Don't miss.",
  },
  {
    name: "Chatuchak Weekend Market",
    emoji: "🛒",
    bts: "Mo Chit BTS / Chatuchak MRT",
    tier: "Budget + Unique",
    why: "Not a mall but the biggest market experience in Thailand. 15,000 stalls. Fashion, antiques, plants, pets, food.",
    best: "Vintage clothes, handmade ceramics, Thai art, unusual souvenirs, massive food section",
    food: "Distributed through market — eat as you explore. Budget ฿40–100/item",
  },
];

export function BangkokMallGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🛍️ Bangkok malls & markets — which to visit
      </div>
      <div className="space-y-2">
        {MALLS.map((m) => (
          <div key={m.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{m.name}</div>
                <div className="text-[10px] text-[var(--muted)]">🚉 {m.bts}</div>
              </div>
              <span className="shrink-0 text-[10px] font-bold text-blue-600 border border-blue-200 rounded-full px-2 py-0.5">{m.tier}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{m.why}</div>
            <div className="text-[10px] text-blue-700 mb-0.5">Best: {m.best}</div>
            <div className="text-[10px] text-orange-600">🍜 {m.food}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
