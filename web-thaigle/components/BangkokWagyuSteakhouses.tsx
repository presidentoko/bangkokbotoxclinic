const PICKS = [
  {
    name: "Char Restaurant (Marriott Marquis)",
    emoji: "🥩",
    area: "Sukhumvit Soi 22, Asoke",
    price: "Wagyu A5 ฿4,500–9,000/100g, dry-aged US beef ฿2,200–4,500",
    grade: "Full Japanese A5 menu + US dry-aged",
    why: "Bangkok's most complete steakhouse. Japanese A5 Wagyu from 5 prefectures (Kagoshima, Miyazaki, Kobe, Hokkaido, Hiroshima). Extensive dry-aged American and Australian beef. Sommeliers, proper wine service.",
    tip: "For A5 Wagyu first-timers: order 3–4 oz portions of 2 different prefectures. Full A5 richness becomes overwhelming past 6 oz. Pair with light red (Pinot Noir) not Cabernet — the fat cuts through better.",
  },
  {
    name: "Sühring (German fine dining with Wagyu)",
    emoji: "⭐",
    area: "Ekkamai area",
    price: "Tasting menu ฿5,800–8,500 (includes steak courses)",
    grade: "Michelin-starred, curated cuts",
    why: "Two-Michelin-star German restaurant in Bangkok includes premium wagyu as part of progressive tasting menus. Not pure steakhouse but consistently has some of Bangkok's best beef preparations. Chef twins' precision technique elevates every cut.",
    tip: "Book 3–4 weeks ahead. 9-course tasting menus only. Vegetarian menu available. Wagyu course changes seasonally. Excellent wine pairing program (additional ฿2,500–4,500).",
  },
  {
    name: "Bull & Bear (English-style steakhouse)",
    emoji: "🍺",
    area: "Sukhumvit 11",
    price: "Steaks ฿1,800–4,500, set ฿890",
    grade: "USDA Prime + Australian Wagyu",
    why: "Bangkok's classic expat steakhouse. USDA Prime and Australian Wagyu at accessible prices. Strong cocktail menu. Large portions. Business dinner atmosphere. Most reliable quality consistency in Bangkok.",
    tip: "Order the dry-aged rib-eye (USDA Prime) at ฿2,800 — remarkable value for quality. Happy hour specials 5–8pm. Accessible without reservation except Friday–Saturday evenings.",
  },
];

const GRADES = [
  "A5 Japanese Wagyu = marbling score 10–12. 60-70% fat intramuscular. Serve at room temp, eat in small portions",
  "A4 Wagyu = excellent marbling, 40-50% fat. More 'beefy' taste than A5, better for larger servings",
  "Australian Wagyu (Marble Score 6–9) = hybrid genetics, larger portions, similar richness to lower A4",
  "USDA Prime = 3–7% marbling. Much leaner than Wagyu. Better for those who want 'beef taste' not 'fat taste'",
  "Dry-aged beef: 28-day aging concentrates flavor and tenderizes. More complex and earthy than fresh cut",
];

export function BangkokWagyuSteakhouses() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥩 Wagyu & premium steakhouses in Bangkok — A5 guide & where to go
      </div>
      <div className="space-y-2 mb-3">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{p.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{p.grade} · {p.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-red-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-red-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-red-700 hover:bg-red-50">
          Wagyu & beef grade guide
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {GRADES.map((g) => (
            <li key={g} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{g}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
