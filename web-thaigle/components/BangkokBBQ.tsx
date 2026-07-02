const SPOTS = [
  {
    name: "Moo Kata (Thai BBQ-Hotpot)",
    emoji: "🍖",
    area: "Everywhere — Sukhumvit, Ladprao, any local area",
    price: "฿150–300/person (all-you-can-eat)",
    type: "Thai BBQ-hotpot hybrid (outdoor)",
    must: "Pork belly, shrimp, mushrooms, morning glory, clear soup",
    why: "Most Thai of all BBQ experiences. Charcoal dome in the center — grill on top, broth around the sides. All-you-can-eat typical at local spots.",
    tip: "Look for 'Moo Kata' signs in any local neighborhood. Best after 8pm. Street-facing spots most authentic.",
  },
  {
    name: "Korean BBQ (KBBQ)",
    emoji: "🥩",
    area: "Thonglor, Ekkamai, Ladprao Korean strips",
    price: "฿350–800/person (AYCE) or ฿250–500 (a la carte)",
    type: "Korean BBQ (samgyeopsal, galbi)",
    must: "Samgyeopsal, chadolbaegi, beef bulgogi, banchan set",
    why: "Bangkok has an enormous Korean expat community. KBBQ quality rivals Seoul at half the price. AYCE options widely available.",
    tip: "Ladprao area: best bang-for-baht Korean BBQ. Thonglor: premium Korean experience with premium pricing.",
  },
  {
    name: "Yakiniku (Japanese BBQ)",
    emoji: "🎌",
    area: "Sukhumvit, Silom, Phrom Phong area",
    price: "฿400–1,500/person",
    type: "Japanese BBQ (wagyu, tan, harami)",
    must: "Wagyu beef (A4/A5), tan (tongue), harami (skirt steak), yukke (raw beef if brave)",
    why: "Bangkok's Japanese community has brought excellent yakiniku. Quality of wagyu at Bangkok yakiniku rivals Japan at better pricing.",
    tip: "Check for import certification — good yakiniku uses Australian or Japanese wagyu with documentation.",
  },
  {
    name: "Gai Yang (Thai Grilled Chicken)",
    emoji: "🐔",
    area: "Any northeast Thai (Isaan) restaurant — street stalls everywhere",
    price: "฿80–150/half chicken",
    type: "Isaan BBQ chicken (street stall)",
    must: "Gai yang (grilled chicken) with sticky rice and som tam. Always a whole or half chicken, never sliced.",
    why: "Best street BBQ in Bangkok. Isaan-style marination (lemongrass, turmeric, garlic, fish sauce). Charcoal-grilled. Endlessly addictive.",
    tip: "Look for the metal rotisserie stands with chickens spinning on the sidewalk. ฿120 a half chicken + ฿10 sticky rice.",
  },
];

export function BangkokBBQ() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🔥 BBQ in Bangkok — Thai, Korean, Japanese & more
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.type} · {s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ Order: {s.must}</div>
            <div className="text-[10px] text-orange-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
