const GYMS = [
  {
    name: "Fairtex Muay Thai Gym",
    emoji: "🥊",
    area: "Bangplee (Samut Prakan, 40 min from central Bangkok)",
    price: "฿600–800/class, ฿8,000–15,000/month",
    type: "World-class pro gym + tourist training",
    why: "Thailand's most famous Muay Thai gym. Home to world champions. Separate beginner/tourist program from pro fighters. Full gear rental.",
    for: "Serious training. Multi-week camps. Home to world-ranked fighters you'll watch train.",
    booking: "fairtexmuaythai.com. 1-week to 3-month camps available.",
  },
  {
    name: "Evolve MMA (multiple Bangkok locations)",
    emoji: "🏅",
    area: "Orchard Road, Thonglor, and others",
    price: "฿800–1,000/class, ฿10,000–25,000/month",
    type: "World-class MMA + Muay Thai training facility",
    why: "Most professional facility in Bangkok. Multiple world champion instructors. Immaculate gyms. Comprehensive curriculum from beginner to pro.",
    for: "Everyone — excellent beginner classes, also genuine championship-level pro training.",
    booking: "evolve-mma.com. Trial class ฿1,000 (often promoted). Day pass option.",
  },
  {
    name: "Dragon Muay Thai Gym",
    emoji: "🐉",
    area: "Ekkamai BTS area",
    price: "฿400–600/class",
    type: "Local traditional gym",
    why: "Old-school Bangkok training. Actual Thai trainers who competed professionally. Less tourist-oriented. More authentic experience.",
    for: "People who want authentic traditional training without big facility pricing.",
    booking: "Walk in any morning for 6–9am session. Ask for 'visitor session' (฿400).",
  },
  {
    name: "Nimit Muay Thai",
    emoji: "🌟",
    area: "Sukhumvit Soi 22",
    price: "฿350–500/class",
    type: "Tourist-friendly traditional gym",
    why: "Best balance of authentic training and tourist-accessibility. Central location. English-speaking trainers. Small class sizes.",
    for: "First-time Muay Thai tourists who want real training, not just a photo session.",
    booking: "Walk-in welcome. Morning (7–10am) and evening (6–8pm) sessions.",
  },
];

export function BangkokThaiBoxingClass() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥊 Muay Thai training in Bangkok — gyms for all levels
      </div>
      <div className="text-[10px] bg-red-50 rounded-xl p-2.5 mb-3 text-red-800">
        <strong>What to bring:</strong> Shorts (Thai boxing or regular sports), T-shirt or tank. Most gyms provide gloves, hand wraps, shin guards for rental (฿100–200). Water essential — Bangkok heat + intense training = very sweaty.
      </div>
      <div className="space-y-2">
        {GYMS.map((g) => (
          <div key={g.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.type} · {g.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{g.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">👤 Best for: {g.for}</div>
            <div className="text-[10px] text-red-700">📱 {g.booking}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
