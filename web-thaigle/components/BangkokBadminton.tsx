const COURTS = [
  {
    name: "Major Badminton Halls (Multiple Locations)",
    emoji: "🏸",
    area: "Citywide — Rama 9, Ramkhamhaeng, Ladprao areas",
    price: "Court rental ฿150–250/hour; Racket + shuttle included some venues",
    why: "Badminton is Thailand's most popular indoor sport after football. Bangkok has hundreds of dedicated indoor badminton halls with 4–20 courts. Air-conditioned, proper PVC flooring, good lighting. Open 7am–10pm most days. Drop-in welcome at most halls — no advance booking required for non-peak hours.",
    tip: "Thai badminton pace is fast — bring energy. Most halls have shuttles for sale (feather ฿60–100 per tube, nylon ฿20–30). Bring your own racket for best control. Courts fill fast 6–9pm on weekdays — arrive early or book the morning slot.",
  },
  {
    name: "Nimibutr National Badminton Hall",
    emoji: "🏟️",
    area: "Hua Mak area, eastern Bangkok",
    price: "Court rental varies; Major tournament venue",
    why: "Thailand's premier national badminton venue. Has hosted BWF tournaments. 18+ courts, professional lighting, spectator seating. Regular training sessions by BAT (Badminton Association of Thailand). Can watch elite Thai players practice on public training days.",
    tip: "Check BAT website for open training times. The hall also runs organized drop-in competitive sessions. Thailand's national team has produced world top-10 players — the level you'll see at training sessions is very high.",
  },
  {
    name: "Local Community Halls",
    emoji: "🏫",
    area: "Neighborhood parks and community centers",
    price: "Free or ฿20–50 donation",
    why: "Many Bangkok neighborhoods have outdoor or semi-outdoor badminton courts in community parks. Local residents play every evening — genuinely welcoming to visitors who want to join. The most authentic Bangkok badminton experience. Less competitive, more social.",
    tip: "Lumpini Park has badminton courts. Chatuchak Park has courts. Or simply walk through any residential neighborhood in the evening — you'll hear the distinctive shuttle sound from courts tucked between houses. Asking to join a game is always welcomed.",
  },
];

export function BangkokBadminton() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🏸 Badminton in Bangkok — indoor halls, booking & play culture
      </div>
      <div className="space-y-2">
        {COURTS.map((c) => (
          <div key={c.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
