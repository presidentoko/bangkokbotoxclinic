const MARKETS = [
  {
    name: "Chatuchak Weekend Market (Section 7 Art/Craft)",
    emoji: "🎭",
    area: "Mo Chit BTS / Chatuchak MRT",
    open: "Sat–Sun 9am–6pm",
    highlight: "Largest weekend market in Southeast Asia. Saturday slightly less crowded than Sunday. Section 7–8 for handcraft and art.",
    mustSee: "The plant section (Section 6), ceramic stalls, vintage Thai movie posters, street food section 22–23.",
    budget: "Free entry. Eating ฿50–150/dish. Shopping ฿100–1,000s.",
  },
  {
    name: "Jodd Fairs Night Market",
    emoji: "🌃",
    area: "Ratchaprasong area (Ram Intra / Din Daeng — Grab needed)",
    open: "Thu–Sun 5pm–midnight",
    highlight: "Bangkok's most popular new-generation night market (opened 2020). Street food, vintage, local designer brands.",
    mustSee: "Crab roll (queue 20+ min but worth it), wagyu beef noodles (฿120), vintage clothing section.",
    budget: "Free entry. Food ฿60–250. Clothing/goods ฿150–1,500.",
  },
  {
    name: "Srinagarindra Train Market (Sat-Sun)",
    emoji: "🚂",
    area: "Srinagarindra Rd (Grab from On Nut BTS, 20 min)",
    open: "Thu–Sun 5pm–midnight",
    highlight: "Best vintage and retro market in Bangkok. 1950s-80s Americana aesthetic. Vintage cars displayed on weekends.",
    mustSee: "The antique furniture section, retro Singha beer signs, vintage denim, classic car row.",
    budget: "Free entry. Food ฿80–200. Vintage items ฿200–10,000s.",
  },
  {
    name: "Or Tor Kor Organic Saturday Market",
    emoji: "🌿",
    area: "Adjacent to Or Tor Kor Market, Mo Chit MRT",
    open: "Sat only 6am–2pm",
    highlight: "Farmers market for organic produce. Direct from Chiang Rai and Chiang Mai highland farms. Best tropical fruit selection in Bangkok.",
    mustSee: "Durian varieties (Monthong, Chanee), organic produce, freshly ground coffee, farmers selling dried herbs.",
    budget: "Organic produce ฿50–300. Prepared food ฿50–150.",
  },
];

export function BangkokSaturdayMarket() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🏪 Bangkok Saturday markets — weekend market guide
      </div>
      <div className="space-y-2">
        {MARKETS.map((m) => (
          <details key={m.name} className="border border-yellow-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-yellow-50 transition">
              <span className="text-xl shrink-0">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{m.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{m.open} · {m.area}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-yellow-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{m.highlight}</div>
              <div className="text-[10px] text-orange-600">⭐ Must see: {m.mustSee}</div>
              <div className="text-[10px] text-green-700">💰 {m.budget}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
