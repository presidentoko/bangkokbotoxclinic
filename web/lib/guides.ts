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
  // 어떤 사이트(focus)에서 보여줄지. 없으면 모든 사이트에 노출(general).
  // 사이트별 mismatched 가이드 노출 방지 (dental에 botox 가이드 X).
  focusTags?: ("botox" | "filler" | "hifu" | "facial" | "laser" | "dental" | "hair")[];
};

export const GUIDES: Guide[] = [
  {
    slug: "bangkok-botox-guide",
    focusTags: ["botox", "filler"],
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
    focusTags: ["filler", "botox"],
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
    focusTags: ["botox", "filler", "hifu", "facial", "laser", "hair"],
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
    title: "Our Trust Score, Explained — How Clinics Are Ranked",
    metaTitle: "Trust Score Explained — How Clinics Are Ranked",
    metaDescription:
      "We rank clinics by a Trust Score derived from Google review analysis: rating, volume, Local Guide credibility, reviewer authority. Full methodology.",
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
  // ── Dental guides ──────────────────────────────────────────────────────────
  {
    slug: "dental-implants-bangkok-cost",
    focusTags: ["dental"],
    title: "Dental Implants in Bangkok — Cost, Brands & What to Expect (2026)",
    metaTitle: "Dental Implants Bangkok Cost 2026 — Brands, Clinics & Timeline",
    metaDescription:
      "Dental implant costs in Bangkok 2026: Straumann ฿55,000–80,000, Osstem ฿35,000–55,000. How to pick a clinic, which brands to insist on, and the full treatment timeline for medical tourists.",
    updated: "2026-06-03",
    intro:
      "Bangkok is one of the world's most popular destinations for dental implants — 50–70% cheaper than the US or UK, with clinics that hold international accreditations and use the same Swiss or Korean implant brands as Western practices. This guide covers what you'll pay, which brands matter, and how to plan your trip.",
    sections: [
      {
        heading: "What dental implants cost in Bangkok (2026)",
        body:
          "A single-tooth implant fully restored (titanium post + abutment + crown) ranges from ฿35,000 to ฿80,000 depending on the implant brand. " +
          "Premium tier — Straumann (Switzerland) and Nobel Biocare (Sweden): ฿55,000–80,000. Most established, 10-year clinical data, preferred for anterior (visible) teeth. " +
          "Mid tier — Osstem (Korea) and Astra Tech (Sweden): ฿35,000–55,000. Strong evidence base, widely used in Asia. Excellent value for posterior molars. " +
          "Budget tier — generic/unbranded: under ฿30,000. Avoid. Long-term failure rates 2–3× higher with unknown implant systems. " +
          "All-on-4 (full arch implant bridge): ฿250,000–500,000 per arch. Compare: US $20,000–35,000 per arch.",
      },
      {
        heading: "Treatment timeline for medical tourists",
        body:
          "Trip 1 (3–5 days): consultation, CBCT scan, extraction if needed, implant placement. You return home for osseointegration. " +
          "Osseointegration period: 3–6 months (bone bonds to titanium — you are home, no clinic visits needed). " +
          "Trip 2 (2–3 days): abutment placement, crown fitting, bite adjustment. Most patients complete this in a single follow-up visit. " +
          "Immediate-load option: some Bangkok clinics offer same-week crown loading (฿15,000–25,000 surcharge) for patients with strong bone density — avoids a second trip. Ask your clinic to review your CBCT scan before deciding. " +
          "All-on-4 can often be completed in a single 5–7 day trip with provisional teeth on day 1.",
      },
      {
        heading: "How to verify a dental clinic in Bangkok",
        body:
          "Check the Thai Dental Council (ทันตแพทยสภา) registration — ask the clinic for their license number. " +
          "International accreditations to look for: JCI (Joint Commission International), ISO 9001, BDMS group membership. " +
          "Implant brand verification: ask to see the sealed implant packaging before surgery. Genuine Straumann packaging has a QR code and batch number. " +
          "Trust Score 75+ on this site indicates strong reviewer credibility across Google Maps and medical tourism platforms. " +
          "English-speaking staff: most clinics in Sukhumvit, Silom, and Asok are accustomed to international patients. Video consultation available at top clinics before you fly.",
      },
      {
        heading: "Bangkok vs Korea vs Turkey for implants",
        body:
          "Bangkok: ฿35,000–80,000 per tooth. Strong English-language support, familiar Western-style clinics, tourism infrastructure. No language barrier at top clinics. " +
          "Korea (Seoul): ฿60,000–120,000 per tooth. Excellent technology, stronger for Korean-speaking patients, more complex logistics for English-only visitors. " +
          "Turkey (Istanbul): ฿25,000–55,000 per tooth. Price competitive but more variance in quality; English-support patchy outside main tourist clinics. " +
          "Bangkok advantage: proximity for SEA and Australian patients, no visa hassle for most nationalities, strong tourism infrastructure, and 1,600+ dental clinics to choose from with real English reviews on Google Maps.",
      },
    ],
    faqs: [
      {
        q: "How much does a dental implant cost in Bangkok?",
        a: "Single-tooth implant (post + abutment + crown): ฿35,000–80,000 depending on brand. Straumann/Nobel Biocare (premium Swiss/Swedish): ฿55,000–80,000. Osstem/Astra (mid-range Korean/Swedish): ฿35,000–55,000. All-on-4 full arch: ฿250,000–500,000 per arch.",
      },
      {
        q: "How many trips do I need for dental implants in Bangkok?",
        a: "Typically two trips: Trip 1 (implant placement, 3–5 days) + 3–6 months healing at home + Trip 2 (crown fitting, 2–3 days). Some clinics offer same-week immediate-load implants for an extra ฿15,000–25,000, skipping the second trip if your bone density qualifies.",
      },
      {
        q: "Which implant brand should I insist on?",
        a: "Straumann (Switzerland) and Nobel Biocare (Sweden) are the gold standard — most peer-reviewed data, best osseointegration rates, recognized globally if you need future work done. Osstem (Korea) and Astra Tech are strong mid-tier alternatives. Always ask to see the sealed implant box before surgery.",
      },
      {
        q: "Is it safe to get dental implants in Thailand?",
        a: "Yes, at accredited clinics. Look for: Thai Dental Council registration, JCI/ISO accreditation, Trust Score 75+, and reviewers specifically mentioning the implant brand. Thailand has no shortage of internationally-trained implantologists — many completed post-graduate training in the US, Europe, or Korea.",
      },
    ],
    related: ["veneers-bangkok-price", "verifying-clinic-before-booking"],
  },
  {
    slug: "veneers-bangkok-price",
    focusTags: ["dental"],
    title: "Veneers in Bangkok — Price, E.max vs Composite & Best Clinics (2026)",
    metaTitle: "Veneers Bangkok Price 2026 — Porcelain, E.max, Composite Guide",
    metaDescription:
      "Bangkok veneer prices 2026: porcelain ฿12,000–30,000 per tooth, composite ฿4,000–8,000. E.max CAD/CAM same-day option. How to choose material and clinic for a smile makeover.",
    updated: "2026-06-03",
    intro:
      "A full smile makeover with 8 upper veneers costs ฿100,000–240,000 in Bangkok — versus $15,000–25,000 in the US or UK for comparable porcelain work. Bangkok's leading cosmetic dentists train internationally and use the same E.max or Lava materials as Western practices. Here's what to know before you book.",
    sections: [
      {
        heading: "Veneer types and Bangkok pricing",
        body:
          "Porcelain veneers (lab-fabricated): ฿12,000–30,000 per tooth. Most natural-looking; requires 2 visits minimum (preparation + bonding). Lifespan 10–20 years. " +
          "E.max veneers (CAD/CAM ceramic): ฿15,000–35,000 per tooth. Milled in-clinic from a single ceramic block; stronger and more stain-resistant than traditional porcelain. Many Bangkok clinics offer same-day single-visit E.max using in-house CEREC or similar mills. " +
          "Composite resin veneers: ฿4,000–8,000 per tooth. Applied chairside, no lab wait. More affordable but less durable (5–7 years) and more susceptible to staining. Best for younger patients or temporary smile improvement. " +
          "Lumineers (no-prep veneers): ฿18,000–35,000 per tooth. Ultra-thin (0.2mm); minimal tooth reduction. Not suitable for all cases — your dentist will advise after digital smile design.",
      },
      {
        heading: "Digital smile design and what to expect",
        body:
          "Top Bangkok cosmetic dentistry clinics use Digital Smile Design (DSD) — a software preview showing your final smile before any tooth is touched. Ask if your clinic offers DSD; it's standard at most upper-tier practices and included in the consultation. " +
          "Typical timeline for porcelain veneers (2-trip scenario): Trip 1 (3–5 days) — consultation, DSD, tooth preparation, temporaries placed. You fly home with temporaries. Trip 2 (2–3 days) — porcelain veneers bonded. " +
          "Same-day option (E.max): preparation and bonding in a single visit at clinics with in-house CAD/CAM mills. Suitable if you have limited time. Slightly less control over shade customisation vs a dedicated lab.",
      },
      {
        heading: "What to ask at consultation",
        body:
          "Do you use a local or overseas lab? (Local Thai labs are fine; some premium clinics use European labs for exact shade matching.) " +
          "What material do you recommend for my case? (Your bite, enamel thickness, and shade goals affect the decision.) " +
          "Can I see before/after photos of similar cases? (Every reputable cosmetic dentist maintains a portfolio.) " +
          "What is the warranty? (Reputable clinics cover bonding failure and manufacturing defects — typically 1–5 years in writing.)",
      },
    ],
    faqs: [
      {
        q: "How much do veneers cost in Bangkok?",
        a: "Porcelain veneers: ฿12,000–30,000 per tooth. E.max (CAD/CAM ceramic): ฿15,000–35,000 per tooth. Composite resin: ฿4,000–8,000 per tooth. A full 8-upper-tooth smile makeover in porcelain typically costs ฿100,000–240,000.",
      },
      {
        q: "Can I get veneers done in one trip to Bangkok?",
        a: "Yes, if the clinic has an in-house CAD/CAM mill (E.max same-day). Porcelain lab-fabricated veneers normally require two trips (prep + bonding). Some clinics work with fast local labs to complete in 5–7 days within a single visit.",
      },
      {
        q: "How long do Bangkok veneers last?",
        a: "Porcelain and E.max: 10–20 years with good care. Composite resin: 5–7 years. Longevity depends on biting habits, teeth grinding (bruxism — mention this at consultation), and maintenance. Most Bangkok clinics offer a 1–5 year structural warranty.",
      },
      {
        q: "Is a consultation free?",
        a: "Most Bangkok cosmetic dentistry clinics offer a free initial consultation, including digital X-rays and a basic smile assessment. Digital Smile Design (DSD) preview may be included or charged separately (฿1,000–3,000). Confirm before booking.",
      },
    ],
    related: ["dental-implants-bangkok-cost", "teeth-whitening-bangkok"],
  },
  {
    slug: "teeth-whitening-bangkok",
    focusTags: ["dental"],
    title: "Teeth Whitening in Bangkok — In-Clinic vs Take-Home, Price & Safety (2026)",
    metaTitle: "Teeth Whitening Bangkok 2026 — Cost, Types & Best Clinics",
    metaDescription:
      "Teeth whitening in Bangkok costs ฿4,000–12,000 for in-clinic. Zoom, laser, LED options compared. Take-home trays from ฿2,000. Which is safest and most effective for tourists?",
    updated: "2026-06-03",
    intro:
      "Professional teeth whitening in Bangkok costs a fraction of what clinics charge in the US, Australia, or UK — typically ฿4,000–12,000 for a full in-clinic session. With over 1,600 dental clinics in the city, the challenge is knowing which whitening method is right for your teeth and how to avoid over-bleaching. This guide explains your options.",
    sections: [
      {
        heading: "In-clinic whitening options and prices",
        body:
          "Zoom Whitening (Philips): the most widely available system in Bangkok. 45-minute chair session with 25–35% hydrogen peroxide gel and blue LED activation. ฿6,000–12,000. Results: 3–8 shades lighter. " +
          "Laser whitening (Diode/CO2 activated): ฿5,000–10,000. Similar results to Zoom; the 'laser' activates the bleaching agent. Marketing term only — results are equivalent to LED-activated systems. " +
          "Opalesence Boost: chairside 40% hydrogen peroxide, no light activation needed. ฿5,000–9,000. Good for patients with light sensitivity to LED lamps. " +
          "One-visit composite bonding + whitening combos: popular for patients who want both shape correction and whitening in a single session.",
      },
      {
        heading: "Take-home whitening trays",
        body:
          "Custom tray + 2-week supply of 10–16% carbamide peroxide gel: ฿2,000–4,500. Custom trays ensure even bleaching without gum irritation from ill-fitting generic trays. " +
          "Most Bangkok dentists recommend take-home trays as the gold standard for long-term maintenance — in-clinic session for initial shade lift, take-home for top-ups. " +
          "Over-the-counter strips (Crest, Colgate) are available in Thai pharmacies for ฿200–800 but have lower peroxide concentrations and less even coverage.",
      },
      {
        heading: "What affects the result (and what to avoid)",
        body:
          "Whitening only works on natural enamel — crowns, veneers, and composite fillings will not change colour. If you have restorations, discuss shade matching with your dentist before whitening. " +
          "Sensitivity is common for 24–72 hours post-session. Clinics use desensitising gel (fluoride or potassium nitrate) immediately after to reduce this. Avoid very hot/cold food for 48 hours. " +
          "Contraindications: active cavities or gum disease, pregnancy, severe enamel erosion. Your dentist should screen for these before proceeding. " +
          "Result duration: 1–3 years with maintenance. Coffee, tea, red wine, and cigarettes accelerate staining. Monthly take-home touch-ups extend the result significantly.",
      },
    ],
    faqs: [
      {
        q: "How much does teeth whitening cost in Bangkok?",
        a: "In-clinic (Zoom, laser, LED): ฿4,000–12,000 for a full session. Take-home custom trays + gel: ฿2,000–4,500. Package deals combining both: ฿6,000–14,000 at most clinics.",
      },
      {
        q: "Is Zoom whitening available in Bangkok?",
        a: "Yes — Zoom (Philips) is the most widely available professional whitening system in Bangkok. Available at most mid-to-upper-tier dental clinics. A 45-minute in-clinic session typically lightens by 3–8 shades.",
      },
      {
        q: "Is teeth whitening safe in Bangkok?",
        a: "Yes, at licensed dental clinics. A qualified dentist screens for cavities and gum issues before whitening — this is standard protocol at reputable clinics. Risks are minor (temporary sensitivity) and well-managed with desensitising gel. Avoid unlicensed whitening bars or beauty salons offering 'whitening' — they cannot legally apply clinical-strength hydrogen peroxide.",
      },
      {
        q: "How long does whitening last?",
        a: "In-clinic result lasts 1–3 years with maintenance. Take-home touch-up trays every 6–12 months extend the result. Coffee, tea, red wine, and cigarettes are the main causes of restaining. Most Bangkok dentists include a take-home kit with in-clinic sessions for this reason.",
      },
    ],
    related: ["veneers-bangkok-price", "dental-implants-bangkok-cost"],
  },
  {
    slug: "masseter-botox-bangkok-jaw-slimming",
    focusTags: ["botox"],
    title: "Masseter Botox in Bangkok — Jaw Slimming Cost & What to Expect (2026)",
    metaTitle: "Masseter Botox Bangkok 2026 — Jaw Slimming Price & Results",
    metaDescription:
      "Masseter botox (jaw slimming) in Bangkok costs ฿3,500–8,000. How many units needed, how long it lasts, and which clinics specialise in Korean-style V-line results.",
    updated: "2026-06-03",
    intro:
      "Masseter botox — injecting botulinum toxin into the jaw muscle — is the fastest-growing aesthetic treatment among Korean and international visitors in Bangkok. It slims the lower face, softens a square jaw, and requires zero downtime. Bangkok clinics perform thousands of these per month at 40–60% of Singapore or Seoul prices.",
    sections: [
      {
        heading: "What masseter botox costs in Bangkok",
        body:
          "Price depends on dosage (units) and brand. Typical: ฿3,500–5,000 for 25 units/side (Botulax, Dysport); ฿5,500–8,000 for genuine Allergan at the same dose. Most clinics charge per unit (฿80–250/unit) rather than per area. " +
          "Maintenance sessions: the muscle gradually returns; most patients retreat every 4–6 months. Many Bangkok clinics offer a 3-session package at 15–20% discount. " +
          "Budget alert: prices under ฿2,500 typically indicate heavily diluted product or unverified brand — ask to see the vial.",
      },
      {
        heading: "Units needed and dosage guide",
        body:
          "25–35 units per side is standard for first-time masseter reduction. Patients with very strong hypertrophic masseter muscles (teeth-grinders, heavy jaw clenchers) may need 40–50 units/side for visible results. " +
          "V-line candidates: 30 units/side is the most common Bangkok protocol. Results visible at 4–6 weeks as muscle atrophies; full effect at 8–12 weeks. " +
          "Don't judge result at 2 weeks — many patients return too early and top up unnecessarily. Trust the timeline.",
      },
      {
        heading: "How to pick a Bangkok masseter specialist",
        body:
          "Look for a clinic where the injector regularly treats Korean and Japanese clients — they have the highest volume and strictest aesthetic standards for V-line results. " +
          "Reviewers mentioning 'natural V-line', 'not overdone', or '사각턱' (Korean: square jaw) are strong signals of a specialised injector. " +
          "Avoid clinics where the treatment takes under 10 minutes for a first-time patient — proper assessment of your masseter size should take at least 5–10 minutes. " +
          "Trust Score 70+ on this site indicates clinics with strong reviewer credibility.",
      },
    ],
    faqs: [
      {
        q: "How much is masseter botox in Bangkok?",
        a: "฿3,500–8,000 for a standard treatment (25–35 units/side). Allergan/Botox-original at the premium end; Botulax/Dysport at the value end. Both produce comparable jaw-slimming results at correct dosage.",
      },
      {
        q: "How many sessions before I see jaw slimming results?",
        a: "One session is enough for most patients. Results are visible at 4–6 weeks, full effect at 8–12 weeks. The jaw muscle physically atrophies (shrinks) — this takes time. Most patients retreat every 4–6 months to maintain the effect.",
      },
      {
        q: "Is masseter botox safe?",
        a: "Yes, at qualified clinics. The masseter is a non-critical muscle — reducing it doesn't affect chewing for most patients (some notice minor change with very chewy foods in the first month). Serious complications are rare and reversible since botox wears off.",
      },
      {
        q: "Can I combine masseter botox with filler on the same day?",
        a: "Yes — many Bangkok clinics do botox + chin filler on the same visit for a complete V-line effect. The combination is well-tolerated. Some practitioners prefer to assess the botox result first (at 8 weeks) before adding chin projection.",
      },
    ],
    related: ["bangkok-botox-guide", "botox-forehead-bangkok"],
  },
  {
    slug: "hifu-ultherapy-bangkok-cost",
    focusTags: ["hifu", "botox"],
    title: "HIFU & Ultherapy in Bangkok — Cost, Machines & What Actually Works (2026)",
    metaTitle: "HIFU Bangkok Cost 2026 — Ultherapy vs Thermage vs Korean Machines",
    metaDescription:
      "HIFU in Bangkok: Ultherapy ฿25,000–80,000, Korean machines ฿8,000–18,000. How to tell the difference, which works, and what reviewers actually say.",
    updated: "2026-06-03",
    intro:
      "Bangkok is flooded with HIFU options — from authentic Ultherapy (Merz, Switzerland) to affordable Korean machines. The price range is ฿8,000–80,000+ for what is marketed as 'the same treatment'. It's not. This guide explains the real differences, what to ask before booking, and what Bangkok reviewers report as actual results.",
    sections: [
      {
        heading: "The machine hierarchy — what you're actually paying for",
        body:
          "Ultherapy (Merz, Switzerland): ฿25,000–80,000/session depending on face zones and shot count. Gold standard. Published clinical evidence. Every session is authenticated via software — Merz can verify shots were used. Lasts 12–18 months. " +
          "Thermage (Solta): radiofrequency, not ultrasound. ฿20,000–60,000. Better for surface skin quality vs deep SMAS lifting. Longer-lasting than HIFU for some patients (18–24 months). " +
          "Ultraformer III (Korea): ฿10,000–25,000. Strong alternative to Ultherapy at lower cost; widely used in Korean aesthetics. Good clinical data. " +
          "Generic Korean machines (Doublo, Sygmalift, etc.): ฿8,000–18,000. Variable quality. Some clinics reuse cartridges (reducing shots and safety). Ask specifically: how many shots are you including, and are cartridges new?",
      },
      {
        heading: "What HIFU actually does (and what it can't)",
        body:
          "HIFU delivers focused ultrasound energy to the SMAS layer (the deep connective tissue layer that surgeons tighten in facelifts). It stimulates collagen remodeling over 3–6 months. " +
          "Realistic expectations: mild-to-moderate skin tightening and lifting of jowls, brow, and neck. NOT a facelift substitute. Best results on patients 35–55 with mild-to-moderate laxity. Older or very lax skin shows less improvement. " +
          "Pain level: Ultherapy is uncomfortable (2–7/10 pain scale). Korean machines are generally less intense, less painful, and less effective. Bangkok clinics use topical numbing cream; some offer oral sedation for high-shot-count Ultherapy.",
      },
      {
        heading: "Red flags when booking HIFU in Bangkok",
        body:
          "Price under ฿10,000 for 'Ultherapy': not genuine. Real Ultherapy cartridges cost more than this at wholesale. " +
          "No shot count disclosed: a legitimate clinic tells you exactly how many shots (lines × points, e.g. 300 lines for full face) before you book. Vague 'full face' packages without shot count indicate recycled cartridges. " +
          "Reviewers mentioning 'no pain, no results': often indicates very low energy settings — some clinics dial down intensity to prevent complaints, at the cost of efficacy. " +
          "Trust Score 70+ clinics on this site with reviewer mentions of specific machines are the safe baseline.",
      },
    ],
    faqs: [
      {
        q: "How much does HIFU cost in Bangkok?",
        a: "Genuine Ultherapy: ฿25,000–80,000 depending on face zones and shot count. Ultraformer III (Korean): ฿10,000–25,000. Generic Korean machines: ฿8,000–18,000. Thermage: ฿20,000–60,000. Never pay Ultherapy prices for an unnamed machine.",
      },
      {
        q: "Is Ultherapy better than Korean HIFU machines?",
        a: "Ultherapy has the most published clinical evidence and is the only machine with real-time imaging to target the SMAS layer precisely. Korean machines (Ultraformer, Doublo) are more affordable and effective but have less long-term data. For first-time HIFU, Ultraformer III is a solid value choice.",
      },
      {
        q: "How long does HIFU last in Bangkok's heat/humidity?",
        a: "Heat and humidity don't affect HIFU longevity. Results last 12–18 months (Ultherapy) or 9–12 months (Korean machines). Collagen remodeling takes 3–6 months to peak — don't judge the result too early.",
      },
    ],
    related: ["bangkok-botox-guide", "masseter-botox-bangkok-jaw-slimming"],
  },
  {
    slug: "botox-forehead-bangkok",
    focusTags: ["botox"],
    title: "Forehead Botox in Bangkok — Areas, Units, Price & Results (2026)",
    metaTitle: "Forehead Botox Bangkok 2026 — Units, Cost & Area Guide",
    metaDescription:
      "Forehead botox in Bangkok costs ฿2,000–5,000 per area. Forehead lines, frown lines, crow's feet, brow lift — units needed and prices for each area explained.",
    updated: "2026-06-03",
    intro:
      "Upper-face botox — covering forehead lines, frown lines (glabella), crow's feet, and brow position — is the most common aesthetic treatment in Bangkok. Getting the right dose in the right areas makes the difference between 'natural and refreshed' and 'frozen'. This guide explains units, pricing by area, and what Bangkok's best results actually look like.",
    sections: [
      {
        heading: "Bangkok botox pricing by area (2026)",
        body:
          "Forehead lines (horizontal): 10–20 units. ฿1,500–4,500 (Botulax/Dysport); ฿3,000–7,000 (Allergan). Smooths horizontal lines without immobilising the brow. " +
          "Frown lines / glabella (11s): 15–25 units. ฿2,000–5,000. The most common complaint area — vertical lines between the brows. Highest satisfaction scores in reviews. " +
          "Crow's feet (eyes): 8–15 units/side. ฿1,500–4,000. Often bundled with forehead/glabella for a full upper-face package. " +
          "Brow lift (chemical): 2–6 units, strategic placement. ฿800–2,000 add-on. Lifts the lateral brow 1–3mm by relaxing the depressor muscles. " +
          "Full upper-face package (forehead + glabella + crow's feet): ฿6,000–15,000 depending on brand. The most common Bangkok package for medical tourists.",
      },
      {
        heading: "First-timer guide: what to expect",
        body:
          "Consultation (free at most clinics): injector assesses muscle strength, discusses desired outcome (frozen vs natural movement). First-timers often start conservatively — you can always add more, you can't take it away. " +
          "The procedure: 5–20 minutes depending on areas. Tiny needles, mild discomfort. No downtime. Avoid lying flat or intense exercise for 4 hours post-treatment. " +
          "Onset: 3–7 days for first effect; peak at 10–14 days. Don't judge at day 3. " +
          "Top-up window: if effect is uneven or too weak at day 14, most Bangkok clinics offer a free top-up within 2–4 weeks.",
      },
      {
        heading: "How to get natural-looking results",
        body:
          "Choose an injector who asks about your brow-raising habits and facial expressions — good injectors customise placement to maintain some movement. " +
          "Tell them explicitly: 'I want natural movement, not frozen'. The dose is the main lever — under-treating slightly on the first session and evaluating at 2 weeks is safer than overdoing it. " +
          "Red flags: injector who doesn't ask about your expressions, promises 'completely wrinkle-free' with no caveats, or won't tell you the brand and units used. " +
          "Review reading tip: look for reviewers who mention specific areas and durations — 'forehead still moves a bit at 8 weeks' is more useful than a star rating.",
      },
    ],
    faqs: [
      {
        q: "How much does forehead botox cost in Bangkok?",
        a: "Per area: ฿1,500–5,000 for forehead lines, ฿2,000–5,500 for frown lines (glabella), ฿1,500–4,000 for crow's feet. Full upper-face package (all three): ฿6,000–15,000 depending on brand. Allergan is most expensive; Botulax/Dysport are value alternatives.",
      },
      {
        q: "How many units for forehead botox?",
        a: "Forehead: 10–20 units. Frown lines (glabella): 15–25 units. Crow's feet: 8–15 units/side. Total upper face: 35–65 units depending on muscle strength and desired effect.",
      },
      {
        q: "Will forehead botox look natural?",
        a: "Yes, when dosed conservatively by an experienced injector. A good result means reduced wrinkles but preserved ability to raise your eyebrows and show expression. Frozen results come from too many units or wrong placement — ask for 'baby botox' or 'natural movement' explicitly.",
      },
      {
        q: "How long does forehead botox last in Bangkok?",
        a: "3–4 months is standard. First-timers sometimes see shorter duration as muscles are strong; with regular treatments, muscle weakens and duration extends to 4–5 months. The heat and humidity of Bangkok do not affect longevity.",
      },
    ],
    related: ["bangkok-botox-guide", "masseter-botox-bangkok-jaw-slimming"],
  },
  {
    slug: "fue-hair-transplant-bangkok-cost",
    focusTags: ["hair"],
    title: "FUE Hair Transplant in Bangkok — Cost, Clinics & What to Expect (2026)",
    metaTitle: "FUE Hair Transplant Bangkok Cost 2026 — Price, Grafts & Results",
    metaDescription:
      "FUE hair transplant in Bangkok costs ฿65,000–150,000 for 2,000 grafts. How to pick a clinic, what to expect during recovery, and how Bangkok compares to Korea and Turkey.",
    updated: "2026-06-03",
    intro:
      "Bangkok is one of Asia's top destinations for FUE hair transplants — 40–60% cheaper than Korea or Singapore, with internationally-trained surgeons and English-speaking clinics in Sukhumvit. This guide covers what you'll pay, how to plan your trip, and what separates a great result from a disappointing one.",
    sections: [
      {
        heading: "FUE hair transplant costs in Bangkok (2026)",
        body:
          "Pricing is per-graft in Bangkok. Standard FUE: ฿35–80/graft. A typical 2,000-graft session (mild to moderate hair loss): ฿70,000–160,000. " +
          "Premium clinics (experienced surgeons, better tech, English support): ฿80–100/graft = ฿160,000–200,000 for 2,000 grafts. " +
          "DHI (Choi pen technique): ฿85,000–200,000 for 2,000 grafts — higher precision but same graft count. " +
          "Beard restoration: ฿50,000–120,000. Eyebrow: ฿35,000–80,000. " +
          "Compare: Korea ฿200,000–400,000 for 2,000 grafts. Turkey $2,000–4,000 (฿70,000–140,000) but quality variance is high. Bangkok offers Korean-level quality at closer to Turkey pricing.",
      },
      {
        heading: "How many grafts do you need?",
        body:
          "Norwood scale is the standard measure. NW2–3 (mild recession): 1,000–2,000 grafts. NW3–4 (moderate thinning): 2,000–3,500 grafts. NW4–5 (significant loss): 3,500–5,000 grafts. NW6–7 (advanced): 5,000+ grafts, often 2 sessions. " +
          "The donor area (back of head) limits total available grafts — typically 6,000–8,000 lifetime. A good Bangkok surgeon will assess your donor density before quoting a price. Beware clinics that quote without a proper consultation. " +
          "Graft vs hair: each graft contains 1–4 hairs. Your hair count after transplant will be higher than the graft count — about 2–2.5x on average.",
      },
      {
        heading: "Planning your Bangkok trip",
        body:
          "Minimum 4–5 days: Day 1 arrival + consultation (free at most clinics). Day 2 procedure (6–9 hours). Days 3–4 recovery, washing, post-op check. Day 5 fly home. " +
          "Some patients stay 7 days for extra rest. The procedure itself is done under local anaesthetic — you're awake, mildly sedated, watching a movie. " +
          "Recovery timeline: 10–14 days for redness/scabs to clear. 2–4 weeks: shock loss begins (transplanted hairs fall out — this is normal). 6–9 months: new growth visible. 12–18 months: full result. " +
          "Most Bangkok clinics provide post-op kits, include follow-up video consultations, and have staff who speak English, Korean, and Arabic.",
      },
    ],
    faqs: [
      {
        q: "How much does FUE hair transplant cost in Bangkok?",
        a: "฿35–80 per graft. A standard 2,000-graft session costs ฿70,000–160,000. DHI technique: ฿85,000–200,000 for 2,000 grafts. Compare: Korea ฿200,000–400,000 for the same procedure.",
      },
      {
        q: "How long do I need to stay in Bangkok for a hair transplant?",
        a: "Minimum 4–5 days: Day 1 consultation, Day 2 procedure, Days 3–4 recovery and post-op check, Day 5 fly home. Most patients stay 5–7 days. No second trip required for FUE.",
      },
      {
        q: "When will I see results after Bangkok FUE?",
        a: "New growth starts at 3–4 months, becomes noticeable at 6–9 months, full result at 12–18 months. Shock loss (transplanted hairs falling out) at 2–4 weeks is normal and expected — don't panic.",
      },
      {
        q: "Is Bangkok safe for hair transplants?",
        a: "Yes, at licensed clinics. Thailand's medical council requires all transplant procedures to be performed by registered doctors. Trust Score 70+ clinics on this site have been verified through reviewer credibility analysis. Ask to see the surgeon's medical registration before booking.",
      },
    ],
    related: ["dhi-vs-fue-bangkok", "smp-scalp-micropigmentation-bangkok"],
  },
  {
    slug: "dhi-vs-fue-bangkok",
    focusTags: ["hair"],
    title: "DHI vs FUE Hair Transplant in Bangkok — Which Is Better? (2026)",
    metaTitle: "DHI vs FUE Bangkok 2026 — Difference, Cost & Which to Choose",
    metaDescription:
      "DHI vs FUE hair transplant in Bangkok: DHI costs ฿20,000–40,000 more but offers denser results. Which technique suits your hair loss and budget?",
    updated: "2026-06-03",
    intro:
      "DHI (Direct Hair Implantation) and FUE (Follicular Unit Extraction) are the two main hair transplant techniques offered in Bangkok. Both extract grafts individually from the donor area — the difference is in how they're implanted. Understanding which suits your case can save you money and get you a better result.",
    sections: [
      {
        heading: "The core difference: implantation method",
        body:
          "FUE: grafts are extracted, then the surgeon creates recipient site incisions (channels) first, then implants grafts into the channels. Two-step process. Allows very precise angle control. Slightly longer outside-body time for grafts. " +
          "DHI (Choi pen): grafts are loaded into a pen-like device and implanted directly without pre-made channels — extraction and implantation in one motion. " +
          "In practice, DHI tends to produce slightly higher density in the implanted area because channels are made and filled simultaneously, reducing the window of graft exposure to air. The difference is modest — an experienced FUE surgeon achieves comparable density. " +
          "DHI is particularly favoured for: hairline work (very precise angle/direction control), and patients who want to keep existing hair in the recipient area (no pre-made channels means less disruption).",
      },
      {
        heading: "Cost comparison in Bangkok",
        body:
          "FUE: ฿35–80/graft = ฿70,000–160,000 for 2,000 grafts at standard clinics. " +
          "DHI: ฿45–100/graft = ฿90,000–200,000 for 2,000 grafts. Choi pens are consumables — the extra cost is real. " +
          "The premium for DHI is ฿20,000–40,000 for a typical session. Worth it for hairline refinement or density-sensitive areas. Overkill for large coverage areas where cost-per-graft is the priority. " +
          "Some Bangkok clinics offer hybrid FUE+DHI: FUE for large areas (cheaper), DHI for hairline (more precise). This is a good middle-ground — ask about it.",
      },
      {
        heading: "Which technique should you choose?",
        body:
          "Choose FUE if: you need large coverage (3,000+ grafts), budget is a priority, your surgeon has strong FUE experience, or you're doing beard/eyebrow restoration. " +
          "Choose DHI if: you're refining a hairline, have existing hair in the recipient zone you want to preserve, or your clinic's DHI specialist has significantly more DHI cases than FUE. " +
          "What matters most: the surgeon's experience and graft survival rate, NOT the technique name. A skilled FUE surgeon outperforms an inexperienced DHI clinic every time. Ask to see before/after photos of at least 10 cases with your Norwood level.",
      },
    ],
    faqs: [
      {
        q: "Is DHI better than FUE for hair transplant?",
        a: "Not categorically. DHI offers marginal density advantages and better precision for hairline work. For large coverage areas, experienced FUE delivers comparable results at lower cost. The surgeon's skill matters more than the technique.",
      },
      {
        q: "How much more does DHI cost vs FUE in Bangkok?",
        a: "DHI typically costs ฿20,000–40,000 more per session due to Choi pen consumables. FUE: ฿70,000–160,000 for 2,000 grafts. DHI: ฿90,000–200,000 for the same graft count.",
      },
      {
        q: "Can I get a hybrid FUE + DHI in Bangkok?",
        a: "Yes — several Bangkok clinics offer hybrid sessions: FUE for the crown/mid-scalp (large area, cost-efficient) and DHI for the hairline (precision). This is a popular option for patients wanting both coverage and a natural hairline.",
      },
    ],
    related: ["fue-hair-transplant-bangkok-cost", "smp-scalp-micropigmentation-bangkok"],
  },
  {
    slug: "smp-scalp-micropigmentation-bangkok",
    focusTags: ["hair"],
    title: "SMP (Scalp Micropigmentation) in Bangkok — Cost, Sessions & Results (2026)",
    metaTitle: "SMP Bangkok 2026 — Scalp Micropigmentation Cost & Best Clinics",
    metaDescription:
      "SMP in Bangkok costs ฿15,000–50,000 per session. The non-surgical alternative to hair transplants — how it works, how many sessions needed, and what to look for in a Bangkok SMP specialist.",
    updated: "2026-06-03",
    intro:
      "Scalp Micropigmentation (SMP) is a non-surgical procedure that replicates the look of a shaved head or adds density to thinning hair using micro-pigment deposits. Bangkok has a growing number of SMP specialists at prices 40–60% below the UK or Australia. This guide covers costs, sessions, and how to avoid the most common SMP pitfalls.",
    sections: [
      {
        heading: "SMP costs in Bangkok (2026)",
        body:
          "SMP pricing depends on the coverage area and number of sessions. Full scalp (grade 1–2 shaved look): ฿40,000–100,000 total across 2–3 sessions. " +
          "Per-session pricing: ฿15,000–50,000/session depending on area and clinic tier. Most full-scalp SMP requires 2–3 sessions spaced 2–4 weeks apart. " +
          "Hairline only (density addition to existing hair): ฿15,000–30,000/session, usually 1–2 sessions. " +
          "Scar camouflage (FUE/FUT scars): ฿12,000–25,000/session. " +
          "Compare: UK/Australia ฿80,000–200,000+ for full scalp. Bangkok is significantly more affordable with comparable quality at certified clinics.",
      },
      {
        heading: "What SMP can and cannot do",
        body:
          "SMP CAN: create the illusion of a closely-shaved head on a bald scalp; add the appearance of density to thinning hair; camouflage FUE/FUT transplant scars; define a hairline on a shaved head. " +
          "SMP CANNOT: create actual hair or growth; work well on hair longer than grade 1–2 (the dots become visible); permanently solve hair loss progression (you may need touch-ups as hair continues to thin). " +
          "Ideal candidates: men with Norwood 5–7 who want coverage without surgery; men post-FUE wanting to camouflage donor scars; men with diffuse thinning wanting more density appearance without surgery.",
      },
      {
        heading: "What to look for in a Bangkok SMP artist",
        body:
          "Pigment quality is the #1 long-term concern: cheap pigments turn blue or green within 1–3 years. Ask specifically whether they use Scalp Aesthetics, Folicule, or equivalent specialist SMP pigments — not tattoo ink. " +
          "Needle technique: SMP requires a specific stippling technique (dots, not lines). Ask to see a portfolio of healed results — fresh SMP always looks sharp, healed SMP reveals the real quality. " +
          "Skin tone matching: darker skin types require different pigment selection. Show your artist reference photos from clients with similar complexion. " +
          "Sessions: reputable Bangkok SMP artists never promise completion in one session — it takes 2–3 to build depth and ensure even coverage.",
      },
    ],
    faqs: [
      {
        q: "How much does SMP cost in Bangkok?",
        a: "Full scalp SMP: ฿40,000–100,000 total (2–3 sessions at ฿15,000–50,000/session). Hairline density addition: ฿15,000–30,000 per session. Scar camouflage: ฿12,000–25,000 per session. Compare: UK/Australia ฿80,000–200,000+ for full scalp.",
      },
      {
        q: "How many SMP sessions do I need?",
        a: "Full scalp: 2–3 sessions spaced 2–4 weeks apart. Hairline touch-up or density: 1–2 sessions. Each session builds on the last — never judge the result after session 1.",
      },
      {
        q: "Does SMP look natural?",
        a: "Yes, when done by a specialist with good pigments. The key is matching dot size to your natural follicle size and using pigments that don't discolour. Avoid artists who use standard tattoo ink — it turns blue/green within 2–3 years.",
      },
      {
        q: "How long does SMP last?",
        a: "3–5 years before a touch-up is needed. Fading is gradual and predictable. Sun exposure accelerates fading — SPF on the scalp helps longevity. Most Bangkok SMP clients return for a refresh session at 3–4 years.",
      },
    ],
    related: ["fue-hair-transplant-bangkok-cost", "dhi-vs-fue-bangkok"],
  },
  // ── Dental implant cost + botox price guides ───────────────────────────────
  {
    slug: "dental-implant-cost-thailand",
    focusTags: ["dental"],
    title: "Dental Implant Cost in Thailand (2026)",
    metaTitle: "Dental Implant Cost in Thailand 2026 — Prices, Clinics & Guide",
    metaDescription:
      "Dental implant costs in Thailand: single implant ฿30,000–฿80,000, all-on-4 from ฿200,000. Compare Bangkok vs Pattaya vs Phuket. Verified clinic data updated 2026.",
    updated: "2026-06-01",
    intro:
      "Thailand is one of Asia's leading dental tourism destinations, offering implant treatments at 50–70% below UK and US prices with internationally-accredited clinics.",
    sections: [
      {
        heading: "Dental Implant Prices in Thailand by City",
        body: "Bangkok clinics: single implant ฿35,000–฿80,000 (Nobel Biocare, Straumann) or ฿30,000–฿50,000 (Korean/Chinese brands). Pattaya: ฿30,000–฿60,000. Phuket: ฿35,000–฿75,000. All-on-4 in Bangkok averages ฿200,000–฿450,000 per arch. Prices include implant, abutment, and crown unless stated.",
      },
      {
        heading: "Thailand vs US, UK, and Korea",
        body: "Single implant in the US: $3,000–$6,000 (฿110,000–฿220,000). UK: £2,500–£4,500. South Korea: ₩1,500,000–฿3,000,000 (฿40,000–฿85,000). Thailand is comparable to Korea in price while offering English-speaking staff and direct flights from major hubs.",
      },
      {
        heading: "What to Check Before Booking",
        body: "Verify the clinic's accreditation (JCI or ISO 9001). Ask which implant brand they use (Nobel Biocare and Straumann are internationally recognized). Confirm the quote includes all components: implant body, abutment, crown, and follow-up. Most reputable Bangkok clinics offer a 5–10 year warranty on the implant and 1 year on the crown.",
      },
    ],
    faqs: [
      {
        q: "How much does a dental implant cost in Thailand?",
        a: "A single dental implant in Thailand costs ฿30,000–฿80,000 including the implant, abutment, and crown. Premium brands (Nobel Biocare, Straumann) cost more. All-on-4 starts from ฿200,000 per arch. This is 50–70% cheaper than equivalent treatment in the US or UK.",
      },
      {
        q: "Is it safe to get dental implants in Thailand?",
        a: "Thailand has internationally accredited dental hospitals and specialist implantology clinics, particularly in Bangkok. Key safety indicators: JCI or ISO accreditation, doctor trained abroad (US, Germany, Australia), and a verifiable patient review history. Our Trust Score factors in review credibility and volume.",
      },
      {
        q: "How long does the dental implant process take in Thailand?",
        a: "A standard single implant takes 3–6 months total: implant placement (day 1), osseointegration healing (3–5 months), then crown fitting. For medical tourists, some clinics offer 'immediate loading' or 'teeth in a day' protocols that compress the timeline, though these suit only specific cases.",
      },
    ],
    related: ["botox-price-bangkok-2026"],
  },
  {
    slug: "botox-price-bangkok-2026",
    focusTags: ["botox"],
    title: "Botox Price in Bangkok 2026 — Clinics & Costs",
    metaTitle: "Botox Price Bangkok 2026 — Per Unit, Per Area, Best Clinics",
    metaDescription:
      "Botox prices in Bangkok: ฿150–฿400/unit, ฿3,000–฿12,000 per area. Allergan vs Korean brands. Top clinics by Trust Score. Updated June 2026.",
    updated: "2026-06-01",
    intro:
      "Bangkok is Southeast Asia's top destination for aesthetic medicine, with hundreds of clinics offering Botox at prices significantly below Western markets.",
    sections: [
      {
        heading: "Botox Pricing in Bangkok — Per Unit vs Per Area",
        body: "Most Bangkok clinics price Botox in one of two ways: per unit (฿150–฿400/unit) or per area (฿3,000–฿8,000/area). A standard forehead treatment uses 15–25 units; crow's feet 10–15 units per side. Budget clinics use Korean brands (Botulax, Nabota) at ฿150–฿200/unit. Premium clinics use Allergan Botox or Dysport at ฿300–฿450/unit.",
      },
      {
        heading: "Which Brand: Allergan vs Korean Botox",
        body: "Allergan (Botox) and Dysport are FDA/EMA-approved and have the longest safety records. Korean brands (Botulax, Hutox, Nabota, Innotox) are approved in Korea and popular in Asia — they are generally safe but have shorter track records. The choice affects price and expected duration (3–4 months for premium brands, 2–3 months for some Korean brands).",
      },
      {
        heading: "What to Look for in a Bangkok Botox Clinic",
        body: "Always confirm the injector is a licensed doctor or nurse practitioner — not a technician. Ask to see the product box and lot number before injection (confirms the brand). Reputable clinics display their doctor licenses and product certifications. Trust Score on this site tracks review credibility, staff quality mentions, and negative signals.",
      },
    ],
    faqs: [
      {
        q: "How much does Botox cost in Bangkok?",
        a: "Botox in Bangkok costs ฿150–฿400 per unit depending on brand (Allergan, Dysport, Korean brands). Per-area pricing: ฿3,000–฿8,000 per area. Full forehead + frown lines + crow's feet typically costs ฿8,000–฿20,000 total. Premium clinics charge more but use internationally recognized brands.",
      },
      {
        q: "Is Botox safe in Thailand?",
        a: "Botox is widely and safely administered in Thailand by licensed doctors. Ensure the clinic shows you the sealed product vial before injection to confirm the brand. Complications are rare but more likely from unlicensed practitioners — choose clinics with verified doctor credentials and high review volumes.",
      },
    ],
    related: ["dental-implant-cost-thailand"],
  },
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}

/** 사이트 focus에 맞는 가이드만 반환. focusTags 없는 guide는 general → 모든 사이트.
 *  특정 focusTags 가진 guide는 매칭되는 사이트에서만 노출. */
export function guidesForFocus(focus: string): Guide[] {
  return GUIDES.filter((g) => {
    if (!g.focusTags || g.focusTags.length === 0) return true; // general
    if (focus === "all") return true;
    return (g.focusTags as readonly string[]).includes(focus);
  });
}

/** focusTag("botox", "dental" 등) → 연결할 시술×도시 procedure 키 목록.
 *  /city/[city]/[procedure] 페이지에서 쓰는 키와 동일해야 함. */
export const FOCUS_TO_PROCEDURES: Record<string, string[]> = {
  botox:  ["botox"],
  filler: ["filler"],
  hifu:   ["hifu"],
  dental: ["implants", "veneers", "whitening"],
  hair:   ["hair"],
  facial: [],
  laser:  [],
};

/** 가이드 focusTags 기준으로 연결 가능한 procedure 키 반환. */
export function proceduresForGuide(guide: Guide): string[] {
  if (!guide.focusTags) return [];
  return [...new Set(guide.focusTags.flatMap((t) => FOCUS_TO_PROCEDURES[t] ?? []))];
}
