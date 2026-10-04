import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { DbdRegistryTable } from "@/components/DbdRegistryTable";
import { RfqForm } from "@/components/RfqForm";
import { AdSlot } from "@/components/AffiliateSlot";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { TH_CITY_VALID } from "@/lib/thBuildSets";
import { provinceTh } from "@/lib/thaiNames";
import { findSmeOem, liveSmeOem, smeOemSuppliers } from "@/lib/smeOemTh";
import type { Metadata } from "next";

// 태국 소상공인용 "รับผลิต" 페이지. 정의와 이유는 lib/smeOemTh.ts.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return liveSmeOem(db.suppliers).map(({ v }) => ({ slug: v.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const v = findSmeOem(slug);
  if (!v) return { title: "Not found" };
  return {
    title: v.metaTitle,
    description: v.metaDescription,
    alternates: { canonical: `/th/oem/${slug}` },
    openGraph: { locale: "th_TH", title: v.metaTitle, description: v.metaDescription },
  };
}

export default async function ThSmeOemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = findSmeOem(slug);
  if (!v) notFound();

  const db = await loadMasterDb();
  const rows = smeOemSuppliers(v, db.suppliers);
  const others = liveSmeOem(db.suppliers).filter((x) => x.v.slug !== slug);
  const verified = rows.filter((r) => r.verified).length;
  const withPhone = rows.filter((r) => r.phone).length;

  const byProvince = new Map<string, number>();
  for (const r of rows) if (r.city_label) byProvince.set(r.city_label, (byProvince.get(r.city_label) ?? 0) + 1);
  const provinces = [...byProvince.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  const topNames = provinces.slice(0, 3).map(([c]) => provinceTh(citySlugFromDisplay(c)) ?? c);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <a href="/th/oem" className="hover:text-[var(--fg)]">รับผลิต OEM</a>
        <span className="mx-2">›</span>
        <span>{v.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
          <span aria-hidden>{v.icon}</span>
          <span>{v.h1}</span>
        </h1>
        <p className="text-[var(--muted)] leading-relaxed text-balance max-w-2xl">{v.intro}</p>
      </header>

      {/* 검색 스니펫·답변엔진이 그대로 인용할 수 있는 한 문단. 숫자는 이 DB 에서. */}
      <section className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-2">สรุปสั้น</h2>
        <p className="leading-relaxed">
          Thai Supply Hub มีรายชื่อ{v.name} {rows.length.toLocaleString()} ราย
          {topNames.length > 0 && <> ส่วนใหญ่อยู่ใน{topNames.join(" ")}</>}
          {withPhone > 0 && <> — {withPhone.toLocaleString()} รายมีเบอร์โทรให้ติดต่อได้ทันที</>}
          {verified > 0 && <> และ {verified.toLocaleString()} รายตรวจสอบกับข้อมูลจดทะเบียน DBD แล้ว</>}
          {" "}ติดต่อโรงงานได้โดยตรงฟรี ไม่มีค่าธรรมเนียมสำหรับผู้ซื้อ
        </p>
      </section>

      <section className="mb-10 grid sm:grid-cols-2 gap-4">
        <InfoCard icon="📦" label="ขั้นต่ำการผลิต (MOQ)" body={v.moq} />
        <InfoCard icon="📋" label="ใบอนุญาตที่ต้องมี" body={v.license} />
      </section>

      <section className="mb-10 bg-white border border-[var(--border)] rounded-xl p-5">
        <h2 className="font-bold mb-3">ถามโรงงานก่อนสั่งผลิต</h2>
        <ul className="text-sm space-y-1.5 list-disc pl-5 text-stone-700">
          {v.checklist.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </section>

      {provinces.length > 1 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามจังหวัด</h2>
          <div className="flex flex-wrap gap-2">
            {provinces.map(([city, n]) => {
              const cs = citySlugFromDisplay(city);
              const cls = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white";
              const chip = (
                <>
                  {provinceTh(cs) ?? city} <span className="text-[var(--muted)] tabular-nums">{n}</span>
                </>
              );
              // 태국어 도 페이지가 있는 곳만 링크 — 없는 곳은 404 대신 그냥 숫자만.
              return TH_CITY_VALID.has(cs) ? (
                <a key={city} href={`/th/city/${cs}`} className={`${cls} hover:border-emerald-400 hover:bg-emerald-50 transition`}>{chip}</a>
              ) : (
                <span key={city} className={cls}>{chip}</span>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">{v.name} — เรียงตามคะแนนความน่าเชื่อถือ</h2>
        <div className="grid gap-3">
          {rows.slice(0, 10).map((r, i) => <SupplierCard key={r.id} r={r} rank={i + 1} />)}
        </div>
        <AdSlot slot={`th-oem-${slug}-mid`} />
        {rows.length > 10 && (
          <div className="grid gap-3 mt-3">
            {rows.slice(10, 60).map((r, i) => <SupplierCard key={r.id} r={r} rank={i + 11} />)}
          </div>
        )}
      </section>

      <DbdRegistryTable suppliers={rows} label={v.name} locale="th" />

      <section id="rfq" className="mt-12 bg-white border border-[var(--border)] rounded-2xl p-6 scroll-mt-32">
        <h2 className="text-lg font-bold mb-2">ไม่อยากโทรหาทีละโรงงาน? ให้เราหาให้</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          บอกสินค้า จำนวน และงบประมาณ — เราติดต่อโรงงานที่เหมาะให้เป็นภาษาไทยแล้วส่งคำตอบกลับมา
          ฟรีสำหรับผู้ซื้อ ถ้าตกลงสั่งผลิต โรงงานเป็นผู้จ่ายค่าธรรมเนียมให้เรา
        </p>
        <RfqForm locale="th" supplierName={`รับผลิต — ${v.name}`} />
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-3">
          {v.faqs.map((f) => (
            <details key={f.q} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
              <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">รับผลิตสินค้าอื่น</h2>
          <div className="flex flex-wrap gap-2">
            {others.map(({ v: x, count }) => (
              <a key={x.slug} href={`/th/oem/${x.slug}`}
                 className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 transition">
                {x.icon} {x.name} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <CollectionPageJsonLd name={v.h1} description={v.metaDescription} url={`/th/oem/${slug}`} lang="th" numberOfItems={rows.length} />
      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: "รับผลิต OEM", url: "/th/oem" },
        { name: v.name, url: `/th/oem/${slug}` },
      ]} />
      <FaqJsonLd faqs={v.faqs} lang="th" />
      <ItemListJsonLd name={v.h1} items={rows.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))} />
    </div>
  );
}

function InfoCard({ icon, label, body }: { icon: string; label: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-1.5 flex items-center gap-1.5">
        <span aria-hidden>{icon}</span>
        <span>{label}</span>
      </div>
      <p className="text-sm leading-relaxed">{body}</p>
    </div>
  );
}
