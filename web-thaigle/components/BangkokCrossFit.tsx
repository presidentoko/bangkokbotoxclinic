const BOXES = [
  {
    name: "CrossFit Bangkok (Official Affiliate)",
    emoji: "🏋️",
    area: "Sathorn / Silom area",
    price: "Drop-in ฿700–900; Monthly ฿5,000–7,000",
    why: "Bangkok's longest-running CrossFit affiliate. Full affiliate setup — pull-up bars, rig, barbells, rowing machines, assault bikes. Classes 5:30am–8pm most days. International coaching staff. Bangkok expat CrossFit community hub — social as well as fitness. Runs Bangkok open competitions.",
    tip: "Drop-in widely accepted — email ahead to confirm class schedule and available slots. Thailand's CrossFit community is welcoming. The 6am open gym crowd is particularly motivated. Heat adds intensity to outdoor WODs.",
  },
  {
    name: "CrossFit Asoke / Evolve Gym",
    emoji: "⚡",
    area: "Sukhumvit Asoke area",
    price: "Drop-in ฿600–800; Packages available",
    why: "Multiple Bangkok CrossFit affiliates cluster around the Asoke/Nana expat zone. Convenient for travelers staying in the Sukhumvit corridor. Some gyms combine CrossFit classes with other fitness offerings — Brazilian Jiu-Jitsu, boxing, yoga — making them full-service community gyms.",
    tip: "Use the CrossFit affiliate locator at CrossFit.com for official affiliates near your accommodation. Bangkok has 15+ official affiliates within the city. Unofficial 'functional fitness' gyms with similar training are also abundant.",
  },
  {
    name: "Thonglor / Ekkamai Functional Fitness Studios",
    emoji: "🔥",
    area: "Thonglor, Ekkamai corridor",
    price: "Class ฿500–900",
    why: "Bangkok's health-conscious Thonglor/Ekkamai area has multiple boutique functional fitness studios offering CrossFit-style workouts under different names (functional fitness, HIIT, hybrid training). Higher end, more Instagram-friendly, often with better facilities and more fashion-forward crowd.",
    tip: "Klook or local apps (FitPass Bangkok) sometimes have discounted class bundles. Studio ambiance varies enormously — check Google reviews for the 'vibe' of each studio before booking.",
  },
];

export function BangkokCrossFit() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏋️ CrossFit & functional fitness in Bangkok — boxes, drop-ins & community
      </div>
      <div className="space-y-2">
        {BOXES.map((b) => (
          <div key={b.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{b.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{b.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-orange-700">💡 {b.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
