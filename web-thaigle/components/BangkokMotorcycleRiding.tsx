const SPOTS = [
  {
    name: "Motorcycle Culture & Riding in Bangkok",
    emoji: "🏍️",
    area: "Bangkok's roads (motorbike taxis everywhere), motorcycle shops (Lat Phrao, Ratchadaphisek corridor)",
    price: "Motorbike taxi ride ฿20–150; Motorcycle rental ฿200–500/day; New beginner motorcycle ฿40,000–80,000",
    why: "Motorcycles are integral to Bangkok's urban mobility fabric — the orange-vested motorbike taxi (win motorcycle) network handles last-mile connectivity throughout the city, particularly important for navigating the sois (side streets) that larger vehicles can't efficiently access. The riding culture in Bangkok itself is challenging for recreational purposes — traffic density, unpredictable lane behavior, and road hazards make urban Bangkok riding significantly more demanding than the motorcycling scenes in European or American cities. For expats and long-term residents: a motorcycle becomes practical for specific Bangkok contexts (early morning commutes when traffic is lighter, specific neighborhood navigation, weekend excursions). Thailand's motorcycle culture outside Bangkok — on weekend roads in nearby provinces, in Chiang Mai city navigation, and on coastal and mountain touring routes — is genuinely excellent.",
    tip: "Bangkok motorcycle practical requirements: international driving permit with motorcycle category (Class A or equivalent) is technically required; Thai driving license obtainable through the Land Transport Department process (typically 1–2 days for foreigners with international permit). Insurance: third-party insurance minimum is legally required for all road vehicles including motorcycles. The realistic rider advice for newcomers: start on a small automatic scooter (Honda PCX or Click, 125–150cc) in low-traffic areas before attempting Bangkok main road navigation. Gear: even on short rides, full-face helmet, gloves, and long-sleeve clothing dramatically reduce injury severity in falls — the Bangkok informal 'helmet only' standard is insufficient protection for any serious riding.",
  },
  {
    name: "Thailand Motorcycle Touring",
    emoji: "🛣️",
    area: "Mae Hong Son Loop (north), Khao Yai–Kanchanaburi circuit, southern coastal routes",
    price: "Motorcycle rental for touring ฿400–1,500/day; Fuel ฿100–400/day; Accommodation varies",
    why: "Thailand has some of Southeast Asia's best motorcycle touring roads — the north's Mae Hong Son Loop (1,864km, 7–10 days optimal) is considered one of the world's great motorcycle routes, combining mountain switchbacks, forest valleys, hilltribe villages, and the border landscape between Thailand, Myanmar, and Laos. The Doi Inthanon circuit from Chiang Mai provides mountain road experiences closer to Bangkok's access. For Bangkok-based riders: the Kanchanaburi circuit (2–3 days), the Khao Yai region roads, and the Gulf of Thailand coastal road toward Chumphon and Surat Thani are practical touring routes from Bangkok. Dry season (November–April) is optimal for northern touring; the south's Gulf of Thailand coast is accessible year-round.",
    tip: "Thailand touring motorcycle selection: Honda CRF250L, Royal Enfield Himalayan, and Kawasaki Versys 300 are common adventure-touring choices available for rent at Chiang Mai rental shops. For southern touring: Honda CB500X and similar mid-size adventure bikes are the practical choice — comfortable, reliable, good luggage capacity. Fuel: PTT and Bangchak petrol stations cover the main routes; premium fuel (Gasohol 91 or higher) for modern fuel-injected bikes. Border crossing by motorcycle: Thailand–Cambodia (Poi Pet/Aranya Prathet) and Thailand–Laos (Friendship Bridges) allow motorcycle crossing with proper documentation — research current regulations as they change. Big Bike community: the Thai big bike community (motorcycles above 400cc) has established routes, social rides, and Facebook groups that welcome visiting international riders.",
  },
  {
    name: "Motorbike Taxi Culture & Urban Riding",
    emoji: "🧢",
    area: "Motorcycle taxi stands (win) throughout Bangkok, every major intersection and soi entrance",
    price: "Short win ride ฿15–40; Cross-district ฿50–150; Via app (Grab bike) ฿30–120",
    why: "Bangkok's motorcycle taxi system (win, named after the queue stands where drivers wait) is one of the city's defining transportation institutions — the orange-vested drivers provide rapid point-to-point mobility that no other transport mode can match in Bangkok's congested environment. The system is hyperlocal: each win stand serves a specific neighborhood zone, with drivers who know every alley and shortcut within their territory. Grab Bike (app-based motorcycle taxi) provides the same mobility with metered pricing and GPS tracking — more comfortable for visitors unfamiliar with negotiating win fares. The win motorcycle taxi drivers are often from Isan (northeast Thailand) and form tight community networks — their knowledge of the city is encyclopedic, and their navigation of congested sois is often the fastest possible city movement.",
    tip: "Using Bangkok motorcycle taxis: always agree on price before boarding (win taxis, not Grab); ฿15 minimum, distance-based from there. Safety reality: helmets are provided but quality varies — riding pillion on Bangkok streets has genuine risk. The risk is real: Bangkok motorcycle accidents are among the city's main causes of tourist injuries. Grab Bike is somewhat safer because Grab enforces helmet requirements and vehicles are insured. Win taxi etiquette: holding onto the driver's waist or the rear handle is correct — some drivers have a waist handle attached; sitting upright (not leaning) and letting the driver lean into turns produces a smoother ride. Night riding: win taxis operate 24 hours at major stands; Grab Bike availability drops after midnight in most areas.",
  },
];

export function BangkokMotorcycleRiding() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏍️ Motorcycle riding in Bangkok & Thailand — urban motorbike taxis, touring routes & riding culture
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
