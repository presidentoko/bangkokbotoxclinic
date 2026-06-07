// Guide topic definitions — each topic filters the sidecar CSVs (reddit/pantip/naver)
// into a curated reading list for SEO long-tail coverage.

export type GuideTopic = {
  slug: string;
  title: string;
  intro: string;
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
