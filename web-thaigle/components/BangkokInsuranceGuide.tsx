const TOPICS = [
  {
    title: "Health Insurance for Expats in Thailand",
    emoji: "🏥",
    summary: "Thailand does not require expats to have health insurance (unlike some other countries), but the financial exposure from private hospital treatment makes it essential. Thai private hospitals are excellent but expensive without insurance — an emergency appendectomy can cost ฿100,000–300,000; serious illness or accident treatment runs ฿500,000–5,000,000+. International health insurance plans for Thailand range from ฿30,000–150,000/year depending on age, coverage level, and whether you include international coverage.",
    action: "Recommended international health insurance for Bangkok expats: Cigna Global, AXA International (BUPA acquisition), Allianz Care, and Pacific Cross (regional specialist). For employees at international companies: employer group plans through the same providers are typically available. Thai domestic health insurance (from Bangkok Life, AIA Thailand, or Muang Thai Life) is cheaper but often has network restrictions and coverage gaps relevant to expats. Key things to verify: inpatient vs. outpatient coverage (outpatient is more expensive to add), pre-existing condition exclusion periods, dental inclusion, mental health coverage, and emergency evacuation.",
  },
  {
    title: "Digital Nomad & Remote Worker Coverage",
    emoji: "💻",
    summary: "Digital nomads in Bangkok (working remotely, typically on tourist visas or the Thailand LTR digital nomad visa) require health insurance that covers the country where they're physically located. Many 'travel insurance' policies have trip duration limits (90 days, 180 days) — nomads staying in Thailand 6–12 months need policies without residency restrictions. SafetyWing (subscription health insurance popular with nomads), Remote Health, and Cigna Connect are commonly used.",
    action: "SafetyWing Nomad Insurance (from SafetyWing.com): $45–100/month depending on age, covers 4 weeks at a time with automatic renewal, widely accepted in Bangkok private hospitals. Coverage gaps to note: it's not designed for long-term residents and has some coverage limitations vs. full expat health plans. For nomads planning extended Bangkok stays (6+ months): compare SafetyWing vs. a local Thai plan vs. an international expat plan — at some income levels, a Thai domestic plan from AIA or Muang Thai Life covering Bangkok hospitals provides better value.",
  },
  {
    title: "Car Insurance & Other Insurance in Thailand",
    emoji: "🚗",
    summary: "Compulsory motor insurance (Por Ror Bor — basic third party) is legally required for all vehicles in Thailand. Comprehensive car insurance is strongly recommended especially for foreigners — minor traffic incidents in Bangkok are common and liability can be significant. Condo insurance, renter's insurance (contents), and life insurance are all available through Thai and international providers.",
    action: "Car insurance: MSIG Thailand, Allianz Ayudhya, and AXA Thailand offer comprehensive policies popular with expats. Online comparisons at Rabbit Finance or Roojai (insurance comparison sites) help compare premiums. For condo renter's insurance: available from AIA, FWD, or Muang Thai Life — cover your personal belongings in a Bangkok condo for ฿2,000–5,000/year. Life insurance for expats: AIA Thailand is the largest provider and has English-speaking agents in the expat community. Key broker for expats: Maxima (specialist expat insurance broker in Bangkok) manages multiple providers.",
  },
];

export function BangkokInsuranceGuide() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏥 Insurance guide for Bangkok expats — health plans, nomad coverage & car insurance
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-blue-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-blue-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-blue-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-blue-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
