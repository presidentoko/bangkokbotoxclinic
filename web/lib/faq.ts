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
      q: "Are Bangkok botox clinics safe?",
      a: "The clinics in this directory all hold Thai medical licenses and operate publicly on Google Maps. Trust Score above 70 indicates strong reviewer credibility (Local Guides, high review volume, recent positive trend). Always verify the brand authenticity at consultation — review excerpts mentioning 'genuine brand' indicate clinics with strong brand-verification practices.",
    },
    {
      q: "Which Bangkok district is best for botox?",
      a: "Pathum Wan (Siam) and Watthana (Sukhumvit, Thong Lor, Phrom Phong) have the highest concentration of botox-specialist clinics with English-speaking staff. Phaya Thai (including Ari) offers more local pricing with shorter wait times.",
    },
    {
      q: "How long does Bangkok botox last?",
      a: "Standard duration is 3–4 months, similar to other countries. Effect duration depends on dosage, brand, treatment area, and individual metabolism, not country of treatment.",
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
      a: "Bangkok has English-speaking dental clinics with international standards at 50–70% lower cost than Western countries. Implants ฿35,000–80,000 per tooth (vs $3,000–6,000 in US). Teeth whitening ฿4,000–12,000.",
    },
    {
      q: "How long does dental implant treatment take in Bangkok?",
      a: "Typical timeline: Day 1 consultation + extraction; 3–6 month osseointegration period (you fly home); Day 1 of return trip crown placement. Same-day immediate-load implants are offered by some Bangkok clinics for ฿15,000–25,000 surcharge but require strong jawbone density. All-on-4 full-arch usually finishes in 5–7 day single trip.",
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
      a: "Bookimed-verified medical tourism clinics offer Korean/English translators and pre-negotiated package pricing including hotel + transfer. Bangkok clinics in Sukhumvit, Thong Lor, and Asok district tend to handle the highest volume of international hair transplant patients.",
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
    a: "Google Maps (primary, anchor reviews), HDmall (Thai package pricing + ratings), Wongnai (Thai consumer reviews), Bookimed (medical tourism), Pantip (Thai forums), Reddit, and Naver blogs (Korean visitors). Each clinic page shows which platforms contributed data. Cross-source aggregation makes single-platform fake reviews ineffective at lifting rank.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines: clinic rating (50% weight), review volume on logarithmic scale (40%), Local Guide reviewer ratio (10%), and reviewer authority via average reviewer review count (5%). It's our derived metric — not a Google ranking. Anchored on Google Maps with cross-validation from HDmall, Wongnai and other platforms. We update it every 30 minutes.",
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
];
