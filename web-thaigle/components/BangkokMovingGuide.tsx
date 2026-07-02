const STEPS = [
  {
    step: "1. Visa & Entry",
    emoji: "🛂",
    what: "Non-Immigrant B (work), Non-Immigrant O (family/retirement), Thailand LTR Visa, or Thailand Elite Privilege Card depending on purpose and length of stay. Tourist visa/Visa Exempt entry (30 days, extendable) is NOT appropriate for long-term living — overstay fines are ฿500/day (maximum ฿20,000).",
    action: "Apply at Thai Embassy/Consulate in home country before arrival. Work permits require employer sponsorship or BOI-registered company. BOI companies can sponsor LTR visas directly. Thailand Elite (฿600,000 for 5 years, or ฿900,000 for 10 years) is the simplest long-term option for those without employment.",
  },
  {
    step: "2. Apartment Search",
    emoji: "🏢",
    what: "Bangkok's expat rental market is centered on Sukhumvit (BTS), Silom (BTS), Sathorn (MRT), and Rattanakosin (Old City). Service apartments offer short-term flexibility; condominiums offer better value on 1-year leases. Average: Sukhumvit 1-bed ฿20,000–60,000/month; Silom 1-bed ฿15,000–45,000/month.",
    action: "Facebook groups 'Bangkok Expat Rentals' and 'Bangkok Condo Rentals' are the best free search resources. DDProperty.com and Hipflat.com are the major listing sites. 1-year lease typically requires 2 months deposit + 1 month advance rent. Negotiate 10–20% below asking price in writing.",
  },
  {
    step: "3. Bank Account",
    emoji: "🏦",
    what: "Bangkok Bank, Kasikorn Bank (KBank), and SCB are the most expat-friendly. Requirements vary: Non-B visa holders can open accounts easily; tourist entry (no visa) typically requires employer letter or additional documentation. KBank K-Plus app and SCB Easy App are the best mobile banking apps for daily use.",
    action: "Bring: passport, visa, proof of address (rental contract or utility bill), and employment letter if on work permit. Bangkok Bank's Asoke branch and KBank's Asok-Sukhumvit branches have English-speaking staff. PromptPay (linked to passport number for foreigners) enables instant QR-code transfers.",
  },
  {
    step: "4. Health Insurance",
    emoji: "🏥",
    what: "Thailand has excellent private hospitals (Bumrungrad, Bangkok Hospital, Samitivej, Vejthani) but no public health insurance for foreigners. Private health insurance is essential — Bangkok's private hospital costs are moderate by international standards but significant without coverage. International health insurance costs ฿25,000–100,000/year depending on age and coverage.",
    action: "AIA (Thai company), Cigna Global, AXA, and Pacific Cross are common expat health insurers. Bumrungrad and Bangkok Hospital have their own insurance-like VIP memberships. Many expats use the Social Security System (SSS) if employed by Thai companies — ฿750/month employee contribution covers basic hospital care at government-listed hospitals.",
  },
];

export function BangkokMovingGuide() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        📦 Moving to Bangkok — visa, apartment, bank account & health insurance checklist
      </div>
      <div className="space-y-2">
        {STEPS.map((s) => (
          <div key={s.step} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.step}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{s.what}</div>
            <div className="text-[10px] text-indigo-700">→ {s.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
