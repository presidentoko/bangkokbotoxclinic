const POOLS = [
  {
    name: "Aqua by Sathorn (Non-Hotel Public Pool)",
    emoji: "🏊",
    area: "Sathorn area",
    price: "Membership required or ฿500/day via specific hotel deals",
    type: "25m lap pool + leisure pool",
    why: "One of few Bangkok pools that allow non-hotel day passes. Clean, well-maintained, good facilities. Popular with Sathorn expat community.",
    tip: "In Bangkok, most public swimming pools are either hotel pools (expensive) or municipal pools (cheap but crowded). Ask your accommodation about pool access first.",
  },
  {
    name: "Bangkok Metropolitan Pool (Sam Sen / Khao San)",
    emoji: "🏛️",
    area: "Multiple city-run pools across Bangkok",
    price: "฿30–50/session (extremely cheap municipal)",
    type: "Olympic 50m lap pools",
    why: "Bangkok's municipal sports pools are world-class facilities at Thai prices. Used by Thai swimmers training for national competition. 50m pools in proper Olympic standard.",
    tip: "Sam Sen Sports Center near Khao San is the most central. Can be crowded weekday evenings (post-work Thais swimming). Bring your own towel and cap — sometimes required.",
  },
  {
    name: "Centara Grand CentralWorld Pool",
    emoji: "🌊",
    area: "CentralWorld, Ratchaprasong BTS",
    price: "Non-guest day pass ฿800–1,500 (varies)",
    type: "Rooftop infinity pool, 25m",
    why: "Rooftop pool with central Bangkok views. Swim with Ratchaprasong skyscrapers as backdrop. Can book as day pass (call ahead to confirm availability).",
    tip: "Day pass often includes use of fitness center. Book directly with hotel, not third-party. Busiest on weekends — weekday afternoons quietest.",
  },
  {
    name: "AVANI+ Riverside Pool",
    emoji: "🌅",
    area: "AVANI Riverside Hotel, Charoenkrung",
    price: "Non-guest pool access via dining minimum spend ฿800–1,200",
    type: "Infinity edge pool with Chao Phraya River view",
    why: "Bangkok's best-value rooftop infinity pool with river views. Book dinner/lunch minimum spend, get pool access as part of the deal. Stunning sunset views.",
    tip: "Book in advance — pool access is limited by capacity. Best time 4–7pm for sunset swimming. The pool faces west — golden hour light is exceptional.",
  },
];

export function BangkokSwimmingPools() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        🏊 Swimming in Bangkok — public pools, rooftop, and hotel day passes
      </div>
      <div className="space-y-2">
        {POOLS.map((p) => (
          <div key={p.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{p.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{p.type} · {p.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
