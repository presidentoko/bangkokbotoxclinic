const SPOTS = [
  {
    name: "Premium Teppanyaki at Bangkok Hotels",
    emoji: "🔥",
    area: "Sukhumvit 5-star hotels — Banyan Tree, Marriott, Sofitel",
    price: "Set menu ฿2,500–6,000/person",
    why: "Bangkok's hotel teppanyaki restaurants (Okura Prestige Bangkok, Conrad Bangkok's Sumire, Banyan Tree's Vertigo) are the gold standard for the experience — trained teppanyaki chefs performing tableside at an iron griddle, with A5 wagyu imported from Japan, fresh seafood, and theatre-grade service. Bangkok's Japanese expat community is large and demands authenticity — hotel teppanyaki delivers it.",
    tip: "Hotel teppanyaki in Bangkok is slightly cheaper than in Tokyo hotels of equivalent quality, but pricing is still luxury. A4/A5 wagyu additions are priced per 50–100g. Book directly with the restaurant to request a specific chef if you want the most theatrical experience — some Bangkok teppanyaki chefs are genuinely skilled at tableside showmanship (onion volcano, flipping shrimp tails).",
  },
  {
    name: "Pepper Lunch — Teppan Express",
    emoji: "🥩",
    area: "Shopping malls across Bangkok — Siam Paragon, Central World, EmQuartier",
    price: "Set ฿299–599",
    why: "Pepper Lunch (Japanese fast-casual teppan concept) has 20+ locations across Bangkok's major malls — the individual iron plate (hot to 260°C) serves as your personal teppanyaki surface for gyudon-style beef, rice, and corn. Dramatically less theatrical than hotel teppanyaki but genuinely excellent for a quick meal. The butter-corn-beef combination on a sizzling plate is satisfying at any price point.",
    tip: "Pepper Lunch etiquette: stir immediately when food arrives (the plate is hottest at the start), avoid the temptation to flip everything at once (small batches stay hotter), and the corn should be mixed with the butter and meat in the last 30 seconds. Seasonal Japan-only items appear at Bangkok Pepper Lunch 2–3 times per year.",
  },
  {
    name: "Yakiniku vs Teppanyaki — Bangkok",
    emoji: "🥢",
    area: "Japanese districts — Sukhumvit 39, Asoke, Thonglor",
    price: "Yakiniku ฿600–3,000/person all-in",
    why: "Many visitors confuse teppanyaki (chef cooks on iron griddle in front of you) with yakiniku (you grill your own meat on tabletop charcoal/electric grill). Bangkok has excellent yakiniku — Gyugyu, Kintan, MK Gold, and numerous independent Japanese yakiniku. Yakiniku is typically more casual and social. Bangkok's yakiniku scene includes Japanese-operated spots importing wagyu and domestic wagyu from Thai farms that have adopted Japanese breeding.",
    tip: "For yakiniku novices in Bangkok: the Japanese way is one small piece at a time on the grill, eat immediately without letting it overcook. Thai-style yakiniku (Mookata/BBQ hybrid) often cooks meat fully through — Japanese yakiniku serves beef at medium. The lettuce wrap (ssam, borrowed from Korean BBQ) has appeared at Bangkok yakiniku through Thai-Japanese cross-cultural fusion.",
  },
];

export function BangkokTeppanyaki() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🔥 Teppanyaki in Bangkok — hotel wagyu experience, Pepper Lunch & yakiniku guide
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
