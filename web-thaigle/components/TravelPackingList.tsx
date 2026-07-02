const CATEGORIES = [
  {
    label: "Essentials",
    emoji: "🎒",
    items: [
      "Passport + 1 extra photocopy",
      "Travel insurance docs (digital + print)",
      "Cash: ฿2,000–5,000 on arrival",
      "Unlocked phone for Thai SIM",
    ],
  },
  {
    label: "Weather gear",
    emoji: "🌦️",
    items: [
      "Compact umbrella (rains without warning)",
      "Light breathable clothing only",
      "SPF 50+ sunscreen",
      "Hat or cap for outdoor sightseeing",
    ],
  },
  {
    label: "Temple visits",
    emoji: "🏛️",
    items: [
      "Shoulders-covering layer (sarong or scarf)",
      "Long pants or skirt (knee-length+)",
      "Slip-on shoes (easy to remove)",
    ],
  },
  {
    label: "Health & comfort",
    emoji: "💊",
    items: [
      "Stomach meds (Imodium + antacids)",
      "Hand sanitizer & wipes",
      "Electrolyte tablets (for heat)",
      "Mosquito repellent (DEET 20%+)",
    ],
  },
];

export function TravelPackingList() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🎒 Bangkok packing list
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((c) => (
          <div key={c.label} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span>{c.emoji}</span>
              <span className="text-xs font-bold">{c.label}</span>
            </div>
            <ul className="space-y-1">
              {c.items.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[10px] text-[var(--muted)]">
                  <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5 border border-[var(--border)]">
        <strong>Skip:</strong> Hair dryer (hotels have one), adapter (Type A/B same as US/Japan), heavy clothes (buy anything cheap in Bangkok)
      </div>
    </div>
  );
}
