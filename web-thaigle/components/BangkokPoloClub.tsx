const INFO = [
  {
    name: "Polo in Bangkok & Thailand",
    emoji: "🐎",
    area: "Thai Polo & Equestrian Club (Pattaya/Cholburi), Polo Club near Bangkok equestrian areas",
    price: "Polo lesson ฿3,000–8,000; Full club membership ฿50,000–300,000/year; Match entry varies",
    why: "Polo in Thailand centers on the Thai Polo & Equestrian Club located in the Pattaya area (Cholburi province, 1.5 hours from Bangkok) — the primary venue for competitive polo in Thailand. Bangkok's wealthy Thai and expatriate social set has maintained an active polo community since the sport's arrival via British colonial-era influence in Southeast Asia. Thailand hosts the King's Cup Polo Tournament and other international tournaments attracting teams from across Asia, the Middle East, and Europe. The Thai polo scene intersects with Bangkok's elite social calendar — watching polo matches (especially the King's Cup) is a prominent social occasion regardless of active participation.",
    tip: "Polo watching vs. participation: watching polo at Thai Polo & Equestrian Club events is accessible (tickets available for tournament matches) — the social event format with lawn hospitality areas, champagne, and divot-stomping at halftime follows the British polo tradition. Beginner polo instruction: the Thai Polo club offers beginner instruction packages — 'polo experience' packages are designed for first-timers without prior equestrian experience. What to wear for polo spectating: the Bangkok polo social dress code emphasizes smart-casual to formal — ladies' day events have dress codes comparable to Melbourne Cup or Ascot garden party standards. Equestrian Bangkok: the Thai Polo Club is also an equestrian facility — dressage and show jumping training are available independently of polo.",
  },
  {
    name: "Horse Riding & Equestrian Sports",
    emoji: "🏇",
    area: "Equestrian centers north of Bangkok (Pathum Thani, Nonthaburi), Pattaya equestrian clubs",
    price: "Trail ride ฿800–2,000/hour; Riding lesson ฿1,200–3,000; Dressage lesson ฿2,000–5,000",
    why: "Bangkok's equestrian scene is spread across the urban periphery — the city itself has no horse facilities, but within 30–60 km are multiple equestrian centers. The international expat community sustains Bangkok's recreational riding scene; Thai elite families maintain equestrian activities as a prestige sport. The Royal Turf Club of Thailand (horse racing) represents the older equestrian tradition — Thai horse racing is associated with gambling culture and traditional betting, distinct from sport riding. The Thoroughbred horse racing scene has declined in recent decades, while recreational equestrian sports (dressage, jumping, trail riding) have grown among the Bangkok affluent community.",
    tip: "Bangkok equestrian center selection: look for facilities with imported European horses (warmbloods for dressage/jumping, Arabians for endurance) rather than local pony breeds for sport riding instruction. Thai riding clubs with certified FEI-standard instructors are rare — most instruction is informal by experienced local riders. Trail riding with children: several equestrian centers near Bangkok offer pony rides and gentle trail experiences suited for children — call ahead to confirm availability. Horse care standards: Bangkok equestrian facilities vary significantly in horse welfare standards — facilities with international clientele generally maintain higher care standards; Thai-language-only operations serving local clientele vary more widely.",
  },
  {
    name: "Elite Sports & Exclusive Clubs in Bangkok",
    emoji: "🎖️",
    area: "Royal Bangkok Sports Club, British Club Bangkok, German Club, Sukhumvit corridor international clubs",
    price: "Entry-level club membership ฿5,000–20,000/year; Premium international clubs ฿50,000–500,000+",
    why: "Bangkok's exclusive club culture — inherited from British colonial social institutions and adapted to Thailand's unique context — offers access to social networks, facilities, and activities unavailable through public channels. The Royal Bangkok Sports Club (adjacent to the Chidlom BTS area) is the most prestigious — with golf course, horse racing track (historical), pool, squash, tennis, and dining — operating since 1901. Bangkok's international club network (British Club, German Club, Royal Varuna Yacht Club in Pattaya) provides the expatriate community with formal social structures that persist outside Thailand's transient expat turnover. These clubs represent relationship and social capital as much as facilities.",
    tip: "Bangkok exclusive club access: most require membership sponsorship from existing members — direct applications without sponsors are rarely accepted at prestige clubs. The professional network approach: building relationships in business or professional settings that naturally lead to club member introductions is more effective than seeking membership as a goal. Royal Bangkok Sports Club: the waiting list for new members can be multi-year; the facility quality (especially the pool and dining) is genuinely exceptional. For visitors: Bangkok's hotel club facilities (pool, gym, tennis at 5-star hotels) provide many of the physical facility benefits without the membership process — Aman Bangkok pool day-use is an example of premium access without club membership.",
  },
];

export function BangkokPoloClub() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-3">
        🐎 Polo, equestrian & elite clubs in Bangkok — horse sports, exclusive membership & social
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-emerald-800">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
