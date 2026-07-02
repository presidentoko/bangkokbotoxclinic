const SPOTS = [
  {
    name: "Day Hike from Bangkok — Kanchanaburi & Khao Yai",
    emoji: "🥾",
    area: "Khao Yai National Park (200km northeast, 2.5 hours), Kanchanaburi Province forests and Erawan National Park (2.5 hours west), Sam Roi Yot National Park (350km south)",
    price: "Khao Yai park entry: ฿400 foreigners; Guided Khao Yai trek: ฿1,500–4,000; Kanchanaburi Erawan National Park entry: ฿300; Transport from Bangkok (minivan): ฿150–250 each way",
    why: "While Bangkok itself offers no hiking terrain, the metropolitan area's proximity to excellent trail systems makes day or weekend hiking genuinely viable from the capital. Khao Yai National Park — a UNESCO World Heritage Site and one of Thailand's most significant wildlife sanctuaries — is 200km northeast of Bangkok and accessible for a day trip or overnight. The park hosts leopards, elephants, gibbons, hornbills, and diverse forest ecosystems across trail systems ranging from easy wildlife observation loops to full-day jungle treks. The cool season (November–February) is ideal for Khao Yai hiking — lower temperatures and occasional mist in the forested valleys create an otherworldly atmosphere. Kanchanaburi Province offers a different hiking character: the River Kwai valley and surrounding forests contain waterfall trails (Erawan's seven tiers), cave systems, and historical WWII-related trails through jungle that combines natural beauty with historical weight.",
    tip: "Bangkok day hiking logistics: (1) Khao Yai transport: minivans depart from Mo Chit Bus Terminal (Chatuchak area) regularly; organized tours from Bangkok include transport, guide, and lunch — often more practical than DIY for first-timers; (2) Khao Yai guide requirement: self-guided hiking in some Khao Yai areas is possible, but wildlife-focused treks require licensed park guides; booking through authorized tour operators ensures legally guided access; (3) Best wildlife timing: dawn and dusk are peak wildlife activity periods; overnight stays at park lodges maximize observation opportunities; (4) Leech season: during and after rainy season (June–October), blood-sucking leeches on forest trails are common — salt in a small container, tape over shoelace/boot openings, and tolerance are the management approaches; (5) Erawan timing: Erawan National Park's iconic turquoise tiered pools impose daily visitor limits (pre-booking essential on peak weekends) and close at 3pm to manage ecotourism impact.",
  },
  {
    name: "Trail Running Near Bangkok",
    emoji: "🏃",
    area: "Khao Yai (trail running routes), Bangkok's urban parks (Lumpini, Rot Fai, Chatuchak), Kanchanaburi trail running events, annual Thailand trail running races (various provinces)",
    price: "Race entry fees: ฿500–3,000 depending on distance; Trail running shoe investment: ฿3,000–12,000; Guided trail run: ฿1,500–4,000; Park entry: ฿300–400 foreigners",
    why: "Trail running has established itself as one of Bangkok's most active recreational running communities — a natural evolution from road running for runners seeking technical terrain, wildlife encounters, and natural setting. Bangkok's expat runner community (which is substantial — the Hash House Harriers have operated in Bangkok since 1952 and remain active) has increasingly diversified into trail running as Thailand's race calendar has expanded. Annual events like the Laguna Phuket Marathon Trail, Muay Thai Trail Run (Kanchanaburi), and various trail events around Khao Yai and Khao Kitchakut attract significant international participation. Bangkok's urban parks (Lumpini, Rot Fai, Chatuchak Park, Wachirabenchatat Park/Queen Sirikit park) serve as running hubs — Lumpini Park's 2.5km perimeter loop is a daily running institution; cool-season mornings see hundreds of runners circulating.",
    tip: "Bangkok trail running community access: (1) Hash House Harriers Bangkok: one of the world's most active HHH chapters, meeting weekly on Saturday afternoons for non-competitive hash runs with a significant social dimension; welcoming to all levels; joining requires only showing up at the advertised starting point; (2) Bangkok trail running groups: Facebook groups 'Bangkok Trail Runners' and 'Thailand Ultra Trail Running' announce group runs, race event information, and route recommendations; (3) Heat management: Bangkok's heat is the primary trail running challenge; running before 7am or after 5pm is essential; electrolyte management (coconut water and electrolyte sachets available in every Thai 7-Eleven) prevents heat-related issues; (4) Race calendar: Thailand's trail running race calendar has expanded significantly — checking Guidebook.com or Thai Running groups reveals current season options ranging from 10km trail entries to 100km ultra marathons; (5) Khao Yai trail running: the park's trail network (requiring park entry fee and occasional guide) offers some of Thailand's best accessible trail running terrain with wildlife — morning runs with hornbill sightings are memorable experiences.",
  },
  {
    name: "Rock Climbing Day Trips from Bangkok",
    emoji: "🧗",
    area: "Railay Beach (Krabi, 9 hours south), Crazy Horse Buttress (Chiang Mai, 10 hours north), Pha Pum (Kanchanaburi, 4 hours), indoor climbing gyms throughout Bangkok for training",
    price: "Bangkok indoor climbing gym: ฿200–400 day pass; Guided outdoor climbing (full day): ฿1,500–4,000; Krabi multi-day climbing trip: ฿3,000–8,000 (transport+guide+accommodation); Gear rental: ฿200–500/day",
    why: "Thailand has some of Southeast Asia's finest limestone sport climbing — particularly in Krabi and the south, where dramatic karst formations rise vertically from the sea and jungle with bolt-protected sport routes across all difficulty grades. While these world-class climbing destinations require travel from Bangkok (Krabi is best accessed by flight or overnight bus/train), Bangkok itself has a healthy indoor climbing gym scene that serves the significant local climbing community and visiting climbers looking to train. The indoor gyms range from small wall-only facilities to comprehensive climbing centers with bouldering, top rope, lead, and training facility components. Kanchanaburi Province (4 hours from Bangkok) has limestone crags at Pha Pum that represent the closest outdoor climbing to Bangkok — accessible for a weekend trip. Bangkok's climbing community uses the indoor gyms as a year-round training base, planning outdoor trips to Krabi during the cooler dry season (November–April) when the best sport climbing conditions prevail.",
    tip: "Bangkok climbing community access: (1) Indoor gyms: Bangkok has multiple dedicated climbing gyms in Ekkamai, Thonglor, Ratchada, and Sukhumvit areas — day passes include all safety equipment; bouldering sections (no rope required) offer the lowest barrier to entry; (2) Bangkok climbing community: the Thai climbing community is active on Facebook ('Thailand Climbing' group) and Instagram; connecting with local climbers enables access to climbing trip groups, carpooling to crags, and local knowledge; (3) Krabi trip planning: Railay Beach (accessible only by boat from Ao Nang) is Thailand's climbing mecca; November–April for best conditions; accommodation ranges from basic bungalows to comfortable resorts on the beach; half-day and full-day guided climbing available for all levels; (4) First-timer approach: taking a half-day introduction course at a Bangkok indoor gym (including harness fitting, belay techniques, and top-rope basics) before attempting outdoor climbing is strongly advisable; (5) Equipment investment: serious climbers will want their own shoes (crucial for performance) and harness; Bangkok's climbing shops (near the gyms) carry quality gear at prices competitive with international markets.",
  },
];

export function BangkokHiking() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🥾 Bangkok outdoor adventures — hiking, trail running & rock climbing from Bangkok
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-green-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
