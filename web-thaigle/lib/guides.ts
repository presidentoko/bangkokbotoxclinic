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
  nicheSlug?: string;
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
    slug: "best-muay-thai-gyms-bangkok",
    title: "Best Muay Thai Gyms in Bangkok (2026 Guide)",
    metaTitle: "Best Muay Thai Gyms Bangkok 2026 — Ranked by Real Reviews",
    metaDescription:
      "Where to train Muay Thai in Bangkok — ranked by Trust Score from 381 real Google-reviewed gyms. Beginner tips, prices, and what to expect.",
    updated: "2026-06-22",
    intro:
      "Bangkok is the world capital of Muay Thai. With over 381 gyms across the city, the challenge isn't finding a gym — it's finding one that's right for you. This guide breaks down what separates the tourist-friendly gyms from the serious training camps, and how to pick based on your goals.",
    sections: [
      {
        heading: "Tourist gym vs. training camp — what's the difference?",
        body:
          "Tourist-friendly gyms (popular on Klook and GetYourGuide) offer structured beginner sessions, English instruction, and equipment rental. They're ideal for a 1–3 session experience. Training camps are where fighters prepare for bouts — sessions are intense, in Thai, and not suitable for total beginners. Most tourists should start at a tourist gym; only book a training camp if you have prior martial arts experience.",
      },
      {
        heading: "What to expect in your first session",
        body:
          "A typical 90-minute beginner session: warm-up jump rope (10–15 min), shadow boxing basics, pad work with a trainer (the highlight), bag work, and cool-down stretching. You'll be sweating heavily within 20 minutes. Bring: water, small towel, and athletic clothing. Gloves and wraps are usually provided or available to rent for ฿50–100.",
      },
      {
        heading: "Best areas for Muay Thai in Bangkok",
        body:
          "Silom / Bangrak — classic Bangkok Muay Thai territory, several long-established gyms. Sukhumvit Soi 1–30 — high concentration of foreigner-friendly gyms with Klook booking. Ladprao / Lat Phrao — local gyms, lower prices, less English. Chatuchak / Mo Chit — cheaper options, further from tourist areas but often higher quality for serious training.",
      },
      {
        heading: "Booking: walk-in vs. Klook vs. direct",
        body:
          "Walk-in: Fine for most gyms, just show up 10 minutes early. Klook: Convenient, often includes transport, guaranteed English instructor, slightly pricier. Direct booking via LINE or WhatsApp: usually 10–15% cheaper than Klook, requires more planning. For a day-trip experience, Klook is worth the premium.",
      },
    ],
    faqs: [
      {
        q: "How much does Muay Thai training cost in Bangkok?",
        a: "Drop-in sessions cost ฿300–฿800. Klook bookings typically run ฿600–฿1,200 for a 90-minute session including equipment. Monthly packages range from ฿3,000–฿8,000.",
      },
      {
        q: "Is Muay Thai safe for beginners in Bangkok?",
        a: "Yes. Reputable gyms separate beginners from fighters. You'll do pad work with a trainer, not sparring with other students, on your first visit.",
      },
      {
        q: "What should I wear to Muay Thai training?",
        a: "Athletic shorts (not jeans), a t-shirt, and clean athletic shoes or bare feet. Many gyms have Muay Thai shorts for sale or rent. Most gyms provide gloves and wraps.",
      },
    ],
    related: ["best-thai-food-bangkok"],
    nicheSlug: "muay-thai",
  },
  {
    slug: "best-thai-massage-spa-bangkok",
    title: "Best Thai Massage & Spas in Bangkok (2026 Guide)",
    metaTitle: "Best Thai Massage Bangkok 2026 — Verified Spa Rankings",
    metaDescription:
      "Where to get the best Thai massage in Bangkok. 2,000+ spas ranked by real Google reviews. Prices, what to expect, and how to avoid tourist traps.",
    updated: "2026-06-22",
    intro:
      "Thai massage is the best value wellness experience in Bangkok — a 2-hour full-body session costs less than a cocktail at a rooftop bar. But with thousands of massage shops across the city, quality varies enormously. This guide breaks down what to look for, where to go, and what to pay.",
    sections: [
      {
        heading: "Types of Thai massage — which to choose",
        body:
          "Traditional Thai massage (นวดแผนไทย, nuad boran): Dry, clothed, uses stretching and pressure. The full Thai experience. Good for flexibility and energy. Oil massage: Relaxing, focuses on muscle tension. Better for back pain relief. Foot massage: 1-hour sessions ฿200–฿300. Perfect after a long day of walking. Herbal compress massage: Hot herbal ball pressed against muscles. Premium option at spa-grade establishments.",
      },
      {
        heading: "Price guide — what's fair",
        body:
          "Street-level (no-frills): ฿200–฿400/hour. Solid neighborhood spa: ฿400–฿700/hour. Mid-range day spa: ฿700–฿1,500/hour. Luxury hotel spa: ฿1,500–฿4,000/hour. Always tip 50–100 baht at budget/mid-range places for good service. Hotel spas usually include gratuity.",
      },
      {
        heading: "How to avoid tourist traps",
        body:
          "Avoid shops on the main tourist corridors (Khao San Road, Silom's walking street). These charge tourist prices (฿500–฿800) for street-quality service. Instead: walk one or two blocks off the main strip, look for shops with Thai customers, and check Google Maps reviews. Our Trust Score filters out low-credibility review patterns.",
      },
      {
        heading: "Best spa neighborhoods in Bangkok",
        body:
          "Thong Lor / Ekkamai: premium day spas, expat crowd, high standards. Silom: mix of budget street massage and serious hotel spas. Ari: neighborhood spas popular with locals and expats, fair prices. On Nut / Bearing: cheapest options, less touristy, same quality as Silom.",
      },
    ],
    faqs: [
      {
        q: "How much should I pay for Thai massage in Bangkok?",
        a: "฿200–฿400/hour at a street-level shop is fair. ฿500+ suggests a tourist-area premium. Anything over ฿1,000 is spa-grade. Always check Google reviews before entering an unfamiliar shop.",
      },
      {
        q: "Is it rude to fall asleep during Thai massage?",
        a: "Not at all — it's considered a compliment. Many clients doze off, especially during oil massage. The therapist will gently wake you if they need you to turn over.",
      },
      {
        q: "Do I need to book a spa in advance in Bangkok?",
        a: "Walk-ins are accepted at most massage shops. For popular spas or weekend visits, booking via LINE 1–2 days ahead is wise. Luxury hotel spas should be booked at least a week in advance.",
      },
    ],
    related: ["best-thai-food-bangkok", "best-muay-thai-gyms-bangkok"],
    nicheSlug: "spa",
  },
  {
    slug: "best-yoga-studios-bangkok",
    title: "Best Yoga Studios in Bangkok (2026 Guide)",
    metaTitle: "Best Yoga Studios Bangkok 2026 — Drop-in & Membership Ranked",
    metaDescription:
      "Where to practice yoga in Bangkok — 284 studios ranked by real reviews. Drop-in prices, hot yoga, Reformer Pilates, and the best areas for expats and tourists.",
    updated: "2026-06-22",
    nicheSlug: "yoga-pilates",
    intro:
      "Bangkok has quietly become one of Southeast Asia's best cities for yoga. A combination of a large expat community, affordable studio space, and Thai wellness culture has produced a scene that rivals Western cities — at 30–50% lower prices.",
    sections: [
      {
        heading: "Types of yoga in Bangkok — what's popular",
        body:
          "Vinyasa Flow: The most common style in Bangkok studios — dynamic, music-driven, sweat-heavy. Good for fitness-focused practitioners. Hot Yoga (Bikram-style): Extremely popular in Bangkok's culture. Rooms heated to 35–40°C. Studios often purpose-built with strong AC (yes, both exist in the same building). Ashtanga: Traditional practice, fewer studios but dedicated following. Usually taught in early morning. Yin Yoga: Growing fast among expats. Slow, meditative, focused on flexibility. Often combined with sound bath sessions. Reformer Pilates: The fastest-growing category in 2024-2026. High-end studios in Thong Lor and Ari command ฿600–฿1,200/session.",
      },
      {
        heading: "Best yoga areas in Bangkok",
        body:
          "Thong Lor / Ekkamai (BTS Thong Lo, Ekkamai): Highest concentration of premium yoga studios. Reformer Pilates, hot yoga, aerial. Best for: expats, health-conscious professionals. Ari (BTS Ari): Great mix of independent studios, mid-range prices, relaxed vibe. Community feel. Best for: regulars, monthly memberships. Sukhumvit (BTS Asoke to Phrom Phong): Tourist-accessible, flexible drop-in, English instruction standard. Silom: Business district studios, good lunch-hour classes, corporate crowd.",
      },
      {
        heading: "Pricing — what to expect",
        body:
          "Drop-in class: ฿400–฿800. Intro week (tourist pass): ฿800–฿1,500 for unlimited 7 days. Monthly unlimited: ฿2,500–฿8,000 (hot yoga studios at higher end). Reformer Pilates single: ฿600–฿1,200. Yin + sound bath special: ฿600–฿900. Class credits never expire at most studios (unlike Western 'must-use-in-30-days' policies).",
      },
      {
        heading: "Drop-in vs membership for tourists",
        body:
          "For stays under 2 weeks: buy an intro pass (฿800–฿1,500 for unlimited 7 days) — significantly better value than daily drop-in. For stays 2–4 weeks: monthly unlimited is better than intro pass. For 1+ month: monthly membership pays off immediately. Most studios allow pause/freeze with 7 days notice — useful if you're traveling to other cities mid-trip.",
      },
    ],
    faqs: [
      {
        q: "How much is yoga class in Bangkok?",
        a: "Drop-in classes cost ฿400–฿800. 7-day intro passes are ฿800–฿1,500 for unlimited classes — best value for tourists. Monthly unlimited memberships are ฿2,500–฿8,000 depending on the studio and style.",
      },
      {
        q: "Are Bangkok yoga studios English-friendly?",
        a: "Yes — most studios in Thong Lor, Ari, and Sukhumvit operate in English. Instruction, scheduling, and front desk communication are all in English. Thai-language studios exist but are primarily in residential neighborhoods.",
      },
      {
        q: "What is hot yoga like in Bangkok's heat?",
        a: "Bangkok hot yoga rooms are heated to 35–40°C in already-warm Thailand, making them genuinely intense. Bring extra water and a full-length towel. Most studios have showers. Beginners should start with a regular class first.",
      },
    ],
    related: ["best-thai-food-bangkok", "best-thai-massage-spa-bangkok"],
  },
  {
    slug: "best-thai-cooking-classes-bangkok",
    title: "Best Thai Cooking Classes in Bangkok (2026 Guide)",
    metaTitle: "Best Thai Cooking Classes Bangkok 2026 — Ranked by Reviews",
    metaDescription:
      "Where to take a Thai cooking class in Bangkok. 296 schools ranked by real reviews. Half-day vs full-day, market tours, prices, and what you'll actually cook.",
    updated: "2026-06-22",
    nicheSlug: "cooking",
    intro:
      "A good Bangkok cooking class teaches you 3–5 dishes you'll actually cook at home. A bad one is a tourist show with a mediocre meal at the end. This guide separates the two — and explains exactly what to look for before you book.",
    sections: [
      {
        heading: "Half-day vs full-day — which to choose",
        body:
          "Half-day (3–4 hours, ฿800–฿1,800): You learn 3–4 dishes, cook them, eat them. Perfect for a one-off experience. Usually includes a quick market introduction. Full-day (7–8 hours, ฿1,500–฿3,500): Starts with a full market tour (Or Tor Kor or local wet market), deeper dish variety, more time with the instructor. Worth it if Thai cooking is a serious interest. Private class (฿2,500–฿6,000 for 1-2 people): Customize the menu entirely, often in the chef's home or a specialty kitchen. Best for couples or serious home cooks.",
      },
      {
        heading: "What you'll cook — standard menu",
        body:
          "Most classes cover: Pad Thai (the universal starter), Tom Yum Goong (prawn soup, two versions), Green or Red Curry (paste from scratch), Som Tam (green papaya salad), Mango Sticky Rice (dessert). Some schools specialize: street food (boat noodles, satay), Northern Thai (khao soi), or vegetarian Thai. Always check the specific menu before booking — it varies significantly between schools.",
      },
      {
        heading: "What separates a good cooking class from a bad one",
        body:
          "Small groups (≤8 per class): You actually cook, not just watch. Own station per person: Not sharing a single stove with 3 others. Scratch cooking: Curry paste made from raw ingredients, not pre-mixed. Good ingredients: Fresh market herbs, quality proteins. Recipes to take home: Actually useful written recipes, not just a demo. High Trust Score + 100+ reviews: Filters out schools that peaked 3 years ago.",
      },
      {
        heading: "Market tour: Or Tor Kor vs local wet market",
        body:
          "Or Tor Kor Market (near Chatuchak): Premium, tourist-friendly, international coverage. Good variety of fruits and herbs. Clean, air-conditioned sections. Local wet market (varies by school): More authentic, more chaotic, cheaper. You see locals shopping, not tourists. Better food photography. Both are valuable — check which the school offers and pick based on preference.",
      },
    ],
    faqs: [
      {
        q: "How much does a Thai cooking class in Bangkok cost?",
        a: "Half-day classes are ฿800–฿1,800 per person. Full-day classes with market tour are ฿1,500–฿3,500. Private classes for 1-2 people are ฿2,500–฿6,000. Transport from your hotel is often included at higher price points.",
      },
      {
        q: "Are Thai cooking classes suitable for vegetarians?",
        a: "Most reputable schools offer vegetarian menus with advance notice. Some have dedicated vegetarian programs. Always confirm when booking — the standard Thai menu uses fish sauce and shrimp paste heavily.",
      },
      {
        q: "Do I need any cooking experience for a Bangkok cooking class?",
        a: "No. Classes are designed for complete beginners. You'll cook from scratch at your own station with a chef guiding you. The ability to follow instructions is all you need.",
      },
    ],
    related: ["best-thai-food-bangkok"],
  },
  {
    slug: "diving-near-bangkok-guide",
    title: "Diving Near Bangkok: Day Trips & PADI Courses (2026)",
    metaTitle: "Diving Near Bangkok 2026 — Koh Larn, Pattaya & PADI Courses",
    metaDescription:
      "Where to dive near Bangkok. Koh Larn day trips, PADI certification courses, snorkeling spots, and what marine life to expect. 119 operators ranked.",
    updated: "2026-06-22",
    nicheSlug: "diving",
    intro:
      "Bangkok is landlocked but within 2 hours of some surprisingly decent dive sites. The Gulf of Thailand's closest reefs won't rival Koh Tao or the Similans, but for a first dive experience or PADI certification without a multi-day trip, the Pattaya / Koh Larn area delivers.",
    sections: [
      {
        heading: "Where to dive near Bangkok — realistic options",
        body:
          "Koh Larn (1.5h from Bangkok): Bangkok's closest dive destination. Small island off Pattaya. Multiple snorkel and beginner dive spots. Visibility 5–10m. Good coral at 5–15m depth. Day trip friendly. Koh Sichang (2h): Less visited, better visibility than Koh Larn on good days. Interesting historical wreck dive at 15m. Samaesan area (near Pattaya): Several wrecks, more experienced divers. Best visibility in the region. Best season Nov–April. Koh Tao (7h by overnight bus): Correct answer if you want serious diving. The Gulf's best reefs, cheapest PADI certification in the world (฿7,000–฿10,000 for Open Water).",
      },
      {
        heading: "Day trip diving from Bangkok — how it works",
        body:
          "Most Bangkok dive operators run Pattaya day trips: 5:30am departure → 9am dive briefing → 2 dives → lunch on boat → 4pm return Bangkok. Total: ฿1,800–฿3,500 per person including equipment. Night dive options available at Pattaya's wreck sites. Snorkeling-only day trips to Koh Larn: ฿600–฿1,200 including boat and equipment.",
      },
      {
        heading: "PADI courses near Bangkok",
        body:
          "Discover Scuba (Intro dive, no certification): ฿1,500–฿2,500. Try diving before committing. Open Water certification (4 days): ฿8,000–฿15,000 in Pattaya area. ฿7,000–฿10,000 on Koh Tao. Pool sessions in Bangkok, open water dives at Pattaya. Advanced Open Water (2 days): ฿8,000–฿12,000. Requires existing Open Water cert. Most operators in our listings handle all certifications through PADI-certified instructors.",
      },
      {
        heading: "Best season to dive near Bangkok",
        body:
          "November–April: Best visibility (5–15m). Calmer seas. Ideal for first-time divers. May–October: Monsoon season. Rougher conditions, reduced visibility (2–5m), some sites closed. Most dive operators still run (with conditions), but it's not optimal. November and March are generally the peak months for dive conditions in the Gulf of Thailand.",
      },
    ],
    faqs: [
      {
        q: "Can you go diving from Bangkok as a day trip?",
        a: "Yes. Most operators offer Pattaya day trips departing early morning and returning by evening. Expect 2 dives, lunch, and all equipment included for ฿1,800–฿3,500 from Bangkok. Travel time is 1.5–2h each way.",
      },
      {
        q: "How much does a PADI Open Water course cost near Bangkok?",
        a: "฿8,000–฿15,000 in the Pattaya area for a 4-day course including all dives and certification. Koh Tao is cheaper at ฿7,000–฿10,000 but requires an overnight journey from Bangkok.",
      },
      {
        q: "Is diving near Bangkok suitable for beginners?",
        a: "Yes. Koh Larn and Pattaya's shallow reef sites are ideal for first-time divers. The Discover Scuba experience (no certification required) is safe in these calm, shallow conditions with an instructor.",
      },
    ],
    related: ["best-thai-food-bangkok"],
  },
  {
    slug: "coworking-bangkok-digital-nomad-guide",
    title: "Coworking in Bangkok: Digital Nomad Guide (2026)",
    metaTitle: "Best Coworking Spaces Bangkok 2026 — Digital Nomad Guide",
    metaDescription:
      "Best coworking spaces in Bangkok for digital nomads and remote workers. 98 spaces ranked by real reviews. Day passes, monthly rates, best areas, and WiFi speeds.",
    updated: "2026-06-22",
    nicheSlug: "coworking",
    intro:
      "Bangkok consistently ranks in the world's top 10 digital nomad cities. The combination of fast internet, excellent coworking spaces, affordable cost of living, and a large English-speaking expat community makes it one of the most liveable remote-work destinations on earth.",
    sections: [
      {
        heading: "Best coworking areas in Bangkok",
        body:
          "Ari (BTS Ari): The nomad epicenter. High concentration of independent spaces, excellent cafés doubling as work spots, low tourist traffic, strong community. Recommended for stays of 1+ month. Phahon Yothin / Mo Chit: Larger corporate-grade spaces. Good for video calls and team meetings. Near Chatuchak Weekend Market. Sukhumvit (Asoke–Ekkamai): Most accessible from hotels and short-term accommodation. Mid-range spaces, reliable WiFi, 24h options. Silom: Corporate-leaning, good for business professionals. Fewer independent spaces, more serviced office setups.",
      },
      {
        heading: "Coworking vs café — which to use",
        body:
          "Coworking spaces offer: guaranteed stable internet (usually 100Mbps–1Gbps fiber), dedicated desks, meeting rooms bookable by hour, printing, air conditioning calibrated for work (not ambiance), locker storage, and a community of fellow remote workers. Cafés (Starbucks, local specialty): Good for 2–3 hour focused sessions. WiFi speed varies (10–50Mbps typical). No guarantee of seats. Usually required to buy ฿80–฿200 per session. Best cafés for work: Nimman area, Ari, Thong Lor independents. Signal: if the café has laptop stickers on MacBooks, it's work-friendly.",
      },
      {
        heading: "Pricing and packages",
        body:
          "Day pass: ฿250–฿600. Usually includes WiFi, printing, coffee/tea, AC. Hot desk monthly: ฿3,500–฿8,000. Dedicated desk monthly: ฿6,000–฿15,000. Private office: ฿15,000–฿50,000+/month. Most spaces offer trial day passes — always visit before committing to monthly. Co-work days included in some serviced apartment packages in Bangkok.",
      },
      {
        heading: "Practical Bangkok nomad tips",
        body:
          "SIM card: AIS or True Move H. Get the tourist SIM at the airport — unlimited data at 1Mbps after threshold, or pay-as-you-go top-up. ฿299–฿599 for 30 days. Banking: Kasikorn (KBank) and Bangkok Bank have best expat services. Wise / Revolut work well for transactions. Visa: Thailand Tourist Visa gets 30–60 days. METV (Multiple Entry Tourist Visa) for longer stays. LTR Visa (Long-Term Resident) for remote workers earning $80K+/year. Tax: Digital nomads staying <180 days/year typically have no Thai tax liability.",
      },
    ],
    faqs: [
      {
        q: "How much does coworking cost in Bangkok?",
        a: "Day passes are ฿250–฿600. Monthly hot desk memberships are ฿3,500–฿8,000. Most spaces include high-speed fiber WiFi, coffee/tea, and air conditioning in the price.",
      },
      {
        q: "Is Bangkok good for digital nomads?",
        a: "Yes — consistently ranked top 5-10 globally. Fast fiber internet (100Mbps+ standard at coworking spaces), low cost of living (฿30,000–฿60,000/month comfortable), English widely spoken in work contexts, excellent food, and warm weather year-round.",
      },
      {
        q: "What internet speeds can I expect at Bangkok coworking spaces?",
        a: "Most modern coworking spaces have 100Mbps–1Gbps fiber. Cafés typically have 10–50Mbps. For video calls and large uploads, always check the coworking space's speed test before booking a full day.",
      },
    ],
    related: ["best-thai-food-bangkok"],
  },
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
