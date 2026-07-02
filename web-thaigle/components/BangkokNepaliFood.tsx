const ITEMS = [
  {
    name: "Everest Kitchen",
    emoji: "🏔️",
    area: "Sukhumvit Soi 11 area",
    price: "Main dishes ฿180–380",
    why: "Most established Nepali-Indian restaurant in Bangkok serving Nepali expats and Himalayan food lovers. Dal bhat (lentil rice with sides), momos (dumplings), gundruk (fermented vegetables), thukpa (noodle soup). Authentic recipes brought from Kathmandu.",
    dishes: "Must try: chicken momo (steamed dumplings with tomato-sesame sauce), dal bhat set, aloo tama (potato bamboo shoot curry).",
  },
  {
    name: "Momo Houses (Multiple Locations)",
    emoji: "🥟",
    area: "Near Sukhumvit and expat areas",
    price: "Momo per portion ฿120–180",
    why: "Thai-Nepali momo restaurants have spread across Bangkok as Nepali expats established small businesses. Momos (Nepali/Tibetan dumplings) are now Bangkok's most accessible Himalayan food — steam, fried, or jhol (soup momos in spicy broth). Very affordable, filling.",
    dishes: "Jhol momo (soup version) is the most authentic serving style. Spice level adjustable. Chicken or vegetable options. Tomato-sesame dipping sauce is key.",
  },
  {
    name: "Himalayan Spice (Nepalese Cuisine)",
    emoji: "🌿",
    area: "Silom / Bang Rak area",
    price: "Main dishes ฿200–450",
    why: "Himalayan food meets Bangkok presentation. Full Nepali menu including sel roti (fried rice donut sweet), kheer (rice pudding), sekuwa (charcoal grilled meat). Serves Nepali mountain climbers passing through Bangkok to Kathmandu — the ultimate authenticity test.",
    dishes: "Newari khana (Newari ethnic feast set) when available — multiple small dishes representing Nepal's ethnic Newar cuisine. A rare opportunity outside Nepal.",
  },
];

const CONTEXT = [
  "Nepali community in Bangkok is primarily in the hospitality, security guard, and tourism industries",
  "Momos are now Bangkok mainstream — found in markets and food courts far outside Nepali restaurants",
  "Tibetan-Nepali-Indian food overlap: many dishes appear in all three cuisines with regional variations",
  "Nepal-Bangkok routes are popular — Bangkok is often a transit city for Nepal-bound trekkers",
  "Sherpa tea (butter tea) is not widely available outside dedicated Nepali restaurants",
];

export function BangkokNepaliFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🏔️ Nepali food in Bangkok — momos, dal bhat & Himalayan flavors
      </div>
      <div className="space-y-2 mb-3">
        {ITEMS.map((i) => (
          <div key={i.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-red-700">🥟 {i.dishes}</div>
          </div>
        ))}
      </div>
      <details className="border border-red-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-red-700 hover:bg-red-50">
          Nepali community & food culture in Bangkok
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {CONTEXT.map((c) => (
            <li key={c} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{c}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
