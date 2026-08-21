const TOPICS = [
  {
    title: "Bangkok as Social Media & Content Creation Hub — Why Creators Move Here",
    emoji: "📱",
    summary: "Bangkok has emerged as Asia's top destination for full-time content creators and social media influencers: (1) Cost of content creation: Bangkok's cost structure allows content creators to run operations impossible in Western cities; professional video production (cameras, lighting, drone operators, editing software subscriptions) is significantly cheaper; hiring Thai video editors (full-time, English-proficient) costs ฿25,000–50,000/month (US$700–1,400) — a fraction of equivalent Western salaries; (2) Visual diversity within proximity: Bangkok's visual variety (ultramodern glass towers, ancient temples, canal communities, floating markets, rooftop bars, street food alleys) allows diverse content shoots within one city; for travel content creators, Bangkok functions as a base that allows 2-hour flights to Southeast Asian destinations for travel content without abandoning a production base; (3) Creator community density: Bangkok's expat and digital nomad community includes a disproportionate number of content creators; creator communities (YouTube Thailand Creator Network, Bangkok Content Creator meetups) organize regular collaboration opportunities; the critical mass of creators enables collaboration, cross-promotion, and shared production resources; (4) Thailand's photogenic infrastructure: Thailand's investment in visual tourism infrastructure (well-lit temples, designed viewpoints, accessible national parks) makes creating compelling travel content easier than in destinations with less tourism infrastructure; (5) Growing Thai creator economy: the Thai domestic creator economy (Thai-language YouTubers, TikTok creators, LINE content) is substantial; collaborating with Thai creators enables access to the 70M+ Thai social media market.",
    action: "Bangkok Content Creator meetups: search Facebook 'Bangkok Content Creators'; YouTube Thailand Creator Network for certified YouTube Creators in Bangkok; Grab or Find a video editor: Jobtopgun.com (Thai job platform) and JobsDB Thailand for hiring Bangkok-based editors; Pantip Plaza and Fortune Town for camera gear purchases.",
  },
  {
    title: "Bangkok Photography — Locations, Gear & Instagram Strategy",
    emoji: "📸",
    summary: "Bangkok is one of Asia's top photography destinations with extraordinary visual variety: (1) Blue hour vs. golden hour in Bangkok: Bangkok's tropical light is harsh and flat during midday (10am–3pm); the most productive photography windows are blue hour (30 minutes before sunrise, approximately 5:30–6am) and golden hour (5:30–7pm); the same Bangkok locations transform dramatically between harsh midday and warm evening light; (2) Rooftop photography: Bangkok's density of rooftop bars with unrestricted photography (VS-Bkk rooftop, Above Eleven rooftop, Vertigo and Moon Bar at Banyan Tree, Octave at Marriott Sukhumvit 57) provides city skyline photography access that would cost hundreds of dollars admission in comparable world cities — Bangkok rooftops typically require only a drink purchase (฿200–500); (3) Temple photography: the combination of elaborate gilded architecture, monks in saffron robes, incense smoke, and Bangkok's tropical blue sky creates temple photography that looks processed even when straight out of camera; the best temple photography morning is early (before 9am) when tourist numbers are low and monks are active; (4) Street photography culture: Bangkok has a vibrant street photography community; the Thai street culture is generally photography-receptive (street vendors, market sellers, and most people in public spaces respond positively to cameras); photographing monks requires respect and discretion — not photographing women with monks, not photographing from above (never position camera above monk's head level); (5) Instagram-specific Bangkok: Bangkok is consistently one of the world's most Instagram-photographed cities; the Grand Palace, Wat Pho, floating markets, and street food markets are heavily photographed; finding less-photographed Bangkok locations (Thewet flower market, Wang Lang market, Sam Phraeng community, Khlong Bang Luang in Thonburi) requires more research but produces distinct content.",
    action: "Bangkok photography permits: Grand Palace requires ฿500 entry; most temples charge ฿20–200; Drone photography requires CAAT (Civil Aviation Authority of Thailand) drone registration and flight plan approval — flying unlicensed drones near temples or government buildings can result in equipment confiscation; Bangkok photography community: 1000mm Bangkok, Rangefinder Bangkok Facebook groups; camera gear rental: Bangkok has camera rental shops (contact specialist gear rental companies near Pantip Plaza).",
  },
  {
    title: "YouTube & Video Production in Bangkok — Equipment, Editing & Monetization",
    emoji: "🎥",
    summary: "Bangkok's combination of low costs, visual richness, and creator community makes it an excellent YouTube production base: (1) Video equipment access: Bangkok has multiple camera and video equipment shops (Pantip Plaza, Fortune Town IT Mall, and Mahboonkrong MBK Center tech floor); purchasing camera equipment in Bangkok is typically 5–15% cheaper than European or Australian prices (Thai import duties on electronics are lower); (2) B-roll abundance: Bangkok's perpetual activity (24-hour convenience stores, all-night street food, weekend Chatuchak market, daily temple ceremonies, Muay Thai events) provides b-roll (supplementary footage) opportunities that can be filmed any day of the week without pre-arrangement; (3) Thai video editor market: Bangkok-based Thai video editors are skilled, English-proficient, and significantly cheaper than equivalent editors in Western markets; platforms for finding Bangkok editors include Facebook groups (Bangkok Digital Nomads, Thailand Freelancers), Jobtopgun.com, and direct collaboration through creator communities; (4) YouTube monetization and Thailand: YouTube's Thailand Content ID and ad monetization system functions normally; Thai-language videos from Bangkok creators participate in the Thai advertising market (growing but lower CPM than US/UK markets); English-language Bangkok/Thailand travel content participates in global advertising markets with higher CPM; (5) Multi-channel strategy from Bangkok: Bangkok's location allows creating content across Southeast Asian travel niche (high-CPM travel content for YouTube) while using Thailand as a low-cost production base; the 10-hour timezone proximity to both Australian and European audiences creates distribution timing opportunities.",
    action: "YouTube Creator Academy resources at support.google.com/youtube; Bangkok video production companies for collaborations and B-roll assistance; Motion Array, Artgrid, Musicbed for licensed music and assets; Final Cut Pro, Premiere Pro, DaVinci Resolve (free professional video editor) common in Bangkok creator community; Thai creator community events on Facebook (Bangkok Creators Network).",
  },
];

export function BangkokInfluencerLife() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        📱 Bangkok creator economy — content creation hub, photography locations & YouTube production
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-rose-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-rose-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
