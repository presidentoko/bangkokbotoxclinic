// 리뷰 작성자 표시 이름 (2026-10-01).
//
// 구글 리뷰의 작성자 이름을 그대로 싣고 있었는데, GSC 에 개인 실명이
// "tawisa piyakulworawat" 18위로 노출되는 게 잡혔다. 데이터에서 확인한 출처는
// data/clinics.bangkok.json 의 reviews[].authorName — 즉 직원이나 업주가 아니라
// **리뷰를 쓴 손님** 이름이다.
//
// 그 이름이 구글 지도에 공개돼 있다는 건 맞다. 다만 지도에서는 리뷰 한 건에
// 붙어 있을 뿐인데, 우리 페이지에 실리면 **이름으로 검색했을 때 우리가 뜬다** —
// 그리고 그 사람이 어느 업소(왁싱·네일 같은 사적인 서비스일 수 있다)에 리뷰를
// 썼는지까지 함께 드러난다. 리뷰를 남긴 사람이 기대한 결과가 아니다.
//
// 그래서 이름만 남기고 성은 이니셜로 줄인다. "실제 사람이 썼다"는 신호는
// 유지되고, 풀네임 검색으로는 안 걸린다.
export function displayAuthorName(raw: string | null | undefined, fallback: string): string {
  const n = (raw ?? "").trim();
  if (!n) return fallback;
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0];
  // 첫 단어 + 나머지 각 단어의 첫 글자. "Tawisa Piyakulworawat" → "Tawisa P."
  const initials = parts.slice(1).map((p) => `${p[0].toUpperCase()}.`).join(" ");
  return `${parts[0]} ${initials}`;
}
