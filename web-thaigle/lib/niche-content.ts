// lib/niche-content.ts
import type { NicheSlug } from "@/lib/niches";

export type NicheFaq = { q: string; a: string };

export const NICHE_FAQS: Record<NicheSlug, NicheFaq[]> = {
  "muay-thai": [
    {
      q: "How much does Muay Thai training cost in Bangkok?",
      a: "Drop-in Muay Thai sessions in Bangkok typically cost ฿300–฿800 per class. Monthly packages range from ฿3,000–฿8,000. High-end training camps on Klook or GetYourGuide start at ฿600–฿1,200 for a 90-minute session including equipment. Prices are generally 50–70% cheaper than Western countries.",
    },
    {
      q: "Which is the best Muay Thai gym in Bangkok for beginners?",
      a: "For beginners, look for gyms with English-speaking trainers and beginner-friendly classes (marked on our listings). Top-rated beginner gyms include those with Trust Scores above 75 and explicit English instruction. Expect a 60–90 minute session mixing pad work, bag work, and technique drills.",
    },
    {
      q: "Is Muay Thai training in Bangkok safe for tourists?",
      a: "Yes, reputable gyms accommodate tourists daily. Beginners spar with other beginners only, never professionals. Gyms marked 'Beginner Friendly' on this site have been verified via Google reviews to welcome first-timers. Wear comfortable gym clothes; gloves and hand wraps are usually provided or rentable for ฿50–฿100.",
    },
    {
      q: "How many Muay Thai sessions per week should I do as a tourist?",
      a: "2–3 sessions per week is realistic for a short visit. Most gyms offer morning (6–8am) and afternoon (4–6pm) sessions. One session is enough to get a feel; a week of 2x/day is serious training. Many tourists book via Klook for a single experience session without commitment.",
    },
    {
      q: "Do Bangkok Muay Thai gyms teach in English?",
      a: "Most gyms frequented by tourists have English-speaking trainers or can communicate training in English. Look for the 🇬🇧 English badge on our listings. Gyms in tourist areas (Sukhumvit, Silom) are more likely to have English instruction than local neighborhood gyms.",
    },
  ],
  "spa": [
    {
      q: "How much does Thai massage cost in Bangkok?",
      a: "A 1-hour traditional Thai massage costs ฿200–฿400 at street-level shops, ฿500–฿1,200 at mid-range spas, and ฿1,500–฿3,000+ at luxury hotel spas. Oil massage and foot massage are priced similarly. Always tip 50–100 baht for good service at budget spas.",
    },
    {
      q: "What is the difference between Thai massage and oil massage?",
      a: "Traditional Thai massage (nuad boran) is a dry massage done clothed — the therapist uses hands, elbows, knees, and feet to compress and stretch your body. Oil massage uses massage oil and focuses on relaxation and muscle tension. Thai massage is more intense; oil massage is more relaxing. Most spas offer both.",
    },
    {
      q: "How long should a Thai massage session be?",
      a: "60 minutes is the standard and covers the full body. 90 minutes allows more thorough work on specific areas. 30-minute sessions exist but are usually foot massage only. For a first-time visitor, 90 minutes is recommended to experience the full sequence without rushing.",
    },
    {
      q: "Are Bangkok spas safe and hygienic?",
      a: "Licensed spas displaying the Thai Massage Standard certificate are regulated. For Google-reviewed spas with 100+ reviews and a rating above 4.5, hygiene complaints are rare in the reviews. Street-level massage shops vary — check Google reviews specifically for cleanliness mentions before booking.",
    },
    {
      q: "Which Bangkok spa areas have the best value?",
      a: "Silom and Sukhumvit Soi 38–55 have the densest concentration of quality spas at mid-range prices. Ari, Thong Lor, and Ekkamai have premium spas popular with expats. Yaowarat (Chinatown) has traditional Chinese-style massage at budget prices. Avoid spas directly on touristy streets like Khao San Road — prices are 50% higher for lower quality.",
    },
  ],
  "wellness": [
    {
      q: "What wellness experiences are popular in Bangkok?",
      a: "Bangkok's wellness scene includes float tanks, infrared sauna, cryotherapy, traditional Thai herbal treatments, detox programs, and meditation retreats. Many gyms and wellness centers offer day passes covering multiple facilities. Wellness centers in Thong Lor and Silom cater to expats with international standards.",
    },
    {
      q: "How much do wellness centers cost in Bangkok?",
      a: "Day passes to wellness centers range from ฿500–฿2,000 depending on facilities. Single treatments like float tanks cost ฿1,200–฿2,500/hour. Infrared sauna sessions are ฿300–฿800. Detox programs (juice, herbal) range from ฿800–฿3,000/day. Prices are generally 30–50% lower than equivalent Western facilities.",
    },
    {
      q: "Are there English-speaking wellness centers in Bangkok?",
      a: "Yes — most wellness centers targeting expatriates and tourists operate in English. Facilities in Thong Lor, Ari, and Sukhumvit areas commonly have English-speaking staff. Look for the 🇬🇧 English badge on our listings to filter English-friendly options.",
    },
    {
      q: "What is a good wellness itinerary for a week in Bangkok?",
      a: "A balanced week: Morning yoga or Muay Thai (Mon/Wed/Fri), Thai massage 2x/week (Tue/Thu), one float tank or infrared sauna session on the weekend, and one cooking class for mindful eating. Most activities can be booked day-before or same-day outside peak season (Dec–Feb).",
    },
  ],
  "yoga-pilates": [
    {
      q: "How much is yoga class in Bangkok?",
      a: "Drop-in yoga classes in Bangkok cost ฿400–฿800. Monthly unlimited memberships range from ฿2,500–฿8,000 depending on the studio. Many studios offer introductory 1-week passes for ฿800–฿1,500 for tourists. Hot yoga and aerial yoga studios tend to be at the higher end.",
    },
    {
      q: "Are there drop-in yoga classes in Bangkok?",
      a: "Yes — most Bangkok yoga studios accept walk-in students for drop-in classes. Booking online or via LINE is recommended for popular morning and evening slots. Studios in Thong Lor, Ekkamai, and Ari have the most foreigner-friendly timetables with English instruction.",
    },
    {
      q: "What style of yoga is most popular in Bangkok?",
      a: "Vinyasa and Hatha are the most common styles. Hot yoga (Bikram and custom hot rooms) is extremely popular in Bangkok's fitness culture. Ashtanga and Yin yoga are widely available too. Aerial yoga has grown significantly in the past few years. Pilates Reformer studios are increasingly common in upscale neighborhoods.",
    },
    {
      q: "Can I do yoga in Bangkok as a complete beginner?",
      a: "Absolutely. Most studios offer beginner and 'all levels' classes clearly marked on their schedules. Thai yoga teachers are known for being accommodating and attentive to form. Look for studios with 'Beginner Friendly' badge on our listings.",
    },
  ],
  "cooking": [
    {
      q: "How much does a Thai cooking class in Bangkok cost?",
      a: "Half-day cooking classes cost ฿800–฿1,800 per person. Full-day classes with market visit cost ฿1,500–฿3,500. Private classes run ฿2,500–฿6,000. Classes via Klook often include transport and are priced competitively. Most classes include 3–5 dishes plus written recipes.",
    },
    {
      q: "Should I take a half-day or full-day cooking class in Bangkok?",
      a: "Half-day (3–4 hours) is sufficient for most tourists — you learn 3–4 core Thai dishes, cook them, and eat. Full-day classes add a market tour (often Or Tor Kor Market), giving cultural context. If you only have time for one, half-day is the better value. Full-day is worth it if you're serious about Thai cuisine.",
    },
    {
      q: "What dishes will I learn in a Bangkok cooking class?",
      a: "Most classes teach: Pad Thai, Tom Yum soup, Green Curry, Som Tam (papaya salad), and Mango Sticky Rice. Some classes specialize in Northern Thai, street food, or vegetarian dishes. Ask the school for their current menu before booking if you have preferences.",
    },
    {
      q: "Are Bangkok cooking classes suitable for vegetarians?",
      a: "Most reputable cooking schools accommodate vegetarians with advance notice. Some have dedicated vegetarian menus. Check the listing or contact the school directly — our listings include schools with vegetarian options where noted.",
    },
  ],
  "coworking": [
    {
      q: "How much is coworking space in Bangkok per day?",
      a: "Day passes at Bangkok coworking spaces cost ฿250–฿600. Hot desk monthly memberships run ฿3,500–฿8,000. Dedicated desks are ฿6,000–฿15,000/month. Private offices vary widely. High-speed WiFi (100Mbps+), air conditioning, and coffee/tea are standard. Many cafés also function as informal coworking spaces for ฿100–฿200 (cost of a drink).",
    },
    {
      q: "Which areas of Bangkok are best for coworking?",
      a: "Ari and Phahon Yothin have the best concentration of quality coworking spaces popular with digital nomads. Sukhumvit (Asoke to Ekkamai) has options close to BTS. Silom is good for corporate-leaning spaces. Avoid Khao San Road area — WiFi is unreliable and environment is noisy.",
    },
    {
      q: "Does Bangkok have 24-hour coworking spaces?",
      a: "Several coworking spaces in Bangkok operate 24/7, particularly in Sukhumvit. Check the '24h' badge on our listings. Alternatively, many 24-hour McDonald's and some cafés (like some Starbucks) are used by night-owl workers, though with less reliable connectivity.",
    },
    {
      q: "Is Bangkok a good city for digital nomads?",
      a: "Bangkok consistently ranks in the top 10 global digital nomad cities. Fast, cheap internet (True Move H and AIS 5G), affordable living, excellent food, and year-round warmth make it popular. Visa options include the Thailand LTR Visa (Long-Term Resident) for remote workers.",
    },
  ],
  "diving": [
    {
      q: "Can you go diving near Bangkok?",
      a: "Bangkok itself is inland, but several dive sites are within reach: Koh Larn (1.5h by boat from Pattaya, 2h from Bangkok), Koh Sichang, and various Gulf of Thailand islands. Most Bangkok-based dive operators offer day trips to Pattaya waters or packages to Koh Tao (overnight). Dive visibility near Bangkok is 3–10m; better visibility requires Koh Tao or Similan Islands.",
    },
    {
      q: "How much does a PADI dive course cost in Bangkok?",
      a: "PADI Open Water certification in the Bangkok/Pattaya area costs ฿8,000–฿15,000 for the full course (pool + 4 open water dives). Advanced Open Water is ฿8,000–฿12,000. Discover Scuba single dives cost ฿1,500–฿3,000 for a first experience. Prices on Koh Tao (Thailand's dive mecca) are lower — ฿7,000–฿10,000 for Open Water.",
    },
    {
      q: "What marine life can you see diving near Bangkok?",
      a: "Gulf of Thailand dive sites near Bangkok feature: reef fish (parrotfish, angelfish, triggerfish), moray eels, sea turtles, seahorses, and occasional leopard sharks. Visibility and species variety improve significantly at Koh Tao and the Similan Islands. Best visibility season: November–April.",
    },
    {
      q: "Do I need diving experience to try diving in Bangkok?",
      a: "No. 'Discover Scuba' intro experiences require no prior certification. A certified instructor supervises you throughout the dive. Most operators offer this for ฿1,500–฿2,500 for a 20-30 minute guided dive in shallow water. It's the recommended starting point before committing to a full PADI course.",
    },
  ],
};

/**
 * Hub headline and standfirst, per niche.
 *
 * `subject` rather than a whole headline, and a `sub` that carries no count:
 * both the place and the number have to come from the data the page is
 * actually rendering. The previous version hardcoded them and every one had
 * drifted — each headline said "in Bangkok" for niches that are half
 * upcountry (spa is 51% Bangkok, cooking 43%), and the subs claimed "296
 * classes" against 264 real pages, "284 studios" against a different number
 * again. The page composes `Best {subject} in {scope}` from cityScopeLabel()
 * and prints the qualifying count itself, so neither can drift again.
 */
export const NICHE_INTRO: Record<NicheSlug, { subject: string; sub: string }> = {
  "muay-thai": {
    subject: "Muay Thai Gyms",
    sub: "Train where locals train — ranked by real Google reviews, no tourist traps.",
  },
  "spa": {
    subject: "Spas & Thai Massage",
    sub: "From ฿200 street massage to premium wellness retreats, ranked by verified reviews.",
  },
  "wellness": {
    subject: "Wellness Centers",
    sub: "Float tanks, infrared sauna, meditation, detox — ranked by real reviews.",
  },
  "yoga-pilates": {
    subject: "Yoga & Pilates Studios",
    sub: "Drop-in classes, monthly memberships and hot yoga, ranked by real reviews.",
  },
  "cooking": {
    subject: "Thai Cooking Classes",
    sub: "Learn to cook Pad Thai, Green Curry and more — ranked by the travellers who took them.",
  },
  "coworking": {
    subject: "Coworking Spaces",
    sub: "Fast WiFi, good coffee, real aircon — ranked for digital nomads and expats.",
  },
  "diving": {
    subject: "Diving",
    sub: "Day trips, PADI courses and snorkeling — ranked by real divers.",
  },
};
