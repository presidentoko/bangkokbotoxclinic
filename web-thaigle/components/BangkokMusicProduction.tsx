const SPOTS = [
  {
    name: "Music Recording Studios — Bangkok",
    emoji: "🎚️",
    area: "Thonburi, Ladprao, and major recording studio belt (Vibhavadi Rangsit area)",
    price: "Studio hourly ฿800–3,000; Full-day ฿5,000–15,000; Package recording",
    why: "Bangkok has a professional recording studio infrastructure built around Thailand's active Thai pop (T-pop), luk thung (Thai country), and film scoring industries. International artists on Southeast Asia tours occasionally record in Bangkok. The studio ecosystem includes rooms with vintage analog gear (Neve consoles, tube outboard) alongside modern Pro Tools/Logic setups. Thai producers and engineers with international training work across these facilities. For independent musicians seeking affordable studio time with real acoustic spaces, Bangkok offers significantly lower costs than equivalent studios in Tokyo, Singapore, or Seoul.",
    tip: "Finding Bangkok recording studios: GMM Grammy (Thailand's largest music company) operates commercial-grade studios. Independent studios in the Ladprao and Vibhavadi areas cater to mid-budget sessions. Mastering services (separate from recording) are available from several specialized mastering engineers in Bangkok whose work transfers well to international release platforms. Bring your own storage media (USB, portable SSD) for session files — studio policies vary on session data.",
  },
  {
    name: "Music Equipment — Amorn Sammak & Silom Music Row",
    emoji: "🎸",
    area: "Pratunam (Amorn Sammak); Silom Road; Ratchadaphisek music shops",
    price: "Instruments ฿2,000–200,000+; Rental ฿500–2,000/day",
    why: "Bangkok has concentrated music equipment districts — Amorn Sammak (near Pratunam) is Thailand's most famous musical instrument retailer with huge floor space covering guitars, keys, drums, brass, and accessories. The Silom area has multiple smaller guitar and audio equipment shops. Import duties mean that international brand instruments are priced similarly to or slightly higher than Europe/US — but lesser-known Asian brands (Japan, Korea, Taiwan) are often better value. Used instrument shops in Bangkok's music districts offer vintage gear at locally competitive prices.",
    tip: "Bangkok music shopping tips: Amorn Sammak (Ampawan) is the flagship — test instruments in-store (staff are knowledgeable and expect you to play). For audio production gear, SoundStation at Pratunam and similar audio retailers carry professional recording equipment. Used gear market: Thailand has Facebook groups for used musical instruments — 'Bangkok Gear Exchange' and specific instrument groups (guitarists, keys players). Renting instruments for recording sessions is practical for non-resident musicians — many studios can arrange rental through partner shops.",
  },
  {
    name: "Bangkok Music Scene — Live Venues & Open Mics",
    emoji: "🎶",
    area: "Thonglor (jazz), RCA (clubs), Ekkamai (indie), Sukhumvit Soi 11",
    price: "Concert tickets ฿200–1,500; Open mic nights free–฿100 drink minimum",
    why: "Bangkok's live music scene spans jazz (Saxophone Pub, longest-running jazz club), indie/alternative (Fat Radio, Parking Toys), electronic (Neon Bangkae, Glow), and the mainstream commercial Thai music venue circuit. The RCA (Royal City Avenue) entertainment district has large-capacity live venues. Thonglor's Saxophone Pub has been Bangkok's jazz institution since 1987 — nightly live jazz 7 days per week with rotating bands including genuine professional musicians. Open mic nights at smaller venues (Blue Hour, Adhere the 13th) provide performance opportunities for visiting musicians.",
    tip: "Bangkok music performance opportunities for visitors: open mic nights at Adhere the 13th Blues Bar (Soi Sukhumvit 13, long-running Monday night open mic) and similar venues are genuinely accessible to walk-in performers. Bring your own instrument if you want to use a specific guitar/keyboard; house instruments (usually a basic guitar and keyboard) are provided. For jazz musicians: sit in opportunities at smaller Bangkok jazz venues occasionally available — asking the bandleader respectfully during a set break is the appropriate protocol.",
  },
];

export function BangkokMusicProduction() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🎚️ Music production in Bangkok — recording studios, instrument shops & live music scene
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
            <div className="text-[10px] text-violet-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
