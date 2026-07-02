const BUDGETS = [
  {
    type: "Budget backpacker",
    emoji: "🎒",
    monthly: "฿20,000–35,000",
    usd: "~$550–950/mo",
    breakdown: [
      { item: "Hostel / guesthouse", cost: "฿6,000–10,000" },
      { item: "Street food meals", cost: "฿4,000–6,000" },
      { item: "Transport (BTS + Grab)", cost: "฿2,000–3,000" },
      { item: "Activities, drinks, extras", cost: "฿5,000–8,000" },
    ],
    note: "Khaosan Road, Banglamphu. Very doable but tight.",
  },
  {
    type: "Mid-range comfort",
    emoji: "🏨",
    monthly: "฿50,000–80,000",
    usd: "~$1,400–2,200/mo",
    breakdown: [
      { item: "1-bed serviced apartment", cost: "฿18,000–28,000" },
      { item: "Mix of local + mid restaurants", cost: "฿10,000–15,000" },
      { item: "Transport + occasional taxi", cost: "฿4,000–6,000" },
      { item: "Gym, coworking, activities", cost: "฿8,000–15,000" },
    ],
    note: "Ekkamai, Ari, Phrom Phong. Comfortable digital nomad life.",
  },
  {
    type: "Expat / high comfort",
    emoji: "🏙️",
    monthly: "฿100,000–200,000+",
    usd: "~$2,750–5,500/mo",
    breakdown: [
      { item: "2-bed condo (Sukhumvit)", cost: "฿35,000–70,000" },
      { item: "Restaurants + fine dining", cost: "฿25,000–40,000" },
      { item: "Grab daily + BTS unlimited", cost: "฿6,000–10,000" },
      { item: "Gym, spa, entertainment", cost: "฿20,000–40,000" },
    ],
    note: "Thonglor, Ekkamai, Phrom Phong. Full comfort, international school belt.",
  },
];

export function MonthlyBudgetGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💰 Cost of living Bangkok — monthly breakdown
      </div>
      <div className="space-y-3">
        {BUDGETS.map((b) => (
          <div key={b.type} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xl">{b.emoji}</span>
                <span className="font-bold text-xs">{b.type}</span>
              </div>
              <div className="text-right">
                <div className="font-mono font-black text-sm text-orange-600">{b.monthly}</div>
                <div className="text-[10px] text-[var(--muted)]">{b.usd}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 mb-1.5">
              {b.breakdown.map((item) => (
                <div key={item.item} className="flex items-center justify-between gap-1 text-[10px] bg-gray-50 rounded px-2 py-1">
                  <span className="text-[var(--muted)] truncate">{item.item}</span>
                  <span className="font-mono font-bold text-[var(--fg)] shrink-0">{item.cost}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-[var(--muted)] italic">{b.note}</div>
          </div>
        ))}
      </div>
      <a
        href="/activities/digital-nomad"
        className="mt-3 block text-center text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-full py-1.5 hover:bg-orange-100 transition"
      >
        Full digital nomad guide Bangkok →
      </a>
    </div>
  );
}
