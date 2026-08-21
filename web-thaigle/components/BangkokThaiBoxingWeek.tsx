const DAYS = [
  { day: "Day 1 (Mon)", activity: "Morning technique class at Fairtex or Evolve. Basics: stance, jab-cross, roundkick. Soreness starts.", tips: "Arrive 30 min early. Wrap hands yourself or pay ฿20 for help. Bring 1.5L water." },
  { day: "Day 2 (Tue)", activity: "Rest or yoga. Your calves and hips will be on fire. Foot massage session at Wat Pho.", tips: "Don't skip rest. This is when your body adapts. Foot massage ฿420/hr at Wat Pho." },
  { day: "Day 3 (Wed)", activity: "Return to gym. Padwork with trainer (1:1 pads session). Your technique already improves.", tips: "Private pad session ฿500–800/hr. Worth every baht. Trainer corrects your form in real-time." },
  { day: "Day 4 (Thu)", activity: "Morning run along Chao Phraya (5–8km) + evening gym session. Clinch work if comfortable.", tips: "River path: Asiatique to Icon Siam = 4km each way. Most scenic run in Bangkok." },
  { day: "Day 5 (Fri)", activity: "Final technique session. Request 3-minute sparring with trainer at low intensity (ask for 'light sparring').", tips: "Light sparring only — you're a tourist, not preparing for a fight. Most gyms are happy to accommodate." },
  { day: "Day 6 (Sat)", activity: "Watch live Muay Thai at Rajadamnern Stadium (Sat schedule). See how pros apply what you've learned.", tips: "Tickets: ฿1,000–2,000 ringside. Buy direct at stadium. Best seats: 1st-row ringside even-numbered." },
  { day: "Day 7 (Sun)", activity: "Recovery swim or beach day. Chatuchak market in the morning. Take souvenir Muay Thai shorts home.", tips: "Muay Thai shorts at Chatuchak: ฿150–300. Better quality than touristy shops. Bargain 20–30%." },
];

export function BangkokThaiBoxingWeek() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥊 7-day Muay Thai immersion plan
      </h2>
      <div className="space-y-1.5">
        {DAYS.map((d) => (
          <div key={d.day} className="border border-red-100 rounded-xl p-3">
            <div className="font-bold text-[11px] text-red-700 mb-1">{d.day}</div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{d.activity}</div>
            <div className="text-[10px] text-orange-600">💡 {d.tips}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
