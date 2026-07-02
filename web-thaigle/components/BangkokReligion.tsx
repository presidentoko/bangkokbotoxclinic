const SPOTS = [
  {
    name: "Bangkok's Mosques & Islamic Community",
    emoji: "🕌",
    area: "Haroon Mosque (near Oriental Hotel, riverfront), Masjid Ton Son (Charoen Krung), Islamic Cultural Center Bangkok, and Muslim communities throughout the city",
    price: "Mosque entry: free (with appropriate dress); Halal restaurants in Muslim communities: ฿60–300; Islamic cultural events: free–฿200",
    why: "Thailand has a significant Muslim minority population — approximately 10–15% of Thais are Muslim, concentrated in the deep south (Pattani, Yala, Narathiwat, Satun provinces) but present throughout Bangkok as a well-established community. Bangkok's Muslim community has roots dating to the 17th century — Malay and Persian Muslim merchants established early trading relationships with the Ayutthaya kingdom, and the Muslim Quarter near the river was one of Bangkok's historic ethnic enclaves. Contemporary Bangkok has dozens of mosques serving a diverse Muslim population including Thai Muslims, Malay Muslims, South Asian Muslims, Middle Eastern expats, and visiting Muslim tourists. The halal food sector in Bangkok is well-developed — designated halal kitchens, halal-certified restaurants, and Muslim-community food markets serving the Friday prayer crowd are accessible throughout the city.",
    tip: "Bangkok mosque visits: (1) Dress appropriately — women should cover hair, shoulders, and legs; men should avoid shorts; both should remove shoes before entering; (2) The best mosques for visitor understanding: Haroon Mosque near the Oriental Hotel is architecturally interesting and in a tourist-accessible area; the Islamic Cultural Center Bangkok near Soi Asoke occasionally hosts open events; (3) Friday prayer (Jumuah): Fridays at noon are the week's most significant congregational prayer — mosques are crowded and respectful observation from the periphery is possible, but entering the main prayer area during active worship is not appropriate for non-Muslim visitors; (4) Halal food market: the area around Sukhumvit Soi 3 and the Bang Rak Muslim community (near Si Phraya area) has genuine Muslim community food markets — the Haroon Muslim Food Market near the Oriental pier is one of Bangkok's most authentic Muslim food experiences.",
  },
  {
    name: "Bangkok's Churches & Christian Community",
    emoji: "⛪",
    area: "Holy Redeemer Church (Sukhumvit), Christ Church Bangkok (Silom), Bangkok Christian Guesthouse (Si Phraya), international churches throughout expat areas",
    price: "Church services: free; Christian community events: free–฿500; Retreat/conference: varies",
    why: "Bangkok has an active Christian community comprising both local Thai Christians (approximately 1% of Thai population is Christian, but concentrated in urban areas and among ethnic minority communities), and a large international expat community maintaining their faith practices in Bangkok. International English-language church services are available across denominations — Catholic (Holy Redeemer, Assumption Cathedral), Protestant/Anglican (Christ Church Bangkok), Baptist, Presbyterian, Evangelical, and Pentecostal churches all serve Bangkok's Christian population. The Mission Hospital Bangkok (Bangkok Christian Hospital) was founded by American missionaries in 1949 and remains an important institution in Bangkok's medical landscape. Bangkok's Karen and other northern ethnic minority communities have significant Christian populations with separate Thai-language Christian communities.",
    tip: "Bangkok Christian community access: (1) Holy Redeemer Catholic Church (Sukhumvit Soi 23) offers English-language Masses at multiple weekend times — a well-established international Catholic community; (2) Christ Church Bangkok (Silom) is Anglican and serves as a hub for the broader English-speaking Protestant community; (3) International Christian Fellowship Bangkok: a non-denominational church with a specifically expat-oriented community and international outreach; (4) The Bangkok Christian Guesthouse (near Oriental Hotel area) provides affordable accommodation with a quiet, community-oriented atmosphere that appeals to travelers seeking non-party tourism options; (5) Karen Christian communities in Bangkok: northern Thailand's Karen ethnic minority has a deeply established Christian heritage — while concentrated in the north, Bangkok Karen communities maintain churches and cultural connection accessible through community networks.",
  },
  {
    name: "Other Faith Communities in Bangkok",
    emoji: "🕍",
    area: "Jewish community (Chabad House Bangkok), Sikh Gurdwara (Pahurat), Hindu temples (Maha Uma Devi Temple/Silom, Erawan Shrine), other faith communities",
    price: "All religious sites: free entry; Community meals (langar/Shabbat): donation-based or free; Cultural events: free–฿500",
    why: "Bangkok's diversity as a global city is reflected in its breadth of religious communities: (1) Jewish community: Chabad House Bangkok (Silom area) provides Shabbat services, kosher meals, and community support for the estimated 2,000–5,000 Jewish visitors and residents passing through Bangkok annually — functioning as a warm welcome for Jewish travelers across the observance spectrum; (2) Sikh community: Sri Gurusingh Sabha in Pahurat is Bangkok's main Gurdwara, with a community of Bangkok-based Sikhs primarily of Punjabi descent involved in the textile trade; langar (communal meal) is offered to all visitors; (3) Hindu community: the Sri Maha Mariamman Temple (Maha Uma Devi) on Silom Road is Bangkok's main Hindu temple, active particularly among Bangkok's Tamil and South Indian community; the Erawan Shrine (technically Brahma/Brahmin worship) attracts enormous daily devotional traffic; (4) Bahá'í community: small but active Bahá'í community with community center in Bangkok; (5) Confucian/ancestral worship: Bangkok's Chinese community maintains active Confucian and ancestral worship traditions at the numerous clan temples throughout Chinatown.",
    tip: "Multi-faith Bangkok navigation: (1) Chabad House Bangkok contact: checking the Chabad House website before arrival confirms current address and Friday/Shabbat service times — this changes occasionally; (2) The Erawan Shrine (BTS Chit Lom) is one of Bangkok's most-visited religious sites regardless of visitors' faith background — the offering system (hiring traditional Thai classical dancers to perform as offerings of thanks) creates a continuous performance of classical dance that is both religious and culturally spectacular; (3) Shrine etiquette across faiths: Thai shrines and religious sites across traditions reward genuine respectful engagement — asking permission before photographing religious ceremonies, accepting offered items (incense, flower garlands) graciously, and matching energy to the contemplative atmosphere creates better experiences than tourist-mode rushing through; (4) Interfaith events: Bangkok occasionally hosts interfaith dialogue events through the Royal Thai government's Office of National Buddhism and academic institutions — these provide unique access to multi-tradition religious discussion.",
  },
];

export function BangkokReligion() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🕌 Bangkok faith communities — mosques, churches, temples & interfaith Bangkok
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
