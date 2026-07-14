import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { sortWithSponsored } from "@/lib/sponsored";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { TH_CITY_VALID } from "@/lib/thBuildSets";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return Object.keys(db.city_counts)
    .map((label) => ({ name: citySlugFromDisplay(label) }))
    .filter((p) => TH_CITY_VALID.has(p.name));
}

const CITY_NOTES_TH: Record<string, string> = {
  chon_buri: "ศูนย์กลางอีสเทิร์นซีบอร์ด — ฐานผลิตยานยนต์ Toyota, Honda, Mitsubishi + ผู้ผลิตชิ้นส่วน Tier 1/2.",
  rayong: "ศูนย์กลางปิโตรเคมี Map Ta Phut — PTT, IRPC, PTTGC, SCG Chemicals.",
  pathum_thani: "นิคมเหนือกรุงเทพ — อิเล็กทรอนิกส์ HDD (Western Digital, Seagate) + อาหาร.",
  samut_sakhon: "ศูนย์กลางอาหารแปรรูป (โดยเฉพาะอาหารทะเลแช่แข็ง) + บรรจุภัณฑ์.",
  samut_prakan: "ใกล้สนามบินสุวรรณภูมิ — โลจิสติกส์ทางอากาศ + อิเล็กทรอนิกส์.",
  bangkok: "สำนักงานใหญ่ + R&D + corporate office. การผลิตจริงอยู่นอกเมือง.",
  phra_nakhon_si_ayutthaya: "Rojana Hi-Tech + Honda รถยนต์ + Sony / Sharp อิเล็กทรอนิกส์.",
  songkhla: "ภาคใต้ — ยางพารา + อาหารทะเล + อาหารฮาลาล.",
  si_racha: "ติดท่าเรือแหลมฉบัง — นิคม Pinthong, ชิ้นส่วนยานยนต์ Tier 1/2, คลังสินค้าโลจิสติกส์.",
  map_ta_phut: "คลัสเตอร์ปิโตรเคมีใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้ — PTT, IRPC, PTTGC, SCG Chemicals.",
  chiang_mai: "ศูนย์กลางภาคเหนือ — อาหาร OEM, กาแฟสเปเชียลตี้, สารสกัดสมุนไพร, นิคมอุตสาหกรรม NICEA.",
};

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  const { name } = await params;
  const db = await loadMasterDb();
  const display =
    Object.keys(db.city_counts).find((k) => citySlugFromDisplay(k) === name) ?? name.replace(/_/g, " ");
  const note = CITY_NOTES_TH[name];
  return {
    title: `ผู้ผลิตและซัพพลายเออร์ใน${display} — ไดเรกทอรี B2B`,
    description: note ? `${display} — ${note}` : `ผู้ผลิต คลังสินค้า และผู้ดำเนินการอุตสาหกรรมใน${display}`,
    alternates: {
      canonical: `/th/city/${name}`,
      languages: {
        "th-TH": `/th/city/${name}`,
        "en-US": `/city/${name}`,
        "ko-KR": `/ko/city/${name}`,
        "x-default": `/city/${name}`,
      },
    },
    openGraph: { locale: "th_TH" },
  };
}

export default async function ThCityPage(
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  if (!TH_CITY_VALID.has(name)) notFound();

  const db = await loadMasterDb();
  const filtered = sortWithSponsored(filterByCity(db.suppliers, name));
  if (filtered.length === 0) notFound();

  const display = filtered[0]?.city_label ?? name.replace(/_/g, " ");
  const note = CITY_NOTES_TH[name];

  const catMap = new Map<string, number>();
  for (const r of filtered) {
    for (const c of r.categories) catMap.set(c, (catMap.get(c) ?? 0) + 1);
  }
  const categories = [...catMap.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>{display}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        ซัพพลายเออร์ใน{display}
      </h1>
      {note && <p className="text-[var(--muted)] mb-2 leading-relaxed text-balance">{note}</p>}
      <p className="text-[var(--muted)] mb-6">
        {filtered.length.toLocaleString()} ราย ตรวจสอบแล้ว เรียงตามคะแนนความน่าเชื่อถือ.
      </p>

      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามหมวดหมู่</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`/th/c/${c}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                {CATEGORY_LABELS[c] ?? c}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">Top {Math.min(filtered.length, 100)}</h2>
        <div className="grid gap-3">
          {filtered.slice(0, 100).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <a href="/best" className="px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition">🏆 รายการอันดับ →</a>
        <a href="/th/guide" className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white hover:border-emerald-400 hover:text-emerald-700 transition">คู่มือผู้ซื้อ →</a>
      </div>

      <CollectionPageJsonLd
        name={`ซัพพลายเออร์ ${display}`}
        description={note ?? `ผู้ผลิตและซัพพลายเออร์ใน${display}`}
        url={`/th/city/${name}`}
        lang="th"
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: display, url: `/th/city/${name}` },
      ]} />
      <ItemListJsonLd
        name={`Top suppliers ${display}`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
