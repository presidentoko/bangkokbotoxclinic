const ZONES = [
  {
    zone: "Platinum Fashion Mall",
    emoji: "👗",
    area: "Pratunam (Chitlom BTS, 10 min walk)",
    why: "Thailand's largest fashion wholesale mall. Over 2,000 shops. Bangkok's best cheap fashion. Both retail and wholesale.",
    prices: "T-shirts ฿80–120, dresses ฿150–300, shorts ฿60–100, shoes ฿200–500",
    tip: "Open 10am–8pm daily. Air-conditioned. Bring cash — most small vendors don't accept cards.",
    must: "Swim/beach wear (cheapest in Bangkok), Thai souvenir shirts, summer dresses",
  },
  {
    zone: "Siam Square",
    emoji: "🏙️",
    area: "Siam BTS",
    why: "Thai streetwear and local designer brands. Very popular with Bangkok's young creative class. Local brands like ASAVA, Gentlewoman, HHH.",
    prices: "฿300–3,000 per piece (local designer range)",
    tip: "Soi 1–7 have the most interesting independent boutiques. Walk the sois, not just the main blocks.",
    must: "Local designer brands, Thai fashion week-influenced pieces, streetwear",
  },
  {
    zone: "Chatuchak Section 2–4",
    emoji: "🛍️",
    area: "Mo Chit BTS (Sat–Sun only)",
    why: "Best vintage clothing in Southeast Asia. Real vintage 1960s–90s. Thai craft fashion. Custom tailors. Unique finds impossible elsewhere.",
    prices: "Vintage tees ฿200–800, denim ฿300–1,200, unique pieces ฿500–5,000",
    tip: "Section 2-4 maps available at entry. Best pieces go by 10am. Friday night market (6–10pm) is quieter and has great vintage section.",
    must: "Vintage Levi's (very cheap vs Western prices), Thai silk accessories, handmade crafts",
  },
  {
    zone: "EmQuartier & Emporium (Emdistrict)",
    emoji: "✨",
    area: "Phrom Phong BTS",
    why: "Bangkok's premium fashion destination. All international luxury brands plus best Thai premium designers. EmQuartier has best restaurant selection too.",
    prices: "International designer ฿3,000–100,000+. Thai premium brands ฿1,000–10,000",
    tip: "VAT refund available for tourism purchases over ฿2,000 per receipt. Ask for the form at purchase.",
    must: "Duty-free equivalents on some luxury goods. Thai premium brands for home gifts.",
  },
];

export function BangkokFashionShopping() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        👗 Bangkok fashion & shopping — where to find what
      </h2>
      <div className="space-y-2">
        {ZONES.map((z) => (
          <details key={z.zone} className="border border-pink-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-pink-50 transition">
              <span className="text-xl shrink-0">{z.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{z.zone}</div>
                <div className="text-[10px] text-[var(--muted)]">{z.area}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-pink-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{z.why}</div>
              <div className="text-[10px] text-green-700">💰 Prices: {z.prices}</div>
              <div className="text-[10px] text-orange-600">⭐ Must buy: {z.must}</div>
              <div className="text-[10px] text-pink-700">💡 {z.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
