const SPOTS = [
  {
    name: "Bangkok Banh Mi — Vietnamese Sandwich",
    emoji: "🥖",
    area: "Vietnamese community (Sukhumvit), Yaowarat edges, street carts",
    price: "Banh mi ฿45–120",
    why: "Banh mi (Vietnamese baguette sandwich with pâté, pickled vegetables, cilantro, and proteins) has become one of Bangkok's most popular street sandwiches — particularly Banh Mi Pate shops which have spread across the city. The French baguette influence via Vietnam makes banh mi unique in Southeast Asia. Bangkok's banh mi is slightly adapted — Thai sriracha sometimes replaces Vietnamese-style chili sauce, but the core elements (crusty baguette + pickled daikon and carrot + pâté + protein) remain authentic.",
    tip: "Best banh mi in Bangkok: Banh Mi Pate shops identifiable by Vietnamese signage near Ekkamai BTS have lines of Thai office workers at lunch. The 'combination' (pâté + BBQ pork + fried egg) is the standard Bangkok order. A proper banh mi should crack audibly when bitten — soft baguette indicates the bread is wrong. Price point is honest: ฿45–70 for a proper street version.",
  },
  {
    name: "Artisan Sandwich & Deli Shops",
    emoji: "🥪",
    area: "Ekkamai, Thonglor, Ari — Western expat areas",
    price: "Sandwich ฿180–350",
    why: "Bangkok's artisan sandwich scene grew alongside the sourdough bread movement — places like The Sandwich Shop (Ekkamai), Roast Coffee (Thonglor), and various New York–inspired deli concepts serve proper sandwiches with quality bread (sourdough, ciabatta, focaccia) and imported and locally-produced deli meats and cheeses. The category expanded as Bangkok's Western expat community grew and demanded better lunch options than fast food.",
    tip: "Best artisan sandwich areas: Ekkamai/On Nut corridor for the best price-to-quality ratio; Thonglor for premium options with imported ingredients. Bangkok's pastrami and smoked meat scene is embryonic but growing — check The Butcher Bangkok and Chefs + Butchers (Ekkamai) for the best options. Rye bread is rare outside specialty bakeries.",
  },
  {
    name: "Thai-Adapted Western Sandwiches (7-11 & Street)",
    emoji: "🏪",
    area: "7-Eleven everywhere; street bread carts",
    price: "7-11 sandwiches ฿25–65; Street bread ฿20–50",
    why: "Thailand's ubiquitous 7-Eleven stores serve hot sandwiches (toast, club sandwiches, tuna melts) at ฿25–65 — the most accessible Western sandwich format in Bangkok. Street bread carts (often Thai-style soft white bread with fillings) operate near office buildings and universities. The Thai palate's approach to sandwiches differs — sweetness is more prominent (sweet mayonnaise, sweet cream cheese) and vegetables are limited.",
    tip: "7-11 sandwich etiquette: the cashier can heat them on a flat toaster — ask '7-11 toast dai mai?' Yes/no answer. The Ham and Cheese and Club Sandwich are the most reliable 7-11 options. Street bread carts near universities often have fresh-made sandwich fillings (tuna, egg salad, mock crab) at ฿20–30 — fresher than convenience store options.",
  },
];

export function BangkokSandwich() {
  return (
    <div className="rounded-2xl border border-lime-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-lime-700 mb-3">
        🥖 Sandwiches in Bangkok — banh mi, artisan deli shops & everyday street bread
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-lime-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-lime-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
