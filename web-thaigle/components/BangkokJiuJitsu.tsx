const GYMS = [
  {
    name: "Brazilian Jiu-Jitsu Gyms in Bangkok",
    emoji: "🥋",
    area: "Sukhumvit, Silom, Ari — BJJ gyms scattered throughout Bangkok",
    price: "Drop-in class ฿500–900; Monthly membership ฿3,000–8,000",
    why: "Bangkok's BJJ scene has grown rapidly — the city now has a dozen+ dedicated BJJ academies with qualified instructors (many holding black belts from prominent lineages). The international expat community in Bangkok drives demand for high-quality martial arts instruction; Bangkok's gyms have responded by recruiting instructors from Brazil, US, UK, and Australia. Bangkok's large Muay Thai and MMA community overlaps significantly with BJJ — many practitioners cross-train. Thailand's warm climate makes year-round training possible, and Bangkok's gyms typically have air-conditioned mat areas.",
    tip: "Bangkok BJJ gym evaluation: visit during open mat (usually Saturday or Sunday mornings) to see training culture and mat cleanliness before committing to membership. Belt rank culture: Bangkok's international gyms follow IBJJF belt standards — progression from white to blue typically takes 2+ years of consistent training. For competition: Bangkok hosts several IBJJF-affiliated and independent BJJ tournaments annually — competitive opportunities without traveling overseas. Training culture note: Bangkok's international BJJ community is welcoming to visiting practitioners — most gyms offer weekly drop-in at reduced rates for travelers. Bring your own gi (uniform) if you have one.",
  },
  {
    name: "MMA Training — Mixed Martial Arts",
    emoji: "🤼",
    area: "Muay Thai gyms with MMA programs, dedicated MMA facilities (Sor Ploenchit, Tiger Muay Thai Bangkok)",
    price: "MMA class ฿400–900; Monthly training package ฿5,000–15,000",
    why: "Bangkok's MMA scene capitalizes on the city's existing Muay Thai infrastructure — most Bangkok Muay Thai gyms now offer MMA programs combining striking (Muay Thai), grappling (wrestling/BJJ), and cage work. Bangkok has produced Thai MMA fighters who compete in ONE Championship (Asia's largest MMA promotion, headquartered in Singapore with Bangkok as key market). Watching ONE FC events (when held in Bangkok at Impact Arena) exposes trainees to top-level Southeast Asian MMA. The professional gym environment in Bangkok (international coaches, structured programs) provides serious training opportunities at competitive prices.",
    tip: "Bangkok MMA training quality: the best Bangkok MMA gyms have dedicated wrestling programs (a skill gap in many Thai-dominated gyms which prioritize Muay Thai strikes). Ask specifically about wrestling/takedown instruction — this differentiates serious MMA programs from Muay Thai gyms offering basic ground work. For complete MMA development: combine a BJJ gym membership (for ground game) with MMA-specific training (for wrestling integration and cage work). ONE Championship: tickets available through their website when Bangkok events are scheduled — the production value and fighter quality are genuinely world-class.",
  },
  {
    name: "Grappling & Wrestling in Bangkok",
    emoji: "🤸",
    area: "ADCC-affiliated gyms, freestyle wrestling clubs (sports associations), submission grappling events",
    price: "Wrestling class ฿400–800; ADCC/No-gi class ฿500–900",
    why: "Wrestling and submission grappling (no-gi BJJ, catch wrestling, sambo elements) form a distinct community from gi BJJ in Bangkok — the competitive submission grappling scene (ADCC format events) has grown alongside international interest in grappling disciplines. Several Bangkok gyms run specialized no-gi grappling programs distinct from traditional gi BJJ. Thai freestyle wrestling has institutional infrastructure through the Amateur Wrestling Association of Thailand — training is available at sports complexes and university programs. Bangkok's international grappling community organizes regular open mats and local events.",
    tip: "Bangkok grappling community: follow ADCC Thailand and Bangkok Grappling League on Facebook/Instagram for event announcements and open mat schedules. For cross-training visits: Bangkok has a strong culture of gym visiting and open mat training — etiquette requires clean gear and appropriate behavior on the mat. No-gi training specifically: several Bangkok BJJ gyms offer dedicated no-gi classes (board shorts and rash guard rather than traditional gi) — these are typically more dynamic and wrestling-influenced. Submission wrestling events in Bangkok: local promotions run regular amateur submission grappling events — entry-level to intermediate competitors are welcome.",
  },
];

export function BangkokJiuJitsu() {
  return (
    <div className="rounded-2xl border border-red-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-800 mb-3">
        🥋 Brazilian Jiu-Jitsu & MMA in Bangkok — BJJ academies, grappling & martial arts
      </div>
      <div className="space-y-2">
        {GYMS.map((g) => (
          <div key={g.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{g.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-red-800">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
