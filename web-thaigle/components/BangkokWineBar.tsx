const SPOTS = [
  {
    name: "QUINCE Bangkok — Natural Wine & Small Plates",
    emoji: "🍷",
    area: "Ekkamai, Sukhumvit 63",
    price: "Glass ฿300–800; Bottle ฿1,500–5,000+; Small plates ฿180–450",
    why: "QUINCE was pivotal in establishing Bangkok's natural wine scene — focusing on biodynamic, organic, and minimal-intervention wines from Europe and the New World. The small plates menu is designed for wine pairing with Mediterranean-influenced dishes. The atmosphere is intimate and knowledgeable — staff understand provenance and can navigate the orange wines, skin-contact whites, and pét-nats that characterize the natural wine genre. Bangkok's sophisticated dining expat community treats QUINCE as a trusted address.",
    tip: "Natural wine note: skin-contact whites (orange wines) taste different from conventional whites — cloudy, tannic, sometimes funky. If you're unfamiliar, ask the staff to guide you through a small flight before committing to a bottle. QUINCE's pairing recommendations are usually excellent. Reservations strongly recommended for weekend evenings. The terrace seating (when weather permits) is Bangkok wine bar ambience at its best.",
  },
  {
    name: "ZO Wine Bar — Sukhumvit Old-School Wine",
    emoji: "🥂",
    area: "Sukhumvit Soi 11",
    price: "Glass ฿200–600; Bottle ฿1,200–8,000",
    why: "ZO has served Bangkok's wine community for years — a reliable classic wine bar with a deep cellar of French, Italian, Spanish, and New World selections. The focus is conventional (vs. natural wine bars) — Burgundy, Barolo, Rioja, and Napa alongside everyday quaffable bottles. The Sukhumvit Soi 11 location puts it near Bangkok's expat social heartland. Regular wine tasting events and wine education evenings are part of the program.",
    tip: "Bangkok wine pricing: import duties make Thai wine prices higher than Europe but comparable to Singapore and Hong Kong. Budget ฿1,500–2,500 for a good bottle at a wine bar vs. ฿800–1,500 at retail (Villa Market, Foodland, specialty wine shops carry the same wines). Corkage fees at Bangkok restaurants vary from ฿300–800 if you want to bring your own bottle — confirm before bringing wine from your condo.",
  },
  {
    name: "Bangkok Wine Scene — Natural & Fine",
    emoji: "🍾",
    area: "Ekkamai, Phrom Phong, Silom — multiple emerging wine venues",
    price: "Entry-level glass ฿200; Premium by-glass ฿500–1,000",
    why: "Bangkok's wine culture has evolved significantly — from hotel bar Burgundy and Bordeaux to a full spectrum: natural wine bars (QUINCE, Thewinesmith, Vesper's wine list), high-end wine restaurants (Bunker, 80/20), and accessible neighborhood wine bars with rotating selections. Thai wine (Monsoon Valley, PB Valley Khao Yai) is improving and available at most wine venues — Thai wine from the Khao Yai region benefits from significant altitude variation for tropical viticulture. Wine importers give regular tasting events open to the public.",
    tip: "Thai wine worth trying: Monsoon Valley (GranMonte) Khao Yai Colombard and Viognier are approachable whites that reflect tropical terroir. The best Thai reds are from Shiraz and Dornfelder grapes. Thai wine tourism (Khao Yai wine region, 3 hours from Bangkok) combines vineyard visits with wine estate restaurants — Sala Wine Bar at PB Valley Khao Yai and GranMonte Estate's restaurant are destination experiences. The wine import duty in Thailand means visiting these estates directly is significantly cheaper than buying the same wines in Bangkok.",
  },
];

export function BangkokWineBar() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🍷 Wine bars in Bangkok — natural wine, fine dining pairings & Thai wine from Khao Yai
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-rose-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
