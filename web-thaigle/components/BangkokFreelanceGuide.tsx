const TOPICS = [
  {
    title: "Visa Options for Freelancers in Thailand",
    emoji: "🛂",
    summary: "No dedicated freelance visa exists in Thailand — freelancers working remotely for foreign clients commonly use the Thailand LTR (Long-Term Resident) Visa with 'Remote Worker' category (requires $80k+/year income), the SMART Visa (for digital economy / tech professionals), or border runs combined with tourist visas. The most practically common approach for freelancers earning under LTR thresholds: 60-day tourist visa + 30-day extension (90 days) with periodic border runs, or neighboring country visa runs (most commonly Penang, Malaysia or Vientiane, Laos for Thai visa on arrival). Work legally from Thailand in an online capacity without a Thai work permit when working for foreign clients paying you outside Thailand.",
    action: "Visa strategy: if your income exceeds $80k/year, apply for LTR Visa Remote Worker category — 10-year visa with legitimate right to be in Thailand. If under that threshold: the Tourist Visa + extension route works practically for many years. Consult a Thailand immigration lawyer for your specific situation. Thailand Elite Visa (5–20 year multi-entry) is another option for those who can afford the ฿600,000–2,000,000 fee. Key rule: a Work Permit is required for working in Thailand — remote work for foreign clients is a grey area legally, not a criminal risk, but a technical violation.",
  },
  {
    title: "Income, Invoicing & Tax for Remote Workers",
    emoji: "💰",
    summary: "Thailand's tax treatment of foreign-source income changed significantly in 2024 — income earned overseas and remitted to Thailand in the same tax year is now taxable in Thailand. Freelancers living in Thailand should track foreign income remittance timing. A Tax ID (TIN) is obtainable from the Revenue Department and needed for legitimate financial activities. If you spend 180+ days in Thailand, you are a tax resident. Tax rates: progressive 0–35%, with a personal allowance of ฿60,000. The Thai-foreign tax treaties (US, UK, Germany, France, and others) affect double-taxation — check your home country's treaty with Thailand.",
    action: "Practical tax compliance: register with the Thai Revenue Department for a TIN, file annual income tax returns (by March 31 for the prior calendar year), and keep records of income and remittances. For invoicing clients abroad: Thai freelancers often use international payment platforms (Wise, Payoneer, SWIFT) — keep records of all incoming payments. Professional advice: a Thai accountant familiar with international freelancer situations (฿3,000–8,000/year accounting fees for simple freelance situations) handles the complexity. Do not ignore Thai tax obligations — while enforcement has historically been lenient, the 2024 rule change signals increasing seriousness.",
  },
  {
    title: "Freelance Rates, Clients & Remote Work Platforms",
    emoji: "💻",
    summary: "Bangkok's cost of living advantage allows international freelancers to price competitively while maintaining a high living standard locally. Western market rates (USD/EUR-priced projects) allow Bangkok-based freelancers to earn relative affluence — a US-market software freelancer charging $100/hour works 2–3 hours per day to cover Bangkok's middle-class lifestyle costs. Upwork, Toptal, Contra, and specialized platforms (99designs for designers, Arc.dev for developers) connect Bangkok-based freelancers with international clients. The Bangkok coworking community also generates local Thai startup and SME clients who often prefer hiring within their timezone.",
    action: "Rate-setting strategy: research your category on Glassdoor and Upwork for Bangkok-located freelancers — rates vary significantly by skill. For Western-market clients: quote in USD/EUR regardless of your Thailand base (the currency you're billed in matters for your competitiveness). Client diversification: 3–5 regular clients is more stable than 1 large client in Bangkok's freelance ecosystem. Thai clients: local Thai startups often pay lower rates than international clients but provide easier timezone communication and relationship-building opportunities. Freelance community: Bangkok Digital Nomad and Bangkok Freelancers Facebook groups share client recommendations, rate guidance, and platform experiences.",
  },
];

export function BangkokFreelanceGuide() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        💻 Freelancing in Bangkok — visa options, tax compliance & remote work rates
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-indigo-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-indigo-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-indigo-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-indigo-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
