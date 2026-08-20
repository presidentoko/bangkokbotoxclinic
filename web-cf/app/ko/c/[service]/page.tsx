// /ko/c/[service] — 한국어 시술별 허브 페이지.
// 2026-07-13: 한국 의료관광 검색 트래픽 타겟으로 신설 (SEO 감사 1순위 기회).
// EN 버전(../../c/[service]/page.tsx)과 동일 데이터·필터링 로직을 쓰되
// UI chrome/가격 안내/FAQ는 실제 한국어 콘텐츠. 클리닉 상세는 /ko/clinic/[id]로,
// 아직 한국어 페이지가 없는 지역/도시/비교 링크는 기존 EN 페이지로 연결(하이브리드) —
// 완전한 /ko/d, /ko/city 커버리지는 후속 작업.
import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { BreadcrumbJsonLd, FaqJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { BookingForm } from "@/components/BookingForm";
import { StatsBar } from "@/components/StatsBar";
import { CategoryIcon } from "@/components/CategoryIcon";
import { applySiteFilter, getSiteConfig, getSiteUrl, FOCUS_VALID } from "@/lib/site";
import type { Metadata } from "next";

const VALID = new Set(["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"]);

const KO_LABELS: Record<string, string> = {
  botox: "보톡스",
  filler: "필러",
  hifu: "HIFU",
  facial: "페이셜",
  laser: "레이저",
  dental: "치과",
  hair_transplant: "모발이식",
  eye: "라식/라섹",
};

const KO_PRICE_HINTS: Partial<Record<string, string>> = {
  botox: "유닛당 ฿80부터 · Allergan, Dysport, Botulax",
  dental: "임플란트 ฿35,000부터 · 비니어 개당 ฿12,000부터",
  filler: "1ml당 ฿8,000부터 · Juvederm, Restylane",
  hifu: "1회 ฿8,000부터 · Ultherapy, Thermage, Ultraformer",
  laser: "피코레이저 ฿3,000부터 · CO2레이저 ฿8,000부터",
  hair_transplant: "FUE 2,000모 기준 ฿65,000부터",
};

const KO_FAQ: Partial<Record<string, { q: string; a: string }[]>> = {
  botox: [
    {
      q: "방콕 보톡스 정품인지 어떻게 확인하나요?",
      a: "리뷰에 'genuine brand'/'정품' 언급이 많은 클리닉이 신뢰할 만합니다. 시술 전 Allergan·Dysport·Botulax 박스와 시리얼 스티커를 직접 확인해달라고 요청하세요.",
    },
    {
      q: "방콕 보톡스 가격은 얼마인가요?",
      a: "유닛당 ฿80~250 (브랜드별 차이). 이마·미간·눈가 등 부위별로 필요 유닛 수가 달라 상담 시 정확한 견적을 받는 게 좋습니다.",
    },
  ],
  dental: [
    {
      q: "방콕 치과, 믿을 수 있는 곳인지 어떻게 확인하나요?",
      a: "리뷰에 임플란트·보철 시술 전후 사진이 많은 클리닉이 신뢰할 만합니다. 태국 치과의사협회(Thai Dental Council) 등록번호를 문의하세요.",
    },
    {
      q: "방콕 치과 가격은 한국보다 얼마나 저렴한가요?",
      a: "임플란트 ฿35,000(약 140만원)부터, 비니어 개당 ฿12,000(약 48만원)부터 — 한국·미국 대비 최대 70% 저렴합니다.",
    },
  ],
  filler: [
    {
      q: "방콕 필러 시술, 어떤 브랜드가 안전한가요?",
      a: "Juvederm, Restylane 등 FDA/태국 FDA 승인 브랜드 사용 여부를 클리닉에 직접 확인하세요. 리뷰에 브랜드명이 구체적으로 언급된 곳이 신뢰도가 높습니다.",
    },
    {
      q: "방콕 필러 가격은 얼마인가요?",
      a: "1ml당 ฿8,000~25,000. 부위(입술, 팔자주름, 코 등)와 브랜드에 따라 차이가 큽니다.",
    },
  ],
  hifu: [
    {
      q: "HIFU 시술 효과는 얼마나 지속되나요?",
      a: "보통 1회 시술 후 6개월~1년 정도 리프팅 효과가 유지됩니다. 리뷰에서 시술 전후 사진과 함께 지속 기간을 언급한 후기를 참고하세요.",
    },
    {
      q: "방콕 HIFU 가격은 얼마인가요?",
      a: "1회 ฿8,000~80,000+ — 장비(Ultherapy, Thermage, Ultraformer)와 시술 범위에 따라 편차가 큽니다.",
    },
  ],
  facial: [
    {
      q: "방콕 페이셜 클리닉은 어떻게 고르나요?",
      a: "피부과 전문의가 상주하는지, 리뷰에 부작용·트러블 관련 부정적 언급이 없는지 확인하세요.",
    },
  ],
  laser: [
    {
      q: "방콕 레이저 시술 가격은 얼마인가요?",
      a: "피코레이저 ฿3,000부터, CO2레이저 ฿8,000부터. 색소·모공·흉터 등 목적에 따라 적합한 레이저 종류가 다릅니다.",
    },
  ],
  hair_transplant: [
    {
      q: "방콕 모발이식, 터키보다 나은가요?",
      a: "가격은 터키가 약간 저렴한 경우가 많지만, 방콕은 한국인 상담사·의료진이 있는 클리닉이 많아 의사소통 부담이 적습니다. FUE 2,000모 기준 ฿65,000부터.",
    },
    {
      q: "모발이식 후 회복 기간은 얼마나 걸리나요?",
      a: "이식 부위 딱지는 7~10일, 완전한 결과 확인까지는 9~12개월 정도 소요됩니다. 리뷰에서 시술 후 6개월~1년 경과 사진을 참고하세요.",
    },
  ],
  eye: [
    {
      q: "방콕 라식/라섹 가격은 얼마인가요?",
      a: "시력·각막 상태에 따라 검사 후 견적이 달라집니다. 시술 전 정밀 검사(각막 두께, 안압 등)를 꼼꼼히 하는 클리닉을 고르세요.",
    },
  ],
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from(VALID).map((service) => ({ service }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string }> }
): Promise<Metadata> {
  const { service } = await params;
  const label = KO_LABELS[service] ?? service;
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, cfg);
  const count = scoped.filter((c) => c.categories.includes(service)).length;
  const totalReviews = scoped
    .filter((c) => c.categories.includes(service))
    .reduce((s, c) => s + c.total_reviews, 0);
  const robots = count < 5 ? { index: false, follow: true } : undefined;
  const priceHint = KO_PRICE_HINTS[service];
  const SITE = getSiteUrl();
  return {
    title: `방콕 ${label} 클리닉 ${count}곳 — 검증된 리뷰 기반 순위 (2026)`,
    description: `방콕 ${label} 클리닉 ${count}곳을 구글 리뷰 ${totalReviews.toLocaleString()}건 기반 신뢰도 점수로 순위화.${priceHint ? ` ${priceHint}.` : ""} 한국·미국 대비 최대 70% 저렴.`,
    alternates: {
      canonical: `${SITE}/ko/c/${service}`,
      // 2026-08-20: th-TH 누락으로 태국어 hreflang 클러스터가 단방향이었다.
      languages: {
        "en-US": `${SITE}/c/${service}`,
        "th-TH": `${SITE}/th/c/${service}`,
        "ko-KR": `${SITE}/ko/c/${service}`,
        "x-default": `${SITE}/c/${service}`,
      },
    },
    ...(robots && { robots }),
    openGraph: {
      type: "website",
      locale: "ko_KR",
      title: `방콕 ${label} 클리닉 ${count}곳 — 검증된 순위`,
      description: `구글 리뷰 ${totalReviews.toLocaleString()}건 분석 기반 독립 순위.`,
      url: `${SITE}/ko/c/${service}`,
      images: [{
        url: `${SITE}/api/og?title=${encodeURIComponent(`방콕 ${label} 클리닉 ${count}곳`)}&sub=${encodeURIComponent(`리뷰 ${totalReviews.toLocaleString()}건 분석 · 신뢰도 순위`)}&count=${count}`,
        width: 1200,
        height: 630,
        alt: `방콕 ${label} 클리닉`,
      }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function KoServicePage(
  { params }: { params: Promise<{ service: string }> }
) {
  const { service } = await params;
  if (!VALID.has(service)) notFound();

  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  if (focusValid && !focusValid.has(service)) notFound();

  const db = await loadMasterDb();
  const filtered = filterByCategory(applySiteFilter(db.clinics, cfg), service)
    .sort((a, b) => b.trust_score - a.trust_score);
  const label = KO_LABELS[service] ?? service;

  const byDistrict = new Map<string, number>();
  for (const c of filtered) {
    if (!c.district) continue;
    byDistrict.set(c.district, (byDistrict.get(c.district) ?? 0) + 1);
  }
  const districts = Array.from(byDistrict.entries())
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1]);

  const totalReviews = filtered.reduce((s, c) => s + c.total_reviews, 0);
  const withScraped = filtered.filter((c) => c.scraped_review_count > 0).length;
  const faqs = KO_FAQ[service] ?? [];

  return (
    <>
      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={filtered.length}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="클리닉"
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
          <span className="mx-2">›</span>
          <span>{label}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <CategoryIcon category={service} size={32} />
          방콕 {label} 클리닉
        </h1>
        <p className="text-[var(--muted)] mb-8">
          {filtered.length}곳을 신뢰도 점수로 순위화. 구글 리뷰 텍스트와 클리닉 정보를 기반으로 분류했습니다.
          {KO_PRICE_HINTS[service] && <> 가격대: {KO_PRICE_HINTS[service]}.</>}
        </p>

        {districts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              지역별 {label}
            </h2>
            <div className="flex flex-wrap gap-2">
              {districts.map(([d, n]) => (
                <a
                  key={d}
                  href={`/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  {d} {label} <span className="text-[var(--muted)]">{n}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {(() => {
          const cityOrder = ["Bangkok", "Pattaya", "Phuket", "Chiang Mai", "Koh Samui", "Krabi", "Hua Hin"];
          const cityKo: Record<string, string> = {
            Bangkok: "방콕", Pattaya: "파타야", Phuket: "푸켓", "Chiang Mai": "치앙마이",
            "Koh Samui": "코사무이", Krabi: "크라비", "Hua Hin": "후아힌",
          };
          const byCity = new Map<string, typeof filtered>();
          for (const c of filtered) {
            const k = c.city_label || "Bangkok";
            if (!byCity.has(k)) byCity.set(k, []);
            byCity.get(k)!.push(c);
          }
          const sortedCities = cityOrder.filter((c) => byCity.has(c))
            .concat([...byCity.keys()].filter((c) => !cityOrder.includes(c)));

          let globalRank = 1;
          return sortedCities.map((city, idx) => {
            const cityList = byCity.get(city) ?? [];
            if (cityList.length === 0) return null;
            const citySlug = cityList[0].city_slug || city.toLowerCase().replace(/\s+/g, "-");
            const visible = cityList.slice(0, 50);
            const more = cityList.length - visible.length;
            const isMain = city === "Bangkok";
            const cityLabel = cityKo[city] ?? city;
            return (
              <section key={city} className={isMain ? "" : "mt-12 pt-8 border-t border-[var(--border)]"}>
                <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                    {cityLabel} {label}
                    <span className="text-[var(--muted)] font-normal text-base ml-2">
                      {cityList.length}곳
                    </span>
                  </h2>
                  <a
                    href={`/city/${citySlug}`}
                    className="text-sm font-bold hover:underline"
                    style={{ color: "var(--accent)" }}
                  >
                    {cityLabel} 전체 클리닉 보기 →
                  </a>
                </div>
                <div className="grid gap-3">
                  {visible.slice(0, 10).map((c) => {
                    const r = globalRank++;
                    return <ClinicCard key={c.id} clinic={c} rank={r} />;
                  })}
                </div>
                {visible.length > 10 && (
                  <div className="mt-6">
                    <div className="grid gap-1.5">
                      {visible.slice(10).map((c) => {
                        const r = globalRank++;
                        return <ClinicCardCompact key={c.id} clinic={c} rank={r} />;
                      })}
                    </div>
                  </div>
                )}
                {more > 0 && (
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    <a href={`/city/${citySlug}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                      +{more}곳 더 보기 ({cityLabel}) →
                    </a>
                  </p>
                )}
              </section>
            );
          });
        })()}

        <div className="my-8">
          <BookingForm defaultService={service} lang="ko" />
        </div>

        {faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">방콕 {label} — 자주 묻는 질문</h2>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4">
                  <summary className="font-medium cursor-pointer">{f.q}</summary>
                  <p className="mt-2 text-sm text-[var(--muted)]">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <BreadcrumbJsonLd items={[
          { name: "홈", url: "/ko" },
          { name: label, url: `/ko/c/${service}` },
        ]} />
        <FaqJsonLd faqs={faqs} />
        <CollectionPageJsonLd
          name={`방콕 ${label} 클리닉 순위`}
          description={`방콕 ${label} 클리닉 ${filtered.length}곳을 구글 리뷰 분석 기반 신뢰도 점수로 순위화.`}
          url={`/ko/c/${service}`}
          items={filtered}
        />
      </div>
    </>
  );
}
