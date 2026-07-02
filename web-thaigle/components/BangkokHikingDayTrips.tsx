const TRIPS = [
  {
    name: "Khao Yai National Park",
    emoji: "🌳",
    distance: "200km from Bangkok (2.5–3 hrs by bus from Mo Chit)",
    price: "฿400 park entry + transport ฿200–600 return",
    hike: "Haew Narok Waterfall Trail (7.5km round trip, 4–5 hours)",
    why: "UNESCO World Heritage site. Wild elephants, hornbills, gibbons, wild pigs. Most accessible jungle in Thailand. Waterfalls stunning in rainy season.",
    tip: "Hire a local guide (฿1,500–2,500/day) — essential for wildlife spotting. Overnight stays available at park lodges.",
    best: "Rainy season (June–Oct) for lush green and full waterfalls. Dry season for easier trails.",
  },
  {
    name: "Erawan National Park (Kanchanaburi)",
    emoji: "🏞️",
    distance: "130km from Bangkok (2–2.5 hrs by bus from Ekkamai terminal)",
    price: "฿300 park entry + transport ฿200–400 return",
    hike: "7-tier Erawan Waterfall (2.5km each way — can do all 7 tiers or just tiers 1–3)",
    why: "Emerald-green tiered waterfalls. Swimming allowed in natural pools at most tiers. Fish that nibble your feet. Spectacular dry-season clarity.",
    tip: "Arrive early (8am opening) — parking and entry queue badly managed after 10am on weekends. Weekdays dramatically better.",
    best: "November–May dry season for clearest water colors.",
  },
  {
    name: "Kaeng Krachan National Park",
    emoji: "🦋",
    distance: "230km from Bangkok (3.5 hrs, Phetchaburi direction)",
    price: "฿300 park entry. Grab/car rental needed — no public transport.",
    hike: "Phanoen Thung peak trail (4km, 2 hrs ascent) for sea of mist view at sunrise",
    why: "Largest national park in Thailand. Sea of mist viewpoint at Phanoen Thung is Bangkok's most shared nature photo. Very few tourists compared to Khao Yai.",
    tip: "Overnight at park campsite or guesthouse for sunrise. Cloud inversion (sea of mist) is November–February phenomenon only.",
    best: "November–February for sea of mist.",
  },
];

export function BangkokHikingDayTrips() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🥾 Hiking day trips from Bangkok — nature escapes
      </div>
      <div className="space-y-2">
        {TRIPS.map((t) => (
          <details key={t.name} className="border border-teal-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-teal-50 transition">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.distance}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{t.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-teal-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{t.why}</div>
              <div className="text-[10px] text-teal-700">🥾 Trail: {t.hike}</div>
              <div className="text-[10px] text-orange-600">💡 {t.tip}</div>
              <div className="text-[10px] text-[var(--muted)]">📅 Best: {t.best}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
