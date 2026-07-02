const GEMS = [
  {
    name: "Bangkrachao — Bangkok's Green Lung",
    emoji: "🌿",
    area: "30 min from center via public boat",
    why: "An island within Bangkok's Chao Phraya loop. Car-free, covered in mangroves and tropical gardens. Locals commute by bicycle. The contrast with surrounding Bangkok chaos is striking. Floating markets, community temples, lotus ponds.",
    insider: "Take BTS to Bang Na, then Grab to Klong Toei Pier, passenger boat to Bangkrachao. Rent bicycle (฿60–120/day) and get lost. The lotus pond on the west side at sunrise is unreal.",
  },
  {
    name: "Nang Lerng Market (Hidden 1920s Quarter)",
    emoji: "🏚️",
    area: "Near Democracy Monument, Old City",
    why: "A 100-year-old market neighborhood that hasn't changed since the 1920s. Wooden shophouses, old-school hawker food, shrine opera performances on weekends. Bangkok's most authentic preserved neighborhood that tourists almost never visit.",
    insider: "Sunday afternoons: a small shrine sometimes hosts traditional Thai opera (likay) performances — completely spontaneous and crowd of elderly Thai neighbors watching. Finding this is a genuine Bangkok moment.",
  },
  {
    name: "Talad Neon Night Market (Local)",
    emoji: "🌃",
    area: "Ratchayothin area, north Bangkok",
    why: "Weekend night market used primarily by Thai university students. Fashion, street food, live music — all at a fraction of tourist market prices. Very young, very Thai, very photogenic. Almost entirely in Thai but navigable by browsing.",
    insider: "Come after 8pm when the music acts start. The food court has one of Bangkok's best collections of regional Thai food (Isaan, Northern, Southern specialties). No tourist pricing because tourists don't know about it yet.",
  },
  {
    name: "Makkasan Rail Yard",
    emoji: "🚂",
    area: "Phetchaburi area, near Airport Rail Link",
    why: "Massive abandoned rail yard with vintage Thai trains, overgrown vegetation, and no tourist infrastructure. Urban explorers and photographers have discovered it in recent years. Eerie, beautiful, photogenic. Access via a community area near the rail.",
    insider: "Not official tourist site — no entry fee, no guided tour, no facilities. Walk along the edge of the yard (public area) to view old carriages. Early morning (7–9am) when light is low creates dramatic photography. Bring mosquito spray.",
  },
  {
    name: "Wat Ratchanatdaram (Loha Prasat)",
    emoji: "🔔",
    area: "Between Khaosan Road and Democracy Monument",
    why: "Metal Castle Temple — only the third of its kind in history (others in India and Sri Lanka). 37 metal spires rising from a stepped base. Usually overlooked next to famous nearby temples. Interior has 37 chambers representing Buddhist concepts.",
    insider: "Entry is free, almost never crowded. Best photographed from the street opposite (metal spires frame perfectly). Inside, climb to the upper levels for views of Old Bangkok. Tuesday evenings: monks chant — haunting, beautiful, and open to observe respectfully.",
  },
];

export function BangkokHiddenGems() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        💎 Bangkok hidden gems — places most tourists never discover
      </div>
      <div className="space-y-2">
        {GEMS.map((g) => (
          <div key={g.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.area}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-teal-700">🔍 {g.insider}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
