// 카테고리 깊이 블록에서 쓰는 비교표 — "어느 회사가 실제로 일을 많이 하나".
//
// 리뷰 수를 기준으로 고른다. Trust Score 순 목록은 이미 페이지 위에 있고, 바이어가
// 비교표에서 보고 싶은 건 "많이 거래되는 곳" 이다. 리뷰 수는 그 대리 지표로 우리가
// 가진 것 중 가장 덜 조작된 숫자다.
import type { Supplier } from "@/lib/types";

// 리뷰 수 순으로 고르면 소비자 창구가 위로 올라온다 — 2026-10-16 첫 시도에서 3PL 표
// 1위가 차량등록소, 3위가 비자런 투어, 식품 표에 주방용품 가게가 들어왔다. 리뷰를
// 많이 받는 건 일반인이 드나드는 곳이기 때문이다. 표에서는 그런 곳을 뺀다.
const NOT_B2B =
  /government|visa|travel|tour|service point|post office|store|shop|mall|market|ร้าน|ไปรษณีย์|ขนส่งจังหวัด|สถานี|transport office|restaurant|cafe/;

function isB2bRow(s: Supplier): boolean {
  const hay = [s.primary_type || "", s.name || ""].join(" | ").toLowerCase();
  return !NOT_B2B.test(hay);
}

export function ProviderTable({
  title,
  note,
  rows,
  tagsOf,
  limit = 15,
}: {
  title: string;
  note: string;
  rows: Supplier[];
  tagsOf: (s: Supplier) => string[];
  limit?: number;
}) {
  const top = [...rows]
    // 업종 태그가 하나라도 붙은 곳만 — "Focus" 칸이 비는 행은 이 표의 답이 아니다.
    .filter((s) => (s.total_reviews ?? 0) > 0 && tagsOf(s).length > 0 && isB2bRow(s))
    .sort((a, b) => (b.total_reviews ?? 0) - (a.total_reviews ?? 0))
    .slice(0, limit);
  if (top.length < 5) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className="text-sm text-[var(--muted)] mb-4">{note}</p>
      <div className="overflow-x-auto border border-[var(--border)] rounded-xl bg-white">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Province</th>
              <th className="px-3 py-2">Focus</th>
              <th className="px-3 py-2 text-right">Rating</th>
              <th className="px-3 py-2 text-right">Reviews</th>
              <th className="px-3 py-2 text-center">DBD</th>
            </tr>
          </thead>
          <tbody>
            {top.map((s) => (
              <tr key={s.id} className="border-t border-[var(--border)]">
                <td className="px-3 py-2 font-medium">
                  <a href={`/supplier/${s.id}`} className="hover:underline text-[var(--gold-deep)]">{s.name}</a>
                </td>
                <td className="px-3 py-2 text-[var(--muted)] whitespace-nowrap">{s.city_label || "—"}</td>
                <td className="px-3 py-2 text-[var(--muted)]">{tagsOf(s).slice(0, 2).join(", ") || "—"}</td>
                <td className="px-3 py-2 text-right tabular-nums">{s.rating ? s.rating.toFixed(1) : "—"}</td>
                <td className="px-3 py-2 text-right tabular-nums">{(s.total_reviews ?? 0).toLocaleString()}</td>
                <td className="px-3 py-2 text-center">{s.verified ? "✓" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
