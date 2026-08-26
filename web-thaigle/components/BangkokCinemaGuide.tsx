// Checked against each cinema's own site and current press, 2026-08-27. Prices
// are the published range at that date and move with promotions, so they are
// written as approximate and the reader is sent to the operator to confirm.
// The fourth entry that used to sit here — "EGV Gold Class (Siam Discovery)",
// with a price, a seat layout and a booking tip — has been closed for years;
// Paragon's exclusivity deal shut it. Nothing in the build could catch that.
const CINEMAS = [
  {
    name: "SF World Cinema (CentralWorld)",
    emoji: "🎥",
    area: "CentralWorld, Chidlom / Siam BTS",
    price: "IMAX around ฿380–550, standard around ฿180–280",
    format: "IMAX, World MAX, First Class, Bed Cinema, standard",
    why: "Bangkok's most central multiplex — 15 screens over three floors, including an IMAX and the 24m × 9m World MAX screen. First Class and Bed Cinema are the premium tiers.",
    tip: "Book on sfcinemacity.com or the SF app; online seats are often cheaper than the counter. Centre rows are worth the extra for IMAX.",
  },
  {
    name: "Paragon Cineplex (Siam Paragon)",
    emoji: "👑",
    area: "Siam Paragon 5F, Siam BTS",
    price: "Standard around ฿200–320, Platinum around ฿600–900, Enigma around ฿4,000 per couple",
    format: "Standard, Platinum, Enigma",
    why: "Bangkok's most luxurious multiplex. Platinum is a wide recliner with table service. Enigma is a 35-seat auditorium of reclining sofa beds — 15 couple beds and one triple — with butler service, not a set of private rooms.",
    tip: "Enigma sells out and is worth booking well ahead; the price covers the VIP lounge, a cocktail, a soft drink, food and popcorn. Platinum meal orders close about 15 minutes after the film starts.",
  },
  {
    name: "House Samyan (Samyan Mitrtown)",
    emoji: "🏠",
    area: "Samyan Mitrtown 5F, Sam Yan MRT",
    price: "Around ฿160",
    format: "Art-house and independent films, three screens",
    why: "The successor to House RCA and still Bangkok's best programming — festival titles, Asian independents and documentaries that no multiplex carries. Screens seat 200, 140 and 100.",
    tip: "Check the schedule on housesamyan.com before you go; the line-up turns over fast. Everything screens in the original language with subtitles.",
  },
];

export function BangkokCinemaGuide() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎬 Bangkok cinemas — from IMAX to private rooms & art-house
      </h2>
      <div className="space-y-2">
        {CINEMAS.map((c) => (
          <div key={c.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-purple-700 mb-0.5">Formats: {c.format}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
