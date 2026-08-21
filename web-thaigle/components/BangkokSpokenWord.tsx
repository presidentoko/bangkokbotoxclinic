const SPOTS = [
  {
    name: "Bangkok's Poetry Slam & Spoken Word Scene",
    emoji: "🎤",
    area: "Independent bookstores in Sam Yan and Ari areas, gallery spaces in Charoenkrung Creative District, occasional events at arts-focused cafes throughout Bangkok, annual Bangkok poetry events",
    price: "Spoken word event entry: free–฿200; Open mic participation: free; Poetry workshop: ฿500–1,500; Annual poetry festival events: ฿300–1,000",
    why: "Bangkok's spoken word and poetry scene operates as a small but meaningful undercurrent in the city's arts culture — primarily in English (for the international community) and Thai (for the domestic literary arts community), with occasional multilingual events that bridge both. English-language open mic nights and poetry slams draw from Bangkok's expat and international student communities, creating events that value vulnerability, performance skill, and linguistic craft. The Thai-language poetry tradition is ancient and celebrated — classical court poetry (chan and kap verse forms), folk poetry (glon suphap), and modern Thai free verse all have dedicated communities in Bangkok's literary world. The intersection of these traditions in Bangkok's contemporary scene produces occasional events where Thai and international poets share a stage, often at the independent bookstores and gallery spaces in Charoenkrung's creative district. Bangkok's literary café culture — particularly in Ari neighborhood and Sam Yan near Chulalongkorn University — provides natural hosting spaces for intimate literary events.",
    tip: "Bangkok spoken word community access: (1) Finding events: Bangkok's English-language spoken word events are announced through expat Facebook groups ('Bangkok Expats Events'), literary Instagram accounts, and creative space calendars (WTF Bar/Gallery in Ekamai, The Reading Room bookshop, Charoenkrung Creative District events); (2) Open mic culture: most Bangkok open mic nights welcome first-timers — typically 3–5 minutes per performer, sign-up happens at the door; prepared material and improvised sets both work; (3) Thai poetry entry: accessing Bangkok's Thai literary scene as a non-Thai speaker requires a guide or translator; the Silpakorn University creative writing program and Chulalongkorn's arts faculty students are entry points; (4) Bangkok's zine connection: Bangkok's spoken word community overlaps significantly with the independent publishing and zine scene — attending a Bangkok Zine Fair reveals many of the same people who participate in spoken word events; (5) Thai hip-hop and rap: Thailand's thriving Thai-language hip-hop and rap scene (YOUNGOHM, F.HERO, and Thaitanium being major established artists) represents the commercial end of spoken word culture; underground hip-hop open mics in Bangkok exist adjacent to the English-language spoken word scene.",
  },
  {
    name: "Bangkok Literary & Reading Culture",
    emoji: "📚",
    area: "Kinokuniya (Siam Paragon, Central World), Dasa Book Cafe (Sukhumvit Soi 26), Bookazine, independent bookstores in creative neighborhoods, Bangkok's public library system, university bookstores",
    price: "English-language novels: ฿300–800; Academic books: ฿500–3,000; Used books (Dasa): ฿50–500; Library membership: ฿300–1,000/year; Literary event tickets: free–฿500",
    why: "Bangkok has a surprising depth of literary culture — both Thai-language and English-language — that supports independent bookstores, literary events, book clubs, and a publishing industry serving both domestic and regional markets. Kinokuniya Bangkok (particularly the Siam Paragon branch) is one of Southeast Asia's finest English-language bookstores — with comprehensive selection covering literary fiction, non-fiction, academic texts, graphic novels, and regional coverage of Southeast Asian literature that is simply unavailable in most Western markets. The Bangkok-specific literature tradition is rich: Bangkok is the setting of some of Southeast Asia's most compelling English-language fiction (from Alex Garland's 'The Beach' to Christopher Moore's humorous Bangkok novels to John Burdett's thriller series), and Thai-language literature has produced internationally recognized writers like Chart Korbjitti and Uthis Haemamool. Dasa Book Cafe on Sukhumvit has served Bangkok's English-reading literary community for decades as a used book haven — hundreds of donated novels in constant rotation, café service, and a welcoming browsing environment.",
    tip: "Bangkok literary scene participation: (1) Dasa Book Cafe: Tuesday–Sunday (closed Monday), most central day Tuesday afternoon when new donations typically processed; the trade system allows exchanging books you've finished for credit; (2) Bangkok English-language book clubs: several operate regularly — English-language community events listings and expat Facebook groups list active clubs in various genres (fiction, non-fiction, Asian literature focus); (3) Southeast Asian literature discovery: Bangkok's bookstores carry Thai literature in English translation and Southeast Asian literature from writers across the region — what's available in Bangkok is simply not findable in Western bookstores; (4) Thai comics and manga culture: Bangkok has a large Thai-language comic (การ์ตูน) market and considerable Japanese manga/manhwa consumption — specialist comic shops in major Bangkok malls serve this community; (5) Secondhand English books beyond Dasa: the area around Khao San Road and nearby Banglamphu backpacker zone has been a secondhand English book trading hub for decades — quality varies but rare finds occur.",
  },
  {
    name: "Bangkok's Independent Theater & Fringe Scene",
    emoji: "🎭",
    area: "Bangkok Fringe Festival venues (rotating), Democrazy Theatre Studio (Ratchathewi), La Lanta (Charoenkrung), Joe Louis Puppet Theatre (Asiatique), independent theater venues in creative districts",
    price: "Independent theater productions: ฿200–600; Bangkok Fringe Festival: ฿200–500; Physical theater/devised work: ฿300–700; Thai classical theater shows: ฿300–1,000",
    why: "Bangkok's independent theater scene is small but creatively active — operating at the intersection of Thai performance traditions (Khon masked dance drama, Likay folk opera, Nang Yai shadow puppetry) and contemporary international theater practices. The Bangkok Fringe Festival (modeled on Edinburgh's model) hosts independent productions across small venues throughout the city, providing a platform for experimental, physical, and devised work by Bangkok-based and regional theater companies. The challenge for Bangkok's independent theater: the city lacks the density of mid-size purpose-built theater spaces that sustain theater ecosystems in cities like London or New York — most productions must create their own space or adapt existing found spaces. Despite this, productions of significant creative ambition occur regularly, drawing from Bangkok's pool of international acting students (some arts universities teach theater), professional performers, and passionate non-professional ensemble members.",
    tip: "Bangkok independent theater access: (1) Bangkok Fringe Festival: typically held annually (often October/November) across multiple Bangkok venues for a 2–3 week period — program published online lists participating companies and venue addresses; (2) Democrazy Theatre Studio: Bangkok's most established experimental theater space, with a consistent program of new Thai productions and visiting companies; (3) Language accessibility: most independent Thai-language productions don't provide English surtitles; English-language productions are performed by expat and international companies and announced through English-language expat channels; (4) Khon classical drama: regular performances of this royal court masked dance-drama occur at the National Theatre and tourist venues — while performed in ancient Thai/Pali, the visual spectacle (elaborate costumes, stylized movement, live classical orchestra) transcends language; (5) Thai comedy Likay: the folk theater tradition of Likay (melodramatic musical improvisation with comedy) is actively performed at temple fairs and outdoor stages — deeply Thai and largely inaccessible without Thai language, but attending reveals authentic popular theatrical culture.",
  },
];

export function BangkokSpokenWord() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🎤 Bangkok literary arts — spoken word, poetry, bookstores & independent theater
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
            <div className="text-[10px] text-indigo-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
