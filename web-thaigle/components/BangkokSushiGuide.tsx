const OPTIONS = [
  {
    name: "Omakase at Sushi Zo (ICON SIAM)",
    emoji: "🍣",
    area: "ICON SIAM, Charoenkrung",
    price: "Omakase from ฿3,500–6,000/person",
    style: "Japanese-imported chef, seasonal Tokyo-style omakase",
    why: "Bangkok's best omakase experience. Fish flown from Tsukiji market. 18–22 course progression. Chef counter seats only — pure sushi meditation.",
    tip: "Reservation 2–3 weeks essential. Dress code: no shorts, no sandals. Skip lunch entirely before coming.",
  },
  {
    name: "Sushiro (Conveyor Belt)",
    emoji: "🎢",
    area: "Multiple: Central Ladprao, Mega Bangna, The Mall, RCA",
    price: "Plates ฿30–90, Average meal ฿300–500",
    style: "Japanese kaiten-zushi (conveyor belt) chain",
    why: "Japan's most popular sushi chain — now in Bangkok with identical quality. Fresh fish, rotating seasonal specials, app-ordering system. Best value sushi in Bangkok.",
    tip: "Order premium items via touchscreen — they come fresh on a dedicated lane. Avoid peak dinner rush (7–9pm) — queues can be 45 min.",
  },
  {
    name: "Fuji Restaurant (Japanese Chain)",
    emoji: "🗻",
    area: "Central World, Central Embassy, Terminal 21, many locations",
    price: "Sushi sets ฿200–600",
    style: "Japanese family dining — sushi + full Japanese menu",
    why: "Bangkok's longest-running Japanese chain (30+ years). Reliable, consistent, good quality for the price. Extensive menu beyond sushi. Good for groups with mixed Japanese food preferences.",
    tip: "Fuji is everywhere in Bangkok — useful for reliably decent sushi when you don't want to risk unknown places. Sashimi quality is their strongest offering.",
  },
  {
    name: "On The Table Bangkok (Casual)",
    emoji: "🐟",
    area: "Asok BTS / Exchange Tower",
    price: "Sushi per piece ฿80–200, Sets ฿400–800",
    style: "Mid-range Japanese with strong sushi focus, modern Bangkok vibe",
    why: "Bangkok's sweet spot between expensive omakase and cheap conveyor belt. Quality fish, creative rolls with Thai ingredients, inventive presentation.",
    tip: "The spicy tuna + mango roll is a Bangkok-Thai fusion that actually works. Lunchtime bento specials (11am–2pm weekdays) are very good value.",
  },
];

export function BangkokSushiGuide() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🍣 Sushi in Bangkok — from omakase to conveyor belt, all tiers
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.area} · {o.style}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-blue-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
