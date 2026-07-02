const TOPICS = [
  {
    title: "Bangkok Contemporary Art Scene — BACC to Independent Spaces",
    emoji: "🎨",
    summary: "Bangkok's contemporary art ecosystem spans public institutions to grassroots independent spaces: (1) Bangkok Art and Culture Centre (BACC): Bangkok's primary public contemporary art center; 9-story building adjacent to National Stadium BTS; free entry to most exhibitions; mixed commercial-gallery and public exhibition space model; hosts local and international contemporary art; (2) MOCA Bangkok (Museum of Contemporary Art): private museum founded by billionaire Boonchai Bencharongkul; impressive Thai modern art collection covering 20th and 21st century Thai art; located in northern Bangkok (accessible by car); (3) SAC Gallery (Silom), 100 Tonson Gallery (Ploenchit), Thavibu Gallery (Silom): Bangkok's established commercial contemporary art galleries representing Thai and international artists; 100 Tonson is considered Bangkok's most internationally prestigious commercial gallery; (4) Factory Art Community (Thonglor): independent artist community space in converted warehouse; periodic exhibitions, workshops, and experimental performance art; (5) Gallery Veer (Ekkamai): industrial-space gallery focused on contemporary Thai painting and installation; part of Bangkok's Ekkamai/Thonglor creative cluster.",
    action: "Bangkok Art and Culture Centre (bacc.or.th) for free contemporary exhibitions; 100 Tonson Gallery (100tonsongallery.com) for international-standard commercial art; follow Bangkok contemporary art news through BK Magazine (bk.asia-city.com) art section.",
  },
  {
    title: "Bangkok Street Art & Public Murals",
    emoji: "🖌️",
    summary: "Bangkok's street art scene transformed dramatically after 2010 with the MOCA tunnel mural project and subsequent waves of commissioned public art: (1) Charoen Krung creative district: Bangkok's oldest road (Charoen Krung) is now the center of Bangkok's contemporary creative scene; the area contains artist studios, creative spaces, galleries, and commissioned street art murals in former industrial buildings; (2) Phra Nakhon district murals: older Bangkok's historical district (near Democracy Monument, Khao San Road) has accumulated decades of informal street art alongside newer commissioned murals; (3) Sam Yan (near Chulalongkorn University): this neighborhood near Chulalongkorn University has developed as a creative area with murals reflecting Thai youth culture and international street art styles; (4) Thonglor-Ekkamai lane murals: Bangkok's trendy lifestyle corridor has commissioned murals on the side walls of bars, restaurants, and boutiques; Instagram-optimized murals are a feature of this area; (5) Bangkok Urban Art Festival: periodic urban art festivals bring international and Thai street artists to Bangkok for new mural projects; the BUKRUK Urban Arts Festival (Bangkok Urban Kreative) significantly expanded Bangkok's public art vocabulary.",
    action: "Bangkok street art discovery: walk Charoen Krung from BTS Saphan Taksin (south) through Soi 42–30 for the highest concentration; find Bangkok Mural Guide resources through Instagram hashtag #BangkokStreetArt for current notable works.",
  },
  {
    title: "Thai Traditional Arts — Lanna, Royal Crafts & Folk Traditions",
    emoji: "🏛️",
    summary: "Thai traditional arts in Bangkok connect to royal patronage, Buddhist artistic tradition, and regional craft diversity: (1) National Museum Bangkok (Na Phra That): Thailand's largest and most comprehensive historical museum; contains the world's foremost collection of Thai art (Buddha images, royal regalia, ancient bronzes, traditional performing arts artifacts); free guided tours in English on Wednesdays and Thursdays; (2) Royal Thai art workshops: the throne hall complex (Dusit area) and associated craft workshops have preserved royal craft traditions — nielloware (silversmithing), lacquerware, Thai silk weaving, and gilt woodcarving; (3) Jim Thompson House: the legendary American silk entrepreneur's restored Thai teak house complex houses Thai antiques, Asian art, and the Bangkok textile tradition; the silk business Thompson founded transformed Bangkok's silk industry; (4) Benjarong: Thai royal ceramics (five-color enamel porcelain with complex geometric patterns) is a distinctive Thai court art tradition; Bangkok's Wang Fah pottery and specialist shops sell contemporary Benjarong; (5) Thai silk: the fabric of Thai court culture; Bangkok's silk shops (Jim Thompson, Narai Phand) and Chatuchak Market vendors represent the full quality spectrum from mass production to handwoven royal-standard silk.",
    action: "National Museum Bangkok (entrance on Na Phra That Road, open Wednesday–Sunday, guided tours Wed and Thu 9:30am); Jim Thompson House (jimthompsonhouse.com); Chatuchak Market section 22-26 for traditional textiles and craft.",
  },
  {
    title: "Bangkok Art Fairs & The International Art Market",
    emoji: "🖼️",
    summary: "Bangkok has established itself as Southeast Asia's primary art fair location: (1) Art Bangkok (annual): Thailand's longest-running commercial art fair; Bangkok Convention Centre; represents Thai commercial galleries and established Southeast Asian artists; accessible to the public; (2) Thailand Art & Culture Fair (TACF): government-supported cultural art fair including craft, design, and fine art; (3) Bangkok Design Week (BKKDW): annual event (typically January) transforming Bangkok's creative districts into exhibition spaces; thousands of design, art, and creative installations across Charoen Krung, Sam Yan, and other creative zones; free to attend; (4) Bangkok Illustration Fair (BIF): periodic large-scale illustration and graphic art fair; reflecting Bangkok's strong graphic design and illustration community; (5) Art Collector market emergence: Bangkok's wealth and cosmopolitan character has created a growing contemporary art collector market; auction houses (Christie's has held Bangkok sales), international galleries opening Southeast Asian offices in Bangkok, and Thai collectors engaging the global art market reflect genuine market development.",
    action: "Bangkok Design Week (bangkokdesignweek.com) for free annual creative district event (January); Art Bangkok (artbangkok.com) for annual commercial fair calendar; BK Magazine arts calendar for monthly gallery opening schedules.",
  },
];

export function BangkokContemporaryArt() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎨 Bangkok art scene — BACC, street murals, royal craft traditions & art fairs
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
