const MUSEUMS = [
  {
    name: "Jim Thompson House",
    emoji: "🏛️",
    area: "National Stadium (BTS)",
    admission: "฿200 (student ฿100)",
    hours: "10am–6pm daily",
    why: "6 traditional Thai teak houses + legendary silk designer's art collection. Most visited private museum in Thailand.",
    timeNeeded: "1 hr",
    tip: "Guided tours every 20 min included in ticket. Secret garden behind the house is underrated.",
  },
  {
    name: "Museum Siam (Museum of Siam)",
    emoji: "🇹🇭",
    area: "Rattanakosin Island (Sanam Chai MRT)",
    admission: "฿100",
    hours: "Tue–Sun 10am–6pm",
    why: "Interactive exploration of Thai identity — who is 'Thai'? Multimedia + hands-on exhibits in English. Surprisingly modern.",
    timeNeeded: "1.5–2 hrs",
    tip: "Best museum in Bangkok for understanding Thai culture. Totally underrated. Skip Madame Tussauds and come here.",
  },
  {
    name: "MOCA Bangkok (Museum of Contemporary Art)",
    emoji: "🎨",
    area: "Chatuchak (Mo Chit BTS)",
    admission: "฿260 weekdays / ฿360 weekends",
    hours: "Tue–Fri 10am–5pm, Sat–Sun 11am–6pm",
    why: "5 floors of Thai contemporary art + international artists. Quiet, air-conditioned, genuinely impressive collection.",
    timeNeeded: "2–3 hrs",
    tip: "Combine with nearby Chatuchak Weekend Market (open Sat–Sun) for a full day out.",
  },
  {
    name: "National Museum Bangkok",
    emoji: "🏺",
    area: "Rattanakosin (Sanam Chai MRT)",
    admission: "฿200",
    hours: "Wed–Sun 9am–4pm",
    why: "Thailand's largest and oldest museum. Buddha collection + royal regalia + history of Thai kingdoms from Sukhothai onward.",
    timeNeeded: "2–4 hrs",
    tip: "English-speaking guided tours Wed & Thu 9:30am (free, donation welcome). Must-book — limited space.",
  },
  {
    name: "Bangkok Art & Culture Centre (BACC)",
    emoji: "🖼️",
    area: "Siam (BTS Siam)",
    admission: "Free",
    hours: "Tue–Sun 10:30am–9pm",
    why: "Free contemporary art across multiple floors. Rotating exhibitions + small galleries + café. Steps from Siam BTS.",
    timeNeeded: "1–2 hrs",
    tip: "Great free alternative on a rainy day. Art quality varies by exhibition — check their IG first.",
  },
];

export function BangkokMuseumGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🏛️ Bangkok museums — ranked & reviewed
      </h2>
      <div className="space-y-2">
        {MUSEUMS.map((m) => (
          <div key={m.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{m.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {m.area} · {m.hours}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[11px] font-mono font-black text-green-700">{m.admission}</div>
                <div className="text-[9px] text-[var(--muted)]">{m.timeNeeded}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{m.why}</div>
            <div className="text-[10px] text-orange-600">💡 {m.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
