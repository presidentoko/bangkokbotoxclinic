const PLANS = [
  {
    carrier: "True Move H",
    emoji: "📶",
    type: "Best for tourists — widest 5G coverage",
    price: "Tourist SIM ฿299–599 (7–30 days, unlimited data with speed cap at 1GB/day after fair-use)",
    where: "Suvarnabhumi/DMK airport, 7-Eleven, True shops in all malls",
    why: "Thailand's most tourist-friendly SIM. Pre-registered SIM — no Thai ID needed. Airtime + data bundled. International calls included on some packages.",
    tip: "Buy at airport arrival hall (counter clearly marked). 7-day unlimited: ฿299. 30-day unlimited: ฿599. Activate by scratching the code and calling the number on the package.",
  },
  {
    carrier: "DTAC (now NT)",
    emoji: "🔵",
    type: "Good coverage, reliable speeds",
    price: "Tourist SIM ฿299–499 (7–30 days)",
    where: "Airport, Central and Siam malls, standalone shops on Sukhumvit",
    why: "Former competitor to AIS and True, now merged with NT. Good 4G coverage countrywide. Some promotions beat True on price — worth comparing at airport.",
    tip: "Look for the blue logo. Registration sometimes required at counter vs True's self-activate. Ask staff to help register if purchasing at mall location.",
  },
  {
    carrier: "AIS",
    emoji: "🔴",
    type: "Thailand's largest carrier — rural and island coverage",
    price: "Tourist SIM ฿299–699 depending on data bundle",
    where: "AIS Passport SIM counters at airport, Big C, AIS shops",
    why: "Best carrier for visiting islands or rural Thailand — coverage where others drop out. Koh Samui, Pai, Khao Yai all have reliable AIS signal.",
    tip: "AIS Passport SIM specifically designed for tourists — most commonly recommended if traveling outside Bangkok. Ask for the 'AIS TOURIST SIM' specifically.",
  },
];

const TIPS = [
  "Bring your unlocked phone — Thai SIM cards are nano/micro/standard and shops will cut to size",
  "Buy at airport arrival immediately — skip the roaming bill. Setup takes 3 minutes.",
  "Line app (Thailand's WeChat) uses data, not SMS — WhatsApp works fine too",
  "5G coverage: only Bangkok and major cities. Everywhere else is 4G (still fast)",
  "Tethering/hotspot allowed on all tourist SIMs — great for traveling with tablets",
];

export function BangkokSimCardGuide() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        📱 Thai SIM card guide — which to buy & where
      </h2>
      <div className="space-y-2 mb-3">
        {PLANS.map((p) => (
          <div key={p.carrier} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{p.carrier}</div>
                <div className="text-[10px] text-[var(--muted)]">{p.type}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-blue-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
      <div className="border border-blue-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-blue-700 mb-1.5">Quick tips:</div>
        <ul className="space-y-0.5">
          {TIPS.map((t) => (
            <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-blue-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
