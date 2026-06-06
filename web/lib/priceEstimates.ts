import type { SampleReview } from "./types";

export type ProcedureEstimate = {
  procedure: string;
  label: string;
  min: number;
  max: number;
  count: number;
};

const DENTAL_PROCEDURES: { key: string; label: string; keywords: string[] }[] = [
  { key: "implants",     label: "Implants",    keywords: ["implant", "รากฟัน"] },
  { key: "veneers",      label: "Veneers",     keywords: ["veneer", "ฟันปลอม", "laminate"] },
  { key: "whitening",    label: "Whitening",   keywords: ["whiten", "bleach", "ฟอกสีฟัน"] },
  { key: "orthodontics", label: "Orthodontics",keywords: ["brace", "aligner", "invisalign", "จัดฟัน"] },
  { key: "crown",        label: "Crown",       keywords: ["crown", "ครอบฟัน"] },
];

const BAHT_RE = /฿\s*([\d,]+)/g;

function parseBahtAmounts(text: string): number[] {
  const amounts: number[] = [];
  let m: RegExpExecArray | null;
  BAHT_RE.lastIndex = 0;
  while ((m = BAHT_RE.exec(text)) !== null) {
    const n = parseInt(m[1].replace(/,/g, ""), 10);
    if (n >= 1_000 && n <= 2_000_000) amounts.push(n);
  }
  return amounts;
}

export function extractPriceEstimates(
  reviews: SampleReview[]
): ProcedureEstimate[] {
  const buckets: Record<string, number[]> = {};

  for (const r of reviews) {
    const text = r.text.toLowerCase();
    const amounts = parseBahtAmounts(r.text);
    if (amounts.length === 0) continue;

    const matched = DENTAL_PROCEDURES.find((p) =>
      p.keywords.some((kw) => text.includes(kw))
    );
    const key = matched?.key ?? "general";
    buckets[key] = [...(buckets[key] ?? []), ...amounts];
  }

  return Object.entries(buckets)
    .filter(([, vals]) => vals.length >= 2)
    .map(([key, vals]) => {
      const proc = DENTAL_PROCEDURES.find((p) => p.key === key);
      const sorted = [...vals].sort((a, b) => a - b);
      return {
        procedure: key,
        label: proc?.label ?? "General",
        min: sorted[0],
        max: sorted[sorted.length - 1],
        count: vals.length,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}
