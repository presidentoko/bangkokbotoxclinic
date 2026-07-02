const SPOTS = [
  {
    name: "Petchburi Soi 5 (Night Food Street)",
    emoji: "🌙",
    hours: "11pm–6am",
    area: "Ratchathewi (Victory Monument area)",
    why: "Bangkok's most authentic late-night food scene. 80+ vendors. Locals only.",
    must: ["Pad see ew ฿60", "Moo ping pork skewers ฿10–15 each", "Crispy pork belly rice", "Tom yum noodles ฿70"],
    tip: "Best after midnight when office workers and clubbers arrive. The later the better.",
  },
  {
    name: "Silom 24h Zone",
    emoji: "🏙️",
    hours: "24/7",
    area: "Silom (BTS Sala Daeng)",
    why: "Multiple 24-hour stalls + restaurants along Silom Road and Soi 5.",
    must: ["Boat noodles near Silom Soi 8 (after 2am)", "Dim sum at 3am (several shops stay open)", "Grilled pork neck (kor moo yang) stalls"],
    tip: "Good safety record. Well-lit area. Lots of after-club tuk-tuk drivers eating here at 2–4am.",
  },
  {
    name: "Pak Klong Talad (Flower Market midnight peak)",
    emoji: "🌸",
    hours: "Peak delivery: 12am–4am",
    area: "Sanam Chai MRT area",
    why: "Wholesale flower market that peaks at midnight. Street food vendors set up for the workers.",
    must: ["Khao tom (rice soup with pork/egg) — ฿50–80", "Simple stir-fry dishes", "Coffee from thermos stalls ฿15–25"],
    tip: "Not a tourist destination — real working market. Very photogenic. Extremely friendly vendors.",
  },
  {
    name: "Victory Monument 24h Food Court",
    emoji: "⭐",
    hours: "24/7",
    area: "Victory Monument (BTS N3)",
    why: "Dense cluster of late-night eateries around Victory Monument roundabout. Taxi driver favorite.",
    must: ["Boat noodles from the famous alleys", "Northern Thai khao soi ฿70", "Thai iced tea with condensed milk ฿30"],
    tip: "Taxi drivers stop here at 2am. Best indicator of real local quality. Follow the cabs.",
  },
];

export function BangkokMidnightFood() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🌙 Bangkok late-night food — what&apos;s open after midnight
      </div>
      <div className="space-y-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div>
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">📍 {s.area} · 🕐 {s.hours}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1.5 leading-snug">{s.why}</div>
            <div className="space-y-0.5 mb-1">
              {s.must.map((m) => (
                <div key={m} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-purple-500">▸</span>{m}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
