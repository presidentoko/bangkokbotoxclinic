// 시술 슬러그 → 이름·매칭 규칙. /c/[procedure] 페이지와, 클리닉 페이지의 시술 칩 링크가
// 같이 쓴다 (2026-10-25: 칩이 링크 없는 글자라 시술 페이지로 가는 내부 링크가 없었다).
// 2026-10-30: priceHint(출처 없는 가격 문구)를 뺐다. 가격은 lib/hairPrices.ts hairPriceHint() 가
// 클리닉이 공개한 가격에서 만든다 — 데이터가 없는 시술은 가격을 말하지 않는다.
export const PROC_MAP: Record<string, { name: string; match: RegExp }> = {
  "fue": { name: "FUE Hair Transplant", match: /FUE/i },
  "dhi": { name: "DHI Hair Transplant", match: /DHI/i },
  "fut": { name: "FUT Hair Transplant", match: /FUT/i },
  "prp": { name: "PRP Hair Treatment", match: /PRP/i },
  "smp": { name: "SMP / Scalp Micropigmentation", match: /SMP|Scalp Micropigmentation/i },
  "stem-cell": { name: "Stem Cell Therapy", match: /Stem Cell/i },
  "eyebrow": { name: "Eyebrow Transplant", match: /Eyebrow/i },
  "beard": { name: "Beard Transplant", match: /Beard/i },
  "scalp-care": { name: "Scalp Care / Scaling", match: /Scalp|head spa/i },
};

/** 클리닉의 시술 문자열 하나 → 해당 시술 페이지 슬러그 (없으면 null). */
export function procedureSlug(label: string): string | null {
  for (const [slug, p] of Object.entries(PROC_MAP)) if (p.match.test(label)) return slug;
  return null;
}
