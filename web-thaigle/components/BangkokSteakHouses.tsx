const STEAKHOUSES = [
  {
    name: "Charcoal Tandoor Grill & Mezze",
    emoji: "🥩",
    area: "Thonglor Soi 8",
    price: "฿500–1,500/person",
    cut: "Wagyu beef + Australian grain-fed. Charcoal grill. Best value quality meat in Thonglor.",
    why: "Most popular steak restaurant with Bangkok expat community. Friday night always packed. Mezze starters are excellent.",
    rating: "4.7★ Google, 2,000+ reviews",
  },
  {
    name: "Ember Bangkok",
    emoji: "🔥",
    area: "Ekkamai Soi 10",
    price: "฿800–2,500/person",
    cut: "US Prime, Australian Wagyu, Japanese A5 Wagyu (by weight). Dry-aged on-site.",
    why: "Best steakhouse in Bangkok for serious beef lovers. Dry-aging cabinet visible from dining room. Award-winning wine list.",
    rating: "4.8★ Google",
  },
  {
    name: "The Standard Bangkok (Level 5 restaurant)",
    emoji: "✨",
    area: "Ekkamai BTS",
    price: "฿1,200–3,000/person",
    cut: "Wagyu côte de boeuf, USDA prime cuts. Modern presentation.",
    why: "Hotel restaurant with exceptional quality. Rooftop pool view from adjacent bar. Most stylish steakhouse setting in Bangkok.",
    rating: "4.6★ Google",
  },
  {
    name: "Don Breakfast & Other Meals",
    emoji: "🍳",
    area: "Silom / Surasak BTS",
    price: "฿600–1,200/person",
    cut: "Shorter menu but Australian beef steak + eggs, NY strip. All-day dining.",
    why: "Best brunch steak in Bangkok. Understated, consistent. Booking recommended for weekends.",
    rating: "4.5★ Google",
  },
];

export function BangkokSteakHouses() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥩 Bangkok steakhouses — best beef restaurants
      </div>
      <div className="space-y-2">
        {STEAKHOUSES.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700 mb-0.5">🥩 {s.cut}</div>
            <div className="text-[10px] text-[var(--muted)]">⭐ {s.rating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
