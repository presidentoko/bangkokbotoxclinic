const SPOTS = [
  {
    name: "Aerial Arts — Silks, Hoop & Flying Trapeze",
    emoji: "🎪",
    area: "Bangkok aerial arts studios in Ekkamai, Thonglor, and On Nut areas; occasional pop-up aerial performances at Bangkok arts festivals; circus arts communities in inner city creative spaces",
    price: "Aerial silks beginner class: ฿600–1,200; Aerial hoop (lyra) session: ฿600–1,200; Beginner introduction class (1.5h): ฿500–900; Monthly aerial membership: ฿3,000–6,000",
    why: "Bangkok's aerial arts community — aerial silks (fabric), aerial hoop (lyra), pole dance fitness, flying trapeze, and related circus arts — has grown significantly over the past decade, driven by the intersection of fitness culture, performance arts, and the Instagrammable quality of the discipline. Aerial arts require minimal equipment beyond the rigging point and fabric/hoop, making small studio spaces viable, and Bangkok's creative neighborhoods (Ekkamai, Thonglor) have seen multiple dedicated aerial arts studios establish themselves alongside the general fitness studio boom. The disciplines range from pure fitness (aerial arts is an extraordinary upper body and core workout) to performance art (Bangkok's contemporary circus scene produces occasional theatrical productions incorporating aerial elements). Thai cultural heritage in dance and physical performance — Khon dance's athletic demands, Muay Thai's acrobatic kicks, the spectacular Lanna dance traditions — provides a cultural context in which physical artistry is respected rather than viewed as merely entertainment.",
    tip: "Bangkok aerial arts beginner guide: (1) No previous experience required: introductory aerial silks and hoop classes are genuinely accessible to fit adults with no performance or gymnastics background — the first class focuses on basic climbs, wraps, and simple inversions that create immediate satisfaction; (2) Physical prerequisite: while no gymnastics experience is needed, a baseline of upper body strength helps — being able to hang from a bar for 30 seconds and do one pull-up makes progression significantly faster; (3) Clothing: tight-fitting clothes (leggings, fitted top) allow the fabric to grip and allow instructors to see your form; avoid loose clothing that bunches in the rigging; (4) Beginner soreness: aerial arts creates significant bruising on the thighs and hips from fabric contact in the first weeks — this is normal and diminishes as skin conditions; (5) Bangkok aerial community events: aerial arts practitioners in Bangkok organize informal jam sessions, performance showcases, and skill-share workshops through Instagram and Facebook communities.",
  },
  {
    name: "Acro Yoga & Partner Acrobatics Bangkok",
    emoji: "🤸",
    area: "Acro yoga communities at Lumpini Park, Benchasiri Park, and Chatuchak Park (weekend practice jams); dedicated acro yoga studios in Thonglor and Ari areas; yoga festivals incorporating acro workshops",
    price: "Acro yoga class: ฿400–900 per session; Partner workshop (2 hours): ฿600–1,500; Festival acro day pass: ฿1,500–3,000; Monthly unlimited: ฿3,000–6,000",
    why: "Acro yoga — a physical practice combining yoga, acrobatics, and therapeutic flying where partners work together with one person (the base) supporting another (the flyer) in dynamic balancing positions — has an active Bangkok community meeting regularly at parks and dedicated studio spaces. The discipline is distinctively social: practicing alone is impossible, and the community-building aspect of working in base-flyer partnerships creates the collaborative, trust-based social dynamic that makes acro yoga communities worldwide distinctively welcoming to newcomers. Bangkok's year-round outdoor conditions make park jams viable for most of the year, with the cool season (November–February) particularly pleasant for outdoor acrobatics at Lumpini or Benchasiri Park. International visitors can drop into Bangkok's acro yoga community through Meetup.com, AcroConnect app, and local yoga studio event listings — these communities typically welcome traveling practitioners.",
    tip: "Bangkok acro yoga community access: (1) The social entry point: Bangkok acro yoga jams at public parks (particularly Lumpini Park on weekend mornings) are the easiest community entry — show up, express interest, and experienced practitioners will typically guide newcomers through fundamentals; (2) Base vs flyer roles: most beginners start as a flyer (being supported off the ground) before learning the base role (which requires more body awareness and strength for safe spotting); (3) Spotting culture: well-run acro yoga communities have experienced spotters for all early flying — never attempt flying positions without an experienced spotter; (4) L-basing: the foundational acro yoga position (base lies on back with feet in flyer's hips, legs at 90 degrees) is learnable in a single session with proper instruction; (5) Traveling acro practitioners: bringing lightweight acro supplies (flying socks that improve grip) allows immediate participation at Bangkok community jams without needing local equipment.",
  },
  {
    name: "Pole Dance Fitness & Exotic Dance Bangkok",
    emoji: "💃",
    area: "Pole dance studios throughout Bangkok — concentrated in Thonglor, Ekkamai, Silom, and Ari areas; some mainstream fitness centers incorporating pole fitness classes",
    price: "Pole dance beginner class: ฿500–900; 1-month unlimited membership: ฿3,500–7,000; Private lesson: ฿1,200–2,500; Drop-in class: ฿600–1,000",
    why: "Pole dance fitness has evolved from its nightlife entertainment context into a mainstream fitness and performance art discipline in Bangkok — with multiple dedicated studios offering structured curricula from absolute beginner (learning to hold the pole, basic spins and footwork) through intermediate (inverted poses, climbs, combinations) to advanced competitive level. The physical demands are significant: pole fitness builds extraordinary upper body strength, core stability, and flexibility — practitioners often cite it as the most complete strength workout they've experienced. Bangkok's pole fitness community includes practitioners across a wide demographic range — fitness enthusiasts, dancers, competitive pole athletes, and people who found it through friends — and the studio culture is generally supportive rather than judgmental. Thailand's existing connection to entertainment pole performance (Bangkok's nightlife industry) gives the city an unusual context around the discipline, but the fitness community explicitly separates recreational pole fitness from entertainment, focusing on athletics and artistry.",
    tip: "Bangkok pole fitness studio navigation: (1) Appropriate introduction classes: reputable studios have genuine beginner programs with leveled curricula — look for studios with certified instructors (XPERT, International Pole Dance Fitness Association, or equivalent), defined level progression, and safety protocols; (2) Physical preparation: small calluses develop on the inner thighs and hands over the first weeks — these are normal and temporary; wearing workout clothes that expose the legs (shorts) is standard for pole as skin contact with the pole is necessary for grip; (3) Grip aids: many studios allow chalk or grip spray for students who struggle with perspiration-related grip loss; (4) Community: Bangkok's pole fitness community is active on Instagram and Facebook, with irregular social events, open classes, and showcase performances that welcome newcomers; (5) Male practitioners: pole fitness as a sport is actively practiced by men globally at high competitive levels; Bangkok studios welcome male practitioners, though the majority of students are currently female.",
  },
];

export function BangkokAcrobatics() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎪 Bangkok aerial & circus arts — silks, acro yoga & pole fitness
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
