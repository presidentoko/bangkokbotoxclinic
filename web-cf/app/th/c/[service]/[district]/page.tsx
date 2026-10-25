// /th/c/[service]/[district] — 태국어 시술×지역 조합 페이지.
//
// 2026-10-25 신설. 태국어 쿼리가 클릭의 ~62% 이고 그 주력이 "คลินิกทำฟันใกล้ฉัน"
// 같은 "시술 + 내 근처" 형태인데, 그 의도에 가장 정확히 맞는 조합 페이지
// (/c/[service]/[district])는 영어판뿐이었다. 구조·파라미터·클리닉 목록은
// 영어판과 동일하게 두고, 제목·본문·FAQ·브레드크럼만 태국어로 낸다.
//
// ⚠️ /th/d 때와 같은 교훈: 라우트만 만들면 고아가 된다. 이 파일은 sitemap.ts,
// app/c/[service]/[district] 의 hreflang, SiteHeader 의 LOCALIZED_ROUTE_PATTERNS,
// /th/c/[service] · /th/d/[district] · /th/clinic 의 내부 링크와 함께 간다.
import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory, filterByDistrict } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { BreadcrumbJsonLd, CollectionPageJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { applySiteFilter, getSiteConfig, getSiteUrl, FOCUS_VALID } from "@/lib/site";
import { TH_LABELS, TH_NEAR_ME, thDistrict, thCity, thYan } from "@/lib/th-labels";
import type { Metadata } from "next";

const VALID_SERVICES = new Set(["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"]);

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

// "คลินิกทำฟันใกล้ฉัน" → "คลินิกทำฟัน". 검색어 그대로의 표현에서 "ใกล้ฉัน"만 뗀
// 것을 H1·FAQ 에 쓴다 — 라벨(ทันตกรรม)보다 사람들이 실제로 치는 말에 가깝다.
function kindOf(service: string): string {
  const nearMe = TH_NEAR_ME[service];
  return nearMe ? nearMe.replace(/\s*ใกล้ฉัน$/, "") : `คลินิก${TH_LABELS[service] ?? service}`;
}

// 영문으로 끝나는 말 뒤에는 띄어 쓴다("คลินิก HIFU ย่าน…").
const joinTh = (a: string, b: string) => `${a}${/[A-Za-z0-9]$/.test(a) ? " " : ""}${b}`;

// 시술이 하나뿐인 사이트(덴탈)에서는 영어 조합 페이지가 canonical 을 /d/{district}
// 로 모은다(2026-08-24, 클리닉 100% 동일·본문 유사도 73~79% 실측). 태국어판도
// 같은 이유로 /th/d/{district} 와 클리닉 목록이 100% 같으므로 같은 규칙을 따른다.
// 조건을 바꿀 땐 영어판 page.tsx 와 sitemap.ts 의 게이트를 함께 바꿀 것.
function isSingleService(): boolean {
  return (FOCUS_VALID[getSiteConfig().focus]?.size ?? 0) === 1;
}

// 영어판과 동일: 봇 쓰레기 param 의 온디맨드 렌더를 막는다.
export const dynamicParams = false;

// 영어판(/c/[service]/[district])과 같은 파라미터 공간.
export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  const services = focusValid ? [...VALID_SERVICES].filter((s) => focusValid.has(s)) : [...VALID_SERVICES];
  const districts = Object.keys(db.district_counts);
  const params: { service: string; district: string }[] = [];
  for (const service of services) {
    for (const d of districts) {
      params.push({
        service,
        district: d.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string; district: string }> }
): Promise<Metadata> {
  const { service, district } = await params;
  const cfg = getSiteConfig();
  const SITE = getSiteUrl();
  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, cfg);
  const districtName = districtFromSlug(district, Object.keys(db.district_counts)) ?? district;
  const matching = filterByDistrict(filterByCategory(scoped, service), districtName);
  const count = matching.length;
  const totalReviews = matching.reduce((s, c) => s + c.total_reviews, 0);
  const cityLabel = matching.find((c) => c.city_label)?.city_label ?? "Bangkok";
  // 영어판과 같은 3곳 기준 — 기준이 어긋나면 사이트맵과 페이지가 서로 다른 말을 한다.
  const robots = count < 3 ? { index: false, follow: true } : undefined;
  const dn = thDistrict(districtName);
  const yan = thYan(dn);
  const kind = kindOf(service);
  const nearMe = TH_NEAR_ME[service] ?? kind;
  const title = `${nearMe} ${yan} ${count} แห่ง — รีวิวจริง`;
  const description = `${joinTh(kind, yan)} ${thCity(cityLabel)} ${count} แห่ง จัดอันดับด้วยคะแนนความน่าเชื่อถือจากรีวิว Google ${totalReviews.toLocaleString()} รายการ เปรียบเทียบรีวิวก่อนเลือกคลินิกใกล้คุณ`;
  const self = `${SITE}/th/c/${service}/${district}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: isSingleService() ? `${SITE}/th/d/${district}` : self,
      languages: {
        en: `${SITE}/c/${service}/${district}`,
        th: self,
        "x-default": `${SITE}/c/${service}/${district}`,
      },
    },
    ...(robots && { robots }),
    openGraph: {
      // 2026-09-02: 페이지가 openGraph 를 정의하면 루트 layout 의 siteName 이
      // 통째로 사라진다(Next 는 객체 단위 교체).
      siteName: cfg.brand,
      type: "website",
      locale: "th_TH",
      url: self,
      title,
      description,
    },
  };
}

export default async function ThServiceDistrictPage(
  { params }: { params: Promise<{ service: string; district: string }> }
) {
  const { service, district } = await params;
  if (!VALID_SERVICES.has(service)) notFound();

  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  if (focusValid && !focusValid.has(service)) notFound();

  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, cfg);
  const districtName = districtFromSlug(district, Object.keys(db.district_counts));
  if (!districtName) notFound();

  // 영어판과 동일한 목록·정렬.
  const filtered = filterByDistrict(filterByCategory(scoped, service), districtName)
    .sort((a, b) => b.trust_score - a.trust_score);

  const label = TH_LABELS[service] ?? service;
  const kind = kindOf(service);
  const nearMe = TH_NEAR_ME[service] ?? kind;
  const dn = thDistrict(districtName);
  const yan = thYan(dn);
  const cityLabel = filtered.find((c) => c.city_label)?.city_label ?? "Bangkok";
  const cn = thCity(cityLabel);
  const totalReviews = filtered.reduce((s, c) => s + c.total_reviews, 0);

  // 같은 서비스의 다른 지역들 (클리닉 2개 이상, 현재 district 제외, 상위 8개) — 영어판과 동일.
  const allForService = filterByCategory(scoped, service);
  const districtCountMap = new Map<string, number>();
  for (const c of allForService) {
    if (!c.district || c.district === districtName) continue;
    districtCountMap.set(c.district, (districtCountMap.get(c.district) ?? 0) + 1);
  }
  const otherDistricts = [...districtCountMap.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const compareLink = filtered.length >= 2
    ? `/compare/${filtered[0].id}/${filtered[1].id}`
    : null;

  // FAQ 답변은 전부 이 조합의 실제 집계에서 만든다(/th/d 와 같은 원칙) — 지어낸
  // 문장을 넣으면 조합 페이지 수백 장이 서로 같은 페이지가 된다. 가격은 지역·시술별
  // 데이터가 없으므로 넣지 않는다.
  const top = filtered[0];
  const avgRating = filtered.length
    ? filtered.reduce((s, c) => s + (c.rating || 0), 0) / filtered.length
    : 0;
  const faqs = filtered.length === 0 ? [] : [
    {
      q: `${joinTh(kind, yan)}มีกี่แห่ง`,
      a: `${filtered.length} แห่ง รวบรวมจากรีวิว Google ${totalReviews.toLocaleString()} รายการ${
        avgRating ? ` คะแนนเฉลี่ย ★${avgRating.toFixed(1)}` : ""
      }`,
    },
    ...(top
      ? [
          {
            q: `${joinTh(kind, yan)}ที่คะแนนดีที่สุดคือที่ไหน`,
            a: `${top.name} — ★${top.rating} จาก ${top.total_reviews.toLocaleString()} รีวิว คะแนนความน่าเชื่อถือ ${Math.round(
              top.trust_score,
            )}/100 ซึ่งคำนวณจากจำนวนรีวิว ความสม่ำเสมอของคะแนน และความน่าเชื่อถือของผู้รีวิว`,
          },
        ]
      : []),
    {
      q: `เลือก${joinTh(nearMe, yan)}อย่างไร`,
      a: `หน้านี้เรียงลำดับด้วยคะแนนความน่าเชื่อถือ ไม่ใช่ค่าโฆษณา คะแนนคำนวณจากจำนวนรีวิว การกระจายของคะแนน และประวัติผู้รีวิว จึงลดผลของรีวิวปลอมจำนวนน้อย แนะนำให้ดูทั้งคะแนนและจำนวนรีวิวประกอบกัน`,
    },
  ];

  const pageUrl = `/th/c/${service}/${district}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <a href={`/th/c/${service}`} className="hover:text-[var(--fg)]">{label}</a>
        <span className="mx-2">›</span>
        <span>{dn}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {joinTh(kind, yan)}
      </h1>
      <p className="text-[var(--muted)] mb-4">
        กำลังหา{nearMe}ใน{yan}? รวม {filtered.length} แห่งใน{dn} {cn} เรียงตามคะแนนความน่าเชื่อถือ
        จากรีวิว Google {totalReviews.toLocaleString()} รายการ
      </p>
      <div className="mb-8 text-sm">
        <a href={`/c/${service}/${district}`} className="underline hover:no-underline text-[var(--muted)]">
          English version
        </a>
      </div>

      {filtered.length === 0 ? (
        <div>
          <p className="text-[var(--muted)] mb-6">ยังไม่มีคลินิกที่ตรงกับเงื่อนไขนี้ ลองดูเขตใกล้เคียง:</p>
          {otherDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {otherDistricts.map(([d, n]) => (
                <a key={d} href={`/th/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition">
                  {joinTh(kind, thYan(thDistrict(d)))} <span className="text-[var(--muted)]">{n}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {compareLink && (
            <a href={compareLink} rel="nofollow"
              className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-sm font-medium w-fit">
              ⚖️ เปรียบเทียบอันดับ 1 กับอันดับ 2: {filtered[0].name} กับ {filtered[1].name} →
            </a>
          )}
          <div className="grid gap-3">
            {filtered.slice(0, 5).map((c, i) => (
              // lang 을 넘겨야 카드가 /th/clinic/[id] 로 간다(ClinicCard 2026-07-31 건).
              <ClinicCard key={c.id} clinic={c} rank={i + 1} lang="th" />
            ))}
          </div>
          <AffiliateInline category={label} district={districtName} lang="th" />
          {filtered.length > 5 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                #6 – #{filtered.length} · อันดับรองลงมา
              </h3>
              <div className="grid gap-1.5">
                {filtered.slice(5).map((c, i) => (
                  <ClinicCardCompact key={c.id} clinic={c} rank={i + 6} lang="th" />
                ))}
              </div>
            </div>
          )}
          <div className="my-6">
            <BookingForm defaultService={service} lang="th" />
          </div>
          {otherDistricts.length > 0 && (
            <section className="mt-8 pt-6 border-t border-[var(--border)]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                คลินิก{label}ในเขตอื่น
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherDistricts.map(([d, n]) => (
                  <a key={d} href={`/th/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition">
                    {thDistrict(d)} <span className="text-[var(--muted)] tabular-nums">{n}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">คำถามที่พบบ่อย</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                <summary className="font-semibold cursor-pointer">{f.q}</summary>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: label, url: `/th/c/${service}` },
        { name: dn, url: pageUrl },
      ]} />
      <CollectionPageJsonLd
        name={joinTh(kind, yan)}
        description={`${joinTh(kind, yan)} ${cn} ${filtered.length} แห่ง จัดอันดับด้วยคะแนนความน่าเชื่อถือจากรีวิว Google`}
        url={pageUrl}
        items={filtered.slice(0, 20)}
      />
      <FaqJsonLd faqs={faqs} />
    </div>
  );
}
