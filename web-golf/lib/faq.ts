// Category-별 FAQ — AEO + Google FAQPage 리치결과 + 페이지 콘텐츠 unique 강화.

export type Faq = { q: string; a: string };

// /c/[category] FAQ. CUISINE_FAQS 라는 이름은 historical alias — 실제는 golf category FAQ.
export const CUISINE_FAQS: Record<string, Faq[]> = {
  course: [
    {
      q: "How are Thailand golf courses ranked here?",
      a: "By Trust Score (0-100), which combines Google rating (50%), review volume on log scale (40%), Local Guide reviewer ratio (10%), and reviewer authority (5%). Refreshed continuously from public Google Maps reviews.",
    },
    {
      q: "What's the average green fee at Thailand golf courses?",
      a: "Public courses range from ~฿1,500-3,000 weekday and ฿2,500-5,000 weekend. Premium country clubs run ฿4,000-8,000+. Caddy fee (~฿400) and tip (~฿400-500) are separate from green fee. Bangkok-area courses tend to be priciest; Chiang Mai and Hua Hin offer better value.",
    },
    {
      q: "Do I need to book in advance?",
      a: "Yes — weekends sell out 1-2 weeks ahead at popular Bangkok courses. Weekday tee times are usually available with 1-3 days notice. Hotels can often book on your behalf. International golfers typically book through Golfsavers, Sawasdee Golf, or directly via the course website.",
    },
  ],
  country_club: [
    {
      q: "Are country clubs in Thailand members-only?",
      a: "Most accept visitor green-fee play with an introduction or via golf agency booking. A few are fully private — those are noted in our listing. Course condition and clubhouse quality at country clubs is typically a step above public courses.",
    },
    {
      q: "How much does country club green fee cost?",
      a: "Country clubs range from ฿3,500 weekday to ฿8,000+ weekend for visitors. Some flagship clubs charge ฿10,000+ on weekends. Member rates are typically 40-60% lower.",
    },
  ],
  driving_range: [
    {
      q: "How much does it cost to use a driving range in Thailand?",
      a: "Bay rentals are typically ฿200-500/hour. Ball baskets ฿100-300 depending on size. Premium ranges with TopTracer or BirdieCam cost more. Many ranges have monthly memberships ฿2,000-5,000.",
    },
    {
      q: "Are there indoor driving ranges in Bangkok?",
      a: "Yes — many Bangkok malls now have indoor golf bays with simulators (TopTracer, GolfZon, TrackMan). Popular for evenings, monsoon-season practice, and lessons. See our Indoor Golf category.",
    },
  ],
  resort: [
    {
      q: "Which Thailand golf resorts are best for stay-and-play?",
      a: "Hua Hin, Phuket, and Chiang Mai have the strongest stay-and-play resort options. Korean tour packages most often go to Hua Hin and Pattaya area resorts. Sort the resort listing by Trust Score for the consensus picks.",
    },
    {
      q: "Do golf resorts include green fees in the room?",
      a: "Most don't — green fees are typically a paid add-on with a discount for resort guests. A few all-inclusive packages exist. Confirm at booking — packages from Golfsavers and similar agencies often bundle hotel + green fees + transfers.",
    },
  ],
  indoor: [
    {
      q: "Are indoor golf places in Thailand worth it?",
      a: "Yes — for practice, lessons, and monsoon-season play. Modern simulators (TopTracer, GolfZon, TrackMan) give shot data better than most pro shop launch monitors. Many have hitting bays plus virtual courses.",
    },
  ],
  instructor: [
    {
      q: "How much do golf lessons cost in Thailand?",
      a: "Group lessons ฿500-1,000/hour. Individual instruction ฿1,500-3,000/hour at most clubs. Foreign pros and academy programs can charge ฿3,000-5,000+. Many resorts include a free clinic.",
    },
  ],
};

export const HOME_FAQS: Faq[] = [
  {
    q: "What are the best golf courses in Thailand?",
    a: "The top-rated golf courses in Thailand by Trust Score include Siam Country Club (Pattaya/Chon Buri), Black Mountain Golf Club (Hua Hin), Nikanti Golf Club (near Bangkok), Alpine Golf & Sports Club (Bangkok), Blue Canyon Country Club (Phuket), and Thai Country Club (Bangkok). Rankings update continuously from real Google reviews — see the full Top 50 list for the current consensus.",
  },
  {
    q: "How much does it cost to play golf in Thailand?",
    a: "Green fees range from ฿1,500–3,000 at weekday public courses to ฿4,000–9,000+ at premium country clubs. Caddy fee (~฿400, mandatory) and tip (฿400–600) are additional. Total cost for a morning round is typically ฿2,500–5,000 at mid-range venues. Bangkok courses are priciest; Chiang Mai and Hua Hin offer better value for the same tier.",
  },
  {
    q: "What is the best time to play golf in Thailand?",
    a: "November to February is peak season — cool temperatures (25–30°C), low humidity, and excellent course conditions. March–April is hot but dry. May–October is monsoon season: afternoon storms are common, but courses remain playable in the morning and green fees drop 20–40%. Chiang Mai has especially ideal dry-season conditions November through February.",
  },
  {
    q: "Which city in Thailand has the best golf?",
    a: "Bangkok and its surroundings have the highest course density (80+ courses within 60 minutes). Pattaya (Chon Buri) has 25–30 courses with the strongest Korean tour-group infrastructure. Hua Hin offers the most concentrated premium stay-and-play scene (Black Mountain, Banyan). Phuket has the highest average course quality (Blue Canyon, Laguna, Red Mountain).",
  },
  {
    q: "Do Thai golf courses require a caddy?",
    a: "Yes — caddies are mandatory at almost every Thai golf course. The caddy fee (~฿400) is charged at the clubhouse on arrival; a tip of ฿400–600 is given directly to the caddy after the round. Korean- and English-speaking caddies are available at courses popular with international tour groups — request one when booking.",
  },
  {
    q: "How do I book a golf course in Thailand?",
    a: "Four options: (1) Direct — course website or phone, cheapest, limited English support. (2) Golf agency — Golfsavers, Sawasdee Golf, or GolfAsian handle full booking + airport transfer + caddy coordination. (3) Klook — simple booking for popular tourist courses. (4) Hotel concierge — best for first-time visitors. Weekends book up 1–2 weeks ahead in peak season (November–February).",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0–100) combines: Google rating (50% weight), review volume on logarithmic scale (40%), Local Guide reviewer ratio (10%), and reviewer authority via average reviewer review count (5%). It rebuilds continuously from public Google Maps data — not a paid placement or editorial selection.",
  },
  {
    q: "Are these listings sponsored?",
    a: "Organic listings are never paid. Some courses buy clearly-labelled Featured/Recommended slots that appear above organic results with explicit badges. Organic Trust Score rankings are never modified by payment.",
  },
];
