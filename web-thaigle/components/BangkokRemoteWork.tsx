const TOPICS = [
  {
    title: "Remote Work Infrastructure in Bangkok",
    emoji: "💻",
    summary: "Bangkok has emerged as one of Asia's top remote work destinations — excellent internet infrastructure (True, AIS, DTAC all offer fast mobile data; fiber home internet available; 5G coverage in central areas), low cost of living versus Western salaries, year-round warm climate, and the city's rich social and food scene create a compelling remote work environment. Bangkok's internet reliability: fiber speeds of 100–1,000 Mbps are available at apartments; co-working spaces typically have 100–500 Mbps; café WiFi varies from excellent (most Thong Lor and Ari specialty cafés) to slow (some tourist-area convenience store cafés). Mobile data: Thai SIM cards (True Move H is generally rated highest for data speed and coverage) provide fast 4G/5G data at very low costs — a 30-day unlimited data package typically costs ฿300–600.",
    action: "Bangkok remote work setup sequence: (1) SIM card immediately upon arrival (True Move H at Suvarnabhumi airport or 7-Eleven); (2) permanent co-working space membership if staying 1+ month (many offer monthly rates with significant discounts vs. daily); (3) determine whether a co-working membership, home fiber + café rotation, or coffee shop only approach suits your work style; (4) time zone management — Bangkok (GMT+7) has good overlap with European afternoon/evening for calls, and reasonably workable (if early morning heavy) overlap with US East Coast. Legal status: if working remotely for a non-Thai company, the LTR Visa (Long-Term Resident) category for remote workers earning $80,000+ annually provides a legal long-term status appropriate for extended Bangkok remote work.",
  },
  {
    title: "Best Bangkok Co-Working Spaces",
    emoji: "🏢",
    summary: "Bangkok's co-working space ecosystem has grown substantially — WeWork (multiple Sukhumvit/Silom locations), The Hive (Thong Lor, Ekkamai — community-focused, popular with creative professionals), Hubba (Ekkamai — startup-oriented, events programming), Table Space (multiple locations, enterprise-focused), and boutique independent spaces throughout the city. Day-use options: many Bangkok co-working spaces offer day passes (฿250–500) without membership commitment. The co-working landscape is bifurcated: premium spaces (WeWork, Regus) with enterprise-grade infrastructure versus community co-working spaces (The Hive, Hubba) with active programming, startup culture, and more social integration. Café co-working: Bangkok's specialty coffee café culture overlaps significantly with remote work usage — many Thong Lor, Ari, and Ekkamai cafés are effectively co-working spaces during morning hours.",
    action: "Co-working space selection criteria: (1) Speed test before committing — ask to see the WiFi speed or do a quick speedtest on their network before purchasing a membership; (2) Noise level at your intended working hours — many spaces are quiet mornings but fill with meetups and phone calls by afternoon; (3) Air conditioning — Bangkok co-working spaces are generally well air-conditioned but older buildings can have inconsistent AC; (4) Location relative to where you live — a 30-minute commute to a co-working space defeats some of the remote work lifestyle benefit. Monthly memberships at mid-tier Bangkok co-working spaces typically run ฿3,000–8,000/month for hot desk access versus ฿10,000–25,000 for a dedicated desk.",
  },
  {
    title: "Digital Nomad Bangkok — Community & Events",
    emoji: "🌐",
    summary: "Bangkok's digital nomad community is well-organized through multiple digital channels and in-person events. Primary community platforms: Nomad List Bangkok (community check-ins, current nomad population, city reviews), Facebook groups (Digital Nomads Bangkok, Remote Workers Bangkok), Meetup.com (tech meetups, nomad socials, startup events), and Slack communities associated with specific interest groups (Women Who Code Bangkok, Bangkok Hackers). The community's demographics skew toward freelancers (web development, design, copywriting, SEO/marketing), SaaS founders, and remote employees of Western tech companies. Events: Startup Bangkok, TechSauce (annual tech conference), Hubba's regular programming, and the co-working community events provide structured networking beyond café proximity.",
    action: "Plugging into Bangkok's nomad community: (1) Join the key Facebook groups — they're active and responses to 'new to Bangkok' posts are typically helpful and specific; (2) Attend one meetup within your first two weeks — the in-person connection density is high at Bangkok tech/nomad events; (3) The nomad community is very transient — many people in Facebook groups are in Bangkok for 1–3 months, so the connections are valuable for current information but may not persist. For longer-term integration: the startup community (Thai-founded startups, regional Southeast Asian tech scene) and the Thai corporate tech sector are where more stable Bangkok professional networks form — these communities have different events and social scenes from the pure nomad scene.",
  },
];

export function BangkokRemoteWork() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        💻 Remote work in Bangkok — internet, co-working spaces & digital nomad community
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-cyan-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-lg">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-cyan-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-cyan-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-cyan-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
