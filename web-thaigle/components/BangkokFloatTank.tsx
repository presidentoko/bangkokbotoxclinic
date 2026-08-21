const INFO = [
  {
    name: "Sensory Deprivation Float Tanks in Bangkok",
    emoji: "🛁",
    area: "Wellness centers — Sukhumvit, Thonglor",
    price: "60-minute float ฿800–1,800; 90-minute ฿1,200–2,500",
    why: "Float tanks (isolation tanks, sensory deprivation pods) — dense Epsom salt water at body temperature in total darkness and silence — have a small but dedicated following in Bangkok. The experience: you float effortlessly on the water surface, no gravity on joints, no external sensory input. Used for deep relaxation, meditation acceleration, athletic recovery, and creativity. Bangkok's floating facilities are modern pod-style (not coffin-like).",
    tip: "First-time floaters: leave the pod light on for the first 10 minutes if needed — panic in darkness is normal initially and resolves within 15 minutes once you surrender to the weightlessness. The water is 35–36°C (skin temperature) — you lose track of where your body ends and the water begins. Avoid caffeine 4 hours before. The post-float sensation is uniquely calm.",
  },
  {
    name: "Benefits & Use Cases for Floating",
    emoji: "🧠",
    area: "N/A — informational",
    price: "N/A",
    why: "Research-supported applications: pain reduction (fibromyalgia, chronic back pain), athletic recovery (significant magnesium absorption through skin), anxiety and stress reduction, sleep improvement, creativity enhancement. Athletes and musicians in Bangkok's community have integrated regular floating into their recovery/training routine.",
    tip: "Serial floaters (those who float weekly) report that the meditative depth becomes more accessible after 3–5 sessions. First float is often dominated by noticing the novelty. Second float — you start to go deeper. By the fifth float, 60 minutes feels like it passes in 20 minutes while your mind explores unexpected creative or meditative territory.",
  },
  {
    name: "Booking & Practical Notes",
    emoji: "📅",
    area: "Bangkok float centers",
    price: "Multi-session packages offer better value",
    why: "Bangkok floating facilities are small businesses — typically 2–6 pods per location. Advance booking is essential (walk-ins rarely succeed). The Epsom salt concentration is 550–600kg per tank — the water is supersaturated, self-sterilizing, and filtered between each session. You shower before and after. Ear plugs provided (water in ears is distracting). No contact lenses.",
    tip: "Don't float immediately after shaving, waxing, or with fresh cuts — the salt concentration is painfully high on open skin. Floating during a Bangkok afternoon is particularly good — you emerge as the city's evening energy starts but your nervous system is completely reset. The contrast between the urban environment and post-float calm is the point.",
  },
];

export function BangkokFloatTank() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🛁 Float tanks in Bangkok — sensory deprivation pods, salt baths & deep relaxation
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-sky-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
