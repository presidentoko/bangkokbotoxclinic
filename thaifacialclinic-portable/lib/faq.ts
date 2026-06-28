export type Faq = { q: string; a: string };

export const HOME_FAQS: Faq[] = [
  {
    q: "How much does a hair transplant cost in Bangkok?",
    a: "Bangkok hair transplant prices: FUE ฿65,000–150,000 for 2,000 grafts (฿35–80 per graft); DHI ฿85,000–200,000 for 2,000 grafts. Compare: Korea ฿200,000–400,000, US/UK $8,000–25,000 for the same procedure. Bangkok saves 50–70% with equivalent quality at accredited clinics.",
  },
  {
    q: "What is the best hair transplant clinic in Bangkok?",
    a: "The best Bangkok hair transplant clinic depends on your case. Look for Trust Score 80+ clinics with 200+ reviews, verified by real patients on Google, Bookimed, Reddit, and Naver. Clinics in Sukhumvit and Silom with dedicated hair transplant departments and before/after photo galleries tend to serve the highest volume of international medical tourists. Use our Trust Score ranking on this page — it aggregates real patient feedback across all platforms.",
  },
  {
    q: "What is the difference between FUE and DHI hair transplant?",
    a: "FUE (Follicular Unit Extraction): grafts extracted individually, implanted with a tool. More affordable, slight handling of grafts outside scalp. DHI (Direct Hair Implantation): Choi pen places graft directly without a pre-made channel, more precise direction control, faster healing, higher cost. Both give permanent results. DHI costs ~30–50% more than FUE in Bangkok. Choose DHI for hairline density; FUE is adequate for crown and mid-scalp coverage.",
  },
  {
    q: "How long should I stay in Bangkok for a hair transplant?",
    a: "Minimum 4–5 days: Day 1 arrival + consultation, Day 2 procedure (6–9 hours for 2,000 grafts), Day 3–4 post-op check and recovery, Day 5 fly home. Many patients stay 7 days for extra rest. Full results appear 9–12 months post-procedure. No second trip required for most cases.",
  },
  {
    q: "Is hair transplant in Bangkok safe?",
    a: "Yes, when choosing accredited clinics. Thailand's Medical Council licenses all hair transplant surgeons. Bangkok clinics listed in our directory are verified through public Google Maps and Bookimed listings. Trust Score 75+ clinics consistently receive positive reviews from international patients. Look for clinics with before/after photos, a dedicated surgeon (not technician-led), and documented graft count.",
  },
  {
    q: "What is SMP (scalp micropigmentation) and how much does it cost in Bangkok?",
    a: "SMP is a non-surgical procedure using specialized pigments tattooed to the scalp to simulate hair follicle dots — creating the illusion of a shaved head or adding density to thinning areas. Bangkok SMP costs ฿15,000–50,000 per session (2–3 sessions for full coverage). Results last 3–5 years with touchups. A fraction of Korean or Western prices ($3,000–8,000 per treatment abroad).",
  },
  {
    q: "Do Bangkok hair clinics speak English and Korean?",
    a: "Yes — international hair clinics in Bangkok commonly offer English-speaking surgeons and coordinators. Korean-speaking coordinators are available at several Sukhumvit-area clinics catering to Korean medical tourists. Our clinic pages show review excerpts from Korean, English, Arabic, and Chinese-speaking patients. Filter by language in the directory.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0–100) combines: clinic Google rating (45% weight), review volume on a logarithmic scale (35%), Local Guide reviewer ratio (15%), and rating consistency over time (5%). Cross-validated against Bookimed, Reddit, Naver, and Pantip data. A Trust Score of 75+ means consistently positive, high-volume, credible reviews across multiple platforms — not just a single-source average.",
  },
];

export const PROCEDURE_FAQS: Record<string, Faq[]> = {
  fue: [
    {
      q: "How much does FUE hair transplant cost in Bangkok?",
      a: "Bangkok FUE hair transplant: ฿65,000–150,000 for 2,000 grafts (฿35–80 per graft). Large cases (3,000–4,000 grafts): ฿90,000–200,000. Compare: South Korea ฿200,000–400,000, UK/US $8,000–25,000. Savings of 50–70% are typical at quality Bangkok clinics.",
    },
    {
      q: "Is FUE or DHI better for hair transplant in Bangkok?",
      a: "FUE is more affordable and suitable for most cases. DHI (Choi pen) offers denser placement and faster healing, costs 30–50% more. For hairline work, many surgeons prefer DHI; for crown and mid-scalp, FUE gives equivalent results at lower cost. Ask your Bangkok surgeon which technique matches your graft count and desired density.",
    },
    {
      q: "How many FUE grafts do I need?",
      a: "NW2–3 (early recession): 1,000–2,000 grafts. NW3–4 (moderate loss): 2,000–3,500 grafts. NW5–6 (significant crown loss): 3,500–5,000 grafts. NW7 (extensive): 5,000–7,000+ grafts (may require 2 sessions). Bangkok clinics can assess your Norwood scale and donor density via photos before you travel.",
    },
  ],
  dhi: [
    {
      q: "How much does DHI hair transplant cost in Bangkok?",
      a: "Bangkok DHI: ฿85,000–200,000 for 2,000 grafts. DHI costs 30–50% more than FUE due to Choi pen tooling and longer procedure time. Compare: Korea $3,000–7,000, UK $8,000–15,000 for DHI. Bangkok saves 40–60%.",
    },
    {
      q: "What are the advantages of DHI over FUE?",
      a: "DHI uses a Choi implanter pen — grafts go directly from extraction to implantation without sitting outside the scalp, improving survival rates. Hairline direction is more precise. Healing is typically 10–20% faster. Density in a single session can be higher. Downside: more expensive, takes longer per session.",
    },
  ],
  smp: [
    {
      q: "How much does SMP cost in Bangkok?",
      a: "Bangkok SMP: ฿15,000–50,000 per session (2–3 sessions for full scalp coverage). Total cost for complete SMP: ฿40,000–120,000. Compare: UK/US $3,000–8,000 per session. Bangkok saves 50–70%.",
    },
    {
      q: "How long does SMP last?",
      a: "SMP typically lasts 3–5 years before requiring a touchup session. Longevity depends on sun exposure, skin type, and pigment quality. Quality clinics use specialized SMP pigments (not regular tattoo ink) that fade to gray rather than blue-green.",
    },
  ],
  prp: [
    {
      q: "How much does PRP hair treatment cost in Bangkok?",
      a: "PRP (Platelet-Rich Plasma) in Bangkok: ฿5,000–15,000 per session. Typical protocol: 3–6 monthly sessions, then maintenance every 6–12 months. Package deals (3 sessions): ฿12,000–35,000. Compare: US $500–2,000 per session.",
    },
  ],
  beard: [
    {
      q: "How much does beard transplant cost in Bangkok?",
      a: "Bangkok beard transplant: ฿50,000–120,000 for 1,000–2,000 grafts. Compare: Turkey ฿60,000–100,000, UK/US $4,000–8,000. Same FUE/DHI technique as scalp hair, using donor hair from the back of the head.",
    },
  ],
  eyebrow: [
    {
      q: "How much does eyebrow transplant cost in Bangkok?",
      a: "Bangkok eyebrow transplant: ฿35,000–80,000 for 200–500 grafts. One of the most technically demanding procedures — precision and angle control critical. Choose clinics with documented eyebrow transplant before/after photos.",
    },
  ],
};
