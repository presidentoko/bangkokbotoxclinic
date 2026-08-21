const INFO = [
  {
    name: "Kite Surfing Near Bangkok — Hua Hin",
    emoji: "🪁",
    area: "Hua Hin (3 hrs south) — Thai Kite Center, Hua Hin Kite",
    price: "Beginner lesson ฿2,500–4,000/3 hours; Equipment rental ฿1,500–3,000/day",
    why: "Hua Hin is Bangkok's closest kite surfing destination — 3 hours by car or bus. The Gulf of Thailand coastline at Hua Hin has reliable NE monsoon winds October–February. Kitesurfing schools with certified IKO (International Kiteboarding Organisation) instructors available. The Hua Hin area has flat water spots (bay) and chop (open sea) suitable for both learning and progression.",
    tip: "IKO certification is the standard kite surfing qualification — look for IKO-certified schools and instructors. Beginner lesson sequence: kite control on the beach (1 day) → body drag in water (half day) → board start (1–2 days). Total beginner to riding: 10–15 hours of instruction. October–February best for wind at Hua Hin.",
  },
  {
    name: "Kite Surfing at Pattaya & Bang Saen",
    emoji: "🌊",
    area: "Pattaya/Bang Saen (2 hrs from Bangkok)",
    price: "Lessons ฿2,000–3,500; Rental ฿1,200–2,500",
    why: "Pattaya's coast has kite surfing areas outside the main tourist beach zone. Bang Saen beach (less tourist-heavy than Pattaya) has kite schools with calmer conditions. Closer to Bangkok than Hua Hin — feasible as a weekend trip. The Gulf of Thailand's predictable seasonal winds (NE in winter, SW in summer) make planning easier.",
    tip: "The Gulf of Thailand has warmer water (28–30°C) than most kite surfing destinations globally — no wetsuit needed. A rash guard for sun protection is more important. Beginner kite students should choose flat water spots away from boat traffic — Bang Saen's northern beaches are better for this than Pattaya's busier south.",
  },
  {
    name: "Wing Foiling — Bangkok's Newest Water Sport",
    emoji: "🏄",
    area: "Hua Hin, Pattaya, Bang Saen — anywhere with kite infrastructure",
    price: "Lesson ฿3,000–5,000; Equipment ฿5,000–15,000 (own gear)",
    why: "Wing foiling (hand-held inflatable wing + hydrofoil board) has exploded globally and arrived in Thailand's coastal resort scene. Less dangerous than kitesurfing (no lines), faster learning curve, works in lighter winds. Bangkok-area wing foiling is taught by former kite instructors who've transitioned. Foil experience from wind surf or kite helps but not required.",
    tip: "Wing foiling requires no separate space management — the wing goes where you go without trailing lines. For mixed ability groups, wing foiling is easier to learn simultaneously than kitesurfing. The foil lift sensation (when the board rises off the water) is the moment most new wing foilers get addicted.",
  },
];

export function BangkokKiteSurf() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        🪁 Kite surfing near Bangkok — Hua Hin lessons, Pattaya spots & wing foiling
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
