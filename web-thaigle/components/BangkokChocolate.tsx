const SPOTS = [
  {
    name: "Kad Kokoa — Thai Craft Chocolate",
    emoji: "🍫",
    area: "Samyan area, near Chula University",
    price: "Single-origin bar ฿200–450; Drinking chocolate ฿150–250",
    why: "Bangkok's premiere bean-to-bar Thai craft chocolate shop. Kad Kokoa works directly with Thai cacao farmers in Chanthaburi and Chumphon provinces — the final product showcases Thailand's terroir in chocolate form. Single-origin bars, drinking chocolate, and cacao tea available. Educational about where Thai cacao comes from.",
    tip: "The Chanthaburi origin is nutty and fruit-forward; Chumphon is deeper and earthier. Buy the tasting set (3–4 origins) to compare Thai terroir. The chocolate here tastes different from mass-produced European chocolate — lean into it. The shop is small; come mid-week to avoid queues.",
  },
  {
    name: "Royce' Chocolate — Japanese Premium",
    emoji: "🎁",
    area: "Siam Paragon, Central Chidlom, major malls",
    price: "Nama Chocolate ฿400–600; Potatochip Chocolate ฿380–500",
    why: "Japanese luxury chocolate brand famous for Nama Chocolate (ganache cubes dusted with cocoa powder, refrigerated). The 'Potatochip Chocolate' (dark chocolate-drizzled rippled chips) became a Bangkok/Tokyo airport souvenir staple. High-quality Japanese-French approach to confectionery. Reliable luxury gift that performs across all Thai cultural contexts.",
    tip: "Nama Chocolate must be refrigerated and eaten within 30 days — not a long-shelf souvenir. Buy the day before departure if taking home. The Milk Chocolate Nama is more accessible to non-dark-chocolate eaters. Gift boxes available for special occasions.",
  },
  {
    name: "Compartés & Dean & DeLuca",
    emoji: "☕",
    area: "ICON Siam, major Bangkok lifestyle malls",
    price: "Premium chocolates ฿300–1,500",
    why: "Bangkok's premium retail scene includes US boutique chocolatier Compartés (LA-based, fruit-forward bars) alongside European brands at Dean & DeLuca luxury food stores. The luxury mall chocolate landscape in Bangkok is wide — Villa Market, Emquartier's food hall, and Gourmet Market all stock premium international chocolate brands.",
    tip: "Bangkok's year-round heat makes storing chocolate challenging — buy chocolate-containing items the same day you intend to eat them unless you have dedicated refrigeration. The mall food halls are air-conditioned storage — browse slowly, select, eat fresh.",
  },
];

export function BangkokChocolate() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍫 Chocolate in Bangkok — Thai craft cacao, Japanese nama & luxury shops
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
