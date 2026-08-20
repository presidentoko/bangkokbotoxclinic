// Korean 홈 — 2026-07-13: EN과 별개 구현(섹션 5개)이던 걸 메인 HomePage 컴포넌트
// 재사용으로 전환. 섹션 20개 전체가 이제 KO에도 나옴 (헤딩 번역, 일부 본문은 EN 유지).
// FAQ는 focus별(botox/dental) 실번역 유지.
import { getSiteConfig, type SiteFocus } from "@/lib/site";
import type { Metadata } from "next";
import HomePage from "../page";

// focus 무관하게 "방콕 보톡스 클리닉" 고정이라 덴탈 등 다른 사이트의 /ko 홈이
// 전부 보톡스로 색인되고 있었음 (2026-07-10 감사 — 실제 구글 색인 타이틀 확인).
const KO_SERVICE: Partial<Record<SiteFocus, string>> = {
  botox: "보톡스", filler: "필러", hifu: "HIFU", facial: "페이셜",
  laser: "레이저", dental: "치과", hair: "모발이식",
};

export async function generateMetadata(): Promise<Metadata> {
  const cfg = getSiteConfig();
  const svc = KO_SERVICE[cfg.focus];
  const title = svc
    ? `방콕 ${svc} 클리닉 — 인스타 말고 진짜 후기로 찾자`
    : "방콕 클리닉 — 인스타 말고 진짜 후기로 찾자";
  const description = svc
    ? `방콕 ${svc} 클리닉 디렉토리. Google Maps 실제 후기 분석으로 신뢰도 점수 매김. 정품/정식 시술, 영어 가능 직원, 한국인 의사 정보까지.`
    : "방콕 클리닉 디렉토리. Google Maps 실제 후기 분석으로 신뢰도 점수 매김.";
  return {
    title,
    description,
    // 홈 클러스터 3개 페이지가 같은 코드 체계로 서로를 전부 선언해야 hreflang이
    // 자기확인된다. 예전엔 / 가 bare code, /ko 가 region code, /th 가 또 다른
    // 조합이라 클러스터가 성립하지 않았고 x-default 도 / 에만 있었다
    // (2026-08-06 감사). 기준은 app/page.tsx 의 bare code 체계.
    alternates: {
      canonical: "/ko",
      languages: { en: "/", th: "/th", ko: "/ko", "x-default": "/" },
    },
    openGraph: { title, description, locale: "ko_KR" },
  };
}

const KO_AUTH_FAQ: Partial<Record<SiteFocus, { q: string; a: string }>> = {
  botox: {
    q: "방콕 보톡스 정품 어떻게 확인하나요?",
    a: "리뷰에 'genuine brand' / '정품' 언급 많은 클리닉이 신뢰할 만합니다. 시술 전 Allergan/Dysport/Botulax 박스 + 시리얼 스티커 직접 확인 요청하세요.",
  },
  dental: {
    q: "방콕 치과, 믿을 수 있는 곳인지 어떻게 확인하나요?",
    a: "리뷰에 임플란트/보철 시술 후기와 시술 전후 사진이 많은 클리닉이 신뢰할 만합니다. 태국 치과의사협회(Thai Dental Council) 등록번호를 문의하세요.",
  },
};
const KO_PRICE_FAQ: Partial<Record<SiteFocus, { q: string; a: string }>> = {
  botox: {
    q: "방콕 시술 가격은 얼마인가요?",
    a: "보톡스: 유닛당 ฿80-250 (브랜드별 차이). 필러: 1ml당 ฿8,000-25,000. HIFU 1회: ฿8,000-80,000+. 클리닉별 정확한 가격은 LINE 또는 전화 문의.",
  },
  dental: {
    q: "방콕 치과 가격은 얼마인가요?",
    a: "임플란트: ฿35,000부터. 비니어: 개당 ฿12,000부터. 미백: ฿4,000부터. 미국·한국 대비 최대 70% 저렴. 클리닉별 정확한 가격은 LINE 또는 전화 문의.",
  },
};
const KO_FAQ_FALLBACK = {
  auth: { q: "믿을 수 있는 클리닉인지 어떻게 확인하나요?", a: "실제 시술 후기가 많고 사진/영상이 첨부된 클리닉이 신뢰할 만합니다. 상담 전 자격증과 시술 경험을 직접 문의하세요." },
  price: { q: "방콕 시술 가격은 얼마인가요?", a: "시술/브랜드에 따라 편차가 크니 클리닉별 정확한 가격은 LINE 또는 전화로 문의하세요." },
};

function koFaqs(focus: SiteFocus) {
  const auth = KO_AUTH_FAQ[focus] ?? KO_FAQ_FALLBACK.auth;
  const price = KO_PRICE_FAQ[focus] ?? KO_FAQ_FALLBACK.price;
  return [
    {
      q: "신뢰도 점수는 어떻게 계산되나요?",
      a: "0-100 점수로 4가지 시그널을 합산: Google 평점 (50% 가중치), 리뷰 수 logarithmic scale (40%), Google Local Guide 리뷰어 비율 (10%), 평균 리뷰어 권위 점수 (5%). 30분마다 갱신.",
    },
    auth,
    price,
    {
      q: "한국어 가능한 클리닉은 어디인가요?",
      a: "Sukhumvit Plaza (수쿰빗 12), Phrom Phong, Thong Lor 지역에 한국인 의사/통역 가능 클리닉 많음. 각 클리닉 페이지에서 'Korean-trained' 토픽 mention 확인.",
    },
    {
      q: "광고나 협찬이 있나요?",
      a: "Editor's Pick / Recommended / Featured 표시가 있는 슬롯만 유료. 일반 리스트는 모두 무료이며 Google 데이터 그대로 표시.",
    },
  ];
}

export default function KoHomePage() {
  const cfg = getSiteConfig();
  return <HomePage lang="ko" faqs={koFaqs(cfg.focus)} />;
}
