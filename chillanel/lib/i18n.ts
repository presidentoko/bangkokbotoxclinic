import type { Lang } from "./site";

export type FaqItem = { q: string; a: string };

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
