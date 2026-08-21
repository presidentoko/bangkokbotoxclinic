const TOPICS = [
  {
    title: "Bangkok's Startup & Tech Ecosystem",
    emoji: "🚀",
    summary: "Bangkok has emerged as Southeast Asia's third-largest startup hub after Singapore and Jakarta — strong government backing, a large domestic market of 70M people, ASEAN access, and improving venture capital access have built a maturing ecosystem.",
    action: "Bangkok startup ecosystem entry points: (1) True Digital Park (Bangna area) — Thailand's largest startup campus with co-working, incubator programs, and corporate innovation partnerships; the Southeast Asia's largest startup park at 35,000 sqm; (2) HUBBA (multiple Bangkok locations) — community co-working with active startup community events; (3) dtac Accelerate and AIS The StartUp — telecom corporate accelerators with startup support programs; (4) RISE (Corporate Innovation) — corporate-startup connector platform; (5) BOI (Board of Investment) Smart Visa — Thailand's startup-focused long-term visa allowing tech workers and entrepreneurs extended stays with simplified process; (6) EEC (Eastern Economic Corridor) tech hub development in Rayong/Chonburi (near Bangkok) specifically targets deep tech, biotech, and aerospace startups.",
  },
  {
    title: "Tech Community & Developer Scene",
    emoji: "💻",
    summary: "Bangkok's developer community is active and English-accessible — meetups, hackathons, and tech events run regularly across multiple technology disciplines.",
    action: "Bangkok tech community access: (1) Meetup.com Bangkok tech groups: Bangkok.js (JavaScript), Python Bangkok, Bangkok iOS Dev, Google Developer Group Bangkok — all have regular meetups searchable on Meetup.com; (2) Bangkok Hackathon community: multiple annual hackathons including Techsauce Hackathon, Code in the Dark Bangkok, and corporate-sponsored events; (3) Techsauce Summit (annual, typically June) — Bangkok's largest tech conference with regional significance, international speakers, and startup exhibition; (4) Google for Startups Bangkok — resources, events, and mentorship programs; (5) GitHub Bangkok developer community; (6) Coders Club Bangkok and similar informal developer meetup series. The language situation: Bangkok's developer events run in both Thai and English — internationally-facing events lean English; community meetups may be Thai-primary but developers communicate in English professionally.",
  },
  {
    title: "Fintech & Digital Banking in Thailand",
    emoji: "💳",
    summary: "Thailand's fintech sector is one of Southeast Asia's most developed — PromptPay (instant payment infrastructure), digital banking licenses, and insurance innovation have created a sophisticated domestic market.",
    action: "Bangkok fintech landscape: (1) PromptPay: Thailand's real-time payment system (linked to phone number or national ID) is used by 90%+ of Thai adults — foreign visitors and residents can link PromptPay to Thai bank accounts for instant transfers; (2) Digital banks: KBank (Kasikorn Bank) KPlus app, SCB Easy, and Bangkok Bank Mobile are the most advanced — KPlus in particular is frequently cited in fintech circles as one of Southeast Asia's best consumer banking apps; (3) Omise (Thailand-founded payment platform, now part of Synqa) is the most internationally significant fintech company to emerge from Bangkok; (4) Thai QR payment: all major Bangkok merchants display a QR code linked to the PromptPay system — phone banking apps can pay any Bangkok merchant through this system. Foreign payment options: major tourist areas accept Visa/Mastercard widely; JCB and UnionPay have strong acceptance due to Japanese/Chinese tourism; Alipay and WeChat Pay acceptance is expanding.",
  },
  {
    title: "Bangkok for Digital Nomads",
    emoji: "🌐",
    summary: "Bangkok consistently ranks in the top 5 global digital nomad destinations — exceptional internet infrastructure, co-working density, cost-of-living value, and quality of life combine to create ideal conditions for location-independent work.",
    action: "Bangkok digital nomad setup: (1) Internet access: Bangkok's fiber broadband (300Mbps–1Gbps) is available at competitive prices; 5G SIM cards (True, DTAC, AIS) provide mobile backup; co-working spaces consistently test 50–200Mbps; (2) Visa options for nomads: Thailand Tourist Visa (60 days extendable 30 days), METV (Multiple Entry Tourist Visa, 6 months), LTR Visa (Long-Term Resident — requires proof of income/assets, but allows 10 years), and Smart Visa for tech workers; (3) Co-working spaces: HUBBA, Glowfish, The Hive (Thong Lor), WeWork Bangkok, CAMP (Starbucks equivalent, all-day laptop-friendly cafés) — Bangkok has 100+ co-working options; (4) Nomad community: Bangkok Nomads, Digital Nomads Thailand (Facebook groups), and events from Nomad List, Dynamite Circle, and similar organizations; (5) Banking: Bangkok Bank, Kasikorn Bank, and SCB all open accounts for foreigners with appropriate visa documentation; Wise and Revolut serve international money management.",
  },
];

export function BangkokStartup() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🚀 Bangkok startup & tech — ecosystem, developer community, fintech & digital nomads
      </h2>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-blue-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-blue-50 pt-2">
              {t.summary}
              <div className="mt-1 text-blue-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
