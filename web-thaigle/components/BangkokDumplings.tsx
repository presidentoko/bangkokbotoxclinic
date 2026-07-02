const PICKS = [
  {
    name: "Din Tai Fung",
    emoji: "🥟",
    area: "ICONSIAM, EmQuartier, CentralWorld",
    type: "Taiwanese / Shanghainese (xiao long bao)",
    price: "Xiao Long Bao (8 pieces) ฿290–420",
    why: "World's most famous xiao long bao chain — one Michelin star in multiple countries. Precision-made soup dumplings, 18 folds minimum standard. Pork and crab XLB is the ultimate.",
    tip: "Instructions: tip XLB onto soup spoon, bite small hole, sip soup, eat. Don't bite directly — hot soup inside. Truffle XLB seasonal — watch their social for availability.",
  },
  {
    name: "Hai Di Lao Dumpling (Chinese specialty shops)",
    emoji: "🫕",
    area: "Yaowarat (Chinatown), Huai Khwang area",
    type: "Northern Chinese (guotie, jiaozi)",
    price: "Pot stickers ฿80–160, Steamed dumplings ฿60–120",
    why: "Bangkok's Chinatown has authentic northern-style fried and steamed dumplings at local shops. Seek out family-run spots on Yaowarat Soi 11 and nearby lanes.",
    tip: "Yaowarat evening: look for steam coming from small shophouses — often the best quality. Dumplings with chili oil and black vinegar (available at most Chinese spots) is the authentic way.",
  },
  {
    name: "Tiew Yai (Bangkok mandu / gyoza fusion)",
    emoji: "🍢",
    area: "Near K-Town / Sukhumvit 20s",
    type: "Korean-style mandu influenced by Bangkok scene",
    price: "Mandu set ฿160–280",
    why: "Korean mandu (dumplings) have become popular in Bangkok's Korean quarter. Pan-fried pork and kimchi mandu, steamed beef. Perfect for those who enjoyed Korean food and want dumplings.",
    tip: "Look for K-pop themed restaurants around Sukhumvit 12–24 area for Korean-style dumplings. Mandu guk (dumpling soup) available in winter months.",
  },
];

const VARIETIES = [
  "Xiao Long Bao (小笼包) — Shanghainese soup dumpling with pork filling",
  "Har Gow (虾饺) — steamed crystal shrimp dumpling, dim sum staple",
  "Siu Mai (烧卖) — open-top pork+prawn steamed dumpling",
  "Gyoza (餃子) — pan-fried Japanese-style with pork and garlic chives",
  "Mandu (만두) — Korean dumpling, either fried or steamed",
  "Guotie (锅贴) — Northern Chinese pot stickers, crispy bottom",
];

export function BangkokDumplings() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🥟 Dumplings in Bangkok — xiao long bao, gyoza, mandu & more
      </div>
      <div className="space-y-2 mb-3">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{p.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{p.type} · {p.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-rose-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-rose-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-rose-700 hover:bg-rose-50">
          Dumpling varieties decoded
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {VARIETIES.map((v) => (
            <li key={v} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-rose-400 shrink-0">•</span>{v}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
