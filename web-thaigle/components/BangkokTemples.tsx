const TEMPLES = [
  {
    name: "Wat Phra Kaew (Temple of Emerald Buddha)",
    emoji: "💎",
    area: "Grand Palace complex, Na Phra Lan Rd",
    admission: "฿500 (includes Grand Palace)",
    hours: "Daily 8:30am–3:30pm",
    time: "2–3 hours",
    why: "Thailand's most sacred temple. Home to the Emerald Buddha — carved from a single block of jade. Stunning Ramayana murals around entire complex.",
    must: "Arrive 8:30am opening. Wear long pants/shoulders — rental available at gate ฿50.",
    insider: "Wat Pho is a 5-min walk — buy combined route map at gate.",
  },
  {
    name: "Wat Pho (Temple of Reclining Buddha)",
    emoji: "🛕",
    area: "Thai Wang Rd (Maharat Pier)",
    admission: "฿200",
    hours: "Daily 8am–6pm",
    time: "1.5–2 hours",
    why: "Famous for 46m golden reclining Buddha. Also the birthplace of traditional Thai massage — massage school here since 1955.",
    must: "Spend coins in the 108 bowls around Buddha for good luck. Book massage in attached school — cheapest legit massage (฿300/hr).",
    insider: "Exit through back gate toward pier — views of Wat Arun across river are excellent.",
  },
  {
    name: "Wat Arun (Temple of Dawn)",
    emoji: "🌅",
    area: "Arun Amarin Rd (take ferry from Pier 8 for ฿5)",
    admission: "฿100",
    hours: "Daily 8am–6pm",
    time: "1 hour",
    why: "Most photogenic temple in Bangkok. Encrusted with Chinese porcelain tiles that sparkle at dawn/sunset. Can climb the steep central prang.",
    must: "Come at 6am (opens at 8am, so wait) or sunset. Sunset from the river side is legendary.",
    insider: "Climb the steep central prang (stairs 70°) — the view over the river to Bangkok skyline is unmissable.",
  },
  {
    name: "Wat Benchamabophit (Marble Temple)",
    emoji: "⬛",
    area: "Si Ayutthaya Rd (Si Phraya pier, then taxi)",
    admission: "฿20",
    hours: "Daily 8am–5pm",
    time: "30–45 min",
    why: "Stunning white Carrara marble exterior. Less crowded. 52 Buddha images from different eras and countries in surrounding cloister. Very peaceful.",
    must: "Morning (7–9am) monks chant — the sound echoes in the marble courtyard beautifully.",
    insider: "Thai royals historically visited this temple. Much less tourist traffic than other major temples.",
  },
];

export function BangkokTemples() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🛕 Bangkok temples — essential wat guide
      </div>
      <div className="text-[10px] bg-amber-50 rounded-xl p-2.5 mb-3 text-amber-800">
        <strong>Dress code ALL temples:</strong> Shoulders covered, knees covered. Long pants / sarong (rentable at gates). Remove shoes before entering inner halls. No shorts — strict enforcement.
      </div>
      <div className="space-y-2">
        {TEMPLES.map((t) => (
          <details key={t.name} className="border border-amber-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-amber-50 transition">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.area} · {t.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{t.admission}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-amber-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{t.why}</div>
              <div className="text-[10px] text-orange-600">⭐ Must: {t.must}</div>
              <div className="text-[10px] text-amber-700">💡 Insider: {t.insider}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
