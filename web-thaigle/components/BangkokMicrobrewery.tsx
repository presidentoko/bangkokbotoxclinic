const BREWERIES = [
  {
    name: "Mikkeller Bangkok",
    emoji: "🍺",
    area: "Ekkamai / Thonglor",
    price: "Craft pint ฿250–450; beer flight ฿400–700",
    why: "Danish craft beer institution's Bangkok outpost. 20+ taps rotating international and local brews. Proper beer bar atmosphere, no food gimmicks. Strong IPA and sour beer selection. Very popular with expat craft beer community. Outdoor seating available.",
    tip: "Ask the bartender for 'what's local?' — Thai craft beers change frequently. Wednesday is often tap takeover night. Beer flight of 6 tasters (฿450) is the best value introduction. Bring cash as well as card — some busy nights payment gets slow.",
  },
  {
    name: "Chitbeer (Thai Craft Brewery + Taproom)",
    emoji: "🇹🇭",
    area: "Chinatown / Samphanthawong area",
    price: "Local craft pint ฿180–300",
    why: "Bangkok's homegrown craft brewery making Thai-ingredient beers: lychee wheat, jasmine rice ale, pandan lager, butterfly pea IPA. Taproom in the Chinatown area. Pioneering Thai craft beer that showcases local flavors rather than copying Western styles.",
    tip: "Lychee wheat is the gateway beer for Thai craft newcomers — not too fruity, just enough floral note. The seasonal releases (mango season, lychee season) are exceptional but limited. Call ahead to check which seasonals are on tap before making the trip.",
  },
  {
    name: "Lost Ring Brewing Co.",
    emoji: "🔵",
    area: "Ratchada area",
    price: "Craft pint ฿200–380",
    why: "Bangkok craft brewery with attached restaurant. Brewing on-site — you can sometimes watch the brewing process. Session IPAs, wheat beers, stouts. Better food menu than most Bangkok craft bars (proper bar snacks + Thai-influenced plates). Friendly English-speaking staff.",
    tip: "Brewery tours available on specific days (call ahead). Growler fills available if you want to take beer home. Lunch sessions (12–3pm) considerably less crowded than evenings. Good for afternoon session rather than full evening venue.",
  },
  {
    name: "Brew Bros Bangkok",
    emoji: "🎸",
    area: "Multiple locations including Asoke",
    price: "Craft pint ฿180–350",
    why: "Bangkok's most accessible craft beer bar chain. Multiple locations, good rotating tap selection, solid food menu. Not as curated as Mikkeller but more central and walk-in friendly. Regular beer events and occasional live music.",
    tip: "Happy hour specials (before 7pm) offer good value. The Asoke location is easiest to reach by public transport (MRT Sukhumvit). Game nights (trivia, etc.) happen regularly — check their social media. The food here is legitimately good (not just beer food).",
  },
];

const GUIDE = [
  "Thai craft beer movement started around 2012 — now 30+ local craft brands",
  "Legally complex: craft brewing requires expensive licenses → many local brewers brew at partner facilities",
  "Thai craft beer tax is high (same as imports) — expect ฿180–450/pint vs ฿50–100 for Chang/Leo",
  "Notable Thai craft brands: Maldives Brewing, Full Moon Brewing, Chitbeer, Sandport, FLEUR",
  "Home brewing in Thailand is illegal but tolerated — underground homebrew community is active",
  "Beer geek shorthand: IPA (hoppy/bitter), Wheat (light/banana), Sour (acidic/fruity), Stout (dark/coffee)",
];

export function BangkokMicrobrewery() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🍺 Craft beer & microbreweries in Bangkok — taprooms, Thai craft & imports
      </h2>
      <div className="space-y-2 mb-3">
        {BREWERIES.map((b) => (
          <div key={b.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{b.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{b.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {b.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-yellow-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-yellow-700 hover:bg-yellow-50">
          Thai craft beer scene guide
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {GUIDE.map((g) => (
            <li key={g} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-yellow-400 shrink-0">•</span>{g}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
