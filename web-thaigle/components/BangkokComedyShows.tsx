const SHOWS = [
  {
    name: "Magner's Comedy Night at WTF Gallery",
    emoji: "🎭",
    area: "Sukhumvit Soi 51",
    price: "฿200–350 (includes first drink)",
    schedule: "Monthly (check Bangkok101 or Facebook for dates)",
    why: "Bangkok's longest-running English stand-up comedy night. Mix of expat and local comics. Intimate gallery setting — about 80 seats. Audience interaction expected.",
    tip: "Arrive early — venue fills fast. Front row seats have most interaction risk (or most fun depending on personality). Comics range from open-mic to touring professionals.",
  },
  {
    name: "Comedy at Craft Bangkok",
    emoji: "🍺",
    area: "Sukhumvit Soi 23",
    price: "Free entry (drink minimum ฿200)",
    schedule: "Bi-weekly Thursdays",
    why: "Open-mic comedy at the craft beer bar. Casual atmosphere — locals and expats mixing. Some nights have touring UK/Australian comics, some nights local talent. Always unexpected.",
    tip: "Best nights are when touring comics headline + local openers. Check Craft Bangkok Instagram for 'headliner' shows vs pure open-mic nights.",
  },
  {
    name: "Transvestite Cabaret Shows (Calypso)",
    emoji: "💃",
    area: "ASIATIQUE Riverfront",
    price: "Adults ฿900–1,200 (includes soft drink)",
    schedule: "Nightly shows 8pm and 9:30pm",
    why: "Not stand-up comedy but Bangkok's most unique theatrical entertainment. World-class performers, stunning costumes, Whitney Houston–to–Lady Gaga production numbers. Genuinely funny hosts.",
    tip: "One of Bangkok's 'must-do' tourist experiences. 90-minute show. English-language commentary throughout. Book online for ฿100 discount. Dress casual.",
  },
];

export function BangkokComedyShows() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🎭 Comedy & live entertainment in Bangkok
      </div>
      <div className="space-y-2">
        {SHOWS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.schedule}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
