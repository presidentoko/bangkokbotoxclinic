const TOPICS = [
  {
    title: "Modern Thai Political History — Understanding Bangkok's Context",
    emoji: "🏛️",
    summary: "Thailand's political history shapes Bangkok's character in ways visitors and residents encounter daily: (1) Constitutional monarchy since 1932: the 1932 People's Party coup ended absolute monarchy and established the constitutional monarchy framework that still exists; Thailand has had 20 constitutions since 1932; the current constitution (2017) was drafted under military oversight following the 2014 coup; (2) Military coups as political mechanism: Thailand has experienced 13 successful coups (1932–2014) and many more attempts; the Thai military's political role (as coup-maker and constitution-writer) is unique globally; understanding this cycle is essential to understanding Thai politics; (3) Red Shirt vs. Yellow Shirt political divide: from approximately 2006–2020, Thai politics was defined by competing mass protest movements: Yellow Shirts (People's Alliance for Democracy, royalist, urban middle class, anti-Thaksin) and Red Shirts (United Front for Democracy Against Dictatorship, pro-Thaksin, rural north and northeast base); the 2010 Red Shirt occupation of Ratchaprasong intersection (Central World area) ended with military crackdown; approximately 90 people died; (4) 2014 coup and NCPO government: General Prayuth Chan-ocha's May 2014 coup ended an elected government and installed the National Council for Peace and Order (NCPO) military junta; Prayuth transitioned to elected PM under the 2017 constitution in 2019; (5) 2023 Move Forward/Pita Limjaroenrat: in the 2023 election, the progressive Move Forward Party (later renamed People's Party after judicial dissolution) won the most seats but was blocked from forming government by military-appointed senators; Pheu Thai (linked to former PM Thaksin, who returned from self-imposed exile) formed government instead — a complex political arrangement that highlighted ongoing military political influence.",
    action: "Contextual reading: Thai Political Database and iLaw (ilaw.or.th) for Thai political and human rights context; Thai Enquirer for English-language Thai political analysis; visiting Democracy Monument (Ratchadamnoen Avenue) and observing its role as Bangkok's historic protest gathering point; Sanam Luang (Royal Field) as Bangkok's political demonstration traditional site.",
  },
  {
    title: "The Bangkok Economic Boom — From Rice Economy to Global City",
    emoji: "📈",
    summary: "Bangkok's transformation from a regional rice-exporting port to a major global city occurred primarily in a 50-year period: (1) 1960s–1980s industrial foundation: US Cold War investment and infrastructure support, World Bank loans, and manufacturing export-oriented policies (particularly textiles, electronics assembly) built Bangkok's industrial base; Thailand's GDP growth rates during this period consistently ranked among Asia's highest; (2) 1997 Asian Financial Crisis: the baht crisis of July 1997 (when Thailand was forced to float the baht, which fell 40% against the USD almost immediately) devastated Bangkok's economy; the resulting IMF bailout and economic restructuring caused severe recession, mass unemployment, and property market collapse from which Bangkok recovered gradually through 2001–2003; (3) 2000s tourism and services growth: Bangkok's recovery from 1997 was built on tourism expansion (especially post-SARS as alternatives to Hong Kong and Singapore), financial services, and retail; MRT and BTS expansion increased Bangkok's attractiveness as a retail hub; (4) Manufacturing relocation and knowledge economy transition: Thailand's manufacturing sector has relocated progressively to lower-wage neighbors (Cambodia, Vietnam, Myanmar); Bangkok's economy has increasingly shifted toward services, tourism, finance, and tech; the Eastern Economic Corridor (EEC) aims to establish higher-technology manufacturing in Chonburi-Rayong near Bangkok; (5) COVID-19 economic impact: tourism represented approximately 20% of Thai GDP at its peak (2019: 39 million international arrivals); COVID-19's near-total elimination of tourism in 2020–2021 was catastrophic for Bangkok's economy; recovery was slower than regional peers due to Thailand's late vaccine rollout; the sector returned to near-normal levels by 2023.",
    action: "Bank of Thailand (bot.or.th) for current economic data; NESDC (nesdc.go.th) for Thailand national economic statistics; EEC (eeco.or.th) for Eastern Economic Corridor investment information; World Bank Thailand data for historical GDP and development indicators.",
  },
  {
    title: "Bangkok's Social Inequality — Understanding Class, Ethnicity & Regional Divide",
    emoji: "🏙️",
    summary: "Bangkok's extreme concentration of Thailand's wealth and opportunity alongside visible poverty creates a complex social landscape: (1) Bangkok vs. Thailand inequality: Bangkok accounts for approximately 44% of Thailand's GDP while housing approximately 17% of the population; the rural-urban income gap is a persistent structural issue; migration from Isaan (northeastern Thailand) to Bangkok for domestic service, construction, and low-wage labor is a defining demographic movement; (2) Thai-Chinese economic dominance: ethnic Chinese-Thais, though approximately 14% of Thailand's population, dominate the commercial economy; the Sino-Thai business families controlling major banking groups (Kasikorn, Bangkok Bank), property developers, and retail conglomerates represent a persistent ethnic economic concentration; (3) Isaan migration and remittances: the north and northeast provide Bangkok's largest domestic labor migration pool; domestic workers, security guards, food vendors, and construction workers in Bangkok disproportionately originate from Isaan and northern provinces; Bangkok provides significant remittance income to rural families; (4) Foreign labor in Bangkok: Bangkok's construction sector, domestic service, and food service employ significant numbers of documented and undocumented migrant workers from Myanmar, Cambodia, and Laos; UNHCR estimates several hundred thousand undocumented migrants in Bangkok; (5) Visible wealth gap: Bangkok juxtaposes its extreme luxury (Gaysorn, EmQuartier, Mandarin Oriental) with persistent informal settlements; the Khlong Toey slum community (80,000+ residents adjacent to Bangkok's Port) is adjacent to Bangkok's most fashionable neighborhoods; understanding this visible disparity without either romanticizing poverty or looking away from it is part of genuine Bangkok experience.",
    action: "NESDC inequality data (nesdc.go.th); Human Development Report Thailand (UNDP Bangkok office); Khlong Toey community engagement: Duang Prateep Foundation (dpf.or.th) runs education and development programs in Khlong Toey accessible to volunteers and visitors; Makhampom Theatre company in Khlong Toey provides arts programming bridging class divides.",
  },
];

export function BangkokPoliticsHistory() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🏛️ Bangkok politics & history — Thai political history, economic boom & social inequality
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-amber-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-amber-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
