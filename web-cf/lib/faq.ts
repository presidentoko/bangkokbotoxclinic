import { dentalPriceFacts, spanText, baht } from "@/lib/dentalPriceGuide";
import { getBenchmark } from "@/lib/publishedPrices";
// 가격 숫자는 가격 가이드 데이터에서 (2026-10-30, 출처 없는 하드코딩 교체).
const PF = dentalPriceFacts();
const S = (s: Parameters<typeof spanText>[0]) => spanText(s) ?? "—";
const CROWN = getBenchmark("crown");
const CROWN_MID = CROWN ? `${baht(CROWN.p25)}–${baht(CROWN.p75)}` : "—";

// 카테고리별 FAQ — AEO + Google FAQPage 리치결과 + 페이지 콘텐츠 unique 강화.
// 향후 LLM 으로 더 풍부하게 생성 가능. 현재는 hand-written 베이스.

export type Faq = { q: string; a: string };

export const CATEGORY_FAQS: Record<string, Faq[]> = {
  botox: [
    {
      q: "How much does Botox cost in Bangkok?",
      a: "Botox in Bangkok typically ranges from ฿80–250 per unit depending on the brand (Allergan/Botox-original, Dysport, Botulax) and the clinic. Forehead treatments use 10–20 units, while a full upper face uses 30–60 units. Compare individual clinic pricing on each clinic's detail page.",
    },
    {
      q: "Is botox cheaper in Bangkok than in the US or UK?",
      a: "Yes — significantly. Bangkok botox costs ฿80–250/unit (roughly $2–7 USD), compared to $10–20/unit in the US and £8–15/unit in the UK. A full upper-face treatment (30–50 units) costs ฿4,000–12,000 in Bangkok vs $400–1,000 in the US. Savings of 60–80% are typical at reputable clinics with international standards.",
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
      a: "Five rules: (1) Use Trust Score 70+ clinics — with 100+ Google reviews. (2) Ask to see the original sealed vial before injection. (3) Insist on a licensed doctor (not nurse or technician) performing the injection. (4) Avoid deals below ฿80/unit — underpriced botox is often diluted or counterfeit. (5) Read the Google review excerpts on our clinic pages — patients mention 'genuine brand', 'real Allergan', etc. when they were satisfied.",
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
      a: "HA fillers (Juvederm, Restylane, Belotero) range from ฿8,000–25,000 per syringe (1ml) depending on brand and clinic. Lip enhancement typically uses 1ml; cheek volumising 2–4ml; jawline 3–6ml. Many clinics package multi-syringe deals.",
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
      a: "Single HIFU session prices in Bangkok range from ฿8,000 (basic Korean machine) to ฿80,000+ (Ultherapy with Merz authentication). Triple-session packages typically discount 20–30%. Verify the machine brand and shot count before booking.",
    },
    {
      q: "Is Ultherapy or Thermage better?",
      a: "Ultherapy uses ultrasound (HIFU) and is best for skin tightening with deeper SMAS-layer effect. Thermage uses radiofrequency, more comfortable, better for surface-level tightening. Many Bangkok clinics offer both. Single Ultherapy session lasts ~12 months; Thermage ~24 months.",
    },
    {
      q: "Does HIFU hurt?",
      a: "Most reviewers describe Bangkok HIFU sessions as moderately uncomfortable but tolerable, with topical numbing cream. Higher shot counts and deeper SMAS lines are more sensitive. Clinics with reviewers mentioning 'no pain' often use stronger numbing protocols.",
    },
  ],
  facial: [
    {
      q: "What's included in a Bangkok facial?",
      a: "Standard facials include cleansing, exfoliation, extraction, mask, and moisturiser — usually ฿1,500–4,000 for 60–90 minutes. Premium facials add LED therapy, microcurrents, oxygen infusion, or HydraFacial machines, ranging ฿4,000–12,000.",
    },
    {
      q: "How often should I get a facial in Bangkok?",
      a: "Most aesthetic dermatologists recommend monthly facials for active maintenance, or every 6–8 weeks for general skin health. Many Bangkok clinics offer monthly subscription packages.",
    },
  ],
  laser: [
    {
      q: "What laser treatments are popular in Bangkok?",
      a: "Pico laser (pigmentation, tattoo removal), CO2 fractional (acne scars, resurfacing), IPL (sun damage, redness), and laser hair removal are most common. Pico session: ฿3,000–8,000. CO2: ฿8,000–25,000.",
    },
    {
      q: "Is laser hair removal in Bangkok worth it?",
      a: "Yes — Bangkok prices are roughly 30–50% lower than Singapore or Hong Kong. A full-leg package (8 sessions) typically costs ฿15,000–30,000. Use diode laser for darker skin tones; alexandrite for lighter tones.",
    },
  ],
  dental: [
    {
      q: "Why is Bangkok popular for dental work?",
      a: `Bangkok has many English-speaking dental clinics, and many publish their prices. In the listings we compared, a single implant with a crown runs ${S(PF.implantWithCrown)} depending on the brand, a ceramic veneer ${S(PF.veneerCeramic)} per tooth, and an in-clinic whitening session ${S(PF.whiteningInClinic)}. Our price guides at /prices give the source and date for each figure. Ask each clinic which implant brand it uses and check the dentist's licence.`,
    },
    {
      q: "What is the best dental clinic in Bangkok?",
      a: "The best Bangkok dental clinic depends on your procedure. For implants, look for clinics with Trust Score 80+ that specifically mention Straumann or Nobel Biocare implants in their reviews. For cosmetic veneers, clinics with dedicated cosmetic dentists and CAD/CAM same-day milling are preferable. Our Trust Score ranking on this page is built from each clinic's own Google reviews — read the low-star reviews on a clinic's page before you book, not just the score.",
    },
    {
      q: "How much do dental implants cost in Bangkok?",
      a: `Listed prices for one implant with a crown: Korean brands (Osstem, Dentium, Neo Biotech) ${S(PF.implantKoreanBrands)}, Straumann ${S(PF.implantStraumann)}. Bone grafts and extractions cost extra. Every listing, with its source, is on /prices/dental-implant-cost-bangkok.`,
    },
    {
      q: "How long does dental implant treatment take in Bangkok?",
      a: "Typical timeline: Day 1 consultation + extraction; 3–6 month osseointegration period (you fly home); Day 1 of return trip crown placement. Same-day immediate-load implants are offered by some Bangkok clinics for ฿15,000–25,000 surcharge but require strong jawbone density. All-on-4 full-arch usually finishes in 5–7 day single trip.",
    },
    {
      q: "Can I get Invisalign in Bangkok?",
      a: `Yes. Bangkok clinics list full Invisalign courses for both arches at ${S(PF.invisalign)}, depending on the tier (Express up to Comprehensive). Each tier's range is on /prices/invisalign-cost-bangkok.`,
    },
    {
      q: "How much do dental crowns cost in Bangkok?",
      a: `Across ${CROWN?.clinics ?? 0} clinics' published price lists, a crown typically costs ${CROWN ? baht(CROWN.median) : "—"}, with the middle half between ${CROWN_MID}. The material (metal-ceramic, full ceramic or zirconia) changes the price, so ask which one you are quoted.`,
    },
    {
      q: "Which implant brands do Bangkok dentists use?",
      a: `In the listings we compared, the brands named are Osstem, Dentium and Neo Biotech (Korea), plus Neodent, SIC and Straumann. With a crown, Korean-brand implants are listed at ${S(PF.implantKoreanBrands)} and Straumann at ${S(PF.implantStraumann)}. Ask which brand is in your quote and keep the implant card.`,
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
    a: "Trust Score (0-100) combines: clinic rating (~45% weight), review volume on logarithmic scale (~35%), Local Guide reviewer ratio (~15%), and rating consistency over time (~5%). Weights sum to 100%. It's an automated opinion metric — not a Google ranking and not a verified finding about any clinic. Anchored on Google Maps with cross-validation from HDmall, Wongnai and other platforms. We update it every 30 minutes. See /methodology for full details.",
  },
  {
    q: "Are these clinic listings sponsored?",
    a: "No. All clinics are listed based on public listings across Google Maps, HDmall, Wongnai and partner platforms. We are not affiliated with any clinic and no clinic pays for organic placement. Sponsored slots are clearly labelled when present.",
  },
  {
    q: "How fresh is this data?",
    a: "Listings and Trust Scores rebuild approximately every 30 minutes from continuous multi-platform scraping. Sample reviews shown on each clinic page are real, recent excerpts with full attribution to their source platform.",
  },
  {
    q: "Can I trust the reviews shown here?",
    a: "All reviews are sourced directly from public platforms — Google Maps, HDmall, Wongnai, Bookimed, and others. We don't filter, edit, or selectively show reviews — sample reviews are picked by length and rating only, with full attribution. Cross-platform agreement (a clinic well-rated on both Google AND HDmall AND Wongnai) is a much stronger signal than any single platform.",
  },
  {
    q: "Is medical treatment in Bangkok safe for tourists?",
    a: "Thailand's Medical Council licenses all practitioners. Bangkok's private hospitals (Bumrungrad, BNH, Samitivej) and clinics serving medical tourists operate under JCI or TEMOS international accreditation. For aesthetic and dental procedures at clinics in this directory: choose Trust Score 75+ clinics with 100+ reviews and verified multi-platform ratings. For complex surgeries, add the Dental or Aesthetic clinic's international accreditation number to your checklist.",
  },
  {
    q: "How much money can I save on dental or aesthetic work in Bangkok?",
    a: `We have no like-for-like comparison with US, UK or Australian prices, so we do not quote a saving. What we publish are Bangkok listed prices with their sources at /prices: one implant with a crown ${S(PF.implantWithCrown)}, a ceramic veneer ${S(PF.veneerCeramic)} per tooth. Compare against a quote at home for the same brand and procedure.`,
  },
];
