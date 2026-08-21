const ACTIVITIES = [
  {
    name: "SEA LIFE Bangkok Ocean World",
    emoji: "🦈",
    age: "All ages (best 3–12)",
    area: "Siam Paragon Basement",
    cost: "฿1,000–1,200/person online (฿1,500 walk-up)",
    duration: "2–3 hours",
    tip: "Buy tickets online for 20% off. Penguin feeding at 11am is a highlight. Glass tunnel under sharks is unmissable.",
  },
  {
    name: "KidZania Bangkok",
    emoji: "👩‍🚒",
    age: "3–14 years",
    area: "Siam Paragon 5F",
    cost: "฿850–1,100/child, ฿500 adults",
    duration: "3–4 hours",
    tip: "Kids roleplay as adults in a scaled-down city. Pilot, chef, firefighter, doctor. Book morning sessions.",
  },
  {
    name: "Children's Discovery Museum",
    emoji: "🔬",
    age: "2–12 years",
    area: "Queen Sirikit Park, Chatuchak",
    cost: "Free",
    duration: "1.5–2.5 hours",
    tip: "Genuinely free. Science + nature exhibits. Less polished than KidZania but authentic and popular with Thai families.",
  },
  {
    name: "Safari World",
    emoji: "🦁",
    age: "All ages",
    area: "Min Buri (40 min from city)",
    cost: "฿1,300/adult, ฿1,100/child (online)",
    duration: "Full day (6–8 hrs for both parks)",
    tip: "Drive-through safari + marine park combo. See giraffes, ostriches, zebras through car window. Best weekdays — far less crowds.",
  },
  {
    name: "Lumpini Park Outdoor Activities",
    emoji: "🦢",
    age: "All ages",
    area: "Silom / Sathorn",
    cost: "Free entry",
    duration: "1–3 hours",
    tip: "Giant monitor lizards roam freely (harmless). Paddle boats ฿40. Early morning: free aerobics + tai chi. Kids love the lizards.",
  },
  {
    name: "Dream World",
    emoji: "🎡",
    age: "4–14 years",
    area: "Pathumthani, 40 min north",
    cost: "฿500–700/person",
    duration: "Half or full day",
    tip: "Smaller, less-polished than Disneyland but charming. Thai kids' favourite. Snow Town (indoor snow room) is unique.",
  },
];

export function BangkokKidsActivities() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        👨‍👩‍👧 Bangkok with kids — best family activities
      </h2>
      <div className="space-y-2">
        {ACTIVITIES.map((a) => (
          <div key={a.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{a.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">Ages: {a.age} · {a.area} · ⏱️ {a.duration}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono font-black text-green-700">{a.cost}</span>
            </div>
            <div className="text-[10px] text-orange-600">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
