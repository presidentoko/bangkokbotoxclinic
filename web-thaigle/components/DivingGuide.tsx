const LEVELS = [
  {
    emoji: "🐠",
    name: "Discover Scuba (DSD)",
    cert: "No cert needed",
    price: "฿1,500–2,500",
    what: "Half-day. Pool session + open water dive. Perfect for first-timers.",
    location: "Koh Tao, Pattaya (1–2 hr from Bangkok)",
  },
  {
    emoji: "🤿",
    name: "PADI Open Water (OW)",
    cert: "Entry cert",
    price: "฿8,000–14,000",
    what: "3–4 days. 4 open water dives. Certifies you to dive 18m worldwide for life.",
    location: "Koh Tao (best), Pattaya (closer, worse visibility)",
  },
  {
    emoji: "🌊",
    name: "Advanced Open Water",
    cert: "Upgrade your OW",
    price: "฿6,000–10,000",
    what: "2 days. Deep dive, navigation, 3 specialty dives. Extends depth to 30m.",
    location: "Koh Tao, Similan Islands (seasonal)",
  },
  {
    emoji: "🏆",
    name: "Full liveaboard trip",
    cert: "OW cert required",
    price: "฿8,000–20,000 (3–5 nights)",
    what: "Similan Islands or Andaman Sea. Best viz in Thailand, whale sharks in season.",
    location: "Depart Khao Lak or Phuket (flights from Bangkok ~1.5hr)",
  },
];

export function DivingGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🤿 Diving in Thailand — which level?
      </div>
      <div className="space-y-2">
        {LEVELS.map((l) => (
          <div key={l.name} className="flex gap-3 items-start p-3 rounded-xl border border-[var(--border)]">
            <span className="text-xl shrink-0 leading-none mt-0.5">{l.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-xs">{l.name}</span>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-bold shrink-0">{l.price}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 mb-0.5">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">{l.cert}</span>
              </div>
              <div className="text-[11px] text-[var(--muted)] leading-snug">{l.what}</div>
              <div className="text-[10px] text-[var(--muted)] mt-0.5">📍 {l.location}</div>
            </div>
          </div>
        ))}
      </div>
      <a
        href="/activities/diving"
        className="mt-3 block text-center text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 rounded-full py-1.5 hover:bg-blue-100 transition"
      >
        Find diving trips from Bangkok →
      </a>
    </div>
  );
}
