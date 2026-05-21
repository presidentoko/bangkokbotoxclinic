// Pricing data loader — reads data/pricing/{clinicId}.json at SSG/SSR time.
// 데이터는 hdmall에서 스크랩된 package 단위. master_db에 통합되어있지 않은 정보까지
// 클리닉 페이지 렌더 시 직접 로딩.

import { promises as fs } from "node:fs";
import path from "node:path";

export type PricingPackage = {
  sku: string;
  name: string;
  current_price: number;
  original_price?: number;
  url_slug?: string;
  category?: string;
};

export type ClinicPricing = {
  place_id: string;
  source: string;            // "hdmall" 등
  hdmall_url?: string;
  hdmall_name?: string;
  packages: PricingPackage[];
};

const PRICING_DIR = path.join(process.cwd(), "data", "pricing");

const _cache = new Map<string, ClinicPricing | null>();

export async function loadPricing(clinicId: string): Promise<ClinicPricing | null> {
  if (_cache.has(clinicId)) return _cache.get(clinicId) ?? null;
  // place_id에 `:` 있는 경우 — 파일명은 `_` 로 안전화. 양쪽 다 시도.
  const variants = [clinicId, clinicId.replace(/:/g, "_")];
  for (const variant of variants) {
    const file = path.join(PRICING_DIR, `${variant}.json`);
    try {
      const raw = await fs.readFile(file, "utf-8");
      const parsed = JSON.parse(raw) as ClinicPricing;
      if (Array.isArray(parsed.packages) && parsed.packages.length > 0) {
        _cache.set(clinicId, parsed);
        return parsed;
      }
    } catch {
      // 다음 variant 시도
    }
  }
  _cache.set(clinicId, null);
  return null;
}

/** Package 목록을 가격 오름차순 + 상위 N개로 정리. */
export function summarisePackages(p: ClinicPricing, limit = 6): PricingPackage[] {
  return [...p.packages]
    .filter((pk) => pk.current_price > 0)
    .sort((a, b) => a.current_price - b.current_price)
    .slice(0, limit);
}

export function priceRangeTHB(p: ClinicPricing): { min: number; max: number } | null {
  const prices = p.packages.map((pk) => pk.current_price).filter((n) => n > 0);
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
