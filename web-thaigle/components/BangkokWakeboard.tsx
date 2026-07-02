const SPOTS = [
  {
    name: "Cable Wakeboarding in Bangkok",
    emoji: "🏄",
    area: "Wake Compound Bangkok (Ramkhamhaeng), Thailand Cable Wake Park (various locations outside Bangkok), Revolution Cable Park (Pattaya, 2 hours), dedicated wakeboard parks within 1 hour of city",
    price: "2-hour cable session: ฿400–700; Full day cable: ฿700–1,200; Beginner lesson: ฿1,500–2,500; Board rental: ฿200–400; Boot rental: ฿150–300",
    why: "Cable wakeboarding — where riders are pulled by an overhead cable system rather than a motorboat — is a popular water sport in Thailand with multiple cable parks accessible from Bangkok. The cable system is more beginner-friendly than boat towing (the pull is gentler and more consistent) and significantly cheaper (cable parks eliminate the boat fuel and driver costs). Thailand's warm year-round water temperature (28–32°C), flat calm lakes without boat wake interference, and tropical scenery make cable wake parks an excellent Bangkok-area activity. The Bangkok-area cable parks cater to all skill levels: absolute beginners can learn to stand up on the board within 2–3 hours, intermediate riders practice tricks and jumps at the features placed around the cable course, and advanced riders use the parks for competition preparation. Several cable parks have integrated wakesurfing, kneeboarding, and waterski options on the same cable infrastructure.",
    tip: "Bangkok cable park practical guide: (1) Beginner approach: don't try to stand immediately — let the cable pull you while kneeling on the board first, then gradually progress to standing; most falls in the early stage are harmless on the water surface; (2) Wetsuit consideration: Thailand's water is warm enough that wetsuits are not needed for comfort, but a rash guard or swimwear appropriate for repeated water contact and pull-up friction is useful; (3) Life jacket: required and provided by all reputable cable parks; (4) Timing: weekday mornings at Bangkok-area cable parks mean shorter wait times between runs; weekends see significant local Thai families and youth groups; (5) Transport: most Bangkok cable parks are accessible by private car (Grab) or sometimes via public transport; checking specific park transport information before visit avoids logistics surprises; (6) Cable park kitesurf connection: some Bangkok cable parks have diversified into wakeboarding plus kitesurfing lessons — parks that combine both disciplines offer a full water sports day.",
  },
  {
    name: "Kitesurfing Near Bangkok — Cha-Am & Hua Hin",
    emoji: "🪁",
    area: "Cha-Am beach (220km south of Bangkok, 2.5 hours), Hua Hin (230km south, 3 hours), Bang Tabun/Phetchaburi coast, dedicated kitesurfing schools at Thailand's kite hub beaches",
    price: "Beginner kitesurfing course (3 days, 9 hours): ฿8,000–15,000; IKO certification course: ฿12,000–20,000; Equipment rental (post-certification): ฿1,500–3,000/day; Full kite setup purchase: ฿50,000–150,000",
    why: "Cha-Am and Hua Hin on Thailand's Gulf of Thailand coast are the closest kitesurfing destinations to Bangkok — offering consistent thermal side-shore winds during the Thai kite season (typically December to May on the Gulf coast, with the east season on the East Coast at different times), flat water lagoons suitable for beginners, and a well-developed school infrastructure. The Gulf coast kite season aligns with Thailand's peak tourism season — pleasant weather, manageable crowds, and established accommodation infrastructure around the kite spots. Kitesurfing (controlling a large power kite while riding a small board across the water surface) is categorized as one of the more accessible water sports to learn: most beginners reach independent riding within 6–12 hours of instruction, though the learning curve involves genuine respect for the power of the kite. Bangkok serves as a logical base for weekend kitesurfing trips, with the 2.5–3 hour drive to Cha-Am/Hua Hin making a Friday evening departure and Sunday return viable.",
    tip: "Bangkok to Cha-Am/Hua Hin kitesurfing logistics: (1) IKO certification: the IKO (International Kiteboarding Organization) certification is the global standard; taking a course from an IKO-certified school ensures internationally recognized certification and standardized safety training; (2) Self-drive vs transport: driving from Bangkok allows carrying equipment; bus services from Bangkok to Hua Hin (from Southern Bus Terminal) run frequently and are affordable (฿150–250); (3) East vs West coast seasons: the Gulf coast (Cha-Am/Hua Hin) has its main kite season November–May; the East coast (Rayong, Pattaya area) has opposite season June–October; planning around season ensures good wind conditions; (4) Instructor selection: kitesurfing instruction requires genuine skill and certification; avoid cheap informal 'teaching friends' arrangements that skip safety protocols; (5) Accommodation: Cha-Am has affordable guesthouse options near the beach for weekend trips; Hua Hin offers more diverse accommodation including mid-range hotels with kitesurfing infrastructure.",
  },
  {
    name: "White Water Rafting & River Activities Near Bangkok",
    emoji: "🚣",
    area: "Kanchanaburi Province (2.5 hours west of Bangkok) — River Kwai area, rafting on Wang Noi and Kwae Noi rivers; Phetchaburi Province river tours; Ratchaburi Province kayaking",
    price: "Half-day white water rafting: ฿500–1,200 per person; Full day river rafting with lunch: ฿1,200–2,500; River kayaking: ฿600–1,500; Bamboo rafting: ฿300–800; Cave tubing (Kanchanaburi): ฿600–1,500",
    why: "While Bangkok itself is flat and its river network is too polluted and commercially busy for recreational rafting, Kanchanaburi Province (2.5 hours west) provides accessible white water rafting on the Wang Noi and Kwae Noi rivers through forested gorges. Kanchanaburi is best known for the River Kwai Bridge (built using Allied prisoner labor during World War II), but the province's river network, national parks (Erawan, Sai Yok), and jungle landscape create the backdrop for genuine outdoor water activities. The rafting experience in Kanchanaburi is typically mild (Class 2-3 rapids) making it family-accessible while providing genuine river navigation through jungle scenery. Erawan National Park's tiered emerald pools connected by a trail system offer a non-rafting water experience of extraordinary beauty — the swimming in natural pools beneath jungle waterfalls is among the most memorable water experiences accessible from Bangkok.",
    tip: "Kanchanaburi water activities from Bangkok: (1) Transport: AC mini-vans depart frequently from Bangkok's Southern Bus Terminal to Kanchanaburi town (2 hours, ฿100–120); organized day tours from Bangkok include transport; (2) Rafting operators: Kanchanaburi town has numerous tour operators offering rafting packages; comparison shopping for group size, equipment quality, and guide certification before booking; (3) Erawan National Park: requires separate transport from Kanchanaburi town (30 minutes by bus or songthaew); entry fee: ฿300 foreigners; the park has maximum daily visitor caps that can cause entry queues on peak weekends; (4) Cave tubing: Kanchanaburi has cave tubing options (floating through illuminated cave systems on inner tubes) that represent a unique combination of caving and water activity; (5) River Kwai region waterfall season: water volume and rafting conditions are best during and immediately after rainy season (September–November) — water levels decrease significantly by February; adjusting expectations accordingly.",
  },
];

export function BangkokWakeboard() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        🏄 Bangkok water sports — cable wakeboarding, kitesurfing & river rafting
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
