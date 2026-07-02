const STADIUMS = [
  {
    name: "Rajadamnern Stadium (ราชดำเนิน)",
    emoji: "🥊",
    area: "Rajadamnern Nok Ave, Old Bangkok (near Khao San)",
    price: "Standing ฿1,000, Ringside ฿2,000–2,500, VIP ฿3,000",
    schedule: "Monday, Wednesday, Thursday, Sunday — multiple fights from 6:30pm",
    why: "Bangkok's historic Muay Thai stadium since 1945. The traditional, gritty, authentic stadium experience. Local Thai crowd majority.",
    tip: "Standing section is cheapest and most atmospheric — stand with Thai fans. Ringside if you want close fights. Don't buy tickets from touts.",
    buy: "Buy tickets at stadium box office 1–2 hours before fight. VIP can book online at rajadamnern.com.",
  },
  {
    name: "Lumpinee Boxing Stadium (ลุมพินี)",
    emoji: "🏆",
    area: "Ram Indra Road (near Victory Monument → 20 min Grab)",
    price: "Standing ฿1,500, Ringside ฿2,500, VIP ฿4,000",
    schedule: "Tuesday, Friday, Saturday — doors open 6pm",
    why: "Muay Thai's most prestigious venue. Fighters who win here are considered champions. Higher-level fights than Rajadamnern on average.",
    tip: "Newer facility (moved to new location 2012). Same traditional atmosphere. Take Grab from BTS Victory Monument.",
    buy: "Stadium box office. Online at muaytailumpinee.net. Tourist tickets often 2× Thai price at window — negotiate politely.",
  },
];

const ETIQUETTE = [
  "Stand/sit on your section — foreigners assigned specific areas.",
  "Betting is happening around you (complex Thai system) — don't get involved unless you understand it.",
  "Shout and cheer — the stadium energy is part of the experience. 'Oi oi oi!' is the crowd encouragement.",
  "Photography allowed from all sections. Flash is fine — fighters are used to it.",
  "Bring cash — drinks inside are reasonably priced (Singha beer ฿80–100).",
  "Arrive 30–45 min early for good standing position. Preliminary fights start at 6:30pm.",
];

export function BangkokMuayThaiWatch() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥊 Watch Muay Thai in Bangkok — stadiums & what to expect
      </div>
      <div className="space-y-2 mb-3">
        {STADIUMS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.schedule}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700 text-right max-w-[90px]">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700 mb-0.5">💡 {s.tip}</div>
            <div className="text-[10px] text-orange-600">🎫 {s.buy}</div>
          </div>
        ))}
      </div>
      <div className="border border-red-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-red-700 mb-1.5">🏟️ Stadium etiquette</div>
        <ul className="space-y-0.5">
          {ETIQUETTE.map((e, i) => (
            <li key={i} className="text-[10px] text-[var(--fg)] leading-snug flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
