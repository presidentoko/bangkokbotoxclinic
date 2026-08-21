const NATURALLY_GF = [
  "Most Thai rice dishes: khao pad (fried rice), khao man gai (chicken rice), khao mok (biryani style)",
  "Tom Yum soup — rice noodle version (not wheat noodles). Ask: 'wun sen' (glass noodles) or 'guay tiew' (rice noodles)",
  "Thai BBQ / Gai Yang (grilled meats) — no wheat in marinades typically",
  "Som Tum (green papaya salad) — naturally gluten-free",
  "Larb (minced meat salad) — made with toasted rice, not wheat",
  "⚠️ Caution: Oyster sauce, soy sauce = contain wheat. Ask 'mai sai si iu' (no soy sauce) for strict GF",
];

const RESTAURANTS = [
  {
    name: "Broccoli Revolution",
    emoji: "🥦",
    area: "Sukhumvit 49",
    price: "Meals ฿280–450",
    why: "Clearly labels gluten-free items on menu. Plant-based kitchen uses tamari instead of soy sauce. Staff trained on allergen requests.",
    tip: "Tell them 'celiac disease' — staff understand the severity and take extra precautions vs just a preference.",
  },
  {
    name: "Gluten-Free Bangkok (Private Delivery)",
    emoji: "📦",
    area: "Delivery across Bangkok (Grab Food)",
    price: "Meals ฿200–400",
    why: "Specialist GF kitchen delivering GF baked goods, pasta, and meals. Founded by celiac expat. Dedicated kitchen with no cross-contamination. Available via Grab Food (search 'GF Bangkok').",
    tip: "Order the GF banana bread — it's genuinely good, not a compromise. Weekly box subscription available for longer stays. Best advance option vs searching restaurant menus.",
  },
  {
    name: "Emporium Supermarket (GF section)",
    emoji: "🏪",
    area: "EmQuartier B2",
    price: "Imported GF products vary",
    why: "Bangkok's best selection of imported gluten-free products. Schar pasta, GF cereals, tamari, GF flour for cooking. For self-catering expats or long-stay visitors.",
    tip: "Gourmet Market (Central Embassy, Emporium) has best selection. GF labels clearly marked. Imports from Australia/US/UK so prices 2–3x home — but available when needed.",
  },
];

export function BangkokGlutenFree() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🌾 Gluten-free eating in Bangkok — celiac-safe & GF options
      </h2>
      <div className="space-y-2 mb-3">
        {RESTAURANTS.map((r) => (
          <div key={r.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{r.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{r.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {r.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-yellow-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-yellow-700 hover:bg-yellow-50">
          Naturally gluten-free Thai dishes (safe to order)
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {NATURALLY_GF.map((d) => (
            <li key={d} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-yellow-400 shrink-0">•</span>{d}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
