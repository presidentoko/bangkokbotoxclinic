const TRIPS = [
  {
    destination: "Ayutthaya",
    emoji: "🏛️",
    distance: "80 km",
    travelTime: "1.5 hr train / 2 hr bus",
    cost: "฿20 train · ฿80 minibus",
    highlight: "Ancient capital, UNESCO ruins, floating market",
    tip: "Morning train from Hua Lamphong at 8am. Back by 5pm easily.",
    url: "/guide",
  },
  {
    destination: "Kanchanaburi",
    emoji: "🌉",
    distance: "130 km",
    travelTime: "2.5 hr train / 2 hr van",
    cost: "฿100 train · ฿180 minibus",
    highlight: "WWII bridge over River Kwai, Tiger Temple (closed), waterfalls",
    tip: "Take the Saturday/Sunday special train — scenic Bridge over River Kwai route.",
    url: "/guide",
  },
  {
    destination: "Koh Samet",
    emoji: "🏖️",
    distance: "200 km",
    travelTime: "3 hr van + 30 min ferry",
    cost: "฿250 van + ฿50 ferry",
    highlight: "White sand beaches, clear water, weekend escape",
    tip: "Book minivan from Ekkamai bus terminal. National park fee ฿200 on arrival.",
    url: "/guide",
  },
  {
    destination: "Pattaya",
    emoji: "🌊",
    distance: "147 km",
    travelTime: "2 hr bus/van",
    cost: "฿150 bus · ฿200 minivan",
    highlight: "Beach, water sports, Walking Street nightlife",
    tip: "Bus from Ekkamai every 30 min. Great for nightlife or watersports day.",
    url: "/guide",
  },
];

export function DayTripGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🗺️ Day trips from Bangkok
      </div>
      <div className="space-y-2">
        {TRIPS.map((t) => (
          <a key={t.destination} href={t.url} className="block border border-[var(--border)] rounded-xl p-3 hover:border-orange-300 hover:shadow-sm transition group">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.emoji}</span>
                <span className="font-bold text-xs group-hover:text-orange-700 transition">{t.destination}</span>
              </div>
              <div className="text-right text-[10px] text-[var(--muted)]">
                <div>{t.distance} · {t.travelTime}</div>
                <div className="font-mono font-bold text-green-700">{t.cost}</div>
              </div>
            </div>
            <div className="text-[11px] text-[var(--fg)] mb-1">{t.highlight}</div>
            <div className="text-[10px] text-orange-600">💡 {t.tip}</div>
          </a>
        ))}
      </div>
      <a
        href="/guide"
        className="mt-3 block text-center text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-full py-1.5 hover:bg-orange-100 transition"
      >
        All Bangkok day trip guides →
      </a>
    </div>
  );
}
