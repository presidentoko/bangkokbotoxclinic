export type Faq = { q: string; a: string };

export const HOME_FAQS: Faq[] = [
  {
    q: "How much does a hair transplant cost in Bangkok?",
    a: "Prices vary far more than any single figure suggests, so we do not publish a price table. Very few patients state in their Google reviews what they paid, and those who do range from tens of thousands to several hundred thousand baht — not enough to give a reliable average. Ask at least three clinics for a written quote that states the graft count, the technique, and who performs the extraction (a surgeon or a technician).",
  },
  {
    q: "What is the best hair transplant clinic in Bangkok?",
    a: "The best Bangkok hair transplant clinic depends on your case. Look for Trust Score 80+ clinics with 200+ reviews, on Google. Clinics in Sukhumvit and Silom with dedicated hair transplant departments and before/after photo galleries tend to serve the highest volume of international medical tourists. Use our Trust Score ranking on this page — it is built from each clinic's own Google reviews.",
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
    a: "Yes, when choosing accredited clinics. Thailand's Medical Council licenses all hair transplant surgeons. Bangkok clinics listed in our directory are listed from public Google Maps data. Trust Score 75+ clinics consistently receive positive reviews from international patients. Look for clinics with before/after photos, a dedicated surgeon (not technician-led), and documented graft count.",
  },
  {
    q: "What is SMP (scalp micropigmentation) and how much does it cost in Bangkok?",
    a: "SMP is a non-surgical procedure using specialized pigments tattooed to the scalp to simulate hair follicle dots — creating the illusion of a shaved head or adding density to thinning areas. Bangkok SMP costs ฿15,000–50,000 per session (2–3 sessions for full coverage). Results last 3–5 years with touchups. A fraction of Korean or Western prices ($3,000–8,000 per treatment abroad).",
  },
  {
    q: "Do Bangkok hair clinics speak English and Korean?",
    a: "Yes — international hair clinics in Bangkok commonly offer English-speaking surgeons and coordinators. Korean-speaking coordinators are available at several Sukhumvit-area clinics catering to Korean medical tourists. Each clinic page quotes its own reviews — read them for comments about English-speaking staff before you book.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0–100) is computed from each clinic's Google data: rating (up to 15 points), review volume on a logarithmic scale (15), the range of hair procedures it offers (10), whether it publishes real information on its own website, and whether it is genuinely a hair clinic (20). Clinics are never scored up for paying us, and a negative review is never removed.",
  },
];

export const PROCEDURE_FAQS: Record<string, Faq[]> = {
  fue: [
    {
      q: "How much does FUE hair transplant cost in Bangkok?",
      a: "Prices vary far more than any single figure suggests, so we do not publish a price table. Very few patients state in their Google reviews what they paid, and those who do range from tens of thousands to several hundred thousand baht — not enough to give a reliable average. Ask at least three clinics for a written quote that states the graft count, the technique, and who performs the extraction (a surgeon or a technician).",
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
      a: "DHI is usually quoted higher than FUE for the same graft count because the Choi pen placement takes longer. We do not publish a price because too few patients state in their reviews what they paid. Get written quotes that name the graft count and who places the grafts.",
    },
    {
      q: "What are the advantages of DHI over FUE?",
      a: "DHI uses a Choi implanter pen — grafts go directly from extraction to implantation without sitting outside the scalp, improving survival rates. Hairline direction is more precise. Healing is typically 10–20% faster. Density in a single session can be higher. Downside: more expensive, takes longer per session.",
    },
  ],
  smp: [
    {
      q: "How much does SMP cost in Bangkok?",
      a: "SMP is priced per session and a full scalp usually takes 2–3 sessions, so compare the total, not the per-session figure. We do not publish a price because too few patients state in their reviews what they paid.",
    },
    {
      q: "How long does SMP last?",
      a: "SMP typically lasts 3–5 years before requiring a touchup session. Longevity depends on sun exposure, skin type, and pigment quality. Quality clinics use specialized SMP pigments (not regular tattoo ink) that fade to gray rather than blue-green.",
    },
  ],
  prp: [
    {
      q: "How much does PRP hair treatment cost in Bangkok?",
      a: "PRP is usually sold as a course of 3–6 monthly sessions, then maintenance every 6–12 months, so compare the price of the full course. We do not publish a price because too few patients state in their reviews what they paid.",
    },
  ],
  beard: [
    {
      q: "How much does beard transplant cost in Bangkok?",
      a: "A beard transplant uses the same FUE or DHI technique as the scalp, with donor hair from the back of the head, and is priced by graft count. We do not publish a price because too few patients state in their reviews what they paid.",
    },
  ],
  eyebrow: [
    {
      q: "How much does eyebrow transplant cost in Bangkok?",
      a: "An eyebrow transplant usually needs 200–500 grafts and is one of the most demanding procedures — precision and angle control decide the result. Ask to see the clinic's own eyebrow cases before you book. We do not publish a price because too few patients state in their reviews what they paid.",
    },
  ],
};
