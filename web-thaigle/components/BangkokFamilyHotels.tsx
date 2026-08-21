const HOTELS = [
  {
    name: "Centara Grand at CentralWorld",
    emoji: "🏨",
    area: "Siam / Ratchaprasong",
    price: "฿4,000–9,000/night",
    stars: 5,
    why: "Directly connected to CentralWorld Mall. Rooftop pool. Kids club with day-long programs (฿500/child). Best location for BTS access.",
    kidFriendly: ["Kids club", "Family rooms (2 bedrooms)", "Pool with kids zone", "Connected to mall for rainy days"],
  },
  {
    name: "Chatrium Hotel Riverside",
    emoji: "🌊",
    area: "Riverside / Charoen Nakhon",
    price: "฿3,000–7,000/night",
    stars: 5,
    why: "Large river-view pool perfect for families. Hotel shuttle boat to central Bangkok. Kids enjoy the river boat rides.",
    kidFriendly: ["Large pool + water slides", "River views from rooms", "ICONSIAM mall (5 min boat)", "Spacious suites"],
  },
  {
    name: "Hyatt Regency Bangkok Sukhumvit",
    emoji: "🌟",
    area: "Sukhumvit / Nana BTS",
    price: "฿4,500–10,000/night",
    stars: 5,
    why: "Best for families who want BTS walkability. Connecting family rooms available. Rooftop pool. Walking distance to Terminal 21.",
    kidFriendly: ["BTS walkable", "Connecting rooms", "Family breakfast buffet", "Kids menu at all restaurants"],
  },
  {
    name: "Ibis Bangkok Siam",
    emoji: "💡",
    area: "Siam BTS (central)",
    price: "฿1,500–3,000/night",
    stars: 3,
    why: "Budget pick — best location in Bangkok at this price. 1 min walk to Siam BTS. Family rooms available. No pool.",
    kidFriendly: ["Family rooms", "Siam area walkability", "Close to Siam Paragon", "Free breakfast option"],
  },
];

export function BangkokFamilyHotels() {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        👨‍👩‍👧 Bangkok family hotels — kid-friendly picks
      </h2>
      <div className="space-y-2">
        {HOTELS.map((h) => (
          <div key={h.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{h.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{"⭐".repeat(h.stars)} · {h.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{h.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1.5 leading-snug">{h.why}</div>
            <div className="flex flex-wrap gap-1">
              {h.kidFriendly.map((k) => (
                <span key={k} className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">{k}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
