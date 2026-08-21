const HOTELS = [
  {
    name: "AVANI+ Riverside Bangkok",
    emoji: "🏊",
    area: "Charoen Nakhon (Chao Phraya River)",
    price: "Rooms from ฿6,000/night. Pool day pass ฿1,500.",
    pool: "Infinity pool overlooking Chao Phraya River and Bangkok skyline. 33m long.",
    why: "Best river-view infinity pool in Bangkok. Sunset views across the river. Bar service poolside.",
    tip: "Non-guest pool day pass ฿1,500 (includes ฿500 food/drink credit). Book via hotel directly. Max 50 day-pass guests.",
  },
  {
    name: "The Okura Prestige Bangkok",
    emoji: "🌆",
    area: "Ploenchit BTS area, above Central Embassy",
    price: "Rooms from ฿12,000/night. Pool access: guests only.",
    pool: "25m outdoor pool on 26th floor with unobstructed city panorama.",
    why: "Most prestigious address in Bangkok for pool swimming. Used by the who's who of Bangkok business. Impeccable service.",
    tip: "Guests only — no day passes. The Sunday brunch (฿2,500/person) includes pool access after 2pm.",
  },
  {
    name: "Sky Hostel Rooftop Pool",
    emoji: "💰",
    area: "Near Phaya Thai BTS (budget option)",
    price: "฿500–600/night dorm. Pool included.",
    pool: "Rooftop plunge pool with Bangkok skyline. Small but exclusive to hostel guests.",
    why: "Best budget option for rooftop pool experience in Bangkok. Popular with backpackers wanting Instagram shots without ฿6,000/night spend.",
    tip: "Book 3–5 days ahead for weekend nights. Pool gets crowded evenings but quiet afternoons.",
  },
  {
    name: "Hyatt Regency Bangkok Sukhumvit",
    emoji: "⭐",
    area: "Sukhumvit 13 (Asok/Nana BTS)",
    price: "Rooms from ฿8,000/night. Pool day pass ฿800 (limited availability).",
    pool: "52m outdoor pool with Sukhumvit skyline views. Heated year-round.",
    why: "Longest outdoor pool in Sukhumvit area. Family-friendly, central location, great Grab/BTS access.",
    tip: "Pool day passes sell out on weekends. Email concierge@hyattregency.com to pre-book. Minimum spend on F&B.",
  },
];

export function BangkokRooftopPoolHotels() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🏊 Bangkok rooftop pool hotels — swim with skyline views
      </h2>
      <div className="space-y-2">
        {HOTELS.map((h) => (
          <div key={h.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{h.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{h.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{h.price}</span>
            </div>
            <div className="text-[10px] text-sky-700 mb-0.5">🏊 Pool: {h.pool}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{h.why}</div>
            <div className="text-[10px] text-orange-600">💡 {h.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
