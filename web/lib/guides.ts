// Bangkok aesthetic clinic guide articles — long-form AEO/SEO content.

export type Faq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: Faq[];
  related?: string[];
  updated: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "bangkok-botox-guide",
    title: "Bangkok Botox Guide — What You'll Pay & How to Pick (2026)",
    metaTitle: "Bangkok Botox Guide 2026 — Pricing, Brands, Best Clinics",
    metaDescription:
      "Bangkok botox pricing in 2026, how to verify genuine Allergan/Dysport/Botulax, and choosing English-speaking clinics. Verified review-backed picks.",
    updated: "2026-05-07",
    intro:
      "Bangkok is the cheapest major-city destination for genuine botox — but knowing how to spot fake or diluted product is the difference between a great deal and a wasted trip. This guide walks through the brands, the pricing, and how our Trust Score helps filter the noise.",
    sections: [
      {
        heading: "Genuine brands available in Bangkok",
        body:
          "Allergan (USA) — the original. Most expensive (฿4,500-7,000/area), most predictable. " +
          "Dysport (UK) — close second. Slightly faster onset. ฿3,500-5,500/area. " +
          "Botulax (Korea) — Korean botulinum toxin, very popular for tour clients. ฿2,500-4,000/area. " +
          "Xeomin (Germany) — \"naked\" botox without complexing proteins. ฿4,000-6,000/area. " +
          "Avoid: unbranded \"vials\" and prices significantly below the above ranges.",
      },
      {
        heading: "How clinics fake genuine product",
        body:
          "Common scams: serving Botulax priced as Allergan; diluting authentic vials with saline (\"baby botox\" packaged as full strength); reusing vial labels. " +
          "Defenses: ask to see the unopened vial before injection. Verify the vial against the brand's anti-counterfeit features (Allergan has a hologram). " +
          "Read review patterns — clinics with multiple complaints about \"weak result\" or \"didn't last 3 months\" are flagged in our Trust Score.",
      },
      {
        heading: "Where to go (and what reviewers actually say)",
        body:
          "Sukhumvit / Phrom Phong — high concentration of premium clinics targeting Korean and Singaporean tourists. Higher prices but stronger English support. " +
          "Pratunam — value tier. More volume, less ambiance. Korean tour group friendly. " +
          "Silom / Sathon — established medical district. Older clinics with long track records. " +
          "Our Trust Score combines Google rating, review volume, and Local Guide reviewer ratio — heavily weights established clinics over fly-by-night ones.",
      },
      {
        heading: "Practical visit timeline",
        body:
          "Day 1: consultation (free at most clinics). " +
          "Day 1-2: procedure (15-30 min). No downtime. " +
          "Day 3-5: onset of effect. " +
          "Day 7-10: peak effect. Don't book a follow-up earlier than this. " +
          "Total trip duration for a botox visit: 4-7 days minimum if you want to see result before flying out.",
      },
    ],
    faqs: [
      {
        q: "How much does botox cost in Bangkok vs Korea/USA?",
        a: "Bangkok premium clinic: ฿4,500-7,000/area = $130-200 USD. Same Allergan in Korea: $250-400. USA: $350-600. Bangkok is typically 50-70% of US pricing for the same genuine product.",
      },
      {
        q: "Can I trust 'Korean doctor' marketing?",
        a: "Sometimes. Some clinics employ actual Korean-trained doctors; others just use Korean branding. Check the doctor's medical board registration and whether they're physically there during your visit. Trust Score weights reviewer mentions of specific doctors.",
      },
      {
        q: "Should I do botox same day as filler?",
        a: "Possible but not recommended for first-time visitors. Botox + filler same day = harder to assess what caused which result. Spread over 2 visits if your trip allows.",
      },
    ],
    related: ["bangkok-filler-guide", "korean-medical-tourism"],
  },
  {
    slug: "bangkok-filler-guide",
    title: "Bangkok Filler Guide — HA, Juvederm, Restylane (2026)",
    metaTitle: "Bangkok Dermal Fillers 2026 — Pricing, Brands, Best Clinics",
    metaDescription:
      "Bangkok HA filler pricing — Juvederm, Restylane, Belotero. How to verify genuine product, what to expect by area (lip, cheek, jawline, under-eye).",
    updated: "2026-05-07",
    intro:
      "Bangkok HA filler pricing is roughly half of Korean and Singapore prices for genuine Allergan/Galderma product. The complexity is matching the right product to the right area — and avoiding clinics that overfill.",
    sections: [
      {
        heading: "Brands and where to use them",
        body:
          "Juvederm (Allergan, USA) — Volift / Voluma / Volbella series. Most premium. ฿14,000-22,000/syringe. " +
          "Restylane (Galderma) — Lyft / Defyne / Refyne series. Comparable quality, often slightly cheaper. ฿12,000-18,000. " +
          "Belotero (Merz) — softer, good for fine lines and tear trough. ฿11,000-15,000. " +
          "Korean brands (Neuramis, Yvoire) — ฿8,000-12,000. Quality has caught up; better-value picks. " +
          "Korean tour clients often opt for Korean brands; expat / Western clients trend Juvederm.",
      },
      {
        heading: "Areas + cost reality",
        body:
          "Lip enhancement: 1 syringe = 1ml = full lips. ฿14,000-20,000 typical. " +
          "Cheek augmentation: 2-3ml. ฿28,000-50,000. " +
          "Jawline / chin: 2-4ml. ฿28,000-65,000. " +
          "Tear trough (under-eye): 1ml carefully. ฿15,000-22,000. Highest-skill area — pick experienced clinic. " +
          "Nose (non-surgical rhinoplasty): 1-2ml. ฿18,000-35,000.",
      },
      {
        heading: "Red flags",
        body:
          "Prices below ฿8,000/ml for branded HA = product likely not what's claimed. " +
          "Doctor not present during procedure = cannot do it in Thailand legally. " +
          "Overpromising natural look on extreme volume requests. " +
          "Trust Score on this site flags clinics with frequent reviewer mentions of overfilled or asymmetric results.",
      },
    ],
    faqs: [
      {
        q: "Do filler results last in Bangkok heat?",
        a: "HA filler degradation is metabolic, not heat-related. Lasts 6-18 months depending on area and product. Bangkok heat doesn't shorten longevity.",
      },
      {
        q: "Can I dissolve filler if I don't like it?",
        a: "Yes — hyaluronidase enzyme dissolves HA filler in 24-48 hours. Most reputable clinics offer this service ฿3,000-6,000. Always confirm the clinic stocks hyaluronidase before booking.",
      },
    ],
    related: ["bangkok-botox-guide", "korean-medical-tourism"],
  },
  {
    slug: "korean-medical-tourism",
    title: "Korean Medical Tourism in Bangkok — What Tour Packages Cover",
    metaTitle: "Bangkok Medical Tourism Korean — Packages, Pricing 2026",
    metaDescription:
      "How Korean medical tourism packages to Bangkok work. What's included, typical pricing, language support — plus when going independent saves money.",
    updated: "2026-05-07",
    intro:
      "Bangkok hosts a large Korean medical tourism flow centered on aesthetics. Packages from Korean travel agencies bundle hotel + transfer + clinic visit at a markup that's worthwhile for first-timers but skippable once you know the system.",
    sections: [
      {
        heading: "What packages typically include",
        body:
          "3-5 day trip: airport transfer, 4-star hotel near Sukhumvit, clinic transport, Korean-speaking interpreter, post-procedure follow-up. " +
          "Procedures: typically 1-3 from botox / filler / HIFU / laser / facial menu. " +
          "Total package: ₩2,500,000-5,000,000 ($1,800-3,700) depending on procedure scope.",
      },
      {
        heading: "Independent vs package",
        body:
          "First trip: package wins. Language, logistics, interpreter all handled. " +
          "Second trip onwards: book direct. Same procedures often 30-40% cheaper. " +
          "Hotel: book separately on Booking.com (often 50% cheaper than package rate). " +
          "Transfer: Grab from BKK ฿400-700, vs ฿2,000+ package transfer.",
      },
      {
        heading: "Korean-speaking clinics",
        body:
          "Many top Bangkok aesthetic clinics have Korean-speaking staff (counter, sometimes nurses). Rare to find Korean-speaking doctors, but not necessary — quality of injection technique matters more than chitchat. " +
          "Trust Score on our site flags clinics with high Korean reviewer counts as Korean-friendly defaults.",
      },
    ],
    faqs: [
      {
        q: "한국 의료관광 패키지는 안전한가요?",
        a: "큰 에이전시 (한진관광, 모두투어 의료관광) 통해서 가는 건 보통 안전합니다. 클리닉이 검증된 곳들이고 한국어 통역 보장. 작은 에이전시는 클리닉 수수료 받아서 자기네 제휴 클리닉만 추천하는 경우가 있어요.",
      },
      {
        q: "패키지 가격이 직접 예약보다 비싼가요?",
        a: "네, 보통 30-40% 비쌉니다. 첫 방문이면 편의성 값을 한다고 보고, 재방문이면 직접 예약이 훨씬 경제적입니다. 우리 사이트의 Trust Score로 클리닉 직접 선택해서 호텔 따로 예약하면 비슷한 시술을 더 저렴하게 받을 수 있어요.",
      },
    ],
    related: ["bangkok-botox-guide", "bangkok-filler-guide"],
  },
  {
    slug: "trust-score-explained",
    title: "Our Trust Score, Explained — How We Rank 2,000+ Bangkok Clinics",
    metaTitle: "Trust Score Explained — How Bangkok Clinics Are Ranked",
    metaDescription:
      "We rank 2,000+ Bangkok clinics by a Trust Score derived from Google review analysis: rating, volume, Local Guide credibility, reviewer authority. Full methodology.",
    updated: "2026-05-09",
    intro:
      "A clinic's star rating tells you almost nothing on its own. A 4.9 with 12 reviews is far less reliable than a 4.5 with 800 reviews. Our Trust Score combines four signals to surface clinics with both quality and statistical credibility — so you don't have to manually triangulate yourself.",
    sections: [
      {
        heading: "The four signals",
        body:
          "Rating (50% weight) — straight Google star average × 50. A clinic averaging 4.5 contributes 45 points here. " +
          "Volume (40% weight, capped) — log10(review_count) × 12, capped at 40. A clinic with 100 reviews gets 24 points; 1,000 gets 36; 10,000 gets 40 (max). The log scale makes 100 → 1,000 a meaningful jump while preventing 10,000-review clinics from running away with the score. " +
          "Local Guide ratio (10% weight) — fraction of scraped reviewers who are Google Local Guides × 20, capped at 10. Local Guides have written enough reviews that Google has verified their identity and their reviews are weighted more heavily by Google's own algorithms. " +
          "Reviewer authority (5% weight) — log10(average reviews-per-reviewer) × 2, capped at 5. Bonus for clinics whose reviewers themselves write a lot of reviews on Google overall (more credibility, less likely to be a one-off complaint).",
      },
      {
        heading: "Why this beats raw star rating",
        body:
          "Star rating is naive. A clinic with five 5-star reviews from staff or family will outscore a clinic with 800 honest 4.6-star reviews — even though the second is far more reliable for a real patient. " +
          "Volume alone is also wrong: a 200-review 3.8-star clinic isn't \"better\" than a 50-review 4.8 just because it has more reviews. " +
          "Trust Score combines them with diminishing returns and credibility weighting. The result: clinics in our top 10% are statistically the most reliable bets in Bangkok, regardless of marketing budget.",
      },
      {
        heading: "What the score does not measure",
        body:
          "Price. We don't yet pull pricing data, so a low-Trust-Score clinic may still be the right call if you're price-shopping a routine procedure. " +
          "Specialty fit. The score is general-purpose. A clinic might be world-class for fillers but mediocre for HIFU — our category labels help here, but always read recent reviews on the specific procedure. " +
          "Recency. We have a separate \"rating trend\" signal (improving / stable / declining) — check it before booking, since a 5-year-old clinic with a 2024 management change may be on a different trajectory than its all-time average suggests.",
      },
      {
        heading: "How to use the score in practice",
        body:
          "1. Filter to category — pick service (botox, filler, HIFU, etc.). " +
          "2. Filter to district — narrows to where you'll actually be. " +
          "3. Look at top 5 by Trust Score (not by star rating alone). " +
          "4. Check rating trend on each — \"declining\" is a yellow flag, \"improving\" worth a closer look. " +
          "5. Read the latest 5-10 English reviews on the clinic page (we extract sample reviews automatically). " +
          "6. Confirm the doctor and clinic location on Google Maps before booking.",
      },
    ],
    faqs: [
      {
        q: "What's a 'good' Trust Score?",
        a: "75+ is solid. 85+ is top-decile. Below 50 means there's a real reason to dig into recent reviews before booking — often low review volume, declining trend, or both. Don't assume below 50 = bad clinic; assume below 50 = needs more research.",
      },
      {
        q: "Can clinics pay to inflate their Trust Score?",
        a: "No. The score is computed deterministically from public Google review data. We do offer paid Featured/Editor's Pick slots that show with a coloured badge above organic results, but those slots do not modify Trust Score and are clearly labelled.",
      },
      {
        q: "Why do some clinics have a 0 Trust Score?",
        a: "We require at least 5 reviews to compute a score. Clinics with under 5 reviews are listed but excluded from rankings — too little data to score reliably.",
      },
      {
        q: "How often is the score recomputed?",
        a: "Every 5 minutes the underlying dataset rebuilds from fresh review scrapes; the website redeploys on data change. So a clinic that gets a wave of new reviews will see its score update within an hour.",
      },
    ],
    related: ["bangkok-botox-guide", "bangkok-filler-guide", "korean-medical-tourism"],
  },
  {
    slug: "verifying-clinic-before-booking",
    title: "How to Verify a Bangkok Clinic Before You Book — 7-Step Checklist",
    metaTitle: "Verify a Bangkok Clinic Before Booking — 7-Step Checklist",
    metaDescription:
      "Before paying a deposit at a Bangkok clinic, run this 7-step verification: license, doctor presence, genuine product, equipment, reviews patterns, and red flags.",
    updated: "2026-05-09",
    intro:
      "Most fly-in patients pay a 30-50% deposit before flying. Half the bad-experience stories online started with skipping the basic vetting steps that take 30 minutes. Run this checklist before sending any money.",
    sections: [
      {
        heading: "Step 1 — Verify the medical license (5 min)",
        body:
          "Thai aesthetic clinics must register with the Department of Health Service Support (สบส., or HSS). The clinic's license number is supposed to be displayed at the entrance and on official documents. " +
          "If they refuse to share the license number, walk away. If they share it, search it on the HSS public registry. License lookup is free; takes 2 minutes.",
      },
      {
        heading: "Step 2 — Confirm the actual doctor performs the procedure",
        body:
          "Many \"famous Korean doctor\" clinics use the doctor's name in marketing but have a junior physician do the actual injection. Always ask: 'Will Dr. X personally perform the procedure?' Get it in writing if possible. " +
          "If the answer is 'one of our team' or 'depends on the day', that's not necessarily wrong — but you should adjust your expectations and price accordingly. The brand-name doctor's price reflects experience that the junior doesn't have.",
      },
      {
        heading: "Step 3 — Read recent reviews (last 60 days), not all-time",
        body:
          "All-time star averages can mask a recent decline (management change, doctor turnover, sale of the clinic). " +
          "Sort Google Maps reviews by 'Newest' and read the last 60 days. Any cluster of 3-star or below reviews around the same complaint = current operational problem. Our rating-trend signal flags this; check the clinic page before booking.",
      },
      {
        heading: "Step 4 — Verify genuine product on injection day",
        body:
          "Ask to see the unopened vial before they reconstitute it. Look for: brand hologram (Allergan has a unique iridescent hologram), batch number that matches the box, expiry date well in the future. " +
          "For dermal fillers, the syringe must be sealed in the original Galderma/Allergan packaging. Reconstitution should happen in front of you. If they bring out a pre-loaded syringe, that's a red flag.",
      },
      {
        heading: "Step 5 — Check equipment certification for HIFU/laser",
        body:
          "HIFU machines vary wildly — Ulthera (FDA approved), Doublo, Ultraformer, plus dozens of Chinese/Korean clones at much lower price-per-shot. " +
          "The clinic should be able to tell you the model and show you the FDA-cleared sticker on the device. If they evade the question, the machine is probably a knock-off — which doesn't always mean ineffective, but means the price should reflect that.",
      },
      {
        heading: "Step 6 — Get pricing in writing before deposit",
        body:
          "Confirm: total price including consultation, anesthetic, post-care products, follow-up visits. Confirm what brand/units. Confirm refund policy if you're not satisfied (usually none, but knowing matters). " +
          "Email or LINE message documentation > verbal promises. Bangkok clinics will sometimes price-up on the day if the consultation 'reveals additional needs'. Lock the price first.",
      },
      {
        heading: "Step 7 — Red flags that should immediately disqualify",
        body:
          "Pressure tactics ('only this week!', 'special price for you only'). " +
          "Inability to produce license number. " +
          "Reluctance to show the unopened vial. " +
          "No physical address or only a hotel-room consultation. " +
          "Reviews mentioning bait-and-switch (price changed at the clinic vs. quoted online). " +
          "Trust Score under 50 combined with declining rating trend. Any one of these = pass. Multiple = run.",
      },
    ],
    faqs: [
      {
        q: "Is it safe to book a Bangkok clinic from abroad without visiting first?",
        a: "Generally yes for established clinics with strong Trust Scores (75+) and recent positive reviews. Pay only the deposit before flying; pay the balance only after the consultation in person. Don't pre-pay full procedure cost.",
      },
      {
        q: "What's a reasonable deposit?",
        a: "10-30% is industry standard. Anyone asking for full payment in advance is high risk — there's no real reason a clinic needs the full amount before you're physically there.",
      },
      {
        q: "What if the clinic is great but the procedure result is bad?",
        a: "Most reputable Bangkok clinics offer free touch-ups within 14 days (botox, filler dissolving, HIFU re-shot). Confirm this before booking. Document any unexpected outcome immediately with photos and message the clinic via LINE — written communication beats verbal.",
      },
      {
        q: "Should I trust influencers' clinic recommendations?",
        a: "Most Korean and Thai influencer recommendations are paid placements (declared or not). Use them as a starting list, then verify each with our Trust Score and the steps above. A clinic that pays for influencer marketing isn't disqualifying — but it shouldn't be the reason you choose them.",
      },
    ],
    related: ["trust-score-explained", "bangkok-botox-guide", "bangkok-filler-guide"],
  },
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
