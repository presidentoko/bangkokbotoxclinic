const MALLS = [
  {
    name: "Siam Paragon",
    emoji: "💎",
    bts: "Siam BTS",
    vibe: "Luxury brands, Kinokuniya bookstore, huge aquarium",
    priceRange: "$$$",
    highlights: "Louis Vuitton, Prada, SEA LIFE Bangkok — perfect rainy day",
  },
  {
    name: "Central World",
    emoji: "🏬",
    bts: "Chit Lom BTS",
    vibe: "Biggest mall in SEA. All price ranges, good food court",
    priceRange: "$$–$$$",
    highlights: "Groove rooftop bars, food court on B1, New Year countdown party",
  },
  {
    name: "EmQuartier",
    emoji: "🌿",
    bts: "Phrom Phong BTS (connected)",
    vibe: "Upscale, best restaurants & cafés in Bangkok",
    priceRange: "$$$",
    highlights: "The Helix Quartier food hall, Savelberg, botanical garden on rooftop",
  },
  {
    name: "JJ Market (Chatuchak)",
    emoji: "🛍️",
    bts: "Mo Chit BTS / Chatuchak Park MRT",
    vibe: "World's largest weekend market. Everything. Negotiable prices.",
    priceRange: "$–$$",
    highlights: "Vintage, plants, antiques, street food. Sat–Sun 8am–6pm only.",
  },
  {
    name: "Terminal 21",
    emoji: "✈️",
    bts: "Asok BTS / Sukhumvit MRT",
    vibe: "Airport-themed, mid-range, AMAZING food court (Pier 21)",
    priceRange: "$–$$",
    highlights: "Pier 21 food court: most famous cheap eats in Bangkok at ฿35–60",
  },
];

export function BangkokMalls() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🏬 Bangkok malls — which one?
      </div>
      <div className="space-y-2">
        {MALLS.map((m) => (
          <div key={m.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xl">{m.emoji}</span>
              <span className="font-bold text-xs">{m.name}</span>
              <span className="ml-auto text-[10px] font-bold text-purple-700">{m.priceRange}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-1">🚆 {m.bts}</div>
            <div className="text-[11px] text-[var(--fg)] mb-0.5">{m.vibe}</div>
            <div className="text-[10px] text-orange-600">✨ {m.highlights}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
