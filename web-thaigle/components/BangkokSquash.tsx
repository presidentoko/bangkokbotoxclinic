const COURTS = [
  {
    name: "The Squash Center Bangkok",
    emoji: "🏸",
    area: "Sukhumvit area",
    price: "Court booking ฿300–500/hour; Coaching ฿800–1,500/hour",
    why: "Bangkok's dedicated squash facility with professional-grade courts, racket rental, and in-house coaching. Part of Bangkok's squash community hub — leagues, tournaments, and partner-matching programs. Courts are air-conditioned to proper squash temperature (not Thai ambient heat). Regular expat leagues and Thai junior development programs.",
    tip: "Bangkok squash courts are bookable same-day during off-peak hours (morning weekdays). Weekend prime time requires 2–3 days advance booking. Racket rental available so no equipment needed for visitors. Coaching is available for beginners — the technique foundation matters especially for hot-weather squash.",
  },
  {
    name: "Hotel Courts & Club Courts",
    emoji: "🏨",
    area: "Major Bangkok hotels and fitness clubs",
    price: "Guest access included; Non-guest ฿400–800/hour",
    why: "Several Bangkok luxury hotels maintain squash courts: Marriott, Radisson Blu, JW Marriott, Bangkok Marriott Marquis. Hotel court quality varies — some are maintained at international standard, others show age. Hotel guests can typically book ahead through concierge. Non-guests may access with day pass or court-only booking.",
    tip: "The British Club Bangkok on Silom has maintained squash courts and an active expat squash community — membership or guest introduction required but the social squash scene there is among Bangkok's best for competitive recreational players.",
  },
  {
    name: "Bangkok Squash Community",
    emoji: "👥",
    area: "Citywide, primarily Sukhumvit and Silom areas",
    price: "Casual games: find partner + book court",
    why: "Bangkok has an active competitive squash community — the Thailand Squash Rackets Association organizes national championships and Bangkok city leagues. Competitive rankings from beginner through masters levels. The expat community is particularly active — Facebook groups and WhatsApp circles arrange casual partner games throughout the week.",
    tip: "Search 'Bangkok Squash' on Facebook for the main community group — post your level and availability and you'll find game partners within 24 hours. Most serious Bangkok squash players have their own rackets but court shoes matter — regular training shoes acceptable but proper non-marking squash shoes recommended for serious sessions.",
  },
];

export function BangkokSquash() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏸 Squash courts in Bangkok — leagues, coaching & partner finder
      </h2>
      <div className="space-y-2">
        {COURTS.map((c) => (
          <div key={c.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-blue-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
