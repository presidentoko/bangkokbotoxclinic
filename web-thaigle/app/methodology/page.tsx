import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { RatingLegend } from "@/components/RatingLegend";
import { TrustScoreExplainer } from "@/components/TrustScoreExplainer";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const metadata: Metadata = {
  title: "How Thaigle Detects Fake Reviews & Influencer Manipulation | Methodology",
  description: "Thaigle's Trust Score methodology: how we detect fake reviews, measure reviewer credibility, and surface restaurants that are actually good vs just Instagram famous.",
  alternates: { canonical: "/methodology" },
};

const FAQS = [
  {
    q: "How does Thaigle detect fake reviews?",
    a: "We measure the ratio of Google Local Guide reviewers — verified high-volume reviewers given status by Google itself. A restaurant with 90%+ Local Guide reviewers is extremely difficult to fake-review at scale. We combine this with review volume (log-scaled) and reviewer authority (average reviews per author) to build a composite Trust Score.",
  },
  {
    q: "What is Trust Score?",
    a: "Trust Score (0-100) = rating contribution (50%, weighted by Google star rating) + volume contribution (40%, log10 scaled — 10 reviews adds less than 10x the next 10) + Local Guide ratio (10%, max at 50%+ Local Guides) + reviewer authority (5%, log-scaled average reviews per author). A score of 80+ means the rating is statistically trustworthy.",
  },
  {
    q: "Can a restaurant pay to improve their Trust Score?",
    a: "No. Trust Score is derived entirely from public Google Maps data — ratings, review counts, reviewer types. Thaigle does not edit, inflate, or accept payment to modify any organic listing's Trust Score.",
  },
  {
    q: "What does 'influencer manipulation' mean in restaurant reviews?",
    a: "Influencer manipulation occurs when a restaurant's online reputation is driven by paid social media posts (Instagram, TikTok, YouTube) that generate visits from followers who leave reviews out of brand loyalty rather than actual food quality. The result: high star ratings from low-credibility reviewers. Our Local Guide ratio catches this — influencer-driven restaurants show low Local Guide ratios despite high review counts.",
  },
  {
    q: "How often is data updated?",
    a: "The master database rebuilds continuously. Restaurant listings, ratings, and review counts refresh from Google Maps every 24 hours. The website redeploys automatically on data change.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Methodology", url: "/methodology" },
      ]} />
      <FaqJsonLd faqs={FAQS} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-3xl font-bold">How Thaigle Works</h1>
          <ShareButton title="How Thaigle Detects Fake Reviews — Trust Score Methodology" text="Independent methodology for restaurant review authenticity in Bangkok" url={`${SITE}/methodology`} line whatsapp />
        </div>
        <p className="text-[var(--muted)] mb-8">
          Independent methodology for detecting fake reviews and influencer manipulation in Thailand restaurant rankings.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Trust Score Formula</h2>
          <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm mb-4">
            Trust Score = Rating (50%) + Volume (40%) + Local Guide Ratio (10%) + Author Authority (5%)
          </div>
          <ul className="space-y-2 text-sm">
            <li><strong>Rating (50%):</strong> Google star rating / 5 × 50. A 4.5★ restaurant contributes 45 points.</li>
            <li><strong>Volume (40%):</strong> log10(reviews) × 12, capped at 40. Volume matters, but diminishing returns — 1,000 reviews isn&apos;t 10× better than 100.</li>
            <li><strong>Local Guide Ratio (10%):</strong> % of scraped reviewers who are Google Local Guides × 20, capped at 10. Local Guides are Google-verified high-volume reviewers — hard to fake at scale.</li>
            <li><strong>Author Authority (5%):</strong> log10(avg reviews per author) × 2, capped at 5. Reviewers who&apos;ve written many reviews are harder to astroturf.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Why We Built This</h2>
          <p className="mb-3 text-sm">
            Bangkok and Pattaya have a massive influencer-driven restaurant marketing ecosystem. A restaurant can get 50,000 Instagram views, 500 TikTok reposts, and a wave of follower visits — generating hundreds of 5-star reviews from people who came because of the influencer, not because the food is great.
          </p>
          <p className="mb-3 text-sm">
            The result is restaurant rankings that reflect marketing budgets, not food quality. Thaigle fixes this by using data signals that influencer campaigns cannot easily fake: Local Guide ratios, reviewer authority, and volume-adjusted scoring.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">FAQ</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="font-semibold mb-2">{faq.q}</div>
                <p className="text-sm text-[var(--muted)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <TrustScoreExplainer />
        <RatingLegend />
        <BangkokTip />

        {/* Poll */}
        <div className="mt-8 mb-4">
          <VersusVote
            question="When you pick a Bangkok restaurant — what do you trust most?"
            a={{ id: "star-rating", label: "Star rating alone", emoji: "⭐", desc: "Google 4.5+ is enough — high rating = good restaurant", url: "/trending" }}
            b={{ id: "trust-score", label: "Trust Score methodology", emoji: "📊", desc: "Reviewer credibility, fake review filtering, trend analysis", url: "/trending", highlight: "Thaigle approach" }}
          />
        </div>

        {/* CTA links */}
        <div className="flex flex-wrap gap-3">
          <a href="/trending" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition">
            See top ranked venues →
          </a>
          <a href="/quiz" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-300 text-orange-700 font-bold text-sm hover:bg-orange-50 transition">
            🎯 Take the Bangkok Quiz
          </a>
          <a href="/local-tips" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-[var(--muted)] text-sm hover:border-orange-300 hover:text-orange-700 transition">
            🗺️ Local insider tips
          </a>
        </div>
      </div>
    </>
  );
}
