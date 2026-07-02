const TOPICS = [
  {
    title: "Bangkok Condo Market — Buying as a Foreigner",
    emoji: "🏢",
    summary: "Foreign nationals can legally purchase condominium units in Thailand subject to the quota rule: foreigners may own up to 49% of the total area of any condominium building's units. This makes Bangkok condos the primary legitimate property ownership vehicle for foreigners — land ownership is generally restricted to Thai nationals or Thai-majority companies. Bangkok's condo market is bifurcated: the 'foreign quota' units in any building are typically priced at a premium to Thai-quota units (higher demand, finite supply). Popular expat purchase areas: Sukhumvit corridor (Nana to Ekkamai, highest liquidity), Silom/Sathorn (business district, good rental yield), and emerging areas (Rama 9 — new CBD development; Bang Na — near BITEC convention center and Eastern Seaboard access). Price ranges: studio ฿2–4M; 1-bed ฿3–7M; 2-bed ฿6–15M; 3-bed+ ฿12–50M+; Luxury riverside ฿15–150M+.",
    action: "Bangkok condo buying process for foreigners: (1) Foreign Transfer of Funds Certificate (FTFC) — funds must be transferred from abroad in foreign currency and converted to Thai baht at a Thai bank, generating a certificate that proves foreign-sourced funds, which is required for the foreign quota ownership transfer; (2) Due diligence — confirm the foreign quota is available in the target building (not filled); (3) Title deed — 'Chanote' (full title) is the only fully secure Thai title; avoid 'Nor Sor 3' or lease arrangements unless with a lawyer's thorough review; (4) Transaction tax — transfer tax (2%), plus seller's specific business tax (3.3%) or stamp duty (0.5%), shared or negotiated between buyer and seller. Property management: for investment properties, property management companies handle tenant sourcing, rent collection, and maintenance for 8–15% of rental income.",
  },
  {
    title: "Bangkok Rental Market — Finding Accommodation",
    emoji: "🔑",
    summary: "Bangkok's rental market for foreigners is well-developed and negotiable — unlike many Asian cities, there is no formal restriction on foreigners renting property. Rental market structure: large serviced apartment buildings (monthly fully-furnished rentals with housekeeping) target short to medium-term expats; condominium rentals (owners renting individual units) are the primary middle-market; and house/townhouse rentals serve families needing space outside the BTS corridor. Primary search platforms: DDProperty (Thailand's largest property portal), Hipflat (more foreigner-friendly interface), Facebook groups (Apartments for Rent Bangkok, Expat Bangkok Property), and agent networks. Agent fees: typically paid by landlord (1 month rent commission), not by tenant — work with reputable agents rather than independent landlords for first rentals in Bangkok.",
    action: "Bangkok rental negotiation strategies: (1) Longer lease secures better monthly rate — 1-year lease gets 10–20% discount versus monthly; (2) Move-in date flexibility — if flexible, end-of-month can get additional concessions; (3) Furnished vs. unfurnished — furnished Thai rentals sometimes have low-quality furniture; negotiate furniture replacement or removal if needed; (4) Utilities — clarify whether electricity and water are billed at actual rate (Metropolitan Electricity Authority rates) or landlord-marked-up rates; some buildings charge 5–8 baht/unit versus MEA's approximately 4 baht/unit; (5) Deposit — typically 2 months deposit plus 1 month advance rent; confirm the deposit return process in writing.",
  },
  {
    title: "Bangkok Neighborhoods — Where to Live",
    emoji: "📍",
    summary: "Bangkok's residential neighborhoods for expats cluster around BTS/MRT access and lifestyle character: Sukhumvit Soi 1–20 (young expat, bars/restaurants, walking distance everything, higher cost); Thong Lor/Ekkamai (Sukhumvit Soi 55/63, upscale Japanese-Korean cafe culture, design consciousness, slightly calmer than Soi 11 area); Ari (quieter, coffee shop culture, families and creative professionals, local Bangkok charm); Silom/Sathorn (finance district, LGBTQ+ friendly, Lumphini Park access); Phrom Phong (Soi 39, Emporium mall, good family area, significant Korean and Japanese expat population); Bang Na/Srinakarin (suburban feel, larger condos/houses, near Eastern Seaboard and international schools in the southeast).",
    action: "Neighborhood selection framework: (1) Identify your primary anchor — office location, school, gym, or social hub — then map commute time (use Google Maps at 8am and 6pm to simulate rush hour reality); (2) BTS vs. MRT vs. neither — BTS-adjacent property commands significant premium but saves substantial daily time; (3) Lifestyle match — party/bar culture (Nana area, Soi 11), food/café culture (Thong Lor, Ari), family-residential (Ekkamai, Phrom Phong back-soi, Ari), business-functional (Silom, Sathorn); (4) Try before you buy — rent short-term in target neighborhoods before committing to a 1-year lease; (5) The soi depth premium: apartments on quiet sois (100–300m off main road) are substantially cheaper than street-front and typically more pleasant to live in.",
  },
];

export function BangkokRealEstate() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏢 Bangkok real estate — buying condos, renting apartments & choosing a neighborhood
      </div>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-orange-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-lg">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-orange-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-orange-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-orange-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
