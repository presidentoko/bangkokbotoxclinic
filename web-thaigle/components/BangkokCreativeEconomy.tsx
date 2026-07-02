const TOPICS = [
  {
    title: "Bangkok's Creative Industries — Design, Film & Media Production",
    emoji: "🎬",
    summary: "Bangkok has developed a significant creative economy with international reach: (1) Thai film industry: Thailand's film industry produces approximately 30–50 theatrical releases annually; Bangkok film infrastructure (studios, post-production, VFX) serves both domestic production and international projects (Bangkok frequently serves as a filming location for Hollywood productions due to tropical aesthetics, location variety, and competitive crew costs); (2) Bangkok as filming location: major productions filmed in Bangkok and Thailand include The Hangover Part II, The Man with the Golden Gun, Tomorrow Never Dies, the Ong Bak franchise, and multiple Asian productions; the Thailand Film Office facilitates international productions (one-stop permitting, crew hire, location access); (3) Thai animation and VFX: Thailand's animation industry (focusing on feature animation and VFX work for international studios) is concentrated in Bangkok; companies like MonkeyBox and C2Motion provide outsourced animation for international productions; the industry benefits from government incentives and creative infrastructure investment; (4) Advertising and fashion production: Bangkok is Southeast Asia's advertising production hub; lower production costs, diverse locations (from ultramodern to heritage), and high crew quality attract international advertising shoots; Bangkok Fashion Week and ELLE Fashion Week Thailand represent the city's fashion industry aspirations; (5) TCDC and creative infrastructure: Thailand Creative & Design Center (TCDC at Emporium) provides materials library, design education programming, and creative industry networking; the DITP (Department of International Trade Promotion) has creative industry programs to connect Thai creative businesses internationally.",
    action: "Thailand Film Office (thaifilmoffice.net) for production support; TCDC Bangkok (tcdc.or.th); Thailand Creative & Design Center events calendar; Creative Thailand magazine (TCDC publication) for Thai creative industry news; TH Creative Economy Agency (CEA) at cea.or.th.",
  },
  {
    title: "Bangkok's Graphic Design, Typography & Visual Arts Scene",
    emoji: "🎨",
    summary: "Bangkok has a vibrant graphic design community informed by both global design trends and distinctly Thai visual traditions: (1) Thai typography challenges and creativity: the Thai script's character complexity (over 70 characters, subscript and superscript vowels, tone markers) creates distinctive challenges for typography design; Bangkok's graphic designers have developed a sophisticated Thai type design practice; Thai font foundries and contemporary type designers (WfontsOne, Cadson Demak, Thinkoftype) produce internationally recognized work; (2) Thai design sensibility: Bangkok's design aesthetics blend influences from traditional Thai visual arts (temple mural painting, manuscript illumination, lacquerware decoration patterns) with Japanese minimalism, Korean K-design trends, and Western contemporary design; the result is a distinctive Bangkok visual style recognizable in packaging, advertising, and digital products; (3) Design education: Chulalongkorn, Kasetsart, Silpakorn (Bangkok's art university), and multiple private institutions train Bangkok's design community; Silpakorn University has the longest history in Thai visual arts education and maintains connections to traditional Thai arts alongside contemporary practice; (4) Social media visual culture: Thailand's LINE Sticker ecosystem is one of the world's most commercially active; Thai LINE Sticker designers (often freelance illustrators) generate significant income from sticker pack sales; this distinctive Thai digital visual culture (playful, emoji-adjacent, cartoon character-driven) reflects Bangkok's broader popular visual aesthetic; (5) Street art murals: beyond the established street art scene in Charoen Krung and BUKRUK festival sites, Bangkok's neighborhood murals (in Thewet, Silom, Ekkamai, and outer residential neighborhoods) reflect grassroots visual culture and artist community development.",
    action: "Silpakorn University (su.ac.th) for Thai visual arts tradition context; TCDC Bangkok (tcdc.or.th) materials library and design bookshop; Bangkok Design Week (annual January, Charoen Krung district) for creative industry showcase; BUKRUK Urban Arts Festival (periodic, multiple Bangkok locations) for street art; DEWA (Design Excellence Award, DITP) for Thai design industry recognition.",
  },
  {
    title: "Bangkok's Music Production & Independent Music Scene",
    emoji: "🎵",
    summary: "Bangkok has a substantial independent music ecosystem that rarely breaks through to international visibility: (1) Thai pop (T-pop) industry: Bangkok's major label ecosystem (GMM Grammy, RS Group/Tero Music) dominates Thai mainstream pop; T-pop features the same idol production system (agency-trained groups, elaborate visual production, fan community management) as K-pop but with Thai artists and language; GMM Grammy is the world's largest music company by domestic market share in its country (some measurements); (2) Underground Bangkok music scenes: distinct from mainstream T-pop, Bangkok's independent music scenes include: math rock and post-rock (venues: Rockademy, Fat Radio concert events); electronic music (Soy Sauce Records, Raksa Records releasing ambient and experimental electronic); hip-hop (Thaikoon, Rap Against Dictatorship, Youngohm); punk and hardcore (Immortal Souls, Pandahead communities); (3) Bangkok's live music venues: Nimmanhaemin Road in Chiang Mai gets more music scene credit, but Bangkok has Club Culture (Huai Khwang), Cortina Bar (underground jazz), Teens of Thailand (jazz-adjacent cocktail bar); Fat Gut Empire (Charoenkrung, jazz-fusion); Bo Nanon (Thong Lo, soul and funk); (4) Recording studio infrastructure: Bangkok has professional recording studio infrastructure used by both Thai and international musicians (recording in Bangkok is cost-effective); RSVP Recording Studio, The Lab Studio, and multiple professional recording facilities serve the domestic industry; (5) Music export challenge: Thai music faces the same market structure issues as most Southeast Asian national music industries — English not being the primary language limits international streaming discovery; k-pop has shown a model for language-agnostic global expansion through visual spectacle; Thai music industry observers watch whether T-pop develops an equivalent global fan base.",
    action: "GMM Grammy (gmmgrammy.com) for mainstream Thai music releases; Fat Radio Bangkok for independent Thai music discovery (fatradio.co.th); Spotify's Thai Indie playlist for current independent releases; Bangkok underground show listings: BKK Underground Instagram and Facebook; Rocket Recording for Thai alternative music releases.",
  },
];

export function BangkokCreativeEconomy() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎬 Bangkok creative economy — film production, design culture & independent music scene
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-purple-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-purple-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
