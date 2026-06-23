import { loadMasterDb, topByTrust } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { StatsBar } from "@/components/StatsBar";
import { HeroSearch } from "@/components/HeroSearch";
import { sortWithSponsored } from "@/lib/sponsored";
import { NICHES, loadNicheDb } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "バンコクのおすすめレストラン — SNSより本物のクチコミで選ぶ",
  description:
    "バンコク・パタヤのレストランガイド。Googleの実際のクチコミを分析したTrustスコアでランキング。インフルエンサー広告なし。タイ料理、日本食、ムエタイ、スパなど全て網羅。",
  alternates: {
    canonical: "/ja",
    languages: { "ja": "/ja", "en": "/", "th": "/th", "ko": "/ko", "ru": "/ru", "ar": "/ar", "x-default": "/" },
  },
  openGraph: { locale: "ja_JP" },
};

const JA_NICHE_LABELS: Record<string, string> = {
  "muay-thai": "ムエタイ",
  "spa": "スパ・マッサージ",
  "wellness": "ウェルネス",
  "yoga-pilates": "ヨガ・ピラティス",
  "cooking": "タイ料理教室",
  "coworking": "コワーキング",
  "diving": "ダイビング",
};

const JA_FAQS = [
  {
    q: "Trustスコアはどうやって計算されますか？",
    a: "0〜100のスコアで4つのシグナルを組み合わせています：Googleの評価（ウェイト50%）、クチコミ数（対数スケール・40%）、Google Local Guideの割合（10%）、レビュアーの信頼度（5%）。30分ごとに更新されます。",
  },
  {
    q: "バンコクでムエタイ体験はできますか？",
    a: "もちろん！381以上のジムが一覧にあります。「Beginner Friendly」マークのジムは観光客向けで、英語対応のトレーナーがいます。1回体験は約฿300〜฿800。Klookでの予約も可能です。",
  },
  {
    q: "タイ古式マッサージの相場はいくらですか？",
    a: "街中のマッサージ店では1時間฿200〜฿400が目安。中級スパなら฿500〜฿1,200。ホテルスパは฿1,500〜฿3,000以上。チップは฿50〜฿100が一般的です。",
  },
  {
    q: "日本語対応のお店はありますか？",
    a: "一部のレストランやアクティビティ施設では日本語スタッフがいます。各ページの「🇯🇵 Japanese」バッジが目印です。スクンビット周辺には日本人向けのお店も多くあります。",
  },
  {
    q: "予約は必要ですか？",
    a: "多くのレストランはウォークインOKです。人気店や週末は事前予約をおすすめします。各店舗ページから電話番号やウェブサイトに直接アクセスできます。",
  },
];

export default async function JaHomePage() {
  const [db, slugMap, nicheResults] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
    Promise.all(NICHES.map((n) => loadNicheDb(n.slug as NicheSlug).then((d) => ({ slug: n.slug, icon: n.icon, label: n.label, total: d.total })).catch(() => ({ slug: n.slug, icon: n.icon, label: n.label, total: 0 })))),
  ]);
  const nicheCounts = nicheResults;
  const top = sortWithSponsored(topByTrust(db.restaurants, 30));

  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;

  const districtMap = new Map<string, number>();
  for (const r of db.restaurants) {
    if (r.district) districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  const cuisines = Object.entries(db.cuisine_counts);

  return (
    <div lang="ja">
      <section className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            日本語 · <a href="/" className="underline hover:text-[var(--fg)]">English</a> · <a href="/ko" className="underline hover:text-[var(--fg)]">한국어</a> · <a href="/ru" className="underline hover:text-[var(--fg)]">Русский</a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
            SNSより<span className="text-orange-600">本物のクチコミ</span>で<br className="md:hidden" />バンコクグルメ
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] mb-6">
            {db.total_restaurants.toLocaleString()}店舗 · {totalReviews.toLocaleString()}件のGoogleクチコミ分析 · 広告・PR一切なし
          </p>
          <div className="max-w-2xl mx-auto">
            <HeroSearch
              entities={db.restaurants.map((r) => ({
                id: r.id, name: r.name, district: r.district,
                city_label: r.city_label, rating: r.rating, trust_score: r.trust_score,
              }))}
              hrefBase="/restaurant"
              popularSearches={cuisines.slice(0, 4).map(([cat]) => ({
                label: CUISINE_LABELS[cat] ?? cat,
                href: `/c/${cat}`,
              }))}
              popularLabel="人気"
            />
          </div>
        </div>
      </section>

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={db.total_restaurants}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="店舗"
        label="クチコミで検証済み"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {cuisines.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">料理ジャンル別</h2>
            <div className="flex flex-wrap gap-2">
              {cuisines.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <span aria-hidden>{CUISINE_ICONS[cat] ?? "🍴"}</span>
                  {CUISINE_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">エリア別</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(([d, count]) => (
              <a
                key={d}
                href={`/d/${encodeURIComponent(d.toLowerCase().replace(/\s+/g, "-"))}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        {/* アクティビティセクション */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">バンコクのアクティビティ</h2>
            <a href="/activities" className="text-xs text-[var(--muted)] hover:text-black">すべて見る →</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nicheCounts.map((n) => (
              <a
                key={n.slug}
                href={`/activities/${n.slug}`}
                className="group block bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-300 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">{n.icon}</div>
                <div className="font-bold text-sm group-hover:text-orange-600 transition leading-tight">{JA_NICHE_LABELS[n.slug] ?? n.label}</div>
                <div className="text-xs text-[var(--muted)] mt-1">{n.total.toLocaleString()}件</div>
              </a>
            ))}
          </div>
          <div className="mt-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-800">
            🥊 <strong>ムエタイ体験</strong>は日本人観光客に大人気。Klookで簡単予約、英語対応トレーナー付き。
          </div>
        </section>

        <AdSlot slot="ja-home-mid" />

        <section>
          <h2 className="text-xl font-bold mb-4">Trust Scoreランキング Top{Math.min(top.length, 30)}</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} slugMap={slugMap} />
            ))}
          </div>
          <AffiliateInline />
          <div className="grid gap-3 mt-3">
            {top.slice(10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 11} slugMap={slugMap} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">よくある質問</h2>
          <div className="space-y-3">
            {JA_FAQS.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <FaqJsonLd faqs={JA_FAQS} />
        <ItemListJsonLd
          name="バンコクのおすすめレストラン Trust Scoreランキング"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }) }))}
        />
      </div>
    </div>
  );
}
