const ROUTES = [
  {
    name: "Rattanakosin golden hour walk",
    emoji: "🌅",
    duration: "2–3 hrs",
    start: "6:00am from Tha Tien Pier",
    stops: [
      "Wat Arun from riverside pier — backlit temple at sunrise",
      "Pak Khlong Talat flower market — vivid colors, workers arriving",
      "Grand Palace east wall — monks walking, temple gates",
      "Tha Chang pier — working boats, chaos, real Bangkok",
    ],
    gear: "Wide-angle + telephoto. Tripod optional but useful at sunrise.",
  },
  {
    name: "Chinatown night walk",
    emoji: "🏮",
    duration: "2 hrs",
    start: "7:30pm from MRT Hua Lamphong",
    stops: [
      "Yaowarat Road — neon signs, tuk-tuk motion blur",
      "Talad Noi alley — murals + old shophouse architecture",
      "Chinese temple at night — incense smoke, candlelight",
      "Charoen Krung old buildings — peeling paint, perfect decay",
    ],
    gear: "Fast lens (f/1.8+) essential for low-light. Street photography mindset.",
  },
  {
    name: "Modern BKK contrast shoot",
    emoji: "🌆",
    duration: "Afternoon into evening",
    start: "4pm from Asok BTS",
    stops: [
      "Benjakiti Park lake reflections — skyscrapers in water",
      "Terminal 21 exterior — fake world monuments, street life",
      "Asok intersection — rush hour commuters, BTS trains",
      "Sukhumvit skyline at dusk from any rooftop",
    ],
    gear: "50mm street photography lens. ND filter for long exposures.",
  },
];

export function BangkokPhotographySpots() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📷 Bangkok photography walks — curated routes
      </h2>
      <div className="space-y-3">
        {ROUTES.map((r) => (
          <div key={r.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">{r.emoji}</span>
              <div>
                <h3 className="font-bold text-xs">{r.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">🕐 {r.duration} · Start: {r.start}</div>
              </div>
            </div>
            <div className="space-y-0.5 mb-1.5">
              {r.stops.map((s) => (
                <div key={s} className="text-[10px] flex gap-1.5 items-start">
                  <span className="shrink-0 text-purple-500">▸</span>
                  <span className="text-[var(--fg)]">{s}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-blue-600">📸 Gear: {r.gear}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
