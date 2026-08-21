const TOPICS = [
  {
    title: "Bangkok as a Content Creation Hub",
    emoji: "📸",
    summary: "Bangkok has emerged as one of Asia's premier content creation destinations — combining extraordinary visual variety (ancient temples, futuristic skylines, neon-lit street markets, tropical parks), affordable production costs, and a supportive creator ecosystem. Why creators come to Bangkok: (1) Visual density: in any 500-meter walk in Bangkok, a creator moves through 5+ distinct visual environments; temples, street food scenes, flower markets, modern malls, and river life create unlimited content variety; (2) Golden hour access: Bangkok's tropical latitude and clear-sky dry season produce spectacular golden hour light for photography and video; the low angle of early morning and late afternoon sun in a city of glass towers and ancient wat creates unique visual opportunities; (3) Affordability: studio rental, drone operation (with proper permits), video production assistance, and post-production services are available in Bangkok at 30–50% of Western market rates; (4) Thai creator community: Bangkok's creator community is active and collaborative — local photographers, videographers, and digital creators are accessible through Instagram, Facebook groups, and co-working spaces; (5) Travel content ecosystem: Bangkok's status as one of the world's most-visited cities means travel content about Bangkok has established audience demand across YouTube, Instagram, TikTok, and Reels.",
    action: "Bangkok content creation community: Bangkok Creators Facebook group, Thonglor co-working spaces for creative desk/studio hire, and Bangkok Photo Walk group for community photography exploration.",
  },
  {
    title: "Bangkok Photography Locations & Drone Permits",
    emoji: "📷",
    summary: "Bangkok's most photogenic locations and the logistical considerations for capturing them: (1) Wat Phra Kaew / Grand Palace (06:30–15:30): Thailand's most iconic architectural photography; golden morning light (7–9am) before crowds; tripods permitted in most areas; (2) Mahanakhon Tower Observation Deck (Chong Nonsi): Bangkok's highest observation point with glass-floor experience; sunrise and blue-hour photography stunning; (3) Chinatown (Yaowarat) at night: neon Chinese signage, street food steam, tuk-tuk trails — requires fast lens for low-light photography (f/1.8 or faster); (4) Asiatique riverfront at night: neon Ferris wheel reflections on river; blue hour produces spectacular blends; (5) Bangkachao (Green Lung): canal paths through tropical greenery; rented bikes allow movement through photogenic plant corridors; (6) Bang Kachao Buddhist temples: small neighborhood temples with zero crowds; morning light creates serene photography opportunities; (7) Drone regulations: Bangkok is within the Bangkok Metropolitan Region civil aviation control area — commercial drone flights require advance Civil Aviation Authority of Thailand (CAAT) permit approval (process 5–10 business days); recreational drone flights in non-restricted areas require CAAT registration and operator license; many national park and temple areas prohibit drones regardless of permit status.",
    action: "Drone permit: Civil Aviation Authority of Thailand (CAAT) at aviation.go.th — Drone Operator License (ROC) required for all drone operations; permit applications require advance submission with GPS coordinates of planned operations.",
  },
  {
    title: "Bangkok Studio & Production Resources for Creators",
    emoji: "🎬",
    summary: "Bangkok has developed a significant commercial production infrastructure serving both international and domestic content production: (1) Rental photography studios: multiple professional photography studio rental options in Bangkok (primarily Sukhumvit/Ratchada/Chatuchak areas); hourly rates ฿1,500–5,000 for basic studio to ฿8,000–20,000 for fully equipped production studios with cyclorama, lighting rigs, and grip equipment; (2) Green screen facilities: Bangkok has several production companies with professional-grade green screen cyc studio rental available to independent creators; (3) Video production equipment rental: professional camera bodies, lens kits, lighting, sound, and grip equipment available from production equipment rental companies at Bangkok commercial production rates; (4) Thai filming crew: Bangkok's commercial production community includes experienced crew available for day rates; directors of photography, gaffer and lighting crew, sound mixers, and production assistants are accessible through production company networks and Facebook creator communities; (5) Music licensing: Bangkok's recording studio community (primarily in the Ratchada and Chatuchak area) includes session musicians, music producers, and composers who create original music for commercial and content licensing.",
    action: "Bangkok production resources: Creative Space Thailand and Bangkok Production Studio (search Instagram/Facebook) for studio rental; Production Thailand Facebook group for crew access; Musicbed and Epidemic Sound for licensed music (international platforms serving Bangkok creators).",
  },
  {
    title: "Social Media & Influencer Economy in Bangkok",
    emoji: "📱",
    summary: "Bangkok is one of Southeast Asia's most active influencer and creator economies: (1) TikTok and Instagram Thai market: Thailand's Thai-language creator market is enormous; the Thai TikTok creator community is among Asia's most prolific; (2) Creator monetization landscape: Thai creators primarily monetize through sponsored content (brand partnerships), platform monetization (YouTube AdSense, TikTok Creator Fund — Thailand is in the TikTok monetization zone), and live streaming gifting (popular on TikTok Live and Bigo Live Thailand); (3) Brand partnership rates in Thailand: Thai influencer rates are significantly lower than Western markets — a Thai creator with 100k engaged followers charges ฿10,000–50,000 per post vs. $2,000–10,000 for equivalent Western creators; international brands entering Thailand often work with both Thai-language creators and English-language travel creators who cover the market; (4) Creator visa considerations: Thailand's visa framework for content creators is the same as digital nomads — most operate on tourist visa or MICE visa (for specific events); the Thailand Long-Term Resident (LTR) visa for Digital Nomads (requires remote employment or freelance income documentation) provides longer-term legal status; (5) Bangkok creator co-working community: multiple Bangkok co-working spaces (particularly in Thonglor, Ari, and Ratchada) host creator community events and provide the network for brand partnership introductions.",
    action: "Bangkok influencer resources: Thailand Influencer Association, Influencer Asia (regional platform), and Bkk.social (Bangkok social media creator community events and networking).",
  },
];

export function BangkokContentCreator() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        📸 Bangkok content creation — photography locations, studios & social media economy
      </h2>
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
