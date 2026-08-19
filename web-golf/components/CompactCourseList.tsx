import type { Course } from "@/lib/types";

// 목록 페이지가 1MB HTML 로 나가던 문제 대응 (2026-08-19 측정: /c/course 998KB,
// /city/bangkok 972KB). RestaurantCard 를 100장 깔면 HTML 과 RSC flight payload 에
// 렌더 결과가 두 번 실려서 카드 한 장이 약 4KB 를 먹는다. 태국 모바일 4G 에서
// 1MB 랜딩 페이지는 그대로 이탈로 이어진다.
//
// 그렇다고 카드 수만 줄이면 내부링크가 같이 사라져 크롤 도달성이 나빠진다
// (이번 색인 재건에서 계속 지켜온 것). 그래서 상위 몇 개는 카드로 보여주고
// 나머지는 이 경량 목록으로 링크만 유지한다 — 한 줄에 약 90 bytes.
export function CompactCourseList({
  courses,
  startRank,
}: {
  courses: Course[];
  startRank: number;
}) {
  if (courses.length === 0) return null;
  return (
    <ol className="mt-4 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-white">
      {courses.map((r, i) => (
        <li key={r.id}>
          <a
            href={`/course/${r.id}`}
            className="flex items-baseline gap-3 px-4 py-2.5 hover:bg-emerald-50/50 transition"
          >
            <span className="w-8 shrink-0 text-xs tabular-nums text-[var(--muted)]">
              {startRank + i}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.name}</span>
            {r.district && (
              <span className="hidden shrink-0 truncate text-xs text-[var(--muted)] sm:block sm:max-w-[10rem]">
                {r.district}
              </span>
            )}
            <span className="shrink-0 text-xs tabular-nums text-[var(--muted)]">
              ★{r.rating.toFixed(1)}
            </span>
            <span className="w-10 shrink-0 text-right text-xs font-bold tabular-nums text-emerald-700">
              {r.trust_score.toFixed(0)}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
