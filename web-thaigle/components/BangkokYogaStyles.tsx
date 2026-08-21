const STYLES = [
  {
    style: "Hot Yoga (Bikram / 26+2)",
    emoji: "🔥",
    temp: "38–42°C",
    best: "Detox, flexibility, weight loss",
    studios: ["Absolute You (Sukhumvit)", "All Studio (Thonglor)", "Yoga Space Bangkok"],
    price: "฿350–700/class",
    tip: "Bring a towel, change of clothes, and 1.5L water. Arrive 15 min early for first class.",
  },
  {
    style: "Ashtanga Vinyasa",
    emoji: "🧘",
    temp: "Room temp",
    best: "Athletic progression, self-practice",
    studios: ["Bangkok Yoga Center (Sukhumvit 22)", "Ashtanga Yoga Bangkok (Silom)"],
    price: "฿400–600/class",
    tip: "Mysore-style self-practice available at most studios — suitable for experienced practitioners only.",
  },
  {
    style: "Yin Yoga / Restorative",
    emoji: "🌙",
    temp: "Cool room",
    best: "Stress relief, deep tissue, flexibility",
    studios: ["The Yoga Studio (Thonglor)", "Evolve MMA (wellness floor)", "Sukhumvit yoga boutiques"],
    price: "฿280–550/class",
    tip: "Best for tight hamstrings and hip flexors from too much sitting. Evening classes very popular.",
  },
  {
    style: "Kundalini / Breathwork",
    emoji: "⚡",
    temp: "Room temp",
    best: "Energy work, meditation, spiritual",
    studios: ["Bangkok Breathwork Collective (online + pop-ups)", "The Sanctuary Bangkok"],
    price: "฿400–800/session",
    tip: "Niche but growing. Check Facebook groups for 'Bangkok Breathwork' for current events.",
  },
];

export function BangkokYogaStyles() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🧘 Bangkok yoga styles — which is right for you?
      </h2>
      <div className="space-y-2">
        {STYLES.map((s) => (
          <div key={s.style} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl">{s.emoji}</span>
              <div>
                <div className="font-bold text-xs">{s.style}</div>
                <div className="text-[10px] text-[var(--muted)]">🌡️ {s.temp} · Best: {s.best}</div>
              </div>
              <span className="ml-auto text-xs font-mono font-black text-green-700 shrink-0">{s.price}</span>
            </div>
            <div className="text-[10px] text-blue-700 mb-1">Studios: {s.studios.join(" · ")}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
