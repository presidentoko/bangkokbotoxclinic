const TRIPS = [
  {
    dest: "Kanchanaburi",
    emoji: "🌉",
    km: "130km west",
    transport: "Train from Thonburi Station ฿100, 2.5hrs",
    highlights: ["Bridge on the River Kwai", "Hellfire Pass (WWII museum)", "Erawan waterfall (7-tier)"],
    cost: "฿400–800/person full day",
    best: "History + nature combo",
  },
  {
    dest: "Damnoen Saduak Floating Market",
    emoji: "🛶",
    km: "90km southwest",
    transport: "Minivan from Victory Monument ฿100, 1.5hrs",
    highlights: ["Boat market with fresh produce", "Thai-style boat rowing", "Longtail boat hire"],
    cost: "฿300–600/person",
    best: "Classic tourist experience",
  },
  {
    dest: "Amphawa Canal",
    emoji: "🌿",
    km: "75km southwest",
    transport: "Bus from Southern Bus Terminal ฿60, 2hrs",
    highlights: ["Floating market (Fri–Sun evenings)", "Firefly watching at dusk", "Local seafood"],
    cost: "฿200–400/person",
    best: "More local than Damnoen Saduak",
  },
  {
    dest: "Koh Kret Island",
    emoji: "🌺",
    km: "30km north",
    transport: "Grab to Nonthaburi Pier ฿200 + ferry ฿2, 1hr",
    highlights: ["Mon community pottery", "No cars on the island", "Ancient temples", "Local food market"],
    cost: "฿200–400/person",
    best: "Hidden local escape in Bangkok",
  },
  {
    dest: "Hua Hin Beach",
    emoji: "🏖️",
    km: "230km south",
    transport: "Train from Hua Lamphong ฿100, 3.5hrs OR minivan ฿200, 3hrs",
    highlights: ["Royal residence resort town", "Hua Hin night market", "Khao Sam Roi Yot NP (caves)"],
    cost: "฿500–1,000/person",
    best: "Beach day trip, Thai royal town vibe",
  },
];

export function BangkokDayTripsExpanded() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🗺️ Day trips from Bangkok — 5 more options
      </div>
      <div className="space-y-2">
        {TRIPS.map((t) => (
          <div key={t.dest} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{t.emoji}</span>
              <div>
                <div className="font-bold text-xs">{t.dest}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.km} · 🚌 {t.transport}</div>
              </div>
            </div>
            <div className="space-y-0.5 mb-1">
              {t.highlights.map((h) => (
                <div key={h} className="text-[10px] flex gap-1.5 items-start">
                  <span className="shrink-0 text-orange-500">▸</span>{h}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1">
              <span className="text-green-700 font-medium">฿{t.cost}</span>
              <span className="text-blue-600">{t.best}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
