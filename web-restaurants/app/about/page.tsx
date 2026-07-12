import { loadMasterDb } from "@/lib/data";
import { relativeTimeFromIso } from "@/components/Badges";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { getLocale, type Locale } from "@/lib/locale";
import { strings, tr } from "@/lib/strings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — No Filter. Just Numbers.",
  description:
    "Your feed is a paid ad. We ended it with data. How SNS Stopper computes Trust Score from 1.3M real Google reviews — no editorial intervention, no paid placements, no influencer tie-ins.",
  alternates: { canonical: "/about" },
};

const FAQS: Record<Locale, { q: string; a: string }[]> = {
  en: [
    { q: "Where does this data come from?", a: "All restaurant listings, ratings, reviews, and metadata are sourced from public Google Maps listings. We do not edit, hide, or selectively filter any restaurant. Data refreshes automatically as our scrapers collect new reviews — see the \"Data updated\" stat above for the current cycle." },
    { q: "How is the Trust Score calculated?", a: "Trust Score (0-100) combines four signals: Google rating (50% weight), review volume on logarithmic scale (40%), Local Guide reviewer ratio (10%), and reviewer authority (5%). It's our derived metric." },
    { q: "What does 'AI Verified · X% real' mean?", a: "Confidence score derived from the proportion of reviewers who are Google Local Guides — a status given by Google to high-volume verified reviewers. We start at 50% baseline and add up to 50% based on Local Guide ratio. Defense against fake review concerns." },
    { q: "Are listings sponsored?", a: "Organic listings are never paid. We offer Featured / Editor's Pick / Recommended slots that are clearly labelled with a coloured badge. We do not delete, hide, or downrank any organic listing." },
    { q: "How fresh is the data?", a: "Scrapers run continuously and the master dataset rebuilds on a rolling basis; the site redeploys when it changes. Check the \"Data updated\" stat above for exactly how current this snapshot is." },
    { q: "What are 'mentioned topics'?", a: "Phrases like 'fresh', 'spicy', 'halal', 'long wait' counted across all reviews. Help diners spot patterns a star rating misses. Fixed keyword dictionary in English and Thai." },
    { q: "How does the rating timeline work?", a: "Each Google review has a relative timestamp. We bucket into recent (<3mo), midterm (3-12mo), historical (1+ year). Comparing average rating per bucket gives a quality trajectory: improving / stable / declining." },
    { q: "Why no booking?", a: "Most Bangkok restaurants take walk-ins or use direct phone/LINE. We focus on accurate, current information — view on Google Maps for directions, or call directly." },
  ],
  ko: [
    { q: "데이터는 어디서 가져오나요?", a: "모든 레스토랑 정보, 평점, 리뷰, 메타데이터는 공개 Google Maps 리스팅에서 자동 수집됩니다. 어떤 레스토랑도 편집하거나 숨기거나 선택적으로 필터링하지 않습니다. 데이터는 스크래퍼가 새 리뷰를 수집하는 대로 자동 갱신됩니다 — 현재 갱신 시점은 위 '데이터 업데이트' 항목을 참고하세요." },
    { q: "Trust Score는 어떻게 계산되나요?", a: "Trust Score(0-100)는 네 가지 신호를 결합합니다: Google 평점(50%), 리뷰 수 로그 스케일(40%), Local Guide 리뷰어 비율(10%), 리뷰어 신뢰도(5%). 우리가 직접 산출하는 지표입니다." },
    { q: "'AI Verified · X% 실제'는 무슨 뜻인가요?", a: "Google이 고신뢰 리뷰어에게 부여하는 Local Guide 비율에서 파생된 신뢰도 점수입니다. 기준 50%에서 시작해 Local Guide 비율에 따라 최대 50%를 추가합니다. 가짜 리뷰 방어 지표입니다." },
    { q: "리스팅에 광고가 포함되나요?", a: "유기적 리스팅은 절대 유료가 아닙니다. 유색 배지로 명확히 표시된 Featured / Editor's Pick / Recommended 슬롯을 제공합니다. 어떤 유기적 리스팅도 삭제, 숨김, 순위 하락시키지 않습니다." },
    { q: "데이터는 얼마나 최신인가요?", a: "스크래퍼가 계속 가동되며 마스터 데이터셋은 주기적으로 재구축됩니다. 이 스냅샷이 얼마나 최신인지는 위 '데이터 업데이트' 항목에서 정확히 확인할 수 있습니다." },
    { q: "'언급 주제'란 무엇인가요?", a: "'신선함', '매운맛', '할랄', '대기 시간' 등 모든 리뷰에서 집계된 키워드입니다. 별점이 놓치는 패턴을 파악하는 데 도움이 됩니다." },
    { q: "평점 타임라인은 어떻게 작동하나요?", a: "각 Google 리뷰의 상대적 타임스탬프를 기준으로 최근(<3개월), 중기(3-12개월), 과거(1년+)로 분류합니다. 구간별 평균 평점 비교로 품질 추이를 파악합니다." },
    { q: "예약 기능은 왜 없나요?", a: "방콕 레스토랑 대부분은 워크인 또는 직접 전화/LINE을 사용합니다. 우리는 정확하고 현재적인 정보 제공에 집중합니다." },
  ],
  th: [
    { q: "ข้อมูลมาจากไหน?", a: "รายชื่อร้านอาหาร คะแนน รีวิว และข้อมูลทั้งหมดมาจากรายชื่อสาธารณะ Google Maps เราไม่แก้ไข ซ่อน หรือกรองร้านอาหารใดๆ ข้อมูลอัปเดตอัตโนมัติเมื่อสแครปเปอร์เก็บรีวิวใหม่ — ดูรอบอัปเดตล่าสุดที่สถิติ 'อัปเดตข้อมูล' ด้านบน" },
    { q: "Trust Score คำนวณอย่างไร?", a: "Trust Score (0-100) รวมสัญญาณ 4 อย่าง: คะแนน Google (50%) ปริมาณรีวิวในสเกลลอการิทึม (40%) สัดส่วน Local Guide (10%) และความน่าเชื่อถือของผู้รีวิว (5%)" },
    { q: "'AI Verified · X% จริง' หมายความว่าอะไร?", a: "คะแนนความเชื่อมั่นจากสัดส่วน Local Guide ของ Google — ผู้รีวิวที่ Google รับรองว่ามีปริมาณรีวิวสูง เริ่มต้นที่ 50% และเพิ่มขึ้นตามสัดส่วน Local Guide" },
    { q: "รายชื่อมีสปอนเซอร์ไหม?", a: "รายชื่อออร์แกนิกไม่มีการชำระเงิน เราเสนอสล็อต Featured / Editor's Pick ที่มีป้ายสีชัดเจน เราไม่ลบ ซ่อน หรือลดอันดับรายชื่อออร์แกนิกใดๆ" },
    { q: "ข้อมูลสดแค่ไหน?", a: "สแครปเปอร์ทำงานต่อเนื่องและชุดข้อมูลหลักสร้างใหม่เป็นระยะ ดูความสดของข้อมูลชุดนี้ได้ที่สถิติ 'อัปเดตข้อมูล' ด้านบน" },
    { q: "'หัวข้อที่กล่าวถึง' คืออะไร?", a: "คำเช่น 'สด' 'เผ็ด' 'ฮาลาล' 'รอนาน' ที่นับจากรีวิวทั้งหมด ช่วยให้เห็นรูปแบบที่คะแนนดาวมองไม่เห็น" },
    { q: "ไทม์ไลน์คะแนนทำงานอย่างไร?", a: "แต่ละรีวิว Google มีการประทับเวลาสัมพัทธ์ เราแบ่งเป็นล่าสุด (<3 เดือน) กลาง (3-12 เดือน) เก่า (1+ ปี) เพื่อดูแนวโน้มคุณภาพ" },
    { q: "ทำไมไม่มีการจอง?", a: "ร้านอาหารกรุงเทพส่วนใหญ่รับ walk-in หรือโทรตรง เราเน้นข้อมูลที่ถูกต้องและทันสมัย" },
  ],
};

const PRINCIPLES: Record<Locale, { title: string; body: string }[]> = {
  en: [
    { title: "Every number is visible.", body: "Trust Score breakdown shown on every restaurant page. You can see exactly how it's calculated — no black box, no editorial override, no hidden weights." },
    { title: "We don't write reviews.", body: "All review excerpts come from real Google Maps users, with attribution. We analyze; we don't editorialize. Numbers only." },
    { title: "The algorithm ranks. Humans don't.", body: "Rankings rebuild automatically from raw scraped data on a rolling cycle. No human touches the order. No deletion, no suppression, no favor." },
    { title: "Sponsored slots are labeled. Always.", body: "Some restaurants buy Featured / Editor's Pick visibility. These are badged and never displace organic rankings. The lie we're fighting is hidden sponsorship — we won't do that." },
  ],
  ko: [
    { title: "모든 숫자는 공개됩니다.", body: "Trust Score 세부 내역이 모든 레스토랑 페이지에 표시됩니다. 계산 방식을 정확히 확인할 수 있습니다 — 블랙박스 없음, 편집 개입 없음, 숨겨진 가중치 없음." },
    { title: "우리는 리뷰를 쓰지 않습니다.", body: "모든 리뷰 발췌는 출처 표시와 함께 실제 Google Maps 사용자에게서 옵니다. 우리는 분석할 뿐, 평론하지 않습니다. 숫자만." },
    { title: "알고리즘이 랭킹을 매깁니다. 인간이 아닌.", body: "랭킹은 원시 스크래핑 데이터에서 주기적으로 자동 재구축됩니다. 어떤 인간도 순서에 손대지 않습니다. 삭제, 억제, 편의 없음." },
    { title: "스폰서 슬롯은 항상 표시됩니다.", body: "일부 레스토랑이 Featured / Editor's Pick 노출을 구입합니다. 이는 배지로 표시되며 유기적 랭킹을 절대 대체하지 않습니다. 우리가 싸우는 거짓말은 숨겨진 스폰서십입니다 — 우리는 그러지 않겠습니다." },
  ],
  th: [
    { title: "ตัวเลขทุกตัวโปร่งใส", body: "การแจกแจง Trust Score แสดงในทุกหน้าร้านอาหาร คุณเห็นได้ว่าคำนวณอย่างไร — ไม่มีกล่องดำ ไม่มีการแทรกแซงบรรณาธิการ ไม่มีน้ำหนักที่ซ่อนอยู่" },
    { title: "เราไม่เขียนรีวิว", body: "ตัวอย่างรีวิวทั้งหมดมาจากผู้ใช้ Google Maps จริงๆ พร้อมการอ้างอิง เราวิเคราะห์ ไม่ใช่วิจารณ์ ตัวเลขเท่านั้น" },
    { title: "อัลกอริทึมจัดอันดับ ไม่ใช่มนุษย์", body: "การจัดอันดับสร้างใหม่โดยอัตโนมัติจากข้อมูลดิบเป็นรอบ ไม่มีมนุษย์แตะต้องลำดับ ไม่มีการลบ กด หรือเอื้อประโยชน์" },
    { title: "สล็อตสปอนเซอร์มีป้ายกำกับเสมอ", body: "บางร้านซื้อพื้นที่ Featured / Editor's Pick สิ่งเหล่านี้มีป้ายและไม่แทนที่การจัดอันดับออร์แกนิก สิ่งที่เราต่อสู้คือการสนับสนุนที่ซ่อนอยู่" },
  ],
};

const BRAND_DESC: Record<Locale, string> = {
  en: " is an independent data analysis tool. We rank Bangkok and Pattaya restaurants by Trust Score — a composite derived from public Google Maps review data. No human curation. No editorial override. No sponsored results that look organic.",
  ko: "은 독립적인 데이터 분석 도구입니다. 공개 Google Maps 리뷰 데이터에서 도출한 Trust Score로 방콕과 파타야 레스토랑을 랭킹합니다. 인간 큐레이션 없음. 편집 개입 없음. 유기적인 척하는 스폰서 결과 없음.",
  th: " เป็นเครื่องมือวิเคราะห์ข้อมูลอิสระ เราจัดอันดับร้านอาหารในกรุงเทพและพัทยาด้วย Trust Score — ตัวเลขรวมจากข้อมูล Google Maps สาธารณะ ไม่มีการคัดเลือกโดยมนุษย์ ไม่มีการแทรกแซงบรรณาธิการ",
};

export default async function AboutPage() {
  const locale = await getLocale();
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const s = strings.about;
  const faqs = FAQS[locale];
  const principles = PRINCIPLES[locale];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">{tr(strings.common.home, locale)}</a>
        <span className="mx-2">›</span>
        <span>{tr(strings.common.about, locale)}</span>
      </nav>

      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">{tr(s.tagline, locale)}</p>
        <h1 className="text-4xl font-black tracking-tight leading-tight">
          {tr(s.heading1, locale)}<br />{tr(s.heading2, locale)}
        </h1>
      </div>
      <p className="text-base text-[var(--muted)] mb-4 leading-relaxed">
        {tr(s.intro1, locale)}{" "}
        <strong className="text-[var(--fg)]">{tr(s.introBold, locale)}</strong>{tr(s.intro2, locale)}
      </p>
      <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
        {cfg.brand}{BRAND_DESC[locale]}
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3">{tr(s.glanceTitle, locale)}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.total_restaurants.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">{tr(s.restaurants, locale)}</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.with_reviews_scraped.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">{tr(s.fullAnalysis, locale)}</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.cuisine_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">{tr(s.cuisines, locale)}</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{relativeTimeFromIso(db.generated_at)}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">{tr(s.refreshCycle, locale)}</div>
          </div>
        </div>
      </div>

      <section className="space-y-3 mb-12">
        <h2 className="text-2xl font-black">{tr(s.howTitle, locale)}</h2>
        {principles.map((p, i) => (
          <Principle key={i} title={p.title} body={p.body} />
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">{tr(s.faqTitle, locale)}</h2>
        {faqs.map((f, i) => (
          <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
            <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
              <span>{f.q}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
            </summary>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
          </details>
        ))}
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10">
        <h2 className="text-xl font-bold mb-4">{tr(s.legalTitle, locale)}</h2>
        <div className="space-y-3 text-sm text-[var(--muted)] leading-relaxed">
          <LegalBlock
            title="데이터 출처 / Data Source"
            body="본 사이트의 모든 평점, 리뷰 수, 리뷰 텍스트는 Google Maps의 공개 데이터를 자동 수집하여 표시합니다. SNS Stopper는 어떠한 리뷰 내용도 직접 작성하거나 편집하지 않습니다. All ratings, review counts, and review text are collected automatically from public Google Maps data."
          />
          <LegalBlock
            title="Trust Score는 수학적 지표 / Trust Score is a Mathematical Metric"
            body="Trust Score는 공개 데이터를 알고리즘으로 계산한 파생 수치입니다. 특정 식당에 대한 의견 표명이나 명예훼손적 진술이 아닌 통계적 데이터 분석 결과입니다. 대한민국 정보통신망법 및 형법상 명예훼손 조항의 적용 대상이 아닙니다."
          />
          <LegalBlock
            title="원본 저작자 귀속 / Attribution"
            body="인용된 리뷰는 Google Maps 원본 작성자에게 귀속됩니다. 본 사이트는 공개 정보의 집계자(aggregator)입니다. Quoted reviews are attributed to their original Google Maps authors."
          />
          <LegalBlock
            title="정정 요청 / Correction Requests"
            body="데이터 오류(폐업, 주소 변경 등) 수정 요청은 Contact 페이지를 이용해 주세요. 합리적인 정정 요청은 영업일 기준 3일 이내 처리합니다. For data errors (closed venues, address changes), use the Contact page."
          />
        </div>
      </section>

      <FaqJsonLd faqs={FAQS.en} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
      ]} />
    </div>
  );
}

function LegalBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-lg p-4">
      <h3 className="font-semibold text-[var(--fg)] mb-1 text-sm">{title}</h3>
      <p className="text-xs text-[var(--muted)] leading-relaxed">{body}</p>
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
