const BARS = [
  {
    name: "Karmakamet Diner",
    emoji: "🍷",
    area: "Silom",
    price: "Natural wine glass ฿350–800; bottle ฿1,800–8,000",
    why: "Bangkok's most celebrated natural wine bar, hidden inside a lavender- and herb-scented gallery-restaurant. Extensive imported natural wine list (200+ labels), minimal intervention wines from France, Italy, Georgia, Australia. Romantic, quiet, exceptional staff knowledge.",
    tip: "No walk-ins for wine bar seating — reservation via LINE or phone essential. Ask staff for recommendations: 'no additives, low sulphur, skin-contact' gets you the most interesting pours. Food pairing menu excellent but small plates format.",
  },
  {
    name: "La Cave (Wine Bar + Restaurant)",
    emoji: "🍾",
    area: "Sukhumvit Soi 36",
    price: "Natural wine glass ฿280–600; bottles ฿1,500–5,000",
    why: "Bangkok's natural wine pioneer. French-Thai ownership, professional sommelier selection. Strong biodynamic wine list alongside conventional fine wines. Good food menu (French-influenced). Dimly lit, intimate wine cave atmosphere. Regular wine tastings and events.",
    tip: "Check their Instagram for upcoming natural wine events and winemaker dinners — great for enthusiasts. Wednesday night wine flights excellent value. Can request bottles to take away at retail pricing. Staff typically speak English and French.",
  },
  {
    name: "Ari's Natural Wine Scene (Multiple Spots)",
    emoji: "🍇",
    area: "Ari neighborhood, north of center",
    price: "Natural wine glass ฿200–500",
    why: "The Ari neighborhood has become Bangkok's natural wine hub with several wine-focused cafés and bars. Lower key, neighborhood feel, more experimental wine lists, younger crowd. Several shops also sell bottles to go. Good for bar-hopping and discovering new labels.",
    tip: "Ari is accessible by BTS (Ari station). Best explored on foot — wine bar density in a 400m radius. Weekends busiest. Some shops specialize in specific regions (Georgian, Loire Valley). Natural wine prices in Ari are generally lower than Sukhumvit equivalents.",
  },
  {
    name: "Opus Wine Bar",
    emoji: "🔮",
    area: "Sukhumvit, multiple locations",
    price: "Glass ฿250–550; bottles from ฿1,200",
    why: "Bangkok's most accessible wine bar chain. Curates natural and low-intervention wines alongside conventional selection. Regular by-the-glass natural wine rotation. Good food menu. Professional service. Multiple Bangkok locations mean you're rarely far from a quality glass.",
    tip: "Happy hour (before 7pm) offers 20–30% off wine. Ask for the 'natural wine section' of the list specifically — clearly labeled. Opus hosts regular winemaker events (subscribe to their newsletter). Good for dates — ambiance consistently elegant.",
  },
];

const GUIDE = [
  "Natural wine = minimal intervention: no added sulfites (or very low), no fining/filtering, organic/biodynamic farming",
  "Orange wine = white grape fermented with skins (like red wine) — amber/orange color, tannic, complex",
  "Pét-nat = naturally sparkling wine, cloudier than Champagne, often lower alcohol",
  "Biodynamic wine follows lunar farming calendar — more sustainable than 'just organic'",
  "Tasting tip: swirl less — many natural wines have sediment that's fine to drink",
  "Bangkok import prices add 300%+ tax — expect to pay 3x retail price for quality bottles",
];

export function BangkokNaturalWine() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🍷 Natural wine in Bangkok — bars, orange wine & low-intervention picks
      </div>
      <div className="space-y-2 mb-3">
        {BARS.map((b) => (
          <div key={b.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{b.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{b.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-purple-700">💡 {b.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-purple-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-purple-700 hover:bg-purple-50">
          Natural wine basics
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {GUIDE.map((g) => (
            <li key={g} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-purple-400 shrink-0">•</span>{g}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
