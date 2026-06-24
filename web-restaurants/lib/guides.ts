// Bangkok food guide articles — long-form AEO/SEO content.

export type Faq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: Faq[];
  related?: string[];
  updated: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "best-thai-food-bangkok",
    title: "Where to Eat Authentic Thai Food in Bangkok (2026)",
    metaTitle: "Authentic Thai Food in Bangkok — Local-Approved Picks 2026",
    metaDescription:
      "Where Bangkok locals actually eat Thai food. Districts, dishes, and how to spot tourist traps — verified from 1.2M Google reviews.",
    updated: "2026-05-07",
    intro:
      "Tourist Pad Thai is to authentic Thai cuisine what hotel sushi is to Tokyo. This guide cuts past the Instagram bait and shows where Bangkok locals (and food-obsessed expats) actually eat — based on Google review patterns.",
    sections: [
      {
        heading: "Where locals eat by district",
        body:
          "Watthana / Sukhumvit Soi 38 — late-night street food that locals queue for. " +
          "Pathum Wan / Chamchuri Square — office workers' lunch joints with 50-baht single dishes. " +
          "Bang Rak / Charoen Krung — old Bangkok riverside, classic Thai-Chinese. " +
          "Yaowarat (Chinatown) — street food after 6pm, especially noodle soup and seafood. " +
          "Or Tor Kor Market (Chatuchak) — high-end Thai produce + ready-to-eat counter.",
      },
      {
        heading: "Dishes worth ordering (and how to know)",
        body:
          "Tom yum: clear (nam sai) or creamy (nam khon). Locals usually pick clear. " +
          "Pad kra pao with crispy fried egg on rice = the everyman lunch. " +
          "Khao mun gai (Hainanese chicken rice) — the simplest test of a kitchen. " +
          "Som tam — papaya salad. Spice level adjustable; ask 'mai phet mak' to tone it down. " +
          "Boat noodles (kuay tiew reua) — small bowls, eat 4-5. ฿15-30 each.",
      },
      {
        heading: "Spotting tourist traps",
        body:
          "Picture menus + English-only signage = tourist tax. " +
          "No Thai customers at lunchtime = avoid. " +
          "Rooftop terrace + DJ + 'authentic Thai' label = always overpriced. " +
          "Trust Score on this site filters by review volume and reviewer credibility — uses local Google review data, not tourist-volume bias.",
      },
      {
        heading: "Pricing reality",
        body:
          "Street stall: ฿40-80/dish. Casual local restaurant: ฿80-180. Mid-range Thai: ฿200-500/person. " +
          "Fine dining Thai (Sorn, Le Du, Bo.lan): ฿2,500-5,000/person. " +
          "Most authentic experiences are under ฿200/dish.",
      },
    ],
    faqs: [
      {
        q: "How spicy is real Thai food?",
        a: "Real Thai food is spicier than the tourist version. 'Mai phet' = no spicy, 'phet nit noi' = slight, 'phet' = normal Thai (very spicy). Most local-facing kitchens default to phet.",
      },
      {
        q: "Is Bangkok street food safe?",
        a: "At established stalls (the ones with Google review history) — yes. Look for: high turnover, locals queuing, food cooked to order, ice from sealed bags. Markets like Or Tor Kor and Yaowarat night street are safe defaults.",
      },
      {
        q: "Should I tip in Thailand?",
        a: "Restaurants with service charge (10%) included — round up. Restaurants without — leave 20-50 baht for casual, 100-200 baht for mid-range. Street food — round up to nearest 10 baht.",
      },
    ],
    related: ["bangkok-korean-food", "bangkok-rooftop-restaurants"],
  },
  {
    slug: "bangkok-korean-food",
    title: "Best Korean Restaurants in Bangkok (2026 Guide)",
    metaTitle: "Bangkok Korean Restaurants 2026 — Sukhumvit Plaza & Beyond",
    metaDescription:
      "Where to eat real Korean food in Bangkok — Sukhumvit Plaza, Phrom Phong, BTS Asoke. Verified from real Google reviews.",
    updated: "2026-05-07",
    intro:
      "Bangkok's Korean food scene rivals what you'd find in mid-tier Korean cities. Driven by ~50,000 Korean residents and tourist demand, the cluster around Sukhumvit Soi 12 (Sukhumvit Plaza) is the obvious starting point — but the best individual places are scattered.",
    sections: [
      {
        heading: "The Sukhumvit Plaza cluster (Soi 12)",
        body:
          "Korean Town Bangkok — 4-floor mall with 30+ Korean restaurants, mart, karaoke. " +
          "Strengths: Korean BBQ, jjajangmyeon, Korean fried chicken, late-night soju spots. " +
          "Weaknesses: Pricey (Bangkok-standard), some places coast on captive audience. Trust Score helps filter the lazy ones.",
      },
      {
        heading: "Phrom Phong / Thong Lor — premium Korean",
        body:
          "Higher-end Korean restaurants, often with Korean chefs and imported ingredients. " +
          "Better for ambiance and date nights. Dakgalbi, Korean BBQ, modern Korean fusion. ฿800-2,000/person.",
      },
      {
        heading: "What to order (Bangkok-specific)",
        body:
          "Korean fried chicken (yangnyeom) — fresher and crispier than what you get in Korea, often served with Thai chili glaze fusion. " +
          "Korean BBQ — pork belly is the consensus pick; quality of beef varies. " +
          "Bibimbap and stews — solid bets for solo diners. " +
          "Soju and makgeolli — widely available, ฿180-280/bottle.",
      },
    ],
    faqs: [
      {
        q: "Is Korean food in Bangkok authentic?",
        a: "The best Korean restaurants in Bangkok have Korean chefs and import ingredients. They're quite authentic — sometimes more refined than mid-tier Korean cities. The mid-tier places adjust for Thai palates (less garlic, less fermented), so for hardcore Korean taste, stick to Trust-Score-verified ones.",
      },
      {
        q: "Where to find late-night Korean food?",
        a: "Sukhumvit Plaza Soi 12 has many spots open until 2am. Some Korean BBQ places in Phrom Phong run until midnight. 24h options are rare.",
      },
    ],
    related: ["best-thai-food-bangkok"],
  },
  {
    slug: "bangkok-rooftop-restaurants",
    title: "Best Bangkok Rooftop Restaurants (2026)",
    metaTitle: "Bangkok Rooftop Restaurants 2026 — Skyline Views Verified",
    metaDescription:
      "Best Bangkok rooftop restaurants ranked by view + Trust Score. Sky Bar, Vertigo, and verified hidden gems.",
    updated: "2026-05-07",
    intro:
      "Bangkok rooftop dining is its own genre. The classics — Sky Bar at Lebua, Vertigo at Banyan Tree — are world-famous but pricey. The best value is in second-tier rooftops with similar views at half the price.",
    sections: [
      {
        heading: "Iconic / classic rooftops",
        body:
          "Sky Bar (Lebua) — featured in Hangover 2, top of the price ladder. ฿2,000+ minimum. " +
          "Vertigo (Banyan Tree) — best 360° view, premium pricing. " +
          "Octave (Marriott Sukhumvit) — better value, still excellent view, less touristy.",
      },
      {
        heading: "Value rooftops (best Trust Score / price ratio)",
        body:
          "ABar Rooftop (BTS Asoke) — quietly excellent, river view. " +
          "Above Eleven (Soi 11) — Peruvian + sky view, mid-range. " +
          "Char (Hotel Indigo) — newer, less crowded.",
      },
      {
        heading: "Practical tips",
        body:
          "Dress code is enforced — collared shirts, no flip-flops. " +
          "Reservations essential weekends. Sunset slot (5:30-7pm) is most desirable. " +
          "Drinks ฿380-650 typical. Food often expensive vs ground-level Thai. Eat first, drink rooftop.",
      },
    ],
    faqs: [
      {
        q: "Are Bangkok rooftops worth the price?",
        a: "Once. The view is genuinely spectacular and Bangkok is a vertical city. Repeat visits, the value drops fast — switch to second-tier rooftops with similar views for half the price.",
      },
    ],
    related: ["best-thai-food-bangkok"],
  },
  {
    slug: "bangkok-street-food-guide",
    title: "Bangkok Street Food Guide — Where Locals Actually Eat (2026)",
    metaTitle: "Bangkok Street Food Guide 2026 — Best Local Spots",
    metaDescription:
      "Where to eat street food in Bangkok like a local — Yaowarat, Or Tor Kor, Chatuchak, Ari. Data from 1.2M Google reviews.",
    updated: "2026-06-01",
    intro:
      "Bangkok street food is one of the world's great culinary traditions, but finding the real stuff amid tourist traps and overhyped Instagram spots takes local knowledge. This guide maps the best districts, dishes, and vendors — verified from actual Google review patterns, not influencer recommendations.",
    sections: [
      {
        heading: "Yaowarat (Chinatown) — best after 6pm",
        body:
          "Bangkok's Chinatown transforms at dusk into the city's best street food corridor. Yaowarat Road and surrounding sois fill with carts selling: roasted duck on rice, oyster omelette, mango sticky rice. " +
          "Best arrival: 7-9pm on weeknights (weekends get tourist-crowded). Yaowarat vendors show consistent 4.4-4.8 Google stars — unusually high for street food, suggesting genuine local love over tourist volume.",
      },
      {
        heading: "Or Tor Kor Market (Chatuchak) — for premium local food",
        body:
          "Or Tor Kor is Bangkok's most upscale fresh market — ready-to-eat counters with restaurant-quality execution. " +
          "Not the cheapest but the freshest: jasmine rice, durian of museum quality, and northern Thai specialties (kao soi, sai ua sausage). Best for solo travelers who want quality over atmosphere. ฿80-200/dish, BTS Mo Chit.",
      },
      {
        heading: "Ari / Phahonyothin — the local lunch corridor",
        body:
          "Above BTS Ari, local lunch spots and evening street stalls serve Bangkok's young professional crowd. Key signals: no English menus, full at noon, empty by 2pm. " +
          "Good for: pad kra pao, boat noodles, grilled pork with sticky rice. Trust Scores here run 70-85 — consistently high for value.",
      },
      {
        heading: "Soi 38 Sukhumvit (the night crowd)",
        body:
          "Bangkok's most famous late-night street food soi. Open from around 6pm to 2-3am. Mixed local/tourist now, but quality holds: mango with sticky rice, pad thai, satay. " +
          "Best visited after 10pm when crowds thin. Google review patterns suggest Friday-Saturday gets tourist-heavy — go weeknights.",
      },
    ],
    faqs: [
      {
        q: "Is Bangkok street food safe to eat?",
        a: "At stalls with Google review history and high turnover — yes. The risk isn't the food, it's the ice. Use sealed ice bags. Most established market stalls are safe; look for 50+ Google reviews as a minimum threshold.",
      },
      {
        q: "What's the cheapest area for street food in Bangkok?",
        a: "Away from tourist zones: Ladprao, Bang Khen, Phahonyothin beyond Mo Chit. ฿30-50/dish is still normal. On Sukhumvit expect ฿60-120 for similar quality.",
      },
      {
        q: "How do I order if I don't speak Thai?",
        a: "Photos work at most market stalls. Google Translate's camera mode handles Thai menus. Key phrase: 'mai phet mak' (not too spicy). Holding up fingers works for quantities.",
      },
    ],
    related: ["best-thai-food-bangkok", "bangkoks-best-date-restaurants"],
  },
  {
    slug: "bangkok-hidden-gems",
    title: "Bangkok Hidden Gem Restaurants — Real Locals Know These (2026)",
    metaTitle: "Bangkok Hidden Gem Restaurants 2026 — High Trust, Under the Radar",
    metaDescription:
      "Bangkok restaurants with high Trust Scores but fewer than 500 reviews — the real hidden gems before influencers find them.",
    updated: "2026-06-01",
    intro:
      "The best Bangkok restaurants aren't always the most reviewed. Using Trust Score — a composite of rating quality, reviewer credibility, and local guide density — we surface places with exceptional signals but relatively few reviews.",
    sections: [
      {
        heading: "Why Trust Score finds hidden gems better than star rating",
        body:
          "A restaurant with 50 reviews from frequent local reviewers often beats one with 2,000 reviews from tourist one-timers. Trust Score weights: local guide density (15-25% of reviewers), reviewer history (average 50+ reviews/person signals real diners), and review sentiment consistency. " +
          "A 4.8 score from 40 local guides outranks 4.6 from 1,500 first-timers every time.",
      },
      {
        heading: "Districts that hide the best undiscovered restaurants",
        body:
          "Lat Phrao — mid-city, mostly local clientele, minimal tourist presence. Trust Scores here cluster 72-88. " +
          "Bang Na — east Bangkok, expat-heavy but under-Instagrammed. Excellent Japanese, Korean, and mid-range Thai. " +
          "Prawet / On Nut outer — soi restaurants with almost zero English presence. High local density, authentic pricing.",
      },
      {
        heading: "What to look for in a hidden gem listing",
        body:
          "Trust Score 70+ with under 300 reviews — the sweet spot. " +
          "Local guide reviewer ratio above 15% — means repeat visitors, not one-time tourists. " +
          "Recent reviews trending up — early signal of a restaurant still improving. " +
          "No website, no social media — usually means they're not optimizing for tourists yet.",
      },
    ],
    faqs: [
      {
        q: "How do I find a hidden gem restaurant in Bangkok before it's overrun?",
        a: "Filter by Trust Score 70+ and review count under 500. Look for restaurants that opened in the last 2-3 years with a high ratio of local guide reviewers. Avoid anything with Instagram-optimized interior shots in Google photos — that's a signal it's been discovered.",
      },
      {
        q: "Are hidden gems actually cheaper?",
        a: "Often yes, but not always. A hidden gem might be a high-quality local spot (cheap) or a quality-focused fine dining place that hasn't been found by food media yet. Trust Score doesn't track price — filter by price symbol separately.",
      },
    ],
    related: ["best-thai-food-bangkok", "bangkok-street-food-guide"],
  },
  {
    slug: "bangkoks-best-date-restaurants",
    title: "Best Date Night Restaurants in Bangkok (2026) — Romantic + Verified",
    metaTitle: "Best Date Night Restaurants Bangkok 2026 — Verified Romantic Picks",
    metaDescription:
      "Bangkok's best romantic restaurants for a date night — rooftop, garden, candlelit — verified from real Google reviews, not influencer lists.",
    updated: "2026-06-01",
    intro:
      "The problem with Bangkok date restaurant lists: most come from influencers who got comp'd or brands that paid for placement. This guide uses Google review data — mentions of 'romantic', 'great atmosphere', 'perfect for couples' — combined with Trust Score to find where Bangkok couples actually go.",
    sections: [
      {
        heading: "Rooftop romance — the reliable choice",
        body:
          "Bangkok's skyline genuinely makes for spectacular dates. The classic: Sky Bar at Lebua at ฿2,500+. Better value: Octave at Marriott Sukhumvit — 360° views, same sunset, half the price. " +
          "Dress code applies everywhere. Sunset window (5:30-7pm) is most popular — book weekends 1-2 weeks ahead.",
      },
      {
        heading: "Hidden romantic garden restaurants",
        body:
          "Bangkok has a category of converted house restaurants with garden settings — romantic, not famous, often with no social media presence. " +
          "These cluster in Bangkapi, Thong Lor, and Ladprao. High local reviewer density means real repeat customers, not Instagram one-offs.",
      },
      {
        heading: "Price tiers for Bangkok date nights",
        body:
          "Budget romantic: garden Thai restaurant, ฿400-800/couple. Good ambiance, authentic, usually BYO. " +
          "Mid-range: converted house restaurants or upscale Thai, ฿1,500-3,000/couple with drinks. " +
          "Special occasion: rooftop or tasting menu (Sorn, Le Du, Nahm), ฿4,000-12,000/couple.",
      },
    ],
    faqs: [
      {
        q: "Do Bangkok restaurants need reservations for date nights?",
        a: "Rooftop restaurants: always, especially Friday-Saturday — 1-2 weeks ahead. Garden restaurants: usually yes, 2-3 days. Casual mid-range: usually walk-in. Call or use Google reservation links directly.",
      },
      {
        q: "Is tipping expected at Bangkok date restaurants?",
        a: "Mid-range and above: yes. If service charge (10%) isn't included, leave 100-200 baht. Fine dining: 200-500 baht is appropriate.",
      },
    ],
    related: ["bangkok-rooftop-restaurants", "best-thai-food-bangkok"],
  },
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
