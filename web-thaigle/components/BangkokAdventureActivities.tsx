const ACTIVITIES = [
  {
    name: "Flight of the Gibbon Zipline (Chiang Mai)",
    emoji: "🦅",
    distance: "1 hour flight from Bangkok (or overnight train)",
    price: "฿3,500–5,000 per person, full day",
    why: "Southeast Asia's most acclaimed zipline experience. 3km of cables through old growth rainforest canopy, 34 platforms. Encounter wild gibbons in their natural habitat while zipping at 60kph.",
    tip: "Combines zipline with jungle walk and waterfall visit. Must book 2+ days ahead. Weight limit 120kg. Height 120cm minimum. Recommended as Chiang Mai's #1 activity.",
  },
  {
    name: "Dinosaur Planet (Pattaya) — ATV + Zipline",
    emoji: "🦕",
    distance: "2 hours from Bangkok",
    price: "ATV 30min ฿500, Zipline ฿700",
    why: "Theme park meets adventure park. ATV trails through jungle, ziplines, and dinosaur park (yes, really). More family-friendly and accessible than serious jungle ziplines. Good for groups with mixed ages.",
    tip: "2-hour drive south of Bangkok — easy half-day trip if combining with Pattaya. Book online for 15% discount. Helmets and safety equipment provided.",
  },
  {
    name: "Bungy Jumping (Pattaya or Koh Samui)",
    emoji: "🪂",
    distance: "2–9 hours from Bangkok depending on location",
    price: "฿1,800–2,500 for 1 jump",
    why: "Thailand has several bungy jump sites operated by reputable New Zealand operators. Pattaya: closest to Bangkok. Koh Samui: most scenic setting over the ocean.",
    tip: "Jungle Bungy Pattaya and Samui Bungy are both Kiwi-owned — highest safety standards. Videos and photos available. All-inclusive: photo package, video, t-shirt.",
  },
  {
    name: "Rock Climbing (Railay Beach / Krabi)",
    emoji: "🧗",
    distance: "1 hour flight Bangkok–Krabi + speedboat",
    price: "Half-day intro climbing ฿1,200–1,800",
    why: "Railay Beach has world-class limestone sport climbing — consistently ranked top 10 globally. Beachside crags, multiple difficulty levels, warm water at the base. Unique setting.",
    tip: "No experience needed for intro sessions — instructors provide all equipment. Tonsai Beach: harder routes for experienced climbers. Railay: more accessible mixed levels.",
  },
];

export function BangkokAdventureActivities() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🦅 Adventure activities from Bangkok — ziplines, ATV, bungy, climbing
      </h2>
      <div className="space-y-2">
        {ACTIVITIES.map((a) => (
          <div key={a.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{a.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{a.distance}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{a.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{a.why}</div>
            <div className="text-[10px] text-orange-700">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
