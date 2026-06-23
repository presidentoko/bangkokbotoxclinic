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
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) is built from four components: Google star rating (max 50 pts), review volume on a log scale (max 40 pts), Local Guide reviewer ratio (max 10 pts), and reviewer authority (max 5 pts). Raw score is capped at 100. Updated every 30 minutes from public Google Maps data — not a Google ranking.",
  },
  {
    q: "Are these listings sponsored?",
    a: "Organic listings are never paid. Some restaurants buy clearly-labelled Editor's Pick / Recommended / Featured slots, but we never delete or downrank organic listings. Sponsored slots appear above organic results with explicit badges.",
  },
  {
    q: "How fresh is this data?",
    a: "Listings and Trust Scores rebuild approximately every 30 minutes from continuous Google Maps scraping. Sample reviews shown on each restaurant page are real, recent excerpts from public Google reviews.",
  },
  {
    q: "Can I trust the reviews shown here?",
    a: "All reviews are sourced directly from Google Maps. We don't filter, edit, or selectively show reviews — sample reviews are picked by length and rating only, with full attribution. Local Guide counts indicate how many reviewers are Google-verified high-credibility users.",
  },
  {
    q: "Why no booking integration?",
    a: "Bangkok restaurants typically take walk-ins or use direct LINE/phone bookings. We focus on giving you accurate, current information — view on Google Maps for directions, or call directly. Some restaurants offer their own online booking via the website link on their detail page.",
  },
];
