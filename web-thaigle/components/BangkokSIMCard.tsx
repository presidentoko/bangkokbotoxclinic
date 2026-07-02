const CARRIERS = [
  {
    name: "AIS — Best Coverage",
    emoji: "📱",
    plans: "Tourist SIM (8-day ฿299, 30-day ฿699); Unlimited plans from ฿399/month",
    why: "Thailand's largest carrier by network quality. Best coverage outside Bangkok in rural areas and resort islands. Speed typically fastest among Thai carriers. Tourist SIMs available at Suvarnabhumi Airport (Arrivals Level 2), 7-Eleven, and AIS shops. Long-term residents prefer AIS for reliability across Thailand.",
    tip: "Buy at the airport on arrival — AIS booth in the arrivals hall has English-speaking staff. The ฿299 8-day tourist SIM has adequate data for a short trip (15GB high-speed). Long-stay: AIS prepaid unlimited at ฿599/month is the most popular budget plan among expats.",
  },
  {
    name: "DTAC — International Roaming",
    emoji: "🌐",
    plans: "Tourist SIM ฿279–599; Monthly plans from ฿299",
    why: "DTAC (now merged with True to form dtac-True) historically best for international roaming deals. Budget plans are slightly cheaper than AIS. Coverage is competitive in Bangkok but weaker in very rural areas. The dtac app has good English interface. Popular with budget travelers and short-term visitors.",
    tip: "DTAC tourist SIMs are widely available at airports and 7-Eleven stores. Topup via 7-Eleven or online. If your main usage is in Bangkok, DTAC's budget plans offer excellent value — coverage in the city is comparable to AIS.",
  },
  {
    name: "True Move H — Data Speeds",
    emoji: "⚡",
    plans: "Tourist SIM ฿299–799; True Unlimited from ฿349/month",
    why: "Following the DTAC-True merger, the combined network covers the most towers in Thailand. True Move H often wins speed tests in Bangkok — particularly in dense urban areas. True's unlimited plans are competitively priced. Popular in tourist areas (Phuket, Koh Samui) as True had the strongest island coverage pre-merger.",
    tip: "True unlimited plans (often available through LINE promotions or True shop walk-ins) can be as low as ฿349/month for 1Mbps throttled unlimited + 15GB full-speed. If data speed is the priority, True often wins speed benchmarks in Bangkok.",
  },
];

const PRACTICAL = [
  "All Thai carriers require passport registration for SIM purchase — this is mandatory by law.",
  "eSIM: AIS, DTAC, True all offer eSIM tourist options — purchase online before arrival at their websites for immediate digital activation.",
  "Tethering: all tourist SIMs allow hotspot/tethering — share your SIM connection with laptop for remote work.",
];

export function BangkokSIMCard() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        📱 SIM cards in Bangkok — AIS, DTAC & True Move H tourist & monthly plans
      </div>
      <div className="space-y-2 mb-3">
        {CARRIERS.map((c) => (
          <details key={c.name} className="border border-sky-100 rounded-xl p-3">
            <summary className="cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <span className="text-xl shrink-0">{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs">{c.name}</div>
                  <div className="text-[10px] text-[var(--muted)]">{c.plans}</div>
                </div>
              </div>
            </summary>
            <div className="mt-2 text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-sky-700">💡 {c.tip}</div>
          </details>
        ))}
      </div>
      <div className="border-t border-sky-100 pt-2 space-y-1">
        {PRACTICAL.map((p) => (
          <div key={p} className="text-[10px] text-[var(--fg)] leading-snug">• {p}</div>
        ))}
      </div>
    </div>
  );
}
