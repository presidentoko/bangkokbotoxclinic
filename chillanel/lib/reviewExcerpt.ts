// 리뷰 원문을 짧은 인용으로 자른다 (2026-10-22). 구글 리뷰 전문을 옮겨 싣지
// 않는다 — 페이지의 고유 콘텐츠는 분석이고, 리뷰는 그걸 뒷받침하는 인용이다.
// 문장 끝(. ! ? 。)에서 자르되 너무 짧아지면 공백에서, 그것도 없으면(태국어는
// 단어 사이에 공백이 없을 수 있다) 글자 수로 자른다.
export const REVIEW_EXCERPT_MAX = 240;

export function reviewExcerpt(text: string | null | undefined, max = REVIEW_EXCERPT_MAX): string {
  const s = (text ?? "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const head = s.slice(0, max);
  const minKeep = Math.floor(max / 2);
  let cut = -1;
  for (const m of head.matchAll(/[.!?。](?=\s|$)/g)) {
    if (m.index !== undefined && m.index + 1 >= minKeep) cut = m.index + 1;
  }
  if (cut > 0) return head.slice(0, cut) + " …";
  const space = head.lastIndexOf(" ");
  if (space >= minKeep) return head.slice(0, space) + " …";
  return head + "…";
}
