const SHOWS = [
  {
    name: "Siam Niramit (Traditional Thai Performance)",
    emoji: "🎭",
    area: "Ratchada, near MRT Thailand Cultural Centre",
    time: "Shows at 8pm daily (closed Tuesday)",
    price: "Standard ฿1,500–2,200; Dinner package ฿2,500–3,500",
    why: "Bangkok's grandest traditional Thai performance show. 50m wide stage, 150 performers, live elephants, elaborate costumes, 3-floor sets depicting Thai history and mythology. Also shows Buddhist cosmic journey and traditional festivals. The most complete Thai cultural performance in the country.",
    tip: "Pre-book online — popular with tour groups, can sell out. Dinner buffet (Thai cuisine) starts 1.5h before show — arrive early for best buffet food. Show lasts 80 minutes. Camera allowed for first 5 minutes then no photography. English narration throughout.",
  },
  {
    name: "Joe Louis Puppet Theatre",
    emoji: "🎎",
    area: "Asiatique the Riverfront",
    time: "Shows at 7:30pm daily (check website)",
    price: "Adults ฿900, Children ฿600",
    why: "Rare traditional Thai puppet theatre (hun krabok). Master puppeteers (2–3 people operate one puppet) perform Ramakien epic scenes. Three-level wooden marionette puppets performing classical dance. Nearly lost art form — this is one of Bangkok's last remaining masters.",
    tip: "Joe Louis' style of puppetry is 200-year-old technique — each puppet requires 3 operators. The show is 45–60 minutes and contains no dialogue (pure movement and music). Excellent for children and adults equally. Photogenic performance — good low-light cameras recommended.",
  },
  {
    name: "Bangkok Community Theatre (BCT)",
    emoji: "🎬",
    area: "Various venues around Bangkok",
    time: "Rotating productions — check website",
    price: "฿450–900 depending on production",
    why: "English-language amateur theatre community. Produces Broadway musicals, Shakespeare, comedy shows performed by Bangkok expat and Thai community. Quality varies per production but consistently enthusiastic and professional for amateur level.",
    tip: "BCT website has season calendar. Productions vary from classic musicals to original work. Good opportunity to meet Bangkok's creative expat community. Smaller venues (150–300 seats) feel intimate. Bangkok Fringe Festival (annual) has excellent independent productions.",
  },
  {
    name: "Mahesak Theatre (Thai Classical Dance)",
    emoji: "🌺",
    area: "National Theatre Bangkok, Phra Nakhon",
    time: "Weekends and special occasions",
    price: "฿50–200 for National Theatre performances",
    why: "National Theatre Bangkok hosts khon (masked dance drama) and classical Thai dance performances by the national dance academy. The most authentic and subsidized classical Thai performance available. Very different from commercial shows — more ceremonial, more traditional.",
    tip: "Check National Theatre schedule at the Fine Arts Department website (Thai only — Google Translate helps). Performances are announced last-minute. Budget-friendly (government subsidized). Dress respectfully (covers knees and shoulders). Shows primarily in Thai but visual art speaks universally.",
  },
];

export function BangkokTheatre() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🎭 Theatre & performing arts in Bangkok — traditional dance to English comedy
      </div>
      <div className="space-y-2">
        {SHOWS.map((s) => (
          <div key={s.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.time} · {s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-violet-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
