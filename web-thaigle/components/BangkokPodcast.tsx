const SPOTS = [
  {
    name: "Bangkok Podcast Scene & Thai Podcasting",
    emoji: "🎙️",
    area: "Remote-produced (Bangkok-based podcasters broadcast online); recording studios available",
    price: "Studio recording ฿500–2,000/hour; Podcast equipment ฿5,000–50,000 to set up",
    why: "Thailand's podcast scene exploded post-2020 — Thai-language podcasts now span hundreds of active shows covering Thai business, politics, personal finance, science, comedy, and true crime. The Thai podcast ecosystem uses Spotify (dominant), Apple Podcasts, and the regional platform SoundCloud. Bangkok-based Thai podcasters have built substantial audiences: UNLOCKED PODCAST (business/startup), The Standard Podcast (journalism/news), The Cloud (creative culture), and dozens more. English-language Bangkok podcasts cover expat life, Thai food, and Southeast Asia business.",
    tip: "Listening to Bangkok/Thailand podcasts: Spotify Thailand's podcast section surfaces trending Thai content. For English learners of Thai: 'Thai Pod 101' and 'Learn Thai with Mod' provide structured lessons. For expats: 'Expat Life in Bangkok' genre content on Spotify surfaces through search. Starting a podcast from Bangkok: the recording infrastructure (quiet studio space, equipment hire) is developing — Bangkok's coworking spaces increasingly have podcast recording booths. Thai podcast culture note: Thai podcast comedy tends toward absurdist humor (the 'ฮา' category — ha/laughter — is distinct from Western comedy formats). Following Thai podcasters on social media often yields insight into Thai cultural commentary.",
  },
  {
    name: "Recording Studios & Audio Production",
    emoji: "🎚️",
    area: "Professional studios (Sukhumvit, Ladprao music district); home studio culture widespread",
    price: "Professional studio ฿2,000–8,000/hour; Podcast studio ฿500–1,500/hour",
    why: "Bangkok has professional music recording studios used by Thai pop artists and international productions — several operate at international technical standards with high-end Neve or SSL consoles and experienced engineers. The Thai music industry (dominated by GMM Grammy and RS Group labels) operates major studio facilities. Independent studios serving podcasters, YouTube content creators, and independent musicians have grown significantly. Home studio culture (digital audio workstations, condenser microphones, acoustic treatment) is well-represented in Bangkok's creative community.",
    tip: "Bangkok recording studio finding: music production Facebook groups ('Bangkok Music Producers', 'Music Thailand') surface studio recommendations. For podcast-specific recording: look for studios that explicitly offer podcast packages (often include editing/mastering services). Equipment purchasing: Pantip Plaza (Bangkok's IT mall, accessible from MRT Phetchaburi) carries audio recording equipment at competitive prices — Focusrite audio interfaces, Audio-Technica microphones, and various condenser microphones available. Import note: some professional audio equipment is cheaper to buy outside Thailand — compare prices before purchasing locally.",
  },
  {
    name: "Content Creation Economy in Bangkok",
    emoji: "📱",
    area: "Digital-native (YouTube, TikTok, Instagram); Bangkok location shooting in cafés, studios",
    price: "Creator economy income: varies widely; Brand partnerships ฿5,000–500,000+/post",
    why: "Bangkok's digital content creation economy is substantial — Thai YouTube and TikTok creators have built massive followings (several Thai YouTubers have 10M+ subscribers) with Bangkok-based production. The content categories commanding largest Thai audiences: gaming (ROV, PUBG, Free Fire streaming), beauty and skincare (Thai beauty economy is significant), food (cooking and restaurant review channels), and comedy/entertainment. Bangkok's visual backdrop (street food, temples, modern architecture, night markets) makes it a compelling filming location for travel content creators. The influencer marketing economy in Thailand is well-developed — brands actively seek Thai micro-influencers (10k–100k followers) for campaigns.",
    tip: "Bangkok content creation resources: CreatorThailand.com and Digital Marketing Thailand Facebook communities connect creators with brands. For filming in Bangkok: public spaces are generally permissive for casual filming; permission is required for commercial shoots in malls and some public venues. TikTok House Bangkok: creator collectives (houses where multiple creators live and produce content together) exist in Bangkok — visible through TikTok following networks. Monetization timeline: most Bangkok content creators treat it as a side income for 12–24 months before earning significant income — the exception being those who create content in a category with immediate brand partnership demand.",
  },
];

export function BangkokPodcast() {
  return (
    <div className="rounded-2xl border border-violet-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-800 mb-3">
        🎙️ Podcasting & content creation in Bangkok — studios, Thai podcasts & creator economy
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-violet-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
