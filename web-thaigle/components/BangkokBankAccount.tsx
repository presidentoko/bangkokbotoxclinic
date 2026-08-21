const BANKS = [
  {
    name: "Bangkok Bank — Foreigner-Friendly",
    emoji: "🏦",
    accounts: "Standard savings, USD/EUR accounts available",
    min_deposit: "฿500 opening deposit",
    why: "Thailand's largest bank, with the most English language support and international banking capabilities. Bangkok Bank branches at major expat areas (Silom, Sukhumvit) have English-speaking staff experienced with foreigner account openings. Online banking available in English. International wire transfers and foreign currency accounts available.",
    tip: "Bring passport, Non-Immigrant visa (tourist visa often rejected), and proof of address in Bangkok (rental contract or hotel stays can work in some branches). Visit a major branch rather than a local branch — Silom or Sukhumvit branches handle foreigner accounts routinely.",
  },
  {
    name: "Kasikorn Bank (KBank) — Digital First",
    emoji: "💚",
    accounts: "K-Bank savings, K-Rabbit account for daily use",
    min_deposit: "฿0–500 depending on account type",
    why: "KBank's mobile app (K-Plus) is considered Thailand's best banking app — QR code payments, PromptPay transfers, English interface. Very popular among younger Thais and tech-savvy expats. Branch network is extensive. K-Rabbit account has low minimum balance requirements.",
    tip: "KBank's PromptPay system allows instant THB transfers using phone number or ID — essential for daily life in Bangkok. The K-Plus app allows paying bills, transferring money, and receiving payments from Thai banks. Essential for renting apartments and paying utilities.",
  },
  {
    name: "SCB (Siam Commercial Bank) — PromptPay Leader",
    emoji: "🟣",
    accounts: "SCB Easy savings account",
    min_deposit: "฿2,000 minimum balance",
    why: "SCB's Easy App rivals KBank for user experience and is equally popular. SCB has historically had strong international banking relationships. The SCB Easy app has a clean interface and is widely considered alongside K-Plus as Thailand's best banking app. QR payments, foreign exchange in-app.",
    tip: "All major Thai banks require Non-Immigrant visa status for account opening — tourist visa holders frequently get rejected. Some branches will open accounts for visa exemption stamps + established accommodation but it depends on the branch manager. The easiest accounts to open: Bangkok Bank's standard savings. Hardest: premium accounts.",
  },
];

const TIPS = [
  "PromptPay is Thailand's instant transfer system — link your Thai bank account to your phone number for easy transfers. Almost all Bangkok businesses and individuals use it.",
  "ATM fees: foreign card ATM withdrawals cost ฿220–250 per transaction at Thai ATMs. Open a Thai account as soon as your visa allows to avoid this.",
  "Wire transfers out of Thailand: requires documentation for amounts over ฿500,000 (source of funds, purpose). Standard for receiving and sending smaller amounts is unrestricted.",
];

export function BangkokBankAccount() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🏦 Opening a bank account in Bangkok — Bangkok Bank, KBank & SCB guide
      </h2>
      <div className="space-y-2 mb-3">
        {BANKS.map((b) => (
          <details key={b.name} className="border border-purple-100 rounded-xl p-3">
            <summary className="cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <span className="text-xl shrink-0">{b.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs">{b.name}</h3>
                  <div className="text-[10px] text-[var(--muted)]">{b.accounts}</div>
                </div>
                <span className="min-w-0 break-words text-right text-[10px] font-mono text-purple-700">{b.min_deposit}</span>
              </div>
            </summary>
            <div className="mt-2 text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-purple-700">💡 {b.tip}</div>
          </details>
        ))}
      </div>
      <div className="border-t border-purple-100 pt-2 space-y-1">
        {TIPS.map((t) => (
          <div key={t} className="text-[10px] text-[var(--fg)] leading-snug">• {t}</div>
        ))}
      </div>
    </div>
  );
}
