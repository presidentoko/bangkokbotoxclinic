/**
 * 클리닉이 **자기 홈페이지에 게시한** 가격표에서 뽑은 가격.
 *
 * 기존 priceEstimates 는 환자 리뷰 텍스트에서 ฿숫자를 긁은 추정치라 노이즈가
 * 크다. 이건 클리닉 공식 가격 페이지의 <table> 을 파싱한 것이라 출처가 분명하고
 * 항목마다 sourceUrl 이 있다 — 이의가 들어오면 근거 페이지를 바로 열 수 있다.
 *
 * 데이터 생성: clinic-enrichment/scripts/extract_prices.py → export_to_site.py
 * 노출 기준(생성 단계에서 이미 걸러짐):
 *   - 표 직접 매칭만 (섹션 헤더 상속분 제외 — 이탈률 13% vs 17%)
 *   - 부수 항목 제외 (교정 와이어 절단 100밧 같은 것)
 *   - 미백·틀니 제외 (부분/전체가 섞여 대표가격을 못 냄)
 */
import raw from "@/data/clinic_published_prices.json";

export type PublishedPriceItem = {
  procedure: string;
  label: string;
  labelKo: string;
  rawName: string;
  unit: string;
  min: number;
  max: number;
  sourceUrl: string;
};

export type PriceBenchmark = {
  label: string;
  clinics: number;
  samples: number;
  median: number;
  p25: number;
  p75: number;
};

type Payload = {
  generatedAt: string;
  source: string;
  benchmarks: Record<string, PriceBenchmark>;
  clinics: Record<string, { domain: string; items: PublishedPriceItem[] }>;
};

const data = raw as unknown as Payload;

export function getPublishedPrices(clinicId: string): PublishedPriceItem[] {
  return data.clinics[clinicId]?.items ?? [];
}

export function getPriceSourceDomain(clinicId: string): string | null {
  return data.clinics[clinicId]?.domain ?? null;
}

export function getBenchmark(procedure: string): PriceBenchmark | null {
  return data.benchmarks[procedure] ?? null;
}

export function getAllBenchmarks(): (PriceBenchmark & { procedure: string })[] {
  return Object.entries(data.benchmarks).map(([procedure, b]) => ({
    procedure,
    ...b,
  }));
}

export const priceDataGeneratedAt = data.generatedAt;

/** 벤치마크 대비 위치. 표본이 없으면 null — 억지로 판정하지 않는다. */
export function comparedToMarket(
  procedure: string,
  price: number
): "below" | "typical" | "above" | null {
  const b = getBenchmark(procedure);
  if (!b) return null;
  if (price < b.p25) return "below";
  if (price > b.p75) return "above";
  return "typical";
}
