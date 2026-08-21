const ALLEYS = [
  {
    name: "SF Strike Bowl (multiple malls)",
    emoji: "🎳",
    area: "MBK, Mega Bangna, CentralPlaza locations",
    price: "฿100–160 per game per person; shoe rental ฿30",
    why: "Thailand's dominant bowling chain. Found in major malls across Bangkok. 16–24 lanes, computerized scoring, disco lighting option, snack bar. Air-conditioned and easy to find. Good for spontaneous group activity when weather is bad.",
    tip: "Weekends have long waits — reserve lanes by phone or arrive before noon. Bowling shoes mandatory (provided for rental). BYO bowling ball in Thailand is unusual — use house balls. Lane fees are per person per game, not per lane.",
  },
  {
    name: "Blue O (Bowling + Karaoke)",
    emoji: "🎤",
    area: "Esplanade Mall, Ratchadapisek",
    price: "Bowling ฿120–180/game; Karaoke ฿180–350/hr per room",
    why: "Entertainment complex combining bowling lanes with private karaoke rooms — very Thai group activity combination. Glow bowling available (Friday and Saturday nights with UV lighting). Large bar area. Popular for birthday parties and staff outings.",
    tip: "Karaoke rooms need advance booking (fill up 6–10pm weekends). Glow bowling events have DJ and are more nightlife than sport — dress accordingly. Package deals available: bowling + karaoke + food credit. Group minimum for karaoke rooms: 4 people.",
  },
  {
    name: "Major Bowl Hit (Major Cineplex venues)",
    emoji: "🎥",
    area: "Major Cineplex malls: Ratchayothin, Pinklao, Sukhumvit",
    price: "฿90–140/game; monthly membership available",
    why: "Movie theater-attached bowling alleys with good quality lanes and equipment. Regular maintenance schedule (lanes more consistent than some competitors). Good for combining with movie night. Happy hour pricing before 6pm.",
    tip: "Major Bowl's early-bird pricing (before 5pm weekdays) is Bangkok's best bowling value — same lanes, ฿70–90/game. Bring own small towel if you sweat (ball grip important). Their snack food menu is surprisingly good (Thai fast food options).",
  },
];

export function BangkokBowling() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🎳 Bowling in Bangkok — best alleys, glow bowling & group tips
      </h2>
      <div className="space-y-2">
        {ALLEYS.map((a) => (
          <div key={a.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{a.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{a.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{a.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{a.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
