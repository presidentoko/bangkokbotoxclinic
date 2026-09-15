import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { sortWithSponsored } from "@/lib/sponsored";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { TH_CATEGORY_VALID, TH_CITY_VALID } from "@/lib/thBuildSets";
import { CATEGORY_LABELS_TH, provinceTh, provinceThFull } from "@/lib/thaiNames";
import type { Supplier } from "@/lib/types";
import type { Metadata } from "next";

export const dynamicParams = false;

function categoriesIn(suppliers: Supplier[]): [string, number][] {
  const m = new Map<string, number>();
  for (const r of suppliers) for (const c of r.categories) m.set(c, (m.get(c) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

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
  const th = provinceTh(name) ?? display;
  const note = CITY_NOTES_TH[name];
  const topCats = categoriesIn(filterByCity(db.suppliers, name))
    .slice(0, 3)
    .map(([c]) => CATEGORY_LABELS_TH[c])
    .filter(Boolean);
  return {
    title: topCats.length
      ? `${topCats.join(" · ")} ${th} — รายชื่อซัพพลายเออร์ B2B`
      : `โรงงานและซัพพลายเออร์ ${th} — ไดเรกทอรี B2B`,
    description: `${topCats.length ? topCats.join(" ") + " " : ""}ใน${provinceThFull(name) ?? th} (${display}) — ${note ?? "รายชื่อผู้ผลิตและผู้ให้บริการอุตสาหกรรม พร้อมเบอร์โทร ที่ตั้ง และคะแนนความน่าเชื่อถือ"}`,
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
  const th = provinceTh(name) ?? display;
  const thFull = provinceThFull(name) ?? th;
  const note = CITY_NOTES_TH[name];
  const categories = categoriesIn(filtered);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>{th}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        โรงงานและซัพพลายเออร์ใน{thFull}
      </h1>
      <p className="text-sm text-[var(--muted)] mb-2">{display}, Thailand</p>
      {note && <p className="text-[var(--muted)] mb-2 leading-relaxed text-balance">{note}</p>}
      <p className="text-[var(--muted)] mb-6">
        {filtered.length.toLocaleString()} ราย ใน{th} เรียงตามคะแนนความน่าเชื่อถือ
        {categories.length > 0 && (
          <> — {categories.slice(0, 4).map(([c, n]) => `${CATEGORY_LABELS_TH[c] ?? CATEGORY_LABELS[c] ?? c} ${n} ราย`).join(", ")}</>
        )}
      </p>

      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามหมวดหมู่ใน{th}</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`#cat-${c}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                {CATEGORY_LABELS_TH[c] ?? CATEGORY_LABELS[c] ?? c} {th}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* หมวดหลักแยกเป็นหัวข้อ "คลังสินค้า ขอนแก่น" — ตรงกับรูปแบบที่ผู้ซื้อชาวไทยค้นหา */}
      {categories.filter(([, n]) => n >= 3).slice(0, 4).map(([c, n]) => (
        <section key={c} id={`cat-${c}`} className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-1">
            {CATEGORY_LABELS_TH[c] ?? CATEGORY_LABELS[c] ?? c} {th}
          </h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            {n.toLocaleString()} ราย ·{" "}
            {TH_CATEGORY_VALID.has(c)
              ? <a href={`/th/c/${c}`} className="underline hover:text-[var(--fg)]">ดู{CATEGORY_LABELS_TH[c]}ทั่วประเทศ →</a>
              : `${CATEGORY_LABELS[c] ?? c} in ${display}`}
          </p>
          <div className="grid gap-3">
            {filtered.filter((r) => r.categories.includes(c)).slice(0, 10).map((r, i) => (
              <SupplierCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="text-xl font-bold mb-4">ซัพพลายเออร์ทั้งหมดใน{th} — Top {Math.min(filtered.length, 100)}</h2>
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
        name={`ซัพพลายเออร์ ${th}`}
        description={note ?? `ผู้ผลิตและซัพพลายเออร์ใน${thFull}`}
        url={`/th/city/${name}`}
        lang="th"
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: th, url: `/th/city/${name}` },
      ]} />
      <ItemListJsonLd
        name={`ซัพพลายเออร์ ${th}`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
