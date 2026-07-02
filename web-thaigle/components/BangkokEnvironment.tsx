const TOPICS = [
  {
    title: "Bangkok Air Quality & PM2.5 — The Pollution Problem and How to Manage It",
    emoji: "😷",
    summary: "Bangkok's air quality is a genuine health concern requiring practical management: (1) PM2.5 crisis seasonality: Bangkok's worst air pollution occurs November–April when north winds carry agricultural burning smoke from northern Thailand and Myanmar toward Bangkok; the dry season absence of rain to clear particles allows PM2.5 accumulation; Bangkok regularly records PM2.5 levels 3–5x WHO guidelines during peak pollution events; (2) Sources of Bangkok pollution: Bangkok's air pollution comes from multiple sources; vehicle exhaust (particularly diesel trucks, old two-stroke motorcycles, and buses) is the baseline source year-round; agricultural burning from northern Thailand's rice stubble burning and northern Myanmar's forest clearing seasonally amplifies pollution significantly; construction dust, industrial emissions from the eastern seaboard, and occasional Malaysian peatland fires contribute additionally; (3) Air quality monitoring resources: Bangkok has official government monitoring stations reporting hourly; Air4Thai (website and app, Department of Pollution Control) provides official readings; IQAir website and app provides real-time global air quality comparison with additional sensors; AirVisual and similar apps give location-specific readings; US Embassy Bangkok maintains an independent monitor (via airnow.gov); (4) Health impact thresholds: PM2.5 below 35 μg/m3 (24-hour average) is the US EPA standard for acceptable; Bangkok's peak pollution events regularly reach 70–150 μg/m3; short-term exposure at these levels affects immediate respiratory health; chronic exposure is associated with cardiovascular and respiratory disease; populations with asthma, heart disease, or pregnancy face higher sensitivity; (5) Indoor air quality in Bangkok: Bangkok's air-conditioned indoor environments (hotels, malls, offices) significantly filter outdoor air; HVAC systems with proper filtration reduce indoor PM2.5 substantially; purchasing a portable HEPA air purifier for accommodation where staying for an extended period provides additional indoor air quality protection.",
    action: "AirVisual app (IQAir) for real-time Bangkok air quality; Air4Thai.com for official Thai government readings; US Embassy Bangkok monitor at airnow.gov; N95 mask (KF94 equivalent acceptable) purchase at most Bangkok pharmacies; HEPA air purifier brands available at Bangkok electronics stores: Xiaomi, Dyson, Philips, Levoit; Boots Pharmacy carries N95 masks in Bangkok.",
  },
  {
    title: "Bangkok Flood Risk — Annual Flooding, Mitigation & What Residents Do",
    emoji: "🌊",
    summary: "Bangkok is one of the world's most flood-vulnerable major cities with a complex relationship with water: (1) Bangkok's structural flood vulnerability: Bangkok sits on the Chao Phraya delta at approximately 1.5m above sea level; the city is subsiding at 1–3cm per year from groundwater extraction, increasing flood risk annually; the 2011 Thailand mega-flood (the country's worst in modern history) inundated Bangkok's outer districts for months and caused 4,000+ deaths nationally; (2) Annual flood season (October–November): even in non-mega-flood years, Bangkok experiences seasonal flooding during the October–November peak of monsoon and northern watershed runoff; certain low-lying areas (Bang Khen, Lat Krabang, Bang Khun Thian, outer Nonthaburi) flood regularly; central Bangkok and elevated areas flood less frequently; (3) Bangkok's flood management infrastructure: after the 2011 mega-flood, Bangkok invested in canal expansion, pump stations, and floodgate management; the system is significantly improved but remains vulnerable to extreme events; Chao Phraya river monitoring (water level at Bangkok reads online) provides advance warning of major flooding; (4) Neighborhood elevation differences: Bangkok's neighborhoods have significantly different flood risk profiles based on elevation and drainage; checking neighborhood-specific flood history (through Thai social media or Bangkok flood risk maps) before choosing accommodation or long-term rental is advisable during flood season; (5) Resident flood preparedness: Bangkok residents in flood-prone areas maintain flood preparation practices: having a car parked on elevated ground, keeping 1–2 weeks of supplies, owning waterproof boots, and monitoring flood news are normal practices; the annual flood season is a managed cultural reality rather than an exceptional event for most Bangkok residents.",
    action: "Bangkok Metropolitan Administration (BMA) flood center at bangkokflood.go.th for official flood zone maps and warnings; Chao Phraya water level monitoring at rid.go.th; Bangkok flood Facebook groups for community-sourced real-time flood depth updates; sandbag distribution points announced by district offices; flood insurance for long-stay residents: available through Thai insurance companies (Muang Thai, Bangkok Life Assurance, Krungthai-AXA).",
  },
  {
    title: "Bangkok Sustainability & Climate Action — What's Changing in 2024-2026",
    emoji: "♻️",
    summary: "Bangkok is taking incremental steps toward sustainability against a backdrop of significant environmental challenges: (1) BTS and MRT expansion as sustainability infrastructure: Bangkok's ongoing rapid transit expansion (BTS dark green line, yellow line, pink line, orange line) directly reduces private vehicle emissions in the city by providing alternatives to driving; the current expansion plan extends Bangkok's rail coverage to areas previously accessible only by car; (2) EV adoption in Thailand: Thailand is pursuing aggressive EV manufacturing and adoption targets; the Thai government's EV3.0 and EV3.5 policies (subsidies, tax incentives for EV purchases) are driving rapid growth in EV car and motorcycle purchases; EV motorcycles (delivered by food delivery workers using Grab Food, Line Man) are visibly increasing in Bangkok's streets; EV public buses are being gradually introduced; (3) Bangkok's single-use plastic reduction: Thailand's 2020 bag ban (major retail outlets) and subsequent legislation reducing single-use plastics has produced visible change in Bangkok's retail environment; reusable bag adoption at markets and malls is substantially higher than pre-2020; single-use plastic straw and cutlery bans in major chains represent incremental progress; (4) Urban green space and tree programs: Bangkok's chronic lack of urban green space (3.3m2 per person vs. WHO guideline of 9m2) is being addressed through initiatives including rooftop greening mandates for new buildings, canal-side green corridors, and tree-planting programs; the pace is insufficient relative to Bangkok's building rate but represents directional improvement; (5) Community-level sustainability: Bangkok's bottom-up sustainability community (Refill Station zero-waste shops, Chiang Mai and Bangkok community fridges, bicycle cooperative groups, farmers markets selling direct from organic producers) represents the most dynamic sustainability development; these grassroots initiatives often exceed government program ambition.",
    action: "Bangkok's Green Bangkok 2030 initiative documentation; EV bus routes in Bangkok (expanding, check BMTA updates); Refill Station Bangkok (refillstation.me) for zero-waste shopping; Wonderfruit festival (December, Pattaya/Bangkok) for sustainability-adjacent culture event; Global Power Synergy (GPSC, PTT subsidiary) solar and clean energy public information; Thailand's NDC (Nationally Determined Contribution) under Paris Agreement at onep.go.th for official climate commitment context.",
  },
];

export function BangkokEnvironment() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🌿 Bangkok environment — PM2.5 air quality, flood risk & sustainability progress
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-teal-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-teal-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
