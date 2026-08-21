const TOPICS = [
  {
    title: "Moving to Bangkok — The First 90 Days",
    emoji: "🏠",
    summary: "Bangkok has a well-established expat infrastructure — the city hosts one of Asia's largest English-speaking expatriate communities. Housing: the Sukhumvit corridor (BTS accessible), Silom/Sathorn area, and Ari neighborhood are the primary expat residential zones. Monthly rent for a furnished one-bedroom condo ranges from ฿12,000 (basic, outer areas) to ฿60,000+ (luxury, prime areas). Setting up: a Thai bank account (Kasikorn Bank / KBank is expat-friendly), a Thai phone SIM (DTAC, True, or AIS — buy with passport), and a Grab account complete the mobility and financial infrastructure for daily life. Health insurance: Bangkok Pattaya Hospital, Bumrungrad International, and Samitivej Hospital all provide international-standard English-language healthcare — international health insurance is strongly recommended before arrival.",
    action: "Initial Bangkok setup sequence: (1) apartment — start in a serviced apartment for the first month while exploring neighborhoods; (2) bank account — KBank and Bangkok Bank are most accessible for foreigners on non-immigrant visas; (3) health insurance — buy before arrival from international providers like Cigna, AXA, or BUPA; (4) Thai driving license (if needed) — International Driving Permit converts to Thai license at Land Transport Department; (5) tax registration — if working legally in Thailand, the Revenue Department requires registration.",
  },
  {
    title: "Bangkok Visas & Legal Status",
    emoji: "📋",
    summary: "Thailand's visa landscape for long-term residents has several options: Non-Immigrant B (work visa, requires employer sponsorship), Non-Immigrant O (marriage/retirement/family), Thailand Elite (10-year privileged visa, ฿600,000+), LTR Visa (Long-Term Resident — for high-earners, remote workers, and retirees meeting income thresholds), and Digital Nomad Visa (SMART Visa for tech workers). The 'visa run' era has largely ended for serious long-term residents — overstay penalties are severe and consistent enforcement has increased. Border runs (leaving Thailand to reset a tourist entry) are increasingly inconsistent as immigration officials exercise discretion on repetitive entries.",
    action: "Visa strategy by situation: Remote workers earning $80,000+/year qualify for LTR Visa (highly recommended for legal certainty and 4-year validity). Retirees 50+ with ฿800,000 in Thai bank or ฿65,000/month income qualify for Non-Immigrant O-A (annual retirement visa). Business owners operating Thai companies can obtain Non-Immigrant B. Thailand Elite is the simplest long-term visa for those who can afford it — no income requirements, just the one-time fee. Immigration attorneys in Bangkok are recommended for all non-tourist visa processes — mistakes have serious consequences.",
  },
  {
    title: "Bangkok Cost of Living — What It Actually Costs",
    emoji: "💰",
    summary: "Bangkok offers highly variable cost of living depending on lifestyle choices — the range between budget and luxury is extreme. Realistic monthly cost estimates for different lifestyles: Budget expat (local food, local transport, basic apartment outside center): ฿25,000–40,000/month (USD 700–1,100). Mid-range expat (mix of local and Western, BTS-accessible apartment, motorcycle/BTS transport): ฿50,000–80,000/month (USD 1,400–2,200). Comfortable Western lifestyle (Western food frequently, nice condo, taxi/car): ฿80,000–150,000/month (USD 2,200–4,200). The biggest cost variables: accommodation (range is 10x from basic to luxury), dining (Thai food at ฿60–100/meal vs. Western at ฿400–2,000/meal), and whether you own/lease a car (adds ฿15,000–40,000/month in total).",
    action: "Bangkok cost optimization strategies: the single biggest saving is eating local Thai food — a completely satisfying daily diet from markets and food courts costs ฿150–300/day versus ฿1,000–3,000 for Western food patterns. Condo selection: building 500m from a BTS station costs 30–40% less than immediately adjacent — the slight walk is the tradeoff. Health: Bangkok's public hospitals (Ramathibodi, Siriraj, Chula) provide excellent care at 10–20% of international hospital prices for non-emergency conditions if you have reasonable Thai language or a translator. Groceries: Villa Market and Tops Supermarket carry international products at 2–3x Thai supermarket prices — mixing them strategically reduces costs.",
  },
  {
    title: "Bangkok Expat Social Life & Community",
    emoji: "🤝",
    summary: "Bangkok has one of Asia's most developed expat social communities — decades of accumulation have created rich infrastructure. Expat community nodes: Sukhumvit Soi 11 (international bar district), Thong Lor (upscale Japanese and Korean expat corridor), Ari (younger expat and creative professional community), Silom/Sathorn (finance professional community). Social platforms: Internations Bangkok (organized events, largest formal expat network), Facebook groups (Bangkok Expats, Women in Bangkok, Digital Nomads Bangkok), Meetup.com (specific interest communities), and CrossFit gyms (globally, CrossFit functions as an expat social entry point across cities). The Rugby Club Bangkok, British Club Bangkok, Royal Bangkok Sports Club, and Alliance Française are established institutions with social programming.",
    action: "Bangkok social entry points by interest: sports — Bangkok Rugby Football Club and Hash House Harriers have the lowest-barrier entry for meeting people through shared activity. Professional — Internations Bangkok Albatross events (the largest, most organized) or industry-specific networking. Arts/culture — BACC (Bangkok Art and Culture Centre) events and foreign cultural institutes (Goethe-Institut, Institut Français). Families — International school communities provide the most organic social integration for families with children. Language exchange — conversation exchange meetups where Thais practice English in exchange for Thai lessons are one of the most genuine Bangkok expat-local social mixing formats.",
  },
];

export function BangkokExpatLife() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏠 Bangkok expat life — moving guide, visas, cost of living & community
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-blue-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-lg">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-blue-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-blue-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-blue-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
