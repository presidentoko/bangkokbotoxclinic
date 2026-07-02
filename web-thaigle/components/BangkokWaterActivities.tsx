const ACTIVITIES = [
  {
    name: "Kayaking — Bang Krachao Green Lung",
    emoji: "🚣",
    distance: "15 min by Grab from Asok BTS to river pier, then ferry",
    price: "Kayak rental ฿150–300/hour",
    duration: "2–4 hours",
    why: "Paddle through Bangkok's only green lung — a forested island in the Chao Phraya bend. Mangrove canals, birdwatching, complete silence from city noise. Bangkok's most peaceful activity.",
    tip: "Best time: early morning (7–9am) before heat and before tour groups. Rent from pier at Bang Nam Phueng floating market side. No previous kayaking experience needed.",
  },
  {
    name: "Khao Yai Waterfall Tubing (Day Trip)",
    emoji: "💧",
    distance: "2.5 hours from Bangkok",
    price: "Tubing tour ฿500–800 including transport",
    duration: "Full day",
    why: "Float through Khao Yai National Park waterways on rubber tubes. Jungle scenery, natural pools, cool water. Best water activity within day-trip range from Bangkok.",
    tip: "Best rainy season (June–October) when water levels are high. Dry season water can be too shallow. Combine with elephant spotting in Khao Yai National Park.",
  },
  {
    name: "Wakeboarding — Ratchada Cable Ski",
    emoji: "🏄",
    distance: "Near Ratchada area / MRT",
    price: "30-min session ฿350–500",
    duration: "30 min per session",
    why: "Bangkok has cable wakeboarding lakes! Overhead cable system pulls you around a course. No boat needed. Beginners welcome. Most popular with local Thai university students.",
    tip: "Wear closed-toe shoes that can get wet, not flip-flops. Wetsuit available for rent (฿100). Don't book on weekends — weekday sessions much less crowded with 15-min wait.",
  },
  {
    name: "Chao Phraya River Swimming Race (Seasonal Event)",
    emoji: "🏊",
    distance: "Chao Phraya River",
    price: "Registration ฿500–1,000",
    duration: "Annual event — October",
    why: "Bangkok's annual Chao Phraya River swimming race — open to public registration. Competitive 2km and 5km swims. Unusual Bangkok experience that most tourists don't know exists.",
    tip: "Check Bangkok's TAT website for annual registration dates. The river is cleaned specifically for this event. Very popular among Thai fitness community.",
  },
];

export function BangkokWaterActivities() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🌊 Bangkok water activities — kayaking, wake, tubing & more
      </div>
      <div className="space-y-2">
        {ACTIVITIES.map((a) => (
          <div key={a.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{a.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{a.distance} · {a.duration}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{a.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{a.why}</div>
            <div className="text-[10px] text-teal-700">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
