// Sponsored slots config — 클리닉별 ID 화이트리스트 + 슬롯 위치.
// 환경변수 SPONSORED_IDS="id1,id2,id3" 로 주입 (private deploy time).
// 미지정시 빈 배열 → "Sponsored" 노출 X.

export type SponsoredSlot = {
  id: string;
  label?: string;       // "Featured" / "Promoted" / "Trusted Partner"
  position: "top" | "inline" | "sidebar";
};

const RAW = process.env.SPONSORED_IDS || "";
const ids = RAW.split(",").map((s) => s.trim()).filter(Boolean);

export const SPONSORED_TOP: string[] = ids;

export function isSponsored(clinicId: string): boolean {
  return SPONSORED_TOP.includes(clinicId);
}
