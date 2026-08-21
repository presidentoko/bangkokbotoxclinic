const STADIUMS = [
  {
    name: "Rajadamnern Stadium",
    emoji: "🏟️",
    area: "Ratchadamnoen Nok Rd, Old City",
    type: "Historic (opened 1945)",
    schedule: "Mon, Wed, Thu: 5:30pm; Sun: 4:30pm",
    tickets: "฿1,500 (3rd tier) / ฿2,000 (ringside 2nd tier) / ฿3,000 (VIP ringside)",
    why: "Older of Bangkok's two main stadiums. More authentic atmosphere, fewer tourists. Where Thai people go. The boxing here is often higher quality.",
    tip: "Arrive 30 min early for best ringside seats. VIP comes with commentary in English. Buy direct at box office — scalpers charge 2×.",
  },
  {
    name: "Lumpini Stadium",
    emoji: "🥊",
    area: "Ramindra Rd, Minburi (new location since 2014)",
    type: "Modern (relocated)",
    schedule: "Tue, Fri, Sat: 4:30pm (afternoons) + 8:30pm (evening sessions)",
    tickets: "฿1,000 (standing) / ฿2,000 (ringside) / ฿2,500 (VIP)",
    why: "The premier stadium for championship bouts. TV broadcasts from here. Slightly more tourist-friendly but still very authentic.",
    tip: "Further from city (40min taxi ฿200). Worth it for championship nights — check Bangkok Muay Thai schedule online.",
  },
  {
    name: "Channel 7 Stadium",
    emoji: "📺",
    area: "Bang Sue, Bangkok",
    type: "Free-entry TV studio",
    schedule: "Saturdays only (taping for Channel 7 broadcast)",
    tickets: "FREE (limited seating — arrive 8:30am for noon fights)",
    why: "Free Muay Thai at a real professional stadium. Broadcast to all Thailand. Incredible if you can get in.",
    tip: "Queue by 8am. Dress modestly. No food inside. Unbeatable experience for the price (฿0).",
  },
];

const WATCH_TIPS = [
  "Rounds are 3 min × 5 rounds + break (typically 6–8 bouts per night)",
  "Betting is shouted from ringside — fascinating to watch the system even if you don't participate",
  "Wai Kru dance before each fight — beautiful ritual, take time to watch it",
  "Thai classical music band accompanies every fight — live, atmospheric",
  "Early bouts (round 1–3): less intense. Main events (last 2 bouts): electrifying",
];

export function BangkokMuayThaiStadiums() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥊 Bangkok Muay Thai stadiums — watch live fights
      </h2>
      <div className="space-y-2 mb-4">
        {STADIUMS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.type}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.tickets.split(" ")[0]}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-1">🗓️ {s.schedule}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5">{s.why}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1.5">Watching tips</div>
      <div className="space-y-1">
        {WATCH_TIPS.map((t) => (
          <div key={t} className="text-[10px] flex gap-1.5">
            <span className="shrink-0 text-red-400">▸</span>
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
