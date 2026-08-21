const SPOTS = [
  {
    name: "Sam Yan Mitr Town — Street Art District",
    emoji: "🎨",
    area: "Sam Yan (Si Phraya area) — murals throughout the complex and surrounding streets",
    price: "Free entry to view; workshops ฿500–1,500",
    why: "Sam Yan Mitr Town is Bangkok's most concentrated street art and graffiti destination — the complex was developed with deliberate street art integration, commissioning Bangkok graffiti artists and muralists to cover building facades, walls, and public spaces. The surrounding old Sam Yan neighborhood has organic mural culture on shophouse walls and alley spaces. This is distinct from tourist-area street art (designed for selfies) — Sam Yan's art reflects Bangkok underground culture and features artists with genuine graffiti roots.",
    tip: "Sam Yan street art circuit: the complex itself has the commissioned murals; the residential alleys immediately north and west have organic graffiti. Visit in the early morning for best light and before heat peaks. Nearby: the Sam Yan wet market (one of Bangkok's most authentic morning markets) pairs with a street art walk. The Chulalongkorn University arts programs in the area feed the local graffiti culture — student work appears regularly. Instagram documentation of Bangkok street art: accounts dedicated to Bangkok's urban art document new pieces weekly.",
  },
  {
    name: "Mural Culture in Ratchathewi, Ari & Old Neighborhoods",
    emoji: "🖼️",
    area: "Ratchathewi (Victory Monument area), Ari, Samsen, old shophouse neighborhoods",
    price: "Free to explore",
    why: "Bangkok's graffiti and mural culture isn't concentrated in one district — organic pieces appear throughout the city's older neighborhoods where blank walls meet local art communities. The Ari neighborhood (art cafés, design studios, young Thai professionals) has consistent mural presence on shophouse side walls. Victory Monument area's railway overpass has been a graffiti canvas. Samsen Road's colonial-era shophouses in some blocks have wall paintings. The culture is organic and changes frequently — pieces appear and are painted over in cycles.",
    tip: "Documenting Bangkok street art: follow Instagram accounts @bangkokstreetart and @artinbangkok for current mural documentation — new pieces are photographed and tagged with location. Google Maps 'street art Bangkok' captures some pieces. The scene changes seasonally — building renovations, painting over, and new commissions mean pieces from last year's guides may be gone. For participating in the culture: Bangkok has several mural event festivals (usually coordinated with neighbourhood festivals or design events) where artists paint new pieces over a weekend — open to the public.",
  },
  {
    name: "Graffiti Jam Events & Bangkok Hip-Hop Scene",
    emoji: "✏️",
    area: "Event venues, skate park adjacent spaces, outdoor festival areas",
    price: "Event entry ฿200–600; supplies your own cost if participating",
    why: "Bangkok's graffiti scene is embedded in a broader hip-hop and urban culture ecosystem — graffiti jams (events where multiple writers paint together, usually on a prepared wall or fabric) happen several times yearly, organized by the Thai hip-hop community and graffiti crews. These events are social occasions with music (hip-hop DJ sets), dance battles (bboy community overlap), and open spray can work. The community is multi-generational — veteran Bangkok graffiti writers (who've been active since the 1990s) alongside young emerging artists. Thai-style integration of traditional motifs (temple patterns, Thai script lettering) into graffiti creates a distinctive aesthetic.",
    tip: "Finding Bangkok graffiti jams: follow Thai hip-hop collective Facebook pages (Big Bang, I Hiphop Thailand, local crew pages) — events are announced 1–2 weeks in advance. Bringing your own supplies (spray cans) signals participation intent and usually gets you invited to paint. Bangkok graffiti supply: spray paint available at hardware stores (Rustoleum, Bosny are common Thai brands) — dedicated graffiti paint brands (Montana, Molotow) available through specialty shops and Facebook group order coordination. Legal muraling: Bangkok's municipality has designated some walls for legal mural work — city-sanctioned pieces are different from unsanctioned graffiti but both coexist.",
  },
];

export function BangkokGraffitiArt() {
  return (
    <div className="rounded-2xl border border-orange-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-800 mb-3">
        🎨 Street art & graffiti in Bangkok — Sam Yan murals, neighborhood art & graffiti jams
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
