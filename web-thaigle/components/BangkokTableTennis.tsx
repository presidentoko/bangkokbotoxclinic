const SPOTS = [
  {
    name: "Lumpini Park Table Tennis Tables",
    emoji: "🏓",
    area: "Lumpini Park, central Bangkok",
    price: "Free (public tables)",
    why: "Outdoor concrete table tennis tables in Lumpini Park — free, always available during park hours. Very popular with elderly Thai men who play with ferocious skill. Informal games happen daily morning until afternoon. Beginners welcome — locals enjoy teaching. Paddles sometimes available to borrow from regular players.",
    tip: "Tables near the main bandstand area. Best to arrive with your own paddle if you're serious. Morning group of senior Thai players are remarkably skilled — their spin serves and forehand loops are something to witness. Very good humored about playing with visiting tourists.",
  },
  {
    name: "SethTable (Dedicated Table Tennis Venue)",
    emoji: "⚡",
    area: "Multiple Bangkok locations",
    price: "Table rental ฿100–200/hour; Paddle rental available",
    why: "Dedicated indoor table tennis venues have emerged in Bangkok's fitness-conscious neighborhoods. Multiple tables, proper flooring, rubber paddle rentals, ball purchase. Air-conditioned — a luxury for Bangkok sport. Coaching available for serious players. Much better playing surface than park concrete tables.",
    tip: "The growth of table tennis venues in Bangkok mirrors the sport's popularity surge following Chinese players' dominance at international level. Thursday-Sunday evenings fill up — weekday daytime has availability. ITTF-approved balls and paddles available for purchase.",
  },
  {
    name: "Shopping Mall Recreation Areas",
    emoji: "🏬",
    area: "Seacon Square, The Mall, and similar large malls",
    price: "฿60–100 per session (time-limited)",
    why: "Large Bangkok shopping malls often have recreation areas with table tennis tables alongside other activities (air hockey, game arcades). Family-friendly, climate-controlled, convenient for visitors already at a mall. Lower level of play but higher accessibility. Good for kids and casual play.",
    tip: "Recreation areas in malls are usually on upper floors or basement levels. Often bundled as part of recreation pass. Not suitable for serious play but good for family introduction.",
  },
];

export function BangkokTableTennis() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🏓 Table tennis in Bangkok — park tables, dedicated venues & coaching
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
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
