const SCHOOLS = [
  {
    name: "Baipai Thai Cooking School",
    emoji: "👨‍🍳",
    style: "Market tour + half-day class",
    price: "฿2,900/person",
    dishes: "5 Thai dishes chosen from menu options",
    why: "Consistently ranked #1 in Bangkok. Small groups. Khlong boat to local market included.",
    bookAhead: "2–3 days minimum, popular",
  },
  {
    name: "Silom Thai Cooking School",
    emoji: "🍳",
    style: "Morning market tour + 4 dishes",
    price: "฿1,300/person",
    dishes: "4 dishes — green curry, pad thai, tom yum, dessert",
    why: "Best value in Bangkok. BTS Chong Nonsi area. Very accessible for tourists.",
    bookAhead: "Day before is fine",
  },
  {
    name: "Bangkok Bold Kitchen",
    emoji: "🌶️",
    style: "Evening class, no market tour",
    price: "฿2,200/person",
    dishes: "5 dishes, focus on authentic spicy flavours",
    why: "For serious home cooks. No shortcuts — authentic Thai technique, not tourist-friendly versions.",
    bookAhead: "1–2 days",
  },
  {
    name: "The Blue Elephant Cooking School",
    emoji: "🐘",
    style: "Heritage restaurant + morning class",
    price: "฿4,500/person",
    dishes: "6 Royal Thai dishes",
    why: "Upscale. Set in 100-year-old mansion. Royal Thai cuisine focus. Best for special occasions.",
    bookAhead: "3–5 days, limited seats",
  },
];

const WHAT_YOULL_LEARN = [
  "Balancing the 4 Thai flavors: sweet, sour, salty, spicy",
  "Making fresh curry paste from scratch (vs. packaged)",
  "Cooking with galangal, lemongrass, kaffir lime leaves",
  "Wok technique: very high heat, fast timing",
  "Carving vegetables — traditional Thai garnishing",
];

export function BangkokCookingClassGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🍜 Bangkok cooking classes — school comparison
      </div>
      <div className="space-y-2 mb-3">
        {SCHOOLS.map((s) => (
          <div key={s.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.style}</div>
              </div>
              <span className="shrink-0 text-[11px] font-mono font-black text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5">{s.dishes}</div>
            <div className="text-[10px] text-blue-600 mb-0.5">{s.why}</div>
            <div className="text-[10px] text-orange-600">📅 Book ahead: {s.bookAhead}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-2">What you&apos;ll learn</div>
      <div className="space-y-1">
        {WHAT_YOULL_LEARN.map((w) => (
          <div key={w} className="text-[10px] flex gap-1.5 items-start">
            <span className="shrink-0 text-orange-500">✓</span>{w}
          </div>
        ))}
      </div>
    </div>
  );
}
