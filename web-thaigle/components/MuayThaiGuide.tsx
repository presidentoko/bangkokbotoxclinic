const LEVELS = [
  {
    level: "Tourist session",
    emoji: "🎟️",
    price: "฿300–500",
    what: "1–2 hour padwork session. Gloves provided. No experience needed.",
    gyms: "Fairtex, Lumpinee Training, Tiger Muay Thai",
    bestFor: "Anyone curious, first-timers",
  },
  {
    level: "Day camp",
    emoji: "☀️",
    price: "฿1,000–1,500",
    what: "2 sessions (morning + afternoon). Full technical training, conditioning, sparring option.",
    gyms: "Kombat Group, MBK Fighting, Revolution Muay Thai",
    bestFor: "Fitness travelers, 1–2 week stay",
  },
  {
    level: "Intensive camp",
    emoji: "🏆",
    price: "฿15,000–25,000 / month",
    what: "Full immersion. 2 sessions/day, fighter diet, sparring with Thais, optional fight arrangement.",
    gyms: "Rawai Muay Thai, Sitjaopho, Kanisorn",
    bestFor: "Serious fighters, 1+ month stay",
  },
];

export function MuayThaiGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🥊 Which Muay Thai level is right for you?
      </div>
      <div className="space-y-3">
        {LEVELS.map((l) => (
          <div key={l.level} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{l.emoji}</span>
                <span className="font-bold text-xs">{l.level}</span>
              </div>
              <span className="text-xs font-mono text-orange-700 bg-orange-100 px-2 py-0.5 rounded font-bold">{l.price}</span>
            </div>
            <div className="text-[11px] text-[var(--muted)] leading-snug mb-1">{l.what}</div>
            <div className="text-[10px] text-[var(--muted)]">
              Example gyms: <span className="font-medium text-[var(--fg)]">{l.gyms}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5">Best for: <span className="font-medium">{l.bestFor}</span></div>
          </div>
        ))}
      </div>
      <a
        href="/activities/muay-thai"
        className="mt-3 block text-center text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-full py-1.5 hover:bg-orange-100 transition"
      >
        Find Muay Thai gyms →
      </a>
    </div>
  );
}
