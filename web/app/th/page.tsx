// Thai 홈 — 동일 데이터, Thai chrome.

import { loadMasterDb, topByTrust } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { CATEGORY_LABELS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { CategoryIcon } from "@/components/CategoryIcon";
import { StatsBar } from "@/components/StatsBar";
import { HeroSearch } from "@/components/HeroSearch";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import type { Metadata } from "next";

const t = tFor("th");

export const metadata: Metadata = {
  title: "คลินิกในกรุงเทพ — รีวิวที่ตรวจสอบแล้วและคะแนนความน่าเชื่อถือ",
  description: "ไดเรกทอรีคลินิกความงามและการแพทย์ในกรุงเทพ จัดอันดับด้วยคะแนนความน่าเชื่อถือจากรีวิว Google จริง",
  alternates: { canonical: "/th", languages: { "th-TH": "/th", "en-US": "/" } },
  openGraph: { locale: "th_TH" },
};

const TH_FAQS = [
  {
    q: "คะแนนความน่าเชื่อถือคำนวณอย่างไร?",
    a: "คะแนน 0-100 รวม 4 ปัจจัย: คะแนน Google ของคลินิก (น้ำหนัก 50%), จำนวนรีวิวแบบ logarithmic (40%), อัตราส่วนรีวิวจาก Local Guide (10%), และความน่าเชื่อถือเฉลี่ยของผู้รีวิว (5%) เป็นเมตริกของเรา ไม่ใช่อันดับ Google",
  },
  {
    q: "ข้อมูลอัปเดตบ่อยแค่ไหน?",
    a: "ทุก 30 นาที สแครเปอร์ทำงานต่อเนื่อง รีวิวใหม่บนหน้า Google Maps ของคลินิกจะปรากฏที่นี่ภายใน 30 นาที",
  },
  {
    q: "คลินิกที่แสดงเป็นโฆษณาหรือไม่?",
    a: "รายชื่อทั่วไปไม่ได้รับเงิน เรามีช่องโฆษณาที่ติดป้ายชัดเจน (Editor's Pick / Recommended / Featured) แต่ไม่ลบหรือซ่อนคลินิกใด",
  },
];

export default async function ThHomePage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const top = topByTrust(focused, 30);

  const totalReviews = focused.reduce((s, c) => s + c.total_reviews, 0);
  const withScraped = focused.filter((c) => c.scraped_review_count > 0).length;

  const districtMap = new Map<string, number>();
  for (const c of focused) {
    if (c.district) districtMap.set(c.district, (districtMap.get(c.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const categoryMap = new Map<string, number>();
  for (const c of focused) {
    for (const cat of c.categories) categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div lang="th">
      <section className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            ภาษาไทย · <a href="/" className="underline hover:text-[var(--fg)]">English</a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
            คลินิกในกรุงเทพ — ตรวจสอบจากรีวิวจริง
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] mb-6">
            {focused.length.toLocaleString()} คลินิก · วิเคราะห์รีวิว Google {totalReviews.toLocaleString()} รายการ · {t.clinic.updated} ต่อเนื่อง
          </p>
          <div className="max-w-2xl mx-auto">
            <HeroSearch
              entities={focused.map((c) => ({
                id: c.id, name: c.name, district: c.district,
                rating: c.rating, trust_score: c.trust_score,
              }))}
              hrefBase="/clinic"
              popularSearches={categories.slice(0, 4).map(([cat]) => ({
                label: CATEGORY_LABELS[cat] ?? cat,
                href: `/c/${cat}`,
              }))}
              popularLabel="ยอดนิยม"
              searchLang="th"
            />
          </div>
        </div>
      </section>

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={focused.length}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="คลินิก"
        label="ตรวจสอบจากรีวิว"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">{t.home.byService}</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <CategoryIcon category={cat} size={14} />
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">{t.home.byDistrict}</h2>
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

        <section>
          <h2 className="text-xl font-bold mb-4">อันดับ {Math.min(top.length, 30)} ตามคะแนน</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline />
          <div className="grid gap-3 mt-3">
            {top.slice(10).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 11} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <BookingForm />
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">{t.home.faq}</h2>
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
          name="Top Bangkok Clinics by Trust Score (Thai)"
          items={top.slice(0, 20).map((c) => ({
            name: c.name,
            url: `/clinic/${c.id}`,
          }))}
        />
      </div>
    </div>
  );
}
