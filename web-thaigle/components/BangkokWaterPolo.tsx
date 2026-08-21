const INFO = [
  {
    name: "Water Polo at Bangkok's Pools",
    emoji: "🏊",
    area: "National Stadium pool, university pools (Chula, Thammasat), private clubs",
    price: "Monthly membership ฿1,500–3,000; Drop-in ฿200–400",
    why: "Bangkok has a small but dedicated water polo community — primarily university teams, expat club teams, and the national team training program. The sport requires a 25m or 50m pool with adequate depth (minimum 1.8m). Bangkok's Olympic-standard facilities (National Stadium, Huamark Sport Complex) have suitable pools. Water polo is one of the few team water sports with an active adult expat participation layer in Bangkok.",
    tip: "Finding Bangkok water polo: the Bangkok Water Polo Club Facebook group and the Thailand Swimming Association coordinate adult league play. Most Bangkok water polo is informal pickup — the expat community particularly within the Sukhumvit corridor organizes weekend water polo at British Club, Foreign Correspondents' Club of Thailand, and similar private club pools. Bring your own cap and goggles — equipment rental is not standard.",
  },
  {
    name: "Competitive Swimming in Bangkok",
    emoji: "🏅",
    area: "Huamark Aquatics Complex, National Stadium, Victory Monument pool",
    price: "Huamark pool ฿80–150; Private club ฿200–500",
    why: "For competitive swimmers, Bangkok's Huamark International Aquatics Complex has a 50m Olympic-standard outdoor pool and 25m indoor pool — the venue used for international meets and Thailand's national swimming squad. The pool schedule includes lane swimming and aquatic fitness sessions open to the public. The FINA-standard facility is unexpectedly accessible and excellent value.",
    tip: "Huamark pool (open Tuesday–Sunday) requires a bathing cap — enforced at all formal pools in Thailand. Bangkok's weather makes outdoor pool swimming genuinely enjoyable October–February; the outdoor Huamark 50m pool at 8–10am is excellent. Several Bangkok-based expat triathletes use Huamark for open-water swim training preparation.",
  },
  {
    name: "Synchronized Swimming",
    emoji: "🤽",
    area: "Thailand National Sports Complex, Bangkok",
    price: "Spectator events: free to ฿200",
    why: "Thailand has a national synchronized swimming program and Bangkok hosts inter-national competitions. For spectators, synchronized swimming events are genuinely impressive — the athleticism, breath control, and coordination required are extreme. Less common than other aquatic sports, Bangkok's synchronized swimming community is tight-knit and welcomes spectators at training sessions and competitions.",
    tip: "Thailand's synchronized swimming national team trains at the National Sports Complex and occasionally at private club facilities. Finding training open to spectators: contact the Thailand Swimming Association directly. Synchronized swimming requires both competitive swimming ability and theatrical performance — the combination makes it the most watchable aquatic sport for casual spectators.",
  },
];

export function BangkokWaterPolo() {
  return (
    <div className="rounded-2xl border border-blue-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-800 mb-3">
        🏊 Water polo & competitive swimming in Bangkok — Huamark pool, club teams & leagues
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-blue-800">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
