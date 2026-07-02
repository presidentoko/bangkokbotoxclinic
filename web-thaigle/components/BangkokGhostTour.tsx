const SPOTS = [
  {
    name: "Thai Ghost Mythology & Spirit Culture",
    emoji: "👻",
    area: "Throughout Bangkok — spirit houses at every building, Mae Nak shrine (Phra Khanong), Phra Nang Cave (remote), Erawan Shrine",
    price: "Spirit house offerings ฿50–500; Mae Nak Shrine visit free; Ghost tour ฿1,000–2,500",
    why: "Thailand's spiritual and ghost belief system is one of the world's most actively practiced and integrated into daily life — spirit houses (san phra phum) stand outside every building in Thailand, from humble homes to five-star hotels, and receive daily offerings of flowers, incense, and food. The relationship between the living and supernatural entities is not a historical relic but an active framework that guides Thai behavior: auspicious dates for marriage and business ventures are calculated, sacred objects (amulets, Buddhist takrut) are worn for protection, and phi (spirits/ghosts) are avoided through specific behavioral codes. Bangkok's specific famous ghost story is Mae Nak (Nang Nak) — a spirit legend centered at Wat Mahabut in Phra Khanong district. Mae Nak is Thailand's most famous ghost, subject of countless films and TV dramas — the shrine at Wat Mahabut receives hundreds of supplicants daily including pregnant women seeking protective amulets.",
    tip: "Engaging with Thai spirit culture respectfully: spirit houses outside buildings should be treated with visible respect — don't step on the platform or leave trash near them. Offerings at shrines (flowers, fruit, incense, sometimes red Fanta — red is auspicious) are acts of respect and any person can make them. Mae Nak Shrine at Wat Mahabut (Sukhumvit area, accessible by BTS On Nut then local transport): the shrine is inside a temple complex — appropriate temple dress required, respectful behavior expected. The Erawan Shrine (Ratchaprasong intersection, very accessible by BTS): one of Bangkok's most active shrines — the Brahma deity Erawan is surrounded by constantly offered flowers and garlands, traditional dance performances hired by supplicants fulfilling vows.",
  },
  {
    name: "Bangkok Ghost Tours & Haunted Locations",
    emoji: "🏚️",
    area: "Old Bangkok, Chinatown, abandoned buildings, the Grand Palace area, Rattanakosin Island",
    price: "Organized ghost tour ฿1,500–3,000; Independent exploration free; Transportation to sites variable",
    why: "Bangkok's ghost tourism exists at the intersection of genuine Thai belief in the supernatural and the commercial entertainment tourism market — the resulting tours range from thoughtful cultural experiences to theatrical entertainment. Bangkok's most ghost-story-associated locations include: the old hospitals and mental health facilities (some now renovated, some abandoned) in Bangkok's older districts; Chinatown (Yaowarat) with its layered history of multi-generational communities and tragic deaths; certain old hotels and colonial buildings associated with specific historical incidents; and various riverside historical sites. Thai ghost story tradition is specific about ghost types: krasue (floating head), phi phong (evil spirit possessing people), Mae Nak (devoted wife spirit), and many others each have specific characteristics and associated behaviors.",
    tip: "Ghost tour assessment: look for tours led by Thai guides with genuine cultural knowledge rather than Western-format jump-scare entertainment. The best ghost tours in Bangkok provide cultural context about Thai supernatural belief systems — understanding WHY these stories matter to Thai culture is more valuable than the atmospheric theatre alone. Independent ghost tour planning: Bangkok's spirit houses and active shrines provide genuine insight into supernatural belief without needing a commercial tour — walking around Chinatown at night, visiting Wat Mahabut, or exploring the riverfront old city area with a ghost-story framework is freely accessible. The National Museum area of Rattanakosin Island has the historical density that makes it Bangkok's most atmospheric area for historical ghost association.",
  },
  {
    name: "Thai Horror Films & Supernatural Culture",
    emoji: "🎬",
    area: "Bangkok cinemas (SF Cinema, Major Cineplex, IMAX locations), film-related tourism sites",
    price: "Cinema ticket ฿180–350; VIP cinema ฿500–900; Film location tours ฿1,500–3,000",
    why: "Thailand has produced some of Asia's most acclaimed and internationally recognized horror films — the Thai horror genre has a distinctive aesthetic characterized by long black-haired female ghosts (phi phong), traditional supernatural elements, and genuine connection to Thai folk belief rather than Western horror tropes. Internationally recognized Thai horror: Shutter (2004), Nang Nak (1999, the Mae Nak story), Bangkok Haunted, 4bia anthology, and The Medium (2021, Thai-Korean co-production nominated for Best International Film). Bangkok's major cinema chains show both mainstream Hollywood and Thai horror films — Thai horror film releases are culturally significant events with queues and social media conversation comparable to major Western releases. Film-related tourism: locations used in Thai horror films have become minor pilgrimage sites — film location tours cover some of these.",
    tip: "Thai horror viewing guide: Nang Nak (1999) is considered the definitive Mae Nak telling and provides the best cultural entry point into Thai supernatural belief through cinema. Shutter (2004) blends photography and ghost revenge in a way that resonated internationally and generated Hollywood remake (2008). The Medium (2021) — co-produced with Korea's Bong Joon-ho team — explores Thai spirit possession and shamanism in a mockumentary format; it's ethnographically rich and genuinely frightening. Bangkok cinemas: Major Cineplex and SF Cinema are the major chains; Paragon Cineplex at Siam Paragon has the most premium options including IMAX. Thai film seasons: the October–November period before Loy Krathong often sees Thai horror film releases coinciding with the spirit festival season.",
  },
];

export function BangkokGhostTour() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        👻 Bangkok ghost culture — Thai spirit mythology, haunted tours & horror cinema
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
