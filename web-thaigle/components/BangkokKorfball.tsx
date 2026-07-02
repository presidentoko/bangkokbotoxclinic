const INFO = [
  {
    name: "Korfball in Bangkok",
    emoji: "🏀",
    area: "Kasetsart University, Siam University, expat sport groups",
    price: "Training ฿0–200/session; Equipment: own purchase recommended",
    why: "Korfball (Dutch mixed-gender team sport combining elements of basketball and netball) has an established community in Bangkok — one of the few Asian cities outside the Philippines where korfball is actively played. Thai korfball development is primarily university-based (Kasetsart University runs a program) with an expat layer from Dutch, Belgian, and British players resident in Bangkok. The sport is genuinely mixed-gender — teams must have equal men and women — which creates an unusual social dynamic.",
    tip: "Bangkok korfball contact: Thailand Korfball Association on Facebook — they coordinate national league games and training sessions. The korfball court is smaller than basketball, and the 'post' (non-dribbling, pivoting style) is unfamiliar to basketball players initially. Korfball is genuinely welcoming to completely new players — the mixed-gender rule means teams always need both.",
  },
  {
    name: "Ultimate Frisbee Bangkok",
    emoji: "🥏",
    area: "Lumphini Park, Chatuchak Park, RCA area pitch",
    price: "Free (pickup); Tournament registration ฿200–600",
    why: "Ultimate Frisbee has one of Bangkok's most active expat sport communities — Bangkok Old Mutts (BOM), Blue Crabs, and various recreational teams organize weekly pickup games and compete in Southeast Asian tournaments. Ultimate is self-refereed (spirit of the game concept) which creates unusual sportsmanship culture. The Bangkok ultimate community is genuinely inclusive — beginners can join Saturday morning pickup at Lumphini Park with no prior experience.",
    tip: "Bangkok ultimate Frisbee pickup: Saturday mornings at Lumphini Park (south end) and Chatuchak Park, year-round except for heavy rain. No equipment needed beyond athletic clothes — the group provides discs. The community Facebook group 'Ultimate Frisbee Bangkok' has the most current schedule. Bangkok hosts the Thailand Open (annual) which attracts Southeast Asian club teams.",
  },
  {
    name: "Quidditch / Quadball Bangkok",
    emoji: "🧹",
    area: "Kasetsart University grounds, occasional university tournaments",
    price: "Training ฿0 (community)",
    why: "Yes, there is Quidditch (now officially renamed 'Quadball' by the International Quidditch Association) played in Bangkok — primarily at universities. The real-world adaptation of the Harry Potter sport uses brooms, physical contact (without magic), and a live human 'snitch' (a person with a ball attached to their clothing being chased). The Bangkok Quadball community is small but earnest — entirely students and young adults. Mentioned here because it's genuinely one of Bangkok's most unusual sport communities.",
    tip: "Bangkok Quadball is university-based and seasonal — games during academic year, with inter-university competitions. Contact Bangkok-based teams through Quadball Thailand on Facebook. The sport requires brooms (regulation sizes), a quaffle (slightly deflated volleyball), bludgers (dodgeballs), and a human snitch. Worth watching as a spectator even if not participating.",
  },
];

export function BangkokKorfball() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏀 Unusual sports in Bangkok — korfball, ultimate frisbee & quadball communities
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-orange-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
