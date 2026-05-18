import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사이트 소개 — 한국 buyer를 위한 태국 공급사 디렉토리",
  description:
    "신뢰도 점수 산출 방법, 데이터 출처, 한국 SME가 태국 동부해안 공급사를 직접 발굴할 때 우리 디렉토리를 어떻게 쓸 수 있는지.",
  alternates: {
    canonical: "/ko/about",
    languages: {
      "ko-KR": "/ko/about",
      "en-US": "/about",
      "th-TH": "/th/about",
      "x-default": "/about",
    },
  },
  openGraph: { locale: "ko_KR" },
};

const FAQS = [
  {
    q: "데이터는 어디서 가져오나요?",
    a: "Apify의 Google Maps actor 두 개(crawler-google-places, google-maps-extractor)가 태국 비즈니스 프로필을 수집합니다. 일반 'factory' 검색은 노이즈가 심해서 — 이름이 'Latex Factory'인 매트리스 매장, 이름에 'Toys Factory'가 들어간 장난감 가게, 'factory outlet'이라는 쇼핑몰까지 같이 나옵니다. 우리는 B2C 카테고리 블록리스트로 1차 필터하고, B2B 카테고리(Manufacturer, Auto parts manufacturer, Industrial real estate agency, Warehouse, Logistics service)만 남깁니다.",
  },
  {
    q: "신뢰도 점수(Trust Score) 가중치 근거는?",
    a: "공식: (Google 평점 / 5) × 50 + log10(리뷰 수) × 15 (최대 50). 평점 50% + 볼륨 50%. 평점만 5점이고 리뷰 3개인 신생 업체보다, 평점 4.2에 리뷰 200개 있는 입주 10년차가 위로 정렬됩니다. 리뷰 양은 로그 스케일이라 200개와 2,000개의 차이는 크지 않게 처리 — 거대 OEM이 점수를 독점하지 않도록.",
  },
  {
    q: "왜 동부해안만 압도적으로 많아요?",
    a: "1차 데이터셋(957건 raw → 650건 supply)이 그 지역 위주였습니다. 한국 buyer 관점에서도 사실 이게 자연스러운 결과 — 태국 자동차·전자·화학 제조의 80% 이상이 Chon Buri/Rayong/Chachoengsao 3개 도(都)에 몰려있습니다. 후속 데이터에서 Bangkok 외곽(Pathum Thani/Samut Prakan), Ayutthaya, Saraburi 산단 데이터도 추가될 예정.",
  },
  {
    q: "한국어 가이드는 따로 있나요?",
    a: "현재 메인 디렉토리(/ko)에 한국 buyer 관점 카피와 FAQ가 들어가 있고, 별도 가이드 콘텐츠(태국 OEM 발주 절차, 산단 입주 비용 비교, 동부해안 vs Ayutthaya 비교 등)는 추후 라운드에서 추가될 예정입니다. 데이터 정확성과 직접 연락처 노출이 1순위입니다.",
  },
  {
    q: "디렉토리에 영향력 있는 광고주가 있나요?",
    a: "광고/스폰서 슬롯은 모두 명확히 라벨링됩니다(Editor's Pick / Recommended). 일반 정렬 결과에는 절대 손대지 않습니다. 사용자가 정렬 메트릭을 의심할 수 있도록 신뢰도 산출 공식을 공개합니다(위 항목).",
  },
  {
    q: "거래 수수료를 가져가나요?",
    a: "안 가져갑니다. 디렉토리는 buyer가 공급사에 직접 연락(전화·웹사이트·이메일)하는 모델이고 우리는 거래 자체에 개입하지 않습니다. 수익 모델은 (1) 라벨링된 스폰서 슬롯, (2) 향후 검증된 공급사 구독 티어 — 이뿐입니다.",
  },
];

export default async function KoAboutPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <span>사이트 소개</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">{cfg.brand} 소개</h1>
      <p className="text-base text-[var(--muted)] mb-8 leading-relaxed">
        한국 SME가 태국에서 OEM·공장·산단을 직접 발굴할 때 — 소싱 에이전트 견적이 갑자기 비싸 보이기 시작했을 때 — 펴 보는 디렉토리. 공개 Google 데이터에 일관된 분석을 적용해서 buyer가 객관적 시그널로 공급사를 비교할 수 있게 합니다.
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3">현황</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.total_suppliers.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">공급사</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.with_website.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">웹사이트 공개</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.city_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">지역</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.category_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">카테고리</div>
          </div>
        </div>
      </div>

      <section className="space-y-3 mb-12">
        <h2 className="text-2xl font-bold">편집 원칙</h2>
        <Principle
          title="투명한 정렬"
          body="공급사 상세 페이지마다 신뢰도 점수가 어떻게 나왔는지 표시. 스폰서 슬롯은 명확히 배지로 구분되며 일반 정렬을 대체하지 않습니다."
        />
        <Principle
          title="유료 후기 없음"
          body="후기는 작성·편집·청탁하지 않습니다. 평점은 Google Maps에서 그대로 가져옵니다."
        />
        <Principle
          title="자동·연속 업데이트"
          body="순위에 사람 손 안 탑니다. 데이터 갱신 → master DB 재빌드 → 사이트 재배포가 프로그램으로 돌아갑니다."
        />
        <Principle
          title="Buyer 우선"
          body="신뢰도 가중치는 소싱 관점으로 튜닝. 입주 5년차 이상 공급사가 위로, 5개 리뷰만 있는 fly-by-night 업체는 아래로."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">자주 묻는 질문</h2>
        {FAQS.map((f, i) => (
          <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
            <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
              <span>{f.q}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
            </summary>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
          </details>
        ))}
      </section>

      <FaqJsonLd faqs={FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "사이트 소개", url: "/ko/about" },
      ]} />
    </div>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-lg p-4">
      <h3 className="font-bold text-base mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
