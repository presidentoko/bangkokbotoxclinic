const STYLES = [
  {
    style: "Latin (Salsa & Bachata)",
    emoji: "💃",
    studios: ["Bangkok Salsa Club (Ekkamai) — largest Latin community, multiple levels", "La Milonga (Sukhumvit 22) — Argentine tango specialists", "Salsa Saturdays at various clubs: Onyx, Levels"],
    price: "Group class ฿400–600, private lesson ฿800–1,500/hour",
    why: "Bangkok has a surprisingly vibrant Latin dance community. Regular social dancing (milongas for tango, social nights for salsa) — not just lessons. International and Thai dancers mix.",
    tip: "First Latin class: salsa is most beginner-friendly, bachata second. Wear leather-soled shoes or bring extra pair. Social nights are free to attend as a watcher — good to see before committing.",
  },
  {
    style: "Traditional Thai Dance (Khon/Fon Leb)",
    emoji: "🎭",
    studios: ["Bangkok Khon Art Center (Old Bangkok)", "Thai Cultural Center workshops", "Traditional dance at Siam Niramit (monthly schedule)"],
    price: "Workshop ฿500–1,200",
    why: "Khon is Thailand's royal masked dance-drama — UNESCO-listed as intangible cultural heritage. Fon Leb is northern Thai fingernail dance. Both use elaborate costumes and precise hand movements.",
    tip: "Tourist-friendly workshops at Siam Niramit Cultural Complex monthly. Full Khon costumes provided for photos. Longer courses at Thai Cultural Center for serious study.",
  },
  {
    style: "K-Pop (Idol-style) Dance",
    emoji: "🎤",
    studios: ["Dance Now Studio (Asok) — BTS/Blackpink routine classes", "Stage Art Studio (Ekkamai)", "OHPAMA Dance Studio (Siam area)"],
    price: "Group class ฿400–700, monthly membership ฿2,000–4,000",
    why: "Bangkok's K-pop dance scene is enormous — thousands of Thai fans learning idol choreography. Many studios taught by certified Korean instructors. All skill levels welcomed.",
    tip: "Intro class typically covers one song or one verse of popular K-pop choreography. Blackpink, aespa, and NewJeans routines always available. Thai K-pop community is welcoming to foreigners.",
  },
];

export function BangkokDanceLessons() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💃 Dance classes in Bangkok — salsa, traditional Thai & K-pop
      </h2>
      <div className="space-y-2">
        {STYLES.map((s) => (
          <details key={s.style} className="border border-pink-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-pink-50 transition">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.style}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-pink-100 pt-2 space-y-1.5">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{s.why}</div>
              <ul className="space-y-0.5">
                {s.studios.map((studio) => (
                  <li key={studio} className="text-[10px] text-pink-700 flex items-start gap-1.5">
                    <span className="shrink-0">•</span>{studio}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
