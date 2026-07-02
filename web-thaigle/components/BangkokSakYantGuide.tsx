const FACTS = [
  {
    title: "What is Sak Yant (สักยันต์)?",
    emoji: "🪄",
    desc: "Sak Yant is Thailand's sacred tattooing tradition. 'Sak' = tattoo, 'Yant' = sacred geometric diagram (yantra). Practitioners are either Buddhist monks or ajarns (lay masters). The tattoo is traditionally done with a metal rod (khem sak) dipped in ink, hand-tapped into the skin.",
    note: "Every design has specific meaning: protection, luck, strength, love. The ajarn chooses the design based on your personality and needs.",
  },
  {
    title: "Where to get an authentic Sak Yant",
    emoji: "⛩️",
    desc: "Two main types: temple monks (free, bring offerings: incense, candles, flowers worth ฿40–60) or professional ajarns (paid: ฿1,500–5,000+ depending on size).",
    note: "Most famous: Wat Bang Phra (Nakhon Pathom, 45min from Bangkok) — huge annual Sak Yant festival. Bangkok options: Ajarn Noo Kanpai (Bangkapi area, highly rated, charges ฿1,500+).",
  },
  {
    title: "Sak Yant rules and restrictions",
    emoji: "📜",
    desc: "The tattoo comes with rules (katha) you agree to follow — varies by design but often includes: no speaking ill of others, no harming innocents, behave morally. Some designs have dietary restrictions.",
    note: "Breaking the rules is believed to reverse the tattoo's power. Treat the commitment seriously even as a non-believer — respect the tradition.",
  },
  {
    title: "Dress code and Temple etiquette",
    emoji: "🙏",
    desc: "To visit a temple for Sak Yant: cover shoulders and knees. Bring the offering package (joss sticks 7-8, candles 2, flowers, sometimes tobacco). Bow to the monk before and after.",
    note: "The experience is spiritual, not commercial. Be quiet, respectful. The monk or ajarn may spend 5 minutes blessing or 5 seconds — accept both graciously.",
  },
];

export function BangkokSakYantGuide() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🪄 Sak Yant sacred tattoo guide — Bangkok & Thailand tradition
      </div>
      <div className="space-y-2">
        {FACTS.map((f) => (
          <details key={f.title} className="border border-indigo-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-indigo-50 transition">
              <span className="text-2xl shrink-0">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{f.title}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-indigo-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{f.desc}</div>
              <div className="text-[10px] text-indigo-700">📌 {f.note}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
