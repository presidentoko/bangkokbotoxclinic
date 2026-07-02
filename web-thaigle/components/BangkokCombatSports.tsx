const SPOTS = [
  {
    name: "MMA & Mixed Martial Arts in Bangkok",
    emoji: "🥊",
    area: "MMA gyms throughout Bangkok — Yokkao Training Center, Elite Fight Club, Evolve MMA (multiple locations)",
    price: "Drop-in MMA class ฿600–900; Monthly MMA unlimited ฿5,000–10,000; Semi-private MMA coaching ฿1,500–3,000/hour",
    why: "Bangkok's MMA scene has grown significantly parallel to the global MMA surge — the city's existing combat sports infrastructure (Muay Thai gyms, boxing clubs, grappling academies) provided the foundation for MMA's development. Bangkok MMA gyms are genuine training environments, not tourist operations — the facilities used by Thai and international professional fighters are often the same ones accessible to recreational students. Evolve MMA (Singapore-origin, multiple Bangkok locations) is the most internationally visible brand — teaching all MMA components with world champion coaches. The domestic Thai MMA scene competes under ONE Championship (headquartered in Singapore but with significant Thai fighter representation), and Bangkok's proximity to this organization gives the local training scene a connection to professional competition.",
    tip: "Bangkok MMA training practical: most MMA gyms in Bangkok offer structured beginner programs rather than throwing newcomers into advanced classes — the introduction program at major gyms typically covers fundamental striking, basic grappling, and combination techniques. Physical fitness baseline: you don't need to be highly fit to start MMA training; gyms accommodate all fitness levels in beginner classes. Safety: reputable Bangkok MMA gyms have professional coaches and structured sparring protocols — ask about the sparring culture before participating; ego-free technical sparring environments are preferable to aggressive sparring for learning. Gear: most gyms provide starter gloves and gear for beginners; after committing to training, purchasing your own Muay Thai gloves (8–12 oz for bag work, 14–16 oz for sparring), hand wraps, and a mouthguard is recommended.",
  },
  {
    name: "Karate, Judo & Traditional Martial Arts",
    emoji: "🥋",
    area: "Dojo locations throughout Bangkok — often in community centers, school grounds, and dedicated martial arts studios",
    price: "Karate monthly ฿800–2,500; Judo monthly ฿1,000–3,000; Traditional martial arts varies widely",
    why: "Bangkok has established dojos for traditional Japanese martial arts — karate (multiple styles: Shotokan, Kyokushin, and others have active dojos), judo (Thailand Judo Association and club-affiliated dojos), aikido, and kendo. These communities tend to be smaller and more traditional than the Muay Thai/MMA commercial gyms — dojos run on conventional Japanese martial arts hierarchies, belt progression systems, and training philosophies. The Japanese expat community in Bangkok (significant in size, centered around Phrom Phong and Thong Lor) has supported these traditional martial arts — Japanese karate and judo instructors are present at several Bangkok dojos. Chinese martial arts (Wing Chun, Tai Chi, various kung fu styles) are also represented through the Thai-Chinese community and dedicated studios.",
    tip: "Traditional martial arts dojo finding: these communities are less commercially visible than Muay Thai gyms — search specifically (Facebook groups, Thailand martial arts association websites, Japanese community resources in Bangkok) rather than expecting Google Maps visibility. First visit protocol: traditional dojos typically require advance contact before observing or beginning training — arriving without notice at a traditional dojo is less appropriate than at a commercial gym. Bowing and removing shoes before entering the dojo floor are universal traditional martial arts etiquette that should be observed automatically. Beginner welcome: most Bangkok dojos actively welcome beginners regardless of previous experience — the communities are often genuinely looking to grow student populations.",
  },
  {
    name: "Krav Maga & Self-Defense Training",
    emoji: "🛡️",
    area: "Specialized self-defense studios in Bangkok — Sukhumvit and Silom area concentrations",
    price: "Krav Maga class ฿500–800; Self-defense workshop ฿1,000–2,500; Private self-defense session ฿2,000–4,000/hour",
    why: "Bangkok has Krav Maga (Israeli military self-defense system) and broader self-defense training available through specialized studios. Krav Maga's focus on practical self-defense in realistic scenarios has driven its popularity among Bangkok's expatriate community — particularly women's self-defense programs offered as workshops and ongoing training. The distinction from sport martial arts: Krav Maga training explicitly prepares for street situations rather than sport competition — different target audience and training methodology. Women's self-defense workshops specifically have grown in Bangkok's expat community — typically 3–6 hour workshops covering awareness, avoidance, and physical response to common threat scenarios.",
    tip: "Self-defense workshop selection: look for Krav Maga International (KMI) or IKMF (International Krav Maga Federation) affiliated instructors for credential verification — these organizations maintain instructor certification standards. Women's self-defense workshops in Bangkok: several organizations specifically offer these in English for the expat community — Facebook groups (Women in Bangkok, Expat Women Bangkok) announce upcoming workshops. The most practical self-defense investment for Bangkok: general awareness training (which situations to avoid, how Bangkok-specific scams and crime patterns work) is arguably more valuable than physical technique for most residents and tourists.",
  },
];

export function BangkokCombatSports() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥊 Bangkok combat sports — MMA, karate, judo & self-defense training
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
