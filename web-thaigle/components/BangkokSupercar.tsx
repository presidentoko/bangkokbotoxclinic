const SPOTS = [
  {
    name: "Bira International Circuit — Track Days",
    emoji: "🏎️",
    area: "Pattaya (2 hrs from Bangkok) — Bira International Circuit",
    price: "Track day ฿4,000–8,000/session; HPDE (high performance driving event) ฿5,000–15,000",
    why: "Bira International Circuit in Pattaya is Thailand's main motorsport venue — a permanent road course hosting HPDE (High Performance Driving Events) where owners can drive their cars at elevated speeds in a safe environment. Thai car culture is serious — the Bangkok to Pattaya corridor sees regular supercar convoys on weekends. The circuit itself has been used for Formula-derived race series. HPDE events are open to track novices with a proper briefing; advanced sessions available for experienced drivers. Rental cars (BMW M cars, Lamborghini, other exotics through driving experience providers) are available if you don't have a car.",
    tip: "Track day at Bira: check the event calendar (Bira Circuit's Facebook page for schedules). Novice HPDE requires helmet only (provided by the organizer). Bring water — spectating and waiting between sessions in Thai heat is draining. The paddock area during major track events is a supercar showcase in itself. For those wanting to drive an exotic without owning one: Exotic Car Track Day providers in Bangkok offer Lamborghini, Ferrari, or McLaren experiences with instructors.",
  },
  {
    name: "Bangkok Supercar Community & Weekend Drives",
    emoji: "🚗",
    area: "Sukhumvit weekend parking meets, Asiatique shows, Bangna weekend drives",
    price: "Free (show and shine events); Organized drives: ฿500–2,000",
    why: "Bangkok has Thailand's most active supercar and luxury car community — the convergence of Thai wealth and a car culture tradition (King Bhumibol was a passionate car enthusiast and racing driver) creates genuine car enthusiasm at the high end. Porsche Club Thailand, Ferrari Club of Thailand, Lamborghini Club Thailand, and multiple luxury marque clubs organize regular drives (Khao Yai, Hua Hin, Kanchanaburi routes are popular destinations). The weekly car shows at Asiatique and other Bangkok venues draw crowds of car enthusiasts who view these as social events as much as automotive exhibitions.",
    tip: "Engaging with Bangkok's car community: the unofficial Friday/Saturday night car meets at CentralPlaza Bangna parking structure (check online for current schedules — venues change) are the most accessible entry point. Car show events at Asiatique Riverfront are advertised on their social channels. For joining organized drives: club membership is typically required — most Bangkok exotic car clubs have application processes on their websites. The community is genuinely welcoming to international car enthusiasts who show genuine knowledge of and passion for their specific marque.",
  },
  {
    name: "Motorsport — Formula 4 Thailand & Circuit Racing",
    emoji: "🏁",
    area: "Chang International Circuit, Buriram (4 hrs from Bangkok); Bira Circuit, Pattaya",
    price: "Spectator: ฿500–3,000; Driving school programs: ฿20,000–50,000",
    why: "Thailand has an expanding motorsport infrastructure — Chang International Circuit in Buriram is a FIA Grade 1 facility that has hosted MotoGP and Superbike World Championship events, making it one of Southeast Asia's premier motorsport venues. Formula 4 Thailand is a competitive single-seater series for young drivers. Motorcycle racing (Thailand has a strong racing culture) and touring car racing complete the landscape. For spectating: the Thailand GP events at Buriram draw international attendance with paddock access available.",
    tip: "Chang International Circuit Buriram: accessible by overnight train or early morning flight from Bangkok — a long day trip or overnight journey makes more sense than a same-day drive. The Buriram Province surrounding the circuit has developed significant hospitality infrastructure for motorsport events. Circuit driving schools at Chang: Buriram United Racing School and similar programs offer licensed circuit driving instruction. Formula 4 scholarships are available for young Thai and international drivers — details on Motorsport Thailand's website.",
  },
];

export function BangkokSupercar() {
  return (
    <div className="rounded-2xl border border-yellow-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-800 mb-3">
        🏎️ Supercar & motorsport in Bangkok — track days, car community & Chang Circuit Buriram
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
