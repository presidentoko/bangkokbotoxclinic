const SECTIONS = [
  {
    title: "Thai Beers",
    emoji: "🍺",
    content: [
      { name: "Singha", desc: "The classic Thai beer. 5% ABV. Bitter, crisp. Best with Thai food. Launched 1933." },
      { name: "Chang", desc: "Sweeter, 5% ABV. More mass market. Famous for full-moon party scene." },
      { name: "Leo", desc: "Light, 5% ABV. Most affordable. Very popular with Thais. 'Leo drinking' = budget choice." },
      { name: "Asahi/Heineken/Corona", desc: "Widely available everywhere. Same price as Thai beers in most venues." },
    ],
  },
  {
    title: "Thai Spirits & Cocktails",
    emoji: "🍹",
    content: [
      { name: "Sang Som (Thai Rum)", desc: "National spirit. 35% ABV. Common in buckets. Mixes with Coke + lime." },
      { name: "Mekhong (Thai Whisky)", desc: "Grain spirit 35% ABV. Not real whisky but similar taste. Very cheap at ฿200–300/bottle." },
      { name: "Thai Gin", desc: "Growing scene. Iron Balls Gin (Bangkok brand) uses coconut + cardamom. Very popular at craft cocktail bars." },
      { name: "Lao Khao", desc: "Moonshine rice whisky. Very strong (40–50%), served at market stalls and traditional venues. Cultural experience." },
    ],
  },
  {
    title: "Drinking Laws & Tips",
    emoji: "⚖️",
    content: [
      { name: "Legal hours", desc: "Alcohol sold 11am–2pm and 5pm–midnight at most venues. Convenience stores follow same hours." },
      { name: "Legal age", desc: "20 years old minimum. ID checks uncommon at bars but legally required." },
      { name: "Buddhist holidays", desc: "Chakri Day, Visakha Bucha, Buddhist Lent — alcohol sales may be prohibited. Plan ahead." },
      { name: "Phuket/Koh Samui extension", desc: "Many tourist areas extend to 2am+ with special permits. Bangkok: strict 2am closing." },
    ],
  },
];

export function BangkokDrinkCultureGuide() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍻 Bangkok drink culture — beers, spirits & nightlife rules
      </h2>
      <div className="space-y-3">
        {SECTIONS.map((s) => (
          <div key={s.title} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-lg">{s.emoji}</span>
              <div className="font-bold text-xs">{s.title}</div>
            </div>
            <div className="space-y-1.5">
              {s.content.map((c) => (
                <div key={c.name} className="flex items-start gap-1.5">
                  <span className="text-[10px] font-bold text-amber-700 shrink-0 mt-0.5">{c.name}</span>
                  <span className="text-[10px] text-[var(--fg)] leading-snug">— {c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
