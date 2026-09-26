import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import { DbdRegistryTable } from "@/components/DbdRegistryTable";
import {
  MIN_CITY_CATEGORY_SUPPLIERS_TH,
  cityCategoryPairs,
  suppliersInCityCategory,
} from "@/lib/cityCategory";
import { TH_CATEGORY_VALID, TH_CITY_VALID } from "@/lib/thBuildSets";
import { CATEGORY_LABELS_TH, provinceTh, provinceThFull } from "@/lib/thaiNames";
import type { Metadata } from "next";

// "คลังสินค้า ขอนแก่น" 형태의 검색에 그대로 대응하는 페이지.
// Search Console 에서 이 쿼리는 노출 54회 70위였는데, 답이 될 페이지가 없었다 —
// /th/city/khon_kaen 은 업종이 섞여 있고 /th/c/warehouse 는 전국이다.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return cityCategoryPairs(db, MIN_CITY_CATEGORY_SUPPLIERS_TH)
    .filter((p) => TH_CITY_VALID.has(p.citySlug) && TH_CATEGORY_VALID.has(p.category))
    .map((p) => ({ name: p.citySlug, cuisine: p.category }));
}

async function load(name: string, cuisine: string) {
  if (!TH_CITY_VALID.has(name) || !TH_CATEGORY_VALID.has(cuisine)) return null;
  const db = await loadMasterDb();
  const pair = cityCategoryPairs(db, MIN_CITY_CATEGORY_SUPPLIERS_TH)
    .find((p) => p.citySlug === name && p.category === cuisine);
  if (!pair) return null;
  return { db, pair, suppliers: sortWithSponsored(suppliersInCityCategory(db, name, cuisine)) };
}

export async function generateMetadata(
  { params }: { params: Promise<{ name: string; cuisine: string }> },
): Promise<Metadata> {
  const { name, cuisine } = await params;
  const data = await load(name, cuisine);
  if (!data) return {};
  const { pair, suppliers } = data;
  const th = provinceTh(name) ?? pair.cityLabel;
  const catTh = CATEGORY_LABELS_TH[cuisine] ?? CATEGORY_LABELS[cuisine] ?? cuisine;
  const verified = suppliers.filter((s) => s.verified).length;
  // EN 쪽은 기준이 높아 대응 페이지가 없을 수 있다 — 없는 URL 로 hreflang 을 걸면
  // 404 를 가리키는 대체 언어 신호가 된다.
  const hasEn = cityCategoryPairs(data.db).some(
    (p) => p.citySlug === name && p.category === cuisine,
  );
  return {
    title: `${catTh} ${th} — ${pair.count} แห่ง พร้อมเบอร์ติดต่อ`,
    description:
      `รายชื่อ${catTh}ใน${provinceThFull(name) ?? th} ${pair.count} แห่ง` +
      `${verified > 0 ? ` (จดทะเบียน DBD ${verified} แห่ง)` : ""} — ` +
      `เบอร์โทร เว็บไซต์ ที่ตั้ง และคะแนนรีวิว ติดต่อโรงงานโดยตรงไม่ผ่านนายหน้า`,
    alternates: {
      canonical: `/th/city/${name}/${cuisine}`,
      languages: {
        "th-TH": `/th/city/${name}/${cuisine}`,
        ...(hasEn
          ? { "en-US": `/city/${name}/${cuisine}`, "x-default": `/city/${name}/${cuisine}` }
          : { "x-default": `/th/city/${name}/${cuisine}` }),
      },
    },
    openGraph: { locale: "th_TH" },
  };
}

export default async function ThCityCategoryPage(
  { params }: { params: Promise<{ name: string; cuisine: string }> },
) {
  const { name, cuisine } = await params;
  const data = await load(name, cuisine);
  if (!data) notFound();
  const { db, pair, suppliers } = data;

  const th = provinceTh(name) ?? pair.cityLabel;
  const thFull = provinceThFull(name) ?? th;
  const catTh = CATEGORY_LABELS_TH[cuisine] ?? CATEGORY_LABELS[cuisine] ?? cuisine;
  const icon = CATEGORY_ICONS[cuisine] ?? "🏭";
  const verified = suppliers.filter((s) => s.verified).length;
  const withWebsite = suppliers.filter((s) => s.website).length;

  const siblings = cityCategoryPairs(db, MIN_CITY_CATEGORY_SUPPLIERS_TH)
    .filter((p) => p.citySlug === name && p.category !== cuisine && TH_CATEGORY_VALID.has(p.category))
    .slice(0, 10);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <a href={`/th/city/${name}`} className="hover:text-[var(--fg)]">{th}</a>
        <span className="mx-2">›</span>
        <span>{catTh}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
        <span aria-hidden>{icon}</span>
        <span>{catTh} {th}</span>
      </h1>
      <p className="text-[var(--muted)] mb-2 leading-relaxed">
        รวม{catTh}ใน{thFull} {pair.count.toLocaleString()} แห่ง
        {verified > 0 ? ` โดย ${verified.toLocaleString()} แห่งตรวจสอบกับทะเบียนนิติบุคคล DBD แล้ว` : ""} ·
        {" "}{withWebsite.toLocaleString()} แห่งมีเว็บไซต์ของตัวเอง
      </p>
      <p className="text-[var(--muted)] mb-6 text-sm">
        ทุกรายการแสดงเบอร์โทรและเว็บไซต์จากโปรไฟล์สาธารณะของบริษัท ติดต่อโรงงานได้โดยตรง{" "}
        <a href={`/th/city/${name}`} className="underline hover:text-[var(--fg)]">
          ดูทุกหมวดใน{th} →
        </a>
      </p>

      <section>
        <h2 className="text-xl font-bold mb-4">
          {catTh}ใน{th} {Math.min(suppliers.length, 100)} อันดับแรก
        </h2>
        <div className="grid gap-3">
          {suppliers.slice(0, 10).map((r, i) => <SupplierCard key={r.id} r={r} rank={i + 1} />)}
        </div>
        <AdSlot slot="th-city-category-mid" />
        <div className="grid gap-3 mt-3">
          {suppliers.slice(10, 100).map((r, i) => <SupplierCard key={r.id} r={r} rank={i + 11} />)}
        </div>
      </section>

      <DbdRegistryTable suppliers={suppliers} label={`${catTh} ${th}`} locale="th" />

      {siblings.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            หมวดอื่นใน{th}
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((p) => (
              <a
                key={p.category}
                href={`/th/city/${name}/${p.category}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <span aria-hidden>{CATEGORY_ICONS[p.category] ?? "🏭"}</span>
                {CATEGORY_LABELS_TH[p.category] ?? p.category} {th}
                <span className="text-[var(--muted)] tabular-nums">{p.count}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <a
          href={`/th/c/${cuisine}`}
          className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white hover:border-emerald-400 transition"
        >
          {catTh}ทั่วประเทศ →
        </a>
        <a
          href="/th/guide"
          className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white hover:border-emerald-400 transition"
        >
          คู่มือผู้ซื้อ →
        </a>
      </div>

      <CollectionPageJsonLd
        name={`${catTh} ${th}`}
        description={`รายชื่อ${catTh}ใน${thFull} ${pair.count} แห่ง`}
        url={`/th/city/${name}/${cuisine}`}
        lang="th"
        numberOfItems={suppliers.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: th, url: `/th/city/${name}` },
        { name: catTh, url: `/th/city/${name}/${cuisine}` },
      ]} />
      <ItemListJsonLd
        name={`${catTh} ${th}`}
        items={suppliers.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
