import type { Lang } from "./site";

export type FaqItem = { q: string; a: string };

/**
 * Shared shape for the two long-form legal pages (privacy, terms). Both are
 * an intro plus an ordered list of headed sections, then a closing "how to
 * reach us" block -- kept as one type so the two page.tsx files can render
 * identically instead of duplicating markup for near-identical content.
 *
 * `contactBody` deliberately carries no contact address: this site has no
 * mailbox. The only inbound channels are the advertise form (linked via
 * `contactCta` -> /{lang}/advertise) and the per-place "report incorrect
 * info" form, both of which POST to app/api/contact/route.ts.
 */
export type LegalPage = {
  title: string;
  /** Human-readable effective date, already formatted per language. */
  updated: string;
  intro: string;
  sections: { heading: string; body: string }[];
  contactHeading: string;
  contactBody: string;
  /** Label for the link to /{lang}/advertise. */
  contactCta: string;
};

export type Dict = {
  nav: {
    home: string;
    guides: string;
    about: string;
    menuOpen: string;
    menuClose: string;
    favorites: string;
    compare: string;
    browse: string;
    searchPlaceholder: string;
    searchNoResults: string;
    searchLoading: string;
    searchError: string;
    /** Template with a "{query}" placeholder, e.g. "See all results for "{query}"". */
    searchSeeAllResults: string;
    searchOpen: string;
    searchClose: string;
  };
  home: {
    heroTitle: string;
    heroSub: string;
    philosophyTitle: string;
    philosophyBody: string;
    featuredTitle: string;
    /** Template with a "{count}" placeholder. */
    trustBadge: string;
    ctaBrowse: string;
    manifesto: string;
    stats: { places: string; reviews: string; therapists: string };
    quotesTitle: string;
    editorsPick: string;
    faqTitle: string;
    faq: FaqItem[];
    trendingTitle: string;
    recommendedTitle: string;
    discoverTitle: string;
    recentlyViewedTitle: string;
    surpriseMe: string;
    surpriseLoading: string;
    surpriseError: string;
  };
  place: {
    reviewsTitle: string;
    readMore: string;
    wlTitle: string;
    wlMetaDesc: string;
    wlHeroSubtitle: string;
    wlRedTitle: string;
    wlMethodNote: string;
    wlCleanTitle: string;
    wlCleanSubtitle: string;
    checkTitle: string;
    checkSubtitle: string;
    checkAllClear: string;
    flagOvercharge: string;
    flagTipPressure: string;
    flagUpsell: string;
    flagHygiene: string;
    flagRude: string;
    flagMentions: string;
    trendUp: string;
    trendDown: string;
    trendSteady: string;
    standingLine: string;
    priceBelow: string;
    priceTypical: string;
    priceAbove: string;
    mostCriticalTitle: string;
    noCriticalReviews: string;
    stickyReviewsCta: string;
    ownerCtaTitle: string;
    ownerCtaLink: string;
    /** Template with an "{n}" placeholder, e.g. "Show {n} more reviews". */
    showMoreReviews: string;
    /** Template with a "{date}" placeholder, e.g. "Data updated {date}". */
    dataUpdatedLabel: string;
    therapistMentionsTitle: string;
    therapistDisclaimer: string;
    noMentions: string;
    ratingLabel: string;
    reviewCountLabel: string;
    addressLabel: string;
    viewOnMaps: string;
    callNow: string;
    visitWebsite: string;
    /** Template with a "{n}" placeholder, e.g. "{n} named in reviews". */
    namedInReviews: string;
    /** Template with a "{n}" placeholder — how many times a named therapist was mentioned, shown next to their name. */
    mentionedCount: string;
    anonymousReviewer: string;
    serviceThemesTitle: string;
    moodKeywordsTitle: string;
    ratingBreakdownTitle: string;
    /** Template with a "{price}" placeholder. */
    priceRangeLabel: string;
    /** Template with "{min}" and "{max}" placeholders -- used instead of priceRangeLabel when reviewers mention more than one distinct price. */
    priceRangeLabelRange: string;
    /** Template with a "{theme}" placeholder, used inside the auto-generated summary paragraph. */
    /** Template with "{rating}" and "{reviewCount}" placeholders. */
    summaryStatsClause: string;
    summaryThemeClause: string;
    /** Template with a "{mood}" placeholder, used inside the auto-generated summary paragraph. */
    summaryMoodClause: string;
    /** Template with a "{district}" placeholder, used inside the auto-generated summary paragraph. */
    summaryDistrictClause: string;
    similarPlacesTitle: string;
    /** Template with a "{district}" placeholder. */
    viewDistrict: string;
    prosTitle: string;
    addFavorite: string;
    removeFavorite: string;
    addToCompare: string;
    removeFromCompare: string;
    /** Template with a "{max}" placeholder. */
    compareLimitReached: string;
    faqTitle: string;
    /** Template with a "{name}" placeholder. */
    ratingFaqQuestion: string;
    /** Template with "{name}", "{rating}", "{reviewCount}" placeholders. */
    ratingFaqAnswer: string;
    /** Template with a "{name}" placeholder. */
    locationFaqQuestion: string;
    /** Template with "{name}" and "{address}" placeholders. */
    locationFaqAnswer: string;
    /** Template with a "{name}" placeholder. */
    priceFaqQuestion: string;
    /** Template with "{name}" and "{price}" placeholders. */
    priceFaqAnswer: string;
  };
  /** Full-text search results at /[lang]/search?q=... */
  search: {
    title: string;
    /** Template with a "{query}" placeholder. */
    resultsForQuery: string;
    /** Template with an "{n}" placeholder. */
    resultCount: string;
    /** Template with a "{query}" placeholder. */
    noResults: string;
    noResultsHint: string;
    suggestedTitle: string;
  };
  /** Price glossary at /[lang]/prices — median price per service theme, per city, mined from review text. */
  prices: {
    title: string;
    intro: string;
    themeColumnLabel: string;
    priceColumnLabel: string;
    /** Template with a "{n}" placeholder, e.g. "Based on {n} places". */
    sampleSizeLabel: string;
    /** Template with a "{city}" placeholder. */
    noDataForCity: string;
    faqTitle: string;
    faqQuestion: string;
    /** Template with "{theme}", "{city}", "{price}" placeholders. */
    faqAnswer: string;
  };
  /** City chooser index at /[lang]/city — lists every city with data. */
  cities: {
    title: string;
    intro: string;
  };
  /** listTitle/intro/faqTitle/faq[].* use a "{city}" placeholder, e.g. "Massage & spa in {city}". */
  city: {
    listTitle: string;
    placeCount: string;
    intro: string;
    /** Template with a "{shown}" placeholder, e.g. "Showing the top {shown} by rating.". */
    showingTop: string;
    loadMore: string;
    loadMoreLoading: string;
    showMapLabel: string;
    nearMeLabel: string;
    nearMeLoading: string;
    nearMeDenied: string;
    nearMeUnavailable: string;
    /** Template with a "{km}" placeholder, e.g. "{km} km away". */
    nearMeDistance: string;
    faqTitle: string;
    faq: FaqItem[];
    trendingTitle: string;
    browseByAreaTitle: string;
    /** Template with a "{mood}" placeholder, e.g. "Quiet & relaxing picks". */
    moodSectionTitle: string;
    viewAll: string;
    browseAllTitle: string;
  };
  /** listTitle/intro use "{theme}" and "{city}" placeholders; backToCity uses "{city}". */
  service: {
    listTitle: string;
    /** Same placeholders as listTitle — used instead of listTitle when the label is a mood keyword (e.g. "Clean", "Gentle"), since "Best {theme}" reads as ungrammatical for those. */
    moodListTitle: string;
    intro: string;
    backToCity: string;
    faqTitle: string;
    /** Template with "{theme}" and "{city}" placeholders. */
    faqQuestion: string;
    /** Same placeholders as faqQuestion — used for mood-keyword labels, same reasoning as moodListTitle. */
    moodFaqQuestion: string;
    /** Template with "{count}", "{theme}", and "{city}" placeholders. */
    faqAnswer: string;
    /** Template with a "{rating}" placeholder — appended as a second sentence only when an average rating exists. */
    faqAnswerRatingClause: string;
    /** Template with "{name}", "{rating}", "{reviewCount}" placeholders — names the actual #1-ranked place instead of only stating a count, so the page (and its FAQ schema) gives a direct, citable answer. */
    faqAnswerTopPick: string;
    topPickLabel: string;
  };
  /** listTitle/intro/faqQuestion/faqAnswer use "{district}" and "{city}" placeholders; faqAnswer also uses "{count}". */
  district: {
    listTitle: string;
    intro: string;
    backToCity: string;
    faqTitle: string;
    faqQuestion: string;
    faqAnswer: string;
    /** Same placeholders/purpose as service.faqAnswerTopPick. */
    faqAnswerTopPick: string;
    topPickLabel: string;
  };
  trustScore: {
    title: string;
    excellent: string;
    good: string;
    fair: string;
    limited: string;
    breakdownRating: string;
    breakdownVolume: string;
    breakdownDiversity: string;
    explainer: string;
  };
  guide: { indexTitle: string; indexDescription: string; relatedGuidesTitle: string; browseLinksTitle: string };
  favorites: {
    title: string;
    intro: string;
    empty: string;
    browseCta: string;
    suggestedTitle: string;
    loadError: string;
    retry: string;
  };
  compare: {
    title: string;
    intro: string;
    empty: string;
    browseCta: string;
    clearAll: string;
    themesLabel: string;
    moodsLabel: string;
    priceLabel: string;
    viewButton: string;
    suggestedTitle: string;
    loadError: string;
    retry: string;
  };
  share: {
    button: string;
    copied: string;
  };
  priceFilter: {
    label: string;
    all: string;
    /** Template with a "{price}" placeholder — the top bucket ("X฿+"). */
    over: string;
    /** Template with "{min}" and "{max}" placeholders. */
    range: string;
    /** Template with a "{price}" placeholder — the bottom bucket ("Under X฿"). */
    under: string;
    noPriceData: string;
  };
  about: { title: string; body: string; trustScoreTitle: string; trustScoreBody: string };
  privacy: LegalPage;
  terms: LegalPage;
  footer: { rights: string; tagline: string; exploreTitle: string; languageTitle: string };
  notFound: { title: string; body: string; cta: string };
  errorPage: { title: string; body: string; retry: string; cta: string };
  advertise: {
    title: string;
    intro: string;
    nameLabel: string;
    contactLabel: string;
    contactPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
  correction: {
    linkLabel: string;
    title: string;
    issueTypeLabel: string;
    issueTypes: { closed: string; wrongInfo: string; duplicate: string; other: string };
    detailsLabel: string;
    detailsPlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    cancel: string;
  };
};

const en: Dict = {
  nav: {
    home: "Home",
    guides: "Guides",
    about: "About",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    favorites: "Favorites",
    compare: "Compare",
    browse: "Browse",
    searchPlaceholder: "Search places…",
    searchNoResults: "No places found.",
    searchLoading: "Loading…",
    searchError: "Couldn't load search. Tap to retry.",
    searchSeeAllResults: 'See all results for "{query}"',
    searchOpen: "Search",
    searchClose: "Close search",
  },
  home: {
    heroTitle: "Find the vibe, not just the rating.",
    heroSub:
      "chillanel reads real Google reviews to surface the mood of every massage & spa place — quiet and calm, or lively and social — so you know what you're walking into before you book.",
    philosophyTitle: "Why we're different",
    philosophyBody:
      "A 4.8-star spa can still feel rushed, and a plain shophouse can feel like your favorite living room. We mine real reviews for the mood words guests actually use — quiet, strong pressure, good value — so you match the vibe, not just the stars.",
    featuredTitle: "Featured places",
    trustBadge: "{count}+ places, built from real Google reviews",
    ctaBrowse: "Browse all places",
    manifesto: "No paid placements. No sponsored ranks. Every listing pulled straight from public Google reviews.",
    stats: { places: "places listed", reviews: "reviews analyzed", therapists: "therapists named by reviewers" },
    quotesTitle: "In their own words",
    editorsPick: "Top rated",
    faqTitle: "Common questions",
    faq: [
      {
        q: "How is chillanel different from other massage & spa listing sites?",
        a: "Most sites rank by facility — lobby, decor, price. We read real Google reviews for the mood words guests actually use — quiet, lively, strong pressure, good value — so you know what a place feels like before you go, not just how many stars it has.",
      },
      {
        q: "Where do the mood tags come from?",
        a: "Every mood keyword (quiet & relaxing, strong pressure, good value, and more) is pulled straight from real Google reviews for that place — we don't write or edit them. The more reviews mention a mood, the more prominently it shows.",
      },
      {
        q: "How do I pick a good massage place?",
        a: "Start with the rating and review count, then check the mood tags for what regulars actually say it feels like. If a specific therapist is mentioned by name more than once in reviews, that's also a strong signal worth reading.",
      },
    ],
    trendingTitle: "What reviewers say most",
    recommendedTitle: "Recommended for you",
    discoverTitle: "Discover something new",
    recentlyViewedTitle: "Recently viewed",
    surpriseMe: "🎲 Surprise me",
    surpriseLoading: "Picking…",
    surpriseError: "Couldn't pick a place — check your connection and try again.",
  },
  place: {
    reviewsTitle: "What reviewers say",
    readMore: "Read more",
    wlTitle: "Chillanel Watchlist",
    wlMetaDesc: "Massage & spa places where multiple recent reviews mention overcharging, tip pressure, hard selling, hygiene or rudeness — with the receipts, mined from real Google reviews. Plus the clean list that passed every check.",
    wlHeroSubtitle: "We mined every review in our database for warning signals — overcharging, tip pressure, hard selling, hygiene, rudeness. These places tripped the alarm more than once. And the ones that didn’t? They’re here too.",
    wlRedTitle: "Places reviewers warn about",
    wlMethodNote: "A flag means 2+ reviews rated ★4 or below mention the same problem, in the reviewers’ own words. It’s a pattern, not a verdict — open the full report before judging.",
    wlCleanTitle: "Clean sweep",
    wlCleanSubtitle: "Zero warning signals across every review we analysed, ★4.7+, 100+ reviews. Same test, opposite result.",
    checkTitle: "Chillanel Check",
    checkSubtitle: "What the star rating won’t tell you — mined from {n} real reviews",
    checkAllClear: "No overcharging, tip-pressure, hard-sell, hygiene or rudeness complaints found across {n} reviews",
    flagOvercharge: "Overcharging signals",
    flagTipPressure: "Tip pressure",
    flagUpsell: "Hard selling",
    flagHygiene: "Cleanliness complaints",
    flagRude: "Rudeness complaints",
    flagMentions: "flagged in {n} review(s)",
    trendUp: "Recent reviews (12 mo): ★{recent} across {n} reviews — trending above the ★{overall} all-time average",
    trendDown: "Recent reviews (12 mo): ★{recent} across {n} reviews — slipping below the ★{overall} all-time average",
    trendSteady: "Recent reviews (12 mo): ★{recent} across {n} reviews — consistent with the ★{overall} all-time average",
    standingLine: "Rated higher than {pct}% of {total} established places in {district}",
    priceBelow: "~฿{price} per session — below the {district} going rate (฿{median})",
    priceTypical: "~฿{price} per session — in line with the {district} going rate (฿{median})",
    priceAbove: "~฿{price} per session — above the {district} going rate (฿{median})",
    mostCriticalTitle: "Most critical review",
    noCriticalReviews: "No review rated 3★ or below among the {n} we analysed — none to hide.",
    stickyReviewsCta: "Read {n} real reviews",
    ownerCtaTitle: "Run this place?",
    ownerCtaLink: "Get featured on chillanel",
    showMoreReviews: "Show {n} more reviews",
    dataUpdatedLabel: "Data updated {date}",
    therapistMentionsTitle: "Reviewers mentioned",
    therapistDisclaimer:
      "These names are auto-extracted from public reviews and are unverified — always confirm availability with the venue.",
    noMentions: "No individual staff mentioned by name yet in the reviews we've collected.",
    ratingLabel: "Rating",
    reviewCountLabel: "reviews",
    addressLabel: "Address",
    viewOnMaps: "View on Google Maps",
    callNow: "Call now",
    visitWebsite: "Visit website",
    namedInReviews: "{n} named in reviews",
    mentionedCount: "mentioned {n}x",
    anonymousReviewer: "Anonymous",
    serviceThemesTitle: "Services mentioned in reviews",
    moodKeywordsTitle: "How reviewers describe it",
    ratingBreakdownTitle: "Rating breakdown",
    priceRangeLabel: "~{price}฿ per session, based on reviewer mentions",
    priceRangeLabelRange: "~{min}–{max}฿ per session, based on reviewer mentions",
    summaryStatsClause: "Rated {rating} from {reviewCount} reviews.",
    summaryThemeClause: "Reviewers most often mention {theme} here.",
    summaryMoodClause: "Regulars describe the place as {mood}.",
    summaryDistrictClause: "Located in {district}.",
    similarPlacesTitle: "Similar places nearby",
    viewDistrict: "More places in {district} →",
    prosTitle: "Why reviewers like it",
    addFavorite: "Save to favorites",
    removeFavorite: "Remove from favorites",
    addToCompare: "Add to compare",
    removeFromCompare: "Remove from compare",
    compareLimitReached: "You can compare up to {max} places at once",
    faqTitle: "FAQ",
    ratingFaqQuestion: "What is {name}'s rating?",
    ratingFaqAnswer: "{name} has a {rating}★ rating from {reviewCount} Google reviews.",
    locationFaqQuestion: "Where is {name} located?",
    locationFaqAnswer: "{name} is located at {address}.",
    priceFaqQuestion: "How much does {name} cost?",
    priceFaqAnswer: "Based on reviewer mentions, a session at {name} costs around ~{price}฿.",
  },
  search: {
    title: "Search",
    resultsForQuery: 'Results for "{query}"',
    resultCount: "{n} places found",
    noResults: 'No places matched "{query}".',
    noResultsHint: "Try a different spelling, or browse by city instead.",
    suggestedTitle: "Popular right now",
  },
  prices: {
    title: "Massage & spa pricing guide",
    intro:
      "Median prices mined from real reviewer mentions, by service and city — what people actually said they paid, not a rate card.",
    themeColumnLabel: "Service",
    priceColumnLabel: "Median price",
    sampleSizeLabel: "Based on {n} places",
    noDataForCity: "Not enough price data yet for {city}.",
    faqTitle: "Pricing FAQ",
    faqQuestion: "What's the median price for {theme} in {city}?",
    faqAnswer: "Based on reviewer mentions across {city}, {theme} runs around ~{price}฿.",
  },
  cities: {
    title: "Cities",
    intro: "Pick a city to browse real, review-backed massage & spa listings.",
  },
  city: {
    listTitle: "Massage & spa in {city}",
    placeCount: "places",
    intro: "Real Google reviews from {city}, mined for the mood of each place — quiet, lively, strong pressure, good value — not just a star rating.",
    showingTop: "Showing the top {shown}, sorted by rating.",
    loadMore: "Show more places",
    loadMoreLoading: "Loading…",
    showMapLabel: "Show map",
    nearMeLabel: "Near me",
    nearMeLoading: "Locating…",
    nearMeDenied: "Location access denied — enable it in your browser settings to sort by distance.",
    nearMeUnavailable: "Location isn't available on this device.",
    nearMeDistance: "{km} km away",
    faqTitle: "Massage & spa in {city} — FAQ",
    faq: [
      {
        q: "What's the best way to choose a massage place in {city}?",
        a: "Look past the star rating alone — check review count for reliability, and see if any therapist is mentioned by name more than once. That's usually a better signal of consistent quality than the storefront.",
      },
      {
        q: "Are these all real businesses?",
        a: "Yes — every listing here comes from real, public Google Maps data for {city}: name, address, rating, and reviews.",
      },
      {
        q: "Does chillanel take bookings?",
        a: "No — chillanel is an independent guide, not a booking platform. Tap through to a place's Google Maps listing to call or get directions directly.",
      },
    ],
    trendingTitle: "What reviewers say most in {city}",
    browseByAreaTitle: "Browse by area",
    moodSectionTitle: "{mood} picks",
    viewAll: "View all",
    browseAllTitle: "Browse all places",
  },
  service: {
    listTitle: "Best {theme} in {city}",
    moodListTitle: "{theme} massage places in {city}",
    intro: "Real Google reviews mentioning {theme} in {city}, ranked by rating and review count.",
    backToCity: "← All places in {city}",
    faqTitle: "FAQ",
    faqQuestion: "What's the best {theme} in {city}?",
    moodFaqQuestion: "Which massage places in {city} are known for {theme}?",
    faqAnswer: "Based on real Google reviews, {count} places in {city} are noted for {theme}.",
    faqAnswerRatingClause: "Their average rating is {rating}★.",
    faqAnswerTopPick: "{name} is the top-rated pick, at {rating}★ from {reviewCount} reviews.",
    topPickLabel: "Top pick",
  },
  district: {
    listTitle: "Massage & spa in {district}, {city}",
    intro: "Real Google reviews from massage and spa places in {district}, {city} — ranked by rating and review count.",
    backToCity: "← All areas in {city}",
    faqTitle: "FAQ",
    faqQuestion: "What's the best massage or spa in {district}?",
    faqAnswer: "Based on real Google reviews, {count} places in {district} are listed here.",
    faqAnswerTopPick: "{name} is the top-rated pick, at {rating}★ from {reviewCount} reviews.",
    topPickLabel: "Top pick",
  },
  trustScore: {
    title: "Trust Score",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    limited: "Limited data",
    breakdownRating: "Rating",
    breakdownVolume: "Reviews",
    breakdownDiversity: "Signal diversity",
    explainer:
      "Combines your rating, review volume, and how many distinct things reviewers actually mention into one 0-100 number — a fuller picture than a star rating alone.",
  },
  guide: {
    indexTitle: "Guides",
    indexDescription:
      "Straight answers on Thai massage styles, pricing, tipping, and how to spot a legit place — written from real reviews, not marketing copy.",
    relatedGuidesTitle: "Related guides",
    browseLinksTitle: "Keep exploring",
  },
  favorites: {
    title: "Your favorites",
    intro: "Saved on this device only — nothing is uploaded, so favorites won't follow you to another browser.",
    empty: "No favorites yet. Tap the heart on any place to save it here.",
    browseCta: "Browse places",
    suggestedTitle: "Popular right now",
    loadError: "Couldn't load your favorites — your saved places are safe, this was just a connection hiccup.",
    retry: "Try again",
  },
  compare: {
    title: "Compare places",
    intro: "Pick up to 3 places from any listing to compare them side by side.",
    empty: "Nothing selected yet. Tap the + on any place to add it here.",
    browseCta: "Browse places",
    clearAll: "Clear all",
    themesLabel: "Top services",
    moodsLabel: "Reviewers say",
    priceLabel: "Typical price",
    loadError: "Couldn't load your comparison — your selection is safe, this was just a connection hiccup.",
    retry: "Try again",
    viewButton: "View",
    suggestedTitle: "Popular right now",
  },
  share: {
    button: "Share",
    copied: "Link copied",
  },
  priceFilter: {
    label: "Price",
    all: "All prices",
    over: "{price}฿+",
    range: "{min}–{max}฿",
    under: "Under {price}฿",
    noPriceData: "No price data",
  },
  about: {
    title: "About chillanel",
    body:
      "chillanel is an independent guide to massage and spa places in Thailand. We're not affiliated with any venue. Our angle: a star rating doesn't tell you what a place actually feels like, so we mine real reviews for the mood words guests use — quiet, lively, strong pressure, good value — and surface that alongside the rating.",
    trustScoreTitle: "How the Trust Score works",
    trustScoreBody:
      "Every place gets a 0-100 Trust Score built from three things we can verify. Half comes from the Google rating itself (50 points). Just over a third comes from how many reviews back that rating up, on a log scale so one viral review can't skew things (35 points). The rest comes from how many distinct things reviewers actually mention about the place — service style, mood, cleanliness — capped at 15 points. A place with no reviewer detail beyond a star rating scores lower on that last part; it isn't a penalty, just an honest reflection of how much we could verify.",
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: 20 August 2026",
    intro:
      "chillanel is an independent guide to massage and spa places in Thailand, published at chillanel.com. This page explains exactly what happens to information when you use the site. It is short because the site does very little with your data.",
    sections: [
      {
        heading: "No accounts, no user database",
        body: "There is no sign-up, no login, and no user profile on chillanel. You can browse every page, search, and use every feature without telling us who you are. We do not keep a database of visitors.",
      },
      {
        heading: "What stays in your browser",
        body: "Your saved favourites, your compare list, and your recently-viewed places are stored by your browser in localStorage on your own device, under keys beginning with \"chillanel:\". They are never sent to us or to anyone else — they exist only on the device you used them on. Clearing your browser's site data for chillanel.com deletes them for good, and we have no copy to restore.",
      },
      {
        heading: "What you send us through the forms",
        body: "This site has two forms, and they are the only way information reaches us. The advertising enquiry form asks for your name, a contact detail of your choosing, and your message. The \"Report incorrect info\" form on a place page sends which place you are reporting, the type of issue, the details you write, and — optionally — a contact detail. Both are delivered as a message to a private Telegram chat belonging to the site operator, using the Telegram Bot API. They are not written to a database on this site. Please include only contact details you are comfortable sending.",
      },
      {
        heading: "IP addresses",
        body: "When a form is submitted, the server briefly reads the IP address the request came from, for one purpose only: rate limiting, which blocks more than five submissions from the same address within ten minutes so the form cannot be flooded. That count is held in the memory of the running server process and disappears when the process stops. It is not written to a database, not written to a log file, and not included in the message forwarded to Telegram. Simply browsing the site does not trigger any of this.",
      },
      {
        heading: "Analytics",
        body: "We use Vercel Web Analytics and Vercel Speed Insights to see which pages get visited and how fast they load. Both are cookieless and report aggregate figures only — page counts, referrers, loading times. They set no cookies, do not follow you to other websites, and do not build a profile of you as an individual.",
      },
      {
        heading: "Cookies",
        body: "chillanel sets no cookies of its own. That is why there is no cookie consent banner.",
      },
      {
        heading: "Maps",
        body: "Place and city maps are drawn with map tiles from OpenStreetMap. When a map loads, your browser requests those tiles directly from OpenStreetMap's servers, which means your IP address is visible to them in the same way it is to any website you visit. That request is governed by OpenStreetMap's own policies, and we receive nothing back from it.",
      },
      {
        heading: "Hosting",
        body: "The site is hosted on Vercel. As with any web host, the requests that deliver these pages to you pass through Vercel's infrastructure.",
      },
      {
        heading: "Where the listing data comes from",
        body: "Every listing here comes from real, public Google Maps data: name, address, rating, and reviews. Review text and the public display name the reviewer chose on Google are shown as they were published — we do not write, edit, or invent them. If you are a reviewer or a venue and you want something on a page corrected or taken down, use the \"Report incorrect info\" form on that place's page and tell us which listing it is.",
      },
      {
        heading: "Advertising",
        body: "chillanel currently carries no third-party advertising, and no advertising or ad-network scripts are loaded on this site. If that changes, this page will be updated first to name the provider and say what it collects.",
      },
      {
        heading: "Changes to this policy",
        body: "If what the site does with data changes, this page changes with it, and the date at the top is updated.",
      },
    ],
    contactHeading: "Questions",
    contactBody:
      "There is no separate contact address for this site. For anything about a specific listing — including a correction or a removal request — use the \"Report incorrect info\" form at the bottom of that place's page. For anything else, including questions about this policy, use the advertising enquiry form; it reaches the same person.",
    contactCta: "Open the enquiry form",
  },
  terms: {
    title: "Terms of Use",
    updated: "Last updated: 20 August 2026",
    intro:
      "These terms cover your use of chillanel.com. By using the site you accept them. If you don't, please don't use the site.",
    sections: [
      {
        heading: "What chillanel is",
        body: "chillanel is an independent guide to massage and spa places in Thailand. We are not affiliated with, owned by, or paid by any venue listed here. There are no paid placements and no sponsored ranks — a place cannot buy its way up the list.",
      },
      {
        heading: "What chillanel is not",
        body: "It is not a booking platform and not an agent. We take no bookings, handle no payments, and are not a party to anything you arrange with a venue. Contact details and map links are here so you can deal with a venue directly; whatever happens between you and that venue is between you and that venue.",
      },
      {
        heading: "Accuracy",
        body: "Listings are built from public Google Maps data collected before the site is published, so what you see is a snapshot, not a live feed. Places close, move, change their hours, and change their prices, and a page here can go out of date without us knowing. Treat everything you read here as a starting point and confirm the details with the venue before you travel or book. The site is offered as it is, with no guarantee that any particular listing is current, complete, or correct.",
      },
      {
        heading: "Reviews and mood keywords",
        body: "Review text is quoted from public Google reviews and belongs to the people who wrote it — those are their opinions, not ours, and we do not edit them. The mood and service keywords on each page are extracted automatically from that review text by software. Automatic extraction can misread a review, so read those keywords as a summary of what reviewers tended to mention, not as a verified fact about a venue.",
      },
      {
        heading: "About the Trust Score",
        body: "The Trust Score is our own calculation from the Google rating, the number of reviews behind it, and how much detail reviewers gave. It is a reading of the public evidence available about a place — not an inspection, not a certification, and not an endorsement. A high score does not mean we have visited or vetted a venue, and a low score is not an accusation.",
      },
      {
        heading: "Prices",
        body: "Price figures shown are amounts mentioned in review text, not quotes from the venue. They can be old, they can refer to a different service than the one you want, and they are binding on nobody. Ask the venue for its current price.",
      },
      {
        heading: "Using the site fairly",
        body: "Please use chillanel as an ordinary visitor would. Do not bulk-copy or scrape the site's listings, do not use the forms to send spam or anything abusive, and do not try to disrupt the site or work around the submission limits on the forms.",
      },
      {
        heading: "Content and ownership",
        body: "The site's design, the copy we wrote, its category and mood groupings, and the Trust Score calculation are chillanel's. Place names, addresses, ratings, and review text belong to their respective owners and are shown here as public information about those businesses. Google and Google Maps are trademarks of Google LLC; map data is © OpenStreetMap contributors.",
      },
      {
        heading: "Corrections and removals",
        body: "Every place page has a \"Report incorrect info\" form. Use it to tell us that a place has closed, that its details are wrong, that a listing is duplicated, or that something should be taken down. It reaches us directly and it is the fastest way to get a page fixed.",
      },
      {
        heading: "Advertising enquiries",
        body: "Venue owners who want more visibility can use the advertising enquiry form. To be clear about what that does: sending an enquiry does not change a place's position in any ranking or its Trust Score. Neither of those is for sale.",
      },
      {
        heading: "Changes to these terms",
        body: "These terms may change as the site changes. The current version is always the one on this page, with its date at the top.",
      },
    ],
    contactHeading: "Questions",
    contactBody:
      "For anything about a specific listing, use the \"Report incorrect info\" form on that place's page. For anything else, including questions about these terms, use the advertising enquiry form. Both reach the same person.",
    contactCta: "Open the enquiry form",
  },
  footer: {
    rights: "Independent guide. Not affiliated with any venue.",
    tagline: "Every place has a mood. We help you find yours.",
    exploreTitle: "Explore",
    languageTitle: "Language",
  },
  notFound: {
    title: "Page not found",
    body: "This page doesn't exist, or the place may have closed or been removed.",
    cta: "Back to home",
  },
  errorPage: {
    title: "Something went wrong",
    body: "An unexpected error occurred while loading this page.",
    retry: "Try again",
    cta: "Back to home",
  },
  advertise: {
    title: "Advertise with chillanel",
    intro: "Own a spa or massage place and want more visibility? Tell us a bit about your business and we'll get back to you.",
    nameLabel: "Your name",
    contactLabel: "Contact (email, phone, or Line ID)",
    contactPlaceholder: "you@example.com",
    messageLabel: "Message",
    messagePlaceholder: "Tell us about your business and what you're looking for.",
    submit: "Send inquiry",
    sending: "Sending…",
    success: "Thanks — we've received your inquiry and will be in touch.",
    error: "Something went wrong sending your inquiry. Please try again.",
  },
  correction: {
    linkLabel: "Report incorrect info",
    title: "Report an issue with this listing",
    issueTypeLabel: "What's wrong?",
    issueTypes: {
      closed: "This place has closed",
      wrongInfo: "Address, phone, or other info is wrong",
      duplicate: "This is a duplicate listing",
      other: "Something else",
    },
    detailsLabel: "Details",
    detailsPlaceholder: "What should we fix?",
    contactLabel: "Your contact (optional, in case we have questions)",
    contactPlaceholder: "you@example.com",
    submit: "Send report",
    sending: "Sending…",
    success: "Thanks — we've received your report.",
    error: "Something went wrong sending your report. Please try again.",
    cancel: "Cancel",
  },
};

const th: Dict = {
  nav: {
    home: "หน้าแรก",
    guides: "คู่มือ",
    about: "เกี่ยวกับเรา",
    menuOpen: "เปิดเมนู",
    menuClose: "ปิดเมนู",
    favorites: "รายการโปรด",
    compare: "เปรียบเทียบ",
    browse: "ดูร้าน",
    searchPlaceholder: "ค้นหาร้าน…",
    searchNoResults: "ไม่พบร้านที่ค้นหา",
    searchLoading: "กำลังโหลด…",
    searchError: "โหลดการค้นหาไม่สำเร็จ แตะเพื่อลองอีกครั้ง",
    searchSeeAllResults: 'ดูผลลัพธ์ทั้งหมดสำหรับ "{query}"',
    searchOpen: "ค้นหา",
    searchClose: "ปิดการค้นหา",
  },
  home: {
    heroTitle: "หาบรรยากาศที่ใช่ ไม่ใช่แค่คะแนนดาว",
    heroSub:
      "chillanel อ่านรีวิว Google จริงเพื่อดึงบรรยากาศของแต่ละร้านนวด & สปา — เงียบสงบผ่อนคลาย หรือคึกคักเป็นกันเอง — ให้คุณรู้ก่อนจองว่าจะเจอกับอะไร",
    philosophyTitle: "ทำไมเราถึงต่าง",
    philosophyBody:
      "ร้านคะแนน 4.8 ก็ยังรู้สึกเร่งรีบได้ ส่วนร้านเล็ก ๆ ธรรมดาก็อาจรู้สึกอบอุ่นเหมือนบ้านตัวเอง เราขุดรีวิวจริงหาคำที่ลูกค้าใช้บอกบรรยากาศ — เงียบสงบ นวดแรง คุ้มค่า — เพื่อให้คุณเจอบรรยากาศที่ใช่ ไม่ใช่แค่ดูดาว",
    featuredTitle: "ร้านแนะนำ",
    trustBadge: "รวมกว่า {count}+ ร้าน จากรีวิว Google จริง",
    ctaBrowse: "ดูร้านทั้งหมด",
    manifesto: "ไม่มีการจ่ายเงินจัดอันดับ ไม่มีสปอนเซอร์ ทุกรายชื่อดึงตรงจากรีวิว Google สาธารณะ",
    stats: { places: "ร้านที่รวบรวม", reviews: "รีวิวที่วิเคราะห์", therapists: "หมอนวดที่ถูกเอ่ยชื่อโดยรีวิว" },
    quotesTitle: "คำพูดจากรีวิวจริง",
    editorsPick: "คะแนนสูงสุด",
    faqTitle: "คำถามที่พบบ่อย",
    faq: [
      {
        q: "chillanel ต่างจากเว็บจัดอันดับร้านนวด/สปาอื่นยังไง?",
        a: "เว็บส่วนใหญ่จัดอันดับจากหน้าร้าน ล็อบบี้ ราคา แต่เราอ่านรีวิว Google จริงหาคำที่ลูกค้าใช้บอกบรรยากาศ — เงียบสงบ คึกคัก นวดแรง คุ้มค่า — ให้คุณรู้ก่อนไปว่าร้านนั้นจะรู้สึกยังไง ไม่ใช่แค่ดูจำนวนดาว",
      },
      {
        q: "แท็กบรรยากาศมาจากไหน?",
        a: "แท็กบรรยากาศแต่ละอัน (เงียบสงบผ่อนคลาย นวดแรง คุ้มค่า และอื่น ๆ) ดึงมาจากรีวิว Google จริงของร้านนั้นโดยตรง เราไม่ได้เขียนหรือแก้ไขเอง ยิ่งมีรีวิวพูดถึงบรรยากาศนั้นมาก แท็กก็จะยิ่งเด่นขึ้น",
      },
      {
        q: "จะเลือกร้านนวดยังไงดี?",
        a: "เริ่มจากคะแนนและจำนวนรีวิว จากนั้นดูแท็กบรรยากาศว่าลูกค้าประจำบอกว่าร้านนี้เป็นยังไง ถ้ามีชื่อหมอนวดคนไหนถูกเอ่ยซ้ำ ๆ ในรีวิว นั่นก็เป็นสัญญาณที่น่าสนใจเช่นกัน",
      },
    ],
    trendingTitle: "รีวิวพูดถึงอะไรมากที่สุด",
    recommendedTitle: "แนะนำสำหรับคุณ",
    discoverTitle: "ลองที่ใหม่ดูไหม",
    recentlyViewedTitle: "ดูล่าสุด",
    surpriseMe: "🎲 สุ่มให้เลย",
    surpriseLoading: "กำลังสุ่ม…",
    surpriseError: "สุ่มร้านไม่สำเร็จ — ลองตรวจสอบการเชื่อมต่อแล้วลองใหม่",
  },
  place: {
    reviewsTitle: "รีวิวจากผู้ใช้บริการ",
    readMore: "อ่านต่อ",
    wlTitle: "Chillanel Watchlist",
    wlMetaDesc: "ร้านนวดและสปาที่หลายรีวิวพูดถึงการโก่งราคา บังคับทิป ยัดเยียดขาย ความสะอาด หรือความหยาบคาย พร้อมหลักฐานจากรีวิวจริง และรายชื่อร้านที่ผ่านทุกการตรวจ",
    wlHeroSubtitle: "เราวิเคราะห์ทุกรีวิวในฐานข้อมูลเพื่อหาสัญญาณเตือน — โก่งราคา บังคับทิป ยัดเยียดขาย ความสะอาด ความหยาบคาย ร้านเหล่านี้มีสัญญาณซ้ำมากกว่าหนึ่งครั้ง ส่วนร้านที่ไม่มีเลยก็อยู่ที่นี่เช่นกัน",
    wlRedTitle: "ร้านที่ผู้รีวิวเตือน",
    wlMethodNote: "ธงหมายถึงรีวิว ★4 ลงมา 2+ รีวิวพูดถึงปัญหาเดียวกัน — เป็นแพทเทิร์น ไม่ใช่คำตัดสิน โปรดอ่านรายงานเต็มก่อนตัดสินใจ",
    wlCleanTitle: "ผ่านทุกการตรวจ",
    wlCleanSubtitle: "ไม่พบสัญญาณเตือนในทุกรีวิวที่วิเคราะห์ ★4.7+ รีวิว 100+ การทดสอบเดียวกัน ผลตรงกันข้าม",
    checkTitle: "Chillanel Check",
    checkSubtitle: "สิ่งที่ดาวไม่บอกคุณ — วิเคราะห์จาก {n} รีวิวจริง",
    checkAllClear: "ไม่พบการร้องเรียนเรื่องโก่งราคา บังคับทิป ยัดเยียดขาย ความสะอาด หรือความหยาบคายใน {n} รีวิว",
    flagOvercharge: "สัญญาณโก่งราคา",
    flagTipPressure: "บังคับทิป",
    flagUpsell: "ยัดเยียดขาย",
    flagHygiene: "ร้องเรียนความสะอาด",
    flagRude: "ร้องเรียนความหยาบคาย",
    flagMentions: "พบใน {n} รีวิว",
    trendUp: "รีวิว 12 เดือนล่าสุด: ★{recent} จาก {n} รีวิว — สูงกว่าค่าเฉลี่ยรวม ★{overall}",
    trendDown: "รีวิว 12 เดือนล่าสุด: ★{recent} จาก {n} รีวิว — ต่ำกว่าค่าเฉลี่ยรวม ★{overall}",
    trendSteady: "รีวิว 12 เดือนล่าสุด: ★{recent} จาก {n} รีวิว — สอดคล้องกับค่าเฉลี่ยรวม ★{overall}",
    standingLine: "คะแนนสูงกว่า {pct}% ของ {total} ร้านใน{district}",
    priceBelow: "~฿{price} ต่อครั้ง — ถูกกว่าราคากลางใน{district} (฿{median})",
    priceTypical: "~฿{price} ต่อครั้ง — ใกล้เคียงราคากลางใน{district} (฿{median})",
    priceAbove: "~฿{price} ต่อครั้ง — แพงกว่าราคากลางใน{district} (฿{median})",
    mostCriticalTitle: "รีวิวเชิงวิจารณ์ที่สุด",
    noCriticalReviews: "ไม่มีรีวิวต่ำกว่า 3★ ใน {n} รีวิวที่เราวิเคราะห์ — ไม่มีอะไรต้องซ่อน",
    stickyReviewsCta: "อ่าน {n} รีวิวจริง",
    ownerCtaTitle: "คุณเป็นเจ้าของร้านนี้?",
    ownerCtaLink: "ลงโฆษณากับ chillanel",
    showMoreReviews: "ดูอีก {n} รีวิว",
    dataUpdatedLabel: "อัปเดตข้อมูลล่าสุด {date}",
    therapistMentionsTitle: "ชื่อที่ถูกกล่าวถึงในรีวิว",
    therapistDisclaimer:
      "ชื่อเหล่านี้ดึงมาจากรีวิวสาธารณะโดยอัตโนมัติและยังไม่ได้ยืนยัน — กรุณาสอบถามร้านโดยตรงก่อนเข้ารับบริการ",
    noMentions: "ยังไม่มีการเอ่ยชื่อพนักงานคนใดในรีวิวที่เรารวบรวมได้",
    ratingLabel: "คะแนน",
    reviewCountLabel: "รีวิว",
    addressLabel: "ที่อยู่",
    viewOnMaps: "ดูใน Google Maps",
    callNow: "โทรเลย",
    visitWebsite: "เยี่ยมชมเว็บไซต์",
    namedInReviews: "ถูกเอ่ยชื่อในรีวิว {n} คน",
    mentionedCount: "ถูกพูดถึง {n} ครั้ง",
    anonymousReviewer: "ไม่ระบุชื่อ",
    serviceThemesTitle: "บริการที่ถูกพูดถึงในรีวิว",
    moodKeywordsTitle: "รีวิวบอกว่าร้านนี้เป็นยังไง",
    ratingBreakdownTitle: "สัดส่วนคะแนนรีวิว",
    priceRangeLabel: "ประมาณ ~{price}฿ ต่อครั้ง (จากรีวิว)",
    priceRangeLabelRange: "ประมาณ ~{min}–{max}฿ ต่อครั้ง (จากรีวิว)",
    summaryStatsClause: "ให้คะแนน {rating} จาก {reviewCount} รีวิว",
    summaryThemeClause: "รีวิวพูดถึง{theme}ที่นี่บ่อยที่สุด",
    summaryMoodClause: "ลูกค้าประจำบอกว่าร้านนี้{mood}",
    summaryDistrictClause: "ตั้งอยู่ใน{district}",
    similarPlacesTitle: "ร้านใกล้เคียงที่คล้ายกัน",
    viewDistrict: "ร้านอื่น ๆ ใน{district} →",
    prosTitle: "ทำไมรีวิวถึงชอบร้านนี้",
    addFavorite: "บันทึกรายการโปรด",
    removeFavorite: "ลบออกจากรายการโปรด",
    addToCompare: "เพิ่มเพื่อเปรียบเทียบ",
    removeFromCompare: "ลบออกจากการเปรียบเทียบ",
    compareLimitReached: "เปรียบเทียบได้สูงสุด {max} ร้านพร้อมกัน",
    faqTitle: "คำถามที่พบบ่อย",
    ratingFaqQuestion: "{name} มีคะแนนเท่าไหร่",
    ratingFaqAnswer: "{name} มีคะแนน {rating}★ จากรีวิว Google จำนวน {reviewCount} รีวิว",
    locationFaqQuestion: "{name} อยู่ที่ไหน",
    locationFaqAnswer: "{name} ตั้งอยู่ที่ {address}",
    priceFaqQuestion: "{name} ราคาเท่าไหร่",
    priceFaqAnswer: "จากรีวิวของลูกค้า ราคาที่ {name} อยู่ที่ประมาณ ~{price}฿ ต่อครั้ง",
  },
  search: {
    title: "ค้นหา",
    resultsForQuery: 'ผลการค้นหาสำหรับ "{query}"',
    resultCount: "พบ {n} ร้าน",
    noResults: 'ไม่พบร้านที่ตรงกับ "{query}"',
    noResultsHint: "ลองสะกดคำใหม่ หรือเลือกดูตามเมืองแทน",
    suggestedTitle: "กำลังได้รับความนิยม",
  },
  prices: {
    title: "คู่มือราคาร้านนวดและสปา",
    intro: "ราคากลางที่รวบรวมจากรีวิวจริง แยกตามบริการและเมือง — ไม่ใช่ราคาป้าย แต่เป็นราคาที่ลูกค้าบอกว่าจ่ายจริง",
    themeColumnLabel: "บริการ",
    priceColumnLabel: "ราคากลาง",
    sampleSizeLabel: "จากข้อมูล {n} ร้าน",
    noDataForCity: "ยังมีข้อมูลราคาไม่พอสำหรับ {city}",
    faqTitle: "คำถามที่พบบ่อยเรื่องราคา",
    faqQuestion: "{theme}ใน{city}ราคาเท่าไหร่โดยเฉลี่ย",
    faqAnswer: "จากรีวิวใน{city} {theme}มีราคาเฉลี่ยประมาณ ~{price}฿",
  },
  cities: {
    title: "เลือกเมือง",
    intro: "เลือกเมืองเพื่อดูรายชื่อร้านนวดและสปาที่รวบรวมจากรีวิว Google จริง",
  },
  city: {
    listTitle: "ร้านนวดและสปาใน {city}",
    placeCount: "ร้าน",
    intro: "รีวิว Google จริงจาก{city} ขุดหาบรรยากาศของแต่ละร้าน — เงียบสงบ คึกคัก นวดแรง คุ้มค่า — ไม่ใช่แค่ดูคะแนนดาว",
    showingTop: "แสดง {shown} อันดับแรก เรียงตามคะแนน",
    loadMore: "ดูร้านเพิ่มเติม",
    loadMoreLoading: "กำลังโหลด…",
    showMapLabel: "แสดงแผนที่",
    nearMeLabel: "ใกล้ฉัน",
    nearMeLoading: "กำลังหาตำแหน่ง…",
    nearMeDenied: "ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง — เปิดสิทธิ์ในเบราว์เซอร์เพื่อเรียงตามระยะทาง",
    nearMeUnavailable: "อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง",
    nearMeDistance: "ห่าง {km} กม.",
    faqTitle: "นวดและสปาใน{city} — คำถามที่พบบ่อย",
    faq: [
      {
        q: "เลือกร้านนวดใน{city}ยังไงดีที่สุด?",
        a: "อย่าดูแค่คะแนนดาว ให้ดูจำนวนรีวิวประกอบด้วย และดูว่ามีชื่อหมอนวดคนไหนถูกเอ่ยซ้ำในรีวิวไหม มักเป็นสัญญาณคุณภาพที่เสถียรกว่าหน้าร้าน",
      },
      {
        q: "ร้านที่แสดงเป็นร้านจริงทั้งหมดไหม?",
        a: "ใช่ — ทุกร้านที่แสดงมาจากข้อมูล Google Maps สาธารณะจริงใน{city}: ชื่อ ที่อยู่ คะแนน และรีวิว",
      },
      {
        q: "chillanel รับจองคิวไหม?",
        a: "ไม่รับ — chillanel เป็นคู่มืออิสระ ไม่ใช่แพลตฟอร์มจองคิว กดเข้าไปที่ลิงก์ Google Maps ของร้านเพื่อโทรหรือดูเส้นทางได้โดยตรง",
      },
    ],
    trendingTitle: "รีวิวใน{city}พูดถึงอะไรมากที่สุด",
    browseByAreaTitle: "เลือกดูตามโซน",
    moodSectionTitle: "ร้านแนว{mood}",
    viewAll: "ดูทั้งหมด",
    browseAllTitle: "ดูร้านทั้งหมด",
  },
  service: {
    listTitle: "{theme}ที่ดีที่สุดใน{city}",
    moodListTitle: "ร้านนวดที่{theme}ใน{city}",
    intro: "รีวิว Google จริงที่พูดถึง{theme}ใน{city} เรียงตามคะแนนและจำนวนรีวิว",
    backToCity: "← ร้านทั้งหมดใน{city}",
    faqTitle: "คำถามที่พบบ่อย",
    faqQuestion: "{theme}ที่ดีที่สุดใน{city}คือที่ไหน",
    moodFaqQuestion: "ร้านนวดที่{theme}ใน{city}มีที่ไหนบ้าง",
    faqAnswer: "จากรีวิว Google จริง มี {count} ร้านใน{city}ที่ถูกพูดถึงเรื่อง{theme}",
    faqAnswerRatingClause: "คะแนนเฉลี่ยของร้านเหล่านี้อยู่ที่ {rating}★",
    faqAnswerTopPick: "{name} เป็นร้านที่คะแนนสูงสุดในลิสต์นี้ ด้วยคะแนน {rating}★ จาก {reviewCount} รีวิว",
    topPickLabel: "ตัวเลือกอันดับ 1",
  },
  district: {
    listTitle: "นวดและสปาใน{district} {city}",
    intro: "รีวิว Google จริงจากร้านนวดและสปาใน{district} {city} เรียงตามคะแนนและจำนวนรีวิว",
    backToCity: "← ดูทุกโซนใน{city}",
    faqTitle: "คำถามที่พบบ่อย",
    faqQuestion: "นวดหรือสปาที่ดีที่สุดใน{district}คือที่ไหน",
    faqAnswer: "จากรีวิว Google จริง มี {count} ร้านใน{district}ที่แสดงอยู่ที่นี่",
    faqAnswerTopPick: "{name} เป็นร้านที่คะแนนสูงสุดในลิสต์นี้ ด้วยคะแนน {rating}★ จาก {reviewCount} รีวิว",
    topPickLabel: "ตัวเลือกอันดับ 1",
  },
  trustScore: {
    title: "คะแนนความน่าเชื่อถือ",
    excellent: "ยอดเยี่ยม",
    good: "ดี",
    fair: "พอใช้",
    limited: "ข้อมูลจำกัด",
    breakdownRating: "คะแนนรีวิว",
    breakdownVolume: "จำนวนรีวิว",
    breakdownDiversity: "ความหลากหลายของข้อมูล",
    explainer:
      "รวมคะแนนรีวิว จำนวนรีวิว และความหลากหลายของสิ่งที่รีวิวพูดถึงจริง ๆ ไว้ในตัวเลขเดียว 0-100 ให้ภาพที่ครบกว่าคะแนนดาวเพียงอย่างเดียว",
  },
  guide: {
    indexTitle: "คู่มือ",
    indexDescription:
      "คำตอบตรงๆ เรื่องสไตล์นวดไทย ราคา ทิป และวิธีสังเกตร้านที่น่าเชื่อถือ เขียนจากรีวิวจริง ไม่ใช่คำโฆษณา",
    relatedGuidesTitle: "คู่มือที่เกี่ยวข้อง",
    browseLinksTitle: "สำรวจเพิ่มเติม",
  },
  favorites: {
    title: "รายการโปรดของคุณ",
    intro: "บันทึกไว้บนอุปกรณ์นี้เท่านั้น ไม่มีการอัปโหลดข้อมูล ดังนั้นรายการโปรดจะไม่ตามไปที่เบราว์เซอร์อื่น",
    empty: "ยังไม่มีรายการโปรด กดรูปหัวใจที่ร้านไหนก็ได้เพื่อบันทึกไว้ที่นี่",
    browseCta: "ดูร้านทั้งหมด",
    suggestedTitle: "กำลังได้รับความนิยม",
    loadError: "โหลดรายการโปรดไม่สำเร็จ — ข้อมูลที่บันทึกไว้ยังปลอดภัย แค่เชื่อมต่อสะดุดชั่วคราว",
    retry: "ลองอีกครั้ง",
  },
  compare: {
    title: "เปรียบเทียบร้าน",
    intro: "เลือกได้สูงสุด 3 ร้านจากรายการใดก็ได้เพื่อเปรียบเทียบแบบเคียงข้างกัน",
    empty: "ยังไม่ได้เลือกร้าน กดปุ่ม + ที่ร้านไหนก็ได้เพื่อเพิ่มที่นี่",
    browseCta: "ดูร้านทั้งหมด",
    clearAll: "ล้างทั้งหมด",
    loadError: "โหลดการเปรียบเทียบไม่สำเร็จ — รายการที่เลือกไว้ยังปลอดภัย แค่เชื่อมต่อสะดุดชั่วคราว",
    retry: "ลองอีกครั้ง",
    themesLabel: "บริการเด่น",
    moodsLabel: "รีวิวบอกว่า",
    priceLabel: "ราคาโดยประมาณ",
    viewButton: "ดูรายละเอียด",
    suggestedTitle: "กำลังได้รับความนิยม",
  },
  share: {
    button: "แชร์",
    copied: "คัดลอกลิงก์แล้ว",
  },
  priceFilter: {
    label: "ราคา",
    all: "ทุกช่วงราคา",
    over: "{price}฿ ขึ้นไป",
    range: "{min}–{max}฿",
    under: "ต่ำกว่า {price}฿",
    noPriceData: "ไม่มีข้อมูลราคา",
  },
  about: {
    title: "เกี่ยวกับ chillanel",
    body:
      "chillanel คือคู่มืออิสระสำหรับร้านนวดและสปาในประเทศไทย เราไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ มุมมองของเรา: คะแนนดาวอย่างเดียวบอกไม่ได้ว่าร้านนั้นบรรยากาศเป็นยังไง เราจึงขุดรีวิวจริงหาคำที่ลูกค้าใช้บอกบรรยากาศ — เงียบสงบ คึกคัก นวดแรง คุ้มค่า — มาแสดงคู่กับคะแนน",
    trustScoreTitle: "คะแนนความน่าเชื่อถือคำนวณยังไง",
    trustScoreBody:
      "ทุกร้านจะได้คะแนนความน่าเชื่อถือ 0-100 ที่มาจาก 3 ส่วนที่เราตรวจสอบได้จริง ครึ่งหนึ่งมาจากคะแนนรีวิว Google โดยตรง (50 คะแนน) มากกว่าหนึ่งในสามมาจากจำนวนรีวิวที่รองรับคะแนนนั้น โดยคำนวณแบบ log scale เพื่อไม่ให้รีวิวไวรัลเพียงรีวิวเดียวทำให้ผลเพี้ยน (35 คะแนน) และที่เหลือมาจากจำนวนสิ่งที่แตกต่างกันที่รีวิวพูดถึงจริง ๆ เช่น สไตล์บริการ บรรยากาศ ความสะอาด สูงสุด 15 คะแนน ร้านที่รีวิวไม่ได้ลงรายละเอียดอะไรนอกจากให้ดาวจะได้คะแนนส่วนนี้น้อยกว่า ไม่ใช่การลงโทษ แค่สะท้อนตามจริงว่าเราตรวจสอบได้มากแค่ไหน",
  },
  privacy: {
    title: "นโยบายความเป็นส่วนตัว",
    updated: "อัปเดตล่าสุด: 20 สิงหาคม 2026",
    intro:
      "chillanel คือคู่มืออิสระสำหรับร้านนวดและสปาในประเทศไทย เผยแพร่ที่ chillanel.com หน้านี้อธิบายว่าข้อมูลของคุณถูกจัดการอย่างไรเมื่อคุณใช้งานเว็บไซต์ เนื้อหาสั้นเพราะเราทำอะไรกับข้อมูลของคุณน้อยมาก",
    sections: [
      {
        heading: "ไม่มีบัญชีผู้ใช้ ไม่มีฐานข้อมูลสมาชิก",
        body: "chillanel ไม่มีการสมัครสมาชิก ไม่มีการเข้าสู่ระบบ และไม่มีโปรไฟล์ผู้ใช้ คุณเปิดดูทุกหน้า ค้นหา และใช้ทุกฟีเจอร์ได้โดยไม่ต้องบอกว่าคุณเป็นใคร เราไม่ได้เก็บฐานข้อมูลผู้เข้าชมไว้เลย",
      },
      {
        heading: "สิ่งที่อยู่ในเบราว์เซอร์ของคุณเท่านั้น",
        body: "ร้านที่คุณบันทึกไว้ รายการเปรียบเทียบ และร้านที่ดูล่าสุด ถูกเก็บโดยเบราว์เซอร์ไว้ใน localStorage บนเครื่องของคุณเอง ภายใต้คีย์ที่ขึ้นต้นด้วย \"chillanel:\" ข้อมูลเหล่านี้ไม่เคยถูกส่งมาที่เราหรือที่ใดทั้งสิ้น — มันอยู่เฉพาะบนเครื่องที่คุณใช้ ถ้าคุณล้างข้อมูลเว็บไซต์ของ chillanel.com ในเบราว์เซอร์ ข้อมูลจะหายไปถาวร และเราไม่มีสำเนาไว้กู้คืนให้",
      },
      {
        heading: "ข้อมูลที่คุณส่งผ่านแบบฟอร์ม",
        body: "เว็บไซต์นี้มีแบบฟอร์มอยู่สองแบบ และเป็นช่องทางเดียวที่ข้อมูลจะมาถึงเรา แบบฟอร์มติดต่อลงโฆษณาจะถามชื่อของคุณ ช่องทางติดต่อที่คุณเลือกเอง และข้อความ ส่วนแบบฟอร์ม \"แจ้งข้อมูลผิดพลาด\" ในหน้าร้านจะส่งว่าคุณแจ้งร้านไหน ประเภทของปัญหา รายละเอียดที่คุณเขียน และช่องทางติดต่อซึ่งไม่บังคับ ทั้งสองแบบฟอร์มจะถูกส่งเป็นข้อความไปยังแชท Telegram ส่วนตัวของผู้ดูแลเว็บไซต์ผ่าน Telegram Bot API และไม่ได้ถูกบันทึกลงฐานข้อมูลใดของเว็บไซต์นี้ กรุณากรอกเฉพาะช่องทางติดต่อที่คุณสบายใจจะส่งให้เท่านั้น",
      },
      {
        heading: "หมายเลข IP",
        body: "เมื่อมีการส่งแบบฟอร์ม เซิร์ฟเวอร์จะอ่านหมายเลข IP ที่คำขอส่งมาเพียงชั่วครู่ เพื่อวัตถุประสงค์เดียวคือการจำกัดอัตราการส่ง ซึ่งบล็อกไม่ให้ส่งเกินห้าครั้งจากหมายเลขเดียวกันภายในสิบนาที เพื่อไม่ให้ใครถล่มแบบฟอร์มได้ ตัวนับนี้อยู่ในหน่วยความจำของโปรเซสเซิร์ฟเวอร์ที่กำลังทำงานอยู่ และหายไปเมื่อโปรเซสหยุดทำงาน ไม่ได้ถูกเขียนลงฐานข้อมูล ไม่ได้ถูกเขียนลงไฟล์ล็อก และไม่ได้ถูกใส่ไปในข้อความที่ส่งต่อไปยัง Telegram การเปิดดูเว็บไซต์เฉย ๆ ไม่ทำให้เกิดขั้นตอนนี้เลย",
      },
      {
        heading: "การวิเคราะห์การเข้าชม",
        body: "เราใช้ Vercel Web Analytics และ Vercel Speed Insights เพื่อดูว่าหน้าไหนถูกเปิดบ้างและโหลดเร็วแค่ไหน ทั้งสองตัวไม่ใช้คุกกี้และรายงานเป็นตัวเลขรวมเท่านั้น เช่น จำนวนการเข้าชม แหล่งที่มา และเวลาโหลด ไม่มีการวางคุกกี้ ไม่ตามคุณไปยังเว็บไซต์อื่น และไม่สร้างโปรไฟล์รายบุคคลของคุณ",
      },
      {
        heading: "คุกกี้",
        body: "chillanel ไม่ได้ตั้งคุกกี้ของตัวเองเลย ด้วยเหตุนี้จึงไม่มีแบนเนอร์ขอความยินยอมเรื่องคุกกี้",
      },
      {
        heading: "แผนที่",
        body: "แผนที่ร้านและแผนที่เมืองวาดด้วยไทล์แผนที่จาก OpenStreetMap เมื่อแผนที่โหลด เบราว์เซอร์ของคุณจะขอไทล์เหล่านั้นจากเซิร์ฟเวอร์ของ OpenStreetMap โดยตรง ซึ่งหมายความว่าหมายเลข IP ของคุณจะปรากฏต่อเขา เช่นเดียวกับเวลาที่คุณเข้าเว็บไซต์ใด ๆ คำขอนั้นอยู่ภายใต้นโยบายของ OpenStreetMap เอง และเราไม่ได้รับอะไรกลับมาจากมัน",
      },
      {
        heading: "การโฮสต์",
        body: "เว็บไซต์นี้โฮสต์อยู่บน Vercel เช่นเดียวกับผู้ให้บริการโฮสต์ทั่วไป คำขอที่ส่งหน้าเว็บเหล่านี้ถึงคุณจะผ่านโครงสร้างพื้นฐานของ Vercel",
      },
      {
        heading: "ข้อมูลร้านมาจากไหน",
        body: "ทุกร้านที่แสดงมาจากข้อมูล Google Maps สาธารณะจริง ทั้งชื่อ ที่อยู่ คะแนน และรีวิว ข้อความรีวิวและชื่อที่ผู้รีวิวตั้งแสดงเป็นสาธารณะไว้บน Google จะแสดงตามที่เผยแพร่ไว้ เราไม่ได้เขียน แก้ไข หรือสร้างขึ้นเอง ถ้าคุณเป็นผู้รีวิวหรือเป็นทางร้าน และต้องการให้แก้ไขหรือนำบางอย่างออกจากหน้านั้น กรุณาใช้แบบฟอร์ม \"แจ้งข้อมูลผิดพลาด\" ในหน้าของร้านนั้น แล้วบอกเราว่าเป็นรายการไหน",
      },
      {
        heading: "โฆษณา",
        body: "ขณะนี้ chillanel ไม่ได้แสดงโฆษณาจากบุคคลที่สาม และไม่ได้โหลดสคริปต์โฆษณาหรือเครือข่ายโฆษณาใด ๆ บนเว็บไซต์นี้ หากเรื่องนี้เปลี่ยนไป เราจะอัปเดตหน้านี้ก่อน เพื่อระบุว่าใช้ผู้ให้บริการรายใดและเก็บข้อมูลอะไรบ้าง",
      },
      {
        heading: "การเปลี่ยนแปลงนโยบาย",
        body: "ถ้าสิ่งที่เว็บไซต์ทำกับข้อมูลเปลี่ยนไป หน้านี้จะเปลี่ยนตาม และวันที่ด้านบนจะถูกอัปเดต",
      },
    ],
    contactHeading: "มีคำถาม",
    contactBody:
      "เว็บไซต์นี้ไม่มีที่อยู่ติดต่อแยกต่างหาก เรื่องที่เกี่ยวกับร้านใดร้านหนึ่งโดยเฉพาะ — รวมถึงการขอแก้ไขหรือขอให้นำข้อมูลออก — กรุณาใช้แบบฟอร์ม \"แจ้งข้อมูลผิดพลาด\" ที่ด้านล่างของหน้าร้านนั้น เรื่องอื่น ๆ รวมถึงคำถามเกี่ยวกับนโยบายนี้ กรุณาใช้แบบฟอร์มติดต่อลงโฆษณา ซึ่งไปถึงคนเดียวกัน",
    contactCta: "เปิดแบบฟอร์มติดต่อ",
  },
  terms: {
    title: "ข้อกำหนดการใช้งาน",
    updated: "อัปเดตล่าสุด: 20 สิงหาคม 2026",
    intro:
      "ข้อกำหนดเหล่านี้ใช้กับการใช้งาน chillanel.com การใช้งานเว็บไซต์ถือว่าคุณยอมรับข้อกำหนดนี้ ถ้าคุณไม่ยอมรับ กรุณาอย่าใช้งานเว็บไซต์",
    sections: [
      {
        heading: "chillanel คืออะไร",
        body: "chillanel คือคู่มืออิสระสำหรับร้านนวดและสปาในประเทศไทย เราไม่มีส่วนเกี่ยวข้อง ไม่ได้ถูกถือครอง และไม่ได้รับเงินจากร้านใดที่แสดงอยู่ที่นี่ ไม่มีการจ่ายเงินเพื่อขึ้นอันดับและไม่มีอันดับสปอนเซอร์ — ร้านไม่สามารถซื้อตำแหน่งที่สูงขึ้นในรายการได้",
      },
      {
        heading: "chillanel ไม่ใช่อะไร",
        body: "ที่นี่ไม่ใช่แพลตฟอร์มจองคิวและไม่ใช่ตัวแทน เราไม่รับจอง ไม่รับชำระเงิน และไม่ได้เป็นคู่สัญญาในสิ่งที่คุณตกลงกับทางร้าน ข้อมูลติดต่อและลิงก์แผนที่มีไว้ให้คุณติดต่อร้านโดยตรง เรื่องที่เกิดขึ้นระหว่างคุณกับร้านเป็นเรื่องระหว่างคุณกับร้าน",
      },
      {
        heading: "ความถูกต้องของข้อมูล",
        body: "รายชื่อร้านสร้างจากข้อมูล Google Maps สาธารณะที่เก็บรวบรวมไว้ก่อนเผยแพร่เว็บไซต์ สิ่งที่คุณเห็นจึงเป็นภาพนิ่ง ณ ช่วงเวลาหนึ่ง ไม่ใช่ข้อมูลสด ร้านปิดตัว ย้ายที่ เปลี่ยนเวลาทำการ และเปลี่ยนราคาได้ หน้าเว็บที่นี่จึงอาจล้าสมัยโดยที่เราไม่รู้ กรุณาถือทุกอย่างที่อ่านที่นี่เป็นจุดตั้งต้น และยืนยันรายละเอียดกับทางร้านก่อนเดินทางหรือจอง เว็บไซต์นี้ให้บริการตามสภาพที่เป็นอยู่ โดยไม่รับประกันว่าข้อมูลของร้านใดเป็นปัจจุบัน ครบถ้วน หรือถูกต้อง",
      },
      {
        heading: "รีวิวและแท็กบรรยากาศ",
        body: "ข้อความรีวิวยกมาจากรีวิว Google สาธารณะและเป็นของผู้ที่เขียนไว้ — เป็นความเห็นของเขา ไม่ใช่ของเรา และเราไม่ได้แก้ไข แท็กบรรยากาศและบริการในแต่ละหน้าถูกดึงออกมาจากข้อความรีวิวโดยอัตโนมัติด้วยซอฟต์แวร์ การดึงอัตโนมัติอาจตีความรีวิวผิดได้ จึงควรอ่านแท็กเหล่านี้เป็นบทสรุปว่ารีวิวมักพูดถึงอะไร ไม่ใช่ข้อเท็จจริงที่ผ่านการตรวจสอบเกี่ยวกับร้าน",
      },
      {
        heading: "เกี่ยวกับคะแนนความน่าเชื่อถือ",
        body: "คะแนนความน่าเชื่อถือเป็นการคำนวณของเราเองจากคะแนน Google จำนวนรีวิวที่รองรับคะแนนนั้น และปริมาณรายละเอียดที่ผู้รีวิวให้ไว้ มันคือการอ่านหลักฐานสาธารณะที่มีอยู่ของร้านหนึ่ง ไม่ใช่การตรวจสอบหน้างาน ไม่ใช่การรับรอง และไม่ใช่การแนะนำ คะแนนสูงไม่ได้แปลว่าเราไปเยี่ยมหรือตรวจสอบร้านนั้นมาแล้ว และคะแนนต่ำก็ไม่ใช่การกล่าวหา",
      },
      {
        heading: "ข้อมูลราคา",
        body: "ตัวเลขราคาที่แสดงคือจำนวนเงินที่ถูกพูดถึงในข้อความรีวิว ไม่ใช่ราคาที่ทางร้านเสนอ อาจเป็นราคาเก่า อาจเป็นคนละบริการกับที่คุณต้องการ และไม่มีผลผูกพันกับใครทั้งสิ้น กรุณาสอบถามราคาปัจจุบันกับทางร้านโดยตรง",
      },
      {
        heading: "การใช้งานอย่างเหมาะสม",
        body: "กรุณาใช้ chillanel อย่างผู้เข้าชมทั่วไป อย่าคัดลอกหรือดึงข้อมูลรายชื่อร้านจำนวนมากจากเว็บไซต์ อย่าใช้แบบฟอร์มส่งสแปมหรือข้อความที่ไม่เหมาะสม และอย่าพยายามรบกวนการทำงานของเว็บไซต์หรือหลบเลี่ยงการจำกัดจำนวนการส่งแบบฟอร์ม",
      },
      {
        heading: "เนื้อหาและสิทธิ์",
        body: "การออกแบบเว็บไซต์ ข้อความที่เราเขียนเอง การจัดกลุ่มหมวดหมู่และบรรยากาศ รวมถึงวิธีคำนวณคะแนนความน่าเชื่อถือ เป็นของ chillanel ชื่อร้าน ที่อยู่ คะแนน และข้อความรีวิว เป็นของเจ้าของสิทธิ์แต่ละราย และแสดงที่นี่ในฐานะข้อมูลสาธารณะเกี่ยวกับธุรกิจเหล่านั้น Google และ Google Maps เป็นเครื่องหมายการค้าของ Google LLC ส่วนข้อมูลแผนที่เป็นลิขสิทธิ์ของผู้ร่วมสร้าง OpenStreetMap",
      },
      {
        heading: "การขอแก้ไขและนำข้อมูลออก",
        body: "ทุกหน้าร้านมีแบบฟอร์ม \"แจ้งข้อมูลผิดพลาด\" ใช้แจ้งเราได้เลยว่าร้านปิดแล้ว ข้อมูลผิด เป็นรายการซ้ำ หรือมีบางอย่างที่ควรถูกนำออก แบบฟอร์มนี้ส่งถึงเราโดยตรงและเป็นวิธีที่เร็วที่สุดในการแก้หน้านั้น",
      },
      {
        heading: "การติดต่อลงโฆษณา",
        body: "เจ้าของร้านที่อยากให้คนเห็นมากขึ้นสามารถใช้แบบฟอร์มติดต่อลงโฆษณาได้ แต่ขอให้ชัดเจนว่า การติดต่อเข้ามาไม่ได้ทำให้อันดับของร้านหรือคะแนนความน่าเชื่อถือเปลี่ยนไป สองอย่างนี้ไม่ได้มีไว้ขาย",
      },
      {
        heading: "การเปลี่ยนแปลงข้อกำหนด",
        body: "ข้อกำหนดอาจเปลี่ยนไปตามการเปลี่ยนแปลงของเว็บไซต์ ฉบับปัจจุบันคือฉบับที่อยู่ในหน้านี้เสมอ พร้อมวันที่กำกับไว้ด้านบน",
      },
    ],
    contactHeading: "มีคำถาม",
    contactBody:
      "เรื่องที่เกี่ยวกับร้านใดร้านหนึ่งโดยเฉพาะ กรุณาใช้แบบฟอร์ม \"แจ้งข้อมูลผิดพลาด\" ในหน้าของร้านนั้น เรื่องอื่น ๆ รวมถึงคำถามเกี่ยวกับข้อกำหนดนี้ กรุณาใช้แบบฟอร์มติดต่อลงโฆษณา ทั้งสองแบบฟอร์มไปถึงคนเดียวกัน",
    contactCta: "เปิดแบบฟอร์มติดต่อ",
  },
  footer: {
    rights: "คู่มืออิสระ ไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ",
    tagline: "ทุกร้านมีบรรยากาศของตัวเอง เราช่วยให้คุณเจอร้านที่ใช่",
    exploreTitle: "สำรวจ",
    languageTitle: "ภาษา",
  },
  notFound: {
    title: "ไม่พบหน้านี้",
    body: "หน้านี้ไม่มีอยู่ หรือร้านอาจปิดตัวหรือถูกลบไปแล้ว",
    cta: "กลับหน้าแรก",
  },
  errorPage: {
    title: "เกิดข้อผิดพลาด",
    body: "มีบางอย่างผิดพลาดขณะโหลดหน้านี้",
    retry: "ลองอีกครั้ง",
    cta: "กลับหน้าแรก",
  },
  advertise: {
    title: "โฆษณากับ chillanel",
    intro: "เป็นเจ้าของสปาหรือร้านนวดและอยากให้คนเห็นมากขึ้นไหม? เล่าเกี่ยวกับธุรกิจของคุณให้เราฟัง แล้วเราจะติดต่อกลับ",
    nameLabel: "ชื่อของคุณ",
    contactLabel: "ช่องทางติดต่อ (อีเมล เบอร์โทร หรือไลน์ไอดี)",
    contactPlaceholder: "you@example.com",
    messageLabel: "ข้อความ",
    messagePlaceholder: "เล่าเกี่ยวกับธุรกิจของคุณและสิ่งที่คุณต้องการ",
    submit: "ส่งคำขอ",
    sending: "กำลังส่ง…",
    success: "ขอบคุณ เราได้รับคำขอของคุณแล้วและจะติดต่อกลับ",
    error: "เกิดข้อผิดพลาดในการส่งคำขอ กรุณาลองอีกครั้ง",
  },
  correction: {
    linkLabel: "แจ้งข้อมูลผิดพลาด",
    title: "แจ้งปัญหาเกี่ยวกับร้านนี้",
    issueTypeLabel: "ปัญหาคืออะไร?",
    issueTypes: {
      closed: "ร้านนี้ปิดแล้ว",
      wrongInfo: "ที่อยู่ เบอร์โทร หรือข้อมูลอื่นผิด",
      duplicate: "รายการนี้ซ้ำกัน",
      other: "อื่นๆ",
    },
    detailsLabel: "รายละเอียด",
    detailsPlaceholder: "เราควรแก้ไขอะไร?",
    contactLabel: "ช่องทางติดต่อของคุณ (ไม่บังคับ เผื่อเรามีคำถาม)",
    contactPlaceholder: "you@example.com",
    submit: "ส่งรายงาน",
    sending: "กำลังส่ง…",
    success: "ขอบคุณ เราได้รับรายงานของคุณแล้ว",
    error: "เกิดข้อผิดพลาดในการส่งรายงาน กรุณาลองอีกครั้ง",
    cancel: "ยกเลิก",
  },
};

const ko: Dict = {
  nav: {
    home: "홈",
    guides: "가이드",
    about: "소개",
    menuOpen: "메뉴 열기",
    menuClose: "메뉴 닫기",
    favorites: "찜한 곳",
    compare: "비교하기",
    browse: "둘러보기",
    searchPlaceholder: "업체 검색…",
    searchNoResults: "검색 결과가 없어요.",
    searchLoading: "불러오는 중…",
    searchError: "검색을 불러오지 못했어요. 눌러서 다시 시도하세요.",
    searchSeeAllResults: '"{query}" 검색 결과 모두 보기',
    searchOpen: "검색",
    searchClose: "검색 닫기",
  },
  home: {
    heroTitle: "별점이 아니라, 분위기로 찾으세요.",
    heroSub:
      "chillanel은 실제 구글 리뷰를 분석해 마사지·스파 업체마다의 분위기를 보여줘요 — 조용하고 차분한 곳인지, 활기차고 편안한 곳인지 — 예약하기 전에 미리 알 수 있게요.",
    philosophyTitle: "우리가 다른 이유",
    philosophyBody:
      "평점 4.8이어도 왠지 서두르는 느낌일 수 있고, 평범한 샵이 오히려 내 집처럼 편안할 수도 있어요. 저희는 실제 리뷰에서 손님들이 쓴 분위기 표현 — 조용함, 강한 압력, 가성비 — 을 모아서, 별점이 아니라 분위기로 맞는 곳을 찾도록 도와드려요.",
    featuredTitle: "추천 업체",
    trustBadge: "실제 구글 리뷰 기반, {count}+개 업체 수록",
    ctaBrowse: "전체 둘러보기",
    manifesto: "돈 받고 순위 매기지 않아요. 스폰서도 없어요. 모든 목록은 공개된 구글 리뷰에서 그대로 가져옵니다.",
    stats: { places: "등록된 업체", reviews: "분석한 리뷰", therapists: "리뷰에서 이름이 언급된 테라피스트" },
    quotesTitle: "실제 리뷰어의 말",
    editorsPick: "최고 평점",
    faqTitle: "자주 묻는 질문",
    faq: [
      {
        q: "chillanel은 다른 마사지·스파 순위 사이트랑 뭐가 달라요?",
        a: "대부분의 사이트는 로비, 인테리어, 가격 같은 시설 기준으로 순위를 매겨요. 저희는 실제 구글 리뷰에서 손님들이 쓴 분위기 표현 — 조용함, 활기참, 강한 압력, 가성비 — 을 모아서, 별점만으론 알 수 없는 그 업체의 실제 느낌을 미리 알려드려요.",
      },
      {
        q: "분위기 태그는 어디서 나온 건가요?",
        a: "분위기 태그(조용하고 편안함, 강한 압력, 가성비 좋음 등)는 모두 해당 업체의 실제 구글 리뷰에서 그대로 추출한 거예요. 저희가 임의로 쓰거나 편집하지 않아요. 특정 분위기를 언급하는 리뷰가 많을수록 태그가 더 두드러지게 표시됩니다.",
      },
      {
        q: "좋은 마사지샵은 어떻게 고르나요?",
        a: "평점과 리뷰 수를 먼저 확인하고, 분위기 태그를 보면서 단골들이 이곳을 실제로 어떻게 느끼는지 살펴보세요. 리뷰에 특정 테라피스트 이름이 반복해서 언급된다면, 그것도 눈여겨볼 만한 신호예요.",
      },
    ],
    trendingTitle: "리뷰에서 가장 많이 언급된 것",
    recommendedTitle: "당신을 위한 추천",
    discoverTitle: "새로운 곳 발견하기",
    recentlyViewedTitle: "최근 본 곳",
    surpriseMe: "🎲 아무거나 추천해줘",
    surpriseLoading: "고르는 중…",
    surpriseError: "장소를 고르지 못했어요 — 연결 상태를 확인하고 다시 시도해주세요.",
  },
  place: {
    reviewsTitle: "리뷰어들의 후기",
    readMore: "더보기",
    wlTitle: "Chillanel Watchlist",
    wlMetaDesc: "바가지·팁 강요·강매·위생·불친절 — 여러 리뷰가 반복 경고하는 마사지·스파 업소를 증거 인용과 함께 공개. 모든 검사를 통과한 클린 리스트도.",
    wlHeroSubtitle: "데이터베이스의 모든 리뷰를 경고 신호(바가지·팁 강요·강매·위생·불친절)로 분석했습니다. 아래는 경보가 두 번 이상 울린 곳들 — 그리고 한 번도 안 울린 곳들입니다.",
    wlRedTitle: "리뷰어들이 경고하는 곳",
    wlMethodNote: "깃발 하나 = ★4 이하 리뷰 2건 이상이 같은 문제를 언급. 패턴이지 판결이 아닙니다 — 전체 리포트를 읽고 판단하세요.",
    wlCleanTitle: "클린 스윗",
    wlCleanSubtitle: "분석한 모든 리뷰에서 경고 신호 0건, ★4.7+, 리뷰 100+. 같은 검사, 정반대 결과.",
    checkTitle: "Chillanel Check",
    checkSubtitle: "별점이 말해주지 않는 것 — 실제 리뷰 {n}건 분석",
    checkAllClear: "리뷰 {n}건에서 바가지·팁 강요·강매·위생·불친절 불만 신호 없음",
    flagOvercharge: "바가지 신호",
    flagTipPressure: "팁 강요",
    flagUpsell: "강매/업셀",
    flagHygiene: "위생 불만",
    flagRude: "불친절 불만",
    flagMentions: "리뷰 {n}건에서 감지",
    trendUp: "최근 12개월 리뷰: ★{recent} ({n}건) — 전체 평균 ★{overall}보다 상승세",
    trendDown: "최근 12개월 리뷰: ★{recent} ({n}건) — 전체 평균 ★{overall}보다 하락세",
    trendSteady: "최근 12개월 리뷰: ★{recent} ({n}건) — 전체 평균 ★{overall}과 일치",
    standingLine: "{district} 검증된 {total}곳 중 {pct}%보다 평점 우위",
    priceBelow: "회당 ~฿{price} — {district} 시세(฿{median})보다 저렴",
    priceTypical: "회당 ~฿{price} — {district} 시세(฿{median}) 수준",
    priceAbove: "회당 ~฿{price} — {district} 시세(฿{median})보다 비쌀",
    mostCriticalTitle: "가장 비판적인 리뷰",
    noCriticalReviews: "분석한 {n}건 중 3★ 이하 리뷰 없음 — 숨긴 게 아니라 없는 겁니다.",
    stickyReviewsCta: "실제 리뷰 {n}건 읽기",
    ownerCtaTitle: "이 가게 사장님이신가요?",
    ownerCtaLink: "chillanel에 소개하기",
    showMoreReviews: "리뷰 {n}개 더 보기",
    dataUpdatedLabel: "{date} 기준 데이터 업데이트",
    therapistMentionsTitle: "리뷰에서 언급된 이름",
    therapistDisclaimer:
      "이 이름들은 공개 리뷰에서 자동으로 추출된 것으로 검증되지 않았습니다 — 방문 전 업체에 직접 확인하세요.",
    noMentions: "아직 수집된 리뷰 중 직원 이름이 언급된 사례가 없습니다.",
    ratingLabel: "평점",
    reviewCountLabel: "리뷰",
    addressLabel: "주소",
    viewOnMaps: "구글맵에서 보기",
    callNow: "전화하기",
    visitWebsite: "웹사이트 방문",
    namedInReviews: "리뷰에 이름 언급 {n}명",
    mentionedCount: "{n}회 언급",
    anonymousReviewer: "익명",
    serviceThemesTitle: "리뷰에서 언급된 서비스",
    moodKeywordsTitle: "리뷰어들이 말하는 이곳의 분위기",
    ratingBreakdownTitle: "평점 분포",
    priceRangeLabel: "리뷰 기준 회당 약 ~{price}฿",
    priceRangeLabelRange: "리뷰 기준 회당 약 ~{min}–{max}฿",
    // {theme} carries its own subject particle (이/가) appended by the
    // caller via lib/korean-particles.ts -- see lib/summary.ts.
    summaryStatsClause: "리뷰 {reviewCount}개, 평점 {rating}.",
    summaryThemeClause: "리뷰에서 이곳의 {theme} 가장 많이 언급됩니다.",
    summaryMoodClause: "단골들은 이곳을 {mood} 분위기라고 말합니다.",
    summaryDistrictClause: "{district}에 위치해 있습니다.",
    similarPlacesTitle: "비슷한 인근 업체",
    viewDistrict: "{district}의 다른 업체 보기 →",
    prosTitle: "리뷰어들이 좋아하는 이유",
    addFavorite: "찜하기",
    removeFavorite: "찜 해제",
    addToCompare: "비교에 추가",
    removeFromCompare: "비교에서 제거",
    compareLimitReached: "최대 {max}곳까지 비교할 수 있어요",
    faqTitle: "자주 묻는 질문",
    ratingFaqQuestion: "{name}의 평점은 어떻게 되나요?",
    ratingFaqAnswer: "{name}은(는) 구글 리뷰 {reviewCount}개 기준 {rating}★의 평점을 가지고 있습니다.",
    locationFaqQuestion: "{name}은(는) 어디에 있나요?",
    locationFaqAnswer: "{name}은(는) {address}에 위치해 있습니다.",
    priceFaqQuestion: "{name}의 가격은 얼마인가요?",
    priceFaqAnswer: "리뷰 기준으로 {name}의 1회 이용 가격은 약 ~{price}฿입니다.",
  },
  search: {
    title: "검색",
    resultsForQuery: '"{query}" 검색 결과',
    resultCount: "{n}곳 찾음",
    noResults: '"{query}"와(과) 일치하는 곳이 없어요.',
    noResultsHint: "다른 철자로 검색하거나 도시별로 둘러보세요.",
    suggestedTitle: "지금 인기 있는 곳",
  },
  prices: {
    title: "마사지·스파 가격 가이드",
    intro: "실제 리뷰에서 뽑아낸 서비스별·도시별 평균 가격이에요 — 정가표가 아니라 이용객들이 실제로 냈다고 말한 가격이에요.",
    themeColumnLabel: "서비스",
    priceColumnLabel: "평균 가격",
    sampleSizeLabel: "{n}곳 데이터 기준",
    noDataForCity: "{city}은(는) 아직 가격 데이터가 충분하지 않아요.",
    faqTitle: "가격 관련 자주 묻는 질문",
    faqQuestion: "{city}에서 {theme} 평균 가격은 얼마인가요?",
    faqAnswer: "{city} 리뷰 기준으로 {theme} 가격은 약 ~{price}฿ 수준이에요.",
  },
  cities: {
    title: "도시 선택",
    intro: "실제 구글 리뷰 기반 마사지·스파 업체를 도시별로 둘러보세요.",
  },
  city: {
    listTitle: "{city}의 마사지 & 스파",
    placeCount: "곳",
    intro: "{city}의 실제 구글 리뷰에서 각 업체의 분위기를 뽑아냈어요 — 조용함, 활기참, 강한 압력, 가성비 — 별점만으론 알 수 없는 부분까지.",
    showingTop: "평점순으로 상위 {shown}곳을 보여드려요.",
    loadMore: "더 보기",
    loadMoreLoading: "불러오는 중…",
    showMapLabel: "지도 보기",
    nearMeLabel: "내 근처",
    nearMeLoading: "위치 확인 중…",
    nearMeDenied: "위치 접근이 거부됐어요 — 브라우저 설정에서 권한을 켜면 거리순으로 볼 수 있어요.",
    nearMeUnavailable: "이 기기에서는 위치 확인을 할 수 없어요.",
    nearMeDistance: "{km}km 거리",
    faqTitle: "{city} 마사지·스파 — 자주 묻는 질문",
    faq: [
      {
        q: "{city}에서 마사지샵을 고르는 가장 좋은 방법은?",
        a: "별점만 보지 말고 리뷰 수도 함께 확인하세요. 그리고 리뷰에 특정 테라피스트 이름이 반복해서 언급되는지 보세요 — 매장 외관보다 훨씬 신뢰할 수 있는 품질 신호입니다.",
      },
      {
        q: "여기 나온 업체들은 다 실제 업체인가요?",
        a: "네 — 여기 수록된 모든 업체는 {city}의 실제 공개 구글맵 데이터를 기반으로 합니다: 이름, 주소, 평점, 리뷰 모두 실제 데이터예요.",
      },
      {
        q: "chillanel에서 예약도 할 수 있나요?",
        a: "아니요 — chillanel은 독립 가이드이며 예약 플랫폼이 아닙니다. 업체의 구글맵 링크로 이동해서 직접 전화하거나 길찾기를 이용해 주세요.",
      },
    ],
    trendingTitle: "{city} 리뷰에서 가장 많이 언급된 것",
    browseByAreaTitle: "지역별로 보기",
    moodSectionTitle: "{mood} 분위기 업체",
    viewAll: "전체 보기",
    browseAllTitle: "전체 업체 보기",
  },
  service: {
    listTitle: "{city} 베스트 {theme}",
    moodListTitle: "{city} {theme} 마사지",
    // {theme} in intro/faqQuestion/faqAnswer carries its own particle
    // (을/를, 은/는, 으로/로) appended by the caller via lib/korean-particles.ts
    // -- see app/[lang]/service/[theme]/page.tsx.
    intro: "{city}에서 {theme} 언급한 실제 구글 리뷰입니다 — 평점과 리뷰 수 순으로 정렬했습니다.",
    backToCity: "← {city} 전체 업체 보기",
    faqTitle: "자주 묻는 질문",
    faqQuestion: "{city}에서 가장 좋은 {theme} 어디인가요?",
    moodFaqQuestion: "{city}에서 {theme} 마사지샵은 어디인가요?",
    faqAnswer: "실제 구글 리뷰를 기준으로 {city}에서 {theme} 언급된 곳은 {count}곳입니다.",
    faqAnswerRatingClause: "이들의 평균 평점은 {rating}★입니다.",
    faqAnswerTopPick: "{name}이(가) 이 목록에서 평점이 가장 높습니다 — {rating}★, 리뷰 {reviewCount}개.",
    topPickLabel: "베스트 픽",
  },
  district: {
    listTitle: "{city} {district} 마사지 & 스파",
    intro: "{city} {district}에 있는 마사지 & 스파의 실제 구글 리뷰입니다 — 평점과 리뷰 수 순으로 정렬했습니다.",
    backToCity: "← {city} 전체 지역 보기",
    faqTitle: "자주 묻는 질문",
    faqQuestion: "{district}에서 가장 좋은 마사지·스파는 어디인가요?",
    faqAnswer: "실제 구글 리뷰를 기준으로 {district}에는 {count}곳이 등록되어 있습니다.",
    faqAnswerTopPick: "{name}이(가) 이 목록에서 평점이 가장 높습니다 — {rating}★, 리뷰 {reviewCount}개.",
    topPickLabel: "베스트 픽",
  },
  trustScore: {
    title: "신뢰 점수",
    excellent: "매우 좋음",
    good: "좋음",
    fair: "보통",
    limited: "데이터 부족",
    breakdownRating: "평점",
    breakdownVolume: "리뷰 수",
    breakdownDiversity: "리뷰 신호 다양성",
    explainer:
      "평점, 리뷰 수, 리뷰에서 실제로 언급된 내용의 다양성을 하나의 0-100 점수로 합친 지표예요 — 별점만 볼 때보다 더 폭넓은 그림을 보여줘요.",
  },
  guide: {
    indexTitle: "가이드",
    indexDescription: "태국 마사지 스타일·가격·팁 문화, 믿을 만한 곳을 알아보는 법까지. 광고 문구가 아니라 실제 리뷰를 근거로 씁니다.",
    relatedGuidesTitle: "관련 가이드",
    browseLinksTitle: "더 둘러보기",
  },
  favorites: {
    title: "찜한 곳",
    intro: "이 기기에만 저장돼요 — 서버에 올라가지 않아서 다른 브라우저에서는 보이지 않아요.",
    empty: "아직 찜한 곳이 없어요. 원하는 곳의 하트를 눌러 저장해보세요.",
    browseCta: "업체 둘러보기",
    suggestedTitle: "지금 인기 있는 곳",
    loadError: "찜한 곳을 불러오지 못했어요 — 저장된 데이터는 안전해요, 잠깐 연결이 끊겼을 뿐이에요.",
    retry: "다시 시도",
  },
  compare: {
    title: "업체 비교하기",
    intro: "어디서든 최대 3곳을 선택해서 나란히 비교해볼 수 있어요.",
    empty: "아직 선택된 곳이 없어요. 원하는 곳의 + 버튼을 눌러 추가해보세요.",
    browseCta: "업체 둘러보기",
    clearAll: "전체 지우기",
    themesLabel: "주요 서비스",
    suggestedTitle: "지금 인기 있는 곳",
    moodsLabel: "리뷰 키워드",
    priceLabel: "대략적인 가격",
    viewButton: "자세히 보기",
    loadError: "비교 목록을 불러오지 못했어요 — 선택한 항목은 안전해요, 잠깐 연결이 끊겼을 뿐이에요.",
    retry: "다시 시도",
  },
  share: {
    button: "공유",
    copied: "링크가 복사됐어요",
  },
  priceFilter: {
    label: "가격",
    all: "전체 가격대",
    over: "{price}฿ 이상",
    range: "{min}–{max}฿",
    under: "{price}฿ 미만",
    noPriceData: "가격 정보 없음",
  },
  about: {
    title: "chillanel 소개",
    body:
      "chillanel은 태국 마사지·스파 업체에 대한 독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다. 저희 관점: 별점만으로는 그 업체의 실제 분위기를 알 수 없어요. 그래서 실제 리뷰에서 손님들이 쓴 분위기 표현 — 조용함, 활기참, 강한 압력, 가성비 — 을 찾아내 별점과 함께 보여드립니다.",
    trustScoreTitle: "신뢰 점수는 어떻게 계산되나요",
    trustScoreBody:
      "모든 업체는 검증 가능한 3가지 요소로 만든 0-100 신뢰 점수를 받아요. 절반은 구글 평점 자체에서 나오고(50점), 3분의 1 조금 넘게는 그 평점을 뒷받침하는 리뷰 수에서 나오는데 로그 스케일로 계산해서 리뷰 하나가 급증한다고 결과가 왜곡되지 않게 했어요(35점). 나머지는 리뷰에서 실제로 언급된 서로 다른 요소들 — 서비스 스타일, 분위기, 청결도 등 — 의 개수에서 나와요, 최대 15점이에요. 리뷰에 별점 말고 다른 디테일이 없는 곳은 이 마지막 부분에서 낮은 점수를 받는데, 이건 페널티가 아니라 저희가 검증할 수 있었던 만큼만 정직하게 반영한 거예요.",
  },
  privacy: {
    title: "개인정보 처리방침",
    updated: "최종 수정일: 2026년 8월 20일",
    intro:
      "chillanel은 태국 마사지·스파 업체를 소개하는 독립 가이드로, chillanel.com에서 운영됩니다. 이 페이지는 사이트를 이용하실 때 정보가 어떻게 다뤄지는지 설명해요. 저희가 데이터로 하는 일이 거의 없어서 내용도 짧습니다.",
    sections: [
      {
        heading: "계정도, 회원 데이터베이스도 없어요",
        body: "chillanel에는 회원가입도 로그인도 없고, 이용자 프로필도 없습니다. 누구인지 밝히지 않고도 모든 페이지를 보고, 검색하고, 모든 기능을 쓸 수 있어요. 방문자 정보를 담은 데이터베이스 자체를 운영하지 않습니다.",
      },
      {
        heading: "브라우저 안에만 남는 것",
        body: "저장한 즐겨찾기, 비교 목록, 최근 본 업체는 여러분 기기의 브라우저 localStorage에 \"chillanel:\"로 시작하는 키로 저장됩니다. 저희에게도, 다른 어디에도 전송되지 않아요 — 사용하신 그 기기에만 존재합니다. 브라우저에서 chillanel.com의 사이트 데이터를 지우면 완전히 사라지고, 저희에게는 복구해 드릴 사본이 없습니다.",
      },
      {
        heading: "양식으로 보내주시는 정보",
        body: "이 사이트에는 양식이 두 개뿐이고, 정보가 저희에게 닿는 경로도 그 둘뿐이에요. 광고 문의 양식은 이름, 원하시는 연락처, 문의 내용을 받습니다. 업체 페이지의 \"정보 오류 제보\" 양식은 어느 업체에 대한 제보인지, 문제 유형, 적어주신 상세 내용, 그리고 선택 사항으로 연락처를 보냅니다. 두 양식 모두 텔레그램 봇 API를 통해 운영자의 비공개 텔레그램 대화방으로 메시지가 전달되며, 이 사이트의 데이터베이스에는 저장되지 않아요. 연락처는 보내도 괜찮다고 생각하시는 것만 적어 주세요.",
      },
      {
        heading: "IP 주소",
        body: "양식을 제출하면 서버가 요청이 들어온 IP 주소를 잠깐 읽는데, 용도는 단 하나 — 같은 주소에서 10분 안에 5건을 넘겨 제출하지 못하게 막는 요청 제한입니다. 누군가 양식을 무차별로 보내는 것을 막기 위한 것이에요. 이 횟수는 실행 중인 서버 프로세스의 메모리에만 있고 프로세스가 멈추면 사라집니다. 데이터베이스에 기록하지 않고, 로그 파일에도 남기지 않으며, 텔레그램으로 전달되는 메시지에도 포함하지 않아요. 사이트를 그냥 둘러보는 것만으로는 이 과정이 전혀 일어나지 않습니다.",
      },
      {
        heading: "분석 도구",
        body: "어떤 페이지가 많이 열리고 얼마나 빨리 로드되는지 보기 위해 Vercel Web Analytics와 Vercel Speed Insights를 사용합니다. 둘 다 쿠키를 쓰지 않고 집계된 수치만 보고해요 — 페이지 조회 수, 유입 경로, 로딩 시간 정도입니다. 쿠키를 심지 않고, 다른 사이트까지 따라다니지 않으며, 개인별 프로필을 만들지 않습니다.",
      },
      {
        heading: "쿠키",
        body: "chillanel은 자체 쿠키를 전혀 설정하지 않습니다. 쿠키 동의 배너가 없는 것도 그 때문이에요.",
      },
      {
        heading: "지도",
        body: "업체와 도시 지도는 OpenStreetMap의 지도 타일로 그립니다. 지도가 로드될 때 브라우저가 OpenStreetMap 서버에 타일을 직접 요청하기 때문에, 다른 웹사이트를 방문할 때와 마찬가지로 IP 주소가 그쪽에 보이게 돼요. 그 요청에는 OpenStreetMap의 자체 정책이 적용되며, 저희는 그로부터 아무것도 돌려받지 않습니다.",
      },
      {
        heading: "호스팅",
        body: "이 사이트는 Vercel에 호스팅되어 있습니다. 다른 웹 호스트와 마찬가지로, 이 페이지들을 전달하는 요청은 Vercel의 인프라를 거칩니다.",
      },
      {
        heading: "업체 정보의 출처",
        body: "여기 수록된 모든 업체는 실제 공개 구글맵 데이터에서 옵니다: 이름, 주소, 평점, 리뷰. 리뷰 본문과 작성자가 구글에서 공개로 쓰던 표시 이름은 게시된 그대로 보여드리며, 저희가 쓰거나 편집하거나 지어내지 않아요. 리뷰 작성자나 업체 관계자로서 페이지의 내용을 수정하거나 내리고 싶으시면, 해당 업체 페이지의 \"정보 오류 제보\" 양식으로 어느 항목인지 알려주세요.",
      },
      {
        heading: "광고",
        body: "chillanel은 현재 제3자 광고를 게재하지 않으며, 광고나 광고 네트워크 스크립트를 전혀 불러오지 않습니다. 이 점이 바뀐다면 어떤 사업자를 쓰고 무엇을 수집하는지 이 페이지에 먼저 밝히겠습니다.",
      },
      {
        heading: "방침 변경",
        body: "사이트가 데이터를 다루는 방식이 바뀌면 이 페이지도 함께 바뀌고, 상단의 날짜를 갱신합니다.",
      },
    ],
    contactHeading: "문의",
    contactBody:
      "이 사이트에는 별도의 연락용 주소가 없어요. 특정 업체에 관한 일 — 정보 수정이나 삭제 요청을 포함해서 — 은 해당 업체 페이지 아래쪽의 \"정보 오류 제보\" 양식을 이용해 주세요. 이 방침에 대한 질문을 포함한 그 밖의 용건은 광고 문의 양식으로 보내주시면 같은 사람에게 전달됩니다.",
    contactCta: "문의 양식 열기",
  },
  terms: {
    title: "이용약관",
    updated: "최종 수정일: 2026년 8월 20일",
    intro:
      "이 약관은 chillanel.com 이용에 적용됩니다. 사이트를 이용하시면 약관에 동의하신 것으로 봅니다. 동의하지 않으신다면 이용을 삼가 주세요.",
    sections: [
      {
        heading: "chillanel은 어떤 곳인가요",
        body: "chillanel은 태국 마사지·스파 업체를 소개하는 독립 가이드입니다. 여기 실린 어떤 업체와도 제휴 관계가 없고, 소유 관계도 없으며, 대가를 받지도 않아요. 돈을 받고 자리를 파는 유료 노출도, 스폰서 순위도 없습니다 — 돈으로 목록 위쪽에 올라갈 수 없어요.",
      },
      {
        heading: "chillanel이 아닌 것",
        body: "예약 플랫폼도 아니고 중개인도 아닙니다. 예약을 받지 않고, 결제를 처리하지 않으며, 여러분이 업체와 정하는 일에 당사자로 끼지 않아요. 연락처와 지도 링크는 업체와 직접 소통하시라고 제공하는 것이고, 여러분과 업체 사이의 일은 두 분 사이의 일입니다.",
      },
      {
        heading: "정보의 정확성",
        body: "목록은 사이트를 배포하기 전에 수집한 공개 구글맵 데이터로 만들어집니다. 즉 보고 계신 것은 실시간 정보가 아니라 특정 시점의 스냅숏이에요. 업체는 문을 닫기도 하고, 자리를 옮기고, 영업시간과 가격을 바꾸기도 하는데 저희가 모르는 사이에 페이지가 낡을 수 있습니다. 여기 적힌 내용은 출발점으로만 보시고, 이동하거나 예약하기 전에 업체에 직접 확인해 주세요. 이 사이트는 있는 그대로 제공되며, 개별 항목이 최신이거나 완전하거나 정확하다고 보장하지 않습니다.",
      },
      {
        heading: "리뷰와 분위기 키워드",
        body: "리뷰 본문은 공개된 구글 리뷰에서 인용한 것으로, 그 글을 쓴 분들의 것입니다 — 저희 의견이 아니고 저희가 손대지도 않아요. 각 페이지의 분위기·서비스 키워드는 그 리뷰 본문에서 소프트웨어가 자동으로 뽑아낸 것입니다. 자동 추출은 리뷰를 잘못 읽을 수 있으니, 키워드는 업체에 대해 검증된 사실이 아니라 리뷰에서 자주 언급된 내용의 요약으로 받아들여 주세요.",
      },
      {
        heading: "신뢰 점수에 대하여",
        body: "신뢰 점수는 구글 평점, 그 평점을 뒷받침하는 리뷰 수, 리뷰에 담긴 디테일의 양을 저희가 직접 계산한 값입니다. 어떤 업체에 대해 공개적으로 확인할 수 있는 근거를 읽어낸 수치일 뿐, 실사도 인증도 추천도 아니에요. 점수가 높다고 저희가 방문했거나 검증했다는 뜻이 아니고, 낮다고 해서 문제가 있다는 지적도 아닙니다.",
      },
      {
        heading: "가격 정보",
        body: "표시되는 가격은 업체가 제시한 견적이 아니라 리뷰 본문에서 언급된 금액입니다. 오래된 금액일 수도 있고, 원하시는 것과 다른 서비스의 가격일 수도 있으며, 누구에게도 구속력이 없어요. 현재 가격은 업체에 직접 물어봐 주세요.",
      },
      {
        heading: "이용 시 지켜주실 것",
        body: "평범한 방문자처럼 이용해 주세요. 사이트의 목록을 대량으로 복사하거나 크롤링하지 말아 주시고, 양식으로 스팸이나 악의적인 내용을 보내지 말아 주시고, 사이트를 방해하거나 양식의 제출 제한을 우회하려 하지 말아 주세요.",
      },
      {
        heading: "콘텐츠와 권리",
        body: "사이트의 디자인, 저희가 직접 쓴 문구, 분류와 분위기 묶음, 신뢰 점수 계산 방식은 chillanel의 것입니다. 업체명, 주소, 평점, 리뷰 본문은 각 권리자에게 속하며 해당 업체에 관한 공개 정보로서 이곳에 표시됩니다. Google과 Google Maps는 Google LLC의 상표이고, 지도 데이터의 저작권은 © OpenStreetMap 기여자에게 있습니다.",
      },
      {
        heading: "수정과 삭제 요청",
        body: "모든 업체 페이지에는 \"정보 오류 제보\" 양식이 있습니다. 폐업했다거나, 정보가 틀렸다거나, 중복 등록이라거나, 무언가를 내려달라는 이야기를 이 양식으로 알려주세요. 저희에게 바로 전달되고, 페이지를 고치는 가장 빠른 방법입니다.",
      },
      {
        heading: "광고 문의",
        body: "노출을 늘리고 싶은 업체 사장님은 광고 문의 양식을 이용하실 수 있습니다. 다만 분명히 해두자면, 문의를 주셨다고 해서 업체의 순위나 신뢰 점수가 달라지지는 않습니다. 그 둘은 판매 대상이 아니에요.",
      },
      {
        heading: "약관 변경",
        body: "사이트가 바뀌면 약관도 바뀔 수 있습니다. 언제나 이 페이지에 있는 것이 현재 버전이고, 상단에 날짜가 적혀 있습니다.",
      },
    ],
    contactHeading: "문의",
    contactBody:
      "특정 업체에 관한 일은 해당 업체 페이지의 \"정보 오류 제보\" 양식을, 이 약관에 대한 질문을 포함한 그 밖의 용건은 광고 문의 양식을 이용해 주세요. 두 양식 모두 같은 사람에게 전달됩니다.",
    contactCta: "문의 양식 열기",
  },
  footer: {
    rights: "독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다.",
    tagline: "모든 곳엔 저마다의 분위기가 있어요. 당신에게 맞는 곳을 찾아드릴게요.",
    exploreTitle: "둘러보기",
    languageTitle: "언어",
  },
  notFound: {
    title: "페이지를 찾을 수 없어요",
    body: "이 페이지는 존재하지 않거나, 업체가 폐업했거나 삭제되었을 수 있어요.",
    cta: "홈으로 돌아가기",
  },
  errorPage: {
    title: "문제가 발생했어요",
    body: "페이지를 불러오는 중 예상치 못한 오류가 발생했어요.",
    retry: "다시 시도",
    cta: "홈으로 돌아가기",
  },
  advertise: {
    title: "chillanel에 광고 문의하기",
    intro: "마사지숍이나 스파를 운영하고 계신가요? 노출을 늘리고 싶다면 업체 정보를 남겨주세요. 확인 후 연락드릴게요.",
    nameLabel: "이름",
    contactLabel: "연락처 (이메일, 전화번호, 또는 라인 아이디)",
    contactPlaceholder: "you@example.com",
    messageLabel: "문의 내용",
    messagePlaceholder: "업체 소개와 원하시는 내용을 알려주세요.",
    submit: "문의 보내기",
    sending: "전송 중…",
    success: "감사합니다. 문의가 접수되었어요. 곧 연락드릴게요.",
    error: "문의 전송 중 오류가 발생했어요. 다시 시도해주세요.",
  },
  correction: {
    linkLabel: "정보 오류 제보",
    title: "이 업체 정보에 문제가 있나요?",
    issueTypeLabel: "어떤 문제인가요?",
    issueTypes: {
      closed: "폐업한 업체예요",
      wrongInfo: "주소, 전화번호 등 정보가 틀렸어요",
      duplicate: "중복 등록된 업체예요",
      other: "기타",
    },
    detailsLabel: "상세 내용",
    detailsPlaceholder: "어떤 부분을 수정해야 할까요?",
    contactLabel: "연락처 (선택, 확인이 필요할 경우)",
    contactPlaceholder: "you@example.com",
    submit: "제보 보내기",
    sending: "전송 중…",
    success: "감사합니다. 제보가 접수되었어요.",
    error: "제보 전송 중 오류가 발생했어요. 다시 시도해주세요.",
    cancel: "취소",
  },
};

const DICTS: Record<Lang, Dict> = { en, th, ko };

export function tFor(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS.en;
}
