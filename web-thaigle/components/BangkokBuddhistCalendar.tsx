const EVENTS = [
  { month: "Jan", event: "Makha Bucha", desc: "Buddhist holy day. Candle processions at temples. Alcohol banned at some venues." },
  { month: "Feb", event: "Chinese New Year", desc: "Chinatown shuts down for celebrations. 3-day festival. Best dragon dances in SE Asia." },
  { month: "Apr", event: "Songkran (Thai New Year)", desc: "Biggest water festival in Asia. Apr 13–15. Streets become giant water fights. Everything shuts 2–3 days." },
  { month: "May", event: "Visakha Bucha", desc: "Most important Buddhist day. Candle processions, temple visits. Alcohol sales restricted." },
  { month: "May", event: "Royal Ploughing Ceremony", desc: "Ancient Brahmin ritual at Sanam Luang near Grand Palace. Free to watch. Predicts harvest." },
  { month: "Jul", event: "Asanha Bucha + Buddhist Lent start", desc: "Monks begin 3-month rain retreat. Alcohol restricted at some outlets." },
  { month: "Oct", event: "Vegetarian Festival (J Festival)", desc: "10-day Chinese-Thai vegetarian festival. White clothing, amazing vegan street food in Chinatown." },
  { month: "Oct", event: "Ok Phansa (End of Lent)", desc: "Monks emerge from retreat. Boat races on Chao Phraya. Spectacle at many temples." },
  { month: "Nov", event: "Loy Krathong", desc: "Full moon floating of decorated baskets (krathong) on rivers + canals. Sky lanterns (Yi Peng) in the north. Most romantic Thai festival." },
  { month: "Dec", event: "Father's Day / King's Birthday", desc: "Dec 5. Royal celebrations, lights along Ratchadamnoen Avenue. Buddhist ceremonies at temples." },
];

const CURRENT_MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][new Date().getMonth()];

export function BangkokBuddhistCalendar() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🪔 Bangkok Buddhist & cultural calendar
      </div>
      <div className="space-y-1.5">
        {EVENTS.map((e) => (
          <div key={`${e.month}-${e.event}`} className={`flex gap-2 items-start rounded-xl px-3 py-2 border ${e.month === CURRENT_MONTH_SHORT ? "border-orange-400 bg-orange-50" : "border-yellow-100"}`}>
            <div className={`shrink-0 text-[10px] font-black w-8 text-center ${e.month === CURRENT_MONTH_SHORT ? "text-orange-700" : "text-yellow-700"}`}>{e.month}</div>
            <div>
              <div className={`text-[11px] font-bold ${e.month === CURRENT_MONTH_SHORT ? "text-orange-700" : "text-[var(--fg)]"}`}>
                {e.event}{e.month === CURRENT_MONTH_SHORT ? " ← THIS MONTH" : ""}
              </div>
              <div className="text-[10px] text-[var(--muted)] leading-snug">{e.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
