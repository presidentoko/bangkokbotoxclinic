const INFO = [
  {
    name: "Pickleball Courts in Bangkok",
    emoji: "🏓",
    area: "Sukhumvit, Ratchadapisek, Ekkamai — sport courts",
    price: "Court rental ฿400–700/hour; Paddle rental ฿100–200; Lesson ฿600–1,200",
    why: "Pickleball (the tennis/badminton/ping-pong hybrid played on a smaller court with a perforated plastic ball) exploded globally from 2021 and arrived in Bangkok from the American expat community. Multiple dedicated pickleball venues opened in Bangkok from 2022–2024. The sport's accessibility — shorter court, lighter paddle, slower ball than tennis — makes it ideal for mixed-age social play. Bangkok's expat community, particularly Americans, Australians, and Canadians, drove early adoption.",
    tip: "Pickleball in Bangkok: find current courts via Facebook 'Pickleball Bangkok' group — the fastest-changing sport in Bangkok with new courts opening regularly. Beginners can learn the basic dinking (soft game), serve, and third-shot drop within one session. The pickleball serve (underhand, must bounce in the kitchen) takes 30 minutes to master. Most Bangkok pickleball communities welcome drop-in players — just show up with a paddle (or rent one).",
  },
  {
    name: "Bangkok Pickleball Community & Tournaments",
    emoji: "🏆",
    area: "Rotating venues — check Bangkok Pickleball Facebook",
    price: "Tournament entry ฿300–1,000",
    why: "Bangkok's pickleball community hosts weekly round-robins, social games, and beginner clinics. Monthly tournaments are held at various venues with mixed-ability divisions. The social layer of pickleball — the kitchen dink rally, the partner coordination in doubles — builds tight community faster than individual sports. Bangkok's pickleball demographic skews toward 35–65 year olds but younger players join regularly as the sport's profile grows.",
    tip: "The International Pickleball Association has launched a Southeast Asia circuit — Bangkok tournaments count toward regional rankings. If you play pickleball elsewhere and visit Bangkok: join the Facebook group before arrival and someone will arrange a game within a day. Pickleball is uniquely social as a sport — stranger pickup games are the norm, not the exception.",
  },
  {
    name: "Padel vs Pickleball — Bangkok's Two Fastest-Growing Sports",
    emoji: "🆚",
    area: "Both available across Bangkok",
    price: "Comparable pricing (฿400–700/hr court)",
    why: "Padel (enclosed glass court, continental European) and pickleball (smaller open court, North American) arrived in Bangkok simultaneously and are often discussed together. Key differences: padel is doubles-only, uses a larger court with glass walls and metal fencing, and has higher initial learning curve; pickleball can be played singles or doubles, uses a lower net, and is quicker to learn. Bangkok has growing communities for both — which to try depends on your background (former tennis players prefer padel; newcomers to racket sports prefer pickleball).",
    tip: "The Bangkok sport scene's practical test: if you have 1 hour and want to immediately enjoy rather than drill technique, choose pickleball. If you want the more athletic experience and can handle more initial failure, choose padel. Both sports are social, and both communities in Bangkok are welcoming to drop-in players.",
  },
];

export function BangkokPickleball() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🏓 Pickleball in Bangkok — courts, community tournaments & padel vs pickleball guide
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-teal-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
