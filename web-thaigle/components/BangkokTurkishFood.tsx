const SPOTS = [
  {
    name: "Istanbul Restaurant — Sukhumvit Soi 3",
    emoji: "🇹🇷",
    area: "Sukhumvit Soi 3 (Arab Street area)",
    price: "Main dishes ฿350–850",
    why: "Sukhumvit Soi 3 (Arab Street) is Bangkok's Middle East hub with several Turkish restaurants. Istanbul Restaurant is among the most consistent. Proper lamb kebabs, mezze spreads, hummus, Turkish bread, baklava. Outdoor seating.",
    tip: "The area around Sukhumvit Soi 3/1 has multiple Middle Eastern restaurants — compare menus. Ask specifically for 'iskender kebab' (döner over bread with tomato sauce and yogurt) — not available everywhere. Hookah/shisha bars nearby.",
  },
  {
    name: "Doner Kebab Street Carts (Asok & Nana)",
    emoji: "🌯",
    area: "Near Nana BTS and Asoke intersection",
    price: "Döner wrap ฿80–180",
    why: "Bangkok has a surprising number of genuine Turkish döner kebab carts near tourist and expat areas. Turkish operators run several. Vertical rotisserie, freshly shaved lamb/chicken, fresh bread, yogurt sauce. Quick lunch or late-night food.",
    tip: "Late-night carts near Nana Entertainment Plaza area are reliable. Look for Turkish operators (they'll chat in Turkish). Quality varies — find carts that are busy with Turkish and Arab expatriates (they know which is authentic).",
  },
  {
    name: "Turkish Sweets: Baklava & Künefe",
    emoji: "🍮",
    area: "Turkish pastry shops on Arab Street (Sukhumvit 3 area)",
    price: "Baklava ฿60–180 per piece, Künefe ฿180–350",
    why: "Genuine Turkish pastry shops with phyllo baklava, walnut/pistachio varieties, and künefe (hot cheese pastry soaked in syrup). Very hard to find properly made outside of Turkish restaurants. Worth the Soi 3 trip specifically for sweets.",
    tip: "Künefe (hot cheese dessert) must be ordered at a sit-down Turkish restaurant — it cannot travel. Ask specifically for 'pistachio baklava' not walnut — the green pistachio version is the premium original. Serve with Turkish tea.",
  },
];

const DISHES = [
  "Döner Kebab: vertical rotisserie, shaved lamb/chicken, pita or lavash wrap",
  "Iskender: döner over torn bread, tomato sauce, melted butter, yogurt on side",
  "Adana Kebab: hand-ground spiced lamb, chargrilled, served with rice and salad",
  "Manti: Turkish dumplings (like small tortellini), yogurt + tomato butter sauce",
  "Baklava: phyllo layers, nuts (pistachio or walnut), honey-rose syrup",
  "Künefe: hot shredded wheat/cheese dessert, sugar syrup — best Turkish dessert",
];

export function BangkokTurkishFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🇹🇷 Turkish food in Bangkok — kebabs, baklava & where to find them
      </div>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
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
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-red-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-red-700 hover:bg-red-50">
          Turkish dishes guide
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {DISHES.map((d) => (
            <li key={d} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{d}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
