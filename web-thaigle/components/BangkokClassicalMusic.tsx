const SPOTS = [
  {
    name: "Western Classical Music in Bangkok",
    emoji: "🎻",
    area: "Thailand Cultural Centre (Ratchadapisek MRT), River City Bangkok concert space, Mahidol University recital halls",
    price: "Bangkok Symphony Orchestra ฿500–3,000; Chamber concert ฿300–1,500; Student recital free–฿200",
    why: "Bangkok has a genuine Western classical music community sustained by the Bangkok Symphony Orchestra (BSO, the primary professional orchestra), music faculties at Mahidol College of Music (regarded as Southeast Asia's leading music conservatory) and Chulalongkorn University's music department, and a significant expatriate classical music audience. The Thailand Cultural Centre's main concert hall is the primary venue for classical concerts — with regular guest orchestras from Japan, Korea, and Europe. Mahidol's music faculty concerts at their Salaya campus include student and faculty recitals at no or minimal charge. Bangkok's international school system generates substantial demand for classical music instruction and youth orchestras.",
    tip: "Bangkok Symphony Orchestra: the BSO performs a regular season at Thailand Cultural Centre — subscriptions and single tickets available through ThaiTicketMajor. The season typically runs September through March, with guest soloists and conductors. Mahidol University Music: the college hosts regular high-quality concerts at their campus (accessible by Salaya shuttle from MBK) and occasionally at Bangkok venues — their faculty includes internationally trained musicians of significant caliber. Chamber music Bangkok: Bangkok's chamber music scene (string quartets, piano trios, song recitals) has several informal series in hotel ballrooms, cultural centers (French Institute, Goethe Institut), and university performance spaces — these provide intimate access to excellent musicianship.",
  },
  {
    name: "Thai Classical & Traditional Music",
    emoji: "🎵",
    area: "National Theatre Bangkok (Ratchini area), Thai classical music performances at major temples, cultural dinner shows",
    price: "National Theatre performance ฿100–500; Cultural dinner show ฿1,500–3,500; Temple performance free",
    why: "Thai classical music (piphat ensemble — including ranat xylophones, ching cymbals, klong drums, and melodic wind instruments) and mahori (mixed ensemble for ceremonial contexts) represent a sophisticated musical tradition with complex rhythmic cycles, modal systems, and a vast repertoire. The National Theatre (near Sanam Luang) hosts regular Thai classical music and dance performances at affordable prices. Thai classical music appears in its most authentic context at major Buddhist temple ceremonies, royal events, and formal cultural occasions — the relationship between Thai classical music and religious/royal practice is integral. Thai instruments of particular note: the ranat ek (lead xylophone, bamboo keys over a boat-shaped resonator) and the jakhe (three-stringed floor zither) have distinctive Thai sonic personalities.",
    tip: "Experiencing Thai classical music: Sala Chalermkrung Royal Theatre (Chinatown area, near Wat Traimit) hosts Khon masked dance drama with live piphat accompaniment — these productions represent Thailand's most spectacular traditional performing arts. Cultural dinner shows: Sala Rim Naam at the Oriental Hotel and similar hotel-associated Thai cultural shows provide accessible (if somewhat formal) Thai classical music and dance in combination with Thai food — quality varies between tourist-show and genuine performance. Thai traditional music instruction: Mahidol University's Thai music faculty and several community cultural organizations offer Thai instrument instruction to interested students — the ranat and jakhe have foreign students.",
  },
  {
    name: "Jazz & Contemporary Music",
    emoji: "🎷",
    area: "Jazz clubs (Tawandang German Brewery, Saxophone Pub at Victory Monument, Brown Sugar Jazz Boutique)",
    price: "Jazz bar cover ฿200–600 (drinks often compulsory); Live music venue ฿200–500; Festival ticket ฿500–3,000",
    why: "Bangkok's live music scene beyond the party districts includes a genuine jazz ecosystem — Saxophone Pub near Victory Monument (one of Bangkok's most venerable jazz venues, open since 1987) and Brown Sugar in Pathumwan are institutions that have sustained jazz performance through Bangkok's entertainment evolutions. Bangkok's Thai jazz musicians blend Thai melodic sensibility with Western jazz harmony in ways distinctive to the scene. The Bangkok Jazz Festival (annual, free at Lumphini Park or ticketed) and various venue-based series keep live jazz accessible. Bangkok's film score and commercial music production industry is significant — Mahidol's jazz-trained graduates feed directly into this sector. Korean and Japanese jazz musicians appear in Bangkok's scene given those countries' strong jazz traditions and Bangkok's Asian connections.",
    tip: "Bangkok jazz venue practical info: the cover charge model is rare — most Bangkok jazz bars charge minimum drink purchase rather than door fees. Saxophone Pub Victory Monument: the most authentically Bangkok experience among jazz venues — the venue has decades of history, regular local musicians, and a genuinely mixed Thai/expat crowd. For discovering emerging Thai jazz musicians: following the Facebook pages of music department alumni groups from Mahidol provides early notice of performances. Blues and soul: Bangkok's blues community is smaller but active — an Americana/roots music scene concentrated among long-term American and British expats organizes occasional events and jams, discoverable through the expat community social media.",
  },
];

export function BangkokClassicalMusic() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🎻 Music in Bangkok — classical orchestra, Thai traditional & jazz live music
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
