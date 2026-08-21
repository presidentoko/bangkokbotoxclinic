const SPOTS = [
  {
    name: "Bangkok as a Film Location",
    emoji: "🎬",
    area: "Chinatown (Yaowarat), Khao San Road, Chatuchak, Bang Kachao, Chao Phraya waterfront, BTS Skytrain areas — all major filming locations",
    price: "Public location filming: permit required (฿0–5,000); Professional location services: ฿5,000–50,000/day; Film production crew packages available",
    why: "Bangkok has an established film production industry — the city has been featured in Hollywood productions (The Hangover Part II, Only God Forgives, Bangkok Dangerous), Korean dramas, Japanese films, international commercials, and a thriving domestic Thai film industry. Bangkok's appeal as a film location: visual diversity (ultra-modern skyline vs. crumbling traditional neighborhoods vs. river scenes), affordable production costs compared to Western markets, experienced local crew and production company infrastructure, exotic visual identity, and a cooperative local film commission. The Thai film industry itself (GTH, GDH, Sahamongkol Film) produces high-quality commercially successful films — Bangkok is where Thai cinema's creative talent concentrates. International production companies frequently base their Southeast Asia productions in Bangkok for the combination of infrastructure, locations, and cost.",
    tip: "Filming in Bangkok public spaces: Thailand has a permitting system for professional film production in public spaces — the Bangkok Metropolitan Administration (BMA) handles many permits, while national parks, temples, and specific landmarks have their own permit processes. The Thailand Film Office (TFO) provides production support including permit facilitation for international productions. Important cultural location guidance: filming in temples requires specific permission and dress codes; filming Thai royalty imagery requires careful consideration of lèse-majesté laws; filming protests, military installations, or sensitive political scenes carries significant legal risk. Equipment: Bangkok has established camera rental companies, grip and lighting suppliers, and film equipment importers serving the production community — production support is genuinely available for international projects.",
  },
  {
    name: "Thai Film & Documentary Scene",
    emoji: "🎥",
    area: "House of Indie (Bangkok), Lido Connect Cinema (Siam), Documentary Club screenings, Bangkok LGBTQ+ film festivals",
    price: "Art cinema ticket ฿150–250; Film festival pass ฿500–2,000; Documentary Club membership ฿300–500/month; Bangkok International Film Festival: varies",
    why: "Bangkok's cinema culture extends significantly beyond mainstream multiplex entertainment — the city has an active art cinema community, independent film circuit, and documentary scene. The Documentary Club (streaming platform and event series) has built significant audience for Thai-language and international documentary programming. House of Indie and Lido Connect provide physical venues for art cinema programming that includes Thai independent films, festival circuit acquisitions, and international art cinema. Thai independent film has achieved international recognition: Apichatpong Weerasethakul's work has won the Palme d'Or at Cannes and is shown internationally; Thai horror, Thai romantic comedy, and Thai period drama genres have strong domestic audiences. Bangkok's film festival calendar includes the Bangkok International Film Festival, World Film Festival of Bangkok, and numerous specialty festivals (LGBTQ+, environmental, documentary).",
    tip: "Bangkok art cinema access: following the Documentary Club, Lido Connect, and Bangkok film event accounts on Facebook or Instagram provides the most current programming. Thai film recommendations for visitors: 'Uncle Boonmee Who Can Recall His Past Lives' (Apichatpong Weerasethakul), 'Dew the Movie', 'Homestay', 'The Medium' (Thai-South Korean horror co-production) — each offers distinctively Thai cultural and spiritual perspectives that complement visiting Thailand. For documentary film: Thai-made documentaries about Bangkok street life, rice farming culture, and the Thai entertainment industry offer insider cultural perspectives. Streaming: Netflix Thailand has significant Thai original content including series and films that are unavailable in other regions — using a local SIM or Thai account provides access to this content while in Bangkok.",
  },
  {
    name: "Content Creation in Bangkok",
    emoji: "📱",
    area: "Social media-optimized Bangkok locations — Chatuchak, Thong Lor, Chinatown, Wat Arun, floating markets, rooftop locations",
    price: "Location-based content creation: free (public spaces); Studio rental: ฿2,000–10,000/hour; Social media production packages: ฿5,000–50,000",
    why: "Bangkok has become one of Asia's premier content creation destinations — the combination of visually spectacular locations, diverse subjects (street food, luxury fashion, cultural heritage, modern architecture), digital nomad and creator community infrastructure, and favorable cost-of-living for extended creative stays makes Bangkok a natural hub for YouTube vloggers, Instagram influencers, TikTok creators, and podcast producers. The Bangkok content creation ecosystem is mature: professional photography studios with diverse sets, co-working spaces catering to creators, local influencer communities, and production support services from videographers to editors. Thailand's openness to foreign creators and tourists (relatively simple visa process, English-speaking hospitality industry) means international creators can operate with minimal friction. The Thai creator community is also significant domestically — several Thai YouTube channels and TikTok creators have international followings.",
    tip: "Bangkok content creation practical tips: (1) Golden hour in Bangkok (5:30–7:00am and 5:30–7:00pm) provides exceptional light for outdoor shooting; morning golden hour also means fewer crowds at popular locations; (2) Temple photography: respectful, non-disruptive photography is generally welcome at Bangkok's temples — if approaching worshippers or sacred moments, ask permission first; (3) Drone use: drone flying in Bangkok requires CAAT (Civil Aviation Authority of Thailand) registration and has restricted zones around BKK/DMK airports, the Grand Palace, and other sensitive areas — research restrictions carefully before flying; (4) Street food content: vendors generally appreciate photography of their food and are used to it — purchasing before photographing is appropriate and often leads to more natural shots; the vendor's enthusiasm when they know you're sharing their food positively usually results in the best portraits.",
  },
];

export function BangkokFilmmaking() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        🎬 Bangkok filmmaking & content creation — film locations, Thai cinema & content creation
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-gray-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
