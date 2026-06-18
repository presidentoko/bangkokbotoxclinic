import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

import { RfqForm } from "@/components/RfqForm";

export const metadata: Metadata = {
  title: "공급사 등록 및 노출 — 한국 buyer 채널",
  description:
    "한국·일본 buyer가 가장 먼저 보는 /ko 한국어 채널 우선노출, Editor's Pick 배지, 한국 SME 리드 제공.",
  alternates: {
    canonical: "/ko/for-suppliers",
    languages: {
      "ko-KR": "/ko/for-suppliers",
      "en-US": "/for-suppliers",
      "th-TH": "/th/for-suppliers",
      "x-default": "/for-suppliers",
    },
  },
  openGraph: { locale: "ko_KR" },
};

export default async function KoForSuppliersPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const totalReviews = db.suppliers.reduce((s, c) => s + c.total_reviews, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <span>공급사 등록</span>
      </nav>

      <header className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
          태국 제조사 · 산단 · 물류 운영자용
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
          한국 buyer가 태국에서 직접 소싱할 때,<br />
          <span style={{ color: cfg.themeAccent }}>가장 먼저 보는 디렉토리.</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto text-balance leading-relaxed">
          {db.total_suppliers.toLocaleString()}곳 B2B 공급사, 그 중 {(db.verified_count ?? 849).toLocaleString()}곳은 태국 상무부(DBD) 법인 등기로 검증. 소싱 에이전트 마진을 빼고 직접 거래하려는 한국 SME가 들어오는 채널입니다.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4 mb-16">
        <Stat n={(db.verified_count ?? 849).toLocaleString()} label="DBD 등기 검증" />
        <Stat n={db.total_suppliers.toLocaleString()} label="B2B 공급사" />
        <Stat n="< 30분" label="데이터 갱신" />
      </section>

      <section className="space-y-8 mb-16">
        <Offering
          tag="01 — Editor's Pick"
          title="모든 카테고리·지역 페이지 최상단"
          price="฿15,000 / 월"
          body="/c/manufacturer, /c/auto_parts, /city/chon_buri, Best of 페이지 등에서 첫 번째 자리에 금색 Editor's Pick 배지 노출. 일반 정렬 결과는 그 아래 그대로 — 절대 삭제·강등 없음."
          bullets={[
            "관련 리스트 최상단 + 금색 배지",
            "특정 지역 × 카테고리에 핀 가능",
            "일반 대비 클릭률 평균 3-5배",
            "월 단위 해지 가능",
          ]}
          accent="#ca8a04"
        />

        <Offering
          tag="02 — 한국 buyer 채널"
          title="/ko 한국어 홈페이지 상단 노출"
          price="฿20,000 / 월"
          body="한국·일본 소싱 팀은 RFQ 보내기 전에 7-14일 정도 디렉토리 리서치를 합니다. /ko 메인에서 처음 보이는 공급사 자리 — 신뢰도 높은 일본계 OEM과 같은 줄에 노출됩니다."
          bullets={[
            "/ko 홈 Top 3 자리",
            "한국어 추천글 슬롯 (기존 한국어 리뷰 기반)",
            "직접 연락 CTA에 우선 라우팅",
            "영문 페이지의 Editor's Pick 배지 포함",
          ]}
          accent="#dc2626"
        />

        <Offering
          tag="03 — Recommended"
          title="페이지 중단 스폰서 슬롯"
          price="฿8,000 / 월"
          body="페이지 중단 위치 + 파란색 Recommended 배지. Editor's Pick보다 노출은 작지만 가성비 좋은 진입 옵션."
          bullets={[
            "페이지 중단 + 파란 배지",
            "여러 카테고리 동시 타겟팅",
            "특정 지역만 (예: /city/chon_buri 만)",
            "월 단위 해지 가능",
          ]}
          accent="#1e40af"
        />

        <Offering
          tag="04 — 리드 제공 (CPL)"
          title="검증된 한국 buyer 문의"
          price="฿2,500 / 리드 · 또는 ฿30,000 / 월 정액"
          body="공급사 프로필(카테고리·지역·언어)과 매칭되는 buyer 문의. 회사명·담당자·예상 발주 규모·타겟 제품/서비스 포함."
          bullets={[
            "buyer 카테고리 + 발주량 사전 검증",
            "한국어 / 영어 / 태국어 분리",
            "이메일 또는 CRM 웹훅 전달",
            "유효 리드만 과금",
          ]}
          accent="#16a34a"
        />
      </section>

      <hr className="border-[var(--border)] my-12" />

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">왜 효과가 있나</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Why
            icon="🎯"
            title="구매 의도가 분명한 트래픽"
            body="'태국 OEM 공장', '동부해안 자동차 부품 제조사', 특정 산단 이름으로 검색해 들어옵니다. 1-4주 안에 RFQ를 보낼 단계의 buyer."
          />
          <Why
            icon="🏛"
            title="DBD 등기 검증 노출"
            body="이 디렉토리에 입점하면 한국 buyer가 정식 법인명·등록자본금·설립일·TSIC 산업코드까지 같이 봅니다. 알리바바의 '뱃지' 신뢰보다 강한 정부 등기소 기반 시그널 — 신생 마켓플레이스 노이즈 사이에서 차별화."
          />
          <Why
            icon="🇰🇷"
            title="한국 buyer 집중"
            body="한국·일본·영어권 소싱 팀이 가장 가치 높은 B2B 트래픽. 다국어 진입 페이지가 이 buyer를 우선 받도록 튜닝되어 있습니다."
          />
          <Why
            icon="⚡"
            title="자동 갱신"
            body="공급사 정보 변경은 다음 데이터 빌드 30분 안에 반영. 대량 배치 갱신 기다릴 필요 없음."
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">시작하기</h2>
        <p className="text-[var(--muted)] text-sm mb-6">
          회사명과 원하는 티어를 폼으로 보내주세요. 영업일 1일 안에 답변합니다.
        </p>
        <RfqForm locale="ko" />
      </section>

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "공급사 등록", url: "/ko/for-suppliers" },
      ]} />
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 text-center">
      <div className="text-3xl font-bold tabular-nums">{n}</div>
      <div className="text-xs text-[var(--muted)] uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function Offering({ tag, title, price, body, bullets, accent }: {
  tag: string; title: string; price: string; body: string; bullets: string[]; accent: string;
}) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
            {tag}
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <div className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: `${accent}15`, color: accent }}>
          {price}
        </div>
      </div>
      <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{body}</p>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <span style={{ color: accent }} className="font-bold">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Why({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-bold text-base mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
