import { loadMasterDb, topByTrust } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import { BEST_FOR } from "@/lib/bestFor";
import { GUIDES_TH } from "@/lib/guides_th";
import { POSTS_TH } from "@/lib/posts_th";
import { LazyHeroSearch } from "@/components/LazyHeroSearch";
import { computeTrustScore } from "@/lib/trustScore";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ไดเรกทอรีผู้ผลิตและนิคมอุตสาหกรรมไทย — ติดต่อตรง",
  description:
    "ไดเรกทอรีผู้ผลิต 849 รายที่ผ่านการตรวจสอบกับกรมพัฒนาธุรกิจการค้า (DBD) + ซัพพลายเออร์ B2B 3,300+ ราย ทุนจดทะเบียน วันก่อตั้ง รหัส TSIC — ติดต่อโดยตรง ไม่ผ่านนายหน้า",
  alternates: {
    canonical: "/th",
    languages: {
      "th-TH": "/th",
      "ko-KR": "/ko",
      "en-US": "/",
      "x-default": "/",
    },
  },
  openGraph: { locale: "th_TH" },
};

const TH_FAQS = [
  {
    q: "คะแนนความน่าเชื่อถือ (Trust Score) คำนวณอย่างไร?",
    a: "คะแนน 0-100 = (คะแนน Google ÷ 5) × 50 + log10(จำนวนรีวิว) × 15 (สูงสุด 50). น้ำหนักคะแนน 50% + ปริมาณรีวิว 50% เพื่อจัดลำดับโรงงานที่ดำเนินการมานานพร้อมพิสูจน์ได้สาธารณะ ก่อนผู้ประกอบการรายใหม่ที่ยังไม่มีรีวิว",
  },
  {
    q: "ทำไมเน้นเขตอีสเทิร์นซีบอร์ดมาก?",
    a: "เพราะเป็นศูนย์กลางการผลิตของไทย ชลบุรีและระยองรองรับโรงงาน Toyota, Honda, Mitsubishi, Isuzu, Mazda, Nissan และซัพพลายเออร์ Tier 1/2 (AISIN, AGC, Toyoda Gosei, Denso) นิคมอุตสาหกรรมหลัก 4 ราย (Pinthong, Amata, WHA-Hemaraj, Rojana) มีฐานหลักในเขตนี้",
  },
  {
    q: "ฉันจะค้นหาคลังสินค้าให้เช่าใกล้ท่าเรือแหลมฉบังได้อย่างไร?",
    a: "หน้า /c/warehouse แสดงคลังสินค้าทั้งหมด 50+ แห่ง สามารถกรองตามอำเภอ — ศรีราชา / บางละมุง / บ่อวิน อยู่ในรัศมี 30-45 นาทีจากท่าเรือ ค่าเช่าเฉลี่ย 150-280 บาท/ตร.ม./เดือนสำหรับคลังพร้อมใช้งาน",
  },
  {
    q: "ความแตกต่างระหว่างนิคม Amata กับ WHA?",
    a: "Amata เป็นเจ้าของที่ดินและโครงสร้างพื้นฐานเอง มีนิคมในชลบุรี/ระยอง + ฮานอย เวียดนาม อัตราเข้าใช้ 90%+. WHA หลังควบรวม Hemaraj ในปี 2558 เป็นเจ้าของนิคม 11 แห่ง พื้นที่รวม ~7,800 เฮกตาร์ — อันดับ 1 ของไทยตามพื้นที่. Pinthong ใกล้ท่าเรือศรีราชา (เหมาะกับ buyer ที่ส่งออกตู้คอนเทนเนอร์มาก) Rojana กระจายในระยอง อยุธยา ปราจีนบุรี",
  },
  {
    q: "ผู้ประกอบการ SME ไทยจะหาผู้ผลิต OEM/ODM ในไทยจากที่นี่ได้ไหม?",
    a: "ได้ ไดเรกทอรีนี้เหมาะสำหรับ buyer ในประเทศที่ต้องการเปรียบเทียบ ผู้ผลิตอาหาร เครื่องสำอาง ยาง พลาสติก เหล็ก-โลหะ บรรจุภัณฑ์ หน้าหมวดหมู่แต่ละหมวดมี FAQ ในประเทศ + ติดต่อตรง ไม่มีค่านายหน้า",
  },
  {
    q: "ข้อมูลเชื่อถือได้แค่ไหน?",
    a: "คะแนน รีวิว และข้อมูลติดต่อทั้งหมดมาจาก Google Maps Business Profile สาธารณะ เราไม่แก้ไขหรือกรองรายการ ช่อง Editor's Pick / Recommended ที่จ่ายเงินติดป้ายชัดเจนและไม่แทนที่ผลการจัดลำดับปกติ",
  },
];

export default async function ThHomePage() {
  const db = await loadMasterDb();
  const top = sortWithSponsored(topByTrust(db.suppliers, 30));

  const totalReviews = db.suppliers.reduce((s, r) => s + r.total_reviews, 0);
  const withWebsite = db.suppliers.filter((r) => r.website).length;

  // 검색 인덱스는 LazyHeroSearch 가 public/browse-index.json 에서 받아온다.
  // db.suppliers 전량을 prop 으로 넘기던 것이 이 페이지 RSC 페이로드 1.7MB 의 원인이었다.

  const cities = Object.entries(db.city_counts)
    .filter(([city]) => city)
    .sort((a, b) => b[1] - a[1]);
  const categories = Object.entries(db.category_counts).sort((a, b) => b[1] - a[1]);

  const estatesTop = [...db.suppliers]
    .filter((r) => r.categories.includes("industrial_estate"))
    .sort((a, b) => computeTrustScore(b).overall - computeTrustScore(a).overall);

  return (
    <>
      <div className="text-center pt-6 text-xs uppercase tracking-wider text-[var(--muted)]">
        ภาษาไทย · <a href="/" className="underline hover:text-[var(--fg)]">English</a> · <a href="/ko" className="underline hover:text-[var(--fg)]">한국어</a>
      </div>

      <section className="relative bg-gradient-to-b from-emerald-50 via-green-50/30 to-white overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ไดเรกทอรีซัพพลายเออร์เขตอีสเทิร์นซีบอร์ด
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5 text-balance">
            ติดต่อโรงงานโดยตรง,<br />
            <span className="text-emerald-700">ไม่ผ่านนายหน้า.</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] mb-7 max-w-2xl mx-auto text-balance">
            ผู้ผลิต <b>{db.total_suppliers.toLocaleString()}</b> แห่ง · เปิดเผยเว็บไซต์ <b>{withWebsite.toLocaleString()}</b> ราย · ผู้ผลิตชิ้นส่วนยานยนต์ 73 ราย, นิคมอุตสาหกรรม 8 แห่ง, คลังสินค้า 55 แห่ง. ข้อมูลทั้งหมดจาก Google Maps Business Profile สาธารณะ ไม่มีค่านายหน้า ไม่มีรีวิวที่จ่ายเงิน
          </p>
          <LazyHeroSearch
            hrefBase="/course"
            popularSearches={[
              { label: "ผู้ผลิต", href: "/c/manufacturer" },
              { label: "นิคมอุตสาหกรรม", href: "/c/industrial_estate" },
              { label: "คลังสินค้า", href: "/c/warehouse" },
              { label: "ชลบุรี", href: "/city/chon_buri" },
            ]}
            popularLabel="ค้นหายอดนิยม"
            searchLang="th"
          />
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-4 gap-4 text-center">
          <Stat big={db.total_suppliers.toLocaleString()} label="ซัพพลายเออร์" />
          <Stat big={`${(totalReviews / 1000).toFixed(0)}K`} label="รีวิวที่วิเคราะห์" />
          <Stat big={withWebsite.toLocaleString()} label="มีเว็บไซต์" />
          <Stat big={Object.keys(db.category_counts).length.toString()} label="หมวดหมู่" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {estatesTop.length >= 4 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">🏘️ นิคมอุตสาหกรรม</h2>
                <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
                  Pinthong / Amata / WHA / Rojana — เปรียบเทียบนิคมที่เหมาะกับธุรกิจ จัดอันดับด้วย Trust Score
                </p>
              </div>
              <a href="/c/industrial_estate" className="text-sm font-bold hover:text-emerald-700 hover:underline">ดูทั้งหมด →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {estatesTop.map((r, i) => (
                <a key={r.id} href={`/supplier/${r.id}`} className="block bg-white rounded-xl border border-[var(--border)] p-4 hover:border-emerald-300 hover:shadow-md transition">
                  <div className="text-xs text-[var(--muted)] mb-1">#{i + 1} · Trust {computeTrustScore(r).overall}</div>
                  <div className="font-bold text-sm leading-tight mb-1">{r.name}</div>
                  <div className="text-xs text-[var(--muted)]">{r.district || r.city_label}</div>
                </a>
              ))}
            </div>
          </section>
        )}

        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามจังหวัด</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, count]) => (
                <a
                  key={city}
                  href={`/city/${citySlugFromDisplay(city)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium"
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
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามหมวดหมู่</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <span aria-hidden>{CATEGORY_ICONS[cat] ?? "🏭"}</span>
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {POSTS_TH.length > 0 && (
          <section className="mb-10">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">บล็อก</h2>
              <a href="/th/blog" className="text-xs text-emerald-700 font-medium hover:underline">ทั้งหมด {POSTS_TH.length} บทความ →</a>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {POSTS_TH.slice(0, 4).map((p) => (
                <a
                  key={p.slug}
                  href={`/th/blog/${p.slug}`}
                  className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <div className="text-xs text-[var(--muted)] mb-1">{p.category}</div>
                  <div className="font-medium leading-snug">{p.title.replace(/ — .*$/, "")}</div>
                </a>
              ))}
            </div>
          </section>
        )}

        {GUIDES_TH.length > 0 && (
          <section className="mb-10">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">คู่มือผู้ซื้อ</h2>
              <a href="/th/guide" className="text-xs text-emerald-700 font-medium hover:underline">ทั้งหมด {GUIDES_TH.length} บทความ →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {GUIDES_TH.map((g) => (
                <a
                  key={g.slug}
                  href={`/th/guide/${g.slug}`}
                  className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  {g.title.replace(/ — .*$/, "").replace(/ \(\d{4}\)$/, "")}
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <div className="flex items-baseline justify-between gap-4 mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">หัวข้อยอดนิยม</h2>
            <a href="/best" className="text-xs text-emerald-700 font-medium hover:underline">ทั้งหมด {BEST_FOR.length} รายการ →</a>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {BEST_FOR.map((c) => (
              <a
                key={c.slug}
                href={`/best/${c.slug}`}
                className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                {c.title.replace(/^Best |^Top |^Most /, "").replace(/ in Thailand$/, "")}
              </a>
            ))}
          </div>
        </section>

        <AdSlot slot="th-home-mid" />

        <section>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Top {Math.min(top.length, 30)} ตามคะแนนความน่าเชื่อถือ</h2>
          <div className="grid gap-3">
            {top.map((r, i) => (
              <SupplierCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">คำถามที่พบบ่อย</h2>
          <div className="space-y-3">
            {TH_FAQS.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <FaqJsonLd faqs={TH_FAQS} />
        <ItemListJsonLd
          name="ซัพพลายเออร์ไทย Top 20 ตาม Trust Score"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
        />
      </div>
    </>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-4xl font-black tabular-nums leading-none">{big}</div>
      <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-90 mt-1.5 font-bold">{label}</div>
    </div>
  );
}
