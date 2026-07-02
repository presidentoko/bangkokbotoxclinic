const INFO = [
  {
    name: "Bangkok Netball — Expat League",
    emoji: "🏐",
    area: "Various schools and community courts; Thursday league nights",
    price: "League participation ฿500–1,500/season; Casual play ฿100–200",
    why: "Netball has a committed expat community in Bangkok, primarily driven by Australian, New Zealand, British, and South African participants. The Bangkok Netball Association (BNA) runs organized leagues with multiple divisions (competitive and social). Games typically run on weekday evenings or weekend mornings at international school courts in the Sukhumvit area. The netball community functions as an important social network for new expat arrivals, particularly for women from Commonwealth countries where netball is a mainstream sport.",
    tip: "Joining Bangkok netball: the Bangkok Netball Association is findable on Facebook — contact them about joining mid-season as a casual player or signing up for the next season. Positions (GS, GA, WA, C, WD, GD, GK) are assigned at the start of games based on who shows up — declaring your experience level helps them place you appropriately. Equipment needed: bibs are provided, but players bring their own trainers (court shoes, not running shoes recommended). Bangkok's humidity means evening games are most comfortable from November–February.",
  },
  {
    name: "Touch Rugby & Flag Football",
    emoji: "🏉",
    area: "Rugby Union clubs, international school grounds, Friday/Saturday leagues",
    price: "Touch rugby ฿200–500/session; Season registration ฿1,000–2,500",
    why: "Bangkok Touch Rugby has a well-organized expat community — multiple clubs operate alongside the Thai Rugby Union structure. Touch rugby (non-contact) is the fastest route into the Bangkok rugby scene regardless of physical conditioning level. Bangkok's rugby clubs (Wanderers, Southerners, Bangers RFC) have both competitive and social touches. Flag football (American football without contact) has a smaller but growing Bangkok community connected to American expat networks.",
    tip: "Bangkok rugby community: Bangkok Wanderers RFC is the oldest expat rugby club and most accessible starting point. Their website lists training schedules (typically Tuesday and Thursday evenings at British School Bangkok). The social scene around Bangkok rugby (post-match gathering at Cheap Charlie's or Shenanigan's) is as important as the sport itself for many participants. For flag football: the Bangkok American Flag Football League (BAFFL) runs seasonal competitions — contact through their Facebook page.",
  },
  {
    name: "Sepak Takraw — Thailand's Flying Kick Sport",
    emoji: "⚽",
    area: "Public parks, temple grounds, school courtyards — anywhere in Bangkok",
    price: "Free (community play)",
    why: "Sepak Takraw — the traditional Thai/Southeast Asian sport of kicking a rattan ball over a net using only feet, knees, chest, and head — is one of Bangkok's most distinctively local athletic experiences to observe. The aerial acrobatics required (bicycle kicks, roll spikes, scissor kicks) are extraordinary even at amateur level. Groups play in virtually every Bangkok park, temple ground, and school yard. The competitive level at Bangkok's community parks ranges from relaxed recreational to genuinely elite amateur. Thailand competes internationally at the highest level.",
    tip: "Watching (and occasionally joining) sepak takraw in Bangkok: regular games happen at Lumpini Park (morning and evening groups), temple grounds throughout the city, and in front of community centers. The equipment (rattan or modern synthetic ball, roughly volleyball-sized) is inexpensive — ฿100–300 for a ball. Participation is welcomed respectfully by Thai players, though the skill ceiling is very high and beginners are immediately obvious. Understanding the rules takes 5 minutes to explain; mastering a basic kick takes months.",
  },
];

export function BangkokNetball() {
  return (
    <div className="rounded-2xl border border-teal-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-800 mb-3">
        🏐 Expat sports leagues in Bangkok — netball, touch rugby, flag football & sepak takraw
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-teal-800">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
