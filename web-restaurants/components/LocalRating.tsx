import type { Restaurant } from "@/lib/types";

/**
 * 현지 플랫폼(Wongnai) 평점과 구글 평점을 나란히 놓는다.
 *
 * 이 사이트가 하는 말은 "구글 별점을 그대로 믿지 말라" 인데, 지금까지 근거가
 * 구글 리뷰 하나뿐이었다. 같은 출처를 다시 계산한 건 검증이 아니다. 태국
 * 현지인이 매긴 점수가 옆에 있어야 독자가 직접 비교할 수 있다.
 *
 * 162곳 표본에서 구글이 현지보다 평균 0.50 높았고 90%에서 구글이 더 후했다.
 * 그래도 여기서 결론을 내려주지 않는다 — 숫자 두 개와 표본 크기를 보여주고
 * 판단은 독자가 한다. 현지 평가자가 몇 명인지(rating_count)를 같이 적는 건
 * 그래서다. 4명이 매긴 3.5 와 93명이 매긴 3.8 은 다른 무게다.
 */
const MIN_COUNT_FOR_GAP = 20;   // 이보다 적으면 격차를 말하지 않는다

export function LocalRating({ r }: { r: Restaurant }) {
  const lr = r.local_rating;
  if (!lr) return null;

  const gap = r.rating - lr.rating;
  const meaningful = lr.rating_count >= MIN_COUNT_FOR_GAP && Math.abs(gap) >= 0.3;

  return (
    <section className="lr">
      <h2 className="lr-h">Locals rate it differently</h2>
      <div className="lr-row">
        <div className="lr-cell">
          <div className="lr-num">{r.rating.toFixed(1)}</div>
          <div className="lr-lbl">Google</div>
          <div className="lr-sub">{r.total_reviews.toLocaleString()} reviews</div>
        </div>
        <div className="lr-cell">
          <div className="lr-num">{lr.rating.toFixed(1)}</div>
          <div className="lr-lbl">Wongnai (Thai)</div>
          <div className="lr-sub">{lr.rating_count.toLocaleString()} ratings</div>
        </div>
      </div>
      {meaningful && (
        <p className="lr-note">
          {gap > 0
            ? `Thai diners rate it ${gap.toFixed(1)} lower than Google's mostly foreign reviewers.`
            : `Thai diners rate it ${Math.abs(gap).toFixed(1)} higher than Google's reviewers.`}
        </p>
      )}
      {!meaningful && lr.rating_count < MIN_COUNT_FOR_GAP && (
        <p className="lr-note lr-thin">
          Only {lr.rating_count} local rating{lr.rating_count === 1 ? "" : "s"} — too few to compare.
        </p>
      )}
      <a className="lr-src" href={lr.url} target="_blank" rel="noopener nofollow">
        Source: Wongnai ↗
      </a>
      <style>{`
        .lr{border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:20px 0;background:#fff}
        .lr-h{font-size:15px;font-weight:650;margin:0 0 12px;color:#0f172a}
        .lr-row{display:flex;gap:12px}
        .lr-cell{flex:1;background:#f8fafc;border-radius:10px;padding:12px;text-align:center}
        .lr-num{font-size:26px;font-weight:700;color:#0f172a;line-height:1.1}
        .lr-lbl{font-size:12px;font-weight:600;color:#475569;margin-top:4px}
        .lr-sub{font-size:11px;color:#94a3b8;margin-top:2px}
        .lr-note{font-size:13px;color:#334155;margin:12px 0 0;line-height:1.5}
        .lr-thin{color:#94a3b8}
        .lr-src{display:inline-block;margin-top:10px;font-size:12px;color:#64748b;text-decoration:none}
        .lr-src:hover{text-decoration:underline}
      `}</style>
    </section>
  );
}
