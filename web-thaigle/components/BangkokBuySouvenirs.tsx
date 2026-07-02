const CATEGORIES = [
  {
    name: "Thai Silk & Textiles",
    emoji: "🪡",
    where: "Jim Thompson House Shop (best quality), Chatuchak Section 25–26, ICONSIAM SookSiam",
    price: "Silk scarves ฿300–2,000; Jim Thompson shirts ฿2,500–6,000",
    tip: "Real Thai silk is slightly rough to touch and shimmers when rotated. Synthetic feels slippery and consistent. Jim Thompson is expensive but authentic.",
    avoid: "Night markets near temples — likely polyester at Thai silk prices.",
  },
  {
    name: "Thai Handicrafts & Ceramics",
    emoji: "🏺",
    where: "Narayana Phand Craft Shop (Ploenchit), Chatuchak (Section 22–24), SUPPORT Foundation shops",
    price: "Celadon ceramics ฿150–1,500; benjarong pottery ฿300–3,000",
    tip: "SUPPORT Foundation shops run by the Royal Family sell the highest quality handicrafts at fair prices. Proceeds go to artisans.",
    avoid: "Identical 'painted elephant' sets at tourist shops — mass-produced in China.",
  },
  {
    name: "Thai Herbs & Wellness",
    emoji: "🌿",
    where: "Or Tor Kor Market, Villa Market, pharmacies near Wat Pho",
    price: "Herbal compress balls ฿80–200; Thai massage oil ฿120–400; tiger balm ฿50–150",
    tip: "Best value: Wattana Panich herb packs at Or Tor Kor Market. Tiger Balm is genuinely cheaper in Bangkok than abroad.",
    avoid: "Pre-packaged herbs near Grand Palace — often stale and overpriced.",
  },
  {
    name: "Amulets & Buddha Statues",
    emoji: "🏛️",
    where: "Amulet market near Tha Maharaj (Tha Phra Chan pier), Chatuchak Section 1",
    price: "Common amulets ฿50–500; rare collector pieces ฿10,000–100,000+",
    tip: "The amulet market is a serious religious marketplace — bargaining is fine but be respectful. Great for unique gifts.",
    avoid: "Do not bring Buddha images or amulets as purely decorative objects — culturally sensitive, and banned from export in some forms.",
  },
  {
    name: "Unique Thai Snacks (Food Gifts)",
    emoji: "🍡",
    where: "Tops Market, Villa Market, Chatuchak food section",
    price: "Mango jam ฿80–150; coconut candy ฿60–120; dried mango ฿80–200",
    tip: "Best food gifts: Pantai Norasingh fish sauce (iconic small bottle), Jack'n Jill Thai chips, Doi Kham royal brand products.",
    avoid: "Durian anything unless recipients specifically want it — very polarizing.",
  },
];

export function BangkokBuySouvenirs() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🛍️ Bangkok souvenirs — what to buy and where
      </div>
      <div className="space-y-2">
        {CATEGORIES.map((c) => (
          <details key={c.name} className="border border-orange-100 rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-orange-700 transition">
              <span className="text-lg shrink-0">{c.emoji}</span>
              <span className="flex-1">{c.name}</span>
              <span className="text-[10px] font-mono text-green-700 shrink-0">{c.price.split(";")[0]}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1.5">
              <div className="text-[10px]"><span className="font-bold">Where:</span> {c.where}</div>
              <div className="text-[10px]"><span className="font-bold">Price:</span> {c.price}</div>
              <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
              <div className="text-[10px] text-red-600">⚠️ Avoid: {c.avoid}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
