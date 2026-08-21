const PRACTICES = [
  {
    name: "Temple Sitting Meditation (Free)",
    emoji: "🧘",
    location: "Wat Mahathat (Rattanakosin Island), Wat Bowon, Wat Dhammakaya",
    cost: "Free donation appreciated",
    what: "Several Bangkok temples welcome visitors to join sitting meditation sessions. Wat Mahathat's Section 5 (Vipassana meditation center) is the most accessible for English speakers. Morning sessions start 7–9am. Instruction provided by monks in basic sitting posture and breath awareness.",
    good_for: "Those wanting authentic Buddhist meditation context, not yoga-studio wellness. Expect simple wooden floors, incense, and monks leading the practice.",
  },
  {
    name: "Insight Meditation Society Bangkok",
    emoji: "🌸",
    location: "Various community centers, primarily Sukhumvit",
    cost: "Donation-based or ฿200–400",
    what: "English-language vipassana and mindfulness groups meeting weekly. Guided instruction in insight meditation techniques. Mix of Buddhist expats, meditation practitioners, and curious visitors. More structured than temple sessions, more community-building than commercial studios.",
    good_for: "Consistent practice while staying in Bangkok for 1+ weeks. Building a meditation sangha (community) connection.",
  },
  {
    name: "Mindfulness-Based Classes at Yoga Studios",
    emoji: "🌿",
    location: "Yoga Barn Bangkok, Space Bangkok, Absolute You",
    cost: "Single class ฿400–700",
    what: "Modern mindfulness classes taught in English — MBSR (Mindfulness-Based Stress Reduction) techniques, body scan meditation, mindful movement. Air-conditioned, comfortable, secular approach. Better entry point for non-religious practitioners who want structure without Buddhist context.",
    good_for: "Travelers familiar with mindfulness apps (Headspace, Calm) wanting an instructor-led experience.",
  },
  {
    name: "Monastery Short Retreat (Weekend)",
    emoji: "⛩️",
    location: "Wat Suan Mokkh Bangkok, Chiang Mai retreats accessible by train",
    cost: "Donation or ฿1,200–2,500 all-inclusive",
    what: "Bangkok temples and monasteries run weekend meditation retreats — 2-day programs with accommodations, simple vegetarian food, group meditation sessions, dharma talks. The goal is extended immersion, not a drop-in class. Phones surrendered during retreat.",
    good_for: "Travelers with 2 nights free who want a genuine retreat experience. Minimum 2-day commitment. Prior meditation experience not required.",
  },
];

export function BangkokMindfulness() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🧘 Mindfulness & meditation in Bangkok — temples, classes & short retreats
      </h2>
      <div className="space-y-2">
        {PRACTICES.map((p) => (
          <div key={p.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.location}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.cost}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.what}</div>
            <div className="text-[10px] text-purple-700">✓ Best for: {p.good_for}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
