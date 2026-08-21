const SPOTS = [
  {
    name: "Chao Phraya River (Asiatique & Tha Phra Chan)",
    emoji: "🌕",
    area: "Asiatique Riverfront & Old City pier areas",
    why: "The Chao Phraya River is Loy Krathong's heart. Thousands of krathong (banana leaf float offerings) released on the river. Asiatique holds a floating festival. Old City piers (Tha Phra Chan, Tha Chang) are most atmospheric — thousands of Thais releasing floats.",
    tip: "Arrive by 6pm for best spots. Bring banana leaf krathong (purchased for ฿50–150 from vendors). Place candle and incense, make a wish, release. Biodegradable banana leaf floats only — plastic or foam floats are banned.",
  },
  {
    name: "Sukhothai (4 hours — historical epicenter)",
    emoji: "🕯️",
    area: "Sukhothai Province — bus or flight from Bangkok",
    why: "Loy Krathong originated in Sukhothai 700+ years ago. The festival in the ancient city ruins (illuminated at night) is the most atmospheric experience in Thailand. Candlelit ruins + river floats + fireworks over ancient temples.",
    tip: "Book Sukhothai accommodation 3–4 months ahead for Loy Krathong week. Overnight bus from Northern Bus Terminal or AirAsia flight (฿800–1,500). The main ceremony on Ramkhamhaeng Road is free. The 3-day festival is worth the trip from Bangkok.",
  },
  {
    name: "Lumphini Park",
    emoji: "🌸",
    area: "Lumpini Park, Silom area",
    why: "Bangkok's central park celebration. Large krathong-making area, cultural performances on stage, Thai food village, and the main lake for releasing krathong. Family-friendly, easier to access than riverside crowd. Lantern releases here too.",
    tip: "Arrive before dark for krathong-making activity (free or ฿30 materials fee). Park closes midnight on Loy Krathong night. Bangkok residents who avoid the riverside crowd come here — more Thai locals than tourists.",
  },
];

const MEANING = [
  "Loy = float / Krathong = small banana leaf boat",
  "Festival honors the water spirits and the River Goddess Mae Khongkha",
  "Releasing a krathong symbolizes letting go of grudges, bad luck, and past mistakes",
  "The candle represents Buddha. Incense smoke carries wishes to spirits",
  "Full moon of the 12th lunar month (usually November) — the river is at its highest",
  "In Chiang Mai, sky lanterns (khom loi) are released — different regional tradition",
];

export function BangkokLoyKrathong() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🌕 Loy Krathong Bangkok — Thailand's most beautiful festival guide
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-yellow-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-yellow-700 hover:bg-yellow-50">
          What Loy Krathong means
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {MEANING.map((m) => (
            <li key={m} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-yellow-400 shrink-0">•</span>{m}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
