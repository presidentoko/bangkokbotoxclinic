const STORES = [
  {
    name: "7-Eleven",
    emoji: "🏪",
    everywhere: "13,000+ stores across Thailand",
    best: "Beer, snacks, ready-to-eat, SIM cards, ATM, phone chargers, 24/7",
    price: "Cheap to mid. Beer ฿55–65. Ready meals ฿25–60.",
    tip: "Bangkok's social infrastructure. 7-Eleven is where you buy: ถุงยางอนามัย (condoms), aspirin, water, cold beer at 3am. Also pay bills + top up mobile.",
  },
  {
    name: "Tops Market",
    emoji: "🥦",
    everywhere: "Major malls (CentralWorld, Emporium, Siam Paragon Gourmet Market)",
    best: "Fresh produce, imported goods, wine, cheese, Japanese ingredients",
    price: "Mid-range. Good cheese and deli section.",
    tip: "Tops Supermarket in Siam Paragon = most comprehensive international supermarket in Bangkok. Worth visiting even as a tourist.",
  },
  {
    name: "Makro",
    emoji: "📦",
    everywhere: "Warehouse locations outside city center",
    best: "Wholesale quantities, best prices on staples, restaurants supply here",
    price: "Lowest prices — requires membership card (฿300/yr, sometimes free at door)",
    tip: "Where Bangkok restaurants buy their supplies. Snacks, sauces, noodles, cleaning goods at 30–50% below supermarket.",
  },
  {
    name: "Villa Market",
    emoji: "🧀",
    everywhere: "Sukhumvit (Soi 11, 33, 47), Thonglor",
    best: "Imported Western groceries, cheeses, wine, deli meats, pesto/pasta sauces",
    price: "Premium — 20–30% above Tops. Worth it for hard-to-find imports.",
    tip: "Expat lifeline. Buy cheddar, prosciutto, sourdough bread here. Also solid wine selection with staff knowledge.",
  },
  {
    name: "Foodland",
    emoji: "🍔",
    everywhere: "Multiple Bangkok branches, some 24hr",
    best: "24-hour Asok branch is legendary. Deli, butcher, bakery, pharmacy",
    price: "Mid-range",
    tip: "Asok Foodland (Sukhumvit Soi 5) open 24/7 — best grocery store for late-night shopping + deli food.",
  },
];

export function BangkokSupermarketGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🛒 Bangkok supermarket guide
      </h2>
      <div className="space-y-2">
        {STORES.map((s) => (
          <div key={s.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.everywhere}</div>
              </div>
            </div>
            <div className="text-[10px] text-blue-700 mb-0.5">Best for: {s.best}</div>
            <div className="text-[10px] text-green-700 mb-0.5">{s.price}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
