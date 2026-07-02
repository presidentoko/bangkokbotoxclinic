const SPOTS = [
  {
    name: "Boulder Thailand — Indoor Bouldering",
    emoji: "🧗",
    area: "Ratchathewi (near MBK) + Thonglor branch",
    price: "Day pass ฿350–450; Monthly ฿1,800–2,500",
    why: "Boulder Thailand is Bangkok's largest and best-regarded indoor bouldering gym — dedicated bouldering (no ropes, walls up to 4.5m) with problems reset regularly, training area, and a social atmosphere popular with young Bangkokians and expats. The Ratchathewi location is central and accessible from BTS. New problems set weekly mean regulars have fresh challenges. Bangkok's indoor climbing scene grew rapidly after 2020.",
    tip: "Rental shoes available (฿80–100/day). First visit: try V0–V2 problems to assess your level, then move up. The bouldering community in Bangkok is welcoming to beginners — other climbers will spot you and give beta (technique advice) unsolicited. Best time: weekday evenings (7–10pm) for the most community atmosphere but more crowded.",
  },
  {
    name: "The Rock Bangkok — Lead & Top-Rope Climbing",
    emoji: "⛰️",
    area: "Multiple locations — Pinklao, On Nut",
    price: "Day pass ฿350; Rental gear ฿150; PADI-style certification ฿2,500–4,000",
    why: "For rope climbing (lead and top-rope), The Rock Bangkok has the tallest walls in central Bangkok — up to 15m. Both lead climbing and auto-belay top-rope are available. Beginner courses (belay certification, introductory courses) run regularly. The staff are climbing-focused and instructor quality is reliable. Bangkok's rope climbing scene feeds into Krabi outdoor climbing trips — many Bangkok climbers use the city gym to train for Tonsai and Railay climbing.",
    tip: "Lead climbing requires belay certification — typically a 1-day course at most gyms (฿500–800). Auto-belay top-rope requires no certification and is good for solo sessions. The Bangkok climbing community organizes regular trips to Krabi (Railay/Tonsai beaches) which have some of the world's best limestone sport climbing — meet people at city gyms to find climbing partners for the trip.",
  },
  {
    name: "Outdoor Climbing — Khao Yai & Saraburi",
    emoji: "🏔️",
    area: "Khao Yai National Park (2.5 hrs), Saraburi province (1.5 hrs)",
    price: "Day permit ฿200–600; Guide optional ฿500–1,500",
    why: "Within 2–3 hours of Bangkok, Khao Yai National Park and limestone crags in Saraburi province offer outdoor sport climbing without travel to Krabi. Less famous than Tonsai/Railay, but accessible as a Bangkok weekend activity. Routes range from 5.9 to 5.13+ on limestone with bolted protection. Best seasons: October–February (cooler, dry). Bangkok climbers drive out Saturday morning and return Sunday evening.",
    tip: "Outdoor climbing near Bangkok requires a guide for first visits — the approach trails are unmarked and conditions vary. Bangkok climbing Facebook groups coordinate weekend outdoor trips — search 'Thailand Rock Climbing' on Facebook. Saraburi's climbing areas are near the Talueng and Naresuan caves — some require permission from local authorities in advance.",
  },
];

export function BangkokRockClimbing() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🧗 Rock climbing in Bangkok — bouldering gyms, rope walls & outdoor day trips
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-stone-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
