const SPOTS = [
  {
    name: "Magic & Illusion in Bangkok",
    emoji: "🪄",
    area: "Magic shops (Yaowarat/Chinatown, Sukhumvit tourist strip), close-up magic bars",
    price: "Magic show ฿800–3,000; Magic shop merchandise ฿200–5,000; Magic lesson ฿2,000–8,000",
    why: "Magic in Bangkok draws from multiple traditions — Western stage illusion, close-up sleight of hand, and traditional Thai spirit-related performance arts. Bangkok has a small but active magic community: the International Brotherhood of Magicians has Thai members, and close-up magic has found a niche in Bangkok's entertainment bar scene. The Chinatown (Yaowarat) area has shops selling magic props and illusion supplies — serving both professional performers and hobbyists. Thai traditional performance includes forms that appear magical in context — spirit mediums (maw phi), traditional Thai doctors (maw ya boran), and temple fair performances that blur entertainment and religious practice.",
    tip: "Bangkok magic community: the magic supply shops in Chinatown are the easiest entry point into Bangkok's magic ecosystem — shop owners often know performers and can facilitate connections. Close-up magic bars: some Bangkok hospitality venues employ roving magicians for tableside entertainment — this format has grown in Bangkok's premium casual dining sector. For learning magic in Bangkok: formal magic instruction is uncommon as a commercial offering — most skill transfer happens through community connection and private teaching. Traditional Thai fortune-telling and related practices (tarot, numerology, palmistry, spirit consultation) are accessible throughout Bangkok and represent a culturally distinct magical practice parallel to Western stage magic.",
  },
  {
    name: "Card Games & Tabletop Gaming",
    emoji: "🃏",
    area: "Board game cafes (Silom, Thonglor, Ari), card game shops (Magic: The Gathering, Yu-Gi-Oh in Siam)",
    price: "Board game cafe entry ฿150–400; TCG booster pack ฿150–500; Board game purchase ฿500–5,000",
    why: "Bangkok's tabletop gaming scene has matured significantly — board game cafes (where you pay an entry fee and can play from the cafe's library) are established in multiple Bangkok neighborhoods. Magic: The Gathering, Flesh and Blood, Yu-Gi-Oh, and One Piece TCG all have active Bangkok competitive communities. Board game cafes in Bangkok function as genuine community spaces — Beyond Board Game Cafe, The Shelf, and others host regular game nights, tournaments, and teaching sessions. The Bangkok gaming community intersects with the digital gaming community — tabletop RPGs (D&D 5e, Pathfinder) have Bangkok groups operating in both English and Thai.",
    tip: "Bangkok board game cafe strategy: the entry fee typically covers unlimited access to the cafe's game library for the session — better value for learning new games than purchasing. Friday and Saturday evenings are busiest — arrive before 7pm for comfortable seating. Competitive card games: local game stores (LGS) hosting Friday Night Magic for MTG, and weekly local tournaments for other TCGs, are discoverable through each game's dedicated Facebook groups ('Magic the Gathering Thailand', etc.). For tabletop RPG: both Thai-language D&D campaigns (Thai adventurers, using the Thai-translated rulebook) and English-language expat-focused campaigns operate in Bangkok — Discord servers for Bangkok gaming connect newcomers to groups.",
  },
  {
    name: "Escape Rooms in Bangkok",
    emoji: "🔐",
    area: "Escape room venues throughout central Bangkok (Asoke, Siam, Thonglor, EmQuartier vicinity)",
    price: "Escape room session ฿350–800/person; Private group booking ฿2,000–6,000/room",
    why: "Bangkok's escape room industry is substantial — the city has dozens of venues ranging from basic puzzle rooms to elaborate themed experiences with professional production design. The escape room culture in Bangkok serves both corporate team-building (a significant market) and leisure groups. Thai-language themed rooms predominate at many venues, but English-language rooms or translation services are standard at venues frequented by international visitors. Bangkok's better escape room venues invest in set design, props, and puzzle mechanics at internationally competitive levels — the price point is significantly lower than comparable venues in Europe or North America.",
    tip: "Bangkok escape room selection: Tripadvisor and Google Maps ratings are reliable for filtering quality (venues rated 4.5+ with 200+ reviews tend to have proper puzzle mechanics rather than just a locked room with a padlock). Most Bangkok escape rooms are 60 minutes and designed for groups of 2–8 people. For corporate events: several Bangkok escape room operators specialize in corporate team-building packages with customized themes and debriefing sessions. Advanced players: Bangkok has venues offering harder difficulty settings — specify your experience level when booking so the game master can calibrate hint provision. Thai-themed rooms: some Bangkok escape room venues use Thai cultural narratives (Thai ghost stories, traditional palace settings, temple mysteries) for their themes — these provide distinctive experiences not available in Western escape room markets.",
  },
];

export function BangkokMagic() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🪄 Magic, card games & escape rooms in Bangkok — tabletop gaming & illusion entertainment
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
