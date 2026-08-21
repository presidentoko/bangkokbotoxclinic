const SPOTS = [
  {
    name: "Science Museum Observatory — National Science Museum",
    emoji: "🔭",
    area: "National Science Museum, Pathum Thani (30 minutes north of Bangkok)",
    price: "Museum entry ฿100–200; Stargazing nights free with museum admission",
    why: "Thailand's National Science Museum (NSM) in Pathum Thani operates a public observatory with telescopes and regular stargazing events — the most accessible astronomy facility near Bangkok. While Bangkok's light pollution is severe (among the world's worst for stargazing), the NSM organizes structured public nights with telescope viewing of planets (Jupiter, Saturn ring viewing is reliable for any telescope) and the Moon. Thai astronomy culture has institutional depth — the National Astronomical Research Institute of Thailand (NARIT) runs public education programs and hosts astronomy clubs throughout the country.",
    tip: "NSM stargazing events: check the NSM website for scheduled public observation nights — these happen monthly around new moon (darkest conditions). What to see near Bangkok: planets are visible even with significant light pollution — Jupiter's cloud bands and moons, Saturn's rings, Mars during oppositions are reliable telescope objects. The Moon (especially near quarter phases showing shadow definition) is the most dramatic amateur telescope view. For serious stargazing: travel at least 100–150km from Bangkok — Kanchanaburi Province's rural areas, Khao Yai, and Pranburi coast near Gulf areas provide dramatically darker skies.",
  },
  {
    name: "Dark Sky Escapes from Bangkok",
    emoji: "🌌",
    area: "Khao Yai National Park (2.5h), Kanchanaburi rural areas (2.5h), Chanthaburi coast (3h)",
    price: "Accommodation from ฿500–3,000/night; Transport ฿500–1,500",
    why: "Within 3 hours of Bangkok, several dark sky locations allow genuine Milky Way viewing on clear moonless nights. Khao Yai National Park (UNESCO World Heritage Site, 2.5 hours from Bangkok) has park-interior areas with significantly reduced light pollution — the park's grasslands offer open sky views. Kanchanaburi's rural areas north of the Death Railway town have very dark skies accessible at farmstay and eco-lodge accommodations. The Gulf of Thailand coast near Chanthaburi and Trat provides beach stargazing with good southern horizon views. Thailand's tropical atmosphere (humidity, haze) affects viewing quality — dry season (November–March) offers the clearest nights.",
    tip: "Planning Bangkok dark sky trips: the new moon window (3 days before and after new moon) is the critical timing for Milky Way visibility. Dry season months (November–February) are clearest. Astronomy apps (SkySafari, Sky Map, Stellarium) identify what's visible and when. For Milky Way photography: long exposure (20–30 seconds), wide aperture lens (f/2.8 or wider), ISO 1600–6400, tracking mount for longer exposures. Khao Yai accommodation with dark sky access: some Khao Yai lodges specifically advertise stargazing facilities — worth prioritizing these. The core Milky Way (galactic center) is best viewed in March–October from Thailand; winter months offer Orion and winter constellations.",
  },
  {
    name: "Bangkok Astronomy Club & Amateur Telescope Community",
    emoji: "⭐",
    area: "Club meetups throughout Bangkok; observation trips to provincial dark sites",
    price: "Club membership free–฿500/year; Telescope purchase ฿3,000–100,000+",
    why: "Thailand has active amateur astronomy communities — the Thai Astronomical Society organizes Bangkok-area clubs, regular observation nights, and educational events. The community is welcoming to newcomers and experienced observers alike. Monthly public star parties (organized events at accessible observation sites) provide telescope access without purchasing equipment. Thai amateur astronomers (particularly at major universities — Chulalongkorn, Mahidol, Kasetsart) run active clubs that organize trips to dark sites and transient event observations (meteor showers, eclipses, conjunctions).",
    tip: "Bangkok astronomy community: search Facebook for 'Thai Astronomical Society' and 'Astronomy Thailand' — active groups with regular event announcements. Perseid meteor shower (mid-August) and Geminid meteor shower (mid-December) are reliable annual events requiring no telescope — find any dark hillside and count meteors. For equipment beginners: a pair of 7x50 or 10x50 binoculars reveals dramatically more than naked eye (craters on Moon, Andromeda Galaxy, star clusters) at far lower cost and complexity than a telescope. First telescope recommendation: 130mm reflector or 70mm refractor in ฿3,000–8,000 range is the sweet spot for Bangkok-area visual astronomy.",
  },
];

export function BangkokStargazing() {
  return (
    <div className="rounded-2xl border border-indigo-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-800 mb-3">
        🔭 Stargazing near Bangkok — dark sky escapes, observatory nights & astronomy clubs
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-indigo-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
