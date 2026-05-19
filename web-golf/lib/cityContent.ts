// Editorial intro + FAQ per city — drives AEO (FAQ schema), dwell time, and
// gives Google something to chew besides a card list.
//
// 5 hand-written cities cover ~70% of traffic (Bangkok, Pattaya/Chon Buri,
// Hua Hin/Prachuap Khiri Khan, Phuket, Chiang Mai). Others get a generic
// template that still emits FAQ schema.

import type { Faq } from "./guides";

export type CityContent = {
  intro: string;
  faqs: Faq[];
};

const GENERIC_FAQ = (display: string): Faq[] => [
  {
    q: `Are golf courses in ${display} open to visitors?`,
    a: `Yes — almost all public, semi-private, and resort courses in ${display} accept visitor green-fee bookings. A few member-only clubs require introduction; the listings flag those explicitly.`,
  },
  {
    q: `When is the best season to play golf in ${display}?`,
    a: `November to February has the lowest humidity and most consistent course conditions across Thailand, including ${display}. May-September is monsoon season — green fees often discounted 20-40%, but expect afternoon storms.`,
  },
  {
    q: `Do ${display} golf courses provide caddies?`,
    a: `Yes — caddies are mandatory at nearly every Thai golf course, ${display} included. Caddy fee is typically ฿400; standard tip is ฿400-500 (more at premium country clubs). Caddy fluency varies; Korean and English speakers are concentrated at courses with strong tourist traffic.`,
  },
];

export const CITY_CONTENT: Record<string, CityContent> = {
  bangkok: {
    intro:
      "Bangkok and its immediate ring (Pathum Thani, Samut Prakan, Nonthaburi) hold Thailand's densest concentration of championship-grade courses. Most are 30-60 minutes from BTS terminals; Topgolf Megacity and major driving ranges sit inside the city. Weekday tee times at non-private courses are easy to walk in for; weekends fill up 1-2 weeks ahead at marquee venues.",
    faqs: [
      {
        q: "Which Bangkok golf course is best for first-time visitors?",
        a: "Alpine Golf & Sports Club (Pathum Thani), Nikanti Golf Club (Nakhon Pathom, 45 min west), and Thai Country Club (Chachoengsao, 1 hr east) are the standard 'first Bangkok round' recommendations — well-maintained, English-speaking staff, easy logistics from downtown.",
      },
      {
        q: "How much do Bangkok green fees cost?",
        a: "Weekday public courses: ฿1,500-3,000. Weekend public: ฿2,500-4,500. Premium country clubs (Thai CC, Alpine, Nikanti): ฿4,500-9,000 visitor rate. Caddy ฿400 + tip ฿400-600 always on top. Cart usually ฿700-1,000 if not walking.",
      },
      {
        q: "Are there Korean-speaking caddies in Bangkok area?",
        a: "Yes, especially at courses with heavy Korean tour-group traffic — Lam Luk Ka, Alpine, Riverdale, and Thana City regularly have Korean-speaking caddies. Best to request specifically when booking; expect higher tip (฿600-1,000) for Korean caddies.",
      },
      {
        q: "Can I play Bangkok golf same-day without booking?",
        a: "Weekday mornings: usually yes at non-famous courses. Weekend / holiday: no, especially Nov-Feb peak season. Call the course or use Klook/Golfsavers for same-day availability.",
      },
    ],
  },
  chon_buri: {
    intro:
      "Chon Buri province — the home of Pattaya — is Thailand's #1 destination for golf tour groups. 75+ courses ranging from championship venues (Siam Country Club, Laem Chabang, Amata Spring) to family-friendly resorts. About 90-120 min from Bangkok by car; many Korean and Japanese tour packages base here. Concentrated Korean caddy supply because of tour-group demand.",
    faqs: [
      {
        q: "How many golf courses are in Pattaya?",
        a: "Around 25-30 courses across greater Pattaya / Chon Buri, with another 10-15 within a 90-minute drive. Major clusters: Siam Country Club (Old/Plantation/Waterside courses), Phoenix Gold, Mountain Shadow, Crystal Bay, Greenwood, Khao Kheow, Burapha, Laem Chabang International, Pattaya CC.",
      },
      {
        q: "Which Pattaya golf course is best for Korean golfers?",
        a: "Phoenix Gold, Mountain Shadow, Pattaya Country Club, and Khao Kheow have the strongest reputation among Korean golfers — verified caddy presence, restaurant menu support, and Korean tour-group throughput. Phoenix Gold in particular is the de facto Korean course in the region.",
      },
      {
        q: "Pattaya green fees vs Bangkok — cheaper or more expensive?",
        a: "Pattaya courses are typically 10-30% cheaper than equivalent Bangkok venues on weekdays. Weekend visitor rates are similar. Stay-and-play packages from Pattaya hotels are competitive vs paying separately.",
      },
      {
        q: "Can I do Pattaya golf as a day trip from Bangkok?",
        a: "Yes — many golfers do. Leaves Bangkok by 5:30am, plays an 8am tee time at Siam CC / Pattana / Laem Chabang, back to Bangkok by mid-afternoon. Hire a private golf transport (around ฿2,500-3,500 round trip) for convenience.",
      },
    ],
  },
  prachuap_khiri_khan: {
    intro:
      "Hua Hin (in Prachuap Khiri Khan province, 2.5-3 hours south of Bangkok) is Thailand's most concentrated golf town. Black Mountain, Banyan, Imperial Lake View, Springfield Royal, and Royal Hua Hin (Thailand's oldest course, founded 1924) anchor the region. Stay-and-play packages are mature here — most major hotels can bundle 3-night / 3-round programs.",
    faqs: [
      {
        q: "Is Hua Hin or Pattaya better for golf?",
        a: "Hua Hin: quieter, higher-end resort feel, premium courses (Black Mountain). Pattaya: cheaper, more course density, livelier nightlife. Tour groups dominate Pattaya; Hua Hin caters more to couples / leisure golfers.",
      },
      {
        q: "Best Hua Hin golf courses for visitors?",
        a: "Black Mountain Golf Club (ranked among Thailand's top 3 consistently), Banyan Golf Club, Pineapple Valley, Imperial Lake View, and Royal Hua Hin for historic character. Springfield Royal (Jack Nicklaus design) for serious players.",
      },
      {
        q: "How to get from Bangkok to Hua Hin for golf?",
        a: "Most golfers drive (2.5-3 hours) or hire private transfer (฿3,000-4,500 one-way for 4 pax + clubs). Train to Hua Hin station is scenic but slow (4 hours). Domestic flights operate sporadically.",
      },
      {
        q: "What's a typical Hua Hin golf package price?",
        a: "3-night / 3-round mid-tier package: USD 600-900 per person twin share, including 4-star hotel, breakfast, transfers, green fees, caddy fees. Black Mountain premium packages run USD 1,200-1,800 per person.",
      },
    ],
  },
  phuket: {
    intro:
      "Phuket has fewer courses than Bangkok or Pattaya but maintains a higher average tier — Laguna Phuket, Blue Canyon, Mission Hills, and Red Mountain are international-grade. Ideal pairing with beach resort stay. Wet season (May-October) brings dramatic afternoon storms but lower rates.",
    faqs: [
      {
        q: "How many golf courses are on Phuket?",
        a: "About 8-10 courses on Phuket island itself, plus a few more on neighboring Phang Nga and Krabi mainland (40-90 min ferry/drive). Major: Laguna Phuket, Blue Canyon Country Club (two courses), Mission Hills Phuket, Red Mountain, Phuket Country Club, Loch Palm.",
      },
      {
        q: "Best Phuket golf course overall?",
        a: "Blue Canyon Country Club's Canyon Course consistently rates as Thailand's #1 — host of multiple PGA / Asian Tour events. Laguna Phuket and Red Mountain are also commonly cited. Mission Hills offers ocean views.",
      },
      {
        q: "Can I play golf in Phuket during rainy season?",
        a: "Yes — afternoon storms hit hard but mornings are usually clear. Green fees drop 20-40% May-October. Courses drain quickly; play resumes within 1-2 hours after major storms typically.",
      },
      {
        q: "Phuket vs other Thai destinations for a golf vacation?",
        a: "Phuket has the best beach-and-golf combination — premium hotels, restaurants, and family activities alongside golf. Less course density and higher prices than Pattaya, but the overall holiday experience is more polished.",
      },
    ],
  },
  chiang_mai: {
    intro:
      "Chiang Mai's cool dry season (November-February) is perfect golf weather — daytime around 25-28°C, low humidity. Highlands Golf and Spa Resort, Alpine Golf Resort Chiangmai, Lanna Sports Club, and Royal Chiang Mai anchor the scene. About 75-min flight from Bangkok; many golfers do a 3-4 night Chiang Mai trip combined with cultural sightseeing.",
    faqs: [
      {
        q: "Best time of year for Chiang Mai golf?",
        a: "November to February — cool, dry, clear visibility, perfect playing temperature (25-28°C). March-April is hot. May-October is wet but courses remain green and rates drop. Avoid late February to mid-April for burning-season air quality.",
      },
      {
        q: "Are Chiang Mai green fees cheaper than Bangkok / Pattaya?",
        a: "Yes — typically 20-40% cheaper for equivalent tier. A premium round (Highlands, Alpine Chiangmai) is ฿2,500-4,500 vs ฿5,000-8,000 in Bangkok. Caddy and cart costs are the same nationally.",
      },
      {
        q: "Can I combine Chiang Mai golf with sightseeing?",
        a: "Yes — popular itinerary is 4-5 nights with 3 rounds + temple visits + elephant sanctuary + Doi Suthep. Old City hotels are central; airport-area hotels are closer to most golf courses (15-30 min vs 45-60 min from Old City).",
      },
      {
        q: "Top Chiang Mai golf course recommendations?",
        a: "Chiang Mai Highlands Golf & Spa Resort (consistently top-rated), Alpine Golf Resort Chiangmai (Jack Nicklaus-designed signature course), and Lanna Sports Club for affordable rounds. Royal Chiang Mai for traditional course.",
      },
    ],
  },
};

export function getCityContent(slug: string, display: string): CityContent {
  const hand = CITY_CONTENT[slug];
  if (hand) return hand;
  // Generic — still emits FAQ schema, gives SERP snippets and dwell time
  return {
    intro: `Browse all golf courses, country clubs, and driving ranges across ${display} province. Ranked by Trust Score from real Google review analysis — caddy quality, course conditions, English / Korean support, and reviewer authority all weighed transparently.`,
    faqs: GENERIC_FAQ(display),
  };
}
