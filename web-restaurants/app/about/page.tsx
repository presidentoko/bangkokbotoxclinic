import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — No Filter. Just Numbers.",
  description:
    "Your feed is a paid ad. We ended it with data. How SNS Stopper computes Trust Score from 1.3M real Google reviews — no editorial intervention, no paid placements, no influencer tie-ins.",
  alternates: { canonical: "/about" },
};

const FAQS = [
  {
    q: "Where does this data come from?",
    a: "All restaurant listings, ratings, reviews, and metadata are sourced from public Google Maps listings. We do not edit, hide, or selectively filter any restaurant. Data refreshes every 30 minutes.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines four signals: Google rating (50% weight), review volume on logarithmic scale (40%), Local Guide reviewer ratio (10%), and reviewer authority (5%). It's our derived metric.",
  },
  {
    q: "What does 'AI Verified · X% real' mean?",
    a: "Confidence score derived from the proportion of reviewers who are Google Local Guides — a status given by Google to high-volume verified reviewers. We start at 50% baseline and add up to 50% based on Local Guide ratio. Defense against fake review concerns.",
  },
  {
    q: "Are listings sponsored?",
    a: "Organic listings are never paid. We offer Featured / Editor's Pick / Recommended slots that are clearly labelled with a coloured badge. We do not delete, hide, or downrank any organic listing.",
  },
  {
    q: "How fresh is the data?",
    a: "Continuously. Scrapers run 24/7, master dataset rebuilds every 5 minutes, the website redeploys when data changes. New public reviews of a listed restaurant typically appear within 30 minutes.",
  },
  {
    q: "What are 'mentioned topics'?",
    a: "Phrases like 'fresh', 'spicy', 'halal', 'long wait' counted across all reviews. Help diners spot patterns a star rating misses. Fixed keyword dictionary in English and Thai.",
  },
  {
    q: "How does the rating timeline work?",
    a: "Each Google review has a relative timestamp. We bucket into recent (<3mo), midterm (3-12mo), historical (1+ year). Comparing average rating per bucket gives a quality trajectory: improving / stable / declining.",
  },
  {
    q: "Why no booking?",
    a: "Most Bangkok restaurants take walk-ins or use direct phone/LINE. We focus on accurate, current information — view on Google Maps for directions, or call directly. Restaurants with their own booking offer it via the website link on their detail page.",
  },
];

export default async function AboutPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>About</span>
      </nav>

      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">No filter. Just numbers.</p>
        <h1 className="text-4xl font-black tracking-tight leading-tight">
          Your feed is a paid ad<br />pretending to be a friend's opinion.
        </h1>
      </div>
      <p className="text-base text-[var(--muted)] mb-4 leading-relaxed">
        We're here to end it. No influencers. No filters. Just{" "}
        <strong className="text-[var(--fg)]">1.3 million people who had nothing to gain</strong> — real Google reviewers, counted, weighted, and cross-checked by algorithm, not by us.
      </p>
      <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
        {cfg.brand} is an independent data analysis tool. We rank Bangkok and Pattaya restaurants by Trust Score — a composite derived from public Google Maps review data. No human curation. No editorial override. No sponsored results that look organic.
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3">At a glance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.total_restaurants.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Restaurants</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.with_reviews_scraped.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Full review analysis</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.cuisine_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Cuisines</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">30 min</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Refresh cycle</div>
          </div>
        </div>
      </div>

      <section className="space-y-3 mb-12">
        <h2 className="text-2xl font-black">How we end the lie</h2>
        <Principle
          title="Every number is visible."
          body="Trust Score breakdown shown on every restaurant page. You can see exactly how it's calculated — no black box, no editorial override, no hidden weights."
        />
        <Principle
          title="We don't write reviews."
          body="All review excerpts come from real Google Maps users, with attribution. We analyze; we don't editorialize. Numbers only."
        />
        <Principle
          title="The algorithm ranks. Humans don't."
          body="Rankings rebuild every 30 minutes from raw scraped data. No human touches the order. No deletion, no suppression, no favor."
        />
        <Principle
          title="Sponsored slots are labeled. Always."
          body="Some restaurants buy Featured / Editor's Pick visibility. These are badged and never displace organic rankings. The lie we're fighting is hidden sponsorship — we won't do that."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Frequently asked</h2>
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

      {/* 법적 보호 섹션 */}
      <section className="mt-12 border-t border-[var(--border)] pt-10">
        <h2 className="text-xl font-bold mb-4">법적 고지 / Legal Notice</h2>
        <div className="space-y-3 text-sm text-[var(--muted)] leading-relaxed">
          <LegalBlock
            title="데이터 출처"
            body="본 사이트의 모든 평점, 리뷰 수, 리뷰 텍스트는 Google Maps의 공개 데이터를 자동 수집하여 표시합니다. SNS Stopper는 어떠한 리뷰 내용도 직접 작성하거나 편집하지 않습니다."
          />
          <LegalBlock
            title="Trust Score는 수학적 지표입니다"
            body="Trust Score는 공개 데이터를 알고리즘으로 계산한 파생 수치입니다. 특정 식당에 대한 의견 표명이나 명예훼손적 진술이 아닌, 통계적 데이터 분석 결과입니다. 대한민국 정보통신망법 및 형법상 명예훼손 조항의 적용 대상이 아닙니다."
          />
          <LegalBlock
            title="원본 저작자 귀속"
            body="인용된 리뷰는 Google Maps 원본 작성자에게 귀속됩니다. 본 사이트는 해당 내용의 창작자가 아닌 공개 정보의 집계자(aggregator)입니다."
          />
          <LegalBlock
            title="정정 요청 절차"
            body="데이터 오류(폐업, 주소 변경 등) 또는 본인과 관련된 정보 수정을 요청하시려면 Contact 페이지를 이용해 주세요. 합리적인 정정 요청은 영업일 기준 3일 이내 처리합니다."
          />
          <LegalBlock
            title="면책 조항"
            body="본 사이트는 정보 제공 목적으로 운영됩니다. 데이터는 정기적으로 갱신되지만 실시간 정확성을 보장하지 않습니다. 본 정보를 기반으로 한 방문 결과에 대해 SNS Stopper는 책임을 지지 않습니다."
          />
        </div>
      </section>

      <FaqJsonLd faqs={FAQS} />
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
