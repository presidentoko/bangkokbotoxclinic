const STUDIOS = [
  {
    name: "Absolute You",
    emoji: "🧘",
    area: "Thonglor / Ekamai / Sathorn (multiple)",
    price: "฿500–700/class, ฿2,500–4,000/month",
    type: "Hot yoga, Vinyasa, Pilates",
    why: "Bangkok's most popular yoga brand. Consistently excellent instructors. Hot yoga rooms at 40°C. Great for detox. Multiple styles.",
    highlight: "Hot yoga in Bangkok weather is meta — sweating in controlled heat feels very local.",
    tip: "First class often 50% off. Buy intro package (5 classes ฿1,500) for best value.",
  },
  {
    name: "Pure Yoga Bangkok",
    emoji: "☯️",
    area: "EmQuartier (BTS Phrom Phong)",
    price: "฿700–900/class, ฿3,000–5,000/month",
    type: "Ashtanga, Yin, Prenatal, Kids yoga",
    why: "Premium Hong Kong yoga brand. Most consistent international-standard teachers. Changing rooms with towels and lockers. Highest production quality.",
    highlight: "Best for serious yogis. Teacher training available. Advanced workshops monthly.",
    tip: "Day pass ฿900 includes unlimited classes that day. Very worth it.",
  },
  {
    name: "Stretch Bangkok",
    emoji: "🤸",
    area: "Silom / Bang Rak",
    price: "฿400–600/class",
    type: "Stretch therapy / restorative yoga",
    why: "Different approach — active stretching and assisted yoga. Good for office workers with desk tension. Smaller classes, very personalized.",
    highlight: "Most therapeutic yoga studio in Bangkok. Good for injury recovery.",
    tip: "Book the 'Thai stretch' treatment — combines Thai massage with assisted yoga. 90 mins ฿1,200.",
  },
  {
    name: "Free Yoga — Lumpini Park",
    emoji: "🌳",
    area: "Lumpini Park, Silom (Lumphini MRT)",
    price: "FREE",
    type: "Outdoor public yoga group",
    why: "Bangkok's free public tai chi / yoga group. Every morning 6:30–8am. Park instructors lead. No booking required.",
    highlight: "Most authentically Bangkok yoga experience — doing yoga with Thai locals as the city wakes up. Completely free.",
    tip: "Bring a mat (or rent nearby ฿20). Dawn air is cleanest in Bangkok. Metro opens 5:30am.",
  },
];

export function BangkokYogaStudios() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🧘 Yoga & wellness studios in Bangkok — all budgets
      </div>
      <div className="space-y-2">
        {STUDIOS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.type} · {s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-700 mb-0.5">✨ {s.highlight}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
