const SPOTS = [
  {
    name: "Stargazing Near Bangkok",
    emoji: "🔭",
    area: "Khao Yai National Park (2.5 hours), Kaeng Krachan (2.5 hours), Kanchanaburi (2 hours) — areas with lower light pollution than Bangkok",
    price: "National park entry ฿100–300; Guided astronomy tour ฿1,500–4,000; Telescope rental ฿500–2,000; Dark sky resort stay ฿2,000–8,000/night",
    why: "Bangkok itself has significant light pollution that limits stargazing — the city's sky brightness typically allows only the brightest stars, moon, and planets. However, 2–3 hours from Bangkok, Thailand's national parks and rural areas offer genuinely dark skies where thousands of stars, the Milky Way core (April–October), and deep sky objects become visible. Thailand's tropical latitude (13°N for Bangkok) provides access to southern sky objects rarely visible from Europe or North America, including the southern Milky Way center (directly overhead in July–August), the Southern Cross (visible from Thailand's southern horizon), and numerous southern hemisphere constellations. Khao Yai National Park has established relationships with astronomy tour operators; the park's altitude and distance from cities creates significantly darker skies than Bangkok. For regular astronomy: the National Astronomical Research Institute of Thailand (NARIT) operates a public observatory on Doi Inthanon in the north.",
    tip: "Bangkok stargazing practical approach: (1) Moon phase matters more than location — scheduling observing around new moon (2–3 days before to 2–3 days after) maximizes dark sky potential regardless of location; (2) Bangkok's urban observing targets: even in central Bangkok, the Moon, planets (Jupiter, Saturn, Mars, Venus), and ISS passes are easily visible without escaping light pollution; (3) ISS tracking app (ISS Detector, SpotTheStation) gives Bangkok-specific flyover times — the space station is visible to the naked eye as a fast-moving bright dot across several minutes; (4) The best Bangkok-adjacent dark site for casual visiting: driving 30–40km outside Bangkok on any direction reduces light pollution significantly — a portable small telescope or quality binoculars shows dramatically more than the naked eye even at this distance.",
  },
  {
    name: "Thai Astrology — Horoscope Culture",
    emoji: "✨",
    area: "Temples throughout Bangkok (Wat Phra Kaew, Erawan Shrine, Wat Traimit), astrological consultants near major temples",
    price: "Temple astrological consultation: free–฿500; Professional Thai astrologer: ฿500–3,000/session; Astrological amulets: ฿200–50,000+",
    why: "Thai astrological tradition is deeply embedded in Thai culture — distinct from Western astrology, Thai astrology (Hora Sart) combines Indian Vedic astrology influences, Thai lunar calendar traditions, Chinese influence, and uniquely Thai cosmological elements. Bangkok's temple culture integrates astrological practice actively: fortune tellers (mo doo) operate near major temples, astrological calculations determine auspicious dates for major life events (weddings, business launches, house construction), and annual horoscopes (done on Thai New Year or the solar new year) are routine for millions of Thai people. The Erawan Shrine (BTS Chit Lom) is one of Bangkok's most active sites for merit-making with astrological dimensions — offerings are made by those seeking luck, and Thai astrologers are often present. The Thai astrological calendar year, birth element calculations, and lucky/unlucky day systems are genuinely different knowledge systems from any Western analogue.",
    tip: "Engaging with Thai astrology as a visitor: (1) Fortune tellers at temples use playing cards, face reading, numerology, or Thai star charts — approach with open curiosity rather than skepticism to get the best interaction; (2) Lucky numbers in Thai culture are taken very seriously — lottery purchasing, license plate selection, and business naming all involve astrological/numerological consultation; (3) The Thai Buddhist calendar year (2567 is 2024 CE) reflects the Buddhist Era dating system; (4) Amulets (phra kreung): Bangkok's amulet market near Wat Mahathat is one of the world's most remarkable — thousands of amulets with different protective properties, associated monks, and price ranges from ฿50 to millions of baht, creating a fascinating economic/spiritual ecosystem. Thai amulet culture is sophisticated and has its own authentication expertise.",
  },
  {
    name: "Science Museums & Planetarium Bangkok",
    emoji: "🪐",
    area: "National Science Museum (Pathum Thani, 30 min from Bangkok), Planetarium at Silpakorn University, interactive science centers",
    price: "National Science Museum entry: ฿50–200; Planetarium shows: ฿50–150; ECOTEC Science Center: ฿150–300",
    why: "Bangkok has several science education facilities that include astronomy content — the National Science Museum complex in Pathum Thani (north of Bangkok) hosts multiple buildings including natural history, technology, and natural science focused collections with interactive exhibits. The science museum complex runs programs for school groups and individual visitors and occasionally hosts telescope viewing events. Thailand has a growing amateur astronomy community centered around the National Astronomical Research Institute of Thailand (NARIT) — their outreach programs periodically bring portable telescopes to Bangkok for public viewing events around major astronomical events (lunar eclipses, meteor showers, planetary oppositions). Nakhon Ratchasima (Korat) and Chiang Mai NARIT facilities offer public viewing nights.",
    tip: "Bangkok astronomy events: following NARIT's Facebook page (National Astronomical Research Institute of Thailand — NARIT) provides Bangkok-relevant astronomical event information and scheduled public viewing events. Annual astronomical events visible from Bangkok: lunar eclipses occur 1–2 times per year and are visible from any outdoor location; the annual Perseid and Geminid meteor showers (August and December) provide best viewing 2–3am from any dark area; planetary conjunctions (when two bright planets appear near each other in the sky) are often visible even from Bangkok's light-polluted sky. Amateur astronomy clubs: the Astronomical Society of Thailand provides community connection for Bangkok-based astronomy enthusiasts.",
  },
];

export function BangkokAstronomy() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🔭 Bangkok astronomy & stargazing — dark sky sites, Thai astrology & science museums
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
