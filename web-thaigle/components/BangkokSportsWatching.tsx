const SPORTS = [
  {
    name: "Rajadamnern Muay Thai Stadium",
    emoji: "🥊",
    sport: "Muay Thai",
    area: "Rajadamnern Avenue, Old City",
    price: "Ringside ฿2,000, Ordinary ฿800",
    schedule: "Monday, Wednesday, Thursday, Sunday evenings from 6pm",
    why: "Bangkok's historic Muay Thai venue since 1945. Major professional bouts featuring world-ranked fighters. Authentic Thai audience — noisy, betting-focused, passionate. Very different atmosphere from tourist Muay Thai shows.",
    tip: "Buy tickets at the stadium on arrival — online sellers charge 30–50% markup. Arrive 45 min early for good seats. Bring cash. The 8th–10th fights are main events (headliners). Atmosphere in ordinary section (Thai fans) is electric.",
  },
  {
    name: "Lumpini Muay Thai Stadium",
    emoji: "🏟️",
    sport: "Muay Thai",
    area: "Ratchadapisek Road, Huai Khwang",
    price: "Premium ฿2,000, Standard ฿1,000",
    schedule: "Tuesday, Friday, Saturday evenings",
    why: "Newer rival to Rajadamnern. More modern facilities. Same professional-level fighting. Tuesday fights often have newer rising talent — good for discovering future champions. Strong Thai gambling crowd adds atmosphere.",
    tip: "If choosing between the two stadiums: Rajadamnern has more historic significance, Lumpini has better facilities. Lumpini on Saturday has highest-profile fights of the week.",
  },
  {
    name: "BG Pathum United FC (Thai Premier League)",
    emoji: "⚽",
    sport: "Football (soccer)",
    area: "Thai Army Stadium / Pat stadium (Pathumwan)",
    price: "Tickets ฿100–350",
    schedule: "Friday/Saturday/Sunday evenings (season February–November)",
    why: "Bangkok's most successful club in recent years. Thai Premier League football at a very high ASEAN level. Excellent atmosphere, passionate Thai fan base, accessible tickets. Great way to experience Thai football culture.",
    tip: "Buy tickets at the stadium 1 hour before kickoff. Thai fans are friendly to foreigners interested in football. Bring a small Thai flag — vendors sell outside. Goals celebrated with horn and song — join in.",
  },
  {
    name: "Bangkok Cobras NBA-Level Basketball",
    emoji: "🏀",
    sport: "Basketball",
    area: "Nimibutr Stadium, Huai Khwang",
    price: "Tickets ฿200–600",
    schedule: "Thailand Basketball Super League season (monthly games)",
    why: "Thailand Basketball Super League features ex-NCAA and international players. High-quality basketball in an intimate venue. Very accessible — tickets usually available at door. Growing crowd of young Thai basketball fans.",
    tip: "Thai basketball scene is surprisingly good — top Thai players often have US college backgrounds. Food court inside venue. Starts exactly on time. Game-day atmosphere similar to US college basketball.",
  },
];

export function BangkokSportsWatching() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🏆 Watching sports in Bangkok — live Muay Thai, football & basketball
      </h2>
      <div className="space-y-2">
        {SPORTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.sport} · {s.schedule} · {s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
