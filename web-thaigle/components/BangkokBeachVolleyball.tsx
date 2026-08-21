const SPOTS = [
  {
    name: "Bangkok Beach Volleyball Courts",
    emoji: "🏐",
    area: "Asiatique Riverside, Chatuchak Park sand courts, Huamark Sport Complex",
    price: "Court rental ฿300–600/hour; Drop-in pickup ฿0 (community courts)",
    why: "Bangkok has sand volleyball courts operating year-round — the most accessible are at Chatuchak Park (weekend pickup games), Huamark Sport Complex (FIVB-standard sand courts), and various recreation areas along the Chao Phraya riverside. Beach volleyball has grown in Thai sporting culture — Thailand's national team is competitive in the Asian circuit. Bangkok's evening temperature (after 6pm) makes beach volleyball practical even in the hot season.",
    tip: "Chatuchak Park beach volleyball courts host informal pickup games Saturday and Sunday afternoons — show up and join a game. No pre-booking required for pickup. Huamark courts need advance booking for formal court rental. Bangkok beach volleyball Facebook groups: 'Bangkok Beach Volleyball' coordinates pickup and social matches for mixed-ability players including many expats.",
  },
  {
    name: "Sepak Takraw — Thailand's Traditional Net Sport",
    emoji: "🏅",
    area: "Public parks, school grounds, Chatuchak area",
    price: "Free (public park)",
    why: "Sepak takraw (kick volleyball — using feet, knees, chest, and head instead of hands) is Thailand's national sport and genuinely spectacular to watch. The acrobatic bicycle-kick smashes require years of training and are legitimately Olympic-level athletic achievement. Informal sepak takraw games happen daily at Chatuchak Park, Lumphini Park, and in vacant lots near residential areas — always open to spectators. The sport is rarely played outside Southeast Asia making Bangkok a unique place to see it.",
    tip: "Sepak takraw is not participatory for foreigners without years of training — the movements are extremely demanding. But watching as a spectator is free, accessible, and will be genuinely surprising for most visitors. Lumphini Park late afternoon (4–6pm) and Chatuchak Park weekends are the most reliable locations. Ask locals where the 'takraw' game is — everyone knows.",
  },
  {
    name: "Padel Tennis — Bangkok's Fastest Growing Sport",
    emoji: "🎾",
    area: "Sukhumvit, Thonglor, Lat Phrao — padel courts",
    price: "Court rental ฿400–800/hour; Beginner class ฿500–800",
    why: "Padel tennis (enclosed racket sport between tennis and squash) exploded in Bangkok from 2022 onward — the compact court size fits Bangkok's urban density, the learning curve is shorter than tennis, and the doubles-only format is inherently social. Multiple padel venues opened in Sukhumvit corridor and Lat Phrao area within 18 months. The Bangkok padel community is active and welcoming — expats from Spain, Mexico, and Argentina (where padel is massive) introduced the sport to Thai players.",
    tip: "Padel racket rental available at all Bangkok padel venues — no equipment needed for first session. Padel scoring is identical to tennis (15/30/40/game). The glass walls and wire fence that form the court are active playing surfaces — balls bouncing off walls are still in play. The community aspect (shouting encouragement, social post-match drinks) is built into padel culture more than tennis.",
  },
];

export function BangkokBeachVolleyball() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🏐 Beach volleyball & net sports in Bangkok — sand courts, takraw & padel tennis
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
