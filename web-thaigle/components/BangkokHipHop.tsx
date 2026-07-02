const SPOTS = [
  {
    name: "Thai Hip-Hop & Rap Scene",
    emoji: "🎤",
    area: "Bangkok underground venues (RCA, Khaosan area alternative clubs), YouTube/streaming platforms",
    price: "Underground show ฿200–600; Major concert ฿800–3,000; Studio session ฿1,000–5,000/hour",
    why: "Thai hip-hop has developed a distinctive identity — 'Thai trap' and Thai rap emerged from underground scenes in Bangkok and Chiang Mai, gaining mainstream visibility through streaming platforms and viral moments. Artists like YOUNGOHM, F.HERO, and GREASY CAFE established credibility while newer waves of artists blend Thai tonal language complexity with contemporary trap production. The Thai rap scene navigates the tonal language challenge creatively — Thai's 5 tones create unique rhythmic and rhyme possibilities that English-influenced styles can't directly replicate. Bangkok's hip-hop community is especially strong in its connection to broader street culture: skateboarding, graffiti, and fashion intersect with music production in Bangkok's youth-oriented creative districts. Thai hip-hop's global resonance has grown — international collaborations and festival appearances have brought Thai artists to wider audiences.",
    tip: "Finding Bangkok's hip-hop scene: Spotify and YouTube playlists for 'Thai rap' and 'Thai hip-hop' surface the mainstream-accessible material; for underground/independent artists, following Bangkok music blogs (like Mango Mouth or similar Thai music media) and Instagram accounts of producers provides earlier access. Live show finding: Bangkok hip-hop shows are promoted primarily through Instagram and Facebook — following Thai hip-hop artists and venue accounts (@RCA_Bangkok area venues) is the discovery method. Beat producers: Bangkok has a community of English- and Thai-speaking music producers creating trap, lo-fi, and R&B beats — connecting through SoundCloud's Bangkok producer community or through social media provides collaboration opportunities for visiting international artists.",
  },
  {
    name: "Breakdancing & B-Boy Culture",
    emoji: "🕺",
    area: "Skatepark areas (Ratchada, Sena Park), practice jams in covered public spaces, event venues",
    price: "Workshops ฿300–800; Jam/battle entry ฿200–500; Practice sessions mostly free",
    why: "Breakdancing (b-boying/b-girling) has been part of Bangkok's street culture since the 1990s — the Bangkok b-boy scene has produced competitive dancers who represent Thailand at international events. Red Bull BC One and other international battles have featured Thai b-boys; the competitive scene has raised the technical level significantly. Bangkok's diverse weather (heat and occasional rain) has adapted the practice culture — covered public spaces (parking structures, shopping mall entrances, covered plazas) serve as de facto practice venues. The b-boy community in Bangkok spans generations of practitioners — some of Bangkok's original b-boys from the 90s remain active as mentors and event organizers while current youth represent the competitive edge.",
    tip: "Bangkok b-boy community connection: the most direct route is attending public practice jams (findable through Instagram and Facebook 'Bangkok bboy' searches) rather than through formal class structures. Battle events: Bangkok hosts b-boy battles throughout the year — 2v2, 4v4, and solo categories across skill levels. The community is welcoming to genuine practitioners regardless of nationality. B-boy/B-girl vocabulary is international — English is the shared language even when Thai speakers are the majority at events. Cross-discipline community: Bangkok's b-boy community overlaps with the broader street dance community (waacking, popping, locking, house dance) — crews often practice multiple styles, and jam events may incorporate multiple disciplines.",
  },
  {
    name: "Electronic Music & Club Culture",
    emoji: "🎧",
    area: "Onyx Club, Beam (Thonglor), Opium (Silom), Sing Sing Theater, alternative venues in Charoen Krung",
    price: "Club entry ฿300–1,000+; Major DJ night ฿600–2,000; Underground event ฿200–500",
    why: "Bangkok's electronic music and club culture is one of Southeast Asia's most developed — the city attracts international DJs across genres (techno, house, drum and bass, psytrance) throughout the year, and the domestic DJ and producer scene has significant depth. Onyx at SHOW DC and Beam in Thonglor represent the commercial club tier with major international bookings. The underground and alternative electronic scene operates through smaller venues, warehouse parties (especially in the outer Bangkok area), and Charoen Krung-area alternative cultural spaces. Thai electronic music producers work across genres — bedroom producers releasing on Bandcamp and SoundCloud, studio-trained producers doing commercial work, and live performance artists using modular synthesis and live sampling. Bangkok's electronic music scene has strong connections to the broader Bangkok creative community — visual artists, fashion designers, and graphic artists participate in the same social circuits.",
    tip: "Bangkok electronic music practical info: bring passport (some clubs require ID for age verification); dress codes are enforced at major clubs (no athletic wear, no sandals at upscale venues — dress smart casual to fashionable). Underground events: Bangkok underground electronic events circulate through Resident Advisor, Facebook events, and Telegram groups — the discovery is intentionally community-filtered. Psytrance specifically: Thailand has a significant psytrance festival scene — Full Moon-adjacent events and mountain/island psytrance festivals draw an international community; Koh Phangan and northern Thailand mountain festivals are the primary outdoor venues. Bangkok electronic community: the monthly Decibel Festival at various Bangkok venues has been a consistent touchpoint for the city's electronic music community.",
  },
];

export function BangkokHipHop() {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🎤 Hip-hop, b-boy & electronic music in Bangkok — Thai rap, breakdancing & club scene
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-slate-200 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-slate-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
