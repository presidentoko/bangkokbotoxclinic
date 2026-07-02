const BARS = [
  {
    name: "Vesper Cocktail Bar",
    emoji: "🍸",
    area: "Sukhumvit Soi 16 (Asok BTS)",
    price: "฿350–600/cocktail",
    hours: "Mon–Sat 6pm–midnight",
    vibe: "Intimate speakeasy",
    why: "Bangkok's most acclaimed cocktail bar. Multiple international awards. Seasonal Thai ingredient program — using local herbs, fruits, ferments.",
    must: "Ask bartender for current seasonal recommendation. Full menu changes monthly.",
  },
  {
    name: "Rabbit Hole",
    emoji: "🐇",
    area: "Thonglor Soi 9",
    price: "฿280–450/cocktail",
    hours: "Daily 5pm–2am",
    vibe: "Creative underground",
    why: "Bangkok's most innovative cocktail menu. Custom ice program, house-made cordials, unusual botanicals. Dark, moody atmosphere.",
    must: "Tom Kha Sour (Thai coconut soup as cocktail base), Butterfly Pea Gin & Tonic (color changes with lime)",
  },
  {
    name: "Iron Balls Gin Bar",
    emoji: "🌴",
    area: "Sathorn / Bangrak area",
    price: "฿280–400/gin cocktail",
    hours: "Daily 5pm–midnight",
    vibe: "Local spirit showcase",
    why: "Bangkok's own premium gin brand. Rooftop garden bar where the botanicals grow. Distillery tours available. Very Bangkok story.",
    must: "Iron Balls Gin & Tonic (classic or with local fruit additions), gin flights comparing production styles.",
  },
  {
    name: "Mikkeller Bangkok",
    emoji: "🍺",
    area: "Ekkamai BTS area",
    price: "฿180–350/beer, cocktails available",
    hours: "Mon–Sat 5pm–midnight, Sun 3pm–10pm",
    vibe: "Nordic craft beer + cocktails",
    why: "Bangkok outpost of legendary Danish craft beer brand. Rotating taps. Cocktails with house-brewed beer components. Best craft beer bar in Thailand.",
    must: "Seasonal tap beer (changes weekly), limited Bangkok-collaboration brews",
  },
];

export function BangkokCocktailBars() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🍸 Bangkok cocktail bars — creative drinking culture
      </div>
      <div className="space-y-2">
        {BARS.map((b) => (
          <div key={b.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{b.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{b.vibe} · {b.area} · {b.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-orange-600">⭐ Must order: {b.must}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
