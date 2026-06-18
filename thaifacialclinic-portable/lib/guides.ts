// Guide topic definitions — each topic filters the sidecar CSVs (reddit/pantip/naver)
// into a curated reading list for SEO long-tail coverage.

export type GuideTopic = {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  intro: string;
  sections?: { heading: string; body: string }[];
  faqs?: { q: string; a: string }[];
  reddit?: { query?: RegExp; subreddit?: RegExp; title?: RegExp };
  pantip?: { title?: RegExp };
  naver?: { query?: RegExp; title?: RegExp };
};

export const GUIDES: GuideTopic[] = [
  {
    slug: "fue-reviews",
    title: "FUE Hair Transplant Reviews in Thailand",
    intro: "Real patient experiences with Follicular Unit Extraction (FUE) in Thai clinics. From budget Bangkok options to premium tourist-focused providers. Reddit + Pantip + Naver blog accounts, ranked by community engagement.",
    reddit: { query: /FUE|fue/, title: /FUE|fue/ },
    pantip: { title: /FUE|ปลูกผม.*FUE/i },
    naver: { query: /FUE|fue|모발이식/ },
  },
  {
    slug: "dhi-reviews",
    title: "DHI Hair Transplant Reviews in Thailand",
    intro: "Direct Hair Implantation patient stories — the premium technique using Choi pens. Higher cost, denser results. What Thai patients and medical tourists actually got.",
    reddit: { query: /DHI|dhi/, title: /DHI|dhi/ },
    pantip: { title: /DHI/i },
    naver: { query: /DHI|dhi/ },
  },
  {
    slug: "smp-scalp-tattoo",
    title: "SMP (Scalp Micropigmentation) in Thailand",
    intro: "Scalp tattooing — non-surgical alternative for shaved-head look or scar camouflage. Reviews from people who chose Bangkok for this procedure.",
    reddit: { query: /SMP|micropigmentation|scalp tattoo/i, title: /SMP|scalp/i },
    pantip: { title: /สักศีรษะ|두피문신|SMP/i },
    naver: { query: /SMP|두피문신/ },
  },
  {
    slug: "bangkok-hair-clinic-guide",
    title: "Bangkok Hair Transplant Clinic Guide",
    intro: "Everything international patients wish they knew before booking a Bangkok hair clinic. Real Reddit threads, Pantip discussions, and Korean blogger posts.",
    reddit: { query: /bangkok/i, title: /bangkok/i },
    pantip: { title: /กรุงเทพ|bangkok/i },
    naver: { query: /방콕|bangkok/i },
  },
  {
    slug: "korean-friendly-clinics",
    title: "Korean-Friendly Hair Clinics in Thailand",
    intro: "Naver blog posts from Korean patients who got hair transplants in Bangkok / Phuket. Clinics with Korean coordinators, recovery costs in 원.",
    naver: { query: /태국|방콕|푸켓/ },
    reddit: { title: /korean|seoul/i },
  },
  {
    slug: "scar-revision-cover",
    title: "Hair Transplant Scar Cover-Up",
    intro: "FUT linear scar, prior bad transplant — Thai clinics with SMP + FUE camouflage experience. Patient stories on what worked.",
    reddit: { query: /scar/i, title: /scar/i },
  },
  {
    slug: "hair-loss-women",
    title: "Female Hair Loss Treatment in Thailand",
    intro: "Less common but growing — female-pattern hair loss treatment options. PRP, FUE, scalp treatment. Patient perspectives.",
    reddit: { title: /female|woman|women/i },
    pantip: { title: /ผู้หญิง|ผม.*หญิง/ },
  },
  {
    slug: "thailand-vs-turkey",
    title: "Thailand vs Turkey Hair Transplant — Cost & Quality",
    intro: "The two cheapest medical-tourism destinations for hair transplants. Real comparisons from patients who looked at both — flights, recovery, follow-up.",
    reddit: { title: /turkey|turkish|istanbul/i },
  },
  {
    slug: "thailand-vs-korea",
    title: "Thailand vs Korea Hair Transplant",
    intro: "Korea = premium, Thailand = cost-savings. When does the price difference actually buy you better results? Reddit + Naver community wisdom.",
    reddit: { title: /korea/i },
    naver: { title: /태국.*한국|한국.*태국/ },
  },
  {
    slug: "head-spa-scalp-treatment",
    title: "Head Spa & Scalp Treatment Bangkok",
    intro: "Pre/post-transplant scalp care — head spa, PRP, scaling. Where Bangkok locals and visitors go.",
    reddit: { query: /head spa|scalp/i },
    pantip: { title: /head spa|สเกล.*หนังศีรษะ|รักษาหนังศีรษะ/i },
  },
  {
    slug: "hair-transplant-cost-bangkok",
    metaTitle: "Hair Transplant Cost Bangkok 2026 — Full Price Guide",
    metaDescription: "FUE costs ฿40,000–130,000. DHI costs ฿60,000–180,000. Full breakdown of what drives Bangkok hair transplant prices, what's included, and how to compare quotes.",
    title: "Hair Transplant Cost in Bangkok 2026 — Full Price Guide",
    intro: "Bangkok is one of the most cost-effective destinations for hair transplants globally — but prices vary 3–4× between clinics offering seemingly identical procedures. This guide breaks down what you'll actually pay, what drives the price difference, and what \"full package\" really means.",
    sections: [
      {
        heading: "What does a Bangkok hair transplant cost?",
        body: "FUE (Follicular Unit Extraction): ฿40,000–130,000 depending on graft count and clinic tier. Budget tier (฿40k–65k): volume-focused clinics, often in Pratunam or On Nut, Korean tour-group clients common. Mid tier (฿65k–100k): English-speaking coordinators, FDA-certified surgeons, Sukhumvit area. Premium tier (฿100k+): hospital-affiliated or internationally-accredited, full-day surgeon involvement. DHI (Direct Hair Implantation): typically 30–50% more than FUE equivalent at the same clinic, due to Choi pen consumable cost and longer procedure time.",
      },
      {
        heading: "FUE vs DHI vs FUT — price breakdown",
        body: "FUE: most common, best value. 2,000 grafts runs ฿50,000–95,000. 4,000 grafts ฿80,000–150,000. DHI: higher cost, suited for density work and non-shave procedures. 2,000 grafts ฿70,000–130,000. FUT (strip): least common now, lowest graft cost but leaves a linear scar. SMP (Scalp Micropigmentation): ฿15,000–50,000 for full head — non-surgical, permanent ink alternative. Many Bangkok clinics offer combination packages (e.g. FUE + PRP post-op) that reduce total cost.",
      },
      {
        heading: "What drives the price difference between clinics?",
        body: "Surgeon involvement: some budget clinics use technicians for extraction and implantation with a surgeon only signing off. Premium clinics have the surgeon at the table for the full procedure. Graft survival rate: premium clinics claim 90–95%+ survival; budget clinics rarely publish this figure. Equipment: FUE motorised punch quality varies widely. Cheap punches cause more transaction damage. Package inclusions: PRP therapy, mesotherapy, finasteride prescription, and 1-year follow-up are bundled at premium clinics — add-on at budget ones. Clinic location: Sukhumvit-Thonglor premium adds 20–30% over Pratunam for identical surgeon quality.",
      },
      {
        heading: "What's included — and what's not",
        body: "Usually included: consultation, procedure itself, post-op kit (shampoo, spray, antibiotics), one follow-up visit. Often NOT included: airport transfer (฿300–800), accommodation near clinic (฿1,500–4,000/night), PRP treatment (฿8,000–15,000 extra), follow-up visits after 30 days, SMP touch-up if needed, finasteride/minoxidil ongoing prescription. Budget clinics often quote a low headline price and add-on the above.",
      },
      {
        heading: "Hidden costs: accommodation, flights, follow-up",
        body: "Most patients fly home within 5–7 days. Minimum budget: flights + 6 nights accommodation + procedure. From Europe: flights ฿25,000–45,000 return. Accommodation near major clinics: ฿1,500–3,500/night mid-range. Total trip for a 3,000-graft FUE: ฿120,000–200,000 all-in. Compare: UK equivalent ฿300,000–500,000+. Turkey: ฿80,000–120,000 all-in (but lower average surgeon experience, per Reddit). Important: factor in a 12-month follow-up — most reputable Bangkok clinics offer virtual consultations free; some charge ฿2,000–5,000 for in-person after 12 months.",
      },
      {
        heading: "How to compare quotes fairly",
        body: "Ask every clinic: (1) Total graft count quoted — and how they measured your donor density. (2) Will the named surgeon perform the full procedure or hand off to technicians? (3) What is the graft survival rate guarantee? (4) What is included in the quoted price? (5) Do you have before/after photos from patients with similar Norwood scale? Never compare two quotes just by total price — graft count, surgeon involvement, and post-op protocol are the real variables. Our Trust Score aggregates Google + Bookimed + Reddit reviews to surface clinics with consistent results over time.",
      },
    ],
    faqs: [
      { q: "What is the average cost of a hair transplant in Bangkok?", a: "A 2,000-graft FUE procedure at a mid-tier Bangkok clinic costs approximately ฿65,000–95,000 (USD 1,800–2,600). DHI at the same count runs ฿90,000–130,000. Premium hospital-grade clinics can reach ฿150,000+ for the same graft count. Budget clinics start around ฿40,000 but often exclude PRP and follow-up." },
      { q: "Is FUE or DHI cheaper in Bangkok?", a: "FUE is consistently cheaper — typically 30–50% less than DHI at the same clinic for the same graft count. DHI costs more due to Choi pen consumables and longer implantation time. For most patients, FUE from a skilled surgeon produces equivalent density results." },
      { q: "Why do prices vary so much between Bangkok clinics?", a: "The key drivers are: (1) surgeon vs technician involvement, (2) clinic location (Sukhumvit premium vs Pratunam budget), (3) equipment quality (punch diameter, motorised vs manual), (4) what is bundled vs add-on (PRP, follow-up visits, post-op medication). Clinics with identical advertised procedures can differ by 3× in actual quality of execution." },
      { q: "Does the quote include follow-up appointments?", a: "Usually one 7-day post-op check is included. The 1-month and 12-month follow-ups are included at premium clinics, add-on (฿2,000–5,000) or virtual-only at budget clinics. Always confirm in writing before booking." },
    ],
    reddit: { query: /cost|price|cheap|expensive|budget/i, title: /cost|price|Bangkok/i },
    pantip: { title: /ราคา.*ปลูกผม|ปลูกผม.*ราคา/i },
    naver: { query: /비용|가격|방콕.*모발이식/ },
  },
  {
    slug: "fue-vs-dhi",
    metaTitle: "FUE vs DHI Hair Transplant Bangkok — Which Is Better? (2026)",
    metaDescription: "FUE vs DHI: key differences in technique, density, recovery, and cost. Which is better for Bangkok medical tourists in 2026?",
    title: "FUE vs DHI Hair Transplant — Which Is Better for Bangkok?",
    intro: "FUE and DHI are the two most common hair transplant techniques offered in Bangkok. Both use individual follicle extraction — the difference is in how grafts are implanted. This guide covers the real clinical tradeoffs, what Reddit patients report, and how to decide based on your situation.",
    sections: [
      {
        heading: "What is FUE (Follicular Unit Extraction)?",
        body: "In FUE, individual hair follicles are extracted from the donor area using a circular punch tool (0.7–0.9mm diameter), then implanted into pre-made channels in the recipient area. The surgeon (or senior technician) makes the incisions first, then grafts are placed. FUE is the gold standard for most hair loss patterns. Advantages: lower cost, suitable for larger sessions (3,000–5,000+ grafts), widespread surgeon experience. Disadvantages: requires shaving the donor area (usually), slightly lower density achievable per cm² vs DHI.",
      },
      {
        heading: "What is DHI (Direct Hair Implantation)?",
        body: "DHI uses a Choi implanter pen — a hollow needle that extracts and implants in one step, without pre-made channels. The surgeon loads each follicle into the pen and places it directly. Advantages: no pre-made incisions means the surgeon controls depth, angle, and direction precisely. Better for density work and non-shave (unshaved) procedures — common request for women and men wanting to hide the procedure. Disadvantages: slower per session (typically max 2,500 grafts/day vs 3,000–5,000 for FUE), higher cost (Choi pens are single-use, costly), fewer Bangkok surgeons with deep DHI experience.",
      },
      {
        heading: "Key differences at a glance",
        body: "Channel creation: FUE = pre-made (sapphire or steel blade), DHI = Choi pen (no separate channel step). Shaving requirement: FUE usually requires full shave, DHI can do unshaved for smaller sessions. Graft count per day: FUE handles 2,000–5,000, DHI typically 1,500–2,500. Density achievable: DHI slightly higher density possible in target areas. Recovery: similar — 7–14 days before social presentability. Scarring: both leave tiny dot scars in donor area. Cost differential: DHI is 30–50% more expensive at equivalent Bangkok clinics.",
      },
      {
        heading: "Which technique gives better density?",
        body: "In skilled hands, both techniques yield similar long-term density at 12 months. DHI has a theoretical advantage in dense-packing because the surgeon controls implantation angle without surrounding tissue disruption from pre-made channels. However: the surgeon's experience matters more than the technique. A skilled FUE surgeon will outperform an inexperienced DHI surgeon every time. Reddit consensus (r/HairTransplants): most patients who chose Bangkok for DHI specifically cited the 'no-shave' option or specific high-density crown work — not a general belief DHI is superior.",
      },
      {
        heading: "Which is right for you?",
        body: "Choose FUE if: you need 3,000+ grafts in a single session, cost is a significant factor, full shave is acceptable. Choose DHI if: you want minimal shaving (women, men with longer hair), targeting crown density, willing to pay 30–50% premium. Consider combined: some Bangkok clinics do FUE extraction + DHI implantation (best-of-both, but adds time and cost). Ask your surgeon specifically: how many DHI procedures have you personally performed (not the clinic total)? Under 200 personal cases = limited experience.",
      },
    ],
    faqs: [
      { q: "Is DHI better than FUE for hair transplant?", a: "Not universally. DHI offers advantages for no-shave procedures and precise density work. FUE is better for large sessions (3,000+ grafts) and is more widely available from experienced Bangkok surgeons. For most male-pattern baldness cases, FUE from a high-trust clinic produces equivalent 12-month results." },
      { q: "Does DHI cost more than FUE in Bangkok?", a: "Yes — typically 30–50% more at the same clinic for the same graft count. A 2,000-graft FUE at ฿80,000 would be approximately ฿110,000–120,000 as DHI. The premium is due to Choi pen consumable cost and longer implantation time." },
      { q: "Which technique has a shorter recovery time?", a: "Recovery is very similar for both — most patients are back to normal activity within 7–10 days. The transplanted area looks presentable (scabs fallen off) at 10–14 days. Full density results appear at 10–12 months for both FUE and DHI." },
      { q: "Can I get both FUE and DHI at the same clinic in Bangkok?", a: "Yes — many premium Bangkok clinics offer combination procedures: FUE for extraction (efficient) + DHI Choi pen for implantation (precision). This hybrid approach adds time and cost but is offered at most higher-tier clinics in the Sukhumvit area." },
    ],
    reddit: { query: /FUE.*DHI|DHI.*FUE|vs DHI|vs FUE/i, title: /FUE.*DHI|DHI.*FUE/i },
    pantip: { title: /FUE.*DHI|DHI.*FUE|เปรียบเทียบ.*ปลูกผม/i },
    naver: { query: /FUE.*DHI|DHI.*FUE|비교/ },
  },
  {
    slug: "best-hair-transplant-bangkok",
    metaTitle: "Best Hair Transplant Clinics Bangkok 2026 — Trust Score Ranked",
    metaDescription: "The best Bangkok hair transplant clinics ranked by Trust Score from 134 verified clinics. Vetted by real Google, Bookimed, Reddit, and Naver reviews.",
    title: "Best Hair Transplant Clinics in Bangkok 2026 — Trust Score Ranking",
    intro: "With 134 verified hair transplant clinics in our database, picking the right one matters. This guide explains how our Trust Score works, what separates top-ranked from mid-ranked clinics, and what to look for when reading reviews yourself.",
    sections: [
      {
        heading: "How we rank Bangkok hair transplant clinics",
        body: "Our Trust Score (0–100) combines: Google rating weighted by reviewer credibility (Local Guides and long-term reviewers score higher than single-review accounts), review volume and consistency over time, Bookimed patient testimonials, Reddit and Pantip community mentions, photo count verification, and a viral-flag filter for clinics showing patterns of incentivised or fake reviews. A clinic with a 4.8 rating from 2,000+ reviews, half from Local Guides, scores significantly higher than a clinic with 4.9 from 150 reviews with no credibility signals. This matters because hair transplant results are posted months to years later — not the day of treatment.",
      },
      {
        heading: "What separates top-ranked clinics",
        body: "The highest Trust Score clinics in Bangkok share common patterns: 5+ years of operation with stable review trends (not a spike from a promotion), a mix of local Thai patients and international medical tourists in their review base, at least one board-certified surgeon who is named in reviews by patients (not just 'the doctor'), multiple source confirmation (Google AND Bookimed AND Reddit/Pantip), and transparent pricing on consultation — no bait-and-switch between quoted and final price. Red flags in review patterns: sudden influx of 5-star reviews in a 2-week window, reviews with identical phrasing, ratings that improved dramatically after a previously bad period without a change in ownership.",
      },
      {
        heading: "Areas of Bangkok for hair transplants",
        body: "Sukhumvit / Thonglor: premium tier. Highest price, strongest English support, most international patients. Clinics here often have English, Korean, and Chinese-speaking coordinators. Trust Scores tend to be higher due to international review volume. Pratunam / Ratchaprarop: budget-to-mid tier. Popular with Korean and Chinese tour groups. Volume-focused. Prices 20–40% lower. Silom / Sathon: established medical area. Mix of hospital-affiliated and boutique clinics. Older clinics with longer track records but sometimes fewer recent reviews. Phuket / Chiang Mai: for patients combining transplant with a beach or mountain trip. Smaller selection but comparable quality to Bangkok mid-tier.",
      },
      {
        heading: "Red flags to avoid",
        body: "No named surgeon: if the clinic can't tell you which surgeon will perform your procedure before you book, walk away. Technician-only procedures: extraction and implantation by technicians with no surgeon present is common at budget clinics — it's legal in Thailand but significantly impacts outcomes. Pressure to book same-day: legitimate clinics give you a quote and time to consider. Unusually low graft count estimates: some clinics quote fewer grafts than you need to appear cheaper — verify with a second opinion. Viral flag: our Trust Score flags clinics with suspected promotional review patterns. Filter these out when browsing the directory.",
      },
      {
        heading: "How to book and what to ask",
        body: "Step 1: get Trust Score top-20 filtered by your city. Step 2: shortlist 3 clinics and request a photo consultation (most offer free video calls or LINE chat assessments). Step 3: ask each: who will perform my procedure (name + credentials)? What is the graft count and why? What is your personal graft survival rate? What is the full price including PRP and follow-up? Can I see before/after photos from patients at my Norwood scale? Step 4: compare quotes — not on total price alone but on graft count, surgeon involvement, and follow-up included. Step 5: verify the surgeon's name independently — search their name + reviews on Google, Reddit, or Bookimed.",
      },
    ],
    faqs: [
      { q: "Which Bangkok clinic has the best hair transplant results?", a: "No single clinic is universally best — it depends on your hair loss pattern, graft count needed, and budget. Our Trust Score ranks 134 clinics by aggregated review quality across Google, Bookimed, Reddit, and Naver. The top 10 by Trust Score consistently show multi-year stable ratings, named surgeons, and multi-source review confirmation. Browse the directory filtered by Trust Score ≥ 70 for the vetted tier." },
      { q: "How do I verify a Bangkok hair transplant clinic is legitimate?", a: "Check: (1) Google reviews — look for Local Guide reviewer ratio and review consistency over 12+ months. (2) Bookimed listing — international platform with verified testimonials. (3) Reddit r/HairTransplants — search the clinic name. (4) Our Trust Score — aggregates all of the above plus viral pattern detection. (5) Thailand Medical Council registration for the surgeon." },
      { q: "What questions should I ask during a Bangkok hair transplant consultation?", a: "Key questions: Will the named surgeon perform my full procedure (not technicians)? What is the quoted graft count and what is it based on? What is your personal success rate / graft survival? Is PRP, medication, and 12-month follow-up included in the price? Can I see before/after photos from patients at my Norwood scale? What happens if results are unsatisfactory?" },
      { q: "Is it safe to get a hair transplant in Bangkok?", a: "Yes — Bangkok has a mature hair transplant industry with many experienced surgeons, especially in the Sukhumvit area. Thailand's medical standards for hair transplant clinics are regulated by the Medical Council of Thailand. Risk factors are the same as anywhere: surgeon experience, sterile technique, graft handling. Use our Trust Score to filter for established clinics with multi-year review histories." },
    ],
    reddit: { query: /best.*bangkok|bangkok.*best|recommend.*bangkok/i, title: /best.*bangkok|bangkok.*clinic/i },
    pantip: { title: /แนะนำ.*ปลูกผม|ปลูกผม.*ดี/i },
    naver: { query: /방콕.*추천|추천.*방콕/ },
  },
];

export function findGuide(slug: string): GuideTopic | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const PROC_TO_GUIDES: Record<string, string[]> = {
  fue:          ["fue-reviews", "bangkok-hair-clinic-guide", "thailand-vs-turkey", "thailand-vs-korea"],
  dhi:          ["dhi-reviews", "bangkok-hair-clinic-guide", "thailand-vs-turkey", "thailand-vs-korea"],
  fut:          ["scar-revision-cover", "bangkok-hair-clinic-guide"],
  smp:          ["smp-scalp-tattoo", "scar-revision-cover"],
  prp:          ["head-spa-scalp-treatment", "hair-loss-women"],
  "stem-cell":  ["hair-loss-women"],
  eyebrow:      ["hair-loss-women"],
  beard:        [],
  "scalp-care": ["head-spa-scalp-treatment"],
};

export const GUIDE_TO_PROCS: Record<string, string[]> = {
  "fue-reviews":               ["fue"],
  "dhi-reviews":               ["dhi"],
  "smp-scalp-tattoo":          ["smp"],
  "bangkok-hair-clinic-guide": ["fue", "dhi"],
  "korean-friendly-clinics":   ["fue", "dhi"],
  "scar-revision-cover":       ["smp", "fue"],
  "hair-loss-women":           ["prp", "fue"],
  "thailand-vs-turkey":        ["fue", "dhi"],
  "thailand-vs-korea":         ["fue", "dhi"],
  "head-spa-scalp-treatment":  ["scalp-care", "prp"],
};

const PROC_LABEL_MAP: Record<string, string> = {
  fue: "FUE Hair Transplant", dhi: "DHI Hair Transplant", fut: "FUT Hair Transplant",
  smp: "SMP / Scalp Micropigmentation", prp: "PRP Treatment",
  "stem-cell": "Stem Cell Therapy", eyebrow: "Eyebrow Transplant",
  beard: "Beard Transplant", "scalp-care": "Scalp Care",
};

export function procLabel(key: string): string {
  return PROC_LABEL_MAP[key] ?? key;
}

export function guidesForProcedures(procs: string[]): GuideTopic[] {
  const slugs = [...new Set(
    procs.flatMap((p) => {
      const lp = p.toLowerCase();
      const key =
        lp.includes("fue") ? "fue" :
        lp.includes("dhi") ? "dhi" :
        lp.includes("fut") ? "fut" :
        lp.includes("smp") || lp.includes("scalp micropig") ? "smp" :
        lp.includes("prp") ? "prp" :
        lp.includes("stem") ? "stem-cell" :
        lp.includes("eyebrow") ? "eyebrow" :
        lp.includes("beard") ? "beard" :
        lp.includes("scalp") || lp.includes("head spa") ? "scalp-care" : null;
      return key ? (PROC_TO_GUIDES[key] ?? []) : [];
    })
  )];
  return slugs.map(findGuide).filter((g): g is GuideTopic => g !== undefined).slice(0, 4);
}
