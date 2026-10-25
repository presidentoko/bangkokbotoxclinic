// 시술 슬러그 → 이름·매칭 규칙. /c/[procedure] 페이지와, 클리닉 페이지의 시술 칩 링크가
// 같이 쓴다 (2026-10-25: 칩이 링크 없는 글자라 시술 페이지로 가는 내부 링크가 없었다).
export const PROC_MAP: Record<string, { name: string; match: RegExp; priceHint: string }> = {
  "fue": { name: "FUE Hair Transplant", match: /FUE/i, priceHint: "from ฿65,000 (2,000 grafts)" },
  "dhi": { name: "DHI Hair Transplant", match: /DHI/i, priceHint: "from ฿85,000 (2,000 grafts)" },
  "fut": { name: "FUT Hair Transplant", match: /FUT/i, priceHint: "from ฿55,000 (2,000 grafts)" },
  "prp": { name: "PRP Hair Treatment", match: /PRP/i, priceHint: "฿5,000–15,000 per session" },
  "smp": { name: "SMP / Scalp Micropigmentation", match: /SMP|Scalp Micropigmentation/i, priceHint: "฿15,000–50,000 per session" },
  "stem-cell": { name: "Stem Cell Therapy", match: /Stem Cell/i, priceHint: "from ฿40,000 per session" },
  "eyebrow": { name: "Eyebrow Transplant", match: /Eyebrow/i, priceHint: "฿35,000–80,000" },
  "beard": { name: "Beard Transplant", match: /Beard/i, priceHint: "฿50,000–120,000" },
  "scalp-care": { name: "Scalp Care / Scaling", match: /Scalp|head spa/i, priceHint: "฿3,000–12,000 per session" },
};

/** 클리닉의 시술 문자열 하나 → 해당 시술 페이지 슬러그 (없으면 null). */
export function procedureSlug(label: string): string | null {
  for (const [slug, p] of Object.entries(PROC_MAP)) if (p.match.test(label)) return slug;
  return null;
}
