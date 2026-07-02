const ARTS = [
  {
    name: "Brazilian Jiu-Jitsu (BJJ)",
    emoji: "🥋",
    area: "Sukhumvit, Silom, Ekkamai — multiple academies",
    price: "Drop-in class ฿500–800; Monthly ฿4,000–7,000",
    why: "Bangkok has Southeast Asia's most developed BJJ community. Multiple IBJJF-recognized gyms with certified black belt instructors. International competition standard training — many Bangkok expats are serious BJJ practitioners. Gyms: Evolve MMA (Sukhumvit), Rat Muay Thai (Chalong-style facility near Bangkok), Tiger Muay Thai affiliate gyms.",
    tip: "First class usually free at established gyms. Drop-in welcome. Bring GI (kimono) if you have one — rental available. Open mat sessions (no-instructor rolling) happen most evenings — very welcoming to visiting practitioners with experience.",
  },
  {
    name: "Muay Thai (Beginner-Friendly Gyms)",
    emoji: "👊",
    area: "Lumpini Park area, Sukhumvit, Silom",
    price: "Single class ฿500–800; 2-week intensive ฿8,000–15,000",
    why: "Bangkok is the world capital of Muay Thai — training here is authentic. Tourist-friendly gyms (Fairtex, Evolve, Punch It) teach proper Muay Thai technique to beginners with English-speaking trainers. Serious traditional gyms (Sasiprapa) accept serious students who speak Thai or can demonstrate commitment.",
    tip: "For visitors wanting to try: Evolve MMA or Punch It are most accessible. 2-hour morning session includes pad work, bag work, and technique. Sparring usually in advanced class — don't book sparring as a first experience. The technique learned in even one Bangkok Muay Thai class is far superior to what's taught in most Western gyms.",
  },
  {
    name: "Wing Chun & Traditional Chinese Martial Arts",
    emoji: "🐉",
    area: "Chinatown and Chinese community areas",
    price: "Class ฿300–600; Monthly ฿3,000–5,000",
    why: "Bangkok's large Chinese-Thai community supports traditional Chinese martial arts schools. Wing Chun, Tai Chi, Wushu academies exist in Chinatown and Huai Khwang areas. Less tourist-oriented than Muay Thai — more community-based learning with Thai-Chinese instructors.",
    tip: "Tai Chi is available free every morning in Lumpini Park (morning exercise groups from 6am). Wing Chun and Wushu academies are harder to find but exist — search Facebook in Thai for 'วิงชุน กรุงเทพ'. Language barrier more significant than with Muay Thai gyms.",
  },
  {
    name: "Wrestling & Submission Grappling",
    emoji: "🤼",
    area: "Evolve MMA, Tiger Muay Thai Bangkok, dedicated grappling gyms",
    price: "Drop-in ฿600–900; Monthly ฿5,000–8,000",
    why: "Bangkok's MMA scene has brought wrestling and submission grappling instruction alongside BJJ. Evolve MMA has world champion wrestlers on staff. No-Gi submission grappling (ADCC rules) sessions common. Bangkok's grappling community is international — training partners from 30+ countries.",
    tip: "No-Gi grappling requires just rash guard and shorts — most accessible for visitors. NOGI sessions usually evenings. Competition training available for those competing internationally.",
  },
];

export function BangkokMartialArts() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥋 Martial arts in Bangkok — BJJ, Muay Thai, Wing Chun & grappling
      </div>
      <div className="space-y-2">
        {ARTS.map((a) => (
          <div key={a.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{a.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{a.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{a.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{a.why}</div>
            <div className="text-[10px] text-red-700">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
