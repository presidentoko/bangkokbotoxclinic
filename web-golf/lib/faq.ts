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
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines: course Google rating (50% weight), review volume on logarithmic scale (40%), Local Guide reviewer ratio (10%), and reviewer authority via average reviewer review count (5%). It's our derived metric — not a Google ranking. We rebuild it continuously from public Google Maps data.",
  },
  {
    q: "Are these listings sponsored?",
    a: "Organic listings are never paid. Some courses buy clearly-labelled Editor's Pick / Recommended / Featured slots, but we never delete or downrank organic listings. Sponsored slots appear above organic results with explicit badges.",
  },
  {
    q: "How fresh is this data?",
    a: "Listings and Trust Scores rebuild continuously from Google Maps scraping. Sample reviews on each course page are real, recent excerpts from public Google reviews — never edited or filtered.",
  },
  {
    q: "Why is there no booking on this site?",
    a: "Thailand has well-established golf booking partners (Golfsavers, Sawasdee Golf, Klook). Rather than reinvent the wheel and add markup, we link to their booking pages where useful and focus on giving you accurate, current information to decide where to play. Direct course websites and phone numbers are also listed where available.",
  },
  {
    q: "Is the Korean review coverage real?",
    a: "Yes — we tag courses by reviewer language (Thai/English/Korean/Japanese) using the actual Google review text. Courses popular with Korean tour groups show high Korean review counts. Korean-speaking caddy mentions are extracted from review content.",
  },
  {
    q: "What does the Korean caddy or English caddy badge mean?",
    a: "These are extracted from actual reviewer mentions — not self-reported by the course. If multiple reviewers say the caddy spoke Korean (or English), the course gets the badge. It's an indicator of language likelihood, not a guarantee — request when booking.",
  },
];
