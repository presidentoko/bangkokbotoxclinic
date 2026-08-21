const SCAMS = [
  {
    name: "Tuk-tuk temple tour scam",
    emoji: "🛺",
    how: "Friendly driver says 'temple closed today, I take you to special place.' Destination is a jewelry shop that pays the driver commission.",
    avoid: "Never follow drivers to 'alternatives.' Look up temple hours yourself. Walk away immediately.",
    risk: "Very common",
  },
  {
    name: "Gem / jewelry store scam",
    emoji: "💎",
    how: "You're told the government is having a 'once a year gem sale' at huge discounts. Gems are fakes or massively overpriced.",
    avoid: "Never buy gems or jewelry from anyone you met an hour ago. No exceptions.",
    risk: "Very common",
  },
  {
    name: "Pad Thai on Khao San road",
    emoji: "🍜",
    how: "Not a crime — just poor value. ฿200–฿350 pad thai that tastes worse than a ฿60 street version 200m away.",
    avoid: "Walk one street off Khao San. Rambuttri Rd has actual Thai-priced food.",
    risk: "Tourist trap",
  },
  {
    name: "Unlicensed taxi at the airport",
    emoji: "🚕",
    how: "Touts approach you before the official taxi queue: 'fixed price ฿800 / ฿1,000.' Legitimate taxi meter is ฿200–฿350.",
    avoid: "Use ONLY the official public taxi queue at the airport (follow green signs). Insist on 'meter'.",
    risk: "Very common",
  },
  {
    name: "Grand Palace closed scam",
    emoji: "🏛️",
    how: "Man approaches near temple: 'Palace closed today, special ceremony.' Takes you to travel agency or shop.",
    avoid: "The Grand Palace is NEVER closed to tourists during opening hours (8:30am–3:30pm). Walk in.",
    risk: "Very common",
  },
  {
    name: "Long-tail boat overcharge",
    emoji: "⛵",
    how: "Private long-tail boat tour quoted at ฿1,500–฿2,000 for a route worth ฿200 on public Chao Phraya ferry.",
    avoid: "Use the official Chao Phraya Express ferry (orange/green flag). Agree price firmly before boarding any private boat.",
    risk: "Common at tourist piers",
  },
];

const RISK_COLOR: Record<string, string> = {
  "Very common": "text-red-700 bg-red-100",
  "Tourist trap": "text-amber-700 bg-amber-100",
  "Common at tourist piers": "text-orange-700 bg-orange-100",
};

export function BangkokScamAlert() {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        ⚠️ Bangkok tourist scams to avoid
      </h2>
      <div className="space-y-2">
        {SCAMS.map((s) => (
          <div key={s.name} className="bg-white border border-red-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xl">{s.emoji}</span>
              <span className="font-bold text-xs">{s.name}</span>
              <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded ${RISK_COLOR[s.risk]}`}>{s.risk}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-1 leading-snug">{s.how}</div>
            <div className="text-[10px] text-green-700 font-medium leading-snug">✓ {s.avoid}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-red-700">
        Tourist Police (English-speaking): <strong>1155</strong> (24/7)
      </div>
    </div>
  );
}
