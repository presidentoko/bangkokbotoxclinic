const SPOTS = [
  {
    name: "Private Driver Services in Bangkok",
    emoji: "🚗",
    area: "Bangkok-wide, primarily for city transport, airport transfers, and day trip excursions",
    price: "Half-day (4 hours, Bangkok) ฿1,500–3,000; Full day (8–10 hours) ฿2,500–5,000; Airport transfer ฿800–2,000; Monthly driver ฿30,000–60,000",
    why: "Bangkok's private driver industry is well-developed and surprisingly affordable by Western standards — a full-day private driver (English-speaking, air-conditioned vehicle, gas included) can be arranged at rates that make it competitive with taxis for multiple stops in a day. Private drivers are particularly useful for: airport transfers with precise timing requirements (fixed price, no meter disputes, no risk of getting lost); day trips outside Bangkok where local knowledge matters (Kanchanaburi, Ayutthaya); multiple-stop city days with large luggage; business visits where car and driver are expected. Monthly private driver arrangements are common among senior expats and business executives — a full-time driver costs approximately ฿30,000–60,000/month including their time, with fuel additional or included by arrangement.",
    tip: "Bangkok private driver sourcing: the most reliable approach is referral from other expats or hotel concierge relationships. Thailand private driver networks on Facebook (search 'Private Driver Bangkok Expats') have vetted drivers with English reviews. Important considerations: verify English proficiency before the first hire — 'basic English' skill varies enormously; confirm the vehicle type and condition; for day trips, clarify whether tolls and fuel are included or additional (most drivers charge these separately). Grab Car (premium tier) is an app-based alternative for on-demand private car service that bridges the gap between taxi and private driver.",
  },
  {
    name: "Corporate & Business Transportation",
    emoji: "🏢",
    area: "Bangkok CBD, airport corridor, business park clusters (Silom/Sathorn, Asoke, Phetchaburi)",
    price: "Airport limousine transfer ฿1,200–2,800; Executive sedan half-day ฿2,500–5,000; Corporate Van/MPV full day ฿4,000–8,000; Monthly corporate account negotiated",
    why: "Bangkok's corporate transportation market has formal infrastructure serving the multinational and hotel corporate segment: airport limousine services (operated by AOT Limousine, Airports of Thailand, and private operators), limousine rental companies (Global Limo, Inter Limousine, Grand Limo), and major hotel concierge car arrangements. These services differ from private drivers in standardization: uniform pricing, professional uniforms, defined service standards, corporate account billing capability, and insurance/liability clarity. For corporate visitors: airport limousine pickup (driver with name sign in arrivals) from Suvarnabhumi is the standard for executive travel — pre-arranged, fixed price, reliable. For companies hosting large groups: airport greeting services and fleet van/bus arrangements for team airport transfers are standard event services.",
    tip: "Suvarnabhumi airport transport decision guide: (1) AOT Limousine (Airports of Thailand official) — counter in arrivals hall, reliable, fixed pricing by zone; (2) Pre-arranged hotel limousine — add to room bill, driver with name sign; (3) Grab Car (premium) — app-based, metered, requires Thai phone number to register; (4) Metered taxi — cheapest (฿300–600 to most Bangkok hotels plus expressway toll), but requires navigating the taxi queue and potential meter negotiation. Key warning: unofficial taxi touts in the arrivals area should be avoided — always use the official AOT taxi counter or apps. Expressway toll note: metered taxis charge tolls separately; private drivers and limousines typically include tolls in the quoted price.",
  },
  {
    name: "Inter-City Transportation — Bangkok to Key Cities",
    emoji: "✈️",
    area: "Bangkok Suvarnabhumi (BKK), Don Mueang (DMK), connections to Chiang Mai, Phuket, Koh Samui",
    price: "Bangkok–Chiang Mai: flight ฿800–4,000; VIP bus ฿700–1,200; Train sleeper ฿900–2,000. Bangkok–Phuket: flight ฿1,200–5,000; VIP bus 14 hours ฿1,000–1,800",
    why: "Bangkok is the transportation hub for all of Thailand — understanding the Bangkok-to-destination options is fundamental travel infrastructure knowledge. Domestic flights: AirAsia Thailand, Bangkok Airways, Nok Air, Thai VietJet, and Thai Airways operate domestic routes; Chiang Mai (1 hour, ฿800–3,500), Phuket (1.5 hours, ฿1,200–5,000), and Koh Samui (Bangkok Airways monopoly, premium prices) are the primary domestic routes. The competition between AirAsia and Bangkok Airways on the Chiang Mai and Phuket routes keeps prices competitive outside peak season. Budget airlines: Don Mueang Airport (DMK) serves budget airline departures (AirAsia, Nok Air); Suvarnabhumi (BKK) serves Thai Airways, Bangkok Airways, and some AirAsia routes — confirm which airport before booking.",
    tip: "Thailand inter-city travel optimization: (1) Book domestic flights 2–6 weeks ahead for best prices; last-minute prices spike dramatically during holidays; (2) The Bangkok–Chiang Mai overnight train (12 hours, leaves 6pm, arrives 7am) is the quintessential Thailand travel experience — second-class sleeper is clean, comfortable, and allows sightseeing time without losing a day; (3) For Koh Samui: Bangkok Airways runs a 'safari' concept where connecting through Surat Thani is sometimes cheaper than flying directly; (4) Phuket bus: VIP buses from Bangkok to Phuket (Southern Bus Terminal) take 12–14 hours — the modern 'VIP 24' air-conditioned coaches are comfortable; (5) Holiday booking: Songkran (April 12–15) and Chinese New Year are Bangkok transportation crunch times — book 1–3 months in advance.",
  },
];

export function BangkokChauffeur() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🚗 Bangkok private drivers & inter-city transport — chauffeurs, airport transfers & domestic travel
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-slate-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
