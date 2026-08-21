const INFO = [
  {
    name: "Bangkok Improv Comedy Community",
    emoji: "🎭",
    area: "Bangkok's English-language performance venues (Brick Bar area, Ekkamai), comedy bar nights",
    price: "Show ticket ฿250–500; Improv workshop ฿600–1,200/session",
    why: "Bangkok has a small but energetic English-language improv comedy scene — driven by expat comedians, English-speaking Thai performers, and international comedy circuit performers passing through. Regular improv shows, open mics, and comedy nights happen throughout Bangkok's calendar. The format (short-form games-based improv vs. long-form Harold or Armando shows) varies by group. Bangkok's comedy scene intersects with its amateur theatre and performance art communities, creating cross-disciplinary performances. The COVID period forced the scene to reinvent online — it emerged with new energy and formats.",
    tip: "Finding Bangkok improv: Bangkok Improv (BKKIMPROV) on Facebook and Instagram is the primary community hub — regular workshop announcements and show dates. Spontaneous Productions Bangkok and The Company (separate groups) run shows at different venues. For non-native English speakers: many Bangkok improv groups welcome Thai-language participation — Thai comedy improv (particularly short-form games) is growing. Workshops are typically bilingual (Thai-English) or English-only depending on the group. First show attendance: improv shows welcome audience newcomers — participation games at shows are optional, not mandatory.",
  },
  {
    name: "Stand-Up Comedy & Open Mics",
    emoji: "🎤",
    area: "Bars in Silom, Ekkamai comedy venues, rotating venue nights",
    price: "Open mic free–฿200 audience; Show ฿300–800",
    why: "Bangkok's English stand-up comedy scene has grown significantly — regular open mic nights where comics test new material, monthly headliner shows (both local Bangkok comics and internationally touring comedians), and amateur comedy nights that welcome first-timers. The international open mic circuit includes Bangkok (along with Singapore, Hong Kong, and Kuala Lumpur) as part of the Southeast Asian comedy loop — established comics from Australia, UK, US, and India pass through Bangkok regularly. Thai stand-up comedy (in Thai language) has its own parallel explosion through Netflix specials and YouTube, creating a broader comedy culture even for non-English speakers.",
    tip: "Bangkok comedy scene practical info: Bang Comedy Club and The Laugh Factory Bangkok (and rotating equivalents as venues open and close) are the primary English stand-up venues — search Facebook for current active venues. Open mic nights: most welcome first-time comics — arrive early, put your name on the list, get 5 minutes. The Bangkok comedy community is welcoming to beginners. For headliner shows: check ComedyMania Bangkok Facebook page which aggregates upcoming shows across venues. International comics in Bangkok: the comedy circuit runs through Bangkok October–April primarily, with quieter summers.",
  },
  {
    name: "Theatre, Acting & Performance Arts",
    emoji: "🎬",
    area: "Bangkok Community Theatre, various performance venues, Patravadi Theatre, Sala Chalermkrung",
    price: "Show tickets ฿300–1,500; Acting workshop ฿800–2,000/session",
    why: "Bangkok has both Thai-language classical and contemporary theatre and English-language community theatre — Bangkok Community Theatre (BCT) is the primary English-language amateur theatre organization, producing 3–4 full productions per year (musicals, plays, contemporary works) with open auditions for both roles and production roles. Patravadi Theatre (Bangkok's pioneering contemporary dance-theatre venue) and Thailand Cultural Centre host professional productions. The Bangkok arts calendar includes visiting international productions. The overlap between expat and international schools (where theatre programs are strong) and adult community theatre creates a continuous talent pipeline.",
    tip: "Joining Bangkok Community Theatre: BCT auditions are open to all English speakers regardless of experience — their Facebook page announces audition dates. Production cycles run September–November and February–April approximately. Technical theatre roles (lighting, sound, set building, costumes) are also open to volunteers. For Thai theatre: Gateway Bangkok (Bangkok's main theatrical booking platform) lists both Thai and English productions across venues. Dance theatre: Patravadi Theatre's productions integrate Thai classical dance forms with contemporary choreography — unique to Thailand's performance tradition and highly recommended for visitors interested in contemporary art.",
  },
];

export function BangkokImprov() {
  return (
    <div className="rounded-2xl border border-yellow-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-800 mb-3">
        🎭 Improv, comedy & theatre in Bangkok — open mics, stand-up shows & community theatre
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-yellow-800">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
