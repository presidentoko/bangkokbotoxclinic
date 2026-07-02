const SPOTS = [
  {
    name: "Paramotor & Powered Paragliding Near Bangkok",
    emoji: "🪂",
    area: "Suphanburi Province (1.5 hours north of Bangkok), Nakhon Pathom area, rural areas outside Bangkok with flat agricultural land and good wind exposure",
    price: "Paramotor tandem intro flight: ฿3,500–6,000; Full paramotor course: ฿35,000–80,000 (15–20 hour training); Equipment rental per flight: ฿2,000–4,000",
    why: "Powered paragliding (paramotor) has a dedicated and growing enthusiast community near Bangkok — taking advantage of Thailand's flat central plains, predictable seasonal winds, and relatively uncrowded airspace outside metropolitan areas. A paramotor is an ultra-light aircraft: a backpack-mounted propeller engine worn by the pilot who controls a paraglider wing above — requiring minimal infrastructure (any flat field large enough to run 30 meters serves as a launch site) and offering extraordinary low-altitude aerial views of Thailand's agricultural landscape. The central plains around Suphanburi and Nakhon Pathom provinces (rice paddies, sugarcane, fruit orchards, ancient wats visible from the air) create spectacular scenery at 200–500 meter altitudes. Bangkok's paramotor community is accessible through Facebook groups and weekend flight meetups — the entry barriers are relatively lower than fixed-wing aviation (no airport required, equipment costs ฿150,000–350,000 for a complete setup).",
    tip: "Paramotor Bangkok area guidance: (1) Tandems first: experiencing a tandem paramotor flight before committing to full training is standard — it reveals whether the sensation (floating slowly over Thai countryside at 20–40 km/h) is genuinely appealing to you; (2) Best flying seasons: cool season (November–February) offers the most stable flying conditions near Bangkok; hot season (March–May) has stronger thermals requiring more skill; wet season flights are limited by rain and wind; (3) Regulatory context: Thai civil aviation regulates paramotoring — licensed schools operating legally provide proper insurance, certified instruction, and navigation guidance; avoid unlicensed operators who skip regulatory requirements; (4) Facebook groups: 'Paramotor Thailand' and related Thai-language paramotor communities post weekend fly-out schedules where tandem opportunities sometimes arise; (5) Photography potential: paramotor altitude (200–500m) and slow speed (hovering possible with headwind) produces unique aerial photography that drones approach but the embodied experience of doesn't replicate.",
  },
  {
    name: "Hot Air Balloon Experience Near Bangkok",
    emoji: "🎈",
    area: "Ayutthaya (historical hot air balloon flight operations), Chiang Mai (more established market), rural areas outside Bangkok with balloon operators — exact location varies by season and operator",
    price: "Hot air balloon 1-hour flight: ฿8,000–15,000 per person; Private balloon charter: ฿60,000–120,000; Sunset/sunrise premium: ฿12,000–18,000",
    why: "Hot air balloon experiences in Thailand are most established in Chiang Mai (the northern valley surrounded by mountains is ideal), but balloon operators periodically offer flights in and near Ayutthaya (floating over the UNESCO World Heritage temple ruins provides extraordinary aerial perspectives) and occasionally the central plains near Bangkok. The hot air balloon experience: pre-dawn start (4:30–5am), inflation as sunrise approaches, 45–90 minutes of floating at heights from 100–1,000 meters, champagne celebration on landing. Ayutthaya balloon flights (when operators are active) provide the most historically and photographically dramatic Bangkok-area balloon experience — the ancient prangs (spired towers) and wat complexes visible from above against the surrounding flood plain create images unavailable from any other vantage point. Balloon operations are weather-dependent and may cancel with minimal notice — flexibility in scheduling is essential.",
    tip: "Bangkok area hot air balloon logistics: (1) Seasonality: balloon flights in central Thailand are most feasible in the cool dry season (November–February) — wet season and hot season wind patterns limit operations; (2) Booking approach: searching for active operators at the time of visit (operators come and go in the Thai market) via TripAdvisor, tour operators, and hotel concierge provides more current information than fixed recommendations; (3) Ayutthaya access: Ayutthaya is 80km north of Bangkok and reachable by train (frequent service, ฿15–20), bus (van from Mo Chit, ฿70), or organized tour — combining balloon flight with a half-day historical site exploration makes a compelling single-day excursion from Bangkok; (4) Photography gear: sunrise hot air balloon flights produce extraordinary photographs; bring your best camera/phone with adequate battery life and consider a wrist strap as dropping anything from a balloon basket is unrecoverable.",
  },
  {
    name: "Drone Racing & FPV Drone Hobby in Bangkok",
    emoji: "🚁",
    area: "RC hobby shops in Chatuchak and Pratunam areas, FPV drone racing venues in outer Bangkok suburbs, dedicated drone hobby communities throughout the metropolitan area",
    price: "FPV drone racing setup: ฿8,000–30,000 (beginner kit); Racing drone build: ฿3,000–15,000 (DIY parts from Chatuchak); Drone racing club entry: ฿200–500/session; FPV simulator subscription: ฿200–500/month",
    why: "FPV (First Person View) drone racing has a significant and growing hobbyist community in Bangkok — pilots wearing video goggles fly racing drones at 80–150 km/h through obstacle courses, experiencing the sensation of flight from the drone's perspective. Thailand's electronics and RC hobby supply ecosystem (extensive Chatuchak Weekend Market RC section, numerous specialized shops in Pratunam) means parts availability is excellent and costs are lower than in many Western markets. The FPV community in Bangkok meets at indoor and outdoor racing venues, with courses set up at abandoned industrial sites, outdoor sports facilities, and indoor arenas adapted for drone racing. The hobby has both recreational (freestyle flying, proximity flying over scenic locations) and competitive (organized race events, international competition preparation) dimensions. Thailand's broader drone regulations require registration for drones above 2kg and prohibit flights near airports, government buildings, and in certain congested airspace — FPV racing within clubs operates in approved venues within these regulations.",
    tip: "Bangkok FPV drone community access: (1) Chatuchak Weekend Market (RC section, Saturday/Sunday): the most accessible starting point for drone hobby parts, complete sets, and connecting with the local hobbyist community; shopkeepers can direct to local clubs and events; (2) FPV simulation: before spending on hardware, the FPV simulator community (Velocidrone, Liftoff, DRL Simulator) allows practicing flight controls at zero cost — the muscle memory transfers significantly to real flight; (3) Thai drone regulations: Department of Civil Aviation (DCA) registration is required for drones above 250g in Thailand; flying without registration carries significant fines; racing clubs operate in designated venues where group registration and airspace coordination is managed; (4) Racing vs. freestyle: FPV racing (gate-to-gate speed), freestyle (acrobatic tricks), and cinema (smooth, controlled shots for video production) are distinct subdisciplines with different aircraft and skill sets; (5) Bangkok FPV Facebook Group: most active community coordination happens through Thai-language Facebook groups — searching 'FPV Thailand' or 'FPV Bangkok' connects with the local community.",
  },
];

export function BangkokAerialSports() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🪂 Bangkok aerial activities — paramotor, hot air balloon & FPV drone racing
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-sky-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
