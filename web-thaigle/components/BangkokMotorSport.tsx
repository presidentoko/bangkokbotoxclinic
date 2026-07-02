const EXPERIENCES = [
  {
    name: "Chang International Circuit (Buriram)",
    emoji: "🏎️",
    area: "Buriram Province, 4 hrs from Bangkok by car/4.5 hrs by train",
    experience: "Track days ฿15,000–50,000; Spectator entry ฿200–1,500 for race weekends",
    why: "Thailand's F1-grade motorsport facility. Has hosted MotoGP, WSBK, and considered for F1 calendar. Day trip possible (fly to Buriram) or overnight trip from Bangkok. Track days available for personal vehicles and rental cars. The facility also has a hotel, racing museum, and F1 simulator.",
    tip: "MotoGP Thailand is the biggest motorsport event — October. Book accommodation and tickets months ahead. The Chang International Circuit grandstand provides excellent circuit views. Racing museum at the facility is worth the visit even for non-race weekends.",
  },
  {
    name: "Speed Park Go-Kart Rama 9",
    emoji: "🏁",
    area: "Rama 9 area, eastern Bangkok",
    experience: "Junior kart ฿200–300; Senior kart ฿400–600 per session",
    why: "Bangkok's best indoor go-kart facility. 350m track, professional timing system, proper karts with safety gear. Regular organized races for Bangkok karting community. Popular corporate event venue. Air-conditioned viewing gallery. Best karting in central Bangkok.",
    tip: "Thursday evening is 'open race' night — members and visitors compete in organized time trials. Helmet and racing suit provided. Arrive 15 minutes early for briefing. Very competitive regular customers — newcomers welcome but be prepared for fast local drivers.",
  },
  {
    name: "F1 Simulator Experience",
    emoji: "🎮",
    area: "Chang Circuit (Buriram) and some Bangkok entertainment centers",
    experience: "฿500–2,000 per session (varies by facility)",
    why: "Professional F1 simulators available at Chang Circuit's Race Experience facility and some Bangkok entertainment venues. Motion platform simulators with force feedback steering provide realistic racing experience. Popular corporate team-building activity.",
    tip: "Chang Circuit's simulator is the most authentic — using actual F1 telemetry on their track layout. Bangkok entertainment center simulators are fun but less realistic. Both work as entry points for motorsport experiences.",
  },
];

export function BangkokMotorSport() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🏎️ Motorsport in Thailand — Chang Circuit, MotoGP & Bangkok karting
      </div>
      <div className="space-y-2">
        {EXPERIENCES.map((e) => (
          <div key={e.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{e.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{e.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{e.experience}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{e.why}</div>
            <div className="text-[10px] text-red-700">💡 {e.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
