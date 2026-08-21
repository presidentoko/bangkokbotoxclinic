const SPOTS = [
  {
    name: "Salsa, Bachata & Latin Dance Bangkok",
    emoji: "💃",
    area: "RCA (Royal City Avenue) Latin dance bars, dedicated salsa studios in Sukhumvit (Soi 11, Thonglor), weekly social dance nights throughout Bangkok, rooftop dance parties in hotel venues",
    price: "Beginner salsa class: ฿400–800; Social dance night entry: ฿200–500 (often includes 1 drink); Monthly dance pass: ฿3,000–6,000; Private lesson: ฿1,000–2,000/hour",
    why: "Bangkok has a vibrant Latin dance social scene driven by the city's large international expat community, Thai dancers who have embraced Cuban and Colombian dance culture, and Bangkok's status as a regional hub for traveling dance instructors and performers. The weekly social calendar (socials are informal dance parties where the floor is open for anyone to dance with anyone) typically includes 3–5 options across salsa cubana, salsa on2 (New York style), bachata, kizomba, and merengue. Bangkok's salsa community is notably international and social — the combination of expat professionals (many from Latin America, Europe, and North America) and enthusiastic Thai dancers creates a genuinely diverse social environment. Several Bangkok salsa schools regularly host touring international instructors for festival-style weekends (workshops, performance shows, social nights) that bring concentrated learning opportunities.",
    tip: "Bangkok salsa community navigation: (1) Salsa cubana vs salsa on2: Bangkok's community practices both; Cuban style (circular, casino) is more casual and improvisational; on2 (linear, slot) is more structured with precise timing — choosing a style to learn first simplifies early progress; (2) Social dancing etiquette: (a) leaders ask followers to dance; (b) rejections should be graciously accepted; (c) offering brief, gentle feedback during the dance is generally unwelcome; (d) thank your partner after each song; (3) Dress code at socials: comfortable clothes that allow free movement; men typically wear leather-soled shoes (spin-friendly); women often wear character heels (specialized dance shoes with suede or leather soles); (4) Finding the calendar: Bangkok's Latin dance scene posts its weekly social calendar on Facebook groups ('Salsa Bangkok,' 'Latin Dance Bangkok') and through studio event pages; (5) Beginner welcoming: most Bangkok socials are welcoming to absolute beginners — experienced dancers generally enjoy dancing with beginners and the culture is positive; arriving for the pre-social class (often included with entry) provides confidence before the open floor.",
  },
  {
    name: "Hip-Hop, Breaking & Street Dance Bangkok",
    emoji: "🕺",
    area: "Bangkok street dance studios in Sukhumvit and Silom areas; open street sessions at Central World, Siam, and other malls on weekend evenings; underground cypher spots in Bang Rak and Silom; annual B-Boy tournaments",
    price: "Hip-hop/breaking class: ฿350–700 per session; Monthly studio pass: ฿2,500–5,500; Breaking (B-Boy) session: ฿300–600; Competition registration: ฿300–1,000",
    why: "Bangkok's hip-hop and breaking culture is a significant subculture that operates largely beneath the tourist radar — a genuine urban youth movement with deep roots in Bangkok's street culture, music scene, and youth fashion. Breaking (what was formerly called 'breakdancing') arrived in Thailand in the 1990s and developed into a serious competitive scene, with Thai B-Boys and B-Girls competing in Asian and international championships. The urban street dance culture encompasses breaking, popping, locking, waacking, krump, and house — each with Bangkok-based crews and communities who maintain their distinct traditions. Bangkok's shopping mall culture has an unexpected relationship with street dance: major malls at Siam, Central World, and along Sukhumvit occasionally host breaking cyphers and street dance showcases as entertainment — making these accessible, visible cultural moments for anyone in the area. The underground side of Bangkok's hip-hop culture (clubs, cyphers, freestyle sessions) runs parallel to the visible commercial culture and offers depth for genuine enthusiasts.",
    tip: "Bangkok street dance community access: (1) Mall shows are the visible entry: scheduled breaking and hip-hop showcases at Siam Square One, Central World, and similar venues provide accessible exposure to Bangkok's street dance culture; check mall event calendars and Instagram accounts; (2) Studio class approach: Bangkok has dedicated street dance studios in Sukhumvit (around Soi 12–31) with drop-in classes in hip-hop, popping, locking, and breaking fundamentals — these are accessible without community connections; (3) Bangkok B-Boy scene: Breaking is an Olympic sport since Paris 2024; Thailand's competitive breaking community is well-organized with regular local competitions and preparation for international events; (4) Cypher culture: an informal cypher (improvisational circle where dancers take turns in the center) at Siam Square or street locations on weekends is the authentic street dance experience — spectators are welcome, participation requires confidence but is often invited; (5) Thai pop dance: alongside hip-hop street dance, Thailand has an enormous K-pop cover dance culture (Thai youth learning Korean idol choreography exactly) — these communities are adjacent but distinct.",
  },
  {
    name: "Ballroom, Tango & Social Dance Bangkok",
    emoji: "👫",
    area: "Ballroom dance studios throughout Bangkok (Sukhumvit area concentrated), Argentine Tango community meets in various Bangkok venues, social dance nights at hotel ballrooms and dedicated venues",
    price: "Ballroom group class: ฿500–1,000 per session; Argentine Tango class: ฿400–900; Social tango milonga entry: ฿200–500; Private ballroom lesson: ฿1,500–3,000/hour; Competition coaching: ฿3,000–5,000/hour",
    why: "Bangkok's ballroom and social dance scene occupies a sophisticated corner of the city's entertainment landscape — serving both the Thai upper-middle-class community (formal ballroom dance has maintained social status connotations in Thailand's social elite) and the international expat community maintaining dance traditions from their home countries. Argentine Tango has a particularly dedicated Bangkok community — the tango culture (milonga social evenings where dancers improvise to traditional tango music, the learning culture emphasizing embellishments and connection rather than competition) creates one of the most intimate social dance environments in the city. Bangkok's ballroom scene produces competitive dancers who contest at regional and international competitions — the studios that serve competitive dancers maintain high coaching standards. Waltz, foxtrot, quickstep, tango (ballroom variety), cha-cha, samba, rumba, paso doble, and jive (the International Latin and Ballroom disciplines) all have representation in Bangkok's dance studio ecosystem.",
    tip: "Bangkok formal dance community entry: (1) Argentine Tango entry: Buenos Aires ethos transferred to Bangkok — milongas follow the cabeceo invitation system (eye contact invitation), tandas (sets of 3–4 songs with the same partner before a cortina/break), and the close embrace that requires trust developed gradually; starting with group classes before attending milongas provides essential vocabulary; (2) Thai ballroom context: Ballroom dancing in Thailand is associated with the social upper class and has a competitive scene affiliated with the World Dance Council (WDC); studios near hotels in Sukhumvit serve both Thai competitive students and expat recreational dancers; (3) Hotel ballrooms: several Bangkok luxury hotels (Sofitel, Plaza Athenée, Sheraton) host occasional ballroom gala evenings and New Year dance events — checking hotel event calendars finds accessible formal dance occasions; (4) Dance partners: unlike the Latin dance scene where social dancing is common between strangers, formal ballroom practice typically involves regular partner relationships; studios can often introduce suitable practice partners; (5) Competition calendar: the Thai Ballroom Dance Federation annual competition schedule, and occasional WDC Asian Circuit events in Bangkok, provide accessible spectator opportunities to see high-level competitive dancing.",
  },
];

export function BangkokSalsaDance() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        💃 Bangkok dance scene — salsa, hip-hop, breaking & ballroom communities
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-rose-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
