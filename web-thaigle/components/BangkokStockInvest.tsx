const TOPICS = [
  {
    title: "Thailand's Stock Market (SET) — Investing in Bangkok from Abroad",
    emoji: "📈",
    summary: "The Stock Exchange of Thailand (SET) is Southeast Asia's second-largest stock market and provides investment access to Thailand's economy: (1) SET fundamentals: the Stock Exchange of Thailand (SET) has approximately 700+ listed companies; market capitalization exceeds THB 18 trillion (approximately US$500 billion); major indices include SET50 (top 50 by market cap) and SET100; the market is open Monday–Friday, 10am–12:30pm and 2:30pm–4:30pm Bangkok time (lunch break); (2) Dominant SET sectors: Thai stock market is dominated by financial sector (Bangkok Bank, KBank, SCB, Krungthai represent large portions of SET market cap), energy (PTT Plc — Thailand's state energy company is consistently the largest SET company), property and construction, retail (Central Retail Corporation, CP All/7-Eleven Thailand), and tourism/hospitality; (3) Foreign investor access: foreign investors can invest in Thai stocks through international brokers offering Thai market access (Interactive Brokers, Saxo Bank, some major international brokerage platforms offer SET access); alternatively, investing through Thailand-focused ETFs (available on international markets) provides indirect Thai market exposure without requiring a Thai brokerage account; (4) Thai brokerage for residents: foreign residents in Thailand with Non-Immigrant visas can typically open accounts at Thai brokerages (Bualuang Securities, Asia Plus Securities, Kasikorn Securities, SCB Securities); documentation includes passport, visa, work permit (if applicable), and Thai bank account; (5) Thai ETFs and investment funds: Thailand has domestic ETFs (tracking SET50, S&P500, MSCI World) available for purchase through Thai brokerages; Thai investors can access international markets through Thai-domiciled global ETFs; this is the dominant investment vehicle for Thai retail investors alongside Thai domestic equity funds.",
    action: "SET website (set.or.th) for market data and listed company information; Thailand SEC (sec.or.th) for regulatory information and licensed broker list; Bualuang Securities (bualuang.co.th) for Thai brokerage; SET100 ETF (ticker: TDEX, available through Thai brokers); InnovestX (SCB's digital investment platform) for accessible Thai investor platform; Bloomberg and Reuters for Thai stock market coverage.",
  },
  {
    title: "Real Estate Investment in Bangkok — Condos, Returns & Foreign Ownership Rules",
    emoji: "🏢",
    summary: "Bangkok's condominium market is one of Southeast Asia's most active real estate markets with specific foreign ownership rules: (1) The 49% foreign quota rule: Thai law limits foreign ownership in any condominium building to 49% of total saleable area; this quota applies per building; when the 49% foreign quota fills, additional foreign purchases cannot happen (remaining units are domestic-quota only); checking quota availability before purchase is essential; (2) Property price ranges (2024–2026): central Bangkok condos (Sukhumvit, Silom, Sathorn): ฿120,000–350,000 per square meter; emerging areas (Ratchada, Rama 9, Ladprao): ฿70,000–130,000 per sqm; outer Bangkok (Bang Buathong, Nonthaburi, Mueang Thong): ฿40,000–80,000 per sqm; (3) Foreign funds transfer certificate (FETF): foreign buyers of Thai condominiums must transfer purchase funds from abroad (not from Thai bank accounts) and obtain a Foreign Exchange Transaction Form (FETF, also called credit note) from their Thai bank; this document proves funds came from abroad and is required for property registration; (4) Rental yield expectations: Bangkok condominium rental yields range from 3–6% gross annually in central areas; net yields (after management fees, maintenance, property tax, voids) are typically 2–4.5%; yields have compressed as property prices increased faster than rents; rental demand is strongest from Japanese and Korean expats, Chinese buyers, and international business professionals; (5) Off-plan purchase risks: Bangkok has a significant off-plan (pre-construction purchase) market; risks include: project delays (common), developer financial issues (less common but has occurred), price escalation from low-ball initial prices before construction completion, and quality variance between show units and delivered units; established developers (AP Thailand, SC Asset, Sansiri, LPN) have better track records than smaller developers.",
    action: "DDproperty.com for Bangkok property listings and price trends; Hipflat.com for Bangkok property market analysis; Thailand Board of Investment property incentives (boi.go.th); AREA Thailand (area.co.th) for property market research reports; conveyancing lawyers in Bangkok: international law firms (Baker McKenzie, Tilleke & Gibbins) handle property purchases for foreigners; Thai Revenue Department (rd.go.th) for property transfer tax information (2% transfer fee, 3.3% specific business tax, 0.5% stamp duty).",
  },
  {
    title: "Bangkok's Gold Market — Thai Gold Culture & Investment",
    emoji: "🥇",
    summary: "Thailand has one of the world's most active gold trading cultures with Bangkok as the center: (1) Thai gold purity standard: Thai gold jewelry is typically 96.5% pure (23 karat) — higher purity than Western jewelry gold (typically 18–22 karat); this high-purity Thai gold is called 'baht gold' (สร้อยทองคำ); the higher purity means Thai gold jewelry is simultaneously wearable and investment-grade; (2) Yaowarat (Chinatown) gold market: Bangkok's Chinatown (Yaowarat Road) is the center of Thailand's gold trading; the street has dozens of gold shops (ร้านทอง — ran thong) that buy and sell gold at prices updated multiple times daily based on international gold prices; gold shops display current buy and sell prices prominently; the spread between buy and sell prices is the shop's margin (typically ฿50–200 per baht weight); (3) Gold pricing in Thailand: Thai gold is priced in 'baht weight' (1 baht weight = 15.16 grams of gold); the price is expressed as price per baht weight; a Bangkok gold shop price of ฿45,000 per baht weight means 15.16 grams of 96.5% gold at that price; calculating international spot price comparison: spot gold price in USD/troy ounce × baht weight conversion factor (0.4882 troy oz per baht weight) × THB/USD exchange rate gives the international equivalent; Thai gold typically trades close to international spot prices with small premiums; (4) Gold as Thai cultural store of value: Thai culture treats gold jewelry as a reliable store of value; Thai mothers commonly give daughters gold jewelry as an inheritance vehicle; buying gold is a traditional wedding, birth, and festival gift; the liquidity of Thai gold (any gold shop in Thailand buys back gold at close to market price) makes it function genuinely as savings; (5) Gold futures and ETFs: Thailand has gold futures trading on the Agricultural Futures Exchange of Thailand (AFET); Thai-domiciled gold ETFs (GLD Thai equivalents) are available on the SET; these instruments provide gold price exposure without physical gold storage.",
    action: "Gold Traders Association of Thailand (goldtraders.or.th) for daily gold prices; Hua Seng Heng gold shop (famous Yaowarat shop, huasengheng.com) for reference gold prices; MTS Gold Futures (mts gold.com) for gold futures trading; Thai gold price apps: multiple available on Android/iOS showing real-time Thai gold market prices; Lom Ploen Jewellery gold shop certification at TGJTA (Thai Gem and Jewelry Traders Association, thaigem.com).",
  },
];

export function BangkokStockInvest() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        📈 Bangkok investing — SET stock market, condo real estate & Thai gold market
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-emerald-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-emerald-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
