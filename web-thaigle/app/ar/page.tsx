import { loadMasterDb, topByTrust } from "@/lib/data";
import { getSlugMap, restaurantUrl, slugifySegment } from "@/lib/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { AdSlot } from "@/components/AdSlot";
import { StatsBar } from "@/components/StatsBar";
import { HeroSearch } from "@/components/HeroSearch";
import { sortWithSponsored } from "@/lib/sponsored";
import { NICHES, loadNicheDb, qualifyingNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "أفضل مطاعم بانكوك — تقييمات حقيقية، بدون إعلانات",
  description:
    "دليل مطاعم بانكوك وباتايا. تصنيفات مبنية على تحليل تقييمات Google الحقيقية — بدون إعلانات مدفوعة. المطبخ التايلاندي، الحلال، المأكولات البحرية، وأكثر.",
  alternates: {
    canonical: "/ar",
    languages: { "ar": "/ar", "en": "/", "th": "/th", "ko": "/ko", "ja": "/ja", "ru": "/ru", "x-default": "/" },
  },
  openGraph: { locale: "ar_SA" },
};

const AR_NICHE_LABELS: Record<string, string> = {
  "muay-thai": "موي تاي",
  "spa": "سبا ومساج",
  "wellness": "عافية وصحة",
  "yoga-pilates": "يوغا وبيلاتيس",
  "cooking": "دروس الطبخ التايلاندي",
  "coworking": "مساحات العمل",
  "diving": "الغوص",
};

const AR_FAQS = [
  {
    q: "كيف يُحسب Trust Score (درجة الثقة)؟",
    a: "هو رقم من 0 إلى 100 يجمع 4 إشارات: تقييم Google (وزن 50%)، عدد التقييمات بمقياس لوغاريتمي (40%)، نسبة مراجعي Google Local Guide (10%)، ومتوسط سلطة المراجعين (5%). يتم التحديث كل 30 دقيقة.",
  },
  {
    q: "هل توجد مطاعم حلال في بانكوك؟",
    a: "نعم، بانكوك تضم عدداً كبيراً من المطاعم الحلال، خاصة في منطقتَي بانغراك وسيلوم. استخدم فلتر Halal في قسم 'الأفضل' للعثور على الخيارات المعتمدة. الطعام التايلاندي الحلال متوفر على نطاق واسع.",
  },
  {
    q: "ما تكلفة تجربة موي تاي في بانكوك؟",
    a: "الجلسة الواحدة تتراوح بين ฿300 و฿800. معظم الصالات تقدم خوذات وقفازات مجاناً أو بإيجار بسيط. يمكن الحجز عبر Klook بسهولة مع مدرب يتحدث الإنجليزية.",
  },
  {
    q: "هل يمكنني الوثوق بهذه التقييمات؟",
    a: "جميع التقييمات والأرقام مأخوذة مباشرة من بيانات Google Maps العامة. لا نقوم بأي تعديل أو تصفية. لا توجد مدفوعات مقابل التقييمات.",
  },
  {
    q: "هل أحتاج إلى حجز مسبق في المطاعم؟",
    a: "معظم مطاعم بانكوك تقبل الزيارة المباشرة دون حجز. للمطاعم ذات التقييم العالي والمواعيد الذروة، يُنصح بالحجز قبل يوم أو يومين عبر LINE أو الهاتف.",
  },
];

export default async function ArHomePage() {
  const [db, slugMap, nicheResults] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
    Promise.all(NICHES.map((n) => loadNicheDb(n.slug as NicheSlug).then((d) => ({ slug: n.slug, icon: n.icon, label: n.label, total: qualifyingNichePlaces(n.slug, d.places).length })).catch(() => ({ slug: n.slug, icon: n.icon, label: n.label, total: 0 })))),
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
    <div lang="ar" dir="rtl">
      <section className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            العربية · <a href="/" className="underline hover:text-[var(--fg)]">English</a> · <a href="/th" className="underline hover:text-[var(--fg)]">ภาษาไทย</a> · <a href="/ko" className="underline hover:text-[var(--fg)]">한국어</a> · <a href="/ja" className="underline hover:text-[var(--fg)]">日本語</a> · <a href="/ru" className="underline hover:text-[var(--fg)]">Русский</a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
            أفضل مطاعم بانكوك<br className="md:hidden" /> بلا <span className="text-orange-600">إعلانات</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] mb-6">
            {db.total_restaurants.toLocaleString()} مطعم · {totalReviews.toLocaleString()} تقييم Google · تصنيف حقيقي فقط
          </p>
          <div className="max-w-2xl mx-auto" dir="ltr">
            <HeroSearch
              entities={[...db.restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, 400).map((r) => ({
                id: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }).slice(1),
                name: r.name, district: r.district,
                city_label: r.city_label, rating: r.rating, trust_score: r.trust_score,
              }))}
              hrefBase=""
              popularSearches={cuisines.slice(0, 4).map(([cat]) => ({
                label: CUISINE_LABELS[cat] ?? cat,
                href: `/restaurants/cuisine/${cat}`,
              }))}
              popularLabel="الأكثر بحثاً"
            />
          </div>
        </div>
      </section>

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={db.total_restaurants}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="مطعم"
        label="تم التحقق منها"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {cuisines.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">حسب نوع المطبخ</h2>
            <div className="flex flex-wrap gap-2">
              {cuisines.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/restaurants/cuisine/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <span aria-hidden>{CUISINE_ICONS[cat] ?? "🍴"}</span>
                  {CUISINE_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums" dir="ltr">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">حسب المنطقة</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(({ district: d, city, count }) => (
              <a
                key={`${city}-${d}`}
                href={`/restaurants/${city}/${slugifySegment(d)}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums" dir="ltr">{count}</span>
              </a>
            ))}
          </div>
        </section>

        {/* قسم الأنشطة */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">أنشطة بانكوك</h2>
            <a href="/activities" className="text-xs text-[var(--muted)] hover:text-black">← عرض الكل</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nicheCounts.map((n) => (
              <a
                key={n.slug}
                href={`/activities/${n.slug}`}
                className="group block bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-300 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">{n.icon}</div>
                <div className="font-bold text-sm group-hover:text-orange-600 transition leading-tight">{AR_NICHE_LABELS[n.slug] ?? n.label}</div>
                <div className="text-xs text-[var(--muted)] mt-1" dir="ltr">{n.total.toLocaleString()} مكان</div>
              </a>
            ))}
          </div>
          <div className="mt-3 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-800">
            🍽️ هل تبحث عن <strong>مطاعم حلال</strong>؟ تفضل بزيارة قسم <a href="/best/halal" className="underline font-bold">الأفضل · حلال</a>
          </div>
        </section>

        <AdSlot name="listInline" />

        <section>
          <h2 className="text-xl font-bold mb-4">أفضل {Math.min(top.length, 30)} مطعم بحسب درجة الثقة</h2>
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
          <h2 className="text-xl font-bold mb-4">الأسئلة الشائعة</h2>
          <div className="space-y-3">
            {AR_FAQS.map((f, i) => (
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

        <FaqJsonLd faqs={AR_FAQS} />
        <ItemListJsonLd
          name="أفضل مطاعم بانكوك بحسب درجة الثقة"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }) }))}
        />
      </div>
    </div>
  );
}
