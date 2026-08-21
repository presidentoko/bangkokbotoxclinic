const MARKETS = [
  {
    name: "Chatuchak Weekend Market",
    emoji: "🏪",
    type: "Everything market",
    area: "Mo Chit BTS / Chatuchak MRT",
    open: "Sat–Sun 9am–6pm",
    why: "World's largest weekend market — 15,000 stalls. Everything from plants to vintage clothing to antiques to street food to pets. Navigating it is half the fun.",
    tip: "Section 2–4 for vintage/clothing. Section 8 for art. Section 22 for food. Download chatuchak-map.com before you go.",
    budget: "฿100 entry street food, ฿200–2,000 for clothes/goods",
  },
  {
    name: "Or Tor Kor Market",
    emoji: "🌿",
    type: "Premium fresh produce",
    area: "Chatuchak MRT / Mo Chit (opposite Chatuchak entrance)",
    open: "Daily 8am–6pm (best 8am–noon)",
    why: "Bangkok's highest-quality fresh market. Royal-warrant suppliers. Best mangoes, durian, tropical fruits, seafood, and prepared foods in the city.",
    tip: "Arrive early for best selection. Prepared food section has excellent rice + curry. Take cooler bag for perishables.",
    budget: "฿50–500 (produce + prepared food)",
  },
  {
    name: "Asiatique The Riverfront",
    emoji: "🌅",
    type: "Night market / entertainment",
    area: "Charoen Krung (free shuttle from Saphan Taksin pier)",
    open: "Daily 5pm–midnight",
    why: "Bangkok's most popular riverfront night market. 1,500+ shops, Calypso Cabaret, Muay Thai live shows, Ferris wheel. Tourist-oriented but genuinely fun.",
    tip: "Go early (5–6pm) for sunset river views. Prices are tourist-level — bargain firmly or use as entertainment only.",
    budget: "Free entry. ฿300–1,500 for goods, ฿150–350 for food",
  },
  {
    name: "Talad Rot Fai Srinakarin (Train Market)",
    emoji: "🚂",
    type: "Vintage / retro night market",
    area: "Srinakarin Rd (Uber/Grab needed — not on BTS)",
    open: "Thu–Sun 5pm–midnight",
    why: "Bangkok's best vintage market. 1950s–80s Americana meets Thai. Vintage cars on display. Antique stalls, retro clothing, old signs.",
    tip: "Bring cash. Very dark — hard to check quality. Thu–Fri less crowded. The retro car section (outdoor parking) is free to walk through.",
    budget: "Free entry. ฿200–5,000+ for vintage items",
  },
  {
    name: "Pak Khlong Talad (Flower Market)",
    emoji: "🌸",
    type: "Wholesale flower market",
    area: "Yothi Pier / Pak Nam Pho Pier, Old City",
    open: "24 hours (midnight–4am is peak)",
    why: "Bangkok's most photogenic market. Overwhelming color. Wholesale roses, orchids, jasmine garlands, lotus. Locals buy for temple offerings.",
    tip: "Midnight–3am is best time — peak activity, fresh flowers arriving. Very cheap: orchids ฿30–50/bundle, roses ฿100/dozen.",
    budget: "฿50–300 for flowers. Small bags of jasmine garlands ฿10.",
  },
];

export function BangkokMarketGuide() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏪 Bangkok markets — from fresh food to vintage finds
      </h2>
      <div className="space-y-2">
        {MARKETS.map((m) => (
          <details key={m.name} className="border border-orange-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-orange-50 transition">
              <span className="text-xl shrink-0">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{m.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{m.type} · {m.open}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-orange-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--muted)]">📍 {m.area}</div>
              <div className="text-[10px] text-[var(--fg)] leading-snug">{m.why}</div>
              <div className="text-[10px] text-orange-600">💡 {m.tip}</div>
              <div className="text-[10px] text-green-700">💰 Budget: {m.budget}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
