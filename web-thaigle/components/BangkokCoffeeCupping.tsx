const VENUES = [
  {
    name: "Roots Coffee — Specialty Cupping",
    emoji: "☕",
    area: "Multiple locations: Ari, Thonglor, EmQuartier",
    price: "Cupping session ฿350–600; Filter coffee ฿90–180",
    why: "Roots is Bangkok's flagship specialty coffee brand — sourcing directly from Thai farmers in Chiang Rai, Chiang Mai, and Doi Inthanon. Regular cupping sessions (professional coffee tasting ritual) where guests evaluate 6–10 coffees by aroma, flavor, acidity, body. Roots roasts in-house and the cupping sessions are genuinely educational — not just marketing.",
    tip: "Cupping protocol: sniff dry grounds, add hot water, break crust (sniff again), let cool, slurp loudly from spoon. The loud slurp is mandatory — it aerates the coffee across your palate. Thai specialty coffee from Chiang Rai highlands is consistently high quality — comparable to Ethiopian and Colombian specialty coffee.",
  },
  {
    name: "Thai Specialty Coffee Scene",
    emoji: "🌿",
    area: "Ari neighborhood hub; Silom/Sathorn; Thonglor",
    price: "Specialty pour-over ฿90–160; Espresso ฿70–130",
    why: "Bangkok's specialty coffee scene is among Southeast Asia's best — Ari neighborhood has the highest concentration of quality-focused cafés. Thai coffee farms produce world-class arabica at high altitudes in northern Thailand. Many Bangkok roasters source exclusively Thai beans. Third-wave coffee culture is fully established — pour-over bars, siphon brewing, and natural/honey process single origins are standard.",
    tip: "For Thai specialty coffee, look for: single origin (not blend), roaster name on the bag, roast date within 2 weeks, origin details (farm, process, altitude). These indicators separate specialty from commercial. Ari's walking street has 8+ specialty cafés within 500m — Saturday morning coffee crawl is a Bangkok ritual.",
  },
  {
    name: "Thai Arabica Origins to Know",
    emoji: "🗺️",
    area: "Grown in Chiang Rai, Chiang Mai, Doi Inthanon highlands",
    price: "N/A — roaster education",
    why: "Thailand's coffee regions: Doi Chaang (Chiang Rai) produces fruity, wine-like naturals. Doi Pangkhon is lighter, floral. Doi Inthanon has high-altitude farms with clean, bright acidity. Akha Hill House works with hill tribe farmers producing unique micro-lot coffees. Thai coffee is underrepresented globally relative to its quality — Bangkok is the best place to discover it.",
    tip: "If you find a Thai coffee you love in Bangkok, note the roaster, origin, and process. Taking home Thai specialty coffee is one of Bangkok's best souvenirs — fits in checked luggage, legal to export, and often completely unavailable outside Thailand.",
  },
];

export function BangkokCoffeeCupping() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        ☕ Specialty coffee in Bangkok — cupping sessions, Thai arabica & Ari café crawl
      </div>
      <div className="space-y-2">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{v.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{v.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-amber-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
