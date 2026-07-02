const COURTS = [
  {
    name: "Outdoor Courts at BTS Stations",
    emoji: "🏀",
    area: "Multiple BTS station areas — Ekkamai, Thonglor, On Nut",
    price: "Free (public courts)",
    why: "Bangkok has outdoor basketball courts near several BTS stations. Informal pickup games happen daily from afternoon until 9–10pm. Mix of Thai players, expats, and international students from nearby universities. Thai basketball culture is strong — heavily influenced by NBA (many Thais are serious NBA fans).",
    tip: "Ekkamai area outdoor courts are particularly active. Show up with sneakers and join any game in progress — Thai players welcoming to visitors who can play. Level varies widely from beginner to semi-competitive.",
  },
  {
    name: "University Gymnasiums (Guest Play)",
    emoji: "🎓",
    area: "Chulalongkorn, Thammasat, King Mongkut universities",
    price: "฿50–100 per session (day pass)",
    why: "Bangkok's major universities have good indoor basketball courts available to the public at low cost during non-peak hours. Climate-controlled, proper hardwood floors, regulation goals. University sports culture in Bangkok is serious — Thai universities compete at high levels nationally.",
    tip: "Morning sessions (10am–noon) often available to public. Bring photo ID. Thai university campuses are often publicly accessible — cafeterias and sports facilities available to visitors at student-subsidized prices.",
  },
  {
    name: "RSU (Rangsit University) Sports Complex",
    emoji: "🏟️",
    area: "Rangsit, north of Bangkok (40 mins by expressway)",
    price: "Day pass ฿100–200",
    why: "RSU has one of Bangkok area's best basketball facilities — multiple indoor courts, professional lighting, good flooring. University runs organized basketball programs and friendly to casual visitors. Thai college basketball level is respectable.",
    tip: "Best combined with a half-day trip north of Bangkok. Also has swimming pool, fitness center, and other sports in the same complex.",
  },
];

const NBA = [
  "Thailand has passionate NBA following — Golden State Warriors and LA Lakers particularly popular",
  "Thai players in international leagues are increasing — basketball infrastructure improving nationally",
  "NBA Thailand games (exhibition matches) have been held in Bangkok — check NBA schedule for Asia tours",
  "Basketball shoe culture is huge in Bangkok — sneakerhead community very active (Chatuchak sneaker section)",
];

export function BangkokBasketball() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏀 Basketball in Bangkok — outdoor courts, pickup games & NBA culture
      </div>
      <div className="space-y-2 mb-3">
        {COURTS.map((c) => (
          <div key={c.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-orange-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-orange-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-orange-700 hover:bg-orange-50">
          NBA & basketball culture in Thailand
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {NBA.map((n) => (
            <li key={n} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-orange-400 shrink-0">•</span>{n}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
