// Golf travel/practical guide articles. AEO/SEO 폭격용 + 검색 long-tail 캡처.
// 800-1500 words 정도, FAQPage schema + Article schema 다 발리도록 구조화.

export type Faq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: Faq[];
  related?: string[]; // related guide slugs
  city_slugs?: string[]; // matching city slugs to cross-link
  category_slugs?: string[]; // matching course categories
  updated: string; // ISO date
};

export const GUIDES: Guide[] = [
  {
    slug: "booking-thai-golf",
    title: "How to Book Golf in Thailand — Beginner's Guide (2026)",
    metaTitle: "How to Book Golf in Thailand — Complete Booking Guide 2026",
    metaDescription:
      "Step-by-step guide to booking golf tee times in Thailand. Booking partners, lead times, packages, what's included, and practical tips for international golfers.",
    updated: "2026-05-06",
    intro:
      "Booking golf in Thailand is straightforward once you know the channels. This guide walks through the four practical options — direct, agency, hotel concierge, and Klook — with timing, what each option includes, and when to use which.",
    sections: [
      {
        heading: "The four booking channels",
        body:
          "Direct: book through the course's own website or phone number — best green fee but no transport, equipment, or English help. " +
          "Agency: Golfsavers and Sawasdee Golf are the two big Thailand specialists — they bundle green fees, caddy, transport, club rental, and often hotel. Their published rates are usually 5-15% above direct, but the convenience for first-timers is significant. " +
          "Hotel concierge: most 4-star+ hotels can book golf with a couple hours notice. They take a small markup but absorb the language friction. " +
          "Klook: best for one-off rounds at popular tourist courses. Klook's prices are competitive and inventory is real-time, but selection is narrower than the agencies.",
      },
      {
        heading: "How far ahead should you book?",
        body:
          "Weekend tee times at popular Bangkok-area courses (Alpine, Thai Country Club, Riverdale, Nikanti) sell out 1-2 weeks ahead — book the moment your dates firm up. " +
          "Weekday rounds at the same courses can usually be booked 1-3 days out. " +
          "Less famous courses or off-season (May-Sept) you can often walk in with 24 hours notice. " +
          "Hua Hin and Pattaya weekends fill up around Korean and Japanese tour group cycles — Friday-Sunday in those regions especially.",
      },
      {
        heading: "What's included in the green fee?",
        body:
          "Green fee covers the round (18 holes typically) and access to the course. It does NOT include: caddy fee (around ฿400 — mandatory at almost all courses), caddy tip (฿400-600 customary), cart fee (often ฿700-1,000 if not walking), club rental (฿700-2,500 if needed). " +
          "Premium clubs sometimes bundle cart and caddy into the published rate — always confirm. Visitor surcharges of 10-30% on weekends are common at country clubs.",
      },
      {
        heading: "Tipping the caddy",
        body:
          "Caddy tipping is universal and important. The standard tip is ฿400-500 (≈ USD 12-15) at public courses, ฿500-800 at premium country clubs. " +
          "Korean-speaking caddies typically receive larger tips (฿600-1,000) due to the Korean tour-group culture of tipping more generously. " +
          "Pay caddy fee at the clubhouse on arrival, tip in cash directly to the caddy at the end of the round.",
      },
      {
        heading: "Stay-and-play packages",
        body:
          "Hua Hin, Phuket, and Chiang Mai all have well-developed stay-and-play resort programs. Black Mountain (Hua Hin), Banyan (Hua Hin), Laguna Phuket, and Mission Hills Phuket all bundle hotel + green fees + transfers. " +
          "Korean tour packages most often head to Pattaya area resorts. For a 3-day, 3-round trip the package price is often equal to or below the sum of separate hotel + green fees.",
      },
      {
        heading: "Practical pre-round checklist",
        body:
          "Arrive 60-90 min before tee time — locker, range balls, breakfast. " +
          "Dress code: collared shirt and golf shorts/pants required at all clubs; no denim. Soft spikes only. " +
          "Bring cash for caddy fee and tip — most clubs accept cards for green fees but caddy is cash. " +
          "Reserve range balls separately if you want to warm up — usually ฿100-200.",
      },
    ],
    faqs: [
      {
        q: "Can I just walk in without booking?",
        a: "On weekdays at less famous courses — usually yes. On weekends or at popular courses — no, especially during October-March peak season. Always call ahead, even for a same-day walk-in.",
      },
      {
        q: "Is Golfsavers worth the markup?",
        a: "For first-time visitors, yes — they handle transport, English-speaking caddies, and equipment. For repeat visitors comfortable with the system, booking direct saves 10-20%.",
      },
      {
        q: "Do I need to bring my own clubs?",
        a: "No. All Thailand golf courses rent clubs (฿700-2,500 depending on quality). Brand-name rental sets at premium clubs are quite good. For a long trip with multiple rounds, bringing your own makes sense.",
      },
      {
        q: "What does GIR / GHIN mean — are they used in Thailand?",
        a: "GHIN handicaps are recognized but rarely required for visitor play. Most courses don't ask for handicap. Country clubs and private clubs may ask for proof of handicap (≤ 24-28 typically).",
      },
    ],
    related: ["green-fees-thailand", "caddy-tipping-guide", "korean-golf-tour-thailand"],
  },
  {
    slug: "green-fees-thailand",
    title: "Thailand Green Fee Guide — What You'll Pay in 2026",
    metaTitle: "Thailand Golf Green Fees 2026 — Bangkok, Pattaya, Hua Hin Pricing",
    metaDescription:
      "Current green fee ranges across Thailand: Bangkok, Pattaya, Hua Hin, Chiang Mai, Phuket. Includes weekday vs weekend, visitor surcharges, and what's included.",
    updated: "2026-05-06",
    intro:
      "Thailand green fees vary widely by region, course tier, and weekday vs weekend. Below is a current snapshot of typical visitor green fees in 2026, by region and tier.",
    sections: [
      {
        heading: "Bangkok area — premium",
        body:
          "Premium country clubs (Alpine, Thai Country Club, Riverdale, Royal Gems, Nikanti) typically run ฿4,500-7,500 weekday and ฿7,000-10,000+ weekend for visitors. Some flagship clubs add a 20-30% weekend surcharge plus caddy and cart fees on top.",
      },
      {
        heading: "Bangkok area — public",
        body:
          "Public and lower-tier private courses near Bangkok run ฿1,500-3,500 weekday and ฿2,500-5,000 weekend. Pathum Thani and Samut Prakan courses are typically cheaper than central Bangkok options.",
      },
      {
        heading: "Pattaya / Chonburi",
        body:
          "Pattaya area is the value sweet spot for Korean and Japanese tour groups. Premium tier (Siam CC Plantation, Laem Chabang International) ฿3,500-6,000 weekday, ฿5,000-8,000 weekend. Mid-tier ฿1,800-3,500 weekday. Bus transport from Bangkok is 90-120 minutes.",
      },
      {
        heading: "Hua Hin / Cha-am",
        body:
          "Black Mountain, Banyan, and Sea Pines run ฿3,500-5,500 weekday, ฿5,000-7,500 weekend. Older courses in the area (Royal Hua Hin, Springfield) ฿2,000-3,500 weekday. Stay-and-play packages typically discount green fees 25-40% for resort guests.",
      },
      {
        heading: "Chiang Mai",
        body:
          "Best value in the country for premium golf. Alpine Chiang Mai, Royal Chiang Mai, and Highlands ฿2,500-4,000 weekday, ฿3,500-5,500 weekend. Mountain views and cooler weather November-February. Caddy fees similar to other regions.",
      },
      {
        heading: "Phuket",
        body:
          "Resort-driven pricing — Laguna, Mission Hills, Blue Canyon, Red Mountain ฿4,500-7,000 weekday, ฿6,000-9,500 weekend. Most include cart in the green fee. Strong stay-and-play discounts at affiliated resorts.",
      },
      {
        heading: "What else to budget for",
        body:
          "Caddy fee (mandatory): ฿300-500. " +
          "Caddy tip (customary): ฿400-800 depending on tier. " +
          "Cart fee (if not walking): ฿700-1,200. " +
          "Club rental (if needed): ฿700-2,500. " +
          "Range balls: ฿100-300. " +
          "Realistic all-in cost for a mid-tier round: ฿3,000-4,500. Premium round: ฿7,000-10,000+.",
      },
    ],
    faqs: [
      {
        q: "Why are Thailand green fees so much cheaper than the US/Korea/Japan?",
        a: "Lower land cost, lower labor cost (caddy fee is included in most rounds), and a high-volume tourist business model. Premium Thailand courses are world-class but operate on tourist economics.",
      },
      {
        q: "Are weekend surcharges normal?",
        a: "Yes — 20-50% over weekday rate is standard. Some clubs also surcharge on Friday and public holidays. If your schedule is flexible, weekday play unlocks 30-40% savings at the same course.",
      },
      {
        q: "When is low season for green fees?",
        a: "May-September is rainy season — green fees drop 10-30% and tee times are easier. Mornings are usually playable; afternoons risk thunderstorms. October and March are shoulder seasons.",
      },
    ],
    related: ["booking-thai-golf", "best-time-thailand-golf", "caddy-tipping-guide"],
  },
  {
    slug: "korean-golf-tour-thailand",
    title: "Korean Golf Tours in Thailand — Where to Play, What to Expect",
    metaTitle: "Korean Golf Tour Thailand 2026 — Pattaya, Bangkok, Hua Hin Guide",
    metaDescription:
      "Where Korean golf tours go in Thailand, how packages work, Korean-speaking caddy availability, and tips for independent Korean golfers booking direct.",
    updated: "2026-05-06",
    intro:
      "Thailand is the #1 international golf destination for Korean golfers, with hundreds of courses regularly hosting Korean tour groups. This guide covers where the groups go, how packages typically work, and tips for independent Korean golfers.",
    sections: [
      {
        heading: "Where Korean tours concentrate",
        body:
          "Pattaya / Chonburi: the largest Korean tour volume — 2-3 hour drive from Bangkok, dense cluster of courses, dedicated Korean restaurants and accommodations. " +
          "Bangkok suburbs: Pathum Thani and Samut Prakan corridors, especially weekday tee times. " +
          "Hua Hin: growing Korean presence at Black Mountain and Banyan especially. " +
          "Chiang Mai: smaller but established Korean community especially November-February (cooler weather).",
      },
      {
        heading: "How a typical package works",
        body:
          "A 3-day Korean golf tour package typically includes: hotel (3-4 star), 2-3 rounds of golf with green fee + caddy + cart, transport between hotel and courses, and one or two meals. Total cost ₩900,000-1,500,000 per person ($700-1,150 USD). " +
          "Packages are usually arranged through Korean tour operators (Tour2 Korea, Hyundai Golf, etc.) who have direct contracts with courses.",
      },
      {
        heading: "Korean-speaking caddies",
        body:
          "Most courses regularly hosting Korean tours have at least some Korean-speaking caddies — especially in Pattaya and Hua Hin. Bangkok premium clubs have fewer Korean caddies. " +
          "Request a Korean caddy when booking — not all are available all days. The Korean caddy network at a course is often word-of-mouth among Thai caddies, so demand creates supply over time. " +
          "Tip Korean caddies more generously (฿600-1,000) — this is the cultural norm and they expect it.",
      },
      {
        heading: "For independent Korean golfers",
        body:
          "Skip the package — book direct or through Golfsavers for 20-30% savings. Bangkok hotels with English-speaking concierge can book most courses. " +
          "Stay in Pattaya for 3-day golf concentration, Bangkok for premium course access, Hua Hin for resort feel. " +
          "Korean restaurants are easily found in all three regions — Sukhumvit Plaza in Bangkok, Soi Buakhao in Pattaya, Khao Takiap area in Hua Hin.",
      },
    ],
    faqs: [
      {
        q: "어느 코스에 한국어 캐디가 가장 많나요?",
        a: "Pattaya 지역 (Siam CC, Phoenix, Bangpra), Hua Hin (Black Mountain, Banyan), Bangkok 외곽의 한국 투어 단골 코스들. 예약시 한국어 캐디 요청 가능 — 100% 보장은 아니지만 인기 코스에서는 거의 가능.",
      },
      {
        q: "한국 패키지 vs 직접 예약 — 어떤게 좋나요?",
        a: "처음이면 패키지 (언어, 교통 다 해결). 두번째부터는 직접이 20-30% 저렴. Golfsavers 같은 영문 에이전시도 좋은 중간 옵션.",
      },
      {
        q: "한국 골퍼가 가장 많이 가는 코스는?",
        a: "Phoenix Gold (Pattaya), Black Mountain (Hua Hin), Alpine (Bangkok), Siam CC Plantation. 신뢰도 점수 + 한국어 리뷰 비율로 우리 사이트의 'Korean-friendly' 베스트 리스트 확인.",
      },
    ],
    related: ["booking-thai-golf", "caddy-tipping-guide", "best-time-thailand-golf"],
  },
  {
    slug: "best-time-thailand-golf",
    title: "Best Time of Year for Golf in Thailand",
    metaTitle: "Best Time of Year for Golf in Thailand — Season Guide 2026",
    metaDescription:
      "Month-by-month guide to golf in Thailand. Weather, tee time availability, green fee seasonality, and which regions are best when.",
    updated: "2026-05-06",
    intro:
      "Thailand's golf season is more nuanced than the simple 'high season Nov-Feb' framing. This guide breaks down weather, tee time availability, and green fee seasonality month by month.",
    sections: [
      {
        heading: "November to February — peak season",
        body:
          "Cool dry season: 22-30°C, low humidity, no rain. The best golf conditions of the year — and the busiest. Premium course tee times sell out 1-2 weeks ahead, green fees at peak. " +
          "Korean and Japanese tour groups peak December-January. International expat play peaks January-February. Plan ahead and pay full rate.",
      },
      {
        heading: "March to May — hot dry season",
        body:
          "Hottest months. 32-38°C with low humidity in early March, building humidity by May. Mornings are still playable; afternoons are brutal. " +
          "Course conditions remain excellent through April; some courses begin overseed in May. Tee times easier to get. Green fees stable.",
      },
      {
        heading: "May to October — green season",
        body:
          "Rainy season, but not what most people imagine. Mornings are usually clear; thunderstorms develop afternoon-evening. 28-32°C, very humid. Course conditions vary — some courses overseed in May creating temporary surface variability. " +
          "Green fees drop 10-30% across the board. Tee times are wide open. Early morning rounds (7-8am) are reliably playable. " +
          "This is the value play for the budget-conscious — quality of golf is still high if you tee off early.",
      },
      {
        heading: "Regional differences",
        body:
          "Chiang Mai: cooler and drier than the south year-round; November-February is exceptional with 18-25°C mornings. Best for golf May-July when the south is wettest. " +
          "Phuket: most rain in September-October; best November-March. " +
          "Hua Hin: drier than Bangkok; benefits less from green-season rain reductions. " +
          "Bangkok: highest humidity but most consistent year-round play.",
      },
    ],
    faqs: [
      {
        q: "Will rainy season actually rain out my round?",
        a: "Rarely if you tee off in the morning. Afternoon thunderstorms are common but usually 1-2 hour bursts. Most courses suspend play and refund or reschedule. Early-morning tee times (6:30-8:30am) are 90%+ reliable May-October.",
      },
      {
        q: "When is the absolute best month?",
        a: "Late November to early January — cool, dry, no rain. December is peak for tour group volume so book ahead. January is the best balance of conditions and slightly easier tee time access.",
      },
      {
        q: "Are courses cheaper in green season?",
        a: "Yes — 10-30% across the board, with some resorts running 40%+ stay-and-play discounts. The best value play of the year if your schedule is flexible.",
      },
    ],
    related: ["green-fees-thailand", "booking-thai-golf"],
  },
  {
    slug: "caddy-tipping-guide",
    title: "Caddy Tipping in Thailand — How Much, When, Why",
    metaTitle: "Thailand Golf Caddy Tipping Guide — How Much in 2026",
    metaDescription:
      "Caddy tipping etiquette in Thailand golf: typical amounts by tier, when and how to pay, what's included in the caddy fee, and Korean tipping norms.",
    updated: "2026-05-06",
    intro:
      "Caddy tipping is universal at Thailand golf courses and the etiquette differs from North American or European norms. This guide covers what you'll pay and why.",
    sections: [
      {
        heading: "The two payments — fee and tip",
        body:
          "Caddy fee is mandatory and paid at the clubhouse on arrival, usually ฿300-500 depending on the course tier. The course pays the caddy a portion of this. " +
          "Caddy tip is customary and paid in cash directly to the caddy at the end of the round. This is the caddy's primary income and is universally expected.",
      },
      {
        heading: "Standard tip amounts",
        body:
          "Public / mid-tier course: ฿400-500 ($12-15 USD). " +
          "Premium country club: ฿500-800. " +
          "Flagship private club or championship venue: ฿800-1,200. " +
          "Korean-speaking caddy: add 25-50% on the above — Korean tour culture tips more generously and Korean caddies expect this. " +
          "Bad service: still tip ฿300 minimum. Outright misconduct: report to the clubhouse rather than refusing the tip.",
      },
      {
        heading: "What you're paying for",
        body:
          "A Thai caddy is more than a bag carrier — they read greens, club selection, distance, course management, and sometimes coach. Many caddies are former tour players or low-handicap players. " +
          "They may also bring water, manage your scorecard, and handle small tasks at the turn. Over a 4-5 hour round, the value-add is significant.",
      },
      {
        heading: "Practical tips",
        body:
          "Bring cash in ฿100 and ฿500 notes — caddies don't accept cards. " +
          "Tip discreetly (handshake-style transfer is normal) at the 18th green. " +
          "If you played 36 holes with the same caddy, double the tip. " +
          "If you have a great experience, mention the caddy by name at check-out — courses track caddy performance and good reviews matter.",
      },
    ],
    faqs: [
      {
        q: "Can I tip with USD or KRW?",
        a: "Some Pattaya and Hua Hin caddies accept USD; rare for KRW. Always prefer THB cash. Currency exchange in town is much better than at the course.",
      },
      {
        q: "What if I don't take a caddy?",
        a: "Almost all Thailand courses require a caddy — opting out is not usually possible. A few public courses and driving ranges allow walk-only or no-caddy play.",
      },
      {
        q: "Why do Korean tipping amounts differ?",
        a: "Korean tour groups historically tip more generously, and Korean-speaking caddies have built their economic model around that. If you're Korean and visiting independently, tipping at Korean rates is the expected courtesy.",
      },
    ],
    related: ["booking-thai-golf", "korean-golf-tour-thailand"],
  },
  {
    slug: "bangkok-vs-pattaya-golf",
    title: "Bangkok vs Pattaya for Golf — Which Should You Pick?",
    metaTitle: "Bangkok vs Pattaya Golf — Which Is Better? (2026 Guide)",
    metaDescription:
      "Comparing Bangkok and Pattaya as golf destinations: course quality, value, Korean tour scene, transport, what works for which traveler.",
    updated: "2026-05-06",
    intro:
      "Bangkok and Pattaya are Thailand's two biggest golf clusters and they appeal to different golfers. This guide breaks down the real differences and helps you pick.",
    sections: [
      {
        heading: "Course quality",
        body:
          "Bangkok wins on top-end depth — Alpine, Thai Country Club, Riverdale, Royal Gems are all in the same conversation as the world's good resort courses. " +
          "Pattaya has flagship courses (Siam CC Plantation, Laem Chabang International) but the cluster strength is in mid-tier and tour-group friendly courses rather than world-beaters.",
      },
      {
        heading: "Value",
        body:
          "Pattaya wins. Mid-tier rounds run ฿1,800-3,500 weekday vs Bangkok's ฿3,500+. Caddy and cart costs are similar. Hotel rates are 30-50% lower than Bangkok for similar quality. " +
          "Bangkok wins for premium-only travelers — the top 10 courses are unmatched.",
      },
      {
        heading: "Korean tour scene",
        body:
          "Pattaya is Korean tour central — densest concentration of Korean-speaking caddies, restaurants, accommodations. If you're booking through a Korean tour operator, you're going to Pattaya. " +
          "Bangkok has Korean infrastructure but golf-specific Korean is more concentrated in Pattaya.",
      },
      {
        heading: "Transport",
        body:
          "Bangkok area courses: 30-90 minutes from central Bangkok. BTS/MRT to airport rail makes this manageable for short trips. " +
          "Pattaya from Bangkok: 2-2.5 hours by car. Self-drive or arrange transfer through hotel/agency. Once in Pattaya, courses are 15-45 minutes apart.",
      },
      {
        heading: "Who should pick which",
        body:
          "Pick Bangkok if: top-tier course access matters; you only have 2-3 days and want city + golf combo; you're a foodie. " +
          "Pick Pattaya if: budget-conscious; want 3+ rounds in a few days; Korean tour traveler; want a beach/golf combo. " +
          "Best of both: 2 nights Bangkok (1-2 premium rounds) + 3 nights Pattaya (3-4 mid-tier rounds).",
      },
    ],
    faqs: [
      {
        q: "Can I day-trip from Bangkok to Pattaya for golf?",
        a: "Possible but exhausting. Add 4-5 hours of driving to the round. Better to stay overnight if you want to play multiple Pattaya courses.",
      },
      {
        q: "Which has better hotels for golfers?",
        a: "Bangkok wins on luxury hotels (Mandarin Oriental, Capella). Pattaya has better mid-tier value and golf-resort packages.",
      },
      {
        q: "What about Hua Hin as a third option?",
        a: "Different vibe — quieter, more upscale than Pattaya, premium courses (Black Mountain, Banyan). Better for couples and longer-stay golfers. 2.5 hours from Bangkok, similar drive time as Pattaya.",
      },
    ],
    related: ["booking-thai-golf", "green-fees-thailand", "korean-golf-tour-thailand"],
  },
  {
    slug: "thailand-golf-travel-guide",
    title: "Thailand Golf Travel Guide 2026 — Everything You Need to Know",
    metaTitle: "Thailand Golf Travel Guide 2026 — Complete Visitor's Handbook",
    metaDescription:
      "Complete Thailand golf travel guide: best courses, green fees, booking process, caddy tips, best time to visit, and destination comparisons — Bangkok, Pattaya, Hua Hin, Phuket, Chiang Mai.",
    updated: "2026-06-01",
    intro:
      "Thailand is one of the world's top golf destinations — 600+ courses, year-round playability, low green fees, and mandatory caddies who carry your bag and read your putts. This guide covers everything a first-time or returning visitor needs to plan a Thailand golf trip.",
    sections: [
      {
        heading: "Why play golf in Thailand?",
        body:
          "Value: premium championship courses cost ฿3,000–7,000 per round (all-in with caddy) — a fraction of equivalent US/European rates. Year-round access: tropical climate means some region is always in good condition. Service: mandatory caddies at every course carry your bag, read putts, rake bunkers, and spot shots — a luxury round by any standard. Course quality: major names have designed Thailand courses — Jack Nicklaus, Pete Dye, Robert Trent Jones Jr — and tournament-grade facilities are widespread. Bangkok, Pattaya, Hua Hin, Phuket, and Chiang Mai each have distinct character.",
      },
      {
        heading: "Best golf destinations in Thailand",
        body:
          "Bangkok: 80+ courses within 60 minutes of the city. Thai Country Club, Alpine Golf & Sports Club, Riverdale, Nikanti. Best for visitors who want city access + golf. Premium country clubs dominate; weekends fill fast.\n\nPattaya (Chon Buri, ~2h south): 25–30 courses, strongest Korean/Japanese tour infrastructure. Siam Country Club (3 layouts), Laem Chabang International, Phoenix Gold, Crystal Bay. Best for dedicated golf trips with multiple rounds.\n\nHua Hin (3h south): Thailand's original golf resort town. Black Mountain, Banyan, Springfield Royal (Jack Nicklaus). Most concentrated stay-and-play scene. Best for couples or leisure golfers wanting beach + golf.\n\nPhuket: Premium beach resort + golf. Blue Canyon Canyon Course (Thailand's #1), Laguna Phuket, Red Mountain, Mission Hills. Best for golfers pairing a beach holiday with 2–3 rounds.\n\nChiang Mai: Best dry-season value. Chiang Mai Highlands, Alpine Golf Resort Chiangmai (Jack Nicklaus). Cool November–February temperatures perfect for golf.",
      },
      {
        heading: "Green fees and costs",
        body:
          "Budget tiers: Public courses ฿1,500–3,000 weekday. Mid-range private ฿3,000–5,000 weekday. Premium country clubs ฿5,000–10,000+ weekday.\n\nAlways add: caddy fee ฿400 (mandatory), tip ฿400–600, cart ฿700–1,000 if not walking.\n\nAll-in realistic estimates: Budget round ฿2,500–4,500. Mid-range round ฿4,500–7,500. Premium round ฿7,500–13,000+.\n\nWeekend surcharges of 20–50% are common at popular courses. November–February is peak pricing; May–October discounts of 10–30% available.",
      },
      {
        heading: "How to book tee times",
        body:
          "Direct booking (cheapest): Course website or phone — best rates but limited English support. Call-ahead is always recommended.\n\nGolf agency (most convenient): Golfsavers, Sawasdee Golf, and GolfAsian bundle green fee + transfer + caddy coordination. Markup is 5–15% over direct but no logistics hassle.\n\nKlook: Good for one-off rounds at tourist-friendly courses. Real-time inventory, easy cancellation.\n\nHotel concierge: Best for first-timers — they handle all logistics with minimal friction.\n\nLead times: Bangkok/Pattaya weekends — book 1–2 weeks ahead in peak season. Weekdays — 1–3 days. Off-season (May–Sept) — often same day.",
      },
      {
        heading: "Best time to visit for golf",
        body:
          "November to February: peak season. Cool (22–30°C), dry, no rain. Best conditions — also busiest and most expensive. Book well ahead.\n\nMarch to May: hot and dry. Mornings are playable. Green fees stay high. Less crowded than peak.\n\nMay to October: green season. Morning rounds are reliable. Afternoon thunderstorms are common. Green fees 10–30% cheaper. Best value for flexible travelers.\n\nChiang Mai exception: November–February temperatures hit 18–25°C — the ideal golf climate in all of Southeast Asia.",
      },
      {
        heading: "Caddy culture and tipping",
        body:
          "Caddies are mandatory at almost all Thai courses. Your caddy carries your bag, rakes bunkers, reads greens, spots shots, and keeps score. Quality varies — top courses have well-trained English-speaking caddies.\n\nCaddy fee: ฿400 paid at the clubhouse. Tip: ฿400–600 (฿500–800 at premium clubs). Korean tour groups typically tip ฿600–1,000 for Korean-speaking caddies — this culture has pushed caddy tipping expectations up at Pattaya courses.\n\nFor Korean-speaking caddies: request when booking. Courses like Phoenix Gold (Pattaya), Lam Luk Ka (Bangkok), and Alpine have the strongest Korean-caddy supply.",
      },
    ],
    faqs: [
      {
        q: "Is Thailand a good golf destination?",
        a: "Yes — Thailand consistently ranks as one of Asia's top golf destinations. Over 600 courses, year-round playability, affordable green fees (compared to US/Europe), mandatory caddies at every course, and high-quality resort infrastructure. Peak destination for Korean, Japanese, and European golf tour groups.",
      },
      {
        q: "How much does a golf trip to Thailand cost?",
        a: "A 5-day / 4-round trip for one person based in Bangkok runs approximately USD 1,200–2,500 depending on hotel tier and course selection. Budget breakdown: flights (varies), hotel 5 nights USD 400–1,000, 4 rounds including caddy and cart USD 400–1,200, transfers and meals USD 200–400. Stay-and-play packages in Hua Hin and Phuket can reduce golf costs 25–40%.",
      },
      {
        q: "Do I need to be a skilled golfer to play in Thailand?",
        a: "No — Thailand has courses for all skill levels. Beginner-friendly public courses cost ฿1,500–2,500 per round. Many driving ranges and golf academies cater to learners. Championship courses require basic etiquette but no handicap certificate for visitor play at most venues.",
      },
      {
        q: "Can women play at Thailand golf courses?",
        a: "Yes — women are welcome at all public and resort courses. Dress code same as men: collared shirt, golf shorts or skirt, soft-spike shoes. Women's tee boxes are available at all courses. A few older private clubs have historical restrictions but these are rare.",
      },
      {
        q: "What's the best golf course in Thailand?",
        a: "Blue Canyon Country Club (Canyon Course, Phuket) consistently ranks as Thailand's #1 — host of multiple Asian Tour events. Siam Country Club Plantation Course (Pattaya) and Black Mountain Golf Club (Hua Hin) follow closely. For Bangkok, Thai Country Club, Alpine Golf & Sports Club, and Nikanti Golf Club lead by Trust Score.",
      },
    ],
    related: ["booking-thai-golf", "green-fees-thailand", "best-time-thailand-golf"],
    city_slugs: ["bangkok", "chon_buri", "prachuap_khiri_khan", "phuket", "chiang_mai"],
  },
  {
    slug: "thailand-golf-dress-code",
    title: "Thailand Golf Dress Code — What to Wear and Pack",
    metaTitle: "Thailand Golf Dress Code 2026 — What to Wear",
    metaDescription:
      "What to wear at Thailand golf courses: collared shirts, shorts vs pants, footwear, climate considerations, what won't pass at clubs.",
    updated: "2026-05-06",
    intro:
      "Thailand golf course dress codes are typically more relaxed than US private clubs but stricter than what tourists assume. Here's what's actually enforced.",
    sections: [
      {
        heading: "Universal requirements",
        body:
          "Collared shirt — polo style, mock collar acceptable. T-shirts, tank tops, and singlet shirts will be refused. " +
          "Golf shorts (above knee, mid-thigh) or golf pants. Cargo shorts and athletic shorts are usually fine but Bermuda-style golf shorts are safest. No denim, no swim trunks. " +
          "Soft spikes only — most courses enforce. Metal spikes have been universally banned since the 1990s.",
      },
      {
        heading: "Premium clubs (extra rules)",
        body:
          "Country clubs and flagship private courses may require: collared shirt tucked in, no shorts above the knee, golf-specific footwear (running shoes refused). " +
          "Royal Bangkok Sports Club, Royal Hua Hin, and a few similar heritage clubs have more formal codes — when in doubt, call ahead.",
      },
      {
        heading: "Climate considerations",
        body:
          "Year-round heat and humidity mean breathable performance fabrics matter. Cotton polos are fine but dry slowly. Golf-specific moisture-wicking polos pay off. " +
          "Sun protection: cap or visor mandatory in practice — UV is intense. Long-sleeve UV shirts (Adidas, Nike, Mizuno) are popular and accepted everywhere. " +
          "Towel for sweat (most caddies provide one, but bring a backup).",
      },
      {
        heading: "Packing list",
        body:
          "3-5 collared shirts (1 per round + 1 spare). " +
          "2 pairs golf shorts or pants. " +
          "1-2 pairs golf socks. " +
          "Soft-spike golf shoes (1 pair, well broken-in). " +
          "Cap and sunglasses. " +
          "Sunscreen (SPF 50+ — Thai sun is more intense than the US/Europe). " +
          "Golf glove (1 spare — humidity destroys gloves fast).",
      },
    ],
    faqs: [
      {
        q: "Can I wear a t-shirt to a Thailand golf course?",
        a: "No. Even cheap public courses enforce the collared shirt rule. Bring a polo just in case.",
      },
      {
        q: "Do I need golf-specific shoes?",
        a: "Soft-spike golf shoes preferred at all courses; required at premium clubs. Cross-trainers or running shoes are usually accepted at public courses but increasingly refused at country clubs.",
      },
      {
        q: "Is there a women's dress code?",
        a: "Same general rules — collared/golf shirt, golf shorts/skirt/pants. Some country clubs require skirts/pants below mid-thigh; sleeveless shirts accepted at most public courses but check at private clubs.",
      },
    ],
    related: ["booking-thai-golf", "green-fees-thailand"],
  },
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
