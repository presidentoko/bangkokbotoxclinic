const TOPICS = [
  {
    title: "Thai Stock Market & Investment Accounts",
    emoji: "📈",
    summary: "The Stock Exchange of Thailand (SET) is Southeast Asia's second-largest stock exchange by market capitalization. Foreigners can invest in Thai-listed stocks through brokerage accounts — KTB Securities, Kasikorn Securities, and Bualuang Securities (Bangkok Bank) offer English-language brokerage services. The SET has historically provided returns comparable to other emerging market exchanges. Thai REITs (Real Estate Investment Trusts) and property funds listed on SET provide accessible property exposure without direct ownership restrictions.",
    action: "Opening a Thai brokerage account: requires a Thai bank account first, plus passport, proof of address, and tax ID (if resident). Processing time: 1–2 weeks for account approval. Online trading platforms: most major Thai brokers now have English-language mobile apps. For non-residents (investing from abroad): Interactive Brokers and Schwab International both provide access to SET-listed stocks through international brokerage platforms. Thai dividend withholding tax: 10% for foreigners (compared to 15% for Thai nationals), reduced by some tax treaties.",
  },
  {
    title: "BOI (Thailand Board of Investment) & Business Setup",
    emoji: "🏢",
    summary: "Thailand's Board of Investment provides significant incentives for foreign businesses in targeted industries (manufacturing, technology, advanced services, renewable energy, medical hub). BOI promotion includes corporate income tax exemptions (3–8 years), import duty reductions, and crucially — ability to own land and bring in foreign employees without the usual Thai visa restrictions. BOI is the most significant legal mechanism for foreign businesses wanting to operate in Thailand.",
    action: "BOI promotion eligibility: apply through BOI Thailand's online portal. Targeted industries include: data centers, cloud services, digital technology, biotech, aerospace MRO, automotive EV, and creative industries. The application process takes 60–90 days for approval; implementation then requires setting up a company. BOI-promoted companies can own land (normally restricted for foreigners), bring in unlimited foreign specialists, and receive immigration support for employees and families. This is a significant advantage for companies relocating regional headquarters to Thailand.",
  },
  {
    title: "Thailand LTR Visa — Long-Term Resident for Investors",
    emoji: "🛂",
    summary: "Thailand's Long-Term Resident (LTR) Visa (launched 2022) provides 10-year residency for qualifying high-income foreigners and investors. The 'Wealthy Global Citizen' category requires: $1M AUM OR $500k investment in Thai government bonds, Thai property, or Thai companies. Benefits: 10-year renewable visa, 80% personal income tax reduction for foreign-sourced income, work permit for 4 family members, fast-track immigration lanes.",
    action: "LTR Visa application: apply through the Board of Investment's LTR Visa platform. Required documents: evidence of income ($80,000+/year passive) or assets ($1M+ investment portfolio), health insurance (required), background check. Processing: 20–30 working days. The LTR Visa is specifically designed to attract high-net-worth individuals to Thailand as residents — the 80% income tax reduction on foreign-sourced income makes it particularly attractive for those with offshore business or investment income. Legal advice: engaging a qualified Thai immigration lawyer for the LTR application is strongly recommended.",
  },
];

export function BangkokInvestmentGuide() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        📈 Investing in Thailand — SET stocks, BOI business incentives & LTR investor visa
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-green-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-green-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-green-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-green-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
