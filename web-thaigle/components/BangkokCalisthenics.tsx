const SPOTS = [
  {
    name: "Outdoor Calisthenics Parks in Bangkok",
    emoji: "💪",
    area: "Lumpini Park, Benjakitti Park, Suan Rot Fai, neighborhood parks throughout Bangkok",
    price: "Park access free; Personal training ฿500–1,200/session",
    why: "Bangkok's public parks have free outdoor fitness equipment including pull-up bars, parallel dip bars, and bodyweight training stations — a legacy of public health initiatives that installed calisthenics equipment throughout the city. Lumpini Park (Bangkok's central park, accessible from Silom MRT) has the most comprehensive outdoor gym setup. The Bangkok calisthenics community (street workout culture) trains at these parks daily — early mornings (6–8am) and evenings (5–7pm) see the most activity. The climate makes early morning outdoor training the preferred window.",
    tip: "Bangkok park workout culture: showing up consistently at the same park creates natural training partnerships — the community is welcoming to newcomers who show genuine training commitment. Lumpini Park is the flagship — multiple pull-up bar stations, parallel bars, and open exercise areas. Suan Rot Fai (Railway Park) has excellent grass areas for gymnastics and bodyweight skills. For connecting with the Bangkok calisthenics community: Facebook group 'Street Workout Bangkok' and Instagram #BangkokCalisthenics organize training meetups and skill-sharing sessions. The international influence (Ghetto Workout style, World Street Workout Federation) meets traditional Southeast Asian physical culture here.",
  },
  {
    name: "Gymnastics & Bodyweight Skill Training",
    emoji: "🤼",
    area: "Gymnastics clubs (Pathumwan, multiple locations), parkour gyms, movement studios",
    price: "Gymnastics adult class ฿600–1,200/session; Monthly membership ฿3,000–8,000",
    why: "Bangkok's gymnastics infrastructure (designed for Thai national team development and sport participation) is partially accessible to adult recreational practitioners — several Bangkok gymnastics clubs offer adult gymnastics classes for beginners through advanced. Bodyweight skill progression (handstands, muscle-ups, front levers, human flags) draws people who started with calisthenics and want coached skill development. Bangkok's yoga community also practices advanced bodyweight skills — arm balances, crow poses, and handstand workshops bridge yoga and gymnastics cultures.",
    tip: "Adult gymnastics in Bangkok: most Bangkok gymnastics clubs focus on children's programs — call specifically to ask about adult recreational programs. The few clubs offering adult programs usually have mixed-ability classes (absolute beginners to intermediate). Foam pits: gymnastics facilities with foam pits are valuable for learning flips and advanced skills safely — most Bangkok gymnastics clubs have foam pits available. Handstand coaching specifically: several Bangkok yoga studios offer dedicated handstand workshops and progressions distinct from competitive gymnastics — accessible entry point for those interested in overhead balance skills.",
  },
  {
    name: "Crossfit & Functional Fitness in Bangkok",
    emoji: "🏋️",
    area: "CrossFit affiliates throughout Bangkok (Sukhumvit corridor, Ari, Ratchada)",
    price: "Drop-in class ฿500–900; Monthly membership ฿3,500–7,000",
    why: "CrossFit has a well-established Bangkok affiliate network — many boxes (CrossFit gyms) throughout the city, run by Thai and expat coaches with CrossFit Level 1 and 2 certifications. Bangkok CrossFit boxes typically run 6–8 classes daily, welcome drop-ins, and have bilingual (Thai-English) instruction. The CrossFit competitive scene in Bangkok includes regular in-box competitions and Thai participation in regional CrossFit competitions. The community aspect — the 'box' social group — is particularly valuable for newly-arrived expats building social networks. Many Bangkok boxes have specialized programming for masters athletes, beginners, and competitors.",
    tip: "Bangkok CrossFit practical info: most boxes run introductory 'On Ramp' programs (3–5 sessions) for new CrossFitters that teach Olympic lifting basics and movement patterns before joining regular classes. Drop-in rates vary but are usually available without advance booking for experienced CrossFitters. Comparing boxes: Bangkok has enough boxes that shopping around for coach quality, equipment quality, and community culture makes sense — class demos are usually offered free. Parking: CrossFit boxes in Sukhumvit area have notoriously limited parking — build in transit buffer.",
  },
];

export function BangkokCalisthenics() {
  return (
    <div className="rounded-2xl border border-emerald-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-3">
        💪 Calisthenics & strength training in Bangkok — park workouts, gymnastics & CrossFit
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-emerald-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
