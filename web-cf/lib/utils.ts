// Shared formatting utilities

// Trust Score 표시 형식 — 소수 1자리 고정 (예: 98.0 / 91.5)
// 전 컴포넌트가 이 함수를 거쳐야 자릿수가 통일된다.
export function formatTrustScore(score: number): string {
  return score.toFixed(1);
}
