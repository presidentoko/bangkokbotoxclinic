const BURGERS = [
  {
    name: "Burgerama",
    emoji: "🍔",
    area: "Silom / Surasak BTS area",
    price: "฿250–400",
    why: "Bangkok's cult burger favorite. Smash-style burgers with house-made buns. Crispy edges, melted American cheese, special sauce.",
    must: "Double Smash (฿280), truffle mayo add-on, thick-cut fries",
    rating: "★ Cult local favorite, no Instagram presence, just quality",
  },
  {
    name: "Daniel Thaiger",
    emoji: "🐯",
    area: "Sukhumvit 49 / Thong Lo area",
    price: "฿300–500",
    why: "Bangkok's most creative burger menu. Weekly specials. Brioche buns, signature Tiger sauce. Started as food truck, now legendary spot.",
    must: "Classic Thaiger burger, weekly special, onion rings",
    rating: "★★ Instagram darling, genuinely great food",
  },
  {
    name: "Copper Buffet (Budget Burger Option)",
    emoji: "🟤",
    area: "Multiple locations (CentralWorld, Siam, Emporium)",
    price: "฿299–399 buffet",
    why: "All-you-can-eat including burgers. Not fancy but genuinely good value. Great for large groups or heavy eaters.",
    must: "Try the burger station + seafood + BBQ at buffet",
    rating: "★ Value pick for hungry groups",
  },
  {
    name: "Street-Side Burger Carts",
    emoji: "🛒",
    area: "Near BTS stations (Asok, Phrom Phong, Thong Lo)",
    price: "฿80–150",
    why: "Thai-style egg burger (kai dao burger): fried egg, pork patty, lettuce, tomato on soft bun. Not American style but delicious and very Bangkok.",
    must: "Kai dao burger with egg ฿80, add cheese ฿10 more. Look for carts with gas grills at BTS exits.",
    rating: "★ Authentic Bangkok street food burger experience",
  },
];

export function BangkokBurgerSpots() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍔 Bangkok burgers — from Thai street eggs to craft smash burgers
      </div>
      <div className="space-y-2">
        {BURGERS.map((b) => (
          <div key={b.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{b.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{b.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ {b.must}</div>
            <div className="text-[10px] text-[var(--muted)]">{b.rating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
