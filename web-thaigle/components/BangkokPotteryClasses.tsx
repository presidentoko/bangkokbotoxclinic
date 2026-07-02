const STUDIOS = [
  {
    name: "Clayful Studio",
    emoji: "🏺",
    area: "Ari area (BTS Ari)",
    price: "Wheel throwing class ฿1,200–1,800/person (3–4 hours)",
    why: "Bangkok's most Instagram-friendly pottery studio. Good ventilation, natural light, and helpful English-speaking instructors. Multiple class levels — wheel, hand-building, and painting.",
    tip: "Book Sunday morning sessions online — most popular slot. Wear clothes you don't mind getting clay on. First class: expect to make 2–3 imperfect pieces (that's normal). Studio fires your work and ships to you.",
    what_you_make: "First-timers usually make small bowls or cups on the wheel. Hand-building class: decorative vases or plates.",
  },
  {
    name: "The Pottery Studio Bangkok",
    emoji: "🎨",
    area: "Ekkamai area",
    price: "Single session ฿1,000–1,500, Monthly membership available",
    why: "Community-focused studio with professional kilns. Open studio sessions for experienced potters as well as beginners. Good if you want ongoing practice rather than one-off class.",
    tip: "Join the Sunday open studio (฿800/3 hours with clay included) for less structured creative time. Staff speak Thai — bring translation app. Best value in Bangkok for pottery access.",
    what_you_make: "Free form in open studio. Classes have guided projects.",
  },
  {
    name: "Terra Clay Studio",
    emoji: "🌿",
    area: "Thong Lo area",
    price: "Intro class ฿1,400/person, 2.5 hours",
    why: "Upscale studio with aesthetic focus — beautiful lighting, curated tools, good snacks provided. Popular with couples and small groups. Hand-building classes available for those who want no wheel.",
    tip: "Couple sessions available (฿2,600 for 2, includes champagne). Hand-building class more achievable for complete first-timers vs wheel. Firing takes 3 weeks — finished pieces can be shipped.",
    what_you_make: "Hand-building: pinch pots, coil vases. Wheel: small functional bowls.",
  },
];

export function BangkokPotteryClasses() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🏺 Pottery classes in Bangkok — wheel throwing & hand-building
      </div>
      <div className="space-y-2">
        {STUDIOS.map((s) => (
          <details key={s.name} className="border border-amber-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-amber-50 transition">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-amber-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{s.why}</div>
              <div className="text-[10px] text-amber-700">🎯 You'll make: {s.what_you_make}</div>
              <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
