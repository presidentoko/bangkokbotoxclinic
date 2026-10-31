// 보톡스·필러·HIFU 가격 가이드 (2026-10-31) — data/aesthetic_price_guide.json (scripts/build_aesthetic_price_guide.py).
//
// 사이트 곳곳의 "From ฿80/unit", "฿8,000–25,000 per syringe", "HIFU ฿8,000–80,000+", "미국 대비 60–80% 저렴"
// 은 출처가 없었다. 원천은 HDmall 에 방콕 클리닉이 게시한 패키지 가격이다 (web-cf/lib/dentalPriceGuide.ts 와
// 같은 구조). 보톡스는 유닛 수가 적힌 패키지를 유닛당 가격으로 바꿔 비교한다 — 그 나눗셈은 우리가 한 것이다.
import raw from "@/data/aesthetic_price_guide.json";
import type { SiteFocus } from "@/lib/site";

export type GuideGroup = {
  group: string;
  sub: string;
  n: number;
  clinics: number;
  /** "per unit" 이면 min~p75 가 유닛당 가격, "package" 면 패키지 가격 */
  basis: "per unit" | "package";
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
  units: number | null;
  per_unit: number | null;
  listed: number | null;
  clinic_id: string;
  clinic: string;
  district: string;
  city: string;
  name: string;
  url: string;
  source: string;
};

export type GuideProcedure = {
  source: string;
  captured_from: string;
  captured_to: string;
  n_packages: number;
  n_clinics: number;
  groups: GuideGroup[];
  items: GuideItem[];
};

type Guide = { generated_at: string; oldest_scrape: string; procedures: Record<string, GuideProcedure> };
const guide = raw as unknown as Guide;

/** 이 가이드를 보여주는 사이트 (보톡스 계열 도메인). 치과·모발이식 사이트에는 없는 페이지다. */
export const PRICE_GUIDE_FOCUS = new Set<SiteFocus>(["botox", "filler", "hifu", "facial", "laser"]);

export type GuideSlug = "botox-cost-bangkok" | "filler-cost-bangkok" | "hifu-cost-bangkok";

export type GuideConfig = {
  slug: GuideSlug;
  procedure: "botox" | "filler" | "hifu";
  title: string;
  short: string;
  headlineGroup?: (g: GuideGroup) => boolean;
  /** 표 제목 "Price by …" */
  groupBy: string;
  scope: string;
  caveat: string;
  faqs: (p: GuideProcedure, h: GuideGroup | null) => { q: string; a: string }[];
};

export const baht = (n: number) => `฿${Math.round(n).toLocaleString("en")}`;
const unitSuffix = (g: GuideGroup) => (g.basis === "per unit" ? " per unit" : "");
const range = (g: GuideGroup) => `${baht(g.min)}–${baht(g.max)}${unitSuffix(g)}`;
const typical = (g: GuideGroup) =>
  g.median != null && g.p25 != null && g.p75 != null
    ? `a typical ${baht(g.median)}${unitSuffix(g)} (middle half ${baht(g.p25)}–${baht(g.p75)})`
    : range(g);
const grp = (p: GuideProcedure, group: string, sub?: string) =>
  p.groups.find((x) => x.group === group && (sub === undefined || x.sub === sub)) ?? null;

export const GUIDES: GuideConfig[] = [
  {
    slug: "botox-cost-bangkok",
    procedure: "botox",
    title: "Botox Cost in Bangkok",
    short: "Botox",
    headlineGroup: (g) => g.basis === "per unit" && g.group === "Brand not stated",
    groupBy: "brand",
    scope: "botulinum toxin (Botox) packages",
    caveat:
      "Per-unit prices are our arithmetic: the package price divided by the number of units it states (100 units for ฿5,800 = ฿58 per unit). 'Units set by doctor' packages are sold per treatment area without a unit count, so they are shown as package prices. Packages bundled with another treatment, and multi-session courses, are left out.",
    faqs: (p, h) => [
      {
        q: "How much does Botox cost per unit in Bangkok?",
        a: h
          ? `Across ${p.groups.filter((g) => g.basis === "per unit").reduce((a, g) => a + g.n, 0)} Botox packages that state a unit count, at ${p.n_clinics} Greater Bangkok clinics, the price works out at ${typical(h)} for packages that do not name the brand. The lowest and highest are ${baht(h.min)} and ${baht(h.max)} per unit.`
          : `${p.n_packages} Botox packages from ${p.n_clinics} Greater Bangkok clinics were compared.`,
      },
      {
        q: "Is Allergan more expensive than Korean Botox brands?",
        a: (() => {
          const ko = grp(p, "Korean brand", "per unit");
          const al = grp(p, "Allergan (Botox)", "per unit");
          if (!ko || !al) return "Too few packages name their brand to compare brands. Ask the clinic which brand is in the vial and to open it in front of you.";
          return `In the few packages that name the brand, Korean toxins (Neuronox, Nabota, Hutox) work out at ${range(ko)} and Allergan at ${range(al)}. Only ${ko.n + al.n} packages name one of these brands, so treat this as a rough guide and ask the clinic which brand is in the vial.`;
        })(),
      },
      {
        q: "How much does Botox cost per area?",
        a: (() => {
          const a = grp(p, "Units set by doctor", "per area");
          return a
            ? `Packages sold per area (jaw, forehead, face) with the dose left to the doctor are listed at ${typical(a)} for one area, across ${a.n} packages. Without a unit count you cannot compare them with per-unit prices, so ask how many units the price includes.`
            : "Some clinics sell Botox per area with the dose set by the doctor. Ask how many units the price includes.";
        })(),
      },
      {
        q: "Where do these prices come from?",
        a: "From package prices clinics published on HDmall. They are list prices, not quotes; the doctor decides the dose after assessing you.",
      },
    ],
  },
  {
    slug: "filler-cost-bangkok",
    procedure: "filler",
    title: "Filler Cost in Bangkok",
    short: "Fillers",
    groupBy: "brand",
    scope: "1 cc hyaluronic acid filler packages",
    caveat:
      "Only 1 cc (one syringe) packages are compared, because multi-cc packages are not comparable per cc. Most HDmall filler listings do not name the brand, so ask which brand and product line is being injected.",
    faqs: (p, h) => [
      {
        q: "How much does 1 cc of filler cost in Bangkok?",
        a: h
          ? `Across ${p.n_packages} one-cc filler packages from ${p.n_clinics} Greater Bangkok clinics, the listed price is ${typical(h)}. The lowest is ${baht(h.min)} and the highest ${baht(h.max)}.`
          : `${p.n_packages} filler packages from ${p.n_clinics} Greater Bangkok clinics were compared.`,
      },
      {
        q: "Why do filler prices differ so much?",
        a: "Mostly the brand and product line, which most listings do not name, and the treatment area. Ask the clinic for the brand, the product line and the number of cc before comparing prices.",
      },
      {
        q: "Where do these prices come from?",
        a: "From package prices clinics published on HDmall. They are list prices, not quotes.",
      },
    ],
  },
  {
    slug: "hifu-cost-bangkok",
    procedure: "hifu",
    title: "HIFU Cost in Bangkok",
    short: "HIFU",
    headlineGroup: (g) => g.group === "Ultraformer",
    groupBy: "machine",
    scope: "single-session HIFU and Thermage packages",
    caveat:
      "Single sessions only; multi-session courses are left out. Shot counts differ between packages and are shown in each listing. Thermage is radiofrequency rather than ultrasound, but it is sold for the same purpose, so it is listed for comparison.",
    faqs: (p, h) => [
      {
        q: "How much does HIFU cost in Bangkok?",
        a: h
          ? `Across ${p.n_packages} single-session packages from ${p.n_clinics} Greater Bangkok clinics, an Ultraformer session is listed at ${typical(h)}.${(() => {
              const o = grp(p, "Other HIFU machines");
              return o?.median != null ? ` Other HIFU machines have a typical listing of ${baht(o.median)}.` : "";
            })()}`
          : `${p.n_packages} HIFU packages from ${p.n_clinics} Greater Bangkok clinics were compared.`,
      },
      {
        q: "How much more does Ulthera cost than other HIFU?",
        a: (() => {
          const u = grp(p, "Ulthera");
          const o = grp(p, "Ultraformer");
          if (u?.median == null || o?.median == null) return "There are too few listings to compare the machines.";
          return `In these listings an Ulthera session has a typical price of ${baht(u.median)}, about ${(u.median / o.median).toFixed(1)} times an Ultraformer session (${baht(o.median)}). Ask the clinic which machine and how many shots or lines are included.`;
        })(),
      },
      {
        q: "Where do these prices come from?",
        a: "From package prices clinics published on HDmall. They are list prices, not quotes.",
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
  const headline = pick ?? [...proc.groups].filter((g) => g.median != null).sort((a, b) => b.n - a.n)[0] ?? null;
  return { proc, headline };
}

export const groupUnit = unitSuffix;

/** 가격 사다리 문장 — 같은 기준(유닛당 / 패키지)끼리만 비교한다. */
export function ladderSentence(proc: GuideProcedure): string | null {
  const g = proc.groups.filter((x) => x.median != null && x.basis === "package");
  if (g.length < 2) return null;
  const sorted = [...g].sort((a, b) => a.median! - b.median!);
  const lo = sorted[0];
  const hi = sorted[sorted.length - 1];
  const times = hi.median! / lo.median!;
  if (!isFinite(times) || times < 1.2) return null;
  return `Among groups with at least three listings, ${hi.group} has the highest typical price (${baht(hi.median!)}), about ${times.toFixed(1)} times the lowest, ${lo.group} (${baht(lo.median!)}).`;
}

/**
 * 다른 페이지(FAQ·llms.txt·사이트 설명·한국어/태국어 홈)가 가격을 말할 때 쓰는 숫자.
 * 범위 양 끝은 이상치가 섞이므로 "보통 가격"은 중간 50%(p25–p75)로 말한다.
 */
export type Typical = { median: number; p25: number; p75: number; n: number };
const typ = (g: GuideGroup | null): Typical | null =>
  g && g.median != null && g.p25 != null && g.p75 != null ? { median: g.median, p25: g.p25, p75: g.p75, n: g.n } : null;

export type LoHi = { lo: number; hi: number; n: number };
const lohi = (g: GuideGroup | null): LoHi | null => (g ? { lo: g.min, hi: g.max, n: g.n } : null);
/** "฿46–฿48" — 최저~최고. */
export const loHiText = (r: LoHi | null, suffix = "") => (r ? `${r.lo === r.hi ? baht(r.lo) : `${baht(r.lo)}–${baht(r.hi)}`}${suffix}` : null);

export function aestheticPriceFacts() {
  const P = guide.procedures;
  return {
    botoxPerUnit: typ(grp(P.botox, "Brand not stated", "per unit")),
    botoxPerArea: typ(grp(P.botox, "Units set by doctor", "per area")),
    filler1cc: typ(P.filler.groups.find((g) => g.group === "Brand not stated") ?? null),
    hifuUltraformer: typ(grp(P.hifu, "Ultraformer")),
    hifuOther: typ(grp(P.hifu, "Other HIFU machines")),
    ulthera: typ(grp(P.hifu, "Ulthera")),
    thermage: typ(grp(P.hifu, "Thermage FLX (RF)")),
    /** 브랜드를 밝힌 패키지는 몇 건뿐이라 중앙값 대신 최저~최고 유닛당 가격만 낸다. */
    botoxKorean: lohi(grp(P.botox, "Korean brand", "per unit")),
    botoxAllergan: lohi(grp(P.botox, "Allergan (Botox)", "per unit")),
    botoxXeomin: lohi(grp(P.botox, "Xeomin", "per unit")),
    clinics: { botox: P.botox.n_clinics, filler: P.filler.n_clinics, hifu: P.hifu.n_clinics },
  };
}
/** "฿69–฿120" — 중간 50% 범위. */
export const midText = (t: Typical | null, suffix = "") => (t ? `${baht(t.p25)}–${baht(t.p75)}${suffix}` : null);
