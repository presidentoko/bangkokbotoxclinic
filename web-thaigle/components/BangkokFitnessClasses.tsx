const STUDIOS = [
  {
    name: "Absolute You (Dance + HIIT)",
    emoji: "💃",
    area: "Thonglor, Ekkamai, Asoke locations",
    price: "Drop-in ฿600–900; 10-class pack ฿5,000–8,000",
    why: "Bangkok's most popular boutique fitness chain. Zumba, Latin dance, HIIT, barre, TRX. Professional instructors, upbeat environment, English classes. Multiple daily time slots. Air-conditioned studios. Popular with expats and English-speaking Thai professionals.",
    tip: "ClassPass accepted (if subscribed). Thonglor branch is largest with most class variety. New student intro offer: 3 classes for ฿999 typically available. Book online through their app — popular slots (6–8pm weekdays) fill fast.",
  },
  {
    name: "Figma Studio (Dance Fitness)",
    emoji: "🎶",
    area: "Phrom Phong / On Nut area",
    price: "Single class ฿350–500",
    why: "Bangkok's dedicated dance fitness studio. Zumba, Bollywood dance, hip hop, K-pop dance classes. Very social, fun atmosphere. Popular with Thai and expat communities. Large class sizes but well-organized.",
    tip: "K-pop dance classes (BTS, Blackpink routines) fill extremely fast — book the day before. Beginners welcome in all classes. Bring towel and water bottle. Loose, comfortable clothing best. Cash and card accepted.",
  },
  {
    name: "Virgin Active (Fitness Club)",
    emoji: "🏋️",
    area: "CentralWorld, Em District (Emporium area)",
    price: "Day pass ฿500–1,200; Monthly ฿3,000–6,000",
    why: "International fitness club with group fitness classes including Zumba, Bodycombat, Bodystep, Les Mills programs. World-class equipment, swimming pools at some locations. Best option for consistent exercisers who want Western-standard gym experience.",
    tip: "Day pass valid for all group fitness classes that day — plan around the class schedule. Emporium branch has pool. CentralWorld branch is most central. Monthly membership worth considering for stays 3+ weeks. International instructor qualifications throughout.",
  },
  {
    name: "Community Park Zumba (Free)",
    emoji: "🌳",
    area: "Lumpini Park, Benjasiri Park, Wachirabenchatat Park",
    price: "Free",
    why: "Bangkok's public parks hold free aerobic, Zumba-style, and group exercise classes early morning and late afternoon. Led by volunteer instructors, anyone can join. Lumpini Park aerobic class (5:30–7am) has 200–300 participants. Authentic local experience.",
    tip: "Lumpini Park aerobic group: southeast corner of the park, 5:30am daily. Bring a towel, water, and comfortable shoes. Just join the group and follow along — instructor demonstrates all moves, no Thai language required. Very welcoming community.",
  },
];

export function BangkokFitnessClasses() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        💃 Fitness classes in Bangkok — Zumba, dance & group exercise guide
      </h2>
      <div className="space-y-2">
        {STUDIOS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
