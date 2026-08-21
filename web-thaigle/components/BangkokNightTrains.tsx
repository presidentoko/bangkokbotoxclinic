const ROUTES = [
  {
    dest: "Chiang Mai",
    emoji: "🏔️",
    trainHours: "12–15 hr (overnight)",
    price: "฿531 (2nd class sleeper) / ฿1,200–1,600 (1st class)",
    departs: "Hua Lamphong Station 18:00–20:00",
    arrives: "Chiang Mai early morning 07:00–09:30",
    why: "Best overnight train in Thailand. Sleep on the train, arrive fresh. Saves one night's accommodation.",
    book: "Thai Railways website (thaiticketmajor.com) or Klook 1–2 months in advance",
  },
  {
    dest: "Surat Thani (for Koh Samui / Koh Phangan)",
    emoji: "🏝️",
    trainHours: "10–12 hr (overnight)",
    price: "฿581–831 (sleeper)",
    departs: "Hua Lamphong 17:30–20:00",
    arrives: "Surat Thani 05:00–08:00, then ferry 1–2hr",
    why: "Cheapest and most adventurous way to island-hop from Bangkok. Combined train+ferry ticket available.",
    book: "Thai Railways + ferry combo from travel agents near Hua Lamphong (Lumpin Pier area)",
  },
  {
    dest: "Hat Yai / Malaysia Border",
    emoji: "🇲🇾",
    trainHours: "14–18 hr (overnight)",
    price: "฿1,031–1,381 (1st class sleeper with meals)",
    departs: "Hua Lamphong 14:20 or 17:05",
    arrives: "Hat Yai next day, or Butterworth Malaysia with Thai-Malay interchange",
    why: "If going overland to Malaysia, overnight train beats budget airline when you factor terminal time.",
    book: "Thai Railways website, must book 1–2 months ahead for 1st class",
  },
  {
    dest: "Kanchanaburi (Death Railway — Day Trip)",
    emoji: "🌉",
    trainHours: "2.5 hr (day train only, 7:45am departure)",
    price: "฿100 3rd class",
    departs: "Thonburi Station (not Hua Lamphong) 07:45",
    arrives: "Kanchanaburi 10:30",
    why: "Iconic day trip on the Death Railway WWII historical route. Best value scenic train ride in Thailand.",
    book: "Buy at station day of. Arrive Thonburi Station 7am.",
  },
];

export function BangkokNightTrains() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🚂 Bangkok trains — overnight + scenic routes
      </h2>
      <div className="space-y-2">
        {ROUTES.map((r) => (
          <details key={r.dest} className="border border-slate-200 rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-slate-800 transition">
              <span className="text-lg shrink-0">{r.emoji}</span>
              <span className="flex-1">→ {r.dest}</span>
              <span className="text-[10px] font-mono text-green-700 shrink-0">{r.price.split(" ")[0]}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1.5">
              <div className="text-[10px]">⏱️ {r.trainHours} · 🚉 Departs: {r.departs} · 📍 Arrives: {r.arrives}</div>
              <div className="text-[10px] text-[var(--fg)] leading-snug">{r.why}</div>
              <div className="text-[10px]"><span className="font-bold">Price:</span> {r.price}</div>
              <div className="text-[10px] text-orange-600">📱 Book: {r.book}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
