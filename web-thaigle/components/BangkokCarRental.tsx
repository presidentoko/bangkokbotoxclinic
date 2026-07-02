const OPTIONS = [
  {
    name: "Budget Car Rental (Suvarnabhumi Airport)",
    emoji: "🚗",
    area: "Suvarnabhumi Airport arrivals level",
    price: "Economy from ฿900/day, compact SUV ฿1,400/day",
    why: "Most convenient pickup location. Budget, Avis, Hertz, and Thailand-local Thaisas all at airport. Economy class is sufficient for city driving. Insurance strongly recommended (included in most packages).",
    tip: "Book online 1 week ahead for best rates — airport counter rates are 30–50% higher than online. Automatic transmission is standard. Check car size: narrow Bangkok sois (alleys) need compact.",
    license: "IDP + home country license required",
  },
  {
    name: "DriveHub Thailand (Local company, best rates)",
    emoji: "💰",
    area: "Multiple city locations + delivery",
    price: "Economy from ฿650/day, SUV from ฿1,100/day",
    why: "Local Thai car rental with transparent pricing. No hidden fees. Can deliver car to your hotel. Better value than international brands. English-speaking customer service available.",
    tip: "Pay attention to mileage cap — unlimited km packages are worth the extra ฿100–200/day if driving outside Bangkok. Refuel policy: return full avoids surcharge. Photo-document scratches at pickup.",
    license: "IDP + home country license required",
  },
  {
    name: "GRAB with Driver (day hire)",
    emoji: "📱",
    area: "Bangkok-wide, book via Grab app",
    price: "GrabCar Hourly from ฿299/hour",
    why: "Best option if you want driving in Bangkok without the stress of navigating yourself. Grab offers hourly hire with driver. Great for day trips to Ayutthaya, Kanchanaburi, Khao Yai. No IDP required.",
    tip: "GrabCar Hourly (separate from regular Grab) — select 'Book now' → 'Hourly'. Minimum 3 hours. Negotiate in-app for day rates 8am–7pm. Driver is responsible for parking — you don't deal with it.",
    license: "Not needed — you're the passenger",
  },
];

const RULES = [
  "Drive on the LEFT in Thailand",
  "Speed limit: city 80km/h, highway 120km/h",
  "Seatbelt mandatory for all passengers",
  "No right turn on red unless signed otherwise",
  "Motorcycle taxis weave — expect sudden movements, stay aware",
  "Toll roads: expressways cost ฿25–85. Keep coins or use Easy Pass (rental car usually has it)",
  "Parking: use mall parking ฿30–50/hour. Street parking yellow lines = no parking",
];

export function BangkokCarRental() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🚗 Renting a car in Bangkok — options, costs & driving rules
      </div>
      <div className="space-y-2 mb-3">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.license} · {o.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-blue-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-blue-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-blue-700 hover:bg-blue-50">
          Thailand road rules at a glance
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {RULES.map((r) => (
            <li key={r} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-blue-400 shrink-0">•</span>{r}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
