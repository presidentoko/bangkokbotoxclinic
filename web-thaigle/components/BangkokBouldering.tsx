const SPOTS = [
  {
    name: "Indoor Bouldering in Bangkok",
    emoji: "🧗",
    area: "Bouldering gyms throughout Bangkok — notable: The Climbing Lab (multiple locations), BLOC Climbing Bangkok, Fire Climbing Gym",
    price: "Day pass ฿350–550; Monthly membership ฿1,800–4,000; Shoes/chalk rental ฿80–150",
    why: "Bangkok has a rapidly growing indoor bouldering scene — the combination of hot outdoor temperatures (making outdoor climbing uncomfortable most of the year), a young professional expat and Thai population seeking urban recreational activities, and the general global bouldering growth has driven significant gym expansion since 2018. Bangkok bouldering gyms set problems ranging from V0 (complete beginner) to V10+ (advanced), and the route-setting culture in Bangkok's better gyms is genuinely creative. The bouldering community in Bangkok is notably welcoming to newcomers — the absence of gear requirements (no harness, ropes, or lead experience needed), accessible skill entry point, and social atmosphere at gyms creates a consistently approachable community. For expats: bouldering gyms have become significant social spaces in Bangkok's fitness landscape.",
    tip: "Bangkok bouldering gym selection: The Climbing Lab (multiple Bangkok locations) is the most established brand with consistent route setting quality; BLOC Climbing offers a design-forward environment in a convenient Sukhumvit-area location; research current locations and hours as the scene expands. First visit: most gyms offer an orientation session for first-timers — the staff will explain bouldering etiquette (crash pad sharing, movement below active climbers, calling 'falling'), basic technique, and gym rules. Shoes: renting climbing shoes for the first visit is standard practice — after a few sessions, purchasing your own shoes dramatically improves performance. Bangkok heat factor: all Bangkok bouldering gyms are air-conditioned — this is a significant comfort advantage over outdoor sports in Bangkok's climate.",
  },
  {
    name: "Lead Climbing & Top-Rope Facilities",
    emoji: "🏔️",
    area: "Bangkok climbing gyms with rope walls — fewer facilities than bouldering-only gyms",
    price: "Rope climbing day pass ฿400–700; Lead climbing certification course ฿1,500–3,000; Monthly membership ฿2,500–5,000",
    why: "While bouldering is the growth edge of Bangkok's climbing scene, rope climbing (top-rope and lead) facilities exist for climbers who want to work on longer routes and height. Bangkok's rope-equipped climbing gyms have 12–18m walls with auto-belay devices (accessible without a partner), fixed top-ropes, and lead climbing sections for certified lead climbers. The auto-belay option is particularly valuable in Bangkok's solo-traveler and expat context — it removes the need for a belay partner, making it possible to climb any time without advance arrangement. Lead climbing certification is typically a 2–4 hour course at the gym — the skills (clipping quickdraws, fall technique, belaying a lead climber) transfer internationally across gyms.",
    tip: "Bangkok climbing certification: lead climbing certification from a Bangkok gym is generally recognized at other IFSC-standard gyms internationally — worth obtaining if you plan to climb at home or at international gyms. Auto-belay devices at Bangkok gyms: the Trublue and Headrush auto-belay systems used at Bangkok gyms are safe when used correctly — follow staff instruction for attachment. Partner finding: most Bangkok climbing gyms have community boards or social media groups where climbers seek partners for lead climbing or outdoor trips. Outdoor climbing day trips: Pha Noen Thung (Kaeng Krachan area) and areas near Kanchanaburi offer outdoor natural climbing accessible as long weekend trips from Bangkok — Bangkok's climbing gym community organizes these periodically.",
  },
  {
    name: "Rock Climbing Day Trips from Bangkok",
    emoji: "🪨",
    area: "Pha Noen Thung (Phetchaburi), Kanchanaburi limestone crags, Khao Ngu (Ratchaburi) — 2–4 hours from Bangkok",
    price: "Day trip transport ฿500–1,500; Guide ฿1,500–3,000/day; Equipment rental at crag ฿200–500",
    why: "While Thailand's most famous rock climbing destination is Railay Beach in Krabi (8+ hours from Bangkok), several outdoor climbing areas within day-trip or weekend-trip range of Bangkok provide accessible outdoor climbing experiences. Khao Ngu (Ratchaburi, 2 hours west) has beginner-accessible bolted routes on limestone crags near the city — popular for first outdoor climbing experiences. The Phetchaburi area limestone formations (3 hours) include Pha Noen Thung's sport climbing routes. These areas are less developed than Krabi but accessible and used regularly by Bangkok's climbing community for practice and outdoor climbing fixes. Rock quality and route development: Thailand's limestone climbing is generally excellent quality — the karst limestone creates the dramatic overhanging features that Thailand is globally known for.",
    tip: "Outdoor climbing logistics from Bangkok: driving is most practical for reaching these crags (rental car or organized group transport from climbing gyms). First outdoor climbing experience: going with an organized group from a Bangkok climbing gym or with an experienced guide is strongly recommended — outdoor climbing introduces hazards (rockfall, route-finding, anchor assessment) not present indoors. Essential gear for outdoor trips: quickdraws, rope, harness, helmet (mandatory outdoors), climbing shoes, and chalk — rental is sometimes available at crags but limited. The Bangkok climbing community Facebook groups and gym social networks are the best source for organized day trip coordination. Krabi trip planning: if Railay Beach limestone climbing is the goal, plan a long weekend or extend a Bangkok trip south for the world-class climbing experience.",
  },
];

export function BangkokBouldering() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🧗 Bangkok climbing — indoor bouldering, rope climbing gyms & outdoor day trips
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-stone-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
