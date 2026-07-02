const COURTS = [
  {
    name: "Santiporn Tennis Pavilion",
    emoji: "🎾",
    area: "Lumpini Park area, central Bangkok",
    price: "Court rental ฿150–300/hour; Racket rental available",
    why: "Oldest and most established public tennis courts in central Bangkok. Multiple clay and hard courts. Thai tennis community hub — local players of all levels play here daily. Coaching available. Near Lumpini Park so combine tennis with park morning before play.",
    tip: "Courts popular in morning (6–9am) and evening (5–8pm). Midday slots available due to heat. Book by arriving early and signing up on the day. Hard courts dry faster after rain than clay.",
  },
  {
    name: "True Arena Tennis Courts (Hua Hin)",
    emoji: "🏟️",
    area: "True Arena Hua Hin (2.5 hrs from Bangkok)",
    price: "Court rental ฿400–800/hour; Coaching available",
    why: "WTA and ATP tour have played at True Arena — professional standard courts. Day trip from Bangkok or use as base for a Hua Hin tennis holiday. Multiple hard and clay surfaces. Pro shop, coaching, ball machines. One of Thailand's premier tennis venues.",
    tip: "Day trip from Bangkok to hit proper tennis courts in Hua Hin — combine with beach afternoon. Court reservation required for peak times. International coaches available for lessons.",
  },
  {
    name: "Condominium Complex Courts (Pay-Per-Use)",
    emoji: "🏢",
    area: "Various condo developments — Sukhumvit, Thonglor",
    price: "฿200–500/hour (day pass arrangement)",
    why: "Many Bangkok luxury condominiums have tennis courts available for resident guest booking. If staying in a serviced apartment or knowing a Bangkok resident, access to private courts in quieter settings. Better maintained than public courts, less competition for time slots.",
    tip: "Ask your hotel concierge about nearby court access arrangements. Some condos allow hotel guest bookings through condo management. Alternatively, DTGO Corp and similar facilities sometimes sell day passes.",
  },
];

export function BangkokTennis() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🎾 Tennis courts in Bangkok — public courts, coaching & booking
      </div>
      <div className="space-y-2">
        {COURTS.map((c) => (
          <div key={c.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-green-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
