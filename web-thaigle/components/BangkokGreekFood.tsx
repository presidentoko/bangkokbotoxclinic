const PICKS = [
  {
    name: "Oink Greek Kitchen",
    emoji: "🫒",
    area: "Sukhumvit Soi 31",
    price: "Mezze ฿180–380, Mains ฿380–680",
    why: "Bangkok's most authentic Greek kitchen. Chicken souvlaki, moussaka, spanakopita made fresh daily. Greek owners import key ingredients directly from Athens. Consistently packed with Greek expats.",
    tip: "The mezze platter (฿580 for 2) covers all classics. BYOB — no corkage fee for wine. Weekend Greek nights sometimes feature live bouzouki. Book ahead Thursday–Saturday.",
  },
  {
    name: "Aegean Mediterranean Restaurant",
    emoji: "🌊",
    area: "Thong Lo area",
    price: "Mezze ฿220–450, Mains ฿450–850",
    why: "Broader Mediterranean menu covering Greek, Turkish, and Levantine dishes. Excellent hummus, grilled fish, lamb chops. Beautiful interior with blue-and-white Greek island aesthetic.",
    tip: "Good for groups wanting variety beyond pure Greek food. Mixed mezze table recommended for 4+ people. Reservations essential on weekends.",
  },
  {
    name: "Paros Restaurant",
    emoji: "🏛️",
    area: "Ekkamai area",
    price: "Mains ฿380–750",
    why: "Named after the Cyclades island. Fresh fish grilled whole in Greek style, whole roasted lamb on Sundays, barrel wine imported from Greece.",
    tip: "Sunday lamb feast is must-book 48 hours ahead. Charcoal grill is the kitchen's strength — order anything chargrilled. Greek wine selection best in Bangkok.",
  },
];

const ESSENTIALS = [
  "Spanakopita (spinach + feta pie in phyllo pastry)",
  "Moussaka (eggplant + lamb + béchamel baked dish)",
  "Souvlaki (grilled meat skewers, usually pork or chicken)",
  "Taramasalata (fish roe dip — pink, creamy, smoky)",
  "Loukoumades (honey + cinnamon doughnuts — Greek dessert)",
];

export function BangkokGreekFood() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🫒 Greek food in Bangkok — mezze, souvlaki & Mediterranean cuisine
      </h2>
      <div className="space-y-2 mb-3">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-blue-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
      <div className="border border-blue-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-blue-700 mb-1.5">Greek dishes to try:</div>
        <ul className="space-y-0.5">
          {ESSENTIALS.map((e) => (
            <li key={e} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-blue-400 shrink-0">•</span>{e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
