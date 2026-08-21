const SPOTS = [
  {
    name: "Thai Astrology & Fortune Telling Culture",
    emoji: "🔮",
    area: "Fortune tellers throughout Bangkok — concentrated near major temples (Erawan Shrine, Wat Traimit), Chatuchak market, traditional fortune teller seats at shopping mall entrance areas, and along Sukhumvit (professional fortune telling offices)",
    price: "Tarot/card reading: ฿300–1,000; Thai traditional fortune teller (60 min): ฿500–2,500; Palmistry: ฿200–800; Numerology consultation: ฿500–2,000; High-end fortune telling with certification: ฿2,000–10,000+",
    why: "Fortune telling and astrology are deeply integrated into Thai daily life — not as fringe superstition but as a mainstream practice consulted for important decisions across Thai society regardless of education level or social status. The Thai astrological tradition is distinct from Western astrology — based on the traditional Southeast Asian adaptation of Indian (Vedic) astrology combined with Chinese and Thai folk divination traditions. Thai fortune tellers (mor duu — หมอดู, literally 'doctor who sees') practice through: (1) Traditional Thai horoscope (horaa Thai) — based on birth year, month, day, and time; (2) Tarot cards (widely adopted); (3) Yi King (I Ching, the Chinese hexagram system); (4) Physiognomy (reading character and fortune from physical features); (5) Palmistry; (6) Numerology. Bangkok has fortune tellers ranging from temple-adjacent sidewalk readers catering to the general public to elite practitioners consulted by politicians and business executives before major decisions. The Erawan Shrine (BTS Chit Lom) is surrounded by card and tarot readers accessible to tourists.",
    tip: "Bangkok fortune telling guidance: (1) Temple fortune sticks (siam si): many Bangkok temples (Wat Saket, Wat Pho, Chinese temples) have traditional fortune stick sets — numbered bamboo sticks in a cylinder that you shake until one falls, then match to a numbered fortune slip; a meditative chance encounter with temple divination; (2) Quality indicators: legitimate Thai fortune tellers have regular clients, established reputation in their community, and charge fair fixed rates rather than escalating demands; (3) Language barrier: most traditional Thai fortune tellers work in Thai — bringing a Thai-speaking companion or using an interpreter greatly increases the depth of what's communicated; (4) Erawan Shrine area readers: the fortune tellers around Erawan Shrine are oriented toward tourists and some speak basic English; quality varies significantly; (5) Taking it seriously: treating the fortune telling experience with genuine curiosity rather than mockery (even if skeptical) produces better consultation quality; Thai fortune tellers are more forthcoming with clients who engage respectfully.",
  },
  {
    name: "Bangkok Spirit Houses & Animist Traditions",
    emoji: "🏯",
    area: "Spirit houses throughout Bangkok — every property in Thailand has one; particularly notable at Erawan Shrine, Central World (Grand Hyatt), and the Four-Faced Brahma Shrine; spirit house builder shops near Chatuchak",
    price: "Spirit house viewing: free; Spirit house offerings: ฿20–200 (flowers, incense, food); Spirit house ceremonies (phi song khrao): ฿500–5,000+; Custom spirit house commission: ฿5,000–100,000+",
    why: "Thailand's spirit belief system (phi — ผี, the animist tradition of spirits inhabiting places, objects, and phenomena) coexists with Buddhism in a practical syncretic arrangement that Thai people navigate comfortably. The spirit house (san phra phum — ศาลพระภูมิ) placed outside every building provides the resident spirit of the land a comfortable alternative dwelling so it doesn't occupy the main building — reducing misfortune and spiritual disturbance. Bangkok's spirit house culture is ubiquitous: the san phra phum outside a 7-Eleven receives the same daily fresh flower offerings and incense as the one outside a luxury hotel. The San Chao Pho Suea (Tiger God Shrine in Chinatown) and the Erawan Shrine (Brahma deity) attract enormous merit-making traffic — the Erawan Shrine is arguably Bangkok's most-visited religious site, with constant devotion from Thai supplicants and the perpetual engagement of traditional dance performers paid by successful petitioners as thanks offerings.",
    tip: "Bangkok spirit house etiquette: (1) Respect as baseline: walking around a spirit house (not between it and the building it protects), not sitting on or leaning against spirit houses, and approaching with the same quiet respect as a Buddhist temple creates appropriate visitor behavior; (2) Offering participation: purchasing jasmine garland offerings (฿20–40) and incense at the vendors near major shrines and placing them at the spirit house with a moment of quiet intention is welcomed regardless of faith background; (3) Erawan Shrine depth: the four-faced Brahma (Phra Phrom) at Erawan is not originally a Thai tradition but an Indian Brahmic deity imported into Thai popular religion; Thai Buddhist monks consider it inappropriate for Buddhists to petition Brahma, but this doesn't stop millions of Thai people; the complexity is itself culturally interesting; (4) Spirit house workshops: some Bangkok cultural centers and hotels offer workshops on Thai spirit belief that explain the animist framework and its relationship to Thai Buddhism more comprehensively; (5) Street shrines: throughout Bangkok, small roadside shrines (many with specific stories — accident sites, unusual historical events) are maintained by neighborhood communities; asking the shopkeepers nearby often surfaces fascinating local lore.",
  },
  {
    name: "Thai Lucky Charms & Amulet Culture",
    emoji: "📿",
    area: "Tha Prachan Amulet Market (near Sanam Luang/Grand Palace, Bangkok's largest amulet market), Chatuchak amulet section, Pak Khlong Talat area specialty shops, temple gift shops throughout Bangkok",
    price: "Basic mass-produced amulet: ฿50–500; Mid-range amulet (temple blessed): ฿500–10,000; Collector-quality antique amulet: ฿10,000–millions; Certified Luang Pho Thuad amulet: ฿10,000–50,000+",
    why: "Thai amulet culture (phra khrueang — พระเครื่อง) is one of Southeast Asia's most elaborate and economically significant folk religious traditions — a multi-billion baht market in which religious objects (mostly tiny Buddhist images, but also animal forms, mythological figures, and consecrated natural objects) are believed to confer protection, luck, love, wealth, and other benefits based on the sanctity of the monk who consecrated them. The market is entirely serious: major Thai banks have loan departments specifically for amulet investors; newspapers run weekly amulet price supplements; wealthy Thais wear elaborate necklaces of multiple amulets; and monks with reputations for powerful consecrations become celebrities with queues of devotees requesting their amulets. The Tha Prachan Amulet Market near the Grand Palace is Bangkok's most important amulet marketplace — hundreds of vendors selling everything from ฿50 mass-produced amulets to museum-quality antique pieces worth hundreds of thousands of baht. Authentication, provenance, and the monk's reputation all affect value in this highly complex market.",
    tip: "Bangkok amulet culture navigation: (1) Tha Prachan Market access: take the Chao Phraya Express Boat to Tha Chang pier — the amulet market begins immediately at the waterfront and extends along the street parallel to Sanam Luang; (2) Respect protocol: Thai amulets are considered sacred objects — they should never be placed below waist height (tables or belts are okay; floors never), treated irreverently, or pointed at; (3) Collector vs. spiritual: the amulet market serves both genuine devotees seeking protective power and secular collectors who appreciate historical and artistic value — these two communities coexist and don't necessarily conflict; (4) Authentication complexity: verifying amulet authenticity requires expertise developed over years — counterfeit premium amulets are present in the market; for significant purchases, consulting with multiple trusted vendors and reference books is essential; (5) Photography etiquette: photographing market stalls for personal documentation is generally accepted; always ask before photographing religious objects in intimate devotional contexts.",
  },
];

export function BangkokFortuneTelling() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🔮 Bangkok mystical culture — fortune telling, spirit houses & Thai amulets
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
