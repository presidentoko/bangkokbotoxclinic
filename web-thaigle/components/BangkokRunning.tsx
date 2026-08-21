const SPOTS = [
  {
    name: "Running in Bangkok — Routes & Parks",
    emoji: "🏃",
    area: "Lumphini Park, Benjakitti Park (Asoke), Chatuchak Park, riverside routes (Chao Phraya)",
    price: "All public parks free entry; parkrun Bangkok free (every Saturday 7am); Race entry ฿500–3,000",
    why: "Running in Bangkok is physically demanding but infrastructure-supported — the combination of heat, humidity (even at 5am in cool season the air is thick), and air quality requires adaptation but is manageable with timing and hydration strategy. Bangkok has designated running parks: Lumphini (2.5km perimeter loop, lighting for evening runs), Benjakitti Park (2km inner loop, 4km outer, excellent surfaces, popular with Bangkok runners), and Rama 9 Park (12km loop, large recreational park less central but with better air quality). The runner community in Bangkok is substantial — running clubs (BRC Bangkok Runners Club, Hash House Harriers, numerous expat-led groups) organize weekly runs throughout the city. Parkrun Bangkok provides a free weekly timed 5km.",
    tip: "Bangkok running timing strategy: the heat management window is narrow — 5:30–7:30am is the practical early window before heat becomes oppressive; 5:30–7pm after sundown is the evening alternative with lingering heat but cooling slightly. Lumphini Park advice: the park opens at 4:30am; the 6–7am period is when Bangkok's running community is most active — seeing others running confirms your timing. Hydration: carry water or know vending machine/convenience store locations on your route — dehydration onset is rapid in Bangkok's climate. Running shoes: regular road running shoes are fine for Bangkok's flat, paved routes; moisture-wicking technical running clothing is essential. Bangkok Air Quality Index: check AQI (iqair.com or AQICN Bangkok) before runs — when PM2.5 is above 150, even elite runners should modify outdoor training intensity.",
  },
  {
    name: "Bangkok Road Races & Events",
    emoji: "🏅",
    area: "Major road races throughout Bangkok, Bangkok Marathon (November), Chao Phraya route races",
    price: "5km fun run ฿500–1,000; 10km race ฿800–1,500; Half marathon ฿1,200–2,500; Full marathon ฿1,500–3,500",
    why: "Bangkok has an active road racing calendar — dozens of organized races throughout the year ranging from corporate fun runs to the Bangkok Marathon (the city's flagship event, typically in November along riverside routes). The Bangkok running event calendar has grown significantly with the Thai running boom of the 2010s-2020s — running has become a major middle-class Thai fitness and social activity, generating race demand across distances. The Amazing Thailand Marathon, PTT Bangkok Marathon, and various charity runs attract international participants. Thailand's race finisher medals and race shirts are often creatively designed — 'race shirt collecting' is a genuine community sub-culture among Thai runners. International runners in Bangkok marathons: the event's Bangkok backdrop (riverside, palace areas at dawn) makes Bangkok marathons photographically rewarding.",
    tip: "Bangkok marathon calendar: check 'Thailand race calendar' on running websites (JogJoy Thailand, Runday) for current schedules — events are added throughout the year. Registration: popular Bangkok races sell out months in advance — the Bangkok Marathon especially fills early. International participants: most Bangkok races provide English-language registration and race-day communication for international participants. Training groups: Bangkok running clubs welcome visiting runners to join training runs — parkrun is the lowest-barrier entry point (just show up Saturday 7am at Benjakitti Park with a barcode). Post-race food culture: Thai running events typically feature elaborate post-race food at the finish area — a significant draw for participants beyond the medal.",
  },
  {
    name: "Hash House Harriers — Bangkok",
    emoji: "🍺",
    area: "Variable locations — rotates weekly through Bangkok and surrounding provinces",
    price: "Hash run contribution ฿150–400 (includes beer/drinks at finish); Annual membership varies",
    why: "The Hash House Harriers — Bangkok (BHHH) is one of the world's oldest and most active hash chapters, operating since the 1970s. The Hash (self-described as 'a drinking club with a running problem') organizes weekly running trails through Bangkok's urban landscape and surrounding areas, combining 5–10km running with social drinking at the finish. The format: a trail is marked through urban neighborhoods, parks, or industrial areas with flour marks on the ground — hashers follow the trail with false leads and back-checks that keep the pack together. Bangkok's diverse urban landscape creates endlessly varied hash trails through neighborhoods, markets, industrial zones, and canal paths inaccessible through organized park routes. The social dimension is the point: the Hash is explicitly about community and irreverence as much as running.",
    tip: "Bangkok Hash finding: Bangkok has multiple hash chapters beyond the main BHHH — Nonthaburi Hash, Bangkok Ladies Hash, and others cater to different preferences. Each chapter runs weekly or fortnightly; the main chapters are listed on hash directories. What to expect: the finish is loud, social, and involves (optional) beer consumption — the 'on-on' songs, circles, and hash traditions are globally standardized but Bangkok-adapted. Appropriate attire: running clothes, running shoes, and ideally hash-colored shirt (if you own one) — most hashers just run in whatever they wear to run. Guest policy: most Bangkok hash chapters welcome guests/visitors — check with the chapter in advance about the hash day and location.",
  },
];

export function BangkokRunning() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🏃 Running in Bangkok — parks, road races, Bangkok Marathon & Hash House Harriers
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
