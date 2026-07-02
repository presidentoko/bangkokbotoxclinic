const TRIPS = [
  {
    name: "Erawan Falls — 7-tiered emerald waterfall",
    emoji: "💚",
    distance: "200km / 3 hrs from Bangkok",
    how: "Minivan from Mochit Bus Terminal (฿180) or tour from ฿900",
    season: "Year-round. Best water levels: July–November. Most beautiful: December–February.",
    admission: "฿300 for foreigners",
    highlight: "Tier 3 + Tier 7 are most iconic — fish nibble your feet in the pools.",
    tip: "Arrive before 8am to beat crowds. Bring eco-friendly sunscreen only (park rules). Full day trip.",
  },
  {
    name: "Huai Mae Khamin — 7 cascades near Kanchanaburi",
    emoji: "🏊",
    distance: "220km / 3.5 hrs",
    how: "Private car or tour. No direct public transport.",
    season: "October–February (clearest water, most falls)",
    admission: "฿200 foreigners",
    highlight: "Less crowded than Erawan. Similar emerald pools but more secluded.",
    tip: "Combine with Kanchanaburi Bridge on the River Kwai (30 min away) for a full day.",
  },
  {
    name: "Khao Yai National Park",
    emoji: "🐘",
    distance: "230km / 2.5 hrs",
    how: "Tour from Bangkok from ฿1,200 or self-drive",
    season: "November–February (cool, wildlife active). Waterfalls peak September–October.",
    admission: "฿400 foreigners + car ฿50",
    highlight: "Wild elephants, hornbills, gibbons, Haew Narok waterfall (3-tiered, 150m)",
    tip: "UNESCO World Heritage Site. Best wildlife at dawn/dusk — join a guided night safari (฿500).",
  },
];

export function BangkokWaterfallsDayTrips() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌿 Nature day trips from Bangkok
      </div>
      <div className="space-y-3">
        {TRIPS.map((t) => (
          <div key={t.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div>
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">📍 {t.distance} · {t.admission}</div>
              </div>
            </div>
            <div className="text-[10px] text-blue-700 mb-0.5">🚌 {t.how}</div>
            <div className="text-[10px] text-green-700 mb-0.5">🗓️ Best season: {t.season}</div>
            <div className="text-[10px] text-[var(--fg)] mb-1">⭐ {t.highlight}</div>
            <div className="text-[10px] text-orange-600">💡 {t.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
