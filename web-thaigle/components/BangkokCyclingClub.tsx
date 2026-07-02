const GROUPS = [
  {
    name: "Thailand Cycling Club (TCC)",
    emoji: "🚵",
    area: "Bangkok and surroundings — monthly charity rides",
    ride: "Road cycling 60–120km; Monthly group rides",
    why: "Bangkok's largest organized cycling community. Monthly charity rides across Thailand, regular road rides departing from Bangkok's outer neighborhoods (Lad Krabang, Bang Na) at 5am Saturday. Mix of Thai national riders, expats, and cycling enthusiasts. Organized safety marshals, mechanical support, regroup points. Annual TCC Classic stage race.",
    tip: "Facebook group: 'Thailand Cycling Club' — post a greeting before joining a ride. Most serious riders use road bikes (carbon). Rentals available for visitors through some member connections. Helmet and cycling kit standard — casual attire signals beginner and they'll look after you extra carefully.",
  },
  {
    name: "Bangkok Cycling Group (Expat-Friendly)",
    emoji: "🚴",
    area: "Lumpini Park, Benjakitti Park, Kanchanaburi day trips",
    ride: "Social rides 20–60km; Various paces",
    why: "More casual cycling community than TCC — primarily road bikes and hybrids, social coffee stops included. Typically departs 5:30am Sunday from Lumpini or Benjakitti. More beginner-friendly pace, no pressure to keep up with racing cyclists. Chao Phraya riverside and Bangkrachao cycling loops popular among this group.",
    tip: "Bangkrachao cycling (the 'green lung' island in Bangkok's river) is a Sunday morning ritual — bring a camera. Route is flat, only 10–15km, and leads through orchards and traditional Thai villages. BTS Mo Chit ferry access makes it easily accessible without a car.",
  },
  {
    name: "Mountain Biking Near Bangkok",
    emoji: "⛰️",
    area: "Khao Yai, Kanchanaburi, Hua Hin (2–3 hrs from Bangkok)",
    ride: "MTB trails, 20–50km distance",
    why: "Bangkok itself is flat — serious mountain biking requires a 2-hour drive. Khao Yai national park has beginner MTB trails accessible from Pak Chong. Hua Hin's Kaeng Krachan area has forested trail networks. Kanchanaburi has mixed terrain. Bangkok MTB community typically does overnight weekend trips rather than same-day outings.",
    tip: "Khao Yai MTB trails are accessible without a mountain bike license — Pak Chong town has some rental options. The forest terrain around Khao Yai is similar to European cross-country trails — not extreme, good for intermediate riders.",
  },
];

export function BangkokCyclingClub() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🚴 Cycling clubs in Bangkok — road rides, social groups & MTB trails
      </div>
      <div className="space-y-2">
        {GROUPS.map((g) => (
          <div key={g.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{g.ride}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-green-700">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
