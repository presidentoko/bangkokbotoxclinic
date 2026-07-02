const SPOTS = [
  {
    name: "Sourdough & Artisan Bread Bakeries",
    emoji: "🍞",
    area: "Ari, Thonglor, Silom, Ekkamai",
    price: "Sourdough loaf ฿180–350; Pastry ฿60–150",
    why: "Bangkok's artisan bread scene emerged post-2018 and matured significantly during COVID-era home baker to commercial transition. Dedicated sourdough bakeries: Proof (Silom), At Nine Bakery (Ari), Factory Coffee (Thonglor). Long fermentation, high-hydration doughs, stone deck ovens. The Bangkok humidity adds complexity to sourdough management — skilled bakers here have earned their technique.",
    tip: "Sourdough in Bangkok sells out by 9am at popular bakeries — arrive early or pre-order through LINE/Instagram the previous evening. Thai sourdough bakers often add local ingredients: pandan, butterfly pea flower, coconut — these aren't gimmicks but genuine flavor contributions from regional ingredients.",
  },
  {
    name: "Croissant & Viennoiserie",
    emoji: "🥐",
    area: "French bakery-influenced cafés — Phrom Phong, Thonglor, Asoke",
    price: "Croissant ฿80–180; Pain au chocolat ฿90–200",
    why: "Bangkok has an excellent viennoiserie scene driven by French-trained Thai bakers and French expat-owned bakeries. Flaky, properly laminated croissants are available at multiple Bangkok bakeries — Maison Dunand, On Lok Yun (historic), Paul bakery chain, and dozens of independent bakeries. The kouign-amann and canelé have also found dedicated Bangkok followings.",
    tip: "A properly laminated croissant has visible, distinct layers and shatters when bitten — if it's soft and bready, the lamination was insufficient. Bangkok's best croissants are comparable to Paris bakeries — the standard is genuinely high. Try butter croissant plain first before adding jam or fillings.",
  },
  {
    name: "Thai-Influenced Bakery Items",
    emoji: "🍮",
    area: "Everywhere in Bangkok — from 7-Eleven to artisan bakeries",
    price: "Street bakery ฿15–60; Artisan ฿80–200",
    why: "Bangkok's bakery culture merges Western technique with Thai flavors: pandan kaya toast, Thai milk tea croissant, butterfly pea flower cheesecake, taro cream puff, longan Danish, mango coconut tart. 7-Eleven's Thai Milk Tea custard bun is a beloved Bangkok snack. The fusion bakery approach reflects Bangkok's creativity rather than compromise — many of these items are genuinely excellent.",
    tip: "7-Eleven's bakery section (warmed items behind the counter) is a legitimate Bangkok food experience — the Japanese-influenced curry bread, tuna bread, and sweet cream bun are surprisingly good. The Thai milk tea custard bun is specifically recommended. Price: ฿20–35.",
  },
];

export function BangkokBakery() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍞 Bakeries in Bangkok — sourdough, croissants & Thai-fusion pastries
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
