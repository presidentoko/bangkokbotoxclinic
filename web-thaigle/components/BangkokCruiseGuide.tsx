const CRUISES = [
  {
    name: "Chao Phraya River Express (Commuter Boat)",
    emoji: "🚢",
    type: "Public ferry — local experience",
    duration: "20 min–1.5 hrs depending on route",
    price: "฿16–32 per ride (local commuter, no tourist fare)",
    highlights: ["Passes Wat Arun", "Wat Pho area piers", "Asiatique area", "Grand Palace riverside"],
    departs: "Sathorn Pier (S1) — every 15–20 min, 6am–8pm",
    tip: "Flag the correct boat color at the pier. Orange flag = all stops. Yellow = express. Tourists often take tourist boat (฿180/day hop-on-hop-off) — both go the same places.",
  },
  {
    name: "Asiatique Klook Sunset Dinner Cruise",
    emoji: "🌅",
    type: "Tourist dinner cruise",
    duration: "2 hrs (7:30–9:30pm)",
    price: "฿1,200–1,800/person including dinner",
    highlights: ["Buffet Thai + international dinner", "Pass under Taksin Bridge lit up", "Skyline of Bangkok at night", "Live entertainment onboard"],
    departs: "Asiatique Pier (nightly)",
    tip: "Best value dinner cruise. Book Klook for 20–30% discount vs walk-up. Arrive 30 min early to choose a window seat.",
  },
  {
    name: "Manohra Song Luxury Rice Barge",
    emoji: "⚓",
    type: "Luxury teak rice barge — sunset cruise",
    duration: "3 hrs (5:30–8:30pm)",
    price: "฿3,200/person dinner + cruise",
    highlights: ["100-year-old restored teak barge", "Thai set dinner of royal cuisine", "Private, small capacity (~30 guests)", "Bangkok Marriott operated"],
    departs: "Marriott Hotel pier, Charoen Nakhon",
    tip: "Most memorable dinner experience in Bangkok. Best for anniversaries. Book weeks ahead — only a few departures per week.",
  },
  {
    name: "Khlong Canal Tour (Bangkok Yai + Noi)",
    emoji: "🛶",
    type: "Long-tail private boat tour",
    duration: "1.5–3 hrs",
    price: "Private boat ฿1,000–1,500/hr. Group tours from ฿500/person",
    highlights: ["Wat Phra Kaew from the water", "Floating market glimpses", "100-year-old canal communities", "Royal barge museum"],
    departs: "Tha Chang or Phra Athit piers",
    tip: "Negotiate at the pier or pre-book via tour apps. Wear sunscreen. Best in morning (less traffic).",
  },
];

export function BangkokCruiseGuide() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🚢 Bangkok river & canal tours compared
      </div>
      <div className="space-y-3">
        {CRUISES.map((c) => (
          <div key={c.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.type} · {c.duration}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono font-black text-green-700">{c.price}</span>
            </div>
            <div className="space-y-0.5 mb-1.5">
              {c.highlights.map((h) => (
                <div key={h} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-blue-500">▸</span>{h}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-0.5">📍 Departs: {c.departs}</div>
            <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
