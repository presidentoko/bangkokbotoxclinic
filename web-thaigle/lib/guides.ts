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
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
