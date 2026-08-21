const TOPICS = [
  {
    title: "Renting a Condo in Bangkok — Expat Guide",
    emoji: "🏢",
    summary: "Bangkok's condo rental market is deep and foreigner-friendly — foreigners can rent (not own, with exceptions) condos without restrictions. Central Bangkok studio condos: ฿8,000–20,000/month; 1-bedroom: ฿15,000–45,000; 2-bedroom: ฿25,000–80,000. Prime areas (Sukhumvit, Silom) command premiums; suburban areas (Lat Phrao, Ram Intra) offer more space for less.",
    action: "Rental process: typically 2-month deposit + 1-month advance rent upfront. Lease terms: 6-month minimum common, 1-year preferred by landlords. Thai lease contracts: get an English translation (common for expat landlords). Key areas: Sukhumvit (BTS access, international restaurants, walkable), Silom/Sathon (financial district, business expats), Ari/Phaya Thai (quieter, Thai residential, cheaper). Property search: DDProperty, Hipflat, and Dot Property are Thailand's main expat property platforms.",
  },
  {
    title: "Buying Property — Foreign Ownership Rules",
    emoji: "📋",
    summary: "Foreigners cannot own land in Thailand but CAN own condominium units (up to 49% of a building's total area can be foreign-owned). Foreign condo ownership is freehold (permanent title). Condominiums in Bangkok's popular areas are popular investment purchases for foreign nationals — prices range ฿2M (outer Bangkok) to ฿50M+ (luxury Sukhumvit). Minimum foreign transaction: funds must be transferred from abroad in foreign currency.",
    action: "Property purchase process: identify condo (ensure building hasn't exceeded 49% foreign quota — ask developer), hire Thai property lawyer (฿30,000–80,000 typical fee), transfer foreign currency to Thai bank (required documentation for land department), register title transfer at Land Department. Recommended areas for foreign investment: Sukhumvit (high rental demand from expats), Silom (office district), Sathorn (embassy district). Leasehold land: foreigners can lease Thai land for up to 30+30+30 years but this is complex legally.",
  },
  {
    title: "Short-Term & Serviced Apartments",
    emoji: "🛎️",
    summary: "Serviced apartments (hotel services + long-term rates) fill the gap between hotels and unfurnished condo rentals. Bangkok has extensive serviced apartment supply — popular with corporate relocations, families with school-aged children, and expats on short postings. Rates: ฿25,000–80,000/month for 1-bedroom serviced apartment with cleaning service, reception, pool, and gym included.",
    action: "Top serviced apartment brands in Bangkok: Oakwood Residence (multiple Sukhumvit locations), Fraser Suites (Sukhumvit, Sathorn), and Amari Residences. Corporate relocation packages typically use serviced apartments for the first 1–3 months while permanent housing is arranged. AirBnB and similar are technically in a legal grey zone in Thailand for individual condo owners (condo management rules vary) — serviced apartments are the legally clear alternative for anything under 30 days.",
  },
];

export function BangkokPropertyGuide() {
  return (
    <div className="rounded-2xl border border-stone-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🏢 Renting & buying property in Bangkok — expat condo guide, foreign ownership rules
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-stone-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-stone-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-stone-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-stone-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
