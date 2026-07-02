const TOPICS = [
  {
    title: "Thai Personal Income Tax for Expats",
    emoji: "📋",
    summary: "Thailand taxes income based on residency, not nationality. Tax residents (spending ≥180 days/year in Thailand) are taxed on Thailand-sourced income and — since 2024 — on foreign income remitted to Thailand in the same tax year it was earned.",
    detail: "Tax year: January 1–December 31. Filing deadline: March 31 (paper) or April 8 (online). Progressive rates: 0–5% (under ฿150,000), 10% (฿150,001–300,000), 15% (฿300,001–500,000), 20% (฿500,001–750,000), 25% (฿750,001–1M), 30% (฿1M–2M), 35% (over ฿2M). Deductions available: personal allowance ฿60,000, spouse allowance ฿60,000, child ฿30,000 each, income-producing expenses 50% up to ฿100,000, Social Security contributions, health insurance premiums.",
  },
  {
    title: "2024 Rule: Foreign Income Remittance",
    emoji: "⚠️",
    summary: "From January 1, 2024, Thailand's Revenue Department changed interpretation: foreign-source income remitted to Thailand in the SAME tax year it was earned is now taxable for Thai tax residents. Previously, income earned before 2024 or kept offshore was not taxable.",
    detail: "This affects: digital nomads, remote workers, retirees receiving foreign pensions, and expats with offshore investments remitting funds. Thailand has Double Tax Agreements (DTAs) with 61 countries — income taxed abroad may be credited against Thai tax. Key: this is remittance-based, not worldwide taxation. Income NOT remitted to Thailand in the year earned remains untaxed. Tax advice from a licensed Thai accountant is strongly recommended for non-trivial income situations.",
  },
  {
    title: "Tax Filing & Accountants",
    emoji: "🧾",
    summary: "Expats with employment income from Thai employers typically have withholding tax managed by HR. Self-employed, freelancers, and those with foreign income must file themselves via the Thai Revenue Department e-Filing system or with a licensed accountant.",
    detail: "Recommended approach: PricewaterhouseCoopers (PwC) Thailand, Mazars Thailand, and smaller expat-focused firms like Acclime Thailand and Iglu handle expat tax filings. Cost: ฿3,000–15,000 for annual personal income tax filing. The Revenue Department e-Filing portal (efiling.rd.go.th) is in Thai but usable with Chrome autotranslate. E-Tax invoice registration is required for VAT-registered businesses.",
  },
];

export function BangkokTaxGuide() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        🧾 Thai income tax guide — expat residency rules, 2024 foreign income changes & filing
      </div>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-gray-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-gray-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-gray-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-gray-600 leading-snug">{t.detail}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
