import { loadMasterDb, topByTrust } from "@/lib/data";
import { getSlugMap, restaurantUrl, slugifySegment } from "@/lib/restaurants";
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

export const metadata: Metadata = {
  title: "ร้านอาหารกรุงเทพ — รีวิวและคะแนนความน่าเชื่อถือ",
  description: "ไดเรกทอรีร้านอาหารกรุงเทพและพัทยา จัดอันดับด้วยคะแนนความน่าเชื่อถือจากรีวิว Google จริง",
  alternates: { canonical: "/th", languages: { "th": "/th", "en": "/", "ko": "/ko", "ja": "/ja", "ru": "/ru", "ar": "/ar", "x-default": "/" } },
  openGraph: { locale: "th_TH" },
};

const TH_FAQS = [
  {
    q: "คะแนนความน่าเชื่อถือคำนวณอย่างไร?",
    a: "0-100 รวม 4 ปัจจัย: คะแนน Google (50%), จำนวนรีวิว log-scale (40%), อัตราส่วน Local Guide (10%), ความน่าเชื่อถือเฉลี่ยของผู้รีวิว (5%)",
  },
  {
    q: "ข้อมูลอัปเดตบ่อยแค่ไหน?",
    a: "ทุก 30 นาที สแครเปอร์ทำงาน 24/7",
  },
  {
    q: "ร้านที่แสดงเป็นโฆษณาหรือไม่?",
    a: "รายชื่อทั่วไปไม่เสียค่าใช้จ่าย ช่อง Editor's Pick / Recommended / Featured ติดป้ายชัดเจน",
  },
];

export default async function ThHomePage() {
  const [db, slugMap, nicheResults] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
    Promise.all(NICHES.map((n) => loadNicheDb(n.slug as NicheSlug).then((d) => ({ slug: n.slug, icon: n.icon, label: n.label, total: d.total })).catch(() => ({ slug: n.slug, icon: n.icon, label: n.label, total: 0 })))),
  ]);
  const nicheCounts = nicheResults;
  const top = sortWithSponsored(topByTrust(db.restaurants, 30));

  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;

  const districtMap = new Map<string, { city: string; count: number }>();
  for (const r of db.restaurants) {
    if (r.district) {
      const key = `${r.city}|${r.district}`;
      const existing = districtMap.get(key);
      districtMap.set(key, { city: r.city, count: (existing?.count ?? 0) + 1 });
    }
  }
  const districts = [...districtMap.entries()]
    .map(([key, v]) => ({ district: key.split("|")[1], city: v.city, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const cuisines = Object.entries(db.cuisine_counts);

  return (
    <div lang="th">
      <section className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            ภาษาไทย · <a href="/" className="underline hover:text-[var(--fg)]">English</a> · <a href="/ko" className="underline hover:text-[var(--fg)]">한국어</a> · <a href="/ja" className="underline hover:text-[var(--fg)]">日本語</a> · <a href="/ru" className="underline hover:text-[var(--fg)]">RU</a> · <a href="/ar" className="underline hover:text-[var(--fg)]">AR</a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
            ร้านอาหารกรุงเทพ — ตรวจสอบจากรีวิวจริง
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] mb-6">
            {db.total_restaurants.toLocaleString()} ร้าน · วิเคราะห์รีวิว Google {totalReviews.toLocaleString()} รายการ
          </p>
          <div className="max-w-2xl mx-auto">
            <HeroSearch
              entities={db.restaurants.map((r) => ({
                id: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }).slice(1),
                name: r.name, district: r.district,
                city_label: r.city_label, rating: r.rating, trust_score: r.trust_score,
              }))}
              hrefBase=""
              popularSearches={cuisines.slice(0, 4).map(([cat]) => ({
                label: CUISINE_LABELS[cat] ?? cat,
                href: `/restaurants/cuisine/${cat}`,
              }))}
              popularLabel="ยอดนิยม"
              searchLang="th"
            />
          </div>
        </div>
      </section>

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={db.total_restaurants}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="ร้าน"
        label="ตรวจสอบจากรีวิว"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {cuisines.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามประเภทอาหาร</h2>
            <div className="flex flex-wrap gap-2">
              {cuisines.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/restaurants/cuisine/${cat}`}
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
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามเขต</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(({ district: d, city, count }) => (
              <a
                key={`${city}-${d}`}
                href={`/restaurants/${city}/${slugifySegment(d)}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        {/* กิจกรรมในกรุงเทพ */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">กิจกรรมในกรุงเทพ</h2>
            <a href="/activities" className="text-xs text-[var(--muted)] hover:text-black">ดูทั้งหมด →</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nicheCounts.map((n) => (
              <a
                key={n.slug}
                href={`/activities/${n.slug}`}
                className="group block bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-300 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">{n.icon}</div>
                <div className="font-bold text-sm group-hover:text-orange-600 transition leading-tight">{n.label}</div>
                <div className="text-xs text-[var(--muted)] mt-1">{n.total.toLocaleString()} แห่ง</div>
              </a>
            ))}
          </div>
        </section>

        <AdSlot slot="th-home-mid" />

        <section>
          <h2 className="text-xl font-bold mb-4">อันดับ {Math.min(top.length, 30)} ตามคะแนน</h2>
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
          <h2 className="text-xl font-bold mb-4">คำถามที่พบบ่อย</h2>
          <div className="space-y-3">
            {TH_FAQS.map((f, i) => (
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

        <FaqJsonLd faqs={TH_FAQS} />
        <ItemListJsonLd
          name="Top Bangkok Restaurants by Trust Score (Thai)"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }) }))}
        />
      </div>
    </div>
  );
}
