const SPOTS = [
  {
    name: "Bangkrachao Island Kayak Tour",
    emoji: "🛶",
    area: "Bangkrachao 'Green Lung,' 30 min from Bangkok",
    price: "Kayak rental ฿200–400/hr; Tour ฿800–1,500 with guide",
    why: "Bangkrachao is Bangkok's green island — protected mangrove and tropical forest surrounded by a Chao Phraya bend. Kayaking through small canals within the island is the best way to experience it. Narrow waterways, floating markets, community life. No cars allowed inside.",
    tip: "Best done Sunday morning when the floating market is active (6–11am). Take BTS to Bang Na, then Grab to Klong Toei Pier, then passenger boat to Bangkrachao. Kayaks available at island entrance. Morning sessions before 11am to avoid heat. Guide recommended for first visit.",
  },
  {
    name: "Mangrove Kayak Tours (Day Trips)",
    emoji: "🌊",
    area: "Pak Nam Chumphon or Petchaburi (2–3h from Bangkok)",
    price: "Tour with transport ฿2,000–4,500 per person",
    why: "Organized day trips from Bangkok to mangrove forests along the Gulf of Thailand coast. Kayak through narrow mangrove tunnels (requires low-stroke paddling under branches), see monkeys, birds, and coastal ecosystems. Much better kayaking than Bangkok proper.",
    tip: "Book through Bangkok tour operators offering Gulf coast day trips. Combined with beach lunch makes a full day. Mangrove kayaking = harder paddle than open water (roots, narrow passages). Experience matters — complete beginners should do open water first.",
  },
  {
    name: "Chao Phraya River Stand-Up Paddleboard",
    emoji: "🏄",
    area: "Various Bangkok river piers (Asiatique, Sathorn area)",
    price: "SUP rental ฿400–800/hr; Lesson ฿1,200–2,500",
    why: "SUP on the Chao Phraya is an increasingly popular Bangkok activity. Several companies offer boards for rent near tourist piers. Less technical than kayaking but requires balance. Great view of Bangkok skyline from water level. Morning sessions calmer water.",
    tip: "SUP on Chao Phraya is affected by boat traffic waves — tourist boats create wake every 10–15 minutes. Learn basic SUP balance in calm water before venturing to main river. Life jacket mandatory. Closed-toe shoes or waterproof sandals essential.",
  },
];

export function BangkokCanoeing() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🛶 Kayaking & canoeing in Bangkok — canals, mangroves & river spots
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
