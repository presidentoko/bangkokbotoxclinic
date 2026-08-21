const DRINKS = [
  {
    name: "Chang Beer",
    emoji: "🐘",
    type: "Lager",
    abv: "5%",
    price: "฿55–65 (7-Eleven) / ฿100–160 (bar)",
    flavor: "Light, crisp, slightly sweet. Best cold on ice.",
    iconic: "Thailand's best-selling beer. Logo is twin elephants.",
    tips: "Chang means 'elephant.' Classic ฿65 convenience store cold Chang = Thai experience.",
  },
  {
    name: "Singha",
    emoji: "🦁",
    type: "Lager",
    abv: "5%",
    price: "฿60–70 (store) / ฿110–180 (bar)",
    flavor: "Slightly hoppier and more bitter than Chang. More refined.",
    iconic: "Older brand, more upscale positioning. Lion logo.",
    tips: "Better with Thai spicy food — the bitterness cuts through chili heat.",
  },
  {
    name: "Leo Beer",
    emoji: "🐆",
    type: "Lager",
    abv: "5%",
    price: "฿45–55 (store) / ฿90–130 (bar)",
    flavor: "Budget-friendly. Lighter than Chang/Singha.",
    iconic: "Cheapest of the big three. Leopard logo.",
    tips: "Best value if budget is tight. Most bars stock all three — ask for 'Leo' (local pronunciation: 'Lay-oh').",
  },
  {
    name: "Craft Beer Scene",
    emoji: "🍺",
    type: "Craft ales, IPAs, stouts",
    abv: "4–8%",
    price: "฿180–350/pint",
    flavor: "Growing scene. Now rivaling Singapore. IPAs popular.",
    iconic: "Notable: Sandport, BrewDog Bangkok, Mikkeller Bangkok, Chatuchak Weekend Brewing",
    tips: "Tap Room Silom (Silom Soi 8) has 20+ taps. Best craft bar: Mikkeller Bangkok (Ekkamai). Thai craft brewery Chitbeer has great Thai-inspired flavors.",
  },
  {
    name: "Mekhong Whiskey",
    emoji: "🥃",
    type: "Thai cane spirit (technically rice whiskey)",
    abv: "35%",
    price: "฿180 (750ml bottle at 7-Eleven)",
    flavor: "Herbal, slightly sweet. Mixes well with soda + lime. 'Mekong bucket' is Thai party staple.",
    iconic: "Thailand's national spirit since 1941. Soda + lime + ice = standard serve.",
    tips: "Buckets on Khao San Road: Mekhong + soda + Red Bull + ice ≈ ฿120. Pre-mix at 7-Eleven for budget travel.",
  },
];

export function BangkokBeerGuide() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🍺 Bangkok drinks guide — beer, craft & spirits
      </h2>
      <div className="space-y-2">
        {DRINKS.map((d) => (
          <div key={d.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl shrink-0">{d.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{d.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{d.type} · ABV {d.abv}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono font-black text-green-700">{d.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{d.flavor}</div>
            <div className="text-[10px] text-blue-700 mb-0.5">{d.iconic}</div>
            <div className="text-[10px] text-orange-600">💡 {d.tips}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
