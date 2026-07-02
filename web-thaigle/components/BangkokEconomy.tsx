const TOPICS = [
  {
    title: "Bangkok's Economy — Thailand's GDP Engine & Key Industries",
    emoji: "📊",
    summary: "Bangkok generates approximately 30–40% of Thailand's total GDP while housing only 11% of the population, making it one of the world's most economically concentrated primate cities: (1) Core Bangkok industries: Bangkok's economy concentrates in finance and banking (headquarters of all major Thai banks: Bangkok Bank, Kasikorn Bank/KBank, SCB, Krungthai, TTB), tourism (Bangkok consistently ranks in top 5 globally for international visitor arrivals), trade and logistics (Bangkok's position as gateway to CLMV — Cambodia, Laos, Myanmar, Vietnam — markets), and services; (2) Manufacturing shifted outward: Bangkok's manufacturing base relocated to the Eastern Economic Corridor (EEC) — Chonburi, Rayong, and Chachoengsao provinces — as Bangkok labor and land costs increased; the EEC attracts electronics, automotive, aerospace, and medical device manufacturers; Thailand is the world's second-largest automobile exporter (Toyota, Honda, Isuzu production); (3) Tourism economy scale: pre-COVID, Bangkok received 22–25 million international visitors annually; tourism directly and indirectly generates 15–20% of Thailand's GDP; the collapse of Chinese tourism (2020–2023) demonstrated the vulnerability of this concentration; recovery is ongoing with shift toward Indian, Middle Eastern, and Western tourist markets; (4) Financial sector Bangkok: the Stock Exchange of Thailand (SET) market capitalization exceeds US$400 billion; Bangkok's banking sector is sophisticated with strong regional ambitions (Kasikorn Bank, SCB expanding across Southeast Asia); the Bank of Thailand (central bank) is headquartered in Bangkok; (5) Startup and VC ecosystem: Bangkok has Southeast Asia's third-largest startup ecosystem (behind Singapore and Jakarta); notable Thai tech companies include KBTG (Kasikorn Bank technology arm), Omise (payment infrastructure), Builk (construction SaaS); government support through National Innovation Agency and BOI (Board of Investment) subsidies attracts startups.",
    action: "Bank of Thailand (bot.or.th) for economic data and monetary policy; NESDC (National Economic and Social Development Council, nesdc.go.th) for GDP and economic reports; Stock Exchange of Thailand (set.or.th) for capital market data; BOI (Board of Investment, boi.go.th) for investment incentive information; Thailand Startup Ecosystem report (annual, various publishers) for current ecosystem status.",
  },
  {
    title: "Cost of Living in Bangkok — Current 2025-2026 Price Reality",
    emoji: "💰",
    summary: "Bangkok's cost of living occupies a paradoxical middle position — cheap relative to Western cities, expensive relative to Thai provinces, and with significant variation by lifestyle choice: (1) Accommodation cost ranges: shared housing in Bangkok: ฿5,000–10,000/month; private studio apartment (local market): ฿8,000–18,000/month; expat-standard 1BR condo (Sukhumvit, Silom): ฿20,000–50,000/month; luxury condo (central location): ฿50,000–200,000/month; serviced apartment (monthly rate): ฿30,000–100,000/month; (2) Food cost ranges: street food meal: ฿40–100; casual restaurant meal (Thai): ฿100–250; Western casual restaurant: ฿250–600; mid-range Thai or international restaurant: ฿400–1,200; fine dining: ฿1,500–5,000+; (3) Transportation monthly costs: BTS/MRT commuter (unlimited monthly): approximately ฿800–1,500 depending on zones; Grab daily: highly variable, ฿100–500+; car ownership (ownership + fuel + parking + insurance): ฿15,000–40,000+/month; (4) Lifestyle inflation in Bangkok: the most significant cost variable in Bangkok is lifestyle choice — eating street food vs. Western restaurants, living in a Thai neighborhood vs. expat enclave, using BTS vs. Grab everywhere creates dramatic cost differences; living a 'local Thai lifestyle' costs ฿20,000–35,000/month for a single person; living a 'Bangkok expat lifestyle' easily costs ฿80,000–200,000+/month; (5) 2024–2026 inflation context: Bangkok has experienced moderate inflation post-COVID; food prices increased 10–20% from 2019–2024; electricity costs increased significantly (EGAT rate increases); rental prices in popular expat areas increased 15–25%; the baht's strengthening against certain currencies has increased relative costs for some nationality groups.",
    action: "Numbeo.com (Bangkok cost of living index with user-submitted data); Expatistan.com Bangkok for comparison against other cities; Pantip Thailand forums for Thai community cost discussion; Bangkok Expats Facebook group for current real-world cost reports; BTS monthly pass pricing at bts.co.th; Thailand property portals (DDproperty, Hipflat) for current rental market prices.",
  },
  {
    title: "Banking & Money in Bangkok — Opening Accounts, Transfers & Currency",
    emoji: "🏦",
    summary: "Bangkok's banking system is efficient by Southeast Asian standards but has specific restrictions and requirements for foreigners: (1) Opening a Thai bank account as a foreigner: Thai banks (Bangkok Bank, Kasikorn/KBank, SCB, Krung Thai, TMBThanachart) require different documentation depending on visa status; the easiest cases: Non-Immigrant visa holders can typically open accounts with passport + visa + work permit or proof of residence; tourist visa holders face more restrictions (Bangkok Bank's downtown branch has been historically more accessible for tourists, though policies change); (2) ATM network: Bangkok has excellent ATM density (every 7-Eleven, major shopping mall, and most major intersections); Thai ATM usage by foreigners incurs two fees: the Thai bank's international transaction fee (฿220 per withdrawal, added to all Thai ATMs by agreement) and your home bank's foreign transaction fee; Wise debit card and Revolut cards avoid home-bank foreign transaction fees (though the Thai ฿220 surcharge still applies); (3) Money transfer to Thailand: major international transfer options include: Wise (competitive mid-market rate, typically best total cost); bank-to-bank SWIFT transfers (higher fees, slower); cash money transfer services (Western Union, MoneyGram, available at Bangkok banks and 7-Eleven); cryptocurrency to Thai baht (legal but the exchange on/off ramp has Thai financial regulations); (4) Thai baht stability: the Thai baht is a managed float currency with the Bank of Thailand intervening to maintain stability; the baht has been relatively stable against major currencies over the past decade with periodic fluctuations; Thailand's strong international reserves (consistently 200+ billion USD) support baht stability; (5) Digital payment in Bangkok: Thailand's PromptPay instant bank transfer system (linked to Thai national ID or mobile number) enables instant bank transfers between Thai accounts; QR code payment (linked to PromptPay) is the dominant payment method at street food stalls, markets, and many restaurants; international visitors with Thai bank accounts can use PromptPay; those without need cash or cards (card acceptance is high at modern venues, limited at street food).",
    action: "Wise (wise.com) for international transfers and multi-currency account; Bangkok Bank international branch (downtown) for foreigner account opening; Bank of Thailand (bot.or.th) for official exchange rate data; Thailand's promptpay.io for PromptPay registration; Krungsri/Ayudhya bank also known for accessible foreigner accounts; Tax reference: Revenue Department (rd.go.th) for Thailand income tax for foreign residents.",
  },
];

export function BangkokEconomy() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        📊 Bangkok economy — GDP industries, real cost of living & banking for foreigners
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-green-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-green-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
