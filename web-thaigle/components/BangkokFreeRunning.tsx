const SPOTS = [
  {
    name: "Parkour & Freerunning Training in Bangkok",
    emoji: "🏃",
    area: "Skate parks, open public spaces (Benjakitti Park, Suan Rot Fai); gym training facilities",
    price: "Parkour gym class ฿400–800/session; Outdoor training free",
    why: "Bangkok has a small but active parkour and freerunning community — practitioners (traceurs) train in public spaces, skate parks, and dedicated parkour facilities. The Bangkok climate (warm year-round, no snow or ice) makes outdoor training viable 12 months a year. Bangkok's urban architecture (concrete walls, railings, open-air spaces, canal banks) creates interesting training environments. The parkour community shares training spots through LINE groups and Instagram. Beginner-accessible training exists at a few Bangkok gyms with foam pits and training walls for learning movements safely.",
    tip: "Bangkok parkour community: find training groups through Instagram (#parkourThailand, #bangkokparkour) and Facebook groups. Public training spots: Benjakitti Park (late evenings), Railway Park (Suan Rot Fai) on weekend mornings, Chatuchak Park grass areas. For beginners: gym-based parkour/freerunning classes provide safe learning environment with crash mats before transitioning to outdoor practice. Safety: parkour's risk profile is manageable for beginners who progress appropriately — learning to roll, vault at low heights, and assess surfaces before committing. The Bangkok parkour community actively mentors beginners who show up to training sessions.",
  },
  {
    name: "Acrobatics, Circus Arts & Movement Culture",
    emoji: "🤸",
    area: "Circus/acrobatics studios (several in Bangkok), yoga studios offering acro",
    price: "Acrobatics class ฿500–1,200; Acro yoga class ฿400–900",
    why: "Bangkok's movement culture extends to acrobatics and circus arts — several Bangkok studios teach juggling, partner acrobatics, hand balancing, and aerial arts (silks, hoop). The connection to yoga culture (acro yoga — partner-based flying/basing practice) has expanded participation beyond circus hobbyists. Thai acrobatics has traditional roots (Muay Thai's acrobatic kick tradition, Thai folk performance) alongside modern circus arts influence. The acrobatics community overlaps with the yoga, dance, and martial arts communities — practitioners often cross-train across multiple disciplines.",
    tip: "Bangkok acrobatics finding: acro yoga sessions are offered at most Bangkok yoga studios — acro yoga jams (open practice sessions with new partners) happen regularly. For circus arts: Cirque du Bangkok (and similar studios) teaches juggling, poi, staff, and aerial in class or workshop format. Hand balancing/calisthenics culture: overlaps with the Bangkok street workout community (Lumpini and Benjakitti parks have pull-up bars with regular practitioners). The acrobatics community in Bangkok has strong international representation — sessions are usually bilingual Thai-English.",
  },
  {
    name: "Trampoline Parks & Action Sports Facilities",
    emoji: "⬆️",
    area: "Jump Park (multiple Bangkok locations), Bounce Bangkok, other trampoline venues",
    price: "Trampoline park ฿250–500/hour; Action sports venue ฿300–600",
    why: "Bangkok's trampoline park industry grew significantly through the 2020s — large-format facilities (multiple interconnected trampolines, foam pits, dodgeball courts, basketball hoops) appeal to family entertainment and fitness simultaneously. For parkour/freerunning practitioners, foam pit trampolines enable safe practice of flips and aerial techniques. Bangkok's trampoline facilities include Jump Park (multiple locations), Bounce Bangkok, and others — all similar format, variation in size and equipment quality. The facilities also host recreational dodgeball leagues and trampoline fitness classes.",
    tip: "Bangkok trampoline park practical tips: arrive on weekday mornings for least crowding (families dominate weekend afternoons). Grip socks are required — available for purchase (฿80–150) if not brought. The foam pit queues during peak hours — early arrival means more pit time. For serious aerial training: some Bangkok trampoline parks have 'athlete sessions' or early-morning training slots with lower occupancy and more pit access — call ahead to ask. For parkour training specifically: trampoline skills transfer only partially to outdoor practice — supplement with gym parkour classes for structural movement learning.",
  },
];

export function BangkokFreeRunning() {
  return (
    <div className="rounded-2xl border border-orange-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-800 mb-3">
        🏃 Parkour & movement arts in Bangkok — freerunning, acrobatics & trampoline parks
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
