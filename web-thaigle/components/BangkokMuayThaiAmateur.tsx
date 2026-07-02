const PROGRAMS = [
  {
    name: "Amateur Muay Thai Fight — Tourist Fight Night",
    emoji: "🥊",
    area: "Various Bangkok gyms, Pattaya, Koh Samui",
    price: "Tourist fight night entry ฿300–600; Fighting yourself (if trained) varies",
    why: "For visitors who've trained Muay Thai (even for just a week), some Bangkok and Pattaya gyms organize 'tourist fight nights' — controlled amateur Muay Thai fights between visitors at similar skill levels. These events are typically held at gym-connected venues with referee oversight, basic equipment requirements (8 oz gloves minimum, groin guard, mouthguard), and paired by weight. The experience of competing in Thailand — in the country that created the sport — is a meaningful milestone for serious Muay Thai enthusiasts. Not for absolute beginners: minimum 1 week of dedicated training recommended.",
    tip: "Tourist fight night realities: ask the gym how they assess matching (by weight, by training level, or both). Mismatches happen at lower-quality events — knowing your potential opponent trained 2 weeks while you've trained one month is important. The match is typically 3x2-minute rounds with no hard punching to the head in some versions (gym-specific rules). Your gym trainer's honest assessment of readiness is the most important input. The experience is intense regardless of result — adrenaline at a level most people never experience.",
  },
  {
    name: "White Collar Muay Thai — Corporate Fighter Programs",
    emoji: "👔",
    area: "Fairtex, Yokkao, and similar high-profile Bangkok gyms",
    price: "Training camp (12-week preparation) ฿15,000–30,000; Event tickets ฿500",
    why: "White collar Muay Thai (professionals who take up fighting as adults for an event) has caught on in Bangkok's expat community, mirroring the white collar boxing format. Companies like Yokkao Thailand run structured programs — 12 weeks of intensive gym training culminating in a high-production Muay Thai event with real crowds. Participants include finance professionals, lawyers, and tech workers who want the discipline of fight training and the experience of competing in a significant event. The production quality is much higher than tourist fight nights.",
    tip: "White collar Muay Thai preparation: 12 weeks of 3–5 sessions per week is the standard program. The training reveals physical capabilities and mental discipline that regular gym training doesn't access. Weight management (fighting at your natural weight is important for health) requires guidance from the gym's nutrition advisor. The after-party at white collar Muay Thai events is a notable Bangkok social event — the cross-section of Bangkok's expat business community in one room post-fight creates an unusual social dynamic.",
  },
  {
    name: "Lumpini & Rajadamnern Stadium — Live Fight Watching",
    emoji: "🏟️",
    area: "Lumpini Boxing Stadium (Ram Intra Rd); Rajadamnern Stadium (near Khao San)",
    price: "Ringside ฿2,000–3,000; 3rd class ฿300–500; Foreigners typically ฿1,500–2,000",
    why: "Watching live professional Muay Thai at Bangkok's two main stadiums — Lumpini and Rajadamnern — is the definitive Bangkok combat sports experience. These are professional fights (not tourist shows), with real gamblers (the betting action at Rajadamnern is extraordinary to observe), real knockout attempts, and the electric atmosphere of Bangkok's traditional sports culture. The stadium environment — decades of institutional weight, the shouted odds from gambling sections, the Thai music (sarama) playing throughout — is unlike any sporting event in the world.",
    tip: "Rajadamnern vs Lumpini: Rajadamnern is the older, more traditional stadium with more gamblers in the audience — the experience is more authentically Thai but requires more navigation (the gambling system is complex for outsiders). Lumpini was rebuilt and reopened — more modern, slightly more tourist-oriented, still excellent Muay Thai quality. Both: arrive for the middle bouts (7–8pm) as lower-ranked matches are early and the main events are late (9–10pm). Foreigners usually pay tourist pricing — negotiate at the gate if the price seems very high.",
  },
];

export function BangkokMuayThaiAmateur() {
  return (
    <div className="rounded-2xl border border-red-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-800 mb-3">
        🥊 Muay Thai amateur fighting & watching in Bangkok — tourist fights, white collar & stadiums
      </div>
      <div className="space-y-2">
        {PROGRAMS.map((p) => (
          <div key={p.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{p.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{p.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-red-800">💡 {p.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
