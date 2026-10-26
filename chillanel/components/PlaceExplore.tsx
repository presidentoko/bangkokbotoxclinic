// 가게 페이지 → 허브 페이지 연결 (2026-10-25).
// 가게 페이지가 순위·서비스·같은 구역 페이지로 가는 링크가 거의 없는 막다른
// 길이었다(실측: 내부 링크 18개, 순위 0·서비스 0). 구글은 내부 링크로 페이지
// 사이 관계와 중요도를 읽는다 — 같은 구역끼리, 같은 순위끼리 묶어 준다.
import Link from "next/link";
import type { Place } from "@/lib/types";
import type { Lang } from "@/lib/site";
import { cityLabel } from "@/lib/site";
import { isRelevantCategory } from "@/lib/categories";
import { placeRanks, topicsWithEnoughEntries } from "@/lib/rankings";
import { RANKING_COPY, TOPIC_EMOJI, fill } from "@/lib/ranking-copy";
import { districtLabel } from "@/lib/district-labels";
import { themeLabel, themeEmoji, slugifyTheme } from "@/lib/theme-labels";

const COPY: Record<Lang, { ranked: string; rankings: string; sameDistrict: string; services: string; rank: (n: number) => string }> = {
  en: { ranked: "Where this place ranks", rankings: "Rankings in {city}", sameDistrict: "Also in {district}", services: "Browse by service", rank: (n) => `#${n}` },
  th: { ranked: "อันดับของร้านนี้", rankings: "อันดับร้านใน{city}", sameDistrict: "ร้านอื่นใน{district}", services: "ค้นหาตามบริการ", rank: (n) => `อันดับ ${n}` },
  ko: { ranked: "이 업체의 순위", rankings: "{city} 순위 보기", sameDistrict: "{district}의 다른 업체", services: "서비스별로 보기", rank: (n) => `${n}위` },
};

const SAME_DISTRICT_MAX = 8;

export function PlaceExplore({
  place,
  cityPlaces,
  exclude,
  minReviews,
  lang,
}: {
  place: Place;
  cityPlaces: Place[];
  /** ids already linked on the page (e.g. "similar places") */
  exclude: string[];
  /** only link places whose pages are indexable, so the links pass value */
  minReviews: number;
  lang: Lang;
}) {
  const c = COPY[lang];
  const city = place.city;
  const label = cityLabel(city, lang);
  const ranks = placeRanks(city).get(place.id) ?? [];
  const rankedTopics = new Set(ranks.map((r) => r.topic));
  const otherTopics = topicsWithEnoughEntries(city).filter((t) => !rankedTopics.has(t));

  const skip = new Set([place.id, ...exclude]);
  const sameDistrict = place.district
    ? cityPlaces
        .filter(
          (p) =>
            p.district === place.district &&
            !skip.has(p.id) &&
            isRelevantCategory(p.primaryType) &&
            (p.reviewCount ?? 0) >= minReviews &&
            (p.reviews?.length ?? 0) > 0,
        )
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
        .slice(0, SAME_DISTRICT_MAX)
    : [];

  const services = place.serviceThemes.slice(0, 6);
  const chip = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm hover:border-accent hover:text-accent";

  return (
    <nav className="mt-10 space-y-8" aria-label={c.rankings.replace("{city}", label)}>
      {ranks.length > 0 && (
        <section>
          <h2 className="font-display italic text-2xl mb-3">🏆 {c.ranked}</h2>
          <ul className="flex flex-wrap gap-2">
            {ranks.map(({ topic, rank }) => (
              <li key={topic}>
                <Link href={`/${lang}/city/${city}/best/${topic}`} className={`${chip} border-accent-warm/50 font-semibold`}>
                  {TOPIC_EMOJI[topic]} {c.rank(rank)} · {fill(RANKING_COPY[lang].topics[topic].h1, { city: label })}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sameDistrict.length > 0 && place.district && (
        <section>
          <h2 className="font-display italic text-2xl mb-3">{c.sameDistrict.replace("{district}", districtLabel(place.district, lang))}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {sameDistrict.map((p) => (
              <li key={p.id} className="flex items-baseline justify-between gap-3">
                <Link href={`/${lang}/place/${p.id}`} className="font-medium hover:text-accent truncate">
                  {p.name}
                </Link>
                {p.rating != null && (
                  <span className="shrink-0 tabular-nums text-muted">
                    ★{p.rating.toFixed(1)} · {p.reviewCount.toLocaleString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {services.length > 0 && (
        <section>
          <h2 className="font-display italic text-2xl mb-3">{c.services}</h2>
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.label}>
                <Link href={`/${lang}/service/${slugifyTheme(s.label)}`} className={chip}>
                  {themeEmoji(s.label) && <span aria-hidden="true">{themeEmoji(s.label)}</span>}
                  {themeLabel(s.label, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {otherTopics.length > 0 && (
        <section>
          <h2 className="font-display italic text-2xl mb-3">📊 {c.rankings.replace("{city}", label)}</h2>
          <ul className="flex flex-wrap gap-2">
            {otherTopics.map((topic) => (
              <li key={topic}>
                <Link href={`/${lang}/city/${city}/best/${topic}`} className={chip}>
                  {TOPIC_EMOJI[topic]} {fill(RANKING_COPY[lang].topics[topic].h1, { city: label })}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </nav>
  );
}
