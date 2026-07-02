const SPOTS = [
  {
    name: "Bangkok's BTS Skytrain & MRT — The Daily Transit System",
    emoji: "🚇",
    area: "BTS Sukhumvit Line (Mo Chit to Kheha), Silom Line (National Stadium to Bang Wa), MRT Blue/Purple Lines",
    price: "BTS single fare ฿17–59 (distance-based); MRT single fare ฿16–70; Rabbit card & stored value reduce costs",
    why: "Bangkok's elevated rail network is the backbone of foreigner-navigable urban mobility — the BTS Skytrain and MRT together cover the primary commercial and residential corridors used by expats and tourists. The BTS Sukhumvit Line (from the northern Mo Chit station through central Asok/Nana to southern extensions) and Silom Line (serving the financial district, Lumpini Park, and connecting to Chao Phraya boat services) are the primary expat-used lines. The MRT Blue Line adds coverage through Chinatown (Hua Lamphong, Sam Yot stations) and connects to the main Hua Lamphong train station. Bangkok's rail network has expanded significantly in the 2020s — the Gold Line (monorail to Icon Siam mall), Purple Line (northwest Bangkok), and Airport Rail Link (to Suvarnabhumi) complete the formal rail infrastructure.",
    tip: "Rail navigation efficiency: Google Maps provides real-time BTS/MRT navigation — use it for routing; accuracy is consistently good. Rabbit Card (BTS stored-value card): reduces fare compared to single-trip purchases and allows tap-in/tap-out; sold at BTS stations. MRT Card: separate system requiring separate card or single-trip tokens — integration between BTS and MRT requires manual transfer and re-entry. Off-peak hours: BTS/MRT crowd density during rush hour (7:30–9am, 5–7pm weekdays) is extreme — Bangkok's rail reaches a different level of density than most international rail systems. Travel hack: the MRT airport link vs. taxi: the Airport Rail Link to Phaya Thai (connecting to BTS) takes 30–45 minutes at ฿45 versus 1–2 hours by taxi for ฿300–600+ (traffic-dependent).",
  },
  {
    name: "Bangkok's Waterways — Boats & Canals",
    emoji: "⛵",
    area: "Chao Phraya Express Boat (central Bangkok river corridor), Khlong Saen Saep canal ferry (east-west across Bangkok)",
    price: "Chao Phraya Express Boat ฿15–40/trip; Khlong Saen Saep ฿12–20/trip; Tourist Boat ฿200/day unlimited",
    why: "Bangkok's river and canal transport is one of the most underused mobility options for tourists and even some expats — the Chao Phraya Express Boat (orange flag, express service) runs from the northern piers near Nonthaburi to the central business district piers and tourist areas (Wat Arun, Wat Pho, Grand Palace area) in 20–40 minutes regardless of road traffic. The Khlong Saen Saep canal ferry runs east-west across Bangkok from Bangkapi through Pratunam to Panfa Leelard near Khao San Road — dramatically faster than road transport for its route and used primarily by Thais for daily commuting (fewer tourists take it, making it a more local experience). Both boat systems operate during daylight hours only.",
    tip: "Boat transport practical advice: the Chao Phraya Express Boat has multiple colored flag services (orange flag runs most frequently; blue flag tourist boats are more expensive but have English narration; yellow flag is limited hours). Pier identification: each pier has a numbered designation — know your departure and destination pier numbers. The Khlong Saen Saep canal: the transfer point at Pratunam market area requires getting off at Panfa Leelard or Saphan Hua Chang pier and walking to re-board — ask locals if confused. Bang Krachao: the green peninsula across the river from industrial areas south of Bangkok is accessible by canal boat — cycling around this preserved 'lung of Bangkok' green space is an outstanding half-day activity within city limits.",
  },
  {
    name: "Thailand Long-Distance Rail — Bangkok to Chiang Mai & South",
    emoji: "🚂",
    area: "Hua Lamphong Station (Bangkok), destinations: Chiang Mai (north), Surat Thani (south), Ayutthaya, Kanchanaburi",
    price: "Bangkok–Chiang Mai sleeper ฿891–1,953 (class dependent); Bangkok–Surat Thani ฿600–1,500; Booking at counter or at 12go.asia",
    why: "Thailand's State Railway (SRT) network is the long-distance train system connecting Bangkok to the major regions — the Bangkok–Chiang Mai overnight sleeper train (approximately 12 hours, overnight) is one of Thailand's iconic travel experiences. Second-class air-conditioned sleeper berths are clean, comfortable, and authentic — the experience of waking in the mountains outside Chiang Mai as the train descends from the northern plateau has been described by experienced travelers as one of Asia's great rail journey awakenings. The southern rail line serves the Gulf coast and connects to Malaysia and Singapore (long-distance). Ayutthaya from Bangkok by train is the classic domestic day trip (1.5 hours, ฿20 third class).",
    tip: "Thai train booking logistics: the State Railway online booking system (railway.co.th) books in advance — highly recommended for overnight sleepers, especially holiday periods. Second-class sleeper vs. first class: second-class air-conditioned sleeper (bunk with curtain) is the best value long-distance option — cleaner and more comfortable than international budget travelers expect. First class (private cabin for 2) is available but significantly more expensive. Luggage: no checked luggage system on Thai trains — bring what you can carry. Departure punctuality: Thai trains are often 1–2 hours late on longer routes; factor into arrival planning. The Bangkok–Chiang Mai route has introduced newer Sprinter train services (faster, diesel, no sleeper) — less romantic but time-efficient.",
  },
];

export function BangkokHighSpeedRail() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🚇 Bangkok transport guide — BTS/MRT, river boats & long-distance trains to Chiang Mai
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
