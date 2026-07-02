const TOPICS = [
  {
    title: "Opening a Bank Account in Bangkok as a Foreigner",
    emoji: "🏦",
    summary: "Opening a Thai bank account as a foreign resident is one of the most practically useful steps for long-term Bangkok living — enabling local bill payments, PromptPay transfers, real estate rental deposits, and avoiding constant ATM fees: (1) Bangkok Bank: Thailand's largest commercial bank, with the most foreigner-friendly account opening process; Bangkok Bank accepts foreigners with a valid visa (non-tourist) and passport; 'Basic Banking Account' available with lower documentation requirements; (2) Kasikorn Bank (KBank): popular choice for foreigners due to its feature-rich KPlus mobile banking app and extensive ATM network; KBank requires a non-tourist visa and proof of address; (3) SCB (Siam Commercial Bank): another major choice with SCB Easy app; similar documentation requirements; (4) Required documents (typical): passport with current valid visa (non-tourist), proof of address in Thailand (utility bill, lease agreement, or hotel letter), and some branches require proof of employment or income; (5) Digital-first banking: Bangkok Bank's Bualuang mBanking and KBank's KPlus app have made Thai banking app-centric; most transactions, bill payments, and transfers now happen through apps rather than branch visits.",
    action: "Bangkok Bank (bangkokbank.com) for most forgiving foreigner requirements; KBank (kasikornbank.com) for best mobile app experience; branch visit to Silom or Sukhumvit area branches with passport + non-tourist visa.",
  },
  {
    title: "PromptPay & Thailand's Digital Payment Revolution",
    emoji: "📱",
    summary: "Thailand has undergone one of Asia's most dramatic retail payment transformations — the PromptPay system has made cash largely optional for daily Bangkok life: (1) PromptPay: Thailand's national real-time payment system (operated by Bank of Thailand); linked to Thai national ID number or mobile phone number; enables instant bank-to-bank transfers with zero or negligible fees; (2) QR code payment: virtually every Bangkok vendor from street food stalls to department stores displays a QR code payment option; scanning with any Thai bank's app transfers payment directly from bank account with no credit card required; (3) Merchant payment apps: GrabPay, TrueMoney Wallet, LINE Pay, and Rabbit LINE Pay operate as digital wallet alternatives to direct bank transfers; these apps accept top-ups from Thai bank accounts and are accepted at specific merchant networks; (4) Foreigner access to PromptPay: foreign residents with a Thai bank account can register their passport number (not Thai national ID) for PromptPay — enabling full QR code payment capability; (5) Cash ATM fees: Bangkok ATMs charge ฿220–250 per foreign card withdrawal (standard across all ATM operators); opening a Thai bank account eliminates this recurring cost for long-term residents.",
    action: "Register PromptPay through your Thai bank's mobile app using passport number; download KPlus or Bualuang mBanking for QR code scan-to-pay capability; keep ฿500–1,000 cash for vendors who remain cash-only.",
  },
  {
    title: "Currency Exchange & Money Transfer to Bangkok",
    emoji: "💱",
    summary: "Bangkok's currency exchange landscape offers exceptional rates compared to airport exchange booths, with significant variation between options: (1) Superrich Thailand (multiple branches, distinctive orange color): Bangkok's best-known chain currency exchange with consistently competitive THB rates for major currencies; branches concentrated in Victory Monument area and Siam/Pratunam; (2) VS Money Exchange (Bangkok Bank group): competitive rates with widespread branch network; (3) Exchange booths in Silom, Sukhumvit, and tourist areas: independent money changers in Bangkok's tourist corridors offer competitive rates especially for USD, EUR, GBP, JPY, AUD, and CNY; always compare the rate before accepting; (4) Airport exchange rates: Suvarnabhumi airport currency exchange booths (King Power and airport operators) typically offer 3–5% worse rates than Bangkok city center; exchanging only a small amount at the airport and getting the remainder in the city saves meaningful money on larger sums; (5) International wire transfer: Wise (TransferWise), Western Union, and bank international wire transfers all work for sending money to Bangkok; Wise typically offers the best mid-market rate exchange with low fees for regular transfers to Thai bank accounts.",
    action: "Superrich Thailand (superrich.co.th) for best walk-in exchange rates; compare USD/THB rate against Wise (wise.com) for digital transfer comparison; avoid airport exchange booths except for minimal immediate cash needs.",
  },
  {
    title: "Bangkok Taxes, Accounting & Business Registration",
    emoji: "📊",
    summary: "Bangkok's tax and business framework for foreign residents and international businesses: (1) Personal income tax in Thailand: Thailand taxes income earned in Thailand; foreign income brought into Thailand in the same tax year is also subject to tax under current rules (a rule that changed in 2024 affecting foreign residents with overseas income); Thailand's personal income tax rates are progressive (0%–35%); (2) Thai Revenue Department: the government body for tax filing; foreign residents working in Thailand on work permits need to file annual personal income tax returns (PND 90/91); (3) BOI (Board of Investment) promotions: Thailand's BOI offers tax incentives for qualifying foreign business investment including corporate tax exemptions and import duty waivers; BOI promotion approval enables specific business types to operate with foreign majority ownership in restricted sectors; (4) Limited company registration: foreigners can establish a Thai limited company (บริษัทจำกัด) with Thai majority shareholding (51% Thai / 49% foreign) for standard business activities; or use BOI promotion / foreign business license for sectors with foreign majority; (5) Accounting services: Bangkok has a well-developed accounting services industry serving the foreign business community; Big 4 accounting firms (Deloitte, PwC, EY, KPMG) all have Bangkok offices; regional accounting firms and Thai accounting firms offer cost-effective services for smaller businesses.",
    action: "Thai Revenue Department (rd.go.th) for tax filing requirements; BOI Thailand (boi.go.th) for investment promotion information; expat-focused Thai accounting firms (eg DFDL Thailand, Tilleke & Gibbins) for professional tax and business registration advice.",
  },
];

export function BangkokBanking() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏦 Bangkok banking & finance — opening accounts, PromptPay, exchange rates & taxes
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-blue-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-blue-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
