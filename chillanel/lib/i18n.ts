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
    /** Template with a "{n}" placeholder, e.g. "{n} named in reviews". */
    namedInReviews: string;
    anonymousReviewer: string;
    serviceThemesTitle: string;
    moodKeywordsTitle: string;
    ratingBreakdownTitle: string;
    /** Template with a "{price}" placeholder. */
    priceRangeLabel: string;
    /** Template with a "{theme}" placeholder, used inside the auto-generated summary paragraph. */
    summaryThemeClause: string;
    /** Template with a "{mood}" placeholder, used inside the auto-generated summary paragraph. */
    summaryMoodClause: string;
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
  /** listTitle/intro/faqTitle/faq[].* use a "{city}" placeholder, e.g. "Massage & spa in {city}". */
  city: {
    listTitle: string;
    placeCount: string;
    intro: string;
    /** Template with a "{shown}" placeholder, e.g. "Showing the top {shown} by rating.". */
    showingTop: string;
    faqTitle: string;
    faq: FaqItem[];
    trendingTitle: string;
    browseByAreaTitle: string;
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
  guide: { indexTitle: string };
  favorites: {
    title: string;
    intro: string;
    empty: string;
    browseCta: string;
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
  },
  home: {
    heroTitle: "It's not the spa. It's the hands.",
    heroSub:
      "chillanel is a Bangkok massage & spa guide built around the one thing every ranking site ignores: who's actually giving the massage.",
    philosophyTitle: "Why we're different",
    philosophyBody:
      "A five-star lobby doesn't guarantee a good massage, and a plain shophouse doesn't mean a bad one. We read the reviews for the parts other sites skip — the ones that name names.",
    featuredTitle: "Featured places",
    trustBadge: "{count}+ places, built from real Google reviews",
    ctaBrowse: "Browse Bangkok",
    manifesto: "No paid placements. No sponsored ranks. Every listing pulled straight from public Google reviews.",
    stats: { places: "places listed", reviews: "reviews analyzed", therapists: "therapists named by reviewers" },
    quotesTitle: "In their own words",
    editorsPick: "Top rated",
    faqTitle: "Common questions",
    faq: [
      {
        q: "How is chillanel different from other massage & spa listing sites?",
        a: "Most sites rank by facility — lobby, decor, price. We read the reviews for the part everyone else skips: which specific therapist people ask for by name. A five-star lobby doesn't guarantee a good massage, and a plain shophouse doesn't mean a bad one.",
      },
      {
        q: "Are the therapist names real?",
        a: "They're auto-extracted from public Google reviews when 2 or more different reviewers mention the same name — always shown with the original quote. We label them clearly as unverified, and you should confirm availability with the venue directly.",
      },
      {
        q: "How do I pick a good massage place in Bangkok?",
        a: "Start with the rating and review count, then check if any therapist is named repeatedly in reviews — that's a stronger signal than the storefront. Read a few recent reviews for context on cleanliness and pressure style.",
      },
    ],
    trendingTitle: "What Bangkok reviewers say most",
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
    namedInReviews: "{n} named in reviews",
    anonymousReviewer: "Anonymous",
    serviceThemesTitle: "Services mentioned in reviews",
    moodKeywordsTitle: "How reviewers describe it",
    ratingBreakdownTitle: "Rating breakdown",
    priceRangeLabel: "~{price}฿ per session, based on reviewer mentions",
    summaryThemeClause: "Reviewers most often mention {theme} here.",
    summaryMoodClause: "Regulars describe the place as {mood}.",
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
  city: {
    listTitle: "Massage & spa in {city}",
    placeCount: "places",
    intro: "Real Google reviews from {city}, read for the part other sites skip — who's actually behind the massage.",
    showingTop: "Showing the top {shown}, sorted by rating.",
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
  guide: { indexTitle: "Guides" },
  favorites: {
    title: "Your favorites",
    intro: "Saved on this device only — nothing is uploaded, so favorites won't follow you to another browser.",
    empty: "No favorites yet. Tap the heart on any place to save it here.",
    browseCta: "Browse places",
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
    viewButton: "View",
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
      "chillanel is an independent guide to massage and spa places in Thailand. We're not affiliated with any venue. Our angle: therapist quality varies far more than facility quality, so we surface what reviewers say about the people, not just the place.",
    trustScoreTitle: "How the Trust Score works",
    trustScoreBody:
      "Every place gets a 0-100 Trust Score built from three things we can verify. Half comes from the Google rating itself (50 points). Just over a third comes from how many reviews back that rating up, on a log scale so one viral review can't skew things (35 points). The rest comes from how many distinct things reviewers actually mention about the place — service style, mood, cleanliness — capped at 15 points. A place with no reviewer detail beyond a star rating scores lower on that last part; it isn't a penalty, just an honest reflection of how much we could verify.",
  },
  footer: {
    rights: "Independent guide. Not affiliated with any venue.",
    tagline: "It's not the spa. It's the hands.",
    exploreTitle: "Explore",
    languageTitle: "Language",
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
  },
  home: {
    heroTitle: "ไม่ใช่ร้าน แต่เป็นฝีมือคน",
    heroSub:
      "chillanel คือคู่มือร้านนวด & สปาในกรุงเทพฯ ที่โฟกัสสิ่งที่เว็บจัดอันดับอื่นมองข้าม นั่นคือ ใครเป็นคนนวดจริง ๆ",
    philosophyTitle: "ทำไมเราถึงต่าง",
    philosophyBody:
      "ล็อบบี้ห้าดาวไม่ได้การันตีฝีมือนวดที่ดี และร้านเล็ก ๆ ก็ไม่ได้แปลว่าแย่เสมอไป เราอ่านรีวิวในส่วนที่เว็บอื่นข้ามไป — ส่วนที่เอ่ยชื่อจริง ๆ",
    featuredTitle: "ร้านแนะนำ",
    trustBadge: "รวมกว่า {count}+ ร้าน จากรีวิว Google จริง",
    ctaBrowse: "ดูร้านในกรุงเทพฯ",
    manifesto: "ไม่มีการจ่ายเงินจัดอันดับ ไม่มีสปอนเซอร์ ทุกรายชื่อดึงตรงจากรีวิว Google สาธารณะ",
    stats: { places: "ร้านที่รวบรวม", reviews: "รีวิวที่วิเคราะห์", therapists: "หมอนวดที่ถูกเอ่ยชื่อโดยรีวิว" },
    quotesTitle: "คำพูดจากรีวิวจริง",
    editorsPick: "คะแนนสูงสุด",
    faqTitle: "คำถามที่พบบ่อย",
    faq: [
      {
        q: "chillanel ต่างจากเว็บจัดอันดับร้านนวด/สปาอื่นยังไง?",
        a: "เว็บส่วนใหญ่จัดอันดับจากหน้าร้าน ล็อบบี้ ราคา แต่เราอ่านรีวิวในส่วนที่เว็บอื่นข้ามไป — คือใครคือหมอนวดที่คนขอชื่อจริง ๆ ล็อบบี้ห้าดาวไม่ได้การันตีฝีมือนวดที่ดี และร้านเล็ก ๆ ก็ไม่ได้แปลว่าแย่เสมอไป",
      },
      {
        q: "ชื่อหมอนวดที่แสดงเป็นชื่อจริงไหม?",
        a: "ชื่อเหล่านี้ดึงมาอัตโนมัติจากรีวิว Google สาธารณะ เมื่อมีผู้รีวิวอย่างน้อย 2 คนขึ้นไปเอ่ยชื่อเดียวกัน — พร้อมแสดงข้อความรีวิวต้นฉบับเสมอ เราระบุชัดเจนว่ายังไม่ได้ยืนยัน กรุณาสอบถามร้านโดยตรงก่อนเข้ารับบริการ",
      },
      {
        q: "จะเลือกร้านนวดในกรุงเทพฯ ยังไงดี?",
        a: "เริ่มจากคะแนนและจำนวนรีวิว จากนั้นดูว่ามีชื่อหมอนวดคนไหนถูกเอ่ยซ้ำ ๆ ในรีวิวไหม นั่นเป็นสัญญาณที่น่าเชื่อถือกว่าหน้าร้าน แล้วอ่านรีวิวล่าสุดสักสองสามอันเพื่อดูความสะอาดและสไตล์การนวด",
      },
    ],
    trendingTitle: "รีวิวในกรุงเทพฯ พูดถึงอะไรมากที่สุด",
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
    namedInReviews: "ถูกเอ่ยชื่อในรีวิว {n} คน",
    anonymousReviewer: "ไม่ระบุชื่อ",
    serviceThemesTitle: "บริการที่ถูกพูดถึงในรีวิว",
    moodKeywordsTitle: "รีวิวบอกว่าร้านนี้เป็นยังไง",
    ratingBreakdownTitle: "สัดส่วนคะแนนรีวิว",
    priceRangeLabel: "ประมาณ ~{price}฿ ต่อครั้ง (จากรีวิว)",
    summaryThemeClause: "รีวิวพูดถึง{theme}ที่นี่บ่อยที่สุด",
    summaryMoodClause: "ลูกค้าประจำบอกว่าร้านนี้{mood}",
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
  city: {
    listTitle: "ร้านนวดและสปาใน {city}",
    placeCount: "ร้าน",
    intro: "รีวิว Google จริงจาก{city} อ่านในมุมที่เว็บอื่นข้ามไป — ใครคือคนที่นวดให้จริง ๆ",
    showingTop: "แสดง {shown} อันดับแรก เรียงตามคะแนน",
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
  guide: { indexTitle: "คู่มือ" },
  favorites: {
    title: "รายการโปรดของคุณ",
    intro: "บันทึกไว้บนอุปกรณ์นี้เท่านั้น ไม่มีการอัปโหลดข้อมูล ดังนั้นรายการโปรดจะไม่ตามไปที่เบราว์เซอร์อื่น",
    empty: "ยังไม่มีรายการโปรด กดรูปหัวใจที่ร้านไหนก็ได้เพื่อบันทึกไว้ที่นี่",
    browseCta: "ดูร้านทั้งหมด",
  },
  compare: {
    title: "เปรียบเทียบร้าน",
    intro: "เลือกได้สูงสุด 3 ร้านจากรายการใดก็ได้เพื่อเปรียบเทียบแบบเคียงข้างกัน",
    empty: "ยังไม่ได้เลือกร้าน กดปุ่ม + ที่ร้านไหนก็ได้เพื่อเพิ่มที่นี่",
    browseCta: "ดูร้านทั้งหมด",
    clearAll: "ล้างทั้งหมด",
    themesLabel: "บริการเด่น",
    moodsLabel: "รีวิวบอกว่า",
    priceLabel: "ราคาโดยประมาณ",
    viewButton: "ดูรายละเอียด",
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
      "chillanel คือคู่มืออิสระสำหรับร้านนวดและสปาในประเทศไทย เราไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ มุมมองของเรา: ฝีมือของพนักงานนวดต่างกันมากกว่าคุณภาพของสถานที่ เราจึงนำเสนอสิ่งที่รีวิวพูดถึงตัวคน ไม่ใช่แค่สถานที่",
    trustScoreTitle: "คะแนนความน่าเชื่อถือคำนวณยังไง",
    trustScoreBody:
      "ทุกร้านจะได้คะแนนความน่าเชื่อถือ 0-100 ที่มาจาก 3 ส่วนที่เราตรวจสอบได้จริง ครึ่งหนึ่งมาจากคะแนนรีวิว Google โดยตรง (50 คะแนน) มากกว่าหนึ่งในสามมาจากจำนวนรีวิวที่รองรับคะแนนนั้น โดยคำนวณแบบ log scale เพื่อไม่ให้รีวิวไวรัลเพียงรีวิวเดียวทำให้ผลเพี้ยน (35 คะแนน) และที่เหลือมาจากจำนวนสิ่งที่แตกต่างกันที่รีวิวพูดถึงจริง ๆ เช่น สไตล์บริการ บรรยากาศ ความสะอาด สูงสุด 15 คะแนน ร้านที่รีวิวไม่ได้ลงรายละเอียดอะไรนอกจากให้ดาวจะได้คะแนนส่วนนี้น้อยกว่า ไม่ใช่การลงโทษ แค่สะท้อนตามจริงว่าเราตรวจสอบได้มากแค่ไหน",
  },
  footer: {
    rights: "คู่มืออิสระ ไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ",
    tagline: "ไม่ใช่ร้าน แต่เป็นฝีมือคน",
    exploreTitle: "สำรวจ",
    languageTitle: "ภาษา",
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
  },
  home: {
    heroTitle: "중요한 건 스파가 아니라 손끝이에요.",
    heroSub:
      "chillanel은 다른 순위 사이트들이 놓치는 단 하나 — 실제로 누가 마사지를 해주는지에 집중한 방콕 마사지·스파 가이드입니다.",
    philosophyTitle: "우리가 다른 이유",
    philosophyBody:
      "화려한 로비가 좋은 마사지를 보장하지 않고, 소박한 샵이라고 실력이 없는 것도 아니에요. 저희는 다른 사이트가 건너뛰는 리뷰 부분 — 실명이 언급된 부분을 읽습니다.",
    featuredTitle: "추천 업체",
    trustBadge: "실제 구글 리뷰 기반, {count}+개 업체 수록",
    ctaBrowse: "방콕 업체 보기",
    manifesto: "돈 받고 순위 매기지 않아요. 스폰서도 없어요. 모든 목록은 공개된 구글 리뷰에서 그대로 가져옵니다.",
    stats: { places: "등록된 업체", reviews: "분석한 리뷰", therapists: "리뷰에서 이름이 언급된 테라피스트" },
    quotesTitle: "실제 리뷰어의 말",
    editorsPick: "최고 평점",
    faqTitle: "자주 묻는 질문",
    faq: [
      {
        q: "chillanel은 다른 마사지·스파 순위 사이트랑 뭐가 달라요?",
        a: "대부분의 사이트는 로비, 인테리어, 가격 같은 시설 기준으로 순위를 매겨요. 저희는 다른 사이트가 건너뛰는 부분 — 실제로 누가 마사지를 해주는지, 리뷰에서 실명이 언급된 부분을 읽습니다. 화려한 로비가 좋은 마사지를 보장하지 않고, 소박한 샵이라고 실력이 없는 것도 아니에요.",
      },
      {
        q: "리뷰에 나온 테라피스트 이름은 실제인가요?",
        a: "공개된 구글 리뷰에서 2명 이상의 서로 다른 리뷰어가 같은 이름을 언급했을 때 자동으로 추출된 이름이며, 원문 인용과 함께 항상 표시됩니다. 검증되지 않았다는 점을 명확히 표시하니, 방문 전 업체에 직접 확인해 주세요.",
      },
      {
        q: "방콕에서 좋은 마사지샵은 어떻게 고르나요?",
        a: "평점과 리뷰 수를 먼저 확인하고, 리뷰에 반복적으로 언급되는 테라피스트 이름이 있는지 살펴보세요. 이는 매장 외관보다 더 신뢰할 수 있는 신호예요. 최근 리뷰 몇 개를 읽으면 청결도나 마사지 스타일도 파악할 수 있습니다.",
      },
    ],
    trendingTitle: "방콕 리뷰에서 가장 많이 언급된 것",
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
    namedInReviews: "리뷰에 이름 언급 {n}명",
    anonymousReviewer: "익명",
    serviceThemesTitle: "리뷰에서 언급된 서비스",
    moodKeywordsTitle: "리뷰어들이 말하는 이곳의 분위기",
    ratingBreakdownTitle: "평점 분포",
    priceRangeLabel: "리뷰 기준 회당 약 ~{price}฿",
    // {theme} carries its own subject particle (이/가) appended by the
    // caller via lib/korean-particles.ts -- see lib/summary.ts.
    summaryThemeClause: "리뷰에서 이곳의 {theme} 가장 많이 언급됩니다.",
    summaryMoodClause: "단골들은 이곳을 {mood} 분위기라고 말합니다.",
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
  city: {
    listTitle: "{city}의 마사지 & 스파",
    placeCount: "곳",
    intro: "{city}의 실제 구글 리뷰를 다른 사이트가 건너뛰는 부분까지 — 실제로 누가 마사지를 해주는지 읽어드립니다.",
    showingTop: "평점순으로 상위 {shown}곳을 보여드려요.",
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
  guide: { indexTitle: "가이드" },
  favorites: {
    title: "찜한 곳",
    intro: "이 기기에만 저장돼요 — 서버에 올라가지 않아서 다른 브라우저에서는 보이지 않아요.",
    empty: "아직 찜한 곳이 없어요. 원하는 곳의 하트를 눌러 저장해보세요.",
    browseCta: "업체 둘러보기",
  },
  compare: {
    title: "업체 비교하기",
    intro: "어디서든 최대 3곳을 선택해서 나란히 비교해볼 수 있어요.",
    empty: "아직 선택된 곳이 없어요. 원하는 곳의 + 버튼을 눌러 추가해보세요.",
    browseCta: "업체 둘러보기",
    clearAll: "전체 지우기",
    themesLabel: "주요 서비스",
    moodsLabel: "리뷰 키워드",
    priceLabel: "대략적인 가격",
    viewButton: "자세히 보기",
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
      "chillanel은 태국 마사지·스파 업체에 대한 독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다. 저희 관점: 시설보다 테라피스트의 실력 차이가 훨씬 크기 때문에, 장소가 아니라 사람에 대한 리뷰 내용을 보여드립니다.",
    trustScoreTitle: "신뢰 점수는 어떻게 계산되나요",
    trustScoreBody:
      "모든 업체는 검증 가능한 3가지 요소로 만든 0-100 신뢰 점수를 받아요. 절반은 구글 평점 자체에서 나오고(50점), 3분의 1 조금 넘게는 그 평점을 뒷받침하는 리뷰 수에서 나오는데 로그 스케일로 계산해서 리뷰 하나가 급증한다고 결과가 왜곡되지 않게 했어요(35점). 나머지는 리뷰에서 실제로 언급된 서로 다른 요소들 — 서비스 스타일, 분위기, 청결도 등 — 의 개수에서 나와요, 최대 15점이에요. 리뷰에 별점 말고 다른 디테일이 없는 곳은 이 마지막 부분에서 낮은 점수를 받는데, 이건 페널티가 아니라 저희가 검증할 수 있었던 만큼만 정직하게 반영한 거예요.",
  },
  footer: {
    rights: "독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다.",
    tagline: "중요한 건 스파가 아니라 손끝이에요.",
    exploreTitle: "둘러보기",
    languageTitle: "언어",
  },
};

const DICTS: Record<Lang, Dict> = { en, th, ko };

export function tFor(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS.en;
}
