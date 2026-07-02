const SPOTS = [
  {
    name: "Kaeng Krachan National Park",
    emoji: "🌳",
    area: "Phetchaburi Province, 3 hours from Bangkok (self-drive or guided tour)",
    price: "National park entry ฿400 (foreigner); Guided safari ฿2,500–6,000; Camping ฿30–90/person/night",
    why: "Kaeng Krachan is Thailand's largest national park and the most accessible significant wilderness area from Bangkok — covering 2,915 sq km of forested hills along the Myanmar border. The park protects exceptional wildlife including Asian elephant, tiger (rare but present), gaur (Indian bison), leopard, sun bear, Malaysian tapir, and over 400 bird species. The bird diversity at Kaeng Krachan is extraordinary — this is considered one of Thailand's top three birding destinations. The park's camp area along the Ban Krang River provides riverside camping with wildlife approaching the water source at dawn and dusk. The 'sea of mist' morning phenomenon (cloud inversion visible from the park's high points) is photographically spectacular and increasingly known among Bangkok weekenders.",
    tip: "Kaeng Krachan practical guide: self-driving requires a car (the interior trails require a 4WD during rainy season, June–November). Wildlife viewing: the Ban Krang river area at dawn and dusk provides the highest probability wildlife encounters — arriving before 6am is essential. Bird watching: the Km35 checkpoint area and the area around the reservoir are premier birding spots — local guides available at the park headquarters know specific bird locations. Road conditions: confirm road status before visiting during the rainy season — the interior roads flood and close. Alternative approach: day tour operators from Bangkok (depart 5am, return 8pm) are the most practical Bangkok-day-trip format though night stay dramatically improves wildlife sightings.",
  },
  {
    name: "Kanchanaburi — Waterfalls & Elephants",
    emoji: "🐘",
    area: "Kanchanaburi Province, 2.5 hours from Bangkok by road",
    price: "Erawan Falls entry ฿300 (foreigner); Ethical elephant sanctuary ฿1,500–3,000; Train to Kanchanaburi ฿100",
    why: "Kanchanaburi is Bangkok's most popular nature weekend destination — combining the famous 7-tier Erawan Falls (some of the most beautiful turquoise-pool waterfalls in Thailand), ethical elephant encounters at sanctuaries, the Death Railway historical site, and the Tiger Temple (controversial, but replaced by ethical wildlife experiences at reputable sanctuaries). The Erawan Falls trail (4km round trip from the parking area) passes through forest to each progressive tier — the higher tiers require swimming through clear pools to access them. The Kanchanaburi region's rivers provide rafting, kayaking, and floating raft house accommodation on the Kwai Yai and Kwai Noi rivers.",
    tip: "Erawan Falls logistics: arrive as early as possible (falls open at 8am) to avoid crowds — weekend afternoons are extremely crowded at the lower tiers. Fish feeding: the Erawan pools have enormous fish that will eat bread from your hand — bring bread sold at the entrance. Ethical elephant experiences: look for sanctuaries where elephants are not ridden and have appropriate herd social structures — Elephant Haven Kanchanaburi and Kanchanaburi Elephant Camp are recommended starting points for research. Kanchanaburi overnight: the Death Railway bridge area has good guesthouse accommodation on the river — a night stay allows both the historical sites and early morning natural area access.",
  },
  {
    name: "Khao Yai National Park",
    emoji: "🦜",
    area: "Nakhon Ratchasima Province, 3 hours from Bangkok (most accessible via Pak Chong)",
    price: "National park entry ฿400 (foreigner); Night safari ฿1,500–3,000; Guided wildlife walk ฿1,000–2,500",
    why: "Khao Yai is Thailand's oldest national park (established 1962) and a UNESCO World Heritage Site — it protects one of the world's largest remaining monsoon forest tracts and has exceptional wildlife. The park's wildlife includes Asian elephant, gaur, sambar deer, barking deer, macaque troops, gibbons, hornbills (the great hornbill is spectacular), and excellent reptile diversity. The area around Khao Yai has developed significant tourism infrastructure: the Pak Chong town near the park entrance has international-standard accommodation (there's even a vineyard wine region), restaurants, and tour operators. Khao Yai is accessible and polished as a nature destination — the most user-friendly Thailand national park for first-time visitors.",
    tip: "Khao Yai practical guidance: the evening guided night walk (departing around 7pm from the park visitor center) is exceptional for spotting sambar deer, flying squirrels, civets, and occasionally larger mammals in headlamp light. Self-driving requires entry at specific gates and registration. Khao Yai weekend: staying in Pak Chong area Saturday night allows both evening and early morning park visits — far superior to day trip from Bangkok. Elephant encounters: Khao Yai's wild elephants occasionally enter the road zones — they have right of way and vehicles must stop and wait; sighting a wild elephant herd crossing the road is a profound experience. Orchid season: June–August when monsoon rains trigger forest orchid blooms throughout the park trail system.",
  },
];

export function BangkokNatureEscape() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌳 Nature escapes from Bangkok — Kaeng Krachan, Kanchanaburi & Khao Yai national parks
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
