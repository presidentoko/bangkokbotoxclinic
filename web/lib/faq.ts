import { aestheticPriceFacts, midText, baht } from "@/lib/aestheticPriceGuide";
// 보톡스·필러·HIFU 가격은 HDmall 패키지 가격(가격 가이드)에서 (2026-10-31). 예전 "฿80–250/unit, 미국 대비 60–80% 저렴, HIFU ฿8,000–80,000+" 는 출처가 없었다.
const AP = aestheticPriceFacts();
const M = (t: Parameters<typeof midText>[0], suf = "") => midText(t, suf) ?? "—";
const MED = (t: { median: number } | null) => (t ? baht(t.median) : "—");

// 카테고리별 FAQ — AEO + Google FAQPage 리치결과 + 페이지 콘텐츠 unique 강화.
// 향후 LLM 으로 더 풍부하게 생성 가능. 현재는 hand-written 베이스.

export type Faq = { q: string; a: string };

export const CATEGORY_FAQS: Record<string, Faq[]> = {
  botox: [
    {
      q: "How much does Botox cost in Bangkok?",
      a: `Bangkok clinics that list Botox packages with a unit count on HDmall charge a typical ${MED(AP.botoxPerUnit)} per unit, with the middle half between ${M(AP.botoxPerUnit, " per unit")}. Packages sold per area (dose set by the doctor) are typically ${M(AP.botoxPerArea)} for one area. Brand changes the price; every listing with its source is on /prices/botox-cost-bangkok.`,
    },
    {
      q: "Is botox cheaper in Bangkok than abroad?",
      a: `We only compare Bangkok clinics with each other, so we do not quote a saving against other countries. In Bangkok, listed packages work out at a typical ${MED(AP.botoxPerUnit)} per unit. To compare, ask your clinic at home for the price per unit of the same brand.`,
    },
    {
      q: "What botox brands are available in Bangkok?",
      a: "Bangkok clinics stock four main botulinum toxin brands: Allergan Botox (US, gold standard), Dysport (France, slightly more diffuse spread), Botulax (Korea, lowest price, widely available), and Xeomin (Germany, additive-free). Premium clinics verify authenticity with box + hologram + lot number. Ask to see the original packaging before injection.",
    },
    {
      q: "Are Bangkok botox clinics safe?",
      a: "The clinics in this directory all hold Thai medical licenses and operate publicly on Google Maps. Trust Score above 70 indicates strong reviewer credibility (Local Guides, high review volume, recent positive trend). Always verify the brand authenticity at consultation — review excerpts mentioning 'genuine brand' indicate clinics with strong brand-verification practices.",
    },
    {
      q: "How do I avoid bad botox in Bangkok?",
      a: "Four rules: (1) Pick clinics with many recent Google reviews and a high Trust Score. (2) Ask to see the original sealed vial and its brand before injection. (3) Insist on a licensed doctor (not a nurse or technician) performing the injection. (4) Ask how many units you are getting and the price per unit, so you can compare quotes like for like.",
    },
    {
      q: "Which Bangkok district is best for botox?",
      a: "Pathum Wan (Siam) and Watthana (Sukhumvit, Thong Lor, Phrom Phong) have the highest concentration of botox-specialist clinics with English-speaking staff. Phaya Thai (including Ari) offers more local pricing with shorter wait times.",
    },
    {
      q: "How long does Bangkok botox last?",
      a: "Standard duration is 3–4 months, similar to other countries. Effect duration depends on dosage, brand, treatment area, and individual metabolism, not country of treatment.",
    },
    {
      q: "What should I expect at a Bangkok botox consultation?",
      a: "A reputable Bangkok botox consultation takes 15–30 minutes: facial assessment, brand and unit discussion, price confirmation, and before photos. The injection itself takes 5–15 minutes. Expect mild redness for 20–30 minutes. Avoid lying down for 4 hours and avoid strenuous exercise for 24 hours post-injection. Results appear in 3–7 days, peak at 2 weeks.",
    },
  ],
  filler: [
    {
      q: "What does dermal filler cost in Bangkok?",
      a: `One-cc (one syringe) filler packages that Bangkok clinics list on HDmall cost a typical ${MED(AP.filler1cc)}, with the middle half between ${M(AP.filler1cc)}. Most listings do not name the brand, so ask which brand and product line you are getting. Lips often use about 1 cc; cheeks and jawline usually more. Listings: /prices/filler-cost-bangkok.`,
    },
    {
      q: "Are fillers in Bangkok genuine?",
      a: "Reputable clinics — those with high Trust Scores and reviewers mentioning 'genuine' or 'authentic' — purchase directly from authorised distributors and show you the box and serial sticker before injection. Always ask to see the original packaging.",
    },
    {
      q: "What types of fillers are available?",
      a: "Hyaluronic acid (HA) fillers are most common — reversible with hyaluronidase. Some clinics also offer poly-L-lactic acid (Sculptra) for collagen stimulation, and calcium hydroxylapatite (Radiesse) for stronger structural support. Permanent fillers are rare and not recommended.",
    },
  ],
  hifu: [
    {
      q: "How much is HIFU in Bangkok?",
      a: `In single-session packages listed on HDmall, an Ultraformer session is typically ${MED(AP.hifuUltraformer)}, other HIFU machines ${MED(AP.hifuOther)} and Ulthera ${MED(AP.ulthera)}. The machine and the number of shots or lines set the price, so check both before booking. Listings: /prices/hifu-cost-bangkok.`,
    },
    {
      q: "Is Ultherapy or Thermage better?",
      a: `Ultherapy uses focused ultrasound (HIFU) and reaches the deeper SMAS layer; Thermage uses radiofrequency to heat the skin. They suit different concerns, so ask the doctor which fits yours. In HDmall listings a single session is typically ${MED(AP.ulthera)} for Ulthera and ${MED(AP.thermage)} for Thermage FLX.`,
    },
    {
      q: "Does HIFU hurt?",
      a: "Most reviewers describe Bangkok HIFU sessions as moderately uncomfortable but tolerable, with topical numbing cream. Higher shot counts and deeper SMAS lines are more sensitive. Clinics with reviewers mentioning 'no pain' often use stronger numbing protocols.",
    },
  ],
  facial: [
    {
      q: "What's included in a Bangkok facial?",
      a: "Standard facials include cleansing, exfoliation, extraction, a mask and moisturiser, usually for 60–90 minutes. Premium facials add LED therapy, microcurrent, oxygen infusion or HydraFacial machines. Prices vary widely between clinics, so ask for the price list.",
    },
    {
      q: "How often should I get a facial in Bangkok?",
      a: "Most aesthetic dermatologists recommend monthly facials for active maintenance, or every 6–8 weeks for general skin health. Many Bangkok clinics offer monthly subscription packages.",
    },
  ],
  laser: [
    {
      q: "What laser treatments are popular in Bangkok?",
      a: "Pico laser (pigmentation, tattoo removal), CO2 fractional (acne scars, resurfacing), IPL (sun damage, redness) and laser hair removal are the most common. Most skin concerns need several sessions, so compare the price of the whole course.",
    },
    {
      q: "Is laser hair removal in Bangkok worth it?",
      a: "It usually takes several sessions, so compare the price of the full course rather than one session. Diode lasers are generally preferred for darker skin tones and alexandrite for lighter tones; ask the clinic which machine it uses.",
    },
  ],
  dental: [
    {
      q: "Why is Bangkok popular for dental work?",
      a: "Bangkok has English-speaking dental clinics with international standards at 50–70% lower cost than Western countries. Implants ฿35,000–80,000 per tooth (vs $3,000–6,000 in US). Teeth whitening ฿4,000–12,000. Veneers ฿12,000–30,000/tooth vs $1,500–3,000 in the US. Many Bangkok clinics hold international accreditation (JCI or TEMOS) and use the same implant brands (Straumann, Nobel Biocare) as Western clinics.",
    },
    {
      q: "What is the best dental clinic in Bangkok?",
      a: "The best Bangkok dental clinic depends on your procedure. For implants, look for clinics with Trust Score 80+ that specifically mention Straumann or Nobel Biocare implants in their reviews. For cosmetic veneers, clinics with dedicated cosmetic dentists and CAD/CAM same-day milling are preferable. Our Trust Score ranking on this page is built from each clinic's own Google reviews — read the low-star reviews on a clinic's page before you book, not just the score.",
    },
    {
      q: "How much do dental implants cost in Bangkok?",
      a: "Bangkok dental implant costs (full restoration, implant + abutment + crown): Straumann/Nobel Biocare (Switzerland/Sweden) ฿55,000–80,000 per tooth; Osstem/Astra (Korea/Sweden) ฿35,000–55,000 per tooth; generic unbranded ฿20,000–30,000 (not recommended). All-on-4 full arch: ฿250,000–500,000. Compare: US $3,000–6,000 per implant (฿105,000–210,000). Bangkok saves 50–70%.",
    },
    {
      q: "How long does dental implant treatment take in Bangkok?",
      a: "Typical timeline: Day 1 consultation + extraction; 3–6 month osseointegration period (you fly home); Day 1 of return trip crown placement. Same-day immediate-load implants are offered by some Bangkok clinics for ฿15,000–25,000 surcharge but require strong jawbone density. All-on-4 full-arch usually finishes in 5–7 day single trip.",
    },
    {
      q: "Can I get Invisalign in Bangkok?",
      a: "Yes — Bangkok is a popular destination for Invisalign treatment. Official Invisalign providers charge ฿80,000–200,000 for full treatment (vs $4,000–8,000 in US). Many patients start treatment in Bangkok, continue with a local dentist at home using the Invisalign app, and return for periodic check-ups. Clinics with Invisalign Diamond or Platinum status indicate high case volume and experience.",
    },
    {
      q: "How much do dental crowns cost in Bangkok?",
      a: "Bangkok dental crown prices: porcelain-fused-to-metal (PFM) ฿6,000–12,000; full ceramic/E.max ฿10,000–20,000; zirconia ฿8,000–18,000. Compare: US $1,000–2,000 per crown. Same-day CEREC/CAD-CAM crowns (milled in-clinic) available at premium clinics for ฿12,000–22,000.",
    },
    {
      q: "Which implant brands do Bangkok dentists use?",
      a: "Premium clinics use Straumann (Switzerland) and Nobel Biocare (Sweden) — most established, ฿55,000–80,000 per tooth fully restored. Mid-tier Osstem (Korea) and Astra (Sweden) ฿35,000–55,000. Avoid generic / unbranded implants priced under ฿30,000 — long-term failure rates are 2–3× higher.",
    },
    {
      q: "Is Bangkok dental tourism safe for major procedures?",
      a: "For routine treatments (whitening, fillings, crowns, implants) — yes, when you pick a Trust Score 75+ clinic. For complex full-mouth reconstruction or aesthetic dentistry, allow extra consultation visits before flying. Insurance: most travel policies cover urgent dental emergencies but not elective procedures — get pre-authorization in writing.",
    },
    {
      q: "Can I get veneers done in Bangkok?",
      a: "Bangkok offers porcelain veneers ฿12,000–30,000 per tooth, composite ฿4,000–8,000. Full smile makeover (8 upper veneers) typically ฿100,000–240,000 vs $15,000–25,000 in US/UK. Same-day E.max veneers (CAD/CAM milled in-clinic) available at premium clinics — single visit completion possible.",
    },
    {
      q: "Do Bangkok dentists speak English?",
      a: "Yes — international dental clinics in Bangkok are well-equipped for English-speaking patients. Most dentists trained abroad (US, UK, Australia, or Japan) or at Thai universities with international programs. Clinics in Sukhumvit, Silom, and Ratchadamri cater especially to medical tourists. Our clinic pages show patient reviews mentioning language: search 'English' in the review excerpts to verify.",
    },
  ],
  hair: [
    {
      q: "How much does FUE hair transplant cost in Thailand?",
      a: "Bangkok FUE: ฿65,000–150,000 for 2000 grafts (per-graft basis ฿35–80). DHI (Choi pen technique): ฿85,000–200,000 for 2000 grafts. Beard restoration: ฿50,000–120,000. Eyebrow: ฿35,000–80,000. Compare: Korea ฿200,000–400,000, US/UK $8,000–25,000 for same procedure.",
    },
    {
      q: "Is SMP (scalp micropigmentation) available in Bangkok?",
      a: "Yes — Bangkok SMP specialists charge ฿15,000–50,000 per session for full scalp coverage, typically 2–3 sessions for complete result. Look for clinics using genuine Scalp Aesthetics or Folliclum pigments. Cheaper alternatives use generic tattoo ink that fades to blue/green within 18 months.",
    },
    {
      q: "How long should I stay in Bangkok for hair transplant?",
      a: "Minimum 4–5 days: Day 1 arrival + consultation, Day 2 procedure (6–9 hours), Day 3–4 recovery and post-op check, Day 5 fly home. Some patients stay 7+ days for additional rest. Results visible 6–9 months post-procedure; full result at 12 months. No second visit required for most cases.",
    },
    {
      q: "Which Bangkok hair clinics specialize in Korean / Western patients?",
      a: "Clinics that serve many medical tourists usually offer English-speaking coordinators and package pricing — check each clinic's reviews for comments from foreign patients. Bangkok clinics in Sukhumvit, Thong Lor, and Asok district tend to handle the highest volume of international hair transplant patients.",
    },
    {
      q: "Are there men-only clinics in Bangkok?",
      a: "Yes — HE Clinic for Men, Men's Health Clinic Bangkok, Homme Clinic, Crimson Men's Art, Slate Clinic for Men, and Alpha Men Clinic operate as men-only or men-priority practices. They cover male anti-aging, TRT (testosterone replacement), hair restoration, body grooming laser, and male-pattern skin care in private settings. Most cluster in Sukhumvit, Thong Lor, and Phloen Chit for international and expat foot traffic.",
    },
    {
      q: "How much does TRT (testosterone replacement therapy) cost in Bangkok?",
      a: "Initial hormone panel + consultation: ฿3,500–8,000. Monthly TRT injection protocol: ฿4,500–12,000 depending on testosterone cypionate/enanthate brand. Pellet implants (3–6 month sustained release): ฿35,000–80,000 per insertion. Compare to US: ~$200–500/month plus ~$300 consultation. BDMS Wellness, VitalLife (Bumrungrad), and Addlife Anti-Aging Center are the most cited centers for legitimate TRT in Bangkok.",
    },
    {
      q: "What men's anti-aging and wellness treatments are most popular in Bangkok?",
      a: "Top treatments by demand: (1) IV nutrient drip (NAD+/glutathione, ฿2,500–8,000/session), (2) testosterone/hormone panels + TRT, (3) HIFU and microneedling RF for jawline tightening (฿8,000–30,000/session), (4) hair restoration (FUE/DHI/PRP), (5) male body laser hair removal (฿2,000–6,000/area), (6) male-pattern acne/scar laser. VitalLife (Bumrungrad), BDMS Wellness, and Vector Men Medical are among the most reviewed men's wellness centers.",
    },
    {
      q: "What's the difference between a men's clinic, a hair clinic, and a regular aesthetic clinic?",
      a: "Men's clinics offer privacy (no women's salon environment), male-focused service menu (TRT, beard transplant, body grooming, male skin), and male-trained practitioners. Hair clinics specialize in scalp/follicle work (FUE, DHI, SMP, PRP) but may serve both genders. Regular aesthetic clinics cover all genders with broader services (filler, botox, laser, facial). Many male patients prefer dedicated men's clinics for the privacy and curated service menu, especially for TRT and body grooming.",
    },
    {
      q: "Where can I get male body hair removal (laser/IPL) in Bangkok?",
      a: "Most men's clinics and aesthetic chains (Wuttisak, Nitipon, Apex, Romrawin) offer male body laser packages. Chest/back: ฿3,500–8,000/session, full arm: ฿2,500–5,000, full leg: ฿4,500–9,000. Diode laser is most effective for darker, thicker male body hair. Permanent reduction typically takes 6–10 sessions spaced 4–6 weeks apart. Some clinics offer men-only laser bays for privacy.",
    },
  ],
};

export const HOME_FAQS: Faq[] = [
  {
    q: "Which sources do you aggregate reviews from?",
    a: "Google Maps reviews for every clinic — they are what the Trust Score is built from. Where available we add HDmall package prices and mentions from Pantip, Thailand's largest forum; a clinic page only shows those when they exist for that clinic.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines: clinic rating (~45% weight), review volume on logarithmic scale (~35%), Local Guide reviewer ratio (~15%), and rating consistency over time (~5%). Weights sum to 100%. It's an automated opinion metric — not a Google ranking and not a verified finding about any clinic. We update it every 30 minutes. See /methodology for full details.",
  },
  {
    q: "Are these clinic listings sponsored?",
    a: "No. Clinics are listed from public Google Maps listings. We are not affiliated with any clinic and no clinic pays for organic placement. Sponsored slots are clearly labelled when present.",
  },
  {
    q: "How fresh is this data?",
    a: "Listings and Trust Scores rebuild approximately every 30 minutes from continuous multi-platform scraping. Sample reviews shown on each clinic page are real, recent excerpts with full attribution to their source platform.",
  },
  {
    q: "Can I trust the reviews shown here?",
    a: "Reviews come from public Google Maps listings. We do not edit them, and sample reviews are picked by length and rating only, with attribution.",
  },
  {
    q: "Is medical treatment in Bangkok safe for tourists?",
    a: "Thailand's Medical Council licenses all practitioners. Bangkok's private hospitals (Bumrungrad, BNH, Samitivej) and clinics serving medical tourists operate under JCI or TEMOS international accreditation. For aesthetic and dental procedures at clinics in this directory: choose Trust Score 75+ clinics with 100+ reviews and verified multi-platform ratings. For complex surgeries, add the Dental or Aesthetic clinic's international accreditation number to your checklist.",
  },
  {
    q: "How much money can I save on dental or aesthetic work in Bangkok?",
    a: `We have no like-for-like price data for other countries, so we do not quote a saving. What we publish are Bangkok listed prices with their sources at /prices: Botox a typical ${MED(AP.botoxPerUnit)} per unit, one cc of filler ${MED(AP.filler1cc)}. Compare against a quote at home for the same brand and amount.`,
  },
];
