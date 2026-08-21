const DAYS = [
  {
    day: "Day 1",
    emoji: "🛬",
    theme: "Arrival & settle",
    activities: ["Traditional Thai massage 90min (฿300)", "Light som tam + fresh juice dinner", "Early sleep — body clock adjustment"],
  },
  {
    day: "Day 2",
    emoji: "🧘",
    theme: "Yoga & mindfulness",
    activities: ["Morning yoga class 7am (฿400–600)", "Or Tor Kor market lunch (local produce)", "Afternoon float tank 90min (฿800)"],
  },
  {
    day: "Day 3",
    emoji: "🥊",
    theme: "Movement & energy",
    activities: ["Muay Thai beginner session 9am (฿500)", "Recovery spa (oil massage 90min, ฿500)", "Detox smoothie at Broccoli Revolution"],
  },
  {
    day: "Day 4",
    emoji: "🏊",
    theme: "Water & breathwork",
    activities: ["Freediving intro session (฿2,500)", "Infrared sauna 45min (฿600)", "Plant-based dinner at May Veggie Home"],
  },
  {
    day: "Day 5",
    emoji: "🌿",
    theme: "Thai medicine",
    activities: ["Herb steam bath + Thai massage (Wat Pho massage school, ฿420)", "Traditional herbal tea ceremony", "Evening meditation class (฿200–400)"],
  },
  {
    day: "Day 6",
    emoji: "🚵",
    theme: "Active day",
    activities: ["Bangkrachao 'Green Lung' cycling (฿300 bike hire)", "Khlong Lat Mayom market brunch", "Evening yoga nidra session (฿300)"],
  },
  {
    day: "Day 7",
    emoji: "✨",
    theme: "Integration day",
    activities: ["Morning journal + coffee (local café)", "Full body Shiatsu or reflexology (฿500)", "Departure or extend stay"],
  },
];

export function BangkokWellnessWeek() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🌿 Bangkok wellness week — 7-day plan
      </h2>
      <div className="space-y-2">
        {DAYS.map((d) => (
          <div key={d.day} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{d.emoji}</span>
              <div>
                <span className="font-black text-xs">{d.day}</span>
                <span className="text-[10px] text-[var(--muted)] ml-2">{d.theme}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              {d.activities.map((a, i) => (
                <div key={i} className="text-[10px] flex gap-1.5 items-start">
                  <span className="shrink-0 text-teal-500">▸</span>
                  <span className="text-[var(--fg)]">{a}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-teal-700 bg-teal-50 rounded-xl p-2.5">
        <strong>Budget:</strong> This 7-day plan runs ฿8,000–฿15,000 for activities only (not accommodation or food). Cheaper than equivalent wellness retreats in Bali or India.
      </div>
    </div>
  );
}
