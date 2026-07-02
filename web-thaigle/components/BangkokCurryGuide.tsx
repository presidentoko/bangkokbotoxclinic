const CURRIES = [
  {
    name: "Green Curry (Gaeng Keow Wan)",
    emoji: "🟢",
    heat: "Medium-hot",
    base: "Coconut milk + green chilies + Thai basil",
    why: "Thailand's most popular curry internationally. Sweet from coconut milk, herby from basil, fragrant from lemongrass and kaffir lime. Usually chicken or fish ball. The 'gateway curry' for international visitors.",
    order: "Ask 'Gaeng Keow Wan Gai' (green curry chicken) — most restaurants have it. Best at traditional Thai restaurants, not fast-food chains.",
  },
  {
    name: "Massaman Curry (Muslim South Thai)",
    emoji: "🟤",
    heat: "Mild",
    base: "Coconut milk + peanuts + potato + slow-cooked beef",
    why: "Voted world's most delicious food by CNN in 2011. Persian-Thai Muslim origin. Rich, sweet, slightly spiced with cardamom, cinnamon, cloves. Beef slow-cooked 2+ hours. The most accessible Thai curry for mild palates.",
    order: "Gaeng Massaman Nuea (beef massaman). Peanuts and potatoes make it filling. Available at Muslim Thai restaurants in south Bangkok and Sathorn area.",
  },
  {
    name: "Red Curry (Gaeng Phed)",
    emoji: "🔴",
    heat: "Medium",
    base: "Red chili paste + coconut milk + Thai eggplant",
    why: "Similar to green curry but made with dried red chilies — slightly different flavor profile, less herby. More versatile with proteins. Duck red curry (Gaeng Ped Bped) is the elevated version.",
    order: "Order 'Gaeng Ped Bped Yang' (roast duck red curry) at upscale Thai restaurants — it's significantly better than chicken version. The crispy duck + rich red curry is a Bangkok specialty.",
  },
  {
    name: "Panang Curry (Phanaeng)",
    emoji: "🟠",
    heat: "Mild-medium",
    base: "Thick coconut milk + kaffir lime leaf + peanut",
    why: "Creamier, richer, and sweeter than red curry. Less broth — more sauce-like. Sliced beef or pork with shredded kaffir lime leaf on top. Often called 'dry red curry' — not quite, but closer to a coating than a soup.",
    order: "Phanaeng Nuea (beef panang). The sliced beef version is best — thin slices absorb the thick sauce well. Add jasmine rice (khao hom mali) — ideal pairing.",
  },
  {
    name: "Yellow Curry (Gaeng Kari)",
    emoji: "🟡",
    heat: "Mild",
    base: "Turmeric + coconut milk + potato + onion",
    why: "Most similar to Indian curry due to turmeric and cumin content. Mild, warming, aromatic. Chicken and potato version is universally appealing. Thai 'roti' (flatbread) served with yellow curry is popular street food combination.",
    order: "Gaeng Kari Gai (yellow chicken curry) at almost any Thai restaurant. The roti + yellow curry combination (฿30–50) is an excellent street food breakfast — find at morning Muslim food stalls.",
  },
];

export function BangkokCurryGuide() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍛 Bangkok curry guide — green, red, massaman & yellow explained
      </div>
      <div className="space-y-2">
        {CURRIES.map((c) => (
          <div key={c.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">Heat: {c.heat} · {c.base}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-orange-700">💡 {c.order}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
