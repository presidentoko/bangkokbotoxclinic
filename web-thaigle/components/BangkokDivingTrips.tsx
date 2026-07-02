const DESTINATIONS = [
  {
    dest: "Pattaya",
    emoji: "🤿",
    km: "147km from Bangkok (2 hrs)",
    visibility: "3–15m (best Nov–May)",
    highlights: ["HTMS Khram wreck", "Samaesan Hole", "Ko Man Wichai"],
    coursePrice: "OW course ฿9,500–14,000",
    dayTrip: "Discovery dive from ฿2,500",
    tip: "Bangkok's closest dive site. Murky at surface but good below 10m. Easier to learn than Samui.",
  },
  {
    dest: "Koh Tao",
    emoji: "🐠",
    km: "595km south (night train + ferry, 8hrs)",
    visibility: "15–30m",
    highlights: ["Sail Rock — best dive in Gulf of Thailand", "Chumphon Pinnacle (whale sharks possible)", "White Rock"],
    coursePrice: "Cheapest OW in Thailand: ฿8,000–11,000",
    dayTrip: "Daily dive trips ฿1,500",
    tip: "Most popular place to learn diving in SE Asia. Very social island. Budget-friendly.",
  },
  {
    dest: "Similan Islands",
    emoji: "🌊",
    km: "650km south (flight to Phuket + speed boat, 5hrs)",
    visibility: "20–40m",
    highlights: ["Christmas Point (huge manta rays)", "Elephant Head Rock", "Richelieu Rock (whale shark mecca)"],
    coursePrice: "Liveaboard from ฿18,000 (3 days)",
    dayTrip: "Day trip from Khao Lak ฿3,500",
    tip: "Only open Nov–May. Thailand's best diving, bar none. Worth the journey.",
  },
];

export function BangkokDivingTrips() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🤿 Diving from Bangkok — best options
      </div>
      <div className="space-y-3">
        {DESTINATIONS.map((d) => (
          <div key={d.dest} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">{d.emoji}</span>
              <div>
                <div className="font-bold text-xs">{d.dest}</div>
                <div className="text-[10px] text-[var(--muted)]">{d.km} · Visibility {d.visibility}</div>
              </div>
            </div>
            <div className="space-y-0.5 mb-1">
              {d.highlights.map((h) => (
                <div key={h} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-blue-500">▸</span>{h}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-green-700 mb-0.5">{d.coursePrice} · Day trip: {d.dayTrip}</div>
            <div className="text-[10px] text-orange-600">💡 {d.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
