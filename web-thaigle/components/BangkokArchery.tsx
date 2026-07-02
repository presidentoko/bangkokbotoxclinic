const VENUES = [
  {
    name: "Bangkok Archery Club (RCA)",
    emoji: "🏹",
    area: "RCA / Royal City Avenue, Huai Khwang",
    price: "30 arrows ฿300, equipment included",
    why: "Bangkok's most popular indoor archery range. Air-conditioned. Olympic-style recurve bows for beginners up to compound bows for advanced. Staff instruction included in price. Good for first-timers.",
    tip: "Book weekday afternoon slots for shorter queues. Recurve bow experience first — move to compound bow after 2–3 sessions. Walk-in usually available except weekend evenings.",
    level: "All levels — beginner-friendly staff",
  },
  {
    name: "Archery Bangkok (Ratchada)",
    emoji: "🎯",
    area: "Ratchadaphisek area",
    price: "60 arrows ฿450, bow rental included",
    why: "Larger venue with more lanes. Offers Korean traditional archery (gungdo) instruction on request — rare experience in Bangkok. Compound, recurve, and traditional bows available.",
    tip: "Try 'flight archery' — distance accuracy rather than target. Korean instructor available Tuesday/Thursday afternoons for traditional technique. Group discount available for 5+ people.",
    level: "Beginner to advanced — Korean traditional specialty",
  },
  {
    name: "Muangthong Thani Sport Complex",
    emoji: "🏟️",
    area: "Muang Thong Thani, Nonthaburi",
    price: "Outdoor range ฿200 per session",
    why: "Thailand's official outdoor archery range. Longer distances (30–70m). Used for national competition training. Open to public on non-competition days. Authentic sport experience.",
    tip: "Check competition schedule online before visiting — range may be reserved for national team. Outdoor experience in Thailand's humidity is genuinely different from indoor. Not beginner-friendly — go with some experience.",
    level: "Intermediate to advanced",
  },
];

const BASICS = [
  "Stance: stand perpendicular to target, feet shoulder-width apart",
  "Grip: don't grip the bow tightly — let it rest in hand (relaxed grip groups better)",
  "Draw: pull elbow back, not arm — engage back muscles",
  "Anchor: touch the string consistently to same point on face each shot",
  "Release: don't grab string — relax fingers and let string roll off",
  "Follow-through: hold aim position 1 second after release",
];

export function BangkokArchery() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🏹 Archery in Bangkok — ranges, beginner tips & bow types
      </div>
      <div className="space-y-2 mb-3">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{v.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{v.level} · {v.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-green-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-green-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-green-700 hover:bg-green-50">
          First-time archery basics — form tips
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {BASICS.map((b) => (
            <li key={b} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-green-400 shrink-0">•</span>{b}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
