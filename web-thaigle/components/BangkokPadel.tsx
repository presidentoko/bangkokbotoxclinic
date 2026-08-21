const SPOTS = [
  {
    name: "Padel Tennis in Bangkok",
    emoji: "🎾",
    area: "Padel courts in Bangkok — newer sports clubs and dedicated padel facilities in Sukhumvit, Bangna, and northern Bangkok",
    price: "Court rental per hour: ฿500–900; Racket rental: ฿100–200; Padel ball set: ฿150–300; Group lesson: ฿500–1,000/person",
    why: "Padel has arrived in Bangkok in the last 2–3 years as part of the global padel boom — the sport (a racket sport combining elements of tennis and squash, played on an enclosed court roughly one-third the size of a tennis court) is especially well-suited to Bangkok's climate because the enclosed court design provides shade and reduces wind interference. Padel's lower physical barrier to entry compared to tennis (the smaller court, the walls that keep the ball in play for extended rallies, and the lower initial skill requirement) has made it popular as a social sport for mixed-skill groups. Bangkok's growing padel community is driven largely by expat communities who played in Europe and Latin America, and by the Thai sports community looking for new court sport experiences. Several Bangkok gyms and sports clubs have added padel courts to their facilities.",
    tip: "Bangkok padel court booking: call or book online in advance as the limited number of courts (compared to tennis) means popular time slots fill quickly. Padel for tennis players: padel is easier to pick up for tennis players than many expect — but unlearn your tennis groundstroke habits: padel rewards lighter grip and softer touch near the walls rather than full groundstroke swings. The padel wall game: using the back and side walls intentionally after the ball bounces is the skill that separates padel from just tennis-with-walls — entry players typically begin to understand wall use after 3–5 sessions. Finding padel community: the Bangkok padel Facebook group or Instagram accounts (#padelbangkok) connect you to regular social play sessions where you can join existing groups.",
  },
  {
    name: "Pickleball in Bangkok",
    emoji: "🏓",
    area: "Pickleball courts in Bangkok — sports clubs, some hotel courts converted to pickleball, and growing dedicated facilities",
    price: "Court rental: ฿300–600/hour; Paddle rental: ฿100–200; Balls ฿50–100; Drop-in social play events often free–฿200",
    why: "Pickleball is one of the fastest-growing sports globally and has established a Bangkok community over the past 2 years. The sport (played on a badminton-sized court with solid paddles and a wiffle-like ball, combining elements of tennis, badminton, and ping-pong) has particularly attracted older players, recreational sports enthusiasts, and people recovering from tennis-related injuries who find pickleball's lower impact more joint-friendly. Bangkok's expat community has driven initial adoption, with drop-in games in residential compounds and hotel courts. The Bangkok pickleball community is welcoming and social — the sport's design (where skilled players can play gently with beginners without losing fun) creates accessible group play across skill levels.",
    tip: "Bangkok pickleball community access: the 'Pickleball Bangkok' Facebook group is the main coordination platform for games, events, and finding courts. Drop-in game format: pickleball's social play typically involves 'paddle stacking' (you set your paddle on a paddle pile at the side; when a game ends, the top 4 paddles play the next game) — this self-organizing format means newcomers get on court quickly. The dink game: pickleball's most important skill is the 'dink' — a soft shot landing in the non-volley zone near the net — this patience-requiring technique is where most Bangkok recreational players struggle initially; prioritize controlling dinks over power. Noise consideration: pickleball's distinctive pop sound (paddle on hard ball) can be a noise issue in residential settings; check if your chosen venue has community noise concerns.",
  },
  {
    name: "Beach Volleyball in Bangkok",
    emoji: "🏐",
    area: "Beach volleyball courts in Bangkok — KhunLuang Stadium beach volleyball facilities, sports parks, and sand courts at some fitness clubs",
    price: "Court rental (2 hours): ฿500–1,000; Equipment included; Tournament/league entry: ฿500–2,000/team",
    why: "Beach volleyball has an established competitive and recreational following in Bangkok — the sport benefits from Thailand's beach volleyball heritage (the country has produced competitive beach volleyball players at Asian Games level), and Bangkok has indoor and outdoor sand courts for year-round play. Unlike coastal Thailand where beach volleyball occurs naturally, Bangkok beach volleyball is a dedicated court sport played at sports facilities with imported sand courts. The social format of 2v2 or 4v4 beach volleyball games creates natural group sports experiences for small friend groups. Bangkok beach volleyball courts are typically found at large sports complexes and fitness centers that maintain sand courts as a specialty offering.",
    tip: "Bangkok beach volleyball court finding: the National Stadium complex and sports university facilities sometimes offer beach volleyball court access — calling ahead to confirm availability and booking is necessary. For competitive play: Bangkok has amateur beach volleyball leagues and tournaments run through sports associations and private organizers — search Facebook for 'beach volleyball Bangkok' to find current league information. The sand adjustment: players transitioning from indoor volleyball to sand find footwork dramatically different — sand play requires more effort per movement, changes jumping and approach mechanics, and demands different defensive positioning. Starting beach volleyball: a 4v4 or 6v6 casual game format on sand is the most beginner-friendly entry point before attempting the smaller-court 2v2 competitive format.",
  },
];

export function BangkokPadel() {
  return (
    <div className="rounded-2xl border border-lime-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-lime-700 mb-3">
        🎾 Bangkok new racket sports — padel, pickleball & beach volleyball
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-lime-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-lime-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
