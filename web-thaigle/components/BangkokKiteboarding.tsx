const SPOTS = [
  {
    name: "Hua Hin & Gulf Coast Kiteboarding from Bangkok",
    emoji: "🪁",
    area: "Hua Hin (Khao Tao area, 2.5 hours from Bangkok), Pranburi/Pak Nam Pran",
    price: "IKO beginner course ฿8,000–15,000 (3-day); Day equipment rental ฿2,500–5,000",
    why: "The Gulf of Thailand coast accessible from Bangkok — particularly Hua Hin and Pranburi — has consistent kiteboarding conditions during the northeastern monsoon season (November–April) when offshore winds blow steady from the northeast at 15–25 knots. Hua Hin's Khao Tao and Pak Nam Pran beaches are the primary kiteboarding zones: flat water lagoons ideal for beginners, and open Gulf access for advanced riders. Several IKO (International Kiteboarding Organization) certified schools operate at these beaches with beginner to advanced instruction.",
    tip: "Kiteboarding vs. wind conditions at Hua Hin: the NE monsoon season (November–April) provides the best consistent winds — March is often peak season. May–October conditions are erratic (SW monsoon brings thunderstorms, inconsistent wind). For Bangkok day trips: the Hua Hin bus from Southern Bus Terminal (Mo Chit area) reaches Hua Hin in 2.5–3 hours — manageable for weekend trips. Kiteboarding lesson timing: beginners need 2–3 days for IKO Level 1 (body dragging, power control) before adding a board. Don't rush — kiteboarding has a learning curve where rushing leads to dangerous situations.",
  },
  {
    name: "Koh Samui & Gulf Islands Kiteboarding",
    emoji: "🌊",
    area: "Koh Samui (Thong Son Bay, Maenam), Koh Phangan (Haad Rin area)",
    price: "Beginner course ฿12,000–18,000; Advanced day package ฿3,500–6,000",
    why: "Koh Samui's kiteboarding season (November–April, northeast monsoon) creates ideal conditions — Thong Son Bay on Samui's northeast coast gets cleaner wind and flat-water conditions suitable for all levels. Koh Phangan (accessible from Samui by ferry, 30 minutes) has kiteboarding at Haad Rin and northern beaches. The island kiteboarding experience combines water sport with island lifestyle in a way that Hua Hin's more developed resort area doesn't — more raw and adventure-oriented. Several professional kiteboarding coaches have relocated from Europe to Koh Samui, bringing competition-level instruction.",
    tip: "Koh Samui kiteboarding logistics from Bangkok: direct flights Bangkok–Koh Samui (Bangkok Airways, Air Asia) take 1.5 hours — long weekend accessible. Accommodation near kiteboarding spots: Chaweng and Maenam areas have range from budget to luxury with access to kite beaches. Key safety rule: always take a lesson from certified school before attempting solo kiteboarding — the power of a large kite in 20+ knots of wind is serious. IKO certification is internationally recognized — lessons in Thailand count toward certification valid at kiteboarding spots worldwide.",
  },
  {
    name: "Stand-Up Paddleboard (SUP) & Alternative Water Sports",
    emoji: "🏄",
    area: "Bangpra Reservoir (Chonburi, 1.5h from Bangkok), Pattaya beach, Pranburi",
    price: "SUP rental ฿400–800/hour; SUP yoga class ฿800–1,500; Beginner lesson ฿1,500–3,000",
    why: "Stand-up paddleboarding has become Bangkok's gateway water sport — the accessibility (no certification required, learnable in 30 minutes), calm water requirements (Bangkok's nearby reservoirs work perfectly), and full-body workout appeal create consistent demand. Bangpra Reservoir in Chonburi (1.5 hours from Bangkok) has flat, motorboat-free water ideal for SUP practice. Pattaya beach areas offer SUP alongside other watersports. SUP yoga (doing yoga on a paddleboard) has a dedicated community in Bangkok. For kiteboarding-curious people, SUP teaches ocean/water comfort before committing to kite learning.",
    tip: "SUP in Bangkok or near Bangkok: Bangpra Reservoir is the primary location for SUP without traveling to the coast — calm flat water, organized SUP rental operations, and occasional SUP race events. Pattaya's beach SUP is more accessible for day trips (2 hours from Bangkok) but with choppier water and more boat traffic. SUP for fitness: SUP yoga sessions on flat water at early morning are highly effective — sunrise paddle yoga sessions with Bangkok skyline in background happen at some Bangkok riverside locations. Equipment purchase: Thailand has several SUP board importers making Thai prices competitive for quality boards.",
  },
];

export function BangkokKiteboarding() {
  return (
    <div className="rounded-2xl border border-sky-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-800 mb-3">
        🪁 Kiteboarding near Bangkok — Hua Hin & Samui kite spots, SUP & water sports
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-sky-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
