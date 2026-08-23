// /th/d/[district] — 태국어 지역별 클리닉 목록.
//
// 2026-08-23 신설. GSC 3개월 실측에서 이 사이트 상위 쿼리는 전부 태국어이고
// 전부 "…ใกล้ฉัน"(내 근처) 형태다: คลินิกทำฟันใกล้ฉัน 402노출,
// คลินิกผิว อนุสาวรีย์ 269, คลินิกใกล้ฉัน 166. "내 근처"는 본질적으로
// **지역 의도**인데 태국어 라우트에 지역 페이지가 없어서, 이 쿼리들이 영어
// 제목의 /d/{district} 에 착지하고 있었다. 노출 148K 인데 CTR 이 1.1% 로
// 순위(9.8) 대비 낮은 이유가 여기 있다 — 태국어로 검색했는데 결과 제목이
// 영어면 안 누른다.
//
// ⚠️ /th/c 는 2026-08-06 에 만들어지고도 08-20 까지 사이트맵·hreflang·언어전환
// 어디에도 없어 완전한 고아였다. 라우트만 만들면 아무 일도 일어나지 않는다 —
// 이 파일은 sitemap.ts / app/d/[district] 의 hreflang / SiteHeader 의
// LOCALIZED_ROUTE_PATTERNS 와 반드시 함께 간다.
import { notFound } from "next/navigation";
import { loadMasterDb, filterByDistrict } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { BookingForm } from "@/components/BookingForm";
import { applySiteFilter, getSiteConfig, getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";

// 손으로 검증된 태국어 구명만 둔다(build_master_db.py 의 별칭 테이블 출처).
// 나머지 지역은 영어 표기를 태국어 문장 안에 그대로 넣는다 — 구글맵·주소
// 표기가 영문인 구가 많아 태국인에게도 자연스럽고, 무엇보다 **틀린 태국어명을
// 붙이는 것보다 낫다**. 수집 주소에서 เขต 뒤 단어를 뽑아 자동 생성해봤으나
// Khlong Toei→พระโขนง, Phaya Thai→เมือง 처럼 오류가 많아 폐기했다(2026-08-23 실측).
const TH_DISTRICT: Record<string, string> = {
  "Bang Phlat": "บางพลัด",
  "Don Mueang": "ดอนเมือง",
  Dusit: "ดุสิต",
  "Huai Khwang": "ห้วยขวาง",
  "Lak Si": "หลักสี่",
  "Nong Chok": "หนองจอก",
  "Nong Khaem": "หนองแขม",
  "Pathum Wan": "ปทุมวัน",
  "Phaya Thai": "พญาไท",
  "Phra Khanong": "พระโขนง",
  Ratchathewi: "ราชเทวี",
  Watthana: "วัฒนา",
  "Yan Nawa": "ยานนาวา",
};

const TH_CITY: Record<string, string> = {
  Bangkok: "กรุงเทพฯ",
  Pattaya: "พัทยา",
  "Chiang Mai": "เชียงใหม่",
  Nonthaburi: "นนทบุรี",
  "Samut Prakan": "สมุทรปราการ",
  "Pathum Thani": "ปทุมธานี",
  "Hua Hin": "หัวหิน",
  "Koh Samui": "เกาะสมุย",
};

const thName = (d: string) => TH_DISTRICT[d] ?? d;
const thCity = (c: string) => TH_CITY[c] ?? c;

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

// 영어판과 동일: 봇 쓰레기 param 의 온디맨드 렌더를 막는다.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return Object.keys(db.district_counts).map((d) => ({
    district: d.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  const { district } = await params;
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const SITE = getSiteUrl();
  const districtName = districtFromSlug(district, Object.keys(db.district_counts)) ?? district;
  const scoped = applySiteFilter(db.clinics, cfg);
  const count = filterByDistrict(scoped, districtName).length;
  const sample = db.clinics.find((c) => c.district === districtName && c.city_label);
  const cityLabel = sample?.city_label ?? "Bangkok";
  // 영어판(/d/[district])과 같은 5곳 기준 — 기준이 어긋나면 사이트맵과 페이지가
  // 서로 다른 말을 하게 된다(2026-08-14 감사에서 그 모순이 34건 나왔다).
  const robots = count < 5 ? { index: false, follow: true } : undefined;
  const dn = thName(districtName);
  const cn = thCity(cityLabel);
  // "คลินิกทำฟัน" = 치과. GSC 최다 노출 쿼리(คลินิกทำฟันใกล้ฉัน)의 표현을
  // 그대로 쓴다 — 의역하면 매칭이 약해진다(/th/c 에서 확인한 원칙).
  const title = `คลินิกทำฟัน${dn} ${count} แห่ง — รีวิวจริง เช็คราคา`;
  return {
    title: { absolute: title },
    description: `คลินิกทันตกรรมใน${dn} ${cn} ${count} แห่ง จัดอันดับด้วยคะแนนความน่าเชื่อถือจากรีวิว Google จริง`,
    alternates: {
      canonical: `${SITE}/th/d/${district}`,
      languages: {
        "en-US": `${SITE}/d/${district}`,
        "th-TH": `${SITE}/th/d/${district}`,
        "x-default": `${SITE}/d/${district}`,
      },
    },
    ...(robots && { robots }),
    openGraph: {
      type: "website",
      url: `${SITE}/th/d/${district}`,
      title,
    },
  };
}

export default async function ThaiDistrictPage(
  { params }: { params: Promise<{ district: string }> }
) {
  const { district } = await params;
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const SITE = getSiteUrl();
  const districtName = districtFromSlug(district, Object.keys(db.district_counts));
  if (!districtName) notFound();

  const scoped = applySiteFilter(db.clinics, cfg);
  const filtered = filterByDistrict(scoped, districtName).sort((a, b) => b.trust_score - a.trust_score);
  const cityLabel = filtered.find((c) => c.city_label)?.city_label ?? "Bangkok";
  const dn = thName(districtName);
  const cn = thCity(cityLabel);
  const totalReviews = filtered.reduce((s, c) => s + c.total_reviews, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "หน้าแรก", url: `${SITE}/th` },
          { name: cn, url: `${SITE}/th` },
          { name: dn, url: `${SITE}/th/d/${district}` },
        ]}
      />
      <CollectionPageJsonLd
        name={`คลินิกทำฟัน${dn}`}
        description={`คลินิกทันตกรรมใน${dn} ${filtered.length} แห่ง`}
        url={`${SITE}/th/d/${district}`}
        items={filtered.slice(0, 40)}
      />

      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>{cn}</span>
        <span className="mx-2">›</span>
        <span>{dn}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        คลินิกทำฟัน{dn}
      </h1>
      <p className="text-[var(--muted)] mb-6">
        {filtered.length} แห่งใน{dn} {cn} · จากรีวิว Google {totalReviews.toLocaleString()} รายการ
      </p>

      <div className="mb-6 text-sm">
        <a href={`/d/${district}`} className="underline hover:no-underline text-[var(--muted)]">
          English version
        </a>
      </div>

      <div className="grid gap-4">
        {filtered.slice(0, 40).map((c, i) => (
          // lang 을 넘겨야 카드가 /th/clinic/[id] 로 간다 — 빠뜨리면 태국어
          // 페이지에서 카드를 누르는 순간 영어로 튕긴다(ClinicCard 주석의 2026-07-31 건).
          <ClinicCard key={c.id} clinic={c} rank={i + 1} lang="th" />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-[var(--muted)]">ยังไม่มีข้อมูลคลินิกในพื้นที่นี้</p>
      )}

      <div className="mt-10">
        <BookingForm lang="th" />
      </div>
    </div>
  );
}
