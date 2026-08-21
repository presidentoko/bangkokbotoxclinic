const TOPICS = [
  {
    title: "BTS Skytrain System — Bangkok's Elevated Rail Complete Guide",
    emoji: "🚆",
    summary: "The BTS Skytrain is Bangkok's primary rapid transit network and the most visitor-friendly transportation option: (1) BTS network structure: the BTS Skytrain operates two interconnected main lines: the Sukhumvit Line (dark green) running east-west from Kheha to National Stadium; and the Silom Line (dark green, same color) running from Bang Wa south to National Stadium where they connect; BTS extensions include the light green line (Bearing to Samut Prakan) and multiple under-construction extensions; (2) Ticket types and Rabbit Card: single journey tokens cost ฿17–47 depending on distance; the Rabbit Card (stored-value smart card, ฿100 deposit, purchasable at all stations) provides 5% discount on journeys and works for multiple uses; Rabbit Card also works for food purchases at BTS-partnered outlets; visitors staying more than a few days benefit from a Rabbit Card over single tokens; (3) BTS operating hours: BTS operates daily approximately 5:30am–midnight; the system is reliable with trains every 3–5 minutes during peak hours (7–9am, 5–8pm) and every 5–10 minutes off-peak; the last train timing is important for late-night planning as no BTS after midnight means Grab/taxi for return; (4) Key BTS stations for tourists: Siam (central interchange, shopping malls); Asok (Sukhumvit area, connects to MRT); Nana (Sukhumvit Soi 4 area); On Nut (residential Sukhumvit, budget accommodation area); National Stadium (MBK Center, Siam Discovery); Chong Nonsi (Sathorn, many offices); Saphan Taksin (Chao Phraya River access, Icon Siam shuttle); (5) BTS vs. Grab speed comparison: during off-peak hours, Grab is often faster than BTS for point-to-point journeys; during Bangkok's two daily traffic peaks (7–9am, 5–8pm), BTS is dramatically faster than any road vehicle for most central Bangkok journeys; the BTS advantage peaks on Friday evenings when road traffic can be 3–5x normal.",
    action: "BTS official app (BTS SkyTrain) for fare calculator and station maps; bts.co.th for route information; Rabbit Card purchase at any BTS station ticketing machine; Bangkok transit apps: ViaBus (real-time buses and BTS), Google Maps (integrates BTS routes); BTS Skytrain map available free at all station information counters; BTS Twitter/X account (@BTSSkyTrain) for service disruption announcements.",
  },
  {
    title: "MRT Metro & Airport Rail Link — Bangkok Underground & Airport Connection",
    emoji: "🚇",
    summary: "The MRT (Metropolitan Rapid Transit) provides Bangkok's underground rail coverage complementing the BTS: (1) MRT network: the MRT Blue Line runs from Tha Phra in the west, underground through central Bangkok, and circles through the Chatuchak and Ratchada areas; the MRT Purple Line runs from Taopoon to Khlong Bang Pai (northwest Bangkok, connecting to the Blue Line at Taopoon); additional lines (Yellow Line connecting Lat Phrao to Samrong, Pink Line in northern Bangkok) opened in 2023–2024; (2) MRT-BTS interchange: the MRT and BTS systems are operated by different companies and require separate ticketing; key interchange stations: Asok BTS ↔ Sukhumvit MRT; Sala Daeng BTS ↔ Silom MRT; Mo Chit BTS ↔ Chatuchak Park MRT; at these stations, exiting one system and paying to enter the other is required (no through ticketing); (3) MRT token and card system: MRT operates with a separate stored-value card (MRT Card); single journey tokens are also available; the MRT card works on all MRT lines; separate from BTS Rabbit Card — Bangkok is working toward unified ticketing but currently requires separate cards; (4) Airport Rail Link (ARL): the Suvarnabhumi Airport Rail Link connects Suvarnabhumi Airport to Makkasan Station and Phaya Thai BTS Station; the airport direct express (non-stop, ARL express): 15 minutes, ฿150; the city line (local stops): 30 minutes, ฿15–45; BTS city pass day ticket can be combined with ARL for seamless airport-city travel; (5) Suvarnabhumi vs. Don Mueang Airport: Bangkok has two international airports; Suvarnabhumi (BKK) has the ARL connection; Don Mueang (DMK, budget airline hub) does not have rail connection — requiring bus, taxi, or car to access central Bangkok (45–90 minutes by bus route A1 to Mo Chit BTS).",
    action: "MRT official website (bangkokmetro.co.th) for Blue Line and Purple Line information; MRT card purchase at all MRT stations; ARL official site (srtet.co.th) for Airport Rail Link schedules; Google Maps integrates MRT, BTS, and ARL routes for journey planning; EMV contactless card payment (Visa/Mastercard contactless) accepted on some MRT machines; Bangkok transit card integration timeline at BTSC and MRTA official communications.",
  },
  {
    title: "Bangkok's New Metro Lines — Yellow, Pink & Orange Line Expansion 2024-2026",
    emoji: "🟡",
    summary: "Bangkok's rail network is expanding significantly with multiple new lines opening between 2023 and 2026: (1) Yellow Line (Lat Phrao–Samrong): the Bangkok Mass Transit System's Yellow Line opened 2023; runs from Lat Phrao (connects to MRT Huai Khwang) east through Ramkhamhaeng and south to Samrong (connects to BTS Bearing); the Yellow Line connects inner eastern Bangkok suburbs that previously had no rail access; key stations: Lat Phrao 71, Ramkhamhaeng, On Nut Yellow Line (not BTS On Nut but adjacent area); (2) Pink Line (Khae Rai–Min Buri): the Pink Line (opening 2023–2024) runs east-west in northern Bangkok from Nonthaburi through Chaengwattana (government complex area) to Min Buri; previously Bangkok's northern orbital areas required bus or car; the Pink Line makes Nonthaburi and Chaengwattana Government Complex areas accessible from downtown in 30–40 minutes; (3) Orange Line (Thailand Cultural Center–Min Buri and westward extension): the Orange Line (eastern section operational by 2024–2026) passes through cultural centers, hospitals, and residential areas; the full Orange Line will connect Min Buri to the west side, crossing central Bangkok through Chatuchak; (4) Impact on property prices: Bangkok real estate prices rise predictably near newly announced and opened metro stations; the Yellow, Pink, and Orange Line station areas have seen significant condominium development in advance of line openings; property prices near new stations typically increase 15–30% in the first 2 years after opening; (5) Transit integration with new lines: the new lines (Yellow, Pink, Orange) require separate ticketing from BTS and MRT; the long-term plan for unified Bangkok transit ticketing has not yet produced a single card working across all systems; passengers transferring between systems must exit and re-enter with separate payment.",
    action: "Bangkok Mass Transit System (BTSC, bts.co.th) for BTS line information; Bangkok Metro (BMTA, bangkokmetro.co.th) for MRT line information; NRTA (Office of Transport and Traffic Policy, otp.go.th) for overall Bangkok mass transit planning; Mass Transit Authority of Thailand (Northern Rail Link, Pink and Yellow lines: transitbangkok.com for informal tracking); Bangkok transit expansions tracked by unofficial community sites: bangkokmetro.wordpress.com; Bisnews Bangkok property news for station-area property impact.",
  },
];

export function BangkokBTSMRT() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🚆 Bangkok transit guide — BTS Skytrain, MRT Metro & new Yellow/Pink/Orange line expansion
      </h2>
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
