const HOTELS = [
  {
    name: "Mandarin Oriental Bangkok",
    emoji: "🌹",
    view: "Direct Chao Phraya river view — original 1876 wing",
    price: "฿18,000–35,000/night",
    why: "The original Bangkok riverside hotel. Thai royal family connection. Garden + pool terrace.",
    access: "Free shuttle boat from hotel to central Bangkok piers",
  },
  {
    name: "Capella Bangkok",
    emoji: "✨",
    view: "360° panoramic river view — most modern riverside hotel",
    price: "฿22,000–50,000/night",
    why: "Most impressive new luxury. Infinity pool over river. Every room has a terrace.",
    access: "Hotel boat to Saphan Taksin BTS in 5 min",
  },
  {
    name: "Anantara Riverside Bangkok",
    emoji: "🌴",
    view: "Long riverside garden stretch — most garden space",
    price: "฿6,000–15,000/night",
    why: "Best value riverside luxury. Massive garden. Multiple restaurants. Feels like a resort.",
    access: "Free boat every 30 min to Saphan Taksin BTS",
  },
  {
    name: "Riva Surya Bangkok (Boutique)",
    emoji: "🏖️",
    view: "Boutique, no direct river view but riverside location",
    price: "฿3,000–6,000/night",
    why: "Best value boutique near the river. Close to Khao San Road. Terrace pool + bar.",
    access: "Walk to Phra Athit pier (5 min). River boat access.",
  },
  {
    name: "The Peninsula Bangkok",
    emoji: "🏛️",
    view: "East bank river view — directly opposite Mandarin Oriental",
    price: "฿14,000–30,000/night",
    why: "White glove service. Unique: east bank of river = quieter, best sunset views facing west.",
    access: "Private hotel ferry to Charoen Krung area (west bank)",
  },
];

export function BangkokChaoPhrayaHotels() {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🌊 Chao Phraya riverside hotels — best river views
      </h2>
      <div className="space-y-2">
        {HOTELS.map((h) => (
          <div key={h.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{h.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">🌊 {h.view}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{h.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5">{h.why}</div>
            <div className="text-[10px] text-blue-700">🚢 {h.access}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
