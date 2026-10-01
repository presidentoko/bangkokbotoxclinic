// 소싱 파트너 — 성사 수수료 계약을 맺은 공장.
//
// 수익 모델(2026-10-01 확정): 바이어가 우리에게 소싱을 맡기면, 거래가 성사될 때
// 공장이 성공 수수료를 낸다. 바이어는 우리에게 돈을 내지 않는다. 공급사 연락처는
// 계속 공개한다 — 가리면 구글 지도에 이미 있는 정보를 숨기는 것이라 페이지 가치와
// 신뢰만 잃고 우회는 못 막는다. app/terms 에 이 내용을 그대로 공개해 뒀다.
//
// env var (반드시 NEXT_PUBLIC_ 접두사 — lib/sponsored.ts 주석의 하이드레이션 함정
// 과 같은 이유다):
//   NEXT_PUBLIC_SOURCING_PARTNERS="placeId1,placeId2"
//
// 계약된 공장이 없으면 빈 목록이고, 배지는 아무 데도 뜨지 않는다.
import type { Supplier } from "./types";

const PARTNER_IDS: string[] = (
  process.env.NEXT_PUBLIC_SOURCING_PARTNERS || process.env.SOURCING_PARTNERS || ""
)
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);

export function isSourcingPartner(id: string): boolean {
  return PARTNER_IDS.includes(id);
}

export function hasSourcingPartners(): boolean {
  return PARTNER_IDS.length > 0;
}

/**
 * 파트너를 앞으로 보낸 목록.
 *
 * 이 정렬은 상업적 배치이므로 반드시 배지로 표시해야 한다 (components/Badges.tsx
 * PartnerBadge). 약관에 "파트너는 우선 라우팅되고 표시된다, 다른 공급사의 점수나
 * 순위는 바뀌지 않는다" 라고 적어 뒀으니 그 약속을 코드도 지켜야 한다 —
 * 비파트너를 빼거나 내리지 않고, 순서만 앞세운다.
 */
export function partnersFirst(suppliers: Supplier[]): Supplier[] {
  if (PARTNER_IDS.length === 0) return suppliers;
  const partners: Supplier[] = [];
  const rest: Supplier[] = [];
  for (const s of suppliers) (isSourcingPartner(s.id) ? partners : rest).push(s);
  return [...partners, ...rest];
}
