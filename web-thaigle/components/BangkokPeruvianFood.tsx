const SPOTS = [
  {
    name: "Maido Bangkok",
    emoji: "🇵🇪",
    area: "Sukhumvit area",
    price: "Ceviche ฿550–1,200, set menus ฿2,500–5,500",
    why: "Bangkok's most acclaimed Peruvian restaurant, affiliated with the Maido brand from Lima (repeatedly #1 in Latin America's 50 Best Restaurants). Nikkei cuisine — Peruvian-Japanese fusion. Sea bass tiradito, causa, lomo saltado. Elevated but accessible.",
    tip: "Reservations essential — book 2 weeks ahead. The Nikkei set menu is the best value experience. Tiradito (raw fish in aji amarillo) is better than typical ceviche here. Wine pairing available with Peruvian wines.",
  },
  {
    name: "La Mar-style Ceviche Bars (Sukhumvit scene)",
    emoji: "🍋",
    area: "Various Sukhumvit locations",
    price: "Ceviche ฿280–650",
    why: "Several Peruvian-inspired restaurants in Bangkok serve fresh ceviche. Key dishes: ceviche (raw fish cured in tiger's milk/lime), lomo saltado (beef stir-fry with fries), causa (potato terrine). Growing trend — new places opening regularly.",
    tip: "Google 'Peruvian restaurant Bangkok 2025' for currently open spots — small restaurants in this niche open and close. Aji amarillo (yellow chili) is the defining flavor of Peruvian food — ask if dishes are made with fresh aji amarillo vs powder.",
  },
  {
    name: "Ceviche & Pisco Sour at Latin Fusion Bars",
    emoji: "🍹",
    area: "Thonglor, Ekkamai, and Sathorn cocktail bars",
    price: "Pisco sour ฿280–450, sharing ceviche ฿450–850",
    why: "Several Bangkok cocktail bars serve Peruvian food alongside creative cocktails. Pisco sour (national cocktail of Peru) has gained popularity. Thonglor's cocktail bar scene has spots with good fusion versions of Peruvian classics.",
    tip: "Pisco sour = Peruvian grape brandy + lime + egg white + bitters. Best at bars that import genuine Peruvian pisco vs substituting local brandy. Ask 'do you use real pisco?' before ordering. Chilcano (pisco + ginger beer) easier to make authentically.",
  },
];

const DISHES = [
  "Ceviche: raw fish cured in tiger's milk (lime, chili, onion) — not cooked, acid-cured",
  "Tiradito: Japanese-influenced raw fish, thinner slices, different sauce from ceviche",
  "Lomo Saltado: beef stir-fry with tomatoes, onions, soy sauce, served with fries",
  "Causa Rellena: cold mashed potato tower filled with chicken/tuna/seafood",
  "Aji de Gallina: creamy yellow chili chicken — mild heat, very comforting",
  "Pisco Sour: Peruvian brandy, lime, egg white, bitters — frothy national cocktail",
];

export function BangkokPeruvianFood() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🇵🇪 Peruvian food in Bangkok — ceviche, lomo saltado & pisco sours
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-yellow-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-yellow-700 hover:bg-yellow-50">
          Peruvian dish guide
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {DISHES.map((d) => (
            <li key={d} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-yellow-400 shrink-0">•</span>{d}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
