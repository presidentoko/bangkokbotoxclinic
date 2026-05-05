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
  ],
};

export const HOME_FAQS: Faq[] = [
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines: clinic rating (50% weight), review volume on logarithmic scale (40%), Local Guide reviewer ratio (10%), and reviewer authority via average reviewer review count (5%). It's our derived metric — not a Google ranking. We update it every 30 minutes from public Google Maps data.",
  },
  {
    q: "Are these clinic listings sponsored?",
    a: "No. All clinics are listed based on Google Maps public data. We are not affiliated with any clinic and no clinic pays for placement or ranking. Sponsored slots are clearly labelled when present.",
  },
  {
    q: "How fresh is this data?",
    a: "Listings and Trust Scores rebuild approximately every 30 minutes from continuous Google Maps scraping. Sample reviews shown on each clinic page are real, recent excerpts from public Google reviews.",
  },
  {
    q: "Can I trust the reviews shown here?",
    a: "All reviews are sourced directly from Google Maps. We don't filter, edit, or selectively show reviews — sample reviews are picked by length and rating only, with full attribution. Local Guide counts indicate how many reviewers are Google-verified high-credibility users.",
  },
];
