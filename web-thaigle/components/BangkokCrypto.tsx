const TOPICS = [
  {
    title: "Thailand's Cryptocurrency Regulatory Environment",
    emoji: "⚖️",
    summary: "Thailand is one of Southeast Asia's more regulated cryptocurrency markets — with the Securities and Exchange Commission (SEC) overseeing digital asset exchange licensing, creating a structured but legally navigable environment for crypto activity.",
    action: "Thailand crypto regulatory basics: (1) Legal status: cryptocurrency trading is legal in Thailand but regulated as digital assets under the Digital Asset Business Decree of 2018; unlicensed exchanges are prohibited; (2) Licensed exchanges: Thailand's SEC-licensed exchanges (Bitkub, Satang, Zipmex Thailand, others) allow Thai nationals and legal residents to trade; foreigners may face additional verification requirements; (3) Tax treatment: crypto gains in Thailand are technically subject to capital gains tax and withholding tax on profits — compliance is an evolving area and consulting a Thai tax advisor is recommended for significant holdings; (4) Banking integration: Thai banks have been cautious about crypto integration; some licensed exchanges have direct fiat on/off ramps but bank policies vary; (5) SEC warnings: the Thai SEC actively warns against unlicensed foreign exchanges, NFT scams, and unregistered initial coin offerings — the 2022 crypto market crash produced significant enforcement actions; (6) Growing legitimacy: Thailand has been exploring central bank digital currency (CBDC) and has official statements expressing interest in regulated digital asset development — the regulatory direction is toward structured legality rather than prohibition.",
  },
  {
    title: "Bangkok's Crypto Community & Events",
    emoji: "₿",
    summary: "Bangkok has developed into one of Southeast Asia's most active cryptocurrency communities — with regular meetups, conferences, and a significant crypto-native population drawn by Thailand's relative regulatory clarity, digital nomad culture, and quality of life.",
    action: "Bangkok crypto community participation: (1) Bitkub Exchange (Thailand's largest licensed exchange): Bangkok-based and hosts occasional community events and educational workshops — their YouTube channel and social media cover Thai crypto market developments; (2) Meetup events: Bangkok Ethereum meetup, Bitcoin Bangkok, and blockchain developer communities hold periodic events at hotel conference rooms and coworking spaces in Sukhumvit and Silom areas; checking Meetup.com and EventBrite for current schedule; (3) Annual conferences: Thailand periodically hosts or co-organizes regional blockchain and crypto conferences (including occasional visits from major international events); the tourism industry has experimented with accepting crypto payments; (4) Thai crypto influencer community: significant Thai-language crypto education YouTube and social media content creators serve the Thai crypto retail community — while primarily in Thai language, the active community signals market engagement; (5) Satoshi Square informally: some Bangkok café communities (particularly coworking spaces in Ekkamai and Ari) have informal crypto discussion groups that serve as introductory networking; (6) NFT and Web3 Bangkok: Bangkok has a small but active NFT art community with Thai artists minting and selling digital art — occasional gallery events with NFT components occur in the Charoenkrung creative district.",
  },
  {
    title: "Digital Nomads & Bangkok's Remote Work Economy",
    emoji: "💻",
    summary: "Bangkok is consistently ranked as one of the world's top digital nomad cities — combining fast internet infrastructure, abundant coworking spaces, low cost of living, and a vibrant international community with no special digital nomad visa requirements (existing tourist and education visas serve the purpose for most).",
    action: "Bangkok digital nomad practical infrastructure: (1) Visa reality: Thailand doesn't yet have a dedicated 'digital nomad visa' — most remote workers use tourist visa extensions (up to 90 days), the Thailand Elite Visa (5–20 year renewable visa), the Thailand LTR (Long-Term Resident) visa, or education visa while studying Thai — the Thailand Elite Visa is the most straightforward long-term option; (2) Internet speed: Bangkok's internet infrastructure is excellent — 4G coverage is near-total, fiber broadband is widely available in condos (200–1000Mbps common), and coworking spaces routinely deliver 300–500Mbps symmetrical; (3) Top coworking spaces: Hubba-TO (Ekkamai), Mango Coworking Space (Ekkamai/Silom), Kafevolution (Sukhumvit), The Hive (Thonglor/Ekamai) — daily rates ฿250–500; monthly hot desk ฿3,000–8,000; (4) Café working culture: Bangkok cafés widely tolerate laptop workers, particularly during off-peak hours; a ฿150 drink purchase typically buys 3–4 hours of comfortable working space with AC and WiFi; (5) Cost comparison: Bangkok remote worker cost of living (decent condo, coworking, food, entertainment, transport): ฿40,000–80,000/month ($1,100–2,200) — significantly below equivalent quality of life in most Western cities; (6) Community: InterNations Bangkok, Nomad List Bangkok community, and expat Facebook groups all serve the remote worker social community.",
  },
  {
    title: "Thai Financial Technology — Fintech & Banking",
    emoji: "📱",
    summary: "Thailand's fintech ecosystem has developed rapidly — PromptPay QR payments are ubiquitous, mobile banking apps are feature-rich, and Bangkok hosts a growing fintech startup sector competing across lending, insurance, and wealth management.",
    action: "Bangkok's fintech and financial reality for visitors: (1) PromptPay: Thailand's national instant payment system, accessible via any Thai bank account — QR code payments at street food stalls, markets, and shops have largely replaced cash in urban Bangkok; foreigners without Thai bank accounts must still use cash or card; (2) Thai mobile banking apps: Bangkok Bank, Kasikorn (KBank), SCB, and Krungthai Bank all have feature-rich mobile apps with English interface options — opening a Thai bank account as a foreigner requires a Non-Immigrant visa (tourist visas may be refused), so access to the app ecosystem requires establishing residency; (3) Cash still necessary: despite digital payment dominance in Bangkok's urban core, rural markets, traditional vendors, public transport (BTS can use credit cards now; boat and bus often cash-only), and smaller establishments still require cash; (4) ATM access: Bangkok has excellent ATM coverage; international ATM fees vary by card but are typically ฿220 foreign fee plus your bank's charges — minimizing ATM withdrawals reduces costs; (5) Exchange rates: currency exchange booths (particularly SuperRich brand and similar licensed money changers in central Bangkok) typically offer significantly better exchange rates than airport exchanges or hotel front desks; (6) Rabbit LINE Pay and TrueMoney Wallet: Thailand's domestic e-wallet ecosystem (not easily accessible to foreigners without Thai ID) is ubiquitous among locals but requires separate application for foreigners.",
  },
];

export function BangkokCrypto() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        ₿ Bangkok crypto & fintech — digital assets, regulation, nomads & payment systems
      </div>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-violet-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-violet-50 pt-2">
              {t.summary}
              <div className="mt-1 text-violet-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
