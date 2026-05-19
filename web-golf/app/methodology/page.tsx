import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thailandgolfguide.com";

export const metadata: Metadata = {
  title: "Methodology — How Trust Score & Korean-friendly Are Computed",
  description:
    "Full transparency on how Thailand Golf Guide ranks courses. Trust Score formula, Korean-friendly scoring signals, data sources, refresh cadence, and what we deliberately don't measure.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    type: "article",
    title: "Methodology — Thailand Golf Guide",
    description: "How we compute Trust Score and Korean-friendly flags. No editorial picks, no paid placement in organic rank.",
  },
};

const FAQS = [
  {
    q: "Why don't you just use Google's rating?",
    a: "A 5.0 rating from 3 reviews is statistically meaningless next to a 4.7 from 3,000. Trust Score combines the rating with review volume on a log scale, plus Local Guide reviewer ratio (more credible reviewers) and average reviewer authority (how many reviews each reviewer has written) — so a course can't game it with a few burst reviews.",
  },
  {
    q: "Do courses pay to appear higher on this site?",
    a: "No — organic Trust Score ranking is never changed by payment. Editor's Pick, Recommended, and Featured slots exist but are clearly badged with their own color and label. They appear alongside organic results, never replace them. Sponsored placements are limited to 1-3 per page so they don't drown the data.",
  },
  {
    q: "How fresh is this data?",
    a: "Master dataset rebuilds when new Google reviews are pulled (roughly weekly). The Korean-friendly auto-labeling re-runs on every rebuild so new caddy mentions or Naver blog hits promote a course automatically. There's no manual gatekeeping.",
  },
  {
    q: "Can I see the raw numbers behind a Trust Score?",
    a: "Yes — every course detail page shows the 4 breakdown bars (Rating, Volume, Local Guide, Authority) that add to the total. The /llms-full.txt endpoint provides the entire dataset as plain text for LLMs and researchers.",
  },
  {
    q: "Why is is_korean_friendly only ~86 courses out of 639?",
    a: "We deliberately set a high signal bar so the flag means something. A course needs (a) explicit 'Korean caddy' mention in any review, OR (b) a topic-extracted korean_caddy signal, OR (c) a matched Naver blog post, OR (d) korean_score ≥ 6 from combined ko-reviewer volume + Hangul reviewer names. Lower thresholds would dilute the brand promise and let tourist-spillover courses through.",
  },
  {
    q: "What do you deliberately NOT measure?",
    a: "Course architecture rating, pro-tour pedigree, exclusivity, dress-code strictness, member-only status. Those are subjective or available elsewhere. We focus on signals that predict 'will my visit be OK?' — caddy quality, course conditions, language support, and the volume of corroborating evidence.",
  },
];

export default async function MethodologyPage() {
  const db = await loadMasterDb();
  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;
  const koFriendly = db.restaurants.filter((r) => r.is_korean_friendly).length;
  const withPhotos = db.restaurants.filter((c) => (c.photos && c.photos.length > 0) || c.hero_image || c.top_photo_url).length;
  const withVideos = db.restaurants.filter((c) => c.videos && c.videos.length > 0).length;

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Methodology</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          How Trust Score & Korean-friendly are computed
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          No editorial picks in the organic rank, no opaque algorithms. Below is the exact formula, the data sources, and what we deliberately don&apos;t measure.
        </p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Last reviewed 2026-05-19 · {db.total_restaurants.toLocaleString()} courses · {totalReviews.toLocaleString()} reviews indexed
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Trust Score (0–100)</h2>
        <p className="mb-4 leading-relaxed">
          One number per course. Combines four signals so that no single signal can game the ranking.
        </p>
        <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-4 text-sm font-mono leading-relaxed">
          <div>Trust Score =</div>
          <div className="ml-4">
            (rating ÷ 5) × <strong>50</strong>     <span className="text-[var(--muted)]">// rating-weighted</span>
          </div>
          <div className="ml-4">
            + min(40, log₁₀(reviews) × 12)      <span className="text-[var(--muted)]">// volume, log-scaled so 100 ≠ 10× the impact of 10</span>
          </div>
          <div className="ml-4">
            + min(10, (local_guide_ratio) × 20)  <span className="text-[var(--muted)]">// Local Guide reviewers more credible</span>
          </div>
          <div className="ml-4">
            + min(5, log₁₀(avg_author_review_count) × 2)   <span className="text-[var(--muted)]">// reviewer authority</span>
          </div>
        </div>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Bounded so the four parts max at 50/40/10/5 = 105 nominal, but in practice top courses hit ~92-95. A new course with 3 reviews and 1 Local Guide caps around 55 — that&apos;s correct: not enough evidence to claim &quot;premium&quot;.
        </p>
        <p className="text-sm mt-3 leading-relaxed">
          Every course detail page renders this as <strong>four colored bars</strong> so you can see which signal carried the score and which dragged it down.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Korean-friendly signal</h2>
        <p className="mb-4 leading-relaxed">
          Auto-computed per course from review text. <strong>{koFriendly}</strong> of {db.total_restaurants.toLocaleString()} courses currently pass the threshold.
        </p>
        <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-4">
          <div className="text-sm font-mono leading-relaxed mb-3">
            korean_score =<br />
            <span className="ml-4">topic.korean_caddy × 12</span><br />
            <span className="ml-4">+ phrase &quot;Korean caddy / 한국 캐디&quot; × 15</span><br />
            <span className="ml-4">+ broader &quot;korean / 한국&quot; mention × 8</span><br />
            <span className="ml-4">+ naver_blogs matched × 5</span><br />
            <span className="ml-4">+ ko_review_count × 1</span><br />
            <span className="ml-4">+ sample_ko_reviews × 1.5</span><br />
            <span className="ml-4">+ hangul_reviewer_names × 0.5</span>
          </div>
          <div className="text-sm text-[var(--muted)]">
            Flagged if <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">korean_score ≥ 6</code> OR explicit Korean-caddy phrase OR matched Naver blog OR Apify topic match.
          </div>
        </div>
        <p className="text-sm leading-relaxed">
          The bar is high on purpose. Lower thresholds would let tourist-spillover (a single Korean honeymoon reviewer) through and dilute the badge. We&apos;d rather flag fewer courses correctly than many courses optimistically.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Data sources</h2>
        <div className="space-y-3">
          <Source
            label="Google Maps"
            count="1,316 places indexed"
            note="Public business listings via Apify-managed crawl. Names, addresses, ratings, review counts, categories, opening hours."
          />
          <Source
            label="Google Reviews (deep)"
            count={`${withScraped.toLocaleString()} courses deep-analyzed`}
            note="Apify Google-Maps-Reviews-Scraper pulls full review text + reviewer metadata for the top courses, enabling topic extraction and Korean-friendly signal."
          />
          <Source
            label="Course websites"
            count="~141 courses enriched"
            note="Direct fetch of each course's official site. Extracts holes, par, green-fee mentions, email, Facebook, Instagram, LINE, Korean-language indicators."
          />
          <Source
            label="YouTube reviews"
            count={`${withVideos} courses matched`}
            note="YouTube search by course name; fuzzy-matched 73 with high-quality video reviews. Embedded VideoObject schema on course pages."
          />
          <Source
            label="Naver blogs"
            count="201 blog posts, 6 course-matched"
            note="Korean blogger field reports — broad city queries (방콕 골프, 파타야 골프장, etc.). Course-specific matches surface in coursedetail; the rest power the /guide/korean-golfer-blogs roundup."
          />
          <Source
            label="Pantip threads"
            count="152 Thai community threads"
            note="Pantip.com — Thailand's largest forum. Real Thai golfer discussions. Powers /guide/pantip-golf-threads."
          />
          <Source
            label="Course photos"
            count={`${withPhotos.toLocaleString()} courses with imagery`}
            note="Google Maps + course websites; 140 hand-scraped from course homepages for hero images. Photo gallery on detail pages."
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">What we deliberately don&apos;t do</h2>
        <ul className="space-y-2.5 text-sm leading-relaxed">
          <li>
            <strong>No editorial &quot;Top 10&quot; lists in the organic rank.</strong> All rankings are computed; the only manual lever is whether a course is in the dataset at all.
          </li>
          <li>
            <strong>No course removed for negative reviews.</strong> If Google indexes a course, we do too. Bad ratings are signal, not embarrassment.
          </li>
          <li>
            <strong>No paid removal of competitors.</strong> Sponsored slots can boost a course&apos;s visibility but cannot delete a competitor from the page.
          </li>
          <li>
            <strong>No fake reviews, no LLM-generated reviews.</strong> Every review excerpt on this site is verbatim public Google content.
          </li>
          <li>
            <strong>No third-party tracking pixels in the listing pages.</strong> Vercel Analytics for aggregate traffic only.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Sponsored placement (full transparency)</h2>
        <p className="leading-relaxed text-sm mb-3">
          Courses that buy a slot via <a href="/for-courses" className="text-[var(--accent)] hover:underline font-medium">/for-courses</a> receive one of three badges:
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-3">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Editor&apos;s Pick</div>
            <div className="text-xs mt-1 text-[var(--muted)]">Gold badge. Top of category &amp; province pages.</div>
          </div>
          <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-3">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Recommended</div>
            <div className="text-xs mt-1 text-[var(--muted)]">Blue badge. Mid-page sponsored.</div>
          </div>
          <div className="border border-fuchsia-200 bg-fuchsia-50/50 rounded-lg p-3">
            <div className="text-xs font-bold text-fuchsia-700 uppercase tracking-wider">Featured</div>
            <div className="text-xs mt-1 text-[var(--muted)]">Purple badge. Lightweight visibility boost.</div>
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] mt-3 leading-relaxed">
          Organic Trust Score ranking is unaffected. Sponsored slots are limited per page (max 3) so they don&apos;t overwhelm the data.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Frequently asked</h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
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

      <section className="mb-10 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)] leading-relaxed">
        <p>
          Spotted an error or want to suggest a signal we should add? Email{" "}
          <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg"}`} className="text-[var(--accent)] hover:underline">
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg"}
          </a>.
        </p>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Methodology", url: "/methodology" },
      ]} />
      <FaqJsonLd faqs={FAQS} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "How Trust Score & Korean-friendly are computed",
            description: "Trust Score formula, Korean-friendly scoring, data sources, refresh cadence.",
            dateModified: "2026-05-19",
            mainEntityOfPage: `${SITE}/methodology`,
            publisher: {
              "@type": "Organization",
              name: "Thailand Golf Guide",
              url: SITE,
            },
          }),
        }}
      />
    </article>
  );
}

function Source({ label, count, note }: { label: string; count: string; note: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-lg p-4">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-emerald-700 tabular-nums">{count}</div>
      </div>
      <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">{note}</p>
    </div>
  );
}
