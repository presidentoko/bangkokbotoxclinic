// 큐진별 FAQ — AEO + Google FAQPage 리치결과 + 페이지 콘텐츠 unique 강화.

export type Faq = { q: string; a: string };

export const CUISINE_FAQS: Record<string, Faq[]> = {
  thai: [
    {
      q: "What's the best Thai restaurant in Bangkok?",
      a: "It depends on your preference — for authentic local Thai with high reviewer credibility, sort by Trust Score. For fine-dining Thai, look at our Fine Dining list. The Trust Score combines real Google rating, review volume, and Local Guide reviewer ratio.",
    },
    {
      q: "Where do locals eat Thai food in Bangkok?",
      a: "Reviewers most often mention authentic Thai spots in Watthana (Sukhumvit), Pathum Wan (Siam), Bang Rak (Silom area), and Chatuchak. Street food stalls in Yaowarat (Chinatown) are also popular.",
    },
    {
      q: "How spicy is Thai food in Bangkok?",
      a: "Most Bangkok Thai restaurants serve to Thai standards by default — quite spicy. Many tourist-area restaurants will reduce spice on request. Look at restaurants with 'spicy' in topic mentions for authentic spice levels.",
    },
  ],
  japanese: [
    {
      q: "Where is the best Japanese food in Bangkok?",
      a: "Bangkok has a strong Japanese food scene — particularly in Sukhumvit (Soi 33-39), Phrom Phong, and Thong Lor. These districts have authentic Japanese restaurants run by Japanese chefs.",
    },
    {
      q: "Is sushi in Bangkok safe to eat?",
      a: "At reputable restaurants — those with high Trust Scores and reviewer mentions of fresh ingredients — yes. Bangkok's high-end Japanese restaurants often source from Toyosu market.",
    },
  ],
  korean: [
    {
      q: "Where to find Korean food in Bangkok?",
      a: "Sukhumvit Plaza (Soi 12), Phrom Phong, and parts of Sukhumvit Soi 26 have concentrations of Korean restaurants. Many cater to the Korean tourist and expat community with authentic menus and Korean-speaking staff.",
    },
  ],
  street_food: [
    {
      q: "Where is the best street food in Bangkok?",
      a: "Yaowarat (Chinatown) at night, Chatuchak Weekend Market, and Or Tor Kor Market are top destinations. Street food at established stalls (high Trust Score) is generally safe.",
    },
  ],
  italian: [
    {
      q: "Bangkok Italian restaurants — authentic or compromise?",
      a: "Bangkok has many Italian-chef-run restaurants, particularly in Sukhumvit and Sathon. Look for high reviewer mentions of 'authentic' for the most genuine experience.",
    },
  ],
  bar_pub: [
    {
      q: "Best rooftop bars in Bangkok?",
      a: "Rooftops in Sathon, Bang Rak (Silom), and Watthana (Sukhumvit) get the most reviewer mentions for views. See our 'Great View' best-of list.",
    },
  ],
};

export const HOME_FAQS: Faq[] = [
  {
    q: "What are the best things to do in Bangkok in 2026?",
    a: "Bangkok's top activities in 2026 include: Muay Thai training at local gyms (฿300–฿800/session), Thai massage and spa treatments (from ฿200/hour), Thai cooking classes with market visits (฿800–฿1,800), yoga and Pilates studios (from ฿400/class), and rooftop dining with skyline views. For first-time visitors, combine a half-day cooking class with an evening Muay Thai session and a traditional Thai massage. All ranked on Thaigle by real Google reviews — no paid rankings.",
  },
  {
    q: "What is Bangkok famous for in terms of food?",
    a: "Bangkok is globally famous for Thai street food, particularly Pad Thai, Tom Yum, Pad Kra Pao (basil stir-fry), Khao Mun Gai (chicken rice), and Mango Sticky Rice. The city also has exceptional Japanese, Korean, Italian, and Chinese restaurant scenes driven by a large expat community. Bangkok's Yaowarat (Chinatown) is one of Asia's best street food districts. Trust Scores on this site help identify the most credible restaurants vs. tourist traps.",
  },
  {
    q: "How much does a Thai massage cost in Bangkok?",
    a: "A 1-hour traditional Thai massage costs ฿200–฿400 at street-level shops, ฿500–฿1,200 at mid-range spas, and ฿1,500–฿3,000+ at luxury hotel spas. Foot massage (1 hour) is typically ฿200–฿300. Always tip 50–100 baht for good service at budget spas. Tourist-area spas (Khao San Road, Silom walking street) charge 50–100% more for similar quality.",
  },
  {
    q: "Can tourists do Muay Thai training in Bangkok?",
    a: "Yes — Bangkok has over 270 ranked Muay Thai gyms, many welcoming tourists daily. A typical 90-minute beginner session (฿300–฿800) covers pad work, bag work, and basic technique drills with an English-speaking trainer. No experience needed. Look for gyms marked 'Beginner Friendly' on Thaigle. For a one-off experience, Klook-bookable gyms (฿600–฿1,200) include equipment. For serious training, book a training camp with morning and afternoon sessions.",
  },
  {
    q: "What cooking classes are available in Bangkok for tourists?",
    a: "Bangkok has 100+ ranked cooking schools. Most offer half-day classes (3–4 hours, ฿800–฿1,800) teaching 3–5 Thai dishes — Pad Thai, Tom Yum, Green Curry, and Mango Sticky Rice are standard. Full-day classes (฿1,500–฿3,500) add a market tour at Or Tor Kor or a local wet market. Private classes for 1–2 people run ฿2,500–฿6,000. Most schools accommodate vegetarians with advance notice. Classes can be booked directly or via Klook.",
  },
  {
    q: "What are the best areas to eat in Bangkok?",
    a: "Sukhumvit (Soi 1–55): Largest concentration of international restaurants, Japanese, Korean, and upscale Thai. Yaowarat (Chinatown): Best street food, especially at night — noodle soup, seafood, dim sum. Silom / Bang Rak: Mix of budget Thai and fine dining, excellent rooftop bars. Ari: Neighborhood cafés, local-facing Thai restaurants, excellent value. Chatuchak: Or Tor Kor Market (premium Thai produce) and weekend street food. Thong Lor / Ekkamai: Trendy restaurants, brunch spots, upscale Asian cuisine.",
  },
  {
    q: "Is there yoga in Bangkok? What do yoga studios cost?",
    a: "Bangkok has 70+ ranked yoga and Pilates studios, particularly in Thong Lor, Ari, and Sukhumvit. Drop-in classes cost ฿400–฿800. A 7-day tourist intro pass (unlimited classes) is ฿800–฿1,500 — best value for short stays. Monthly memberships range from ฿2,500–฿8,000. Hot yoga is extremely popular in Bangkok. Reformer Pilates (฿600–฿1,200/session) has grown rapidly in 2024–2026. Most studios teach in English.",
  },
  {
    q: "What cheap activities can tourists do in Bangkok?",
    a: "Bangkok has excellent low-cost activities: street food at local markets (฿40–฿150/dish), traditional Thai massage (from ฿200/hour), temple visits (most free), Chatuchak Weekend Market (free entry), BTS SkyTrain to explore neighborhoods (฿16–฿59/trip), Or Tor Kor Market food tasting (under ฿200), Muay Thai training (from ฿300/session drop-in), and yoga classes (from ฿400). A full day of activities including food, massage, and transport typically costs under ฿1,000.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) is built from four components: Google star rating (max 50 pts), review volume on a log scale (max 40 pts), Local Guide reviewer ratio (max 10 pts), and reviewer authority (max 5 pts). Raw score is capped at 100. Recomputed from public Google Maps data each time the dataset is refreshed — not a Google ranking.",
  },
  {
    q: "Are the listings on Thaigle sponsored?",
    a: "Organic listings are never paid. Some restaurants and venues buy clearly-labelled Editor's Pick / Recommended / Featured slots, but organic rankings are never altered for payment. Sponsored slots appear above organic results with explicit badges.",
  },
  {
    q: "How current is the Bangkok restaurant and activity data?",
    a: "Listings and Trust Scores are rebuilt each time the dataset is refreshed, which happens in batches rather than continuously. Sample reviews on each page are real excerpts from public Google reviews. The freshness date shown on each listing page is the authoritative one.",
  },
];
