const SPOTS = [
  {
    name: "White Water Rafting — Kanchanaburi Day Trip",
    emoji: "🚣",
    area: "Kanchanaburi (2.5–3 hours from Bangkok by road or train)",
    price: "Day tour package ฿1,500–3,000 including transport, rafting, lunch; DIY ฿800–1,200",
    why: "Kanchanaburi Province (the Death Railway bridge area west of Bangkok) offers the most accessible white water rafting day trip from Bangkok — the Kwai Yai and Kwai Noi rivers, fed by Kanchanaburi's mountain watershed, create Class II–III rapids suitable for beginners through intermediate rafters. Several Bangkok tour operators run day packages combining the bamboo raft ride (gentler floating, a separate activity) with white water inflatable raft sections. Kanchanaburi also combines WWII history (Death Railway museum, Bridge on the River Kwai) with nature activities — rafting plus history is a satisfying full day.",
    tip: "Kanchanaburi rafting practical tips: day tours from Bangkok depart 6–7am and return by 8pm — long day but manageable. Rainy season (June–October) has the best water levels for rafting; dry season (November–April) water levels may be lower and some sections less exciting. What to bring: secure sandals or old shoes you can get wet, change of clothes, sunscreen. The 'bamboo rafting' (floating slowly on wooden platforms) is completely different from white water inflatable rafting — don't confuse them when booking. For train option: the scenic Kanchanaburi train from Bangkok Thonburi station is an attraction itself — allow full day.",
  },
  {
    name: "River Activities — Chao Phraya & Bangkok Canals",
    emoji: "⛵",
    area: "Chao Phraya River, Bangkok canal network (Bang Krachao, Khlong Bangkok Noi)",
    price: "Private long-tail charter ฿1,500–3,000/hour; Canal tour ฿600–1,500/person",
    why: "Bangkok's Chao Phraya River and extensive canal network (klong) offer river activities beyond the typical Chiang Rai-style tourism — long-tail boat charters for private canal exploration, kayaking in Bang Krachao (the green lung area across from Bangkok, accessible by ferry), and traditional wooden boat rentals in canal communities outside central Bangkok. The canal culture of Bangkok (communities built on stilts over canals, floating markets, riverside temples) is experienced most authentically from the water rather than from bridges.",
    tip: "Bangkok canal exploration: Bang Krachao (Phra Pradaeng district, accessible from Si Phraya ferry pier) is the largest urban park in Bangkok's metro area — explore by bicycle rental plus kayak/paddleboat. The canal market areas reachable by khlong boat (Khlong Saen Saep canal, running east-west) provide public transport through old Bangkok neighborhoods. Private long-tail charter: negotiate rate before departure (no meter), specify duration clearly, and bring sunscreen for open-water sections. Canal kayaking: standalone kayak rental at Bang Krachao is available without requiring tour operators — rental shops near the ferry landing rent self-guided.",
  },
  {
    name: "Kaeng Krachan & National Park Water Activities",
    emoji: "🏔️",
    area: "Kaeng Krachan (2.5 hours south from Bangkok), Koh Chang (5 hours + ferry)",
    price: "Kaeng Krachan kayak rental ฿300–600/half day; Guided package ฿800–2,500",
    why: "Kaeng Krachan National Park (Thailand's largest national park, 2.5 hours from Bangkok in Phetchaburi Province) has the Kaeng Krachan Reservoir — a large artificial lake created by the Kaeng Krachan Dam — where flatwater kayaking and boating activities operate. The reservoir is surrounded by forested national park hills with birdwatching (Kaeng Krachan is among Asia's premier birding sites), wildlife, and camping. Day trips from Bangkok are possible; overnight stays at park bungalows are recommended for serious nature activities. The natural environment contrast with Bangkok is dramatic.",
    tip: "Kaeng Krachan day trip logistics: departure before 6am from Bangkok is required for meaningful time at the park. Best seasons: November–February for birdwatching and comfortable climate; March–May for flowering season; avoid major rainy season months (September–October) as roads may flood. Kayak rental at the dam area is straightforward — no advance booking typically needed for individual kayaks. The floating bungalows (accommodation on the reservoir) offer sunrise experiences that reward overnight stays. Wildlife: wild elephants, hornbills, and diverse birds make Kaeng Krachan exceptional compared to other Bangkok day trip destinations.",
  },
];

export function BangkokRafting() {
  return (
    <div className="rounded-2xl border border-blue-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-800 mb-3">
        🚣 Rafting & river activities near Bangkok — Kanchanaburi rapids, canal kayaking & national park lakes
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
