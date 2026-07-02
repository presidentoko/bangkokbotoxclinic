const SPOTS = [
  {
    name: "Motocross & Dirt Biking in the Bangkok Area",
    emoji: "🏍️",
    area: "Nakhon Pathom Province motocross tracks (60km west of Bangkok), Saraburi Province MX tracks (80km north), Bang Na district weekend track rentals, dedicated motocross parks in greater Bangkok metropolitan area",
    price: "Track day entry: ฿200–500; Dirt bike rental (CRF150/250): ฿800–2,000/half day; Beginner lesson: ฿1,500–3,500; Full enduro bike rental: ฿2,500–5,000/day",
    why: "Thailand's motorcycle culture extends far beyond the ubiquitous scooters of Bangkok streets into a serious off-road racing and recreation community. Motocross (high-speed track racing over jumps and berms) and enduro (long-distance off-road adventure riding) both have significant Thai communities, with purpose-built tracks within 60–80km of Bangkok. Thai motocross riders compete nationally and internationally — the relatively flat terrain of central Thailand's outer provinces hosts full-featured MX tracks with safety fencing, timing systems, and training areas. For visitors with off-road experience, track day rentals provide access to properly maintained CRF150F, CRF250F, and similar competition bikes without the insurance logistics of international riding. Bangkok's motorcycle parts ecosystem — a major advantage for the off-road community — means virtually any motocross component is available through the parts districts near Ratchadaphisek and Pratunam.",
    tip: "Bangkok motocross access for visitors: (1) Experience requirement: while complete beginner lessons are available, motocross track access typically assumes some riding experience; absolute beginners should start with a Thai motorcycle trial class before attempting track riding; (2) Protective gear: full motocross gear (helmet, goggles, chest protector, knee guards, gloves, boots) is mandatory at reputable tracks; rental gear is available at most tracks but quality varies — bringing your own helmet is advisable; (3) License context: riding in Thailand on a motocross track doesn't require an international driving permit (which governs road use); track riding is private property; (4) Thai motocross community: the Thai MX Facebook community posts track conditions, upcoming race events, and ride-out opportunities — connecting with local riders reveals informal track days and weekend events; (5) Enduro alternative: for visitors seeking off-road adventure without the jumps/racing focus, guided enduro tours through rural Thailand (outside Bangkok, full-day) provide real trail riding through Thai countryside — several Bangkok-based operators offer this.",
  },
  {
    name: "Supermoto & Track Day Racing Near Bangkok",
    emoji: "🏎️",
    area: "Bira International Circuit (Pattaya, 2 hours southeast), Thunderdome Motorsport Park (Nakhon Ratchasima, 4 hours), dedicated supermoto tracks in greater Bangkok area, occasional closed-road events",
    price: "Track day registration: ฿1,500–4,000; Motorcycle track rental (supermoto): ฿3,000–8,000/half day; Professional instruction: ฿3,000–8,000; Racing school (multi-day): ฿15,000–40,000",
    why: "Supermoto (a hybrid motorcycle discipline combining motocross bikes with road racing tires and technique, typically on circuits mixing paved and unpaved sections) has a dedicated Thai following — an increasingly popular crossover from both the MX and road racing communities. Bira International Circuit (Pattaya), the most significant motorsport venue accessible from Bangkok, hosts supermoto events alongside car track days and motorcycle road racing. The circuit was Thailand's first international racing venue and continues to host national championship events as well as casual track days open to recreational riders with appropriate equipment. For the broader motorsport enthusiast, Bira hosts Formula events, sports car track days, and various motorcycle classes — making a dedicated track day excursion from Bangkok viable for a full weekend of varied motorsport.",
    tip: "Bangkok area track day practical guide: (1) Bira Circuit logistics: located in Pattaya (145km from Bangkok), typically 2 hours by car; a one-day track trip from Bangkok combines morning drive, afternoon riding, and evening return; (2) Bringing your own motorcycle: track day participants typically bring their own motorcycles on truck/trailer, or rent at the circuit; renting in Bangkok and riding to the track is generally not advisable due to traffic; (3) Technical inspection: track days at Bira require basic technical inspection of your vehicle (brake check, fluid check, no major leaks); rental bikes from track-affiliated services arrive pre-inspected; (4) Licensing: track day participation on private circuits doesn't require road licensing — the event liability waiver and technical inspection serve as the primary gate; (5) Thai racing community: the Bangkok/Pattaya motorsport Facebook groups post track day schedules, carpool opportunities, and equipment sharing — engaging with the community is the fastest route to your first track day.",
  },
  {
    name: "Karting & Indoor Racing in Bangkok",
    emoji: "🏁",
    area: "EVO Karting (Ekkamai, indoor), Kart Mania (major karting venues in outer Bangkok suburbs), RCA (Royal City Avenue) area entertainment karting, hotel and resort karting circuits in Pattaya",
    price: "Indoor karting 10 minutes: ฿350–600; Outdoor go-kart 15 minutes: ฿400–800; Race package (30 min + timing): ฿800–1,500; Private circuit hire: ฿5,000–15,000/hour",
    why: "Bangkok's karting scene has professionalized significantly over the past decade — what was once primarily a tourist entertainment option now includes proper racing karts (not just leisure karts), timing systems, competitive race day events, and a dedicated community of karting enthusiasts. Indoor karting venues in Bangkok (particularly in Ekkamai and Ratchada areas) operate year-round regardless of weather, with electric karts producing lower noise suitable for urban locations. Outdoor venues in Bangkok's suburbs offer more powerful gas karts on longer circuits with elevation changes. The competitive karting scene in Thailand feeds into Southeast Asian motorsport development — junior karting competitions serve as the first step in Thailand's motorsport pyramid for young racing prospects. For visitors: Bangkok karting venues are typically accessible without reservations on weekday evenings, often require booking in advance for weekend race events.",
    tip: "Bangkok karting experience guide: (1) Indoor vs outdoor: indoor venues (electric karts, air-conditioned) prioritize year-round accessibility and safety for casual participants; outdoor circuits (gas karts, higher speed) are better for experienced drivers wanting genuine performance sensation; (2) Helmet and equipment: reputable karting venues provide race-quality full-face helmets; driving gloves and overalls are provided at better venues; (3) Race format: most karting venues offer both timed free practice and structured race events (5–8 lap races, grid positions from qualifying time) — the race format significantly elevates engagement beyond just driving laps; (4) Children's karting: Bangkok karting venues typically have junior karts for children 6+ years (minimum height ~130cm); always verify age/height minimums before visiting with children; (5) F1 connection: Bangkok has produced international racing talent; the venues that feed local development tend to have professional-level maintenance standards and coaching availability.",
  },
];

export function BangkokMotocross() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏍️ Bangkok motorsport — motocross, track days & karting circuits
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
