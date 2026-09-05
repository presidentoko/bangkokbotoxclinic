import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel, ogLocale } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { isRelevantCategory } from "@/lib/categories";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlaceCard } from "@/components/PlaceCard";
import { districtLabel } from "@/lib/district-labels";
import { buildWatchlist, FLAG_EMOJI, type FlagKey } from "@/lib/verdict";

// Chillanel Watchlist — 리뷰 마이닝 경보를 도시별로 모은 공유용 페이지.
// 2026-09-05: place 페이지의 Chillanel Check 신호(≥2건 리뷰에서 같은 불만)를
// 한 곳에 모았다. SNS에 뿌릴 수 있는 "우리만 만들 수 있는" 콘텐츠이자,
// 666곳의 경고 신호를 잠자게 두지 않는 내부 링크 허브다.
//
// 공정성 원칙: 실명 비난이 아니라 "공개된 구글 리뷰 중 ★4 이하 {n}건이 X를
// 언급"이라는 사실 보도 + 원문 인용 + 전체 맥락(장소 페이지) 링크. 같은
// 기준으로 신호 0인 클린 리스트를 나란히 실어 경보가 아니라 검증임을 보인다.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${t.place.wlTitle} — ${SITE.name}`,
    description: t.place.wlMetaDesc,
    alternates: {
      canonical: `/${lang}/watchlist`,
      languages: hreflangAlternates((l) => `/${l}/watchlist`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/watchlist`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function WatchlistPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);
  const p = t.place;
  const flagLabels: Record<FlagKey, string> = {
    overcharge: p.flagOvercharge, tipPressure: p.flagTipPressure,
    upsell: p.flagUpsell, hygiene: p.flagHygiene, rude: p.flagRude,
  };

  const cities = listCities().map((city) => {
    const places = loadCity(city).places.filter((pl) => isRelevantCategory(pl.primaryType));
    const wl = buildWatchlist(places);
    return { city, flagged: wl.flagged.slice(0, 15), clean: wl.clean.slice(0, 6) };
  });

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 sm:pt-12 pb-16">
      {/* place 페이지와 같은 잉크 히어로 밴드 — 사이트의 리듬 언어 */}
      <section className="relative overflow-hidden bg-ink text-on-ink -mx-4 -mt-10 sm:-mt-12 sm:mx-[calc(50%-50vw)] mb-10">
        <div className="spa-glow bg-accent w-[320px] h-[320px] -top-24 -left-24" aria-hidden="true" />
        <div className="spa-glow bg-accent-warm w-[280px] h-[280px] -bottom-24 -right-16" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-10">
          <Breadcrumbs
            variant="ink"
            items={[
              { name: t.nav.home, href: `/${lang}` },
              { name: p.wlTitle, href: `/${lang}/watchlist` },
            ]}
          />
          <h1 className="font-display italic font-semibold text-3xl sm:text-5xl mb-4 tracking-tight leading-[1.12]">
            ⚠️ {p.wlTitle}
          </h1>
          <p className="text-on-ink-muted max-w-xl leading-relaxed">{p.wlHeroSubtitle}</p>
        </div>
      </section>

      {cities.map(({ city, flagged, clean }) => (
        <section key={city} className="mb-14">
          <h2 className="font-display italic text-2xl sm:text-3xl mb-1">{cityLabel(city)}</h2>

          {flagged.length > 0 && (
            <>
              <h3 className="text-sm font-bold mt-5 mb-1 text-amber-600 dark:text-amber-400">
                🚩 {p.wlRedTitle}
              </h3>
              <p className="text-xs text-muted mb-4 max-w-xl">{p.wlMethodNote}</p>
              <div className="space-y-3">
                {flagged.map((e) => (
                  <div key={e.place.id} className="rounded-xl border border-border bg-bg-elev p-4">
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <Link
                        href={`/${lang}/place/${e.place.id}`}
                        className="font-semibold hover:text-accent transition-colors"
                      >
                        {e.place.name}
                      </Link>
                      <span className="text-xs text-muted tabular-nums shrink-0">
                        {e.place.rating != null && <>★{e.place.rating.toFixed(1)} · </>}
                        {e.place.reviewCount} {p.reviewCountLabel}
                        {e.place.district && <> · {districtLabel(e.place.district, lang)}</>}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {e.flags.map((f) => (
                        <span
                          key={f.key}
                          className="rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold px-2.5 py-0.5 text-xs"
                        >
                          {FLAG_EMOJI[f.key]} {flagLabels[f.key]} ×{f.count}
                        </span>
                      ))}
                    </div>
                    <blockquote className="mt-2.5 text-xs italic text-muted border-l-2 border-amber-500/40 pl-2">
                      “{e.flags[0].quote}”
                      {e.flags[0].quoteRating != null && e.flags[0].quoteRating >= 1 && (
                        <span className="not-italic"> (★{e.flags[0].quoteRating})</span>
                      )}
                    </blockquote>
                  </div>
                ))}
              </div>
            </>
          )}

          {clean.length > 0 && (
            <>
              <h3 className="text-sm font-bold mt-8 mb-1 text-accent">✅ {p.wlCleanTitle}</h3>
              <p className="text-xs text-muted mb-4 max-w-xl">{p.wlCleanSubtitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {clean.map((pl) => (
                  <PlaceCard key={pl.id} place={pl} lang={lang} />
                ))}
              </div>
            </>
          )}
        </section>
      ))}
    </div>
  );
}
