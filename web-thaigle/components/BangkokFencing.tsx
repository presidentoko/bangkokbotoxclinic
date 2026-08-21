const INFO = [
  {
    name: "Fencing Clubs in Bangkok",
    emoji: "⚔️",
    area: "Kasetsart University, Chulalongkorn, sports complexes",
    price: "Club membership ฿2,000–4,000/month; Beginners course ฿3,000–6,000",
    why: "Bangkok has an active fencing community — smaller than other sports but genuinely present. Clubs at major universities (Kasetsart, Chula, Mahidol) accept non-student members at some facilities. The Thailand Fencing Association oversees national competition programs. Three weapons: foil (most common for beginners), épée (full-body target), sabre (upper body).",
    tip: "Fencing requires significant equipment investment eventually (mask, jacket, glove, weapon) — starter courses typically include equipment. Thai fencing clubs are welcoming of beginners and international visitors. Club practice sessions usually run 2–3 evenings per week.",
  },
  {
    name: "Getting Started with Fencing",
    emoji: "🥋",
    area: "Any Bangkok fencing club",
    price: "Beginner course ฿3,000–6,000 (6–8 sessions)",
    why: "Fencing is one of the more accessible combat/martial arts for complete beginners — no contact until protective gear is on, technique learned progressively. Footwork, blade control, point attacks, and parries learned separately before sparring. The mental chess aspect (deceiving your opponent, provoking reactions) is the part that keeps practitioners engaged for years.",
    tip: "Foil is the recommended weapon for beginners — targets only the torso, rules are strictest (right-of-way), it forces clean technique. Épée (any-target, simultaneous hits both score) is commonly chosen by people who want less rule complexity. Sabre is the fastest-paced and most dramatic. Trainers will recommend starting with foil.",
  },
  {
    name: "Thai Fencing on the Competition Circuit",
    emoji: "🏆",
    area: "Nimibutr National Hall, Huamark Complex",
    price: "Tournament entry ฿200–500",
    why: "Thailand competes in international fencing and hosts regional Southeast Asian fencing competitions. Bangkok's national championships are held at Huamark. Foreign fencers with rankings from their national federation can compete in Thailand's open tournaments — bring FIE card/ranking documentation.",
    tip: "Southeast Asian fencing is developing rapidly — Thai women's foil has produced internationally competitive athletes. If you're a competitive fencer visiting Bangkok, the community is small enough that connecting with local clubs is easy via the Thailand Fencing Association Facebook page.",
  },
];

export function BangkokFencing() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        ⚔️ Fencing clubs in Bangkok — foil, épée & sabre for all levels
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-gray-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
