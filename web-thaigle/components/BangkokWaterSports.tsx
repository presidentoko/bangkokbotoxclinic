const ACTIVITIES = [
  {
    name: "Wake Boarding — Rangsit Cable Park",
    emoji: "🏄",
    distance: "40km north of Bangkok (50 min)",
    price: "฿300–500 (1hr session) + gear rental ฿200",
    level: "Beginner to advanced. Instructors available.",
    why: "No boat needed — cable system pulls you. Bangkok's closest wake park. Young crowd, good atmosphere.",
    tip: "Rope + board included in session. Helmet and impact vest recommended (฿50 extra). Go on weekday to avoid queues.",
  },
  {
    name: "Kitesurfing — Hua Hin Beach",
    emoji: "🪁",
    distance: "250km south (3hr drive or 4hr bus)",
    price: "Lessons from ฿3,500/3hr. Day course ฿6,500.",
    level: "Beginner courses and intermediate available",
    why: "Hua Hin is Thailand's best accessible kitesurfing spot. Consistent wind November–April.",
    tip: "Book in advance (Hua Hin Kite Club). Best months: Dec–Feb (strong steady wind).",
  },
  {
    name: "Stand-Up Paddleboarding — Pattaya",
    emoji: "🏊",
    distance: "150km east (2hr bus from Eastern terminal)",
    price: "SUP rental ฿300–500/hr. Lessons ฿1,500.",
    level: "Any fitness level. 20 min learning curve.",
    why: "Calm waters around Pattaya headland ideal for SUP. Several operators on Jomtien Beach.",
    tip: "Jomtien Beach (south Pattaya) calmer than Pattaya Beach. Go 7–10am before wind picks up.",
  },
  {
    name: "Surfing — Khao Lak / Phuket",
    emoji: "🌊",
    distance: "900km south (fly 1hr 20min to Phuket)",
    price: "Lessons from ฿1,500/2hr. Boards ฿400/hr.",
    level: "Beginner surf breaks at Kata Beach, Phuket",
    why: "Thailand's surf season is May–October (monsoon from west). Kata Beach Phuket has best consistent beginner waves in Thailand.",
    tip: "Best months: Aug–Sep. Book from Bangkok flight + lesson package on Klook (฿3,500 total).",
  },
];

export function BangkokWaterSports() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🌊 Water sports near Bangkok — wakeboarding to surfing
      </h2>
      <div className="space-y-2.5">
        {ACTIVITIES.map((a) => (
          <div key={a.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{a.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {a.distance} · Level: {a.level}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{a.price.split(" ")[0]}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{a.why}</div>
            <div className="text-[10px] text-orange-600">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
