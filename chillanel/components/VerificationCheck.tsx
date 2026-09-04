// Chillanel Check — 구글 별점 위에 얹는 우리만의 검증 레이어.
// 서버 컴포넌트: 전부 빌드타임 계산(lib/verdict.ts), 클라이언트 JS 0.
import { tFor } from "@/lib/i18n";
import { localeFor, type Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { districtLabel } from "@/lib/district-labels";
import {
  scanRedFlags, recentTrend, districtStanding, priceVsDistrict, type FlagKey,
} from "@/lib/verdict";
import { priceMedian } from "@/lib/summary";

const FLAG_EMOJI: Record<FlagKey, string> = {
  overcharge: "💸", tipPressure: "🤲", upsell: "🛍️", hygiene: "🧼", rude: "🗣️",
};

export default function VerificationCheck({
  place, cityPlaces, lang,
}: { place: Place; cityPlaces: Place[]; lang: Lang }) {
  const t = tFor(lang).place;
  const flags = scanRedFlags(place.reviews);
  const trend = recentTrend(place.reviews, place.rating);
  const standing = districtStanding(place, cityPlaces);
  const priceCtx = priceVsDistrict(place, cityPlaces);
  const nReviews = place.reviews.length;

  // 보여줄 게 하나도 없으면(리뷰가 너무 적은 신규 장소) 카드 자체를 내지 않는다.
  const hasAllClear = flags.length === 0 && nReviews >= 8;
  if (!hasAllClear && flags.length === 0 && !trend && !standing && !priceCtx) return null;

  const flagLabels: Record<FlagKey, string> = {
    overcharge: t.flagOvercharge, tipPressure: t.flagTipPressure,
    upsell: t.flagUpsell, hygiene: t.flagHygiene, rude: t.flagRude,
  };
  const loc = localeFor(lang);
  const myPrice = priceMedian(place.priceMentions);

  return (
    <section className="rounded-2xl border-2 border-accent/25 bg-accent/[0.04] p-4 sm:p-5 mb-8">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
        <h2 className="font-bold text-lg">🔍 {t.checkTitle}</h2>
        <span className="text-[11px] uppercase tracking-wide text-muted font-semibold">chillanel</span>
      </div>
      <p className="text-xs text-muted mb-4">{t.checkSubtitle.replace("{n}", String(nReviews))}</p>

      <ul className="space-y-3 text-sm">
        {hasAllClear && (
          <li className="flex gap-2.5">
            <span aria-hidden="true">✅</span>
            <span>{t.checkAllClear.replace("{n}", String(nReviews))}</span>
          </li>
        )}
        {flags.map((f) => (
          <li key={f.key} className="flex gap-2.5">
            <span aria-hidden="true">⚠️</span>
            <div>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {FLAG_EMOJI[f.key]} {flagLabels[f.key]}
              </span>{" "}
              <span className="text-muted">
                — {t.flagMentions.replace("{n}", String(f.count))}
              </span>
              <blockquote className="mt-1 text-xs text-muted italic border-l-2 border-amber-500/40 pl-2">
                “{f.quote}”{f.quoteRating != null && <span className="not-italic"> (★{f.quoteRating})</span>}
              </blockquote>
            </div>
          </li>
        ))}
        {trend && (
          <li className="flex gap-2.5">
            <span aria-hidden="true">{trend.direction === "down" ? "📉" : "📈"}</span>
            <span>
              {(trend.direction === "up" ? t.trendUp : trend.direction === "down" ? t.trendDown : t.trendSteady)
                .replace("{recent}", trend.recentAvg.toFixed(1))
                .replace("{n}", String(trend.recentCount))
                .replace("{overall}", (place.rating as number).toFixed(1))}
            </span>
          </li>
        )}
        {standing && place.district && (
          <li className="flex gap-2.5">
            <span aria-hidden="true">🏆</span>
            <span>
              {t.standingLine
                .replace("{pct}", String(standing.betterThanPct))
                .replace("{total}", String(standing.total))
                .replace("{district}", districtLabel(place.district, lang))}
            </span>
          </li>
        )}
        {priceCtx && myPrice != null && place.district && (
          <li className="flex gap-2.5">
            <span aria-hidden="true">💸</span>
            <span>
              {(priceCtx.verdict === "below" ? t.priceBelow : priceCtx.verdict === "above" ? t.priceAbove : t.priceTypical)
                .replace("{price}", myPrice.toLocaleString(loc))
                .replace("{median}", priceCtx.districtMedian.toLocaleString(loc))
                .replace("{district}", districtLabel(place.district, lang))}
            </span>
          </li>
        )}
      </ul>
    </section>
  );
}
