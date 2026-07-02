const AREAS = [
  {
    name: "Thonglor / Ekkamai",
    emoji: "🌇",
    description: "Bangkok's coolest dining strip. Japanese, Korean, upscale Thai, craft cocktail bars.",
    priceTag: "$$–$$$",
    bestFor: "Date nights, trendy cafés, Japanese food",
    url: "/restaurants/bangkok/thonglor",
  },
  {
    name: "Silom / Sathorn",
    emoji: "🏙️",
    description: "Business district at lunch, hidden bar scene at night. Mix of Thai classics and international.",
    priceTag: "$$–$$$$",
    bestFor: "Business lunches, cocktails, rooftop bars",
    url: "/restaurants/bangkok/silom",
  },
  {
    name: "Chinatown (Yaowarat)",
    emoji: "🏮",
    description: "Most authentic street food in Bangkok. Seafood, dim sum, roasted duck. Evening atmosphere unbeatable.",
    priceTag: "$–$$",
    bestFor: "Street food, seafood, dim sum lovers",
    url: "/restaurants/bangkok/chinatown",
  },
  {
    name: "Ari / Phahonyothin",
    emoji: "☕",
    description: "Hipster neighborhood with indie cafés, plant-based options, and local fusion cuisine.",
    priceTag: "$–$$",
    bestFor: "Café culture, vegetarian, local creative food",
    url: "/restaurants/bangkok/ari",
  },
  {
    name: "Sukhumvit",
    emoji: "🌃",
    description: "International hub — Korean BBQ, Japanese, Western, and Thai all in one stretch.",
    priceTag: "$$–$$$",
    bestFor: "Korean BBQ, Japanese, expat restaurants",
    url: "/restaurants/bangkok/sukhumvit",
  },
];

export function RestaurantDistricts() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🗺️ Bangkok restaurants — by neighborhood
      </div>
      <div className="space-y-2">
        {AREAS.map((a) => (
          <a key={a.name} href={a.url} className="flex gap-3 items-start p-3 rounded-xl border border-[var(--border)] hover:border-orange-300 hover:shadow-sm transition group">
            <span className="text-xl shrink-0">{a.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-xs group-hover:text-orange-700 transition">{a.name}</span>
                <span className="text-[10px] font-mono font-bold text-orange-600">{a.priceTag}</span>
              </div>
              <div className="text-[11px] text-[var(--muted)] leading-snug mb-0.5">{a.description}</div>
              <div className="text-[10px] font-medium text-[var(--fg)]">Best for: {a.bestFor}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
