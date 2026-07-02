const TOPICS = [
  {
    title: "Thailand Retirement Visa (Non-Immigrant O-A)",
    emoji: "🛂",
    summary: "The Thailand Retirement Visa (Non-Immigrant O-A) requires: age 50+, financial proof (800,000 THB in a Thai bank OR 65,000 THB/month income OR a combination), health insurance (mandatory since 2020: 40,000 THB outpatient / 400,000 THB inpatient minimum), and no criminal record. The visa grants 1-year stay, renewable annually without leaving Thailand. Extension is done at local Immigration offices. The financial requirement (800k THB = ~$22,000 USD) is either deposited in a Thai bank account 2 months before application OR shown as monthly income/pension deposits.",
    action: "Retirement visa application process: obtain a Non-Immigrant O visa from a Thai embassy/consulate in your home country first (valid 90 days), then apply for the 1-year extension at a Thai Immigration office. Required documents: passport, visa application form, bank letter showing 800k deposit or monthly income evidence, health insurance certificate, passport photos. The 90-day reporting requirement (notifying Immigration of your address every 90 days) continues annually — can be done online or at Immigration offices. Retire Thailand Visa agencies (authorized by Immigration) can manage the process for ฿5,000–15,000/year.",
  },
  {
    title: "Cost of Retirement Living in Bangkok",
    emoji: "💰",
    summary: "Bangkok retirement costs depend heavily on lifestyle choices — budget retirees can live very comfortably on $1,500–2,000/month USD, while luxury-lifestyle retirees spend $4,000–8,000+/month. Core costs: apartment (฿8,000–25,000/month depending on location and size); food (฿6,000–15,000/month for comfortable eating including restaurants); transport (฿3,000–8,000/month including Grab and BTS); healthcare (฿15,000–30,000/year for health insurance + out-of-pocket). Bangkok's overall cost is 40–60% below equivalent Western city standard — the same lifestyle costs significantly more in London, Sydney, or New York.",
    action: "Bangkok retirement budget planning: create a spreadsheet with fixed costs (rent, insurance, phone/internet) and variable costs (food, entertainment, travel). The 800,000 THB bank requirement can serve as the emergency fund simultaneously. Most Bangkok retirees live in Sukhumvit area (easy access to international food, English-speaking services, expat community) — rent there runs ฿12,000–30,000/month for a comfortable 1–2BR apartment. Cheaper options: Ari, Ladprao, Ratchada areas offer similar quality apartments at lower prices. Healthcare: Thailand's private hospitals provide world-class care at 20–40% of Western costs — routine care, dental, and specialist consultations are highly affordable.",
  },
  {
    title: "Bangkok Retiree Community & Lifestyle",
    emoji: "🌅",
    summary: "Bangkok's retiree expat community is large, well-organized, and diverse — nationalities include British (largest group), American, Australian, German, Scandinavian, and East Asian retirees. Community organizations: American Women's Club Bangkok, British Club Bangkok (one of Asia's oldest expat clubs, founded 1903), Scandinavian Association, Australian-New Zealand Association. Activities: golf (Bangkok has world-class courses at competitive rates), regular expat lunch gatherings, volunteer work, temple tourism, regional travel (easy from Bangkok to all of Southeast Asia). Bangkok's hospital infrastructure specifically serves medical retirees — Bumrungrad International is a global medical tourism destination.",
    action: "Bangkok retiree integration: join the British Club Bangkok or equivalent national club for immediate social network. Bangkok Expats group on Facebook is the largest English-language expat community online — questions about retirement logistics are answered daily by experienced Bangkok retirees. For healthcare management: register with an international-level hospital (Bumrungrad, Samitivej, Bangkok Hospital, BNH Hospital) before you need emergency care — doctor relationship and medical record establishment matters. For retirees with health conditions: Thailand's medical expertise in cardiology, orthopedics, and oncology is notable — major treatments available at specialist-staffed hospitals at international standard.",
  },
];

export function BangkokRetireLiving() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🌅 Retiring in Bangkok — retirement visa, costs & expat retiree community
      </div>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-orange-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
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
