const TIMELINE = [
  {
    year: "1767",
    event: "Fall of Ayutthaya",
    context: "Burmese army destroys the Ayutthaya kingdom after 417 years. Thailand's capital lost. Survivors flee south.",
  },
  {
    year: "1782",
    event: "Bangkok Founded — King Rama I",
    context: "King Rama I (Chakri dynasty) establishes Bangkok (Rattanakosin) as the new capital. Grand Palace and first temples built on the east bank of Chao Phraya River.",
  },
  {
    year: "1851–1868",
    event: "Modernization under Rama IV",
    context: "King Mongkut (inspiration for 'The King and I') opens Thailand to the West. First road paved, first English-language treaties signed.",
  },
  {
    year: "1868–1910",
    event: "Rama V — Thailand stays independent",
    context: "King Chulalongkorn modernizes the nation — railways, telegraph, schools. Sole Southeast Asian nation to avoid European colonization by playing British and French against each other.",
  },
  {
    year: "1932",
    event: "Constitutional Monarchy",
    context: "Bloodless revolution ends absolute monarchy. Thailand becomes constitutional monarchy — still continues today.",
  },
  {
    year: "1945–1970s",
    event: "Post-war economic growth",
    context: "US military presence during Vietnam War boosts Bangkok's economy. Sukhumvit Road builds out. International hotels arrive.",
  },
  {
    year: "1997",
    event: "Asian Financial Crisis",
    context: "Thai baht collapses — 50% devaluation. Deep economic shock. Marks end of Thailand's 'Asian Tiger' boom.",
  },
  {
    year: "2006–present",
    event: "Political instability cycles",
    context: "Multiple coups (2006, 2014) and political crises. Bangkok experiences Red Shirt/Yellow Shirt street protests. Constitutional democracy gradually restores.",
  },
];

export function BangkokHistoryGuide() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🏛️ Bangkok history — key moments in 10 minutes
      </h2>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-amber-200" />
        <div className="space-y-3">
          {TIMELINE.map((t) => (
            <div key={t.year} className="flex gap-4 items-start pl-2">
              <div className="shrink-0 w-10 h-10 rounded-full border-2 border-amber-300 bg-amber-50 flex items-center justify-center z-10">
                <span className="text-[8px] font-black text-amber-700 text-center leading-none">{t.year}</span>
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <div className="font-bold text-xs">{t.event}</div>
                <div className="text-[10px] text-[var(--muted)] leading-snug mt-0.5">{t.context}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
