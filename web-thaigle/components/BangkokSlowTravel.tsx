const PRACTICES = [
  {
    title: "Morning Market Ritual",
    emoji: "🌅",
    time: "6–9am",
    description: "Bangkok's fresh markets operate before the heat builds. Or Tor Kor Market (opposite Chatuchak) is the premium option. Khlong Toei Market is the largest local market. Pak Khlong Talat (flower market) is magical pre-dawn. Don't buy — just walk, smell, observe.",
    why: "Seeing locals shop tells you more about Thai food culture than any restaurant. Vendors call out prices, aunties squeeze vegetables, stalls transform through the morning.",
  },
  {
    title: "Chao Phraya River Slow Boat",
    emoji: "⛵",
    time: "Any time, best morning or sunset",
    description: "Take the Chao Phraya Express Boat (orange flag) from any pier. No destination. Get on, watch the city pass — Golden Mount, Wat Pho, Wat Arun, temples, communities, workers. Get off anywhere that looks interesting. Re-board. Entire day costs ฿40.",
    why: "The river shows Bangkok's real layers — luxury hotels behind colonial warehouses, monks on longtail boats, children swimming where cargo ships pass. Impossible to see from street level.",
  },
  {
    title: "Neighborhood Walking: Bang Rak / Charoen Krung",
    emoji: "🚶",
    time: "Late afternoon (4–7pm best)",
    description: "Bangkok's oldest foreign quarter. Walk from Central Pier south along Charoen Krung Road. Art galleries, Portuguese church, old Chinese shop-houses, hole-in-the-wall noodle shops, River City antiques. Side streets to Bangrak Bazaar.",
    why: "This is Bangkok before Sukhumvit existed. Charoen Krung Road has 150 years of cosmopolitan history compressed into a 2km walk. Few tourists, authentic street food, beautiful architecture decay.",
  },
  {
    title: "Afternoon Temple Circuit (Off-Peak)",
    emoji: "🙏",
    time: "1–4pm (less crowded than morning)",
    description: "Major temples get crowded before noon. Visit Wat Suthat, Wat Ratchanatdaram, Wat Saket (Golden Mount) between 1–4pm — fewer crowds, same beauty. Pack a water bottle, wear a sarong (available to borrow). No rush.",
    why: "Midday in temples is quiet. Monks meditate, flowers are freshest, light is different. The walk between temples through old Bangkok neighborhoods is as interesting as the temples themselves.",
  },
];

export function BangkokSlowTravel() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🌿 Slow travel Bangkok — morning markets, river boats & neighborhood walks
      </div>
      <div className="space-y-2">
        {PRACTICES.map((p) => (
          <div key={p.title} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{p.title}</div>
                <div className="text-[10px] text-[var(--muted)]">{p.time}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.description}</div>
            <div className="text-[10px] text-teal-700 italic">{p.why}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
