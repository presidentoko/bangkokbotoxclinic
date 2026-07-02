const INFO = [
  {
    name: "Grappling & Brazilian Jiu-Jitsu in Bangkok",
    emoji: "🤼",
    area: "Multiple academies — Phuket Top Team Bangkok, Evolve MMA, Fairtex Training Center",
    price: "Drop-in ฿400–800; Monthly ฿4,000–12,000",
    why: "Bangkok's martial arts gym infrastructure encompasses world-class BJJ (Brazilian Jiu-Jitsu) and grappling alongside its famous Muay Thai. Evolve MMA (Sukhumvit Soi 31) hosts world champions across multiple disciplines including BJJ, wrestling, and submission grappling. Fairtex Training Center on Sukhumvit has extensive BJJ programming. The Bangkok BJJ community is international — training partners include competitors from Brazil, USA, Australia, and local Thai practitioners who've developed rapidly.",
    tip: "BJJ drop-in etiquette in Bangkok: introduce yourself to the head instructor before class; don't attempt techniques you haven't been shown (Bangkok's class structure is often less prescriptive than US/European gyms — watch the room to understand pace); rolling (live sparring) is typically at the end of class and optional for newcomers. A gi (uniform) is required for gi classes; no-gi classes need just shorts and rash guard.",
  },
  {
    name: "Wrestling — Folkstyle & Freestyle",
    emoji: "🏋️",
    area: "Huamark Sport Complex, university wrestling programs",
    price: "University club ฿0–200/session; Private training ฿800–2,000",
    why: "Wrestling (freestyle and Greco-Roman) is part of Thailand's national sports program — the Huamark Sport Complex and Sports Authority of Thailand (SAT) facilities host national team training. Expat wrestling is primarily organized through university clubs and crossover with BJJ/MMA academies. Sambo (Russian wrestling-based grappling) also has a small community in Bangkok through the Thai Sambo Association.",
    tip: "For expats wanting to wrestle in Bangkok: the most practical access is through MMA academies that include wrestling as part of their program (Evolve MMA, Team Quest Thailand). Pure wrestling clubs at Thai universities are technically open to outsiders but community integration requires a Thai-speaking contact. Muay Thai practitioners sometimes crossover to wrestling for improved clinch work — this is a growth area in Bangkok's combat sports scene.",
  },
  {
    name: "Sumo & Japanese Martial Arts",
    emoji: "🎌",
    area: "Japan Foundation Bangkok (events), university programs",
    price: "Sumo exhibition events: free–฿500",
    why: "The Japan Foundation Bangkok occasionally brings Japanese sumo wrestlers for demonstration and audience participation events — these events happen 1–2 times per year and are genuinely accessible to the public. Judo is more permanently established in Bangkok through the Thai Judo Association and Japanese expat community clubs. Aikido and kendo also have stable Bangkok communities through Japanese business expatriate networks.",
    tip: "Japan Foundation Bangkok events: register via their website (jfbangkok.jp) or Facebook for sumo and martial arts demonstration events — they typically have English registration processes. Judo in Bangkok: Thai Judo Association maintains a list of registered dojos — several operate out of schools and community centers in the Sukhumvit and Sathon areas with English-speaking instructors.",
  },
];

export function BangkokWrestling() {
  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        🤼 Wrestling & grappling in Bangkok — BJJ academies, Evolve MMA, judo & sumo events
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-gray-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
