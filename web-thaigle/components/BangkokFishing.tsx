const SPOTS = [
  {
    name: "Bungsamran Fishing Park — World Record Freshwater",
    emoji: "🎣",
    area: "Lat Phrao (Bangkapi area), northeast Bangkok",
    price: "Entry + bait package ฿700–2,000; Guide ฿500–1,000 additional",
    why: "Bungsamran is Bangkok's most famous fishing park — a large freshwater lake stocked with giant freshwater fish including Mekong catfish (Pangasianodon gigas, can exceed 150kg), Siamese carp, arapaima (introduced South American species), and various carp species. It holds multiple freshwater world records for the largest specimens caught and released. The fishing is artificial (stocked lake) but the fish are genuine giants. International fishing media regularly feature Bungsamran — anglers from UK, Japan, and Europe specifically travel to Bangkok to fish here.",
    tip: "Bungsamran booking: cash only, arrive early (open 6am). Rod rental included in package pricing. Guides are available and recommended for first-timers — they know the lake zones and bait placement. The fish are catch-and-release (mandatory policy) — bring a camera. Playing a 50–100kg catfish on a conventional rod is an extraordinary physical experience. Best fishing time: early morning (6–8am) before heat builds. Parking available, basic café on site.",
  },
  {
    name: "IT Lake Monster — Arapaima & Big Fish",
    emoji: "🐟",
    area: "Sam Phran area, Nakhon Pathom (45 min from Bangkok)",
    price: "Day package ฿1,500–3,000 including gear",
    why: "IT Lake Monster in Sam Phran is Bangkok area's premier destination for monster fish specifically — large arapaima (South American giants reaching 4m and 200kg have been recorded), redtail catfish, alligator gar, and various Amazon and SE Asian species coexist in a large well-managed lake. The fish stock quality and lake maintenance make it among the best trophy freshwater fishing destinations in Asia. Thai fishing culture takes freshwater angling extremely seriously — the lake has dedicated rods, specialized bait blends, and experienced Thai guides.",
    tip: "IT Lake Monster access: book in advance, especially weekends. The lake is about 45 minutes from central Bangkok by car (taxi or rental car recommended — public transport doesn't reach conveniently). The staff speak some English; having Google Translate ready helps for nuanced fishing discussion. Arapaima are air-breathers — they surface every 15–20 minutes to breathe, making the strike timing distinctive from conventional fish. Catching and photographing (then releasing) a 100kg+ arapaima is a genuinely bucket-list fishing experience.",
  },
  {
    name: "Sea Fishing — Gulf of Thailand Day Trips",
    emoji: "⛵",
    area: "Departure from Pattaya or Hua Hin (2–3 hrs from Bangkok)",
    price: "Charter boat ฿5,000–15,000/day (shared boat ฿800–1,500/person)",
    why: "Offshore fishing in the Gulf of Thailand from Bangkok-area ports (primarily Pattaya, also Hua Hin) targets barracuda, Spanish mackerel, yellowfin tuna (seasonal), and various reef species. The Gulf of Thailand fishery has been heavily impacted by commercial fishing but day trip sea fishing remains accessible for sport anglers. Trolling and bottom fishing from private charter boats is the most efficient approach. The boat experience itself (Gulf of Thailand, island views, Thai fishing culture) is worthwhile beyond the catch.",
    tip: "Sea fishing from Pattaya: book directly with boat captains at the Pattaya fishing pier (Walking Street area) rather than through hotel agents — cutting out the middleman saves 20–40%. Half-day (5am–11am) morning trips catch more fish than afternoon alternatives due to tidal patterns. Bring sea sickness medication even if you don't normally get seasick — the Gulf swell combined with diesel fumes on covered boats affects many people. Thai captains typically supply basic gear; specify if you want to use your own tackle.",
  },
];

export function BangkokFishing() {
  return (
    <div className="rounded-2xl border border-blue-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-800 mb-3">
        🎣 Fishing in Bangkok — Bungsamran monster fish, IT Lake arapaima & Gulf of Thailand charter
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
