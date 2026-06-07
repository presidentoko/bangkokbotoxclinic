import { loadMasterDb, topByTrust } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import { BEST_FOR } from "@/lib/bestFor";
import { POSTS_KO } from "@/lib/posts_ko";
import { GUIDES_KO } from "@/lib/guides_ko";
import { HeroSearch } from "@/components/HeroSearch";
import { computeTrustScore } from "@/lib/trustScore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "태국 공급사 디렉토리 — DBD 등기 검증 + 에이전트 마진 빼고 공장 직거래",
  description:
    "태국 상무부(DBD) 법인 등기 검증된 제조사 849곳 + B2B 공급사 3,300곳. 정식 법인명·등록자본금·설립연도·TSIC 산업코드 공개. Pinthong, Amata, WHA, Rojana 입주 일본계·한국계 OEM 직접 연락처. 소싱 에이전트 15-30% 마진 빼고 시작하세요.",
  alternates: {
    canonical: "/ko",
    languages: {
      "ko-KR": "/ko",
      "en-US": "/",
      "th-TH": "/th",
      "x-default": "/",
    },
  },
  openGraph: { locale: "ko_KR" },
};

const KO_FAQS = [
  {
    q: "DBD 검증 (DBD-verified) 이 뭔가요?",
    a: "태국 상무부(Department of Business Development, DBD)는 모든 법인의 정식 등기를 관리하는 한국의 등기소+공정위 같은 기관입니다. DBD-verified 라벨이 붙은 공급사 849곳은 DataWarehouse+ 시스템에서 회사명 매칭 신뢰도 80%+로 검증된 곳으로, 정식 법인명(บริษัท ... จำกัด), 13자리 등록번호, 등록자본금, 설립일, TSIC 산업분류 코드, 사업목적 텍스트까지 표시됩니다. 알리바바 등 글로벌 마켓플레이스와의 가장 큰 차이는 — 알리바바는 '뱃지를 믿어라' 모델이지만 여기는 등기소 데이터 자체를 보여줍니다. 매칭 신뢰도 90%+는 'DBD Verified' 진한 라벨, 80-89%는 'DBD-listed · Likely match' 톤다운 라벨로 구분합니다.",
  },
  {
    q: "신뢰도 점수(b2b score)는 어떻게 계산되나요?",
    a: "Google 평점·리뷰 볼륨 + DBD 시그널(검증여부, 설립연도, 자본금 티어) + 데이터 완성도(전화·웹사이트·사진) 합산. 평점만 높고 리뷰 5개인 신생 업체와, 평점 4.2에 리뷰 200개인 입주 10년차 + 자본금 5억 바트 OEM을 같은 선상에서 비교하지 않기 위해 다축 가중합니다. 데이터 갱신마다 재계산됩니다.",
  },
  {
    q: "태국 공장에 직접 연락하면 정말 에이전트보다 싼가요?",
    a: "공급사 카테고리/제품에 따라 다르지만 한국 소싱 에이전트의 일반적 마크업은 15-30%입니다. 직접 연락이 가능한 공급사(웹사이트·전화 공개)는 디렉토리에 표시되며, 처음 연락할 때 영어 메일 + 첨부 RFQ로 문의하면 99% 응답합니다. 다만 공장 방문·QC·통관·운송은 직접 챙겨야 하니 비용·시간 트레이드오프 판단 필요.",
  },
  {
    q: "왜 동부해안(Chon Buri/Rayong)에 집중되어 있나요?",
    a: "태국 자동차·전자 제조의 핵심 클러스터이기 때문입니다. Toyota, Honda, Mitsubishi, Isuzu, Mazda, Nissan 본플랜트와 Tier 1/2 협력사(AISIN, AGC, Toyoda Gosei, Denso, Summit 등)가 모두 이 지역에 있습니다. 한국 기업으로는 포스코·LG화학·삼성SDI 등이 라용 산단에 진출. 4대 산단 운영사(Pinthong, Amata, WHA-Hemaraj, Rojana)도 모두 이 벨트가 본진.",
  },
  {
    q: "Amata와 WHA 산단 차이는?",
    a: "Amata는 매립·인프라 자체 보유 모델로 Chonburi/Rayong 본단 + 베트남 하노이 진출. 입주율 90%+. WHA는 2015년 Hemaraj 인수로 합병된 뒤 11개 산단(약 7,800ha) 보유 — 면적 기준 태국 1위. 둘 다 한국·일본 buyer 입주 친화적이고 영어·일본어 leasing 팀이 별도 운영됩니다. Pinthong은 Sriracha 항만 인접(컨테이너 수출 비중 높은 buyer에 유리), Rojana는 가장 분산형(Eastern Seaboard 외에 Ayutthaya/Prachinburi에도 산단 보유).",
  },
  {
    q: "한국 SME가 태국에서 OEM 발주할 때 어떤 카테고리가 합리적인가요?",
    a: "검증된 영역: 화장품 ODM(태국이 ASEAN 1위 ODM 거점), 식품가공(HACCP/FSSC22000 보편), 자동차 애프터마켓 부품(중·소량 가능), 의류·가방 OEM(베트남보다 낮은 미니멈 수용 가능). 부적합: 전자제품 본체(중국 대비 단가/리드타임 열위), 가공식품 한국 수출(검역 비용 높음). 디렉토리에서 카테고리별로 보고, 후보군 3-5곳 동시에 RFQ 보내는 게 표준 흐름입니다.",
  },
  {
    q: "디렉토리 정보 믿을 수 있나요?",
    a: "모든 평점·리뷰·연락처는 Google Maps 공개 비즈니스 프로필에서 직접 가져옵니다. 편집·필터링 없습니다. 인플루언서 협찬·유료 후기 일절 없습니다. Editor's Pick / Recommended 슬롯만 명확히 라벨링된 유료이며 일반 정렬은 절대 손대지 않습니다.",
  },
  {
    q: "공급사로 등록하고 싶은데요?",
    a: "Google Business Profile이 있고 공급사 카테고리에 매칭되면 이미 자동 등록되어 있을 확률이 높습니다. 추가 노출(Editor's Pick / 한국어 채널 우선노출 / CPL 리드)은 /ko/for-suppliers 참고.",
  },
];

export default async function KoHomePage() {
  const db = await loadMasterDb();
  const top = sortWithSponsored(topByTrust(db.suppliers, 30));

  const totalReviews = db.suppliers.reduce((s, r) => s + r.total_reviews, 0);
  const withWebsite = db.suppliers.filter((r) => r.website).length;
  const withPhone = db.suppliers.filter((r) => r.phone).length;
  const verifiedCount = db.verified_count ?? db.suppliers.filter((s) => s.verified).length;
  const withPhotos = db.with_photos ?? db.suppliers.filter((s) => s.photos && s.photos.length > 0).length;
  const withEstate = db.with_estate ?? db.suppliers.filter((s) => s.estate_name).length;

  const searchIndex = db.suppliers.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: computeTrustScore(r).overall,
  }));

  const cities = Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]);
  const categories = Object.entries(db.category_counts).sort((a, b) => b[1] - a[1]);

  // 한국 buyer 관심 카테고리 — 우선 노출
  const koPriorityCats = ["auto_parts", "industrial_estate", "manufacturer", "warehouse", "logistics"];

  // 산단 톱 (한국 입주 검토용)
  const estatesTop = [...db.suppliers]
    .filter((r) => r.categories.includes("industrial_estate"))
    .sort((a, b) => computeTrustScore(b).overall - computeTrustScore(a).overall);

  // 자동차 부품 톱 (Tier 1 OEM 일본계)
  const autoPartsTop = [...db.suppliers]
    .filter((r) => r.categories.includes("auto_parts"))
    .sort((a, b) => computeTrustScore(b).overall - computeTrustScore(a).overall)
    .slice(0, 10);

  return (
    <>
      <div className="text-center pt-6 text-xs uppercase tracking-wider text-[var(--muted)]">
        한국어 · <a href="/" className="underline hover:text-[var(--fg)]">English</a> · <a href="/th" className="underline hover:text-[var(--fg)]">ภาษาไทย</a>
      </div>

      <section className="relative bg-gradient-to-b from-emerald-50 via-green-50/30 to-white overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            태국 상무부(DBD) 등기 검증 · 공장 직거래 디렉토리
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5 text-balance">
            정식 등기 검증된,<br />
            <span className="text-emerald-700">태국 공장 {verifiedCount}곳.</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] mb-7 max-w-2xl mx-auto text-balance">
            <b>{verifiedCount.toLocaleString()}곳</b>은 태국 <b>상무부(DBD) 법인 등기</b>로 검증 — 정식 법인명·등록번호·등록자본금·설립일·TSIC 산업코드 공개. 추가 <b>{(db.total_suppliers - verifiedCount).toLocaleString()}곳</b>은 매칭 진행 중 B2B 공급사. 소싱 에이전트 15-30% 마크업 빼고 직접 RFQ.
          </p>
          <HeroSearch
            entities={searchIndex}
            hrefBase="/course"
            popularSearches={[
              { label: "자동차 부품", href: "/c/auto_parts" },
              { label: "산업단지", href: "/c/industrial_estate" },
              { label: "창고", href: "/c/warehouse" },
              { label: "Chon Buri", href: "/city/chon_buri" },
            ]}
            popularLabel="인기 검색"
            searchLang="ko"
          />
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Stat big={verifiedCount.toLocaleString()} label="DBD 등기 검증" />
          <Stat big={db.total_suppliers.toLocaleString()} label="B2B 공급사" />
          <Stat big={withPhotos.toLocaleString()} label="공장 사진 보유" />
          <Stat big={withPhone.toLocaleString()} label="전화 직거래" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* 한국 buyer가 가장 자주 보는 톱 — 산업단지 */}
        {estatesTop.length >= 4 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">🏘️ 산업단지 입주 검토</h2>
                <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
                  Pinthong / Amata / WHA / Rojana — 한국 SME가 태국 진출할 때 가장 먼저 비교하는 4대 산단. 신뢰도 점수 + 입주 규모 기준.
                </p>
              </div>
              <a href="/c/industrial_estate" className="text-sm font-bold hover:text-emerald-700 hover:underline">전체 →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {estatesTop.map((r, i) => (
                <a key={r.id} href={`/supplier/${r.id}`} className="block bg-white rounded-xl border border-[var(--border)] p-4 hover:border-emerald-300 hover:shadow-md transition">
                  <div className="text-xs text-[var(--muted)] mb-1">#{i + 1} · 신뢰도 {computeTrustScore(r).overall}</div>
                  <div className="font-bold text-sm leading-tight mb-1">{r.name}</div>
                  <div className="text-xs text-[var(--muted)]">{r.district || r.city_label}</div>
                  {r.website && (
                    <div className="text-xs text-emerald-700 mt-2 font-medium">웹사이트 공개</div>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 자동차 부품 — 일본계 OEM 톱 */}
        {autoPartsTop.length >= 4 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">🚗 자동차 부품 Tier 1 OEM</h2>
                <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
                  AISIN(Toyota 그룹) · AGC Automotive(아사히글래스) · Toyoda Gosei · Mitsubishi Motors Engine — 태국이 일본계 자동차 클러스터의 동남아 본진인 이유.
                </p>
              </div>
              <a href="/c/auto_parts" className="text-sm font-bold hover:text-emerald-700 hover:underline">전체 →</a>
            </div>
            <div className="grid gap-3">
              {autoPartsTop.map((r, i) => (
                <SupplierCard key={r.id} r={r} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">지역별</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, count]) => (
                <a
                  key={city}
                  href={`/city/${city.toLowerCase().replace(/\s+/g, "_")}`}
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
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">카테고리별</h2>
            <div className="flex flex-wrap gap-2">
              {categories
                .sort(([a], [b]) => {
                  const ai = koPriorityCats.indexOf(a);
                  const bi = koPriorityCats.indexOf(b);
                  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                })
                .map(([cat, count]) => (
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

        {POSTS_KO.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">최신 블로그</h2>
              <a href="/ko/blog" className="text-sm text-emerald-700 font-medium hover:underline">전체 보기 →</a>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[...POSTS_KO].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3).map((p) => (
                <a
                  key={p.slug}
                  href={`/ko/blog/${p.slug}`}
                  className="block p-5 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">{p.category}</div>
                  <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-emerald-700 transition line-clamp-2">{p.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-3">{p.metaDescription}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {GUIDES_KO.length > 0 && (
          <section className="mb-10">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">한국어 가이드</h2>
              <a href="/ko/guide" className="text-xs text-emerald-700 font-medium hover:underline">전체 {GUIDES_KO.length}개 →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {GUIDES_KO.map((g) => (
                <a
                  key={g.slug}
                  href={`/ko/guide/${g.slug}`}
                  className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  {g.title.replace(/ — .*$/, "").replace(/ \(\d{4}\)$/, "")}
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">테마별</h2>
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

        <AdSlot slot="ko-home-mid" />

        <section>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">신뢰도 Top {Math.min(top.length, 30)}</h2>
          <div className="grid gap-3">
            {top.map((r, i) => (
              <SupplierCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">자주 묻는 질문</h2>
          <div className="space-y-3">
            {KO_FAQS.map((f, i) => (
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

        <FaqJsonLd faqs={KO_FAQS} />
        <ItemListJsonLd
          name="태국 공급사 신뢰도 Top 20"
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
