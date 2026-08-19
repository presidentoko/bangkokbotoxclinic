import type { Course } from "@/lib/types";

// Google 이 내주는 시간대별 혼잡도와 영업시간. Apify export 에 줄곧 들어 있었는데
// ingest 가 버리고 있어서 2026-08-19 에 살렸다.
//
// 골퍼 입장에서 이건 부가 정보가 아니라 핵심이다 — 언제 가야 앞 팀에 막히지 않는지가
// 라운드 만족도를 좌우한다. 리뷰에서도 "slow play", "5 hour round" 가 반복 주제다.
// 코스 페이지에서 실제로 머무를 이유를 만들어주는 몇 안 되는 요소이기도 하다.

const DAY_LABEL: Record<string, string> = {
  Mo: "Mon", Tu: "Tue", We: "Wed", Th: "Thu", Fr: "Fri", Sa: "Sat", Su: "Sun",
};
const DAY_ORDER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function hourLabel(h: number): string {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  return h < 12 ? `${h}a` : `${h - 12}p`;
}

/** 골프는 아침 라운드가 기본이라 이른 시간대를 중심으로 본다. */
const FROM_HOUR = 5;
const TO_HOUR = 19;

export function TeeTimePlanner({ course }: { course: Course }) {
  const popular = course.popular_times ?? {};
  const days = DAY_ORDER.filter((d) => (popular[d]?.length ?? 0) > 0);
  const hours = course.opening_hours ?? [];
  if (days.length === 0 && hours.length === 0) return null;

  // 요일별로 가장 한산한 시간대(영업 중인 구간에서 최저 혼잡도)를 뽑아 요약한다.
  const quietest = days
    .map((d) => {
      const slots = (popular[d] ?? []).filter(
        (s) => s.hour >= FROM_HOUR && s.hour <= TO_HOUR && s.occupancyPercent > 0,
      );
      if (slots.length === 0) return null;
      const best = slots.reduce((a, b) => (b.occupancyPercent < a.occupancyPercent ? b : a));
      return { day: d, ...best };
    })
    .filter((x): x is { day: string; hour: number; occupancyPercent: number } => x !== null);
  const bestOverall = quietest.length
    ? quietest.reduce((a, b) => (b.occupancyPercent < a.occupancyPercent ? b : a))
    : null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-1">When to play</h2>
      <p className="text-sm text-[var(--muted)] mb-4">
        Crowd levels reported by Google, hour by hour.{" "}
        {bestOverall && (
          <>
            Quietest slot this week:{" "}
            <strong className="text-[var(--fg)]">
              {DAY_LABEL[bestOverall.day]} {hourLabel(bestOverall.hour)}
            </strong>
            .
          </>
        )}
      </p>

      {days.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white p-4">
          <div className="min-w-[34rem]">
            <div className="flex gap-1 pl-12 mb-1">
              {Array.from({ length: TO_HOUR - FROM_HOUR + 1 }, (_, i) => FROM_HOUR + i).map((h) => (
                <div key={h} className="flex-1 text-center text-[10px] text-[var(--muted)]">
                  {h % 3 === 0 ? hourLabel(h) : ""}
                </div>
              ))}
            </div>
            {days.map((d) => {
              const byHour = new Map((popular[d] ?? []).map((s) => [s.hour, s.occupancyPercent]));
              return (
                <div key={d} className="flex items-center gap-1 mb-1">
                  <div className="w-11 shrink-0 text-xs font-medium text-[var(--muted)]">
                    {DAY_LABEL[d]}
                  </div>
                  {Array.from({ length: TO_HOUR - FROM_HOUR + 1 }, (_, i) => FROM_HOUR + i).map((h) => {
                    const pct = byHour.get(h) ?? 0;
                    // 한산 → 붐빔. 골프장은 오전이 몰리므로 대비가 잘 드러나게 3단계로 나눈다.
                    const bg =
                      pct === 0 ? "bg-gray-100"
                        : pct < 34 ? "bg-emerald-200"
                        : pct < 67 ? "bg-amber-300"
                        : "bg-rose-400";
                    return (
                      <div
                        key={h}
                        className={`flex-1 h-6 rounded-sm ${bg}`}
                        title={`${DAY_LABEL[d]} ${hourLabel(h)} — ${pct}% busy`}
                      />
                    );
                  })}
                </div>
              );
            })}
            <div className="flex items-center gap-3 mt-3 text-[11px] text-[var(--muted)]">
              <span className="flex items-center gap-1"><i className="inline-block w-3 h-3 rounded-sm bg-emerald-200" /> quiet</span>
              <span className="flex items-center gap-1"><i className="inline-block w-3 h-3 rounded-sm bg-amber-300" /> moderate</span>
              <span className="flex items-center gap-1"><i className="inline-block w-3 h-3 rounded-sm bg-rose-400" /> busy</span>
              <span className="flex items-center gap-1"><i className="inline-block w-3 h-3 rounded-sm bg-gray-100" /> closed / no data</span>
            </div>
          </div>
        </div>
      )}

      {hours.length > 0 && (
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-white overflow-hidden">
          <h3 className="px-4 py-2.5 text-sm font-semibold border-b border-[var(--border)]">
            Opening hours
          </h3>
          <dl className="divide-y divide-[var(--border)]">
            {hours.map((h) => (
              <div key={h.day} className="flex justify-between px-4 py-2 text-sm">
                <dt className="text-[var(--muted)]">{h.day}</dt>
                <dd className="font-medium tabular-nums">{h.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
