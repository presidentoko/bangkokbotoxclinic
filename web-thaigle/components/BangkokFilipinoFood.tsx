const RESTAURANTS = [
  {
    name: "Barrio Fiesta Bangkok",
    emoji: "🇵🇭",
    area: "Sukhumvit 11 area",
    price: "Set meals ฿220–380",
    why: "Bangkok's most established Filipino restaurant. Lechon (roasted pork), sinigang (sour soup), adobo (vinegar-braised chicken/pork), kare-kare (peanut oxtail stew). Popular with OFW (Overseas Filipino Workers) community in Bangkok.",
    tip: "Order sinigang na baboy (pork sinigang) — the sourness from tamarind is unmissable. Rice portions are large. Sunday lunch is community gathering day — busiest and most atmospheric.",
  },
  {
    name: "Little Manila (Sukhumvit area)",
    emoji: "🍚",
    area: "Sukhumvit 22 / Asoke area",
    price: "Casual mains ฿150–280",
    why: "More casual Filipino canteen style. Rotating daily specials follow Filipino family-style cooking. Pancit (noodles), lumpia (spring rolls), binagoongan (pork with shrimp paste). Friendly and informal atmosphere.",
    tip: "Ask about the 'turo-turo' (point-point) specials at lunch — pre-cooked dishes you point at and order. Cheapest way to try multiple dishes. Halo-halo (crushed ice dessert) available as dessert.",
  },
  {
    name: "Filipino Store / Expat Community (Facebook group)",
    emoji: "📦",
    area: "Home delivery / community event",
    price: "Home-cooked delivery ฿180–350",
    why: "Active Filipino expat community in Bangkok sells home-cooked Filipino food via Facebook groups. More authentic than restaurants (family recipes, not adapted for Thai palate). Great variety including regional Filipino dishes not in restaurants.",
    tip: "Search 'Filipino Food Bangkok' or 'OFW Bangkok Food' on Facebook. Community-organized parties often welcome Thai/international guests — good way to experience Filipino hospitality. Ube (purple yam) desserts frequently available.",
  },
];

const MUST_TRY = [
  "Lechon — whole roasted pig, crackling skin, smoky. Filipino national dish",
  "Sinigang — sour tamarind soup with pork/fish. Comfort food, nothing like it",
  "Adobo — garlic + vinegar braised chicken or pork. The dish that defined Filipino cooking",
  "Kare-kare — oxtail in peanut sauce with shrimp paste. Unusual but deeply satisfying",
  "Halo-halo — crushed ice with sweet beans, ube ice cream, jellies. Filipino summer drink-dessert",
  "Lumpia — thinner than Chinese spring rolls, more herb-forward",
];

export function BangkokFilipinoFood() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🇵🇭 Filipino food in Bangkok — where to find authentic Pinoy cuisine
      </h2>
      <div className="space-y-2 mb-3">
        {RESTAURANTS.map((r) => (
          <div key={r.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{r.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{r.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-blue-700">💡 {r.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-blue-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-blue-700 hover:bg-blue-50">
          Must-try Filipino dishes explained
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {MUST_TRY.map((d) => (
            <li key={d} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-blue-400 shrink-0">•</span>{d}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
