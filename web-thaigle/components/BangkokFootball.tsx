const INFO = [
  {
    name: "Playing Football in Bangkok — Pitches & Leagues",
    emoji: "⚽",
    area: "Five-a-side complexes (Sukhumvit, Lat Phrao, Ratchada), university pitches, Lumphini evening pickup",
    price: "Five-a-side court ฿500–1,500/hour; Astroturf pitch ฿800–2,000/hour; Expat league ฿300–500/match",
    why: "Bangkok's football (soccer) scene serves the city's large football-loving population — Thais are passionate football fans, and playing opportunities have expanded significantly with the proliferation of five-a-side complexes (indoor and outdoor artificial turf). The Bangkok expat community maintains organized football leagues at multiple levels: the Bangkok International Football League (BIFL) and similar organizations run competitive amateur leagues with regular match schedules. Several pitch complexes (Goal Five, iKick, Major Racquet) have turf courts bookable by the hour for casual pickup or organized team sessions. University pitches (Chulalongkorn, Kasetsart, ABAC) host informal pickup games on weekends.",
    tip: "Joining Bangkok football as an expat or visitor: Facebook groups ('Bangkok Football', 'Bangkok Soccer') list pickup games and player-needed posts — direct contact for trials. The Bangkok expat football community is welcoming to new players of all ability levels. Pitch booking: Bangkok's artificial turf five-a-side pitches require advance booking especially for evenings and weekends — most have online booking systems. Watching Thai football: Thai Premier League matches at Rajamangala National Stadium and at club grounds (Muangthong United, BG Pathum United) are affordable and atmospherically authentic — ticket ฿100–500, atmosphere varies by club rivalry.",
  },
  {
    name: "Thai Premier League & Football Watching",
    emoji: "🏟️",
    area: "Rajamangala National Stadium (national team), Muangthong United's SCG Stadium, BG Pathum United",
    price: "Thai Premier League ticket ฿100–500; Thai national team ฿200–1,000; AFC Champions League ฿300–1,500",
    why: "Thailand's professional football has grown substantially — the Thai Premier League is genuinely competitive within Southeast Asia, with BG Pathum United (backed by Central Group retail empire) competing in the AFC Champions League. Thai football culture includes passionate supporter groups, organized chants, and ultras-style terrace culture at major Bangkok clubs. The national team (War Elephants) enjoys widespread support — Thais follow football intensely, including the English Premier League (extremely popular across all demographics in Thailand). Bangkok's bar culture during European football season (September–May) means early morning EPL viewing is a fixture — major bars open for 6am kickoffs during key matches.",
    tip: "Best Bangkok football watching experiences: Muangthong United vs. BG Pathum United (the Classico Thai) is the biggest rivalry — attending this match provides an authentic Thai football atmosphere. National team matches at Rajamangala attract passionate crowds — book tickets through the Football Association of Thailand or at the stadium. EPL viewing: Bangkok has dozens of sports bars showing live EPL matches at UK-friendly time offsets — Asoke and Thonglor have the highest density of English-style football pubs. Bangkok also shows La Liga, Bundesliga, and Serie A — diverse European football coverage is standard at sports-focused venues.",
  },
  {
    name: "Futsal — Indoor Football Bangkok",
    emoji: "🥅",
    area: "Indoor futsal courts throughout Bangkok (Major Cineplex-affiliated, standalone facilities)",
    price: "Futsal court ฿600–1,200/hour; Futsal league season registration ฿5,000–15,000/team",
    why: "Futsal (the FIFA-sanctioned indoor small-sided football format) has significant infrastructure in Bangkok — Major Racquet, True Arena, and standalone futsal centers operate courts with proper surfaces, lines, and goals. The Futsal Association of Thailand has organized competitive leagues; Bangkok clubs compete in regional futsal tournaments. For expats seeking organized competition: Bangkok's futsal leagues offer structured seasons with standings, referees, and league tables — more formal than pickup football. The Bangkok indoor climate advantage: Bangkok futsal courts are typically air-conditioned or indoor, eliminating the heat management issue of outdoor football during Thailand's hot season.",
    tip: "Bangkok futsal vs. five-a-side: futsal uses a smaller, heavier ball (lower bounce) and specific court markings — the game rewards quick passing and technical skill differently than regular football. Futsal player development: Thailand has produced quality futsal players who compete internationally — training with Thai futsal coaches at Bangkok facilities provides instruction in the technique-heavy futsal skill set. Court availability: Bangkok futsal courts are most constrained Monday–Friday evenings (local office workers) — weekend morning slots are generally more available. Team formation: if you don't have a full team, post in Bangkok football Facebook groups about futsal — pickup futsal sessions are easier to organize than 11-a-side football.",
  },
];

export function BangkokFootball() {
  return (
    <div className="rounded-2xl border border-green-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-800 mb-3">
        ⚽ Football & futsal in Bangkok — expat leagues, Thai Premier League & playing pitches
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-green-800">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
