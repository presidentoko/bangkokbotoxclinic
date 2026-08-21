const HIGHLIGHTS = [
  {
    name: "Rattanakosin Island (Old Bangkok)",
    emoji: "🏛️",
    era: "1782–present",
    description: "Bangkok's original royal island on a Chao Phraya bend. Rattanakosin-style architecture — brilliant Thai temple spires, mosaic-tiled stupas, gilded shrine halls. Grand Palace, Wat Pho, Wat Phra Kaew, Sanam Luang, Lak Muang. The architectural DNA of Thai civilization.",
    must_see: "Wat Pho's giant reclining Buddha (46m long), Grand Palace's emerald Buddha, Wat Arun's porcelain-tiled prang from the river",
  },
  {
    name: "Charoen Krung (Old Foreign Quarter)",
    emoji: "🏚️",
    era: "1850s–1960s",
    description: "Bangkok's oldest road, lined with colonial-era trading houses, Portuguese churches, Chinese shop-houses, and early Art Deco cinema facades. The architecture tells 150 years of Bangkok's cosmopolitan history. Several buildings restored as galleries and restaurants.",
    must_see: "The Portuguese Embassy compound, Assumption Cathedral (1821), River City's colonial warehouse, WAREHOUSE 30 industrial repurposing",
  },
  {
    name: "Silom / Sathorn (Modernist Bangkok)",
    emoji: "🏙️",
    era: "1970s–2000s",
    description: "Bangkok's financial district showcases mid-century modernist glass towers alongside preserved Art Deco buildings. State Tower (now Lebua), Silom Complex, Robot Building (UOB) — one of the world's most unusual corporate buildings (literally shaped like a robot). Fascinating period modernism.",
    must_see: "Robot Building (UOB Bank building, Silom Road) — designed 1986 by Sumet Jumsai, deliberately robot-shaped with antennae. A must for architecture enthusiasts.",
  },
  {
    name: "Contemporary Bangkok (2000s–present)",
    emoji: "🌃",
    era: "2000–now",
    description: "Bangkok's newest architectural era: ICONSIAM's riverside megamall (2018), Park Ventures Ecoplex (sustainable office), Mahanakhon (78-floor twisted skyscraper + glass floor observation), MahaNakhon CUBE. Thai architects increasingly winning international recognition.",
    must_see: "Mahanakhon Tower observation deck (฿870 — glass floor at 78 floors), ICONSIAM's indoor floating market, the Dhanarak Building's pixelated facade on Ratchadamri",
  },
];

export function BangkokArchitecture() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🏛️ Bangkok architecture tour — from gilded temples to robot buildings
      </h2>
      <div className="space-y-2">
        {HIGHLIGHTS.map((h) => (
          <div key={h.name} className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{h.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{h.era}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{h.description}</div>
            <div className="text-[10px] text-stone-600">👁️ {h.must_see}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
