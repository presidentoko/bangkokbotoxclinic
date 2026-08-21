const BARS = [
  {
    name: "Mikkeller Bangkok",
    emoji: "🍺",
    area: "Ekkamai Soi 10",
    price: "Pints ฿250–380, Tasting paddles ฿600–800",
    on_tap: "14+ rotating taps — Danish and international craft beer",
    why: "Bangkok outpost of the world-famous Danish gypsy brewery. Best tap list in Thailand. Special collab beers brewed specifically for Bangkok.",
    tip: "Their Bangkok Mango Shake IPA collab is a must-try. Tap list changes — check their Instagram before visiting.",
  },
  {
    name: "Wishbeer Home Bar & Bottle Shop",
    emoji: "🏪",
    area: "Thong Lo (Sukhumvit 55)",
    price: "Bottles ฿180–500, Cans ฿120–350",
    on_tap: "30+ local and imported craft, rotating",
    why: "Bangkok's best craft beer bottle shop AND bar. Thousands of bottles from around the world. Draft beer + entire fridge section to take away. Best selection of Thai craft breweries.",
    tip: "Their own label beers brewed at contract breweries around Thailand. Takeaway pack: 4 cans for ฿600 is good value.",
  },
  {
    name: "Brew Culture (Ari)",
    emoji: "🏘️",
    area: "Ari neighborhood",
    price: "Pints ฿180–280",
    on_tap: "10 taps, Thai craft focus",
    why: "Bangkok's original neighborhood craft beer bar. Focus on supporting Thai independent breweries. Relaxed atmosphere, knowledgeable staff, good food pairing menu.",
    tip: "Craft Beer Festival (Sept/Oct): Bangkok's biggest annual craft beer event — 100+ beers, usually at Impact Arena or BITEC.",
  },
  {
    name: "Thai Craft Breweries to Know",
    emoji: "🇹🇭",
    area: "Distributed across Bangkok bars",
    price: "Cans ฿80–150 in convenience stores, ฿180–280 at craft bars",
    on_tap: "Available at specialty craft beer bars",
    why: "Thailand's homegrown craft scene is booming despite complex regulations. Key local breweries: Full Moon Brewing, Chitbeer, 7 Days, Sandport Brewing (operates from Cambodia due to Thai laws).",
    tip: "Thai law technically restricts small-scale brewing — many 'Thai' craft beers are contract-brewed in Laos or Cambodia. This creates interesting cross-border beer culture.",
  },
];

export function BangkokCraftBeer() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍺 Bangkok craft beer — best bars, bottle shops & Thai breweries
      </h2>
      <div className="space-y-2">
        {BARS.map((b) => (
          <div key={b.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{b.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{b.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-amber-700 mb-0.5">🚰 Taps: {b.on_tap}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-orange-600">💡 {b.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
