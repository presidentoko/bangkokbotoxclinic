const TOPICS = [
  {
    title: "Thai Rice Culture — Jasmine Rice, Sticky Rice & Bangkok's Rice Identity",
    emoji: "🍚",
    summary: "Rice is the foundation of Thai cuisine and culture in ways that extend far beyond a side dish: (1) Thailand as the world's rice exporter: Thailand is one of the world's top 3 rice exporters; Thai Hom Mali (jasmine rice) is internationally recognized as a premium long-grain variety; the distinctive aroma of cooked Thai jasmine rice (caused by 2-acetyl-1-pyrroline compound, shared with pandan leaves) is a specific flavor note that appears in high-quality Thai rice; (2) Central vs. Northern rice culture: Bangkok and Central Thailand use steamed long-grain jasmine rice (khao suay) as the daily staple; Northern and Northeastern Thailand (Isaan) use glutinous sticky rice (khao niao) as the primary staple; sticky rice is eaten by hand (rolled into a small ball to scoop curry); most Bangkok restaurants serve jasmine rice unless specifically an Isaan or Northern restaurant; (3) Khao man gai — Bangkok's most important rice dish: khao man gai (Hainanese chicken rice, introduced by Chinese-Thai immigrants) is Bangkok's most consumed individual rice dish; poached chicken over rice cooked in chicken stock, served with cucumber, blood soup, and dipping sauce; this dish's importance in Bangkok food culture equals Singapore's cultural relationship to the same dish; the best khao man gai shops in Bangkok (Guay Kee at Pratunam, Kaiton Patpong) are institutions; (4) Fried rice variations: Thai fried rice (khao phat) is a distinctly different preparation from Chinese fried rice; it uses jasmine rice (not day-old Chinese-style short grain), fish sauce instead of soy sauce, and typically includes egg, onion, and tomato; ubiquitous in Bangkok restaurants from street stalls to hotel dining; (5) Congee (jok): Thai rice porridge (jok) is a breakfast staple in Bangkok; thick rice congee typically served with pork balls, ginger, egg, and crispy dough; Bangkok congee shops are open from 5am and represent authentic Thai breakfast culture.",
    action: "Guay Kee (Pratunam area) for khao man gai; Kaiton Patpong (Silom area, late night) for late-night khao man gai; local Bangkok markets and food courts for khao phat; Thai rice cooking class for hands-on understanding; Or Tor Kor Market for premium Thai jasmine rice purchase; Chatuchak Market for large-format Thai rice bags for cooking.",
  },
  {
    title: "Bangkok Street Food Noodles — Pad Thai, Boat Noodles & Noodle Soup Guide",
    emoji: "🍜",
    summary: "Bangkok's noodle culture spans from tourist-facing pad thai to the complex boat noodle soups of Bang Pho: (1) Pad thai's true history: pad thai (stir-fried rice noodles with egg, bean sprouts, tofu/shrimp, and ground peanuts) was promoted by Prime Minister Plaek Pibulsongkram in the 1940s as a nationalist dish to reduce rice consumption during wartime; it became Bangkok's most internationally-known dish; the best pad thai (with proper wok hei, right charcoal/wood-fire smoke, and quality prawns) differs significantly from tourist-area pad thai; (2) Boat noodles (kuai-tiao rua): Bangkok's boat noodles are small-portion noodle soups (originally sold from boats on Bangkok canals) with strong-flavored broth thickened with pig's blood; Bang Pho area (Nonthaburi) is the most famous boat noodle destination; Victory Monument area has multiple boat noodle shops; typically ฿20–35/bowl and eaten in quantities of 5–10 bowls; (3) Bamee (egg noodles): Thai-Chinese egg noodles (bamee) with roast pork (moo daeng) or won ton are Bangkok's Chinese-influenced noodle offering; bamee shops in Bangkok's Chinatown and Chinese-Thai neighborhoods are typically family-run with decades of recipe history; (4) Kanom Jeen (fermented rice noodles): fermented rice noodles (kanom jeen) served with various curry or sauce bases represent a distinctive Thai noodle format; the slightly sour fermented noodle with coconut curry or Southern Thai fish curry is a Bangkok morning market staple; (5) Tom yum broth noodles: noodles served in tom yum broth (the famous Thai hot-sour soup) combine Bangkok's two best-known flavors into a single dish; tom yum kung (prawn) noodles at Bangkok noodle shops offer the full flavor experience in affordable format.",
    action: "Thip Samai (Mahachai Road, near Wat Pho) for classic Bangkok pad thai; Bang Pho area (Nonthaburi, Victory Monument BTS, then short ride) for boat noodles; Chinatown Yaowarat Road for bamee egg noodle shops; Bangkok morning markets (5:30–8am) for kanom jeen; food courts at BTS-adjacent malls for air-conditioned noodle sampling across multiple types.",
  },
  {
    title: "Bangkok's International Restaurant Scene — From Korean BBQ to Italian Fine Dining",
    emoji: "🌍",
    summary: "Bangkok's international dining scene rivals major world cities in range and quality: (1) Bangkok's Korean BBQ culture: Bangkok has Thailand's largest Korean community and consequently Bangkok's Korean BBQ scene is genuine and extensive; the Sukhumvit 12/26 area, Asok, and Ekkamai have Korean BBQ restaurants operating for the Thai-Korean community (not tourist adaptations); quality Japanese wagyu and pork belly with soju represents authentic Korean-Bangkok dining; (2) Japanese food depth in Bangkok: Bangkok's Japanese restaurant count (hundreds of establishments) and authenticity is exceptional; the Japanese community in Bangkok is the largest Japanese expat community in Southeast Asia; ramen (Fuunji Tsukemen, Ippudo Bangkok, Ichiran Thailand), izakaya, sushi, and tonkatsu restaurants are abundant and regularly inspected by Japanese residents; (3) Indian restaurant concentration: Bangkok's Indian restaurant district (Nana area, Sukhumvit 11, Lower Sukhumvit) serves one of Bangkok's oldest expat communities; both North Indian (curry, tandoor, naan) and South Indian (dosa, idli, curry leaf cuisine) are available; a significant portion of Indian restaurant clients are Indian tourists and business travelers, which maintains authenticity standards; (4) Bangkok's fine dining scene: Bangkok has 4 restaurants on the Asia's 50 Best Restaurant list (Le Du, Gaggan Anand, Sorn, Paste — all Thai cuisine); international fine dining includes multiple Michelin-starred and Michelin-recommended restaurants; Bangkok's fine dining price point (฿2,000–8,000 per person for multi-course) is significantly lower than equivalent London or Tokyo restaurants; (5) Street food vs. fine dining divide: Bangkok has the unusual characteristic of excellence at both extremes; a ฿60 bowl of boat noodles and a ฿6,000 tasting menu can both represent authentic peak culinary experiences; understanding that both are legitimate Bangkok food culture avoids the false dichotomy of 'authentic = cheap' versus 'refined = expensive.'",
    action: "Asia's 50 Best Restaurant website for current Bangkok listings; Wongnai (Thailand's food review platform, wongnai.com) for Thai-language user reviews; Eatigo (eatigo.com) for Bangkok restaurant reservations with discounts; Oasis Thai Food (Bangkok food blog) for specific restaurant recommendations; KKDay/Klook for Bangkok food tour bookings; Michelin Guide Bangkok website for starred restaurants.",
  },
];

export function BangkokRiceCuisine() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍚 Bangkok food deep dive — rice culture, street noodles & international restaurant scene
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-orange-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-orange-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
