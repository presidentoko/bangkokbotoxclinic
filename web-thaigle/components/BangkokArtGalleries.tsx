const GALLERIES = [
  {
    name: "Bangkok Art & Culture Centre (BACC)",
    emoji: "🏛️",
    area: "National Stadium BTS (Siam)",
    admission: "FREE",
    hours: "Tue–Sun 10am–9pm",
    type: "Contemporary / mixed media",
    highlight: "8 floors of rotating exhibitions. Major Thai contemporary artists. Architecture itself is worth visiting.",
    tip: "First floor atrium hosts community events most evenings. Check bacc.or.th for upcoming exhibitions.",
  },
  {
    name: "100 Tonson Foundation",
    emoji: "🎭",
    area: "Lang Suan / Lumphini",
    admission: "FREE (ticketed for special shows)",
    hours: "Tue–Sat 10am–6pm",
    type: "Contemporary fine art",
    highlight: "Best private gallery in Thailand. Southeast Asian and international artists. Publication library on site.",
    tip: "Small space — 45-minute visit is sufficient. No photography inside.",
  },
  {
    name: "Speedy Grandma",
    emoji: "⚡",
    area: "Charoen Krung (near Saphan Taksin)",
    admission: "฿100–200 for ticketed shows",
    hours: "Wed–Sun 12pm–7pm",
    type: "Emerging / experimental",
    highlight: "Most cutting-edge space. Bangkok's underground art scene. Performances, installations, zines.",
    tip: "Follow their Instagram for pop-up show announcements. Very creative community space.",
  },
  {
    name: "Nova Contemporary",
    emoji: "🌊",
    area: "Siam Square Soi 11",
    admission: "฿200 (varies by show)",
    hours: "Tue–Sun 11am–7pm",
    type: "Contemporary Southeast Asian",
    highlight: "Major regional artists. Excellent curation. Between-gallery café. Art books and prints for sale.",
    tip: "Opening night events are the best — Wednesday 6–8pm usually has artist talks.",
  },
];

export function BangkokArtGalleries() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎨 Bangkok art galleries — where to see Thai contemporary art
      </div>
      <div className="space-y-2">
        {GALLERIES.map((g) => (
          <div key={g.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.type} · {g.area} · {g.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{g.admission}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.highlight}</div>
            <div className="text-[10px] text-orange-600">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
