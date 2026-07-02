const SPOTS = [
  {
    name: "Bangkok Podcast & Audio Content Scene",
    emoji: "🎙️",
    area: "Remote recording (co-working spaces with recording rooms), podcast studios in Bangkok, home studio setups in Bangkok apartments",
    price: "Co-working podcast recording room: ฿500–1,500/hour; Professional podcast studio: ฿2,000–6,000/hour; Equipment rental: ฿1,000–3,000/day",
    why: "Bangkok has a growing podcast production community — the intersection of the city's large English-speaking expat and digital nomad population, the Thailand-focused topics of genuine international interest (travel, expat life, Asian business, Southeast Asian culture), and the affordable cost base for recording and production has produced a significant Bangkok-based podcast ecosystem. Prominent Bangkok/Thailand-focused podcasts cover: expat life (living in Thailand, visa navigation), Thai business and economy, Southeast Asian travel, Thai culture and history, and the Asia-based digital nomad lifestyle. Several successful podcasts have originated from Bangkok with substantial international followings. The podcast studio infrastructure in Bangkok is developing — purpose-built podcast studios with professional soundproofing, quality microphones, and recording software are available at an increasing number of co-working spaces and media companies.",
    tip: "Bangkok podcast production setup: (1) Apartment acoustics are often challenging for recording — rooms with soft furnishings (mattresses, curtains, carpet/rugs) absorb reflections; a closet full of clothes is a common improvised vocal booth; (2) Background noise in Bangkok is significant — traffic, tuk-tuks, motorbikes, and construction mean outdoor or street-level recording requires careful location selection or significant noise reduction in post-production; (3) Remote guest recording: most Bangkok podcasters use the same remote interview tools (Riverside.fm, Zencastr, Descript) as anywhere — internet quality on Thai fiber connections is generally good; (4) Community access: the Bangkok creator community (Bangkok Bloggers, Bangkok Digital Nomads Facebook group) connects podcast creators for cross-promotion and studio space sharing.",
  },
  {
    name: "Music Production in Bangkok",
    emoji: "🎵",
    area: "Home studios throughout Bangkok, professional recording studios in the music industry area (around RCA and entertainment districts), music equipment retailers at Pantip Plaza and music shops on Mahesak Road",
    price: "Recording studio hourly ฿1,500–5,000; Home studio setup ฿15,000–100,000+; Session musician ฿1,000–5,000/hour; Mixing/mastering: ฿3,000–15,000/track",
    why: "Bangkok has a developed music production scene — the city's music industry spans mainstream Thai pop (T-pop), the thriving Thai indie music scene, K-pop influenced Thai acts, Thai hip-hop (which has emerged significantly since 2016), electronic music production, and traditional Thai music fusion projects. The music production infrastructure is accessible: recording studios ranging from home bedroom setups to professional SSL-equipped studios, session musicians skilled in both Thai and Western traditions, affordable mastering services, and a music equipment market that stocks professional equipment at prices competitive with online importing. Bangkok's music technology community (Ableton Live, Logic Pro, FL Studio users) is active and connects online through production communities. Several Bangkok-based music producers have achieved international recognition in the K-pop and Asian pop production sphere.",
    tip: "Bangkok music production resources: (1) Mahesak Road area (near Silom) has the highest concentration of music equipment shops — guitars, synthesizers, recording interfaces, and both new and used gear; (2) Online music production communities in Thailand (Facebook groups for Thai producers, YouTube channels by Thai music educators) are accessible in English and Thai; (3) Session musicians: the live music scene around RCA, Thong Lor, and Silom produces session musician talent available for studio recording — connecting through musicians at live shows or through venue relationships is the most direct path; (4) Collaboration culture: Bangkok's music scene is collaborative — attending open mics, instrument-specific jams, and music events builds connections faster than cold outreach.",
  },
  {
    name: "Live Music Recording & Events",
    emoji: "🎸",
    area: "Live music venues throughout Bangkok — Saxophone Pub (Phaya Thai), Tropic City, Smalls, Maggie Choo's, Parking Toys, Zudrangma Records",
    price: "Live venue entry ฿0–500; Live recording permit (varies); Live concert photography (media credential required for large shows)",
    why: "Bangkok's live music scene is one of the most diverse in Southeast Asia — the city hosts everything from intimate jazz sets in century-old buildings to massive outdoor festivals, Thai indie acts building their following to international touring artists on their Southeast Asia legs. The variety of live music available on any given night in Bangkok: traditional Thai classical music at cultural venues, jazz standards at expat bars, Thai hip-hop and R&B at youth-oriented clubs, electronic music from internationally touring DJs, Thai country music (luk thung) at northeastern Thai restaurants and special events, and the Thai indie rock/pop bands that play the Thong Lor to RCA circuit. Bangkok also hosts major music festivals: Big Mountain Music Festival (Khao Yai, November) and Cat Expo are annual events that draw massive domestic audiences.",
    tip: "Bangkok live music discovery: (1) The 'Bangkok Events' or 'Bangkok Music' Facebook events section is the most current source for shows; (2) Zudrangma Records (Thong Lor) is both a shop and cultural hub for alternative Thai music — staff recommendations and their event nights are the best entry point for Thai alternative music; (3) Wednesday nights at Saxophone Pub (Phaya Thai, near BTS Victory Monument) run the longest-running jazz night in Bangkok with genuinely high-quality musicians; (4) The Thai live music economy: most Bangkok live music venues pay bands through door share or flat fee — the economics are tight, which means getting to shows early and supporting artist merchandise and physical music is genuinely impactful for the musicians.",
  },
];

export function BangkokPodcasting() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎙️ Bangkok podcasting & music — audio production, music studios & live music scene
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
