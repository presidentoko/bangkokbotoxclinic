// 동네·도시 단위 집계표 (lib/area-stats.ts). 구글 지도에는 없는 값 — 항목별 만족도, 팁 강요 신고율,
// 외국어 리뷰 비중, 리뷰에 언급된 가격 — 을 비교 집단과 나란히 놓는다. 서버 컴포넌트, JS 0.
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { areaProfile, areaMetricName, formatAreaMetric } from "@/lib/area-stats";

const COPY: Record<Lang, { title: string; here: string; places: string; note: string }> = {
  en: { title: "What reviews say about {area}", here: "Here", places: "{n} places with 30+ reviews compared", note: "Counted by chillanel from the reviews we read. Shares are of places or reviews, not of visitors." },
  th: { title: "รีวิวพูดถึง{area}อย่างไร", here: "ที่นี่", places: "เปรียบเทียบ {n} ร้านที่มีรีวิว 30+ รายการ", note: "chillanel นับจากรีวิวที่เราอ่าน สัดส่วนเป็นของร้านหรือรีวิว ไม่ใช่ของผู้มาเยือน" },
  ko: { title: "{area} 리뷰가 말하는 것", here: "이 지역", places: "리뷰 30건 이상인 {n}곳 비교", note: "chillanel이 읽은 리뷰를 집계한 값입니다. 비율은 방문자가 아니라 업소·리뷰 기준입니다." },
};

export default function AreaProfileCard({
  area, baseline, areaName, baseName, lang,
}: { area: Place[]; baseline: Place[]; areaName: string; baseName: string; lang: Lang }) {
  const profile = areaProfile(area, baseline, areaName, baseName, lang);
  if (!profile) return null;
  const t = COPY[lang];
  return (
    <section className="rounded-2xl border border-border bg-bg-elev p-4 sm:p-5 mb-8">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
        <h2 className="font-bold text-lg">📊 {t.title.replace("{area}", areaName)}</h2>
        <span className="text-[11px] uppercase tracking-wide text-muted font-semibold">chillanel</span>
      </div>
      <p className="text-xs text-muted mb-3">{t.places.replace("{n}", String(profile.places))}</p>
      {profile.headline && <p className="text-sm leading-relaxed mb-4">{profile.headline}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm tabular-nums">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="font-semibold pb-2 pr-3"><span className="sr-only">metric</span></th>
              <th className="font-semibold pb-2 pr-3 text-right">{t.here}</th>
              <th className="font-semibold pb-2 text-right">{baseName}</th>
            </tr>
          </thead>
          <tbody>
            {profile.metrics.map((m) => (
              <tr key={m.key} className="border-t border-border">
                <td className="py-2 pr-3">{areaMetricName(m.key, lang)}</td>
                <td className="py-2 pr-3 text-right font-semibold">{formatAreaMetric(m.key, m.area)}</td>
                <td className="py-2 text-right text-muted">{formatAreaMetric(m.key, m.base)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted mt-3">{t.note}</p>
    </section>
  );
}
