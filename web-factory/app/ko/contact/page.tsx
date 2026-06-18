import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { RfqForm } from "@/components/RfqForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의",
  description: "공급사 파트너십, 데이터 정정, 보도자료, 기타 문의 — 한국어로 응답합니다.",
  alternates: {
    canonical: "/ko/contact",
    languages: {
      "ko-KR": "/ko/contact",
      "en-US": "/contact",
      "th-TH": "/th/contact",
      "x-default": "/contact",
    },
  },
  openGraph: { locale: "ko_KR" },
};

export default function KoContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <span>문의</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">문의</h1>
      <p className="text-base text-[var(--muted)] mb-8 leading-relaxed">
        파트너십·데이터 정정·보도·기타 문의는 아래 폼으로 보내주세요. 영업일 1일 이내 답변합니다 (한국어 OK).
      </p>

      <div className="space-y-3 mb-8">
        <Reason icon="🏭" title="공급사 파트너십" body="Editor's Pick / Recommended / Featured 슬롯, 한국어 채널 우선 노출, 리드 제공 — 자세한 내용은 /ko/for-suppliers." />
        <Reason icon="✏️" title="데이터 정정" body="잘못된 주소·폐쇄된 공장·시간 정보 오래됨·카테고리 오분류. 공급사 이름과 어떤 점이 잘못됐는지 알려주세요." />
        <Reason icon="📰" title="보도 / 미디어" body="산업 데이터, 방법론 질문, 인터뷰 요청." />
        <Reason icon="❓" title="기타" body="모든 메시지 직접 읽습니다." />
      </div>

      <RfqForm locale="ko" />

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "문의", url: "/ko/contact" },
      ]} />
    </div>
  );
}

function Reason({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-3 p-4 bg-white border border-[var(--border)] rounded-lg">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <div className="font-bold text-sm">{title}</div>
        <p className="text-xs text-[var(--muted)] mt-0.5">{body}</p>
      </div>
    </div>
  );
}
