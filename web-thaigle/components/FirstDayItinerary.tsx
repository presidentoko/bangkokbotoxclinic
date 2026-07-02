const SCHEDULE = [
  { time: "7:00 am", emoji: "🌅", activity: "Sunrise at Wat Arun", tip: "Cross from Tha Tien pier — ฿4 each way. Done by 8:30 to beat tourist crowds.", cost: "฿4 boat" },
  { time: "9:00 am", emoji: "☕", activity: "Breakfast in Phra Nakhon", tip: "Shoshana Garden or Roti Mataba — local dishes under ฿80. Walk distance from Wat Arun.", cost: "฿50–80" },
  { time: "10:30 am", emoji: "🏛️", activity: "Wat Pho (Temple of the Reclining Buddha)", tip: "฿200 entry includes a free water bottle. Spend 45–60min.", cost: "฿200" },
  { time: "12:30 pm", emoji: "🍜", activity: "Lunch at Or Tor Kor Market", tip: "BTS to Mo Chit. Best fresh market food in Bangkok — locals only, no tourist markup.", cost: "฿60–120" },
  { time: "2:30 pm", emoji: "💆", activity: "Thai massage (Wat Pho school)", tip: "1 hour traditional massage ฿420. Book at the temple school — government certified.", cost: "฿420" },
  { time: "5:00 pm", emoji: "🛺", activity: "Grab to Chatuchak (if weekend) or Asiatique", tip: "Weekend only: Chatuchak market closes at 6pm. Asiatique riverfront open evenings daily.", cost: "฿80–120 Grab" },
  { time: "8:00 pm", emoji: "🌃", activity: "Rooftop or street food dinner", tip: "Budget: Sukhumvit Soi 38 (street). Mid: Octave Rooftop — free entry, buy 1 drink.", cost: "฿150–600" },
];

export function FirstDayItinerary() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
        📅 Your first 24 hours in Bangkok
      </div>
      <div className="space-y-3">
        {SCHEDULE.map((s, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="shrink-0 text-center min-w-[56px]">
              <div className="text-[11px] font-black text-[var(--muted)]">{s.time}</div>
              <div className="text-xl leading-tight mt-0.5">{s.emoji}</div>
            </div>
            <div className="flex-1 min-w-0 pb-3 border-b border-[var(--border)] last:border-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-xs text-[var(--fg)]">{s.activity}</div>
                <span className="shrink-0 text-[10px] text-green-700 bg-green-100 font-bold px-1.5 py-0.5 rounded">{s.cost}</span>
              </div>
              <div className="text-[11px] text-[var(--muted)] leading-snug mt-0.5">{s.tip}</div>
            </div>
          </div>
        ))}
      </div>
      <a
        href="/day-plan"
        className="mt-4 block text-center text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-full py-1.5 hover:bg-orange-100 transition"
      >
        Build your full Bangkok day plan →
      </a>
    </div>
  );
}
