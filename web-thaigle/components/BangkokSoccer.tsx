const OPTIONS = [
  {
    name: "5-a-side Futsal Courts (Indoor)",
    emoji: "⚽",
    area: "Citywide — every major neighborhood has at least one",
    price: "Court rental ฿300–600/hour; Per-person casual ฿60–100",
    why: "Bangkok's most popular casual sport. Hundreds of indoor and covered futsal pitches available 7am–midnight. Organized casual sessions (pay per person, join if space available) happen every evening. Air-conditioned indoor courts or covered outdoor pitches with good lighting. Far more accessible for visitors than full-field football.",
    tip: "Show up at any futsal court at 6–8pm and you'll likely find a game with space to join. Thai players generally welcoming to skill-matched additions. Indoor version (futsal ball, wooden floor) vs outdoor turf courts — both available in Bangkok.",
  },
  {
    name: "Expat Football Leagues (Join as Visitor)",
    emoji: "🏆",
    area: "Various parks and sports complexes",
    price: "Match fee ฿200–400 depending on league",
    why: "Bangkok has 10+ organized expat football leagues and pickup groups meeting weekly. British, Australian, European, Thai-mixed teams. Skill levels range from social to semi-competitive. Some leagues welcome visiting players for individual matches. Best way to meet the international Bangkok sports community.",
    tip: "Facebook search: 'Bangkok Football', 'Bangkok Soccer', 'Football Bangkok Expats'. Most groups post when they need players. Turn up in kit with your own boots (artificial turf preferred). Bangkok Rovers FC and similar clubs post on Facebook regularly.",
  },
  {
    name: "Watch Thai Premier League (T1)",
    emoji: "🏟️",
    area: "Various stadiums — Rajamangala National Stadium is biggest",
    price: "Tickets ฿100–600; Away end cheaper",
    why: "Thai Premier League is better quality than many expect — some ex-Premier League and Bundesliga players feature. Bangkok teams: BG Pathum United (dominant), Bangkok United, Port FC. Match atmosphere with Thai supporter culture — elaborate fan choreography, drums, chants. Very fan-friendly and affordable.",
    tip: "BG Pathum United games often sell out — book via Thai Ticket Major. Port FC games at PAT Stadium (riverside) are particularly atmospheric. Thai football season runs February–October. Local supporters are very welcoming to foreign visitors in the stands.",
  },
];

export function BangkokSoccer() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        ⚽ Football & soccer in Bangkok — play, join leagues & watch Thai Premier League
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-green-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
