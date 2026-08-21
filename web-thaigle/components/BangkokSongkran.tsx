const SPOTS = [
  {
    name: "Silom Road (Epicenter)",
    emoji: "💦",
    area: "Silom / Bangrak",
    vibe: "Huge international crowd, party atmosphere",
    why: "Bangkok's biggest and most famous Songkran street party. Silom Road closes to traffic April 13–15. Massive water battles from noon to midnight. International tourists mix with Thai locals. DJ stages, foam parties, water trucks.",
    tip: "Buy a super-soaker water gun (฿150–300) from Chatuchak or convenience stores before April 13. Wear shoes you can get soaking wet. Waterproof bag or waterproof phone case essential — electronics will get soaked.",
  },
  {
    name: "Khao San Road Water Festival",
    emoji: "🎉",
    area: "Khaosan Road, Banglamphu",
    vibe: "Backpacker + international crowd",
    why: "Khaosan Road's version of Songkran is more backpacker-friendly. Smaller but more approachable. Mix of Thai students and foreign travelers. Street food, beer garden, water gun battles. Better for solo travelers who want to make friends.",
    tip: "Khaosan Songkran starts April 12–15, peaks April 13. The water battles are intense but the crowd is friendly and English-friendly. Storage lockers at Phra Arthit pier (฿50/hour) for valuables.",
  },
  {
    name: "Sanam Luang Traditional Ceremony",
    emoji: "🙏",
    area: "Sanam Luang, next to Grand Palace",
    vibe: "Cultural, ceremonial, Thai locals",
    why: "The authentic cultural side of Songkran. Merit-making ceremonies, Buddha image procession, sand stupas, traditional Thai New Year activities. Less water, more culture. See how Thai families actually celebrate.",
    tip: "April 13 morning (7–10am) is the royal ceremony — arrive early. This is the respectful Buddhist tradition side of Songkran. Dress modestly (no soaking wet clothes). Good for photography of authentic Thai culture.",
  },
];

const RULES = [
  "Alcohol consumption in public water-battle zones is allowed (unique exception in Thai law during Songkran)",
  "No talcum powder throwing — irritates eyes and was banned in Bangkok after injuries",
  "Don't soak monks, elderly people, or those not participating",
  "Water battles end at midnight — late night is regular nightlife",
  "Taxis during Songkran charge 50–100% premium. Use BTS (Skytrain) instead",
  "Most businesses close April 13–15 — stock up on water, sunscreen, food before",
];

export function BangkokSongkran() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        💦 Bangkok Songkran (Thai New Year) — best spots + survival guide
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.vibe} · {s.area}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-cyan-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-cyan-700 hover:bg-cyan-50">
          Songkran rules & etiquette
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {RULES.map((r) => (
            <li key={r} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-cyan-400 shrink-0">•</span>{r}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
