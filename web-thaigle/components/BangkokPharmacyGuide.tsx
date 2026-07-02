const CHAINS = [
  {
    name: "Boots Pharmacy (Thailand)",
    emoji: "💊",
    area: "All major malls: Central, The Mall, Siam Paragon, Airport, everywhere",
    price: "International brand pricing. European-style OTC medications.",
    why: "Most familiar for British and European travelers. Same-chain products as home. Strong cold & flu and skincare sections. No prescription required for most OTC meds.",
    tip: "Thai Boots stocks products not found in UK/Australian stores — Thai snail cream, herbal supplements, SASA cosmetics. Pharmacist speaks English in most central locations.",
  },
  {
    name: "Watsons (W.H.G. Pharmacy)",
    emoji: "💉",
    area: "Near every BTS station and mall",
    price: "Generally cheaper than Boots. Same core products.",
    why: "Hong Kong-based chain with massive Bangkok footprint. Most comprehensive OTC selection in Thailand. Generic Thai pharmaceuticals available at very low prices.",
    tip: "Generic Thai paracetamol (Panadol equivalent): ฿15–30 for 10 tablets vs Panadol brand ฿40–80. Ask for 'ya kaew' (pain reliever) for generic recommendation.",
  },
  {
    name: "Fascino Pharmacy (Independent)",
    emoji: "🏥",
    area: "Scattered across Bangkok — look for green cross sign",
    price: "Cheapest for generics. Some prescription drugs available with Thai ID.",
    why: "Thailand's independent pharmacy culture. Cheaper than chain pharmacies. More willing to provide certain medications without strict prescription in some cases.",
    tip: "Thailand has more lenient OTC rules than Western countries: certain antibiotics, sleep aids, and anxiety medications are available OTC. Consult your doctor from home before self-medicating.",
  },
  {
    name: "What to buy in Bangkok pharmacies",
    emoji: "🛍️",
    area: "Boots, Watsons, or independent pharmacies",
    price: "List below",
    why: "Thailand's pharmaceutical prices are significantly lower than Western markets for many common medications and healthcare products.",
    tip: "Useful buys: Differin (adapalene acne gel) ฿150 (vs ฿30+ in many Western pharmacies), AHA/BHA skincare products at Thai-brand prices (฿100–300), Tiger Balm (authentic ฿40–80), generic ibuprofen (฿15–30 for 10 tablets).",
  },
];

export function BangkokPharmacyGuide() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        💊 Bangkok pharmacies — what's available, what's cheap, what to buy
      </div>
      <div className="space-y-2">
        {CHAINS.map((c) => (
          <div key={c.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-green-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
