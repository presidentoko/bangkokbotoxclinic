const SHOWS = [
  {
    name: "Calypso Cabaret (Asiatique)",
    emoji: "💃",
    location: "Asiatique The Riverfront, Charoen Krung",
    price: "Regular ฿900, VIP ฿1,200",
    duration: "70-minute show",
    why: "Bangkok's longest-running cabaret show (40+ years). Performed by Thailand's acclaimed 'katoey' (transgender) performers. Stunning costumes, international-standard performance. Very tourist-friendly, English/Thai/Japanese subtitles.",
    tip: "Book online for guaranteed seats. VIP includes slightly better seating + pre-show drink. Shows run 7:30pm and 9pm daily. Arrive 30 minutes early for costume photos. The performers welcome photos — just ask.",
  },
  {
    name: "Mambo Cabaret Show (Victory Monument)",
    emoji: "🌟",
    location: "New Phetchaburi Rd, near Victory Monument",
    price: "Regular ฿700, VIP ฿1,100",
    duration: "80-minute show",
    why: "More local, less polished than Calypso but more genuine. Beloved by Thai locals. More traditional Thai performance elements mixed with international pop. Good if you want something less 'touristy' feeling.",
    tip: "Cash preferred for tickets. Smaller venue = more intimate. No English subtitles so language less critical — performance art speaks universally. Mid-week shows less crowded.",
  },
  {
    name: "Dream World Fantasy Theatre",
    emoji: "🎭",
    location: "Dream World Theme Park, Rangsit area",
    price: "Included in park entry ฿350",
    duration: "45-minute show",
    why: "Shorter, family-friendly cabaret as part of the larger Dream World theme park. Less adult-oriented than Calypso. Good option if visiting with children who are curious about Thai performance arts.",
    tip: "Best for visitors who already plan to visit Dream World. Not worth the trip alone for the show. Combines well with a day at the park for families.",
  },
];

const CONTEXT = [
  "Katoey (Thai: กะเทย) = transgender women in Thai culture — not a slur in Thai context",
  "Thai society is generally accepting — cabaret is mainstream entertainment, not underground",
  "Many performers trained at performing arts institutes alongside cisgender performers",
  "Photography during shows is usually allowed — some theatres have no-flash rules",
  "Tipping performers after the show is appreciated but not obligatory",
];

export function BangkokCabaret() {
  return (
    <div className="rounded-2xl border border-fuchsia-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-fuchsia-700 mb-3">
        🌟 Bangkok cabaret shows — Thailand's world-famous performance art
      </h2>
      <div className="space-y-2 mb-3">
        {SHOWS.map((s) => (
          <div key={s.name} className="border border-fuchsia-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.duration} · {s.location}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-fuchsia-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-fuchsia-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-fuchsia-700 hover:bg-fuchsia-50">
          Cultural context — understanding Thai cabaret
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {CONTEXT.map((c) => (
            <li key={c} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-fuchsia-400 shrink-0">•</span>{c}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
