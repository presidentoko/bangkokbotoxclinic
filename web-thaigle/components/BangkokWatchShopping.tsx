const OPTIONS = [
  {
    type: "Authentic Luxury Watches",
    emoji: "⌚",
    where: "Authorized dealers: Central Embassy, ICON SIAM, Siam Paragon",
    brands: "Rolex (Emperor Watch & Jewellery), Omega, TAG Heuer, IWC, Patek Philippe (Cortina Watch)",
    price: "Full retail price. Thai prices usually slightly below most Western markets due to tax refund option.",
    why: "Thailand's 7% VAT is refundable at the airport for purchases over ฿5,000 from VAT-registered shops. Can save 5–6% on a new watch.",
    tip: "Ask for VAT refund form at point of sale. Process at the Revenue Department desk at airport before checking in. Up to 1–2 hours wait at peak times.",
  },
  {
    type: "Pre-Owned / Grey Market",
    emoji: "🔍",
    where: "SpecialCase (Silom Complex), Pawn shops (Yaowarat Chinatown), Palladium Mall (Victory Monument)",
    brands: "All major brands. Rolex sports models, Omega Speedmaster, Vintage Pateks",
    price: "10–40% below retail depending on condition and demand",
    why: "Bangkok has one of Asia's best secondhand watch markets. Chinese New Year is peak trading season when Hong Kong collectors sell in Bangkok.",
    tip: "Always verify authenticity. SpecialCase has authentication service. Bring a jeweler's loupe or use phone camera macro for movement inspection.",
  },
  {
    type: "Replica / Clone Watches (Tourist Trap)",
    emoji: "⚠️",
    where: "Patpong Night Market, MBK basement, Khao San Road vendors",
    brands: "Every brand — all fake",
    price: "฿500–3,000 per watch",
    why: "Not recommended. Buying is technically illegal in Thailand (trademark violation). Customs in many countries confiscate replicas on return.",
    tip: "Know the difference: replica sellers approach with sample cards showing watch photos. If approached, politely decline. These are not for real watch enthusiasts.",
  },
  {
    type: "Thai Designer & Affordable Brands",
    emoji: "🎨",
    where: "ICON SIAM design district, Siam Discovery",
    brands: "Wada (Thai brand), MVMT (stocked at Central), Casio (G-Shock huge in Thailand), Citizen",
    price: "฿500–8,000",
    why: "Thailand's creative economy has produced interesting watch designs. Casio G-Shock collaborations with Thai artists are collector items.",
    tip: "G-Shock limited Thai collaborations: Central Department Store and Casio's own stores have the widest selection. MBK has them cheaper but less variety.",
  },
];

export function BangkokWatchShopping() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        ⌚ Bangkok watch shopping — luxury, pre-owned & what to avoid
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <details key={o.type} className="border border-gray-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.type}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.brands}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-gray-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{o.why}</div>
              <div className="text-[10px] text-gray-700">📍 Where: {o.where}</div>
              <div className="text-[10px] text-orange-600">💡 {o.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
