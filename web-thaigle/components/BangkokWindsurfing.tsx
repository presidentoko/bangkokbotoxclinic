const SPOTS = [
  {
    name: "Windsurfing at Pattaya",
    emoji: "🏄",
    area: "Jomtien Beach, Pattaya (2 hrs from Bangkok)",
    price: "Lesson ฿1,500–3,000; Equipment rental ฿800–1,500/hour",
    why: "Pattaya's Jomtien Beach has established windsurf schools and rental operations. The Gulf of Thailand's consistent NE winter winds (October–February) create reliable conditions. More beginner-friendly than kite surfing — no overhead lines. Jomtien's flat water is ideal for learning the basic sailing position (uphauling the sail, steering by weight transfer).",
    tip: "Windsurfing lessons progress: balance on board (day 1), uphaul and basic sailing (day 2–3), tacking and jibing (week 1). A basic course is 3–5 days of 2–3 hour sessions. The Royal Varuna Yacht Club in Pattaya has the most organized windsurfing program in the Bangkok day-trip range.",
  },
  {
    name: "Royal Varuna Yacht Club",
    emoji: "⚓",
    area: "Pattaya, near Royal Pattaya Chonburi",
    price: "Day visitor pass; Windsurfing course pricing varies",
    why: "Thailand's most established sailing and windsurfing club — the Varuna has been active since 1947. Windsurfing, sailing, and yacht charter available. The club setting is different from beach rental operations — higher standard equipment, qualified instruction, and access to a proper sailing infrastructure. Non-member day visits are possible.",
    tip: "The Varuna Club's annual regattas are worth attending as a spectator — the Pattaya International Regatta (March) brings international sailing competitors. If serious about sailing or windsurfing in Thailand long-term, Varuna membership is the route into the club racing scene.",
  },
  {
    name: "Standup Paddleboard (SUP) Alternatives",
    emoji: "🏝️",
    area: "Pattaya, Hua Hin, Bang Saen — any calm beach",
    price: "SUP rental ฿300–500/hour",
    why: "If windsurfing or kite surfing seems too technical for a weekend trip, standup paddleboard (SUP) offers water sport activity accessible to all fitness levels. Available at every Thai beach resort. Flatwater touring, SUP yoga (calm mornings), and SUP fitness classes all available. Not as dramatic as wind sports but more social and less weather-dependent.",
    tip: "Bangkok area SUP: Bang Saen beach (2 hrs from Bangkok) has calm enough water for beginners. The early morning flatwater (7–9am before the afternoon wind picks up) is the ideal SUP time at Gulf of Thailand beaches.",
  },
];

export function BangkokWindsurfing() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏄 Windsurfing near Bangkok — Jomtien lessons, Varuna Club & SUP rentals
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
