const OPTIONS = [
  {
    name: "Thai Floral Garland Making (Phuang Malai)",
    emoji: "💐",
    area: "Pak Klong Talad Flower Market, cultural workshops",
    price: "Workshop ฿400–1,200",
    why: "Phuang malai (Thai jasmine and flower garland) is an ancient Thai craft — garlands are offered to Buddha images, monks, and sacred objects. Pak Klong Talad (Bangkok's main flower market, open 24hrs) sells individual flowers. Cultural workshops teach the traditional needle-and-thread method of stringing jasmine buds, marigolds, roses, and orchids into the traditional conical shape.",
    tip: "Pak Klong Talad is best visited at 3am–5am when fresh flowers from the provinces arrive. The garland-making technique is surprisingly precise — the string tension and spacing determines the final appearance. Thai temples accept homemade garlands if made with genuine care — offering a self-made phuang malai is meaningful.",
  },
  {
    name: "Ikebana (Japanese Flower Arranging) in Bangkok",
    emoji: "🌸",
    area: "Bangkok Japanese cultural associations and lifestyle studios",
    price: "Classes ฿800–2,000; Monthly membership ฿3,000–6,000",
    why: "Ikebana has a following among Bangkok's Japanese expat community and Thai lifestyle enthusiasts. Classes follow Ikenobo, Ohara, or Sogetsu schools — each with distinct philosophies about negative space, line, and natural form. Bangkok has certified Sogetsu and Ikenobo teachers. The meditative, minimalist aesthetic appeals to Bangkok's wellness-oriented community.",
    tip: "Sogetsu school is most accessible to non-Japanese students — less strict formality than Ikenobo. Materials (stems, kenzan/pin frog, vessel) are provided in workshops but membership programs expect you to acquire your own. The Sogetsu Bangkok chapter is active on Facebook.",
  },
  {
    name: "Modern & Dried Flower Arranging Workshops",
    emoji: "🌿",
    area: "Creative studios in Ari, Ekkamai, and online community",
    price: "Workshop ฿800–2,500",
    why: "Contemporary wreath-making, table centerpiece arrangement, and dried flower installation workshops have become popular in Bangkok's lifestyle studio scene. Korean and Japanese minimalist flower arrangement styles are influential. These workshops produce an Instagram-worthy physical takeaway — dried flower arrangements last months without maintenance. Popular bachelorette party activity.",
    tip: "Dried flower workshops are booked most easily through creative studio Instagram accounts — search 'Bangkok flower workshop' and check the Stories and Reels section. Dried flower materials are increasingly available at Chatuchak Weekend Market if you want to continue the hobby independently.",
  },
];

export function BangkokFlowerArranging() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💐 Flower arranging in Bangkok — Thai garlands, ikebana & dried flower workshops
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-pink-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
