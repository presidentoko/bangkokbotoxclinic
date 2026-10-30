// 치과 가격 가이드 (2026-10-30) — data/dental_price_guide.json (scripts/build_dental_price_guide.py).
//
// 검색어 "dental implants cost / teeth whitening bangkok / invisalign bangkok" 에 맞춘 페이지의 원천.
// 원천은 HDmall 에 클리닉이 게시한 패키지 가격이다. 리뷰에서 뽑은 가격(priceBands)에는 임플란트·
// 베니어가 사실상 없어서(임플란트 18건, 베니어 6건) 이 시술들은 이 데이터로만 말할 수 있다.
// 베니어는 패키지가 없어 페이지를 만들지 않는다.
import raw from "@/data/dental_price_guide.json";

export type GuideGroup = {
  group: string;
  sub: string;
  n: number;
  clinics: number;
  min: number;
  max: number;
  p25: number | null;
  median: number | null;
  p75: number | null;
};

export type GuideItem = {
  procedure: string;
  group: string;
  sub: string;
  price: number;
  listed: number | null;
  clinic_id: string;
  clinic: string;
  district: string;
  city: string;
  name: string;
  url: string;
};

export type GuideProcedure = {
  n_packages: number;
  n_clinics: number;
  groups: GuideGroup[];
  items: GuideItem[];
};

type Guide = {
  generated_at: string;
  oldest_scrape: string;
  procedures: Record<string, GuideProcedure>;
};

const guide = raw as unknown as Guide;

export type GuideSlug = "dental-implant-cost-bangkok" | "teeth-whitening-cost-bangkok" | "invisalign-cost-bangkok";

export type GuideConfig = {
  slug: GuideSlug;
  procedure: "implants" | "whitening" | "invisalign";
  /** 페이지 H1 앞부분. 숫자는 데이터에서 붙인다. */
  title: string;
  short: string;
  /** 대표가로 삼을 그룹을 고르는 함수. 없으면 표본이 가장 큰 그룹. */
  headlineGroup?: (g: GuideGroup) => boolean;
  unit: string;
  scope: string;
  caveat: string;
  faqs: (p: GuideProcedure, h: GuideGroup | null) => { q: string; a: string }[];
};

export const baht = (n: number) => `฿${Math.round(n).toLocaleString("en")}`;

const range = (g: GuideGroup) => `${baht(g.min)}–${baht(g.max)}`;
const typical = (g: GuideGroup) =>
  g.median != null && g.p25 != null && g.p75 != null
    ? `a typical ${baht(g.median)} (middle half ${baht(g.p25)}–${baht(g.p75)})`
    : `${range(g)}`;

/** 그룹 중앙값. 표본이 3건 미만이면 null (분위수를 내지 않는 그룹). */
function med(p: GuideProcedure, group: string, sub?: string): number | null {
  const g = p.groups.find((x) => x.group === group && (sub === undefined || x.sub === sub));
  return g?.median ?? null;
}
const times = (a: number | null, b: number | null) => (a != null && b != null && b > 0 ? (a / b).toFixed(1) : null);

export const GUIDES: GuideConfig[] = [
  {
    slug: "dental-implant-cost-bangkok",
    procedure: "implants",
    title: "Dental Implant Cost in Bangkok",
    short: "Dental implants",
    headlineGroup: (g) => g.sub === "with crown" && g.n >= 5 && g.group === "Osstem",
    unit: "per tooth",
    scope: "single-tooth implant packages at Greater Bangkok dental clinics",
    caveat:
      "Prices are for one implant tooth. 'With crown' packages include the visible tooth on top; 'implant only' packages do not, so a crown is billed separately. Bone grafts, sinus lifts and extractions are not included.",
    faqs: (p, h) => [
      {
        q: "How much does a dental implant cost in Bangkok?",
        a: h
          ? `Among ${p.n_packages} single-tooth implant packages listed by ${p.n_clinics} Greater Bangkok clinics, ${h.group} implants with a crown are listed at ${range(h)}, ${typical(h)}. ${(() => { const t = times(med(p, "Straumann", "with crown"), h.median); return t ? `Straumann (Swiss) implants with a crown have a typical price about ${t} times higher.` : ""; })()}`
          : `${p.n_packages} single-tooth implant packages from ${p.n_clinics} Greater Bangkok clinics were compared.`,
      },
      {
        q: "Which implant brand is cheapest in Bangkok?",
        a: (() => {
          const ranked = p.groups.filter((x) => x.sub === "with crown" && x.median != null);
          if (ranked.length < 2) return "There are too few listings per brand to say. The table shows each brand's lowest and highest listing.";
          const lo = ranked[0];
          const hi = ranked[ranked.length - 1];
          return `Among brands with at least three crown-included listings, ${lo.group} has the lowest typical price (${baht(lo.median!)}) and ${hi.group} the highest (${baht(hi.median!)}). The table gives every brand's lowest, typical and highest listing.`;
        })(),
      },
      {
        q: "Does the price include the crown?",
        a: "Only the 'with crown' rows do. An 'implant only' price covers the titanium post and placement; the crown is an additional charge, so compare like with like.",
      },
      {
        q: "Where do these prices come from?",
        a: "From package prices clinics published on HDmall between May and July 2026. They are list prices, not quotes: your dentist will confirm the final price after an X-ray and exam.",
      },
    ],
  },
  {
    slug: "teeth-whitening-cost-bangkok",
    procedure: "whitening",
    title: "Teeth Whitening Cost in Bangkok",
    short: "Teeth whitening",
    headlineGroup: (g) => g.group === "Cool Light" && g.sub === "single session",
    unit: "per session or kit",
    scope: "teeth whitening packages at Greater Bangkok dental clinics",
    caveat:
      "'Single session' is one in-clinic whitening visit. 'Bundle' packages add scaling, polishing, fluoride or a home kit, so they cost more and are shown separately.",
    faqs: (p, h) => [
      {
        q: "How much does teeth whitening cost in Bangkok?",
        a: h
          ? `Across ${p.n_packages} whitening packages from ${p.n_clinics} Greater Bangkok clinics, a single in-clinic ${h.group} session is listed at ${range(h)}, ${typical(h)}.${(() => { const t = times(med(p, "Zoom", "single session"), h.median); return t ? ` A Zoom session has a typical price about ${t} times higher.` : ""; })()}`
          : `${p.n_packages} whitening packages from ${p.n_clinics} Greater Bangkok clinics were compared.`,
      },
      {
        q: "Is at-home whitening cheaper than in-clinic?",
        a: (() => {
          const home = med(p, "At-home kit");
          const clinic = med(p, "Cool Light", "single session");
          if (home == null || clinic == null) return "There are too few listings to compare the two.";
          return `The typical at-home kit listing is ${baht(home)}, against ${baht(clinic)} for a single in-clinic Cool Light session, so ${home < clinic * 0.9 ? "the kit is cheaper" : home > clinic * 1.1 ? "the kit costs more" : "there is little saving"}.`;
        })(),
      },
      {
        q: "What is the difference between Cool Light and Zoom?",
        a: (() => {
          const t = times(med(p, "Zoom", "single session"), med(p, "Cool Light", "single session"));
          return `They are different whitening systems. ${t ? `In these listings a Zoom session has a typical price about ${t} times a Cool Light session; ` : ""}ask the clinic what you gain for the difference.`;
        })(),
      },
      {
        q: "Where do these prices come from?",
        a: "From package prices clinics published on HDmall between May and July 2026. They are list prices; shade results and any scaling needed can change the final bill.",
      },
    ],
  },
  {
    slug: "invisalign-cost-bangkok",
    procedure: "invisalign",
    title: "Invisalign Cost in Bangkok",
    short: "Invisalign",
    headlineGroup: (g) => g.group === "Comprehensive",
    unit: "full course, both arches",
    scope: "Invisalign packages for both arches at Greater Bangkok dental clinics",
    caveat:
      "Prices are for a full course on the upper and lower teeth. The tier (Express, Lite, Go, Essential, Moderate, Comprehensive) sets how many aligners and how complex a case it can treat. Retainers are not counted.",
    faqs: (p, h) => [
      {
        q: "How much does Invisalign cost in Bangkok?",
        a: h
          ? `Among ${p.n_packages} Invisalign packages from ${p.n_clinics} Greater Bangkok clinics, the full Comprehensive course is listed at ${range(h)}, ${typical(h)}. Lighter tiers start much lower.`
          : `${p.n_packages} Invisalign packages from ${p.n_clinics} Greater Bangkok clinics were compared.`,
      },
      {
        q: "Which Invisalign tier should I choose?",
        a: "That is a clinical decision: Express and Lite suit minor corrections, Moderate and Comprehensive suit more complex cases. The price table shows what each tier costs; your orthodontist decides which one fits.",
      },
      {
        q: "Is Invisalign cheaper in Bangkok than abroad?",
        a: "This page only compares Greater Bangkok clinics with each other, so it cannot say. Check any overseas quote for the same tier and the same number of aligners.",
      },
      {
        q: "Where do these prices come from?",
        a: "From package prices clinics published on HDmall between May and July 2026. They are list prices, not quotes.",
      },
    ],
  },
];

export function findGuide(slug: string): GuideConfig | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guideData(cfg: GuideConfig): { proc: GuideProcedure; headline: GuideGroup | null } {
  const proc = guide.procedures[cfg.procedure];
  const pick = cfg.headlineGroup ? proc.groups.find(cfg.headlineGroup) : undefined;
  const headline =
    pick ?? [...proc.groups].filter((g) => g.median != null).sort((a, b) => b.n - a.n)[0] ?? null;
  return { proc, headline };
}

export const guideDates = { newest: guide.generated_at, oldest: guide.oldest_scrape };

/** 가격 사다리 문장 — 표에서 바로 계산되므로 데이터가 바뀌면 문장도 바뀐다. */
export function ladderSentence(cfg: GuideConfig, proc: GuideProcedure): string | null {
  const g = proc.groups.filter((x) => x.median != null);
  if (g.length < 2) return null;
  const lo = g[0];
  const hi = g[g.length - 1];
  const times = hi.median! / lo.median!;
  if (!isFinite(times) || times < 1.2) return null;
  const label = (x: GuideGroup) => (x.sub && cfg.procedure !== "invisalign" ? `${x.group} (${x.sub})` : x.group);
  return `Among groups with at least three listings, ${label(hi)} has the highest typical price (${baht(hi.median!)}), about ${times.toFixed(1)} times the lowest, ${label(lo)} (${baht(lo.median!)}).`;
}
