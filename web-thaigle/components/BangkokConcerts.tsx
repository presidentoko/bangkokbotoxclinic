const VENUES = [
  {
    name: "IMPACT Arena",
    emoji: "🏟️",
    area: "Chaengwattana, north Bangkok (near Don Mueang Airport)",
    capacity: "8,000–12,000",
    why: "Bangkok's main international concert venue. Has hosted: Radiohead, Lorde, Adele, Ed Sheeran, BTS, Coldplay, Justin Bieber, Katy Perry, Lady Gaga. Full production arena. Well-organized entry, official F&B, decent sightlines from all sections. Connected to IMPACT complex (hotels, exhibition halls).",
    tip: "Grab/taxi to IMPACT is the only realistic option — public transport ends far away. Budget ฿200–400 one-way. Pre-book with driver from hotel or use Grab XL for groups. Fan zones often form outside hours before shows — worth arriving early for atmosphere.",
  },
  {
    name: "Rajamangala National Stadium",
    emoji: "⚽",
    area: "On Nut / Hua Mak area",
    capacity: "50,000+ (largest in Thailand)",
    why: "Thailand's largest stadium — used for mega-concerts. Has hosted Coldplay's 'Music of the Spheres' world tour (2024, sold out 4 nights), BTS, major Thai artist concerts. Outdoor venue — weather-dependent. BTS connection via BTS On Nut + taxi.",
    tip: "Outdoor stadium means bring rain protection — Bangkok weather is unpredictable. Screens visible from far sections. Food available inside at premium prices. Enter early to avoid bottleneck. Official merchandise booth queues can be 2+ hours — arrive very early if merchandise matters to you.",
  },
  {
    name: "Siam Paragon Royal Paragon Hall",
    emoji: "🎵",
    area: "Siam BTS",
    capacity: "2,000–5,000",
    why: "Premium mid-size venue inside Siam Paragon mall. Hosts K-pop fan meetings, EDM shows, Thai pop concerts, Japanese artists. Climate-controlled, excellent production values, very Bangkok luxury mall experience. Within shopping mall so arrive early for food options.",
    tip: "Tickets often sell out in hours for K-pop events — monitor official fan club presale dates. Standing and seated sections. The venue is inside a mall — combine concert with dinner before or after at Siam Paragon basement food hall.",
  },
  {
    name: "Groove @ Central World",
    emoji: "🎶",
    area: "Chidlom/Ratchaprasong BTS",
    capacity: "1,000–2,500",
    why: "Bangkok's premium standing room concert venue in Central World. Excellent for indie international acts, jazz festivals, electronic artists, and mid-size touring acts. Good sound system, multiple bars, central location. Less formal than arena but more organized than clubs.",
    tip: "Advance tickets recommended — concerts here sell out. Located inside Central World on upper floors. Multiple food options before the show in the mall. Best for international indie/alternative acts passing through Bangkok.",
  },
];

const TICKETS = [
  "Thai Ticket Major (Thaiticketmajor.com) — most official tickets for concerts in Thailand",
  "Zipevent — many independent and smaller concert events",
  "AllTicket — secondary platform",
  "K-pop events: official fan club presales often open before general public — check artist fan clubs",
  "Scalpers common outside major venues — prices typically 150–300% face value on show day",
  "Some international acts sell via international platforms (Ticketmaster) for Bangkok shows — check both",
];

export function BangkokConcerts() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎵 Bangkok concerts — venues, ticketing & what to expect
      </h2>
      <div className="space-y-2 mb-3">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{v.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{v.area} · cap. {v.capacity}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-purple-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-purple-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-purple-700 hover:bg-purple-50">
          Where to buy concert tickets in Bangkok
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {TICKETS.map((t) => (
            <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-purple-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
