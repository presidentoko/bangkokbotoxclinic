const OPTIONS = [
  {
    type: "Thai BBQ / Mookata",
    emoji: "🔥",
    groupSize: "4–10 people",
    price: "฿200–350/person unlimited BBQ + beer packages",
    why: "Shared hot pot + BBQ grill at center table. Very social. Typically AYCE (all-you-can-eat).",
    bestVenues: "Mookata Petch Niam (Victory Monument), Narak Kwai (multiple branches), S&P chain",
    tip: "Order the pork-belly boat buffet and the soup combination. Bring patience — 2–3 hrs is normal.",
  },
  {
    type: "Seafood Restaurant (pick-from-tank)",
    emoji: "🦞",
    groupSize: "6–15 people",
    price: "฿400–800/person",
    why: "Live tanks — choose your fish/crab/lobster. Staff cooks it your way. Very Bangkok.",
    bestVenues: "Tawandang Seafood (Rama 9), Somboon Seafood (Silom), Laem Charoen Seafood (various)",
    tip: "Must try: pad cha crab, yam talay seafood salad, whole deep-fried fish with mango salad.",
  },
  {
    type: "KBBQ (Korean BBQ for groups)",
    emoji: "🇰🇷",
    groupSize: "4–8 people",
    price: "฿350–600/person",
    why: "Grill at the table. Sam gyeop sal pork belly, beef bulgogi, banchan sides. Soju-friendly.",
    bestVenues: "Sukhumvit Soi 12 Korean BBQ row, Ssambap Thonglor, Wang Galbi Ekamai",
    tip: "Most KBBQ in Bangkok includes 1 hour grill + unlimited refills. Order extra cheese corn and japchae sides.",
  },
  {
    type: "Private Room Thai Restaurant",
    emoji: "🍽️",
    groupSize: "8–20 people",
    price: "฿600–1,500/person",
    why: "Reserved private dining room. Staff-served set menus. Best for corporate or special groups.",
    bestVenues: "Nahm (best Thai fine dining), Issaya Siamese Club (garden), Bo.lan (sustainable Thai)",
    tip: "Book private room 1–2 weeks ahead. Usually minimum spend applies. Ask for shared family-style menu.",
  },
];

export function BangkokGroupDining() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        👥 Bangkok group dining — best options for groups
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.type} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.type}</div>
                <div className="text-[10px] text-[var(--muted)]">Group: {o.groupSize} · {o.price}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{o.why}</div>
            <div className="text-[10px] text-blue-700 mb-0.5">📍 Try: {o.bestVenues}</div>
            <div className="text-[10px] text-orange-600">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
