import { loadMasterDb, topByTrust } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { StatsBar } from "@/components/StatsBar";
import { sortWithSponsored } from "@/lib/sponsored";
import { BEST_FOR } from "@/lib/bestFor";
import { HeroSearch } from "@/components/HeroSearch";
import { GUIDES_TH } from "@/lib/guides_th";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สนามกอล์ฟไทย — รีวิวและคะแนนความน่าเชื่อถือ",
  description: "ไดเรกทอรีสนามกอล์ฟทั่วไทย กรุงเทพ พัทยา หัวหิน เชียงใหม่ ภูเก็ต จัดอันดับด้วยคะแนนความน่าเชื่อถือจากรีวิว Google จริง",
  alternates: { canonical: "/th", languages: { "th-TH": "/th", "ko-KR": "/ko", "en-US": "/" } },
  openGraph: { locale: "th_TH" },
};

const TH_FAQS = [
  {
    q: "คะแนนความน่าเชื่อถือคำนวณอย่างไร?",
    a: "0-100 รวม 4 ปัจจัย: คะแนน Google (50%), จำนวนรีวิว log-scale (40%), อัตราส่วน Local Guide (10%), ความน่าเชื่อถือเฉลี่ยของผู้รีวิว (5%) อัปเดตต่อเนื่อง",
  },
  {
    q: "ค่ากรีนฟีสนามกอล์ฟไทยเท่าไหร่?",
    a: "สนามสาธารณะวันธรรมดา ฿1,500-3,000 วันหยุด ฿2,500-5,000 คันทรีคลับ ฿3,500-8,000+ ค่าแคดดี้ (~฿400) และทิป (~฿400-500) แยกต่างหาก",
  },
  {
    q: "ข้อมูลอัปเดตบ่อยแค่ไหน?",
    a: "อัปเดตต่อเนื่องจาก Google Maps สาธารณะ ตัวอย่างรีวิวที่แสดงเป็นข้อความจริงจากรีวิวเมื่อเร็วๆ นี้",
  },
  {
    q: "สนามที่แสดงเป็นโฆษณาหรือไม่?",
    a: "รายชื่อทั่วไปไม่เสียค่าใช้จ่าย ช่อง Editor's Pick / Recommended / Featured ติดป้ายชัดเจน เราไม่ลบหรือลดอันดับสนามที่ไม่ได้จ่าย",
  },
];

export default async function ThHomePage() {
  const db = await loadMasterDb();
  const top = sortWithSponsored(topByTrust(db.restaurants, 30));

  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;

  const cities = Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]);

  const districtMap = new Map<string, number>();
  for (const r of db.restaurants) {
    if (r.district) districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const categories = Object.entries(db.cuisine_counts).sort((a, b) => b[1] - a[1]);

  const searchIndex = db.restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: r.trust_score,
  }));

  return (
    <>
      <div className="text-center pt-6 text-xs uppercase tracking-wider text-[var(--muted)]">
        ภาษาไทย · <a href="/" className="underline hover:text-[var(--fg)]">English</a> · <a href="/ko" className="underline hover:text-[var(--fg)]">한국어</a>
      </div>
      <HeroSearch
        entities={searchIndex}
        hrefBase="/course"
        hero="สนามกอล์ฟไทย — ตรวจสอบจากรีวิวจริง"
        heroSub={`${db.total_restaurants.toLocaleString()} สนาม · วิเคราะห์รีวิว Google ${totalReviews.toLocaleString()} รายการ`}
        popularSearches={[
          { label: "กรุงเทพ", href: "/city/bangkok" },
          { label: "พัทยา", href: "/city/chon_buri" },
          { label: "หัวหิน", href: "/city/prachuap_khiri_khan" },
          { label: "ภูเก็ต", href: "/city/phuket" },
        ]}
        popularLabel="ยอดนิยม"
        searchLang="th"
      />

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={db.total_restaurants}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="สนาม"
        label="ตรวจสอบจากรีวิว"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามจังหวัด</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, count]) => (
                <a
                  key={city}
                  href={`/city/${city.toLowerCase().replace(/\s+/g, "_")}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition font-medium"
                >
                  {city}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามประเภทสนาม</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <span aria-hidden>{CATEGORY_ICONS[cat] ?? "⛳"}</span>
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">คู่มือภาษาไทย</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {GUIDES_TH.map((g) => (
              <a
                key={g.slug}
                href={`/th/guide/${g.slug}`}
                className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] hover:shadow-sm transition"
              >
                <div className="font-medium leading-tight">{g.title.replace(/ \(\d{4}\)$/, "")}</div>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed line-clamp-2">{g.metaDescription.slice(0, 90)}…</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">แนะนำตามธีม</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {BEST_FOR.slice(0, 9).map((c) => (
              <a
                key={c.slug}
                href={`/best/${c.slug}`}
                className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                {c.title.replace(/^Best |^Most /, "").replace(/ in Thailand$/, "")}
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามเขต</h2>
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

        <AdSlot slot="th-home-mid" />

        <section>
          <h2 className="text-xl font-bold mb-4">อันดับ {Math.min(top.length, 30)} ตามคะแนน</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline />
          <div className="grid gap-3 mt-3">
            {top.slice(10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 11} />
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
          name="สนามกอล์ฟไทย Top 20 ตามคะแนนความน่าเชื่อถือ"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
        />
      </div>
    </>
  );
}
