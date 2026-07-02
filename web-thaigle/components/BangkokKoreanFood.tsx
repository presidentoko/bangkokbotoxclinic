const DISTRICTS = [
  {
    name: "Asok–Nana Korean Belt",
    emoji: "🇰🇷",
    stations: "BTS Asok (E4) or BTS Nana (E3)",
    why: "Highest concentration of Korean restaurants in Bangkok. Looks like a piece of Gangnam.",
    must: [
      "Sukhumvit Soi 12 — Korean BBQ row (grilled pork belly ฿250–450/set)",
      "Soi 12 convenience stores stock Korean snacks and Choco Pies",
      "Multiple jjigae + bibimbap spots open until 2am",
    ],
    tip: "Korean expat community center. Korean signs everywhere. BYO soju from 7-Eleven.",
  },
  {
    name: "Thonglor Korean Scene",
    emoji: "🏙️",
    stations: "BTS Thong Lo (E5)",
    why: "Upscale Korean dining + Korean café imports. 400+ Korean restaurants in the Thonglor area.",
    must: [
      "Korean BBQ: Ssambap, Wang Galbi, Baan Chicken (modern Korean)",
      "Korean café chain: Tom N Toms, Isaac Toast, Tous Les Jours",
      "Samyan Mitrtown KMart food hall — all Korean menu items",
    ],
    tip: "Most Korean expats live in Thonglor + Ekkamai. Authentic Korean food here rivals Seoul.",
  },
];

const FOOD_GLOSSARY = [
  { th: "삼겹살", rom: "Sam-gyeop-sal", mean: "Pork belly BBQ (most popular in BKK Korean BBQ)", price: "฿250–450/set" },
  { th: "김치찌개", rom: "Kimchi jjigae", mean: "Kimchi stew (comfort food, spicy)", price: "฿120–200" },
  { th: "된장찌개", rom: "Doenjang jjigae", mean: "Fermented soybean paste stew (mild)", price: "฿120–180" },
  { th: "비빔밥", rom: "Bibimbap", mean: "Mixed rice bowl with vegetables + egg", price: "฿130–220" },
  { th: "치킨", rom: "Chikin", mean: "Korean fried chicken (everywhere in BKK)", price: "฿280–480/set" },
];

export function BangkokKoreanFood() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🇰🇷 Korean food in Bangkok — where to eat
      </div>
      <div className="space-y-3 mb-3">
        {DISTRICTS.map((d) => (
          <div key={d.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{d.emoji}</span>
              <div>
                <div className="font-bold text-xs">{d.name}</div>
                <div className="text-[10px] text-[var(--muted)]">🚉 {d.stations}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1.5 leading-snug">{d.why}</div>
            <div className="space-y-0.5 mb-1">
              {d.must.map((m) => (
                <div key={m} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-blue-500">▸</span>{m}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-orange-600">💡 {d.tip}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-2">What to order</div>
      <div className="space-y-1.5">
        {FOOD_GLOSSARY.map((f) => (
          <div key={f.rom} className="flex items-start gap-2 border border-[var(--border)] rounded-lg px-2.5 py-1.5">
            <div className="text-xs font-black shrink-0">{f.th}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold">{f.rom}</div>
              <div className="text-[10px] text-[var(--muted)]">{f.mean}</div>
            </div>
            <div className="shrink-0 text-[10px] font-mono text-green-700">{f.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
