const SPOTS = [
  {
    name: "Golf Simulators in Bangkok",
    emoji: "⛳",
    area: "Golf simulator venues throughout Bangkok — shopping malls, standalone venues, and hotel sports facilities",
    price: "Golf simulator per hour: ฿500–1,500; Monthly membership: ฿5,000–20,000; Private room booking (group): ฿2,000–5,000/hour",
    why: "Bangkok's golf simulator market has expanded dramatically since 2020 — the combination of Thailand's strong golf culture (Thailand has over 250 golf courses), Bangkok's year-round heat that limits outdoor play hours, and the technology's improvement in shot accuracy and course rendering has created a dedicated golf simulator scene. Bangkok simulator venues use high-end systems: Trackman, GS Navi, Golfzon, and similar premium systems that accurately capture ball speed, spin, launch angle, and club data with high-speed camera tracking. Bangkok simulator clubs offer access to virtual versions of famous world courses — Augusta, Pebble Beach, St Andrews, and premium Thai courses. The social format of the simulator room (typically 4–6 players sharing a private room with seating, food service, and a large screen) has made golf simulators a popular corporate and social entertainment option.",
    tip: "Bangkok golf simulator practical tips: booking ahead is essential for weekend and evening slots — the most popular venues (particularly those with high-end Trackman or GS Navi systems) fill up 3–5 days in advance. For non-golfers: the simulator beginner format is genuinely accessible — staff assistance with basic stance and swing guidance makes the experience playable for complete beginners. Game formats: most Bangkok simulators offer pure driving range mode (just practicing shots), full 18-hole rounds, and mini-games (longest drive contests, target practice, putting challenges) that work for mixed-skill groups. Recommend: check which simulator system the venue uses — Trackman and GS Navi have the most accurate ball tracking; lower-end systems may frustrate serious golfers who want accurate data.",
  },
  {
    name: "Driving Ranges in Bangkok",
    emoji: "🏌️",
    area: "Driving ranges throughout Bangkok — major facilities at Golf Club Bangphra, Krungthep Kreetha, Royal Bangkok Sports Club adjacent ranges",
    price: "Bucket of balls (40–50 balls): ฿50–150; Premium range with analysis: ฿200–400/hour; Club rental: ฿100–300",
    why: "Bangkok has numerous golf driving ranges serving the large domestic golf-playing population — the driving range is culturally significant in Thai golf culture as a practice and social space independent of full course play. Bangkok's premium driving ranges offer multi-level hitting bays with automatic tee systems, flight tracking, and refreshment service. The practice culture among serious Thai golfers involves regular range sessions with swing coaches — many Bangkok ranges have attached PGA-qualified coaches offering lessons. For tourists and casual players, Bangkok driving ranges are accessible and affordable ways to practice golf in between sightseeing or before committing to full course rounds. Evening range sessions are popular as Bangkok's heat eases — many ranges are lit for nighttime use.",
    tip: "Bangkok driving range tips: identifying where the range ball quality is — better ranges use uniform range balls that behave consistently (allowing accurate swing feedback); lower-quality ranges use damaged or mismatched balls that give misleading feedback. Range session timing: early morning (6–8am) and late evening (5–8pm) sessions avoid peak heat. Lesson availability: driving range coaches in Bangkok typically charge ฿500–1,500 for an hour lesson — significantly less than equivalent coaching in Western markets, with many coaches trained at Thai PGA programs. Group practice: bringing a few people to split a large bucket of balls is the most social driving range format — no formal group booking needed.",
  },
  {
    name: "Disc Golf in Bangkok",
    emoji: "🥏",
    area: "Disc golf courses emerging in Bangkok parks — Benchakitti Park, Chatuchak Park, and organized disc golf community",
    price: "Disc golf is free-to-play (park access); Disc purchase: ฿300–700 per disc; Organized round/event: ฿0–200",
    why: "Disc golf is an emerging activity in Bangkok — a small but enthusiastic community of disc golfers has established informal and semi-formal courses in Bangkok's larger parks. The game (frisbee disc thrown at elevated metal basket targets over a course of 9 or 18 'holes') translates well to Bangkok's park settings. Chatuchak Park and Benchakitti Forest Park (near MRT Queen Sirikit station) have been used for informal disc golf play. The Bangkok disc golf community is internationally connected — many participants are expats who played disc golf in home countries, and the global network of the sport means Bangkok visitors who disc golf at home can connect with local players through Disc Golf Scene or PDGA (Professional Disc Golf Association) Thailand chapter connections. Equipment is available through online import and disc golf community members.",
    tip: "Bangkok disc golf community access: the Facebook group 'Bangkok Disc Golf' or PDGA Thailand group is the active coordination channel for casual rounds, organized events, and equipment sourcing. Disc golf in Bangkok parks requires awareness of park visitors — unofficial courses in parks mean disc golf must be played with significant care for other park users (never throwing across walking paths when people are present). The disc golf learning curve: a basic forehand (sidearm) throw is learnable in a single session for most people and is sufficient to play casually; the full disc golf technique library develops over months of practice. Starting discs: a mid-range disc (not a driver) is the best first disc purchase — drivers require significant skill to control and new players often lose distance vs. a well-thrown mid-range.",
  },
];

export function BangkokGolfSimulator() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        ⛳ Bangkok golf simulators & range sports — indoor golf, driving ranges & disc golf
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-emerald-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
