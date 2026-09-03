import { Suspense } from "react";
import type { Metadata } from "next";
import { loadMasterDb } from "@/lib/data";
import { NICHES, loadNicheDb, qualifyingNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { VerifySearch } from "@/components/VerifySearch";
import { VERDICT_META } from "@/lib/verdict";
import { FaqJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const metadata: Metadata = {
  title: "Verify a Place You Saw on TikTok or Instagram — Is It Real, Good, or a Tourist Trap?",
  description:
    "Type the name of any Bangkok restaurant, spa, cooking class or gym from a video and get a verdict built from Google review data: worth it, overhyped, or a tourist-trap risk. No influencer input.",
  alternates: { canonical: "/verify" },
  openGraph: {
    title: "Verify a place before you go — Thaigle",
    description: "Saw it on TikTok? Check the numbers first. Verdicts for thousands of Thai venues.",
    url: `${SITE}/verify`,
  },
};

const FAQ = [
  {
    q: "What does a Thaigle verdict mean?",
    a: "A verdict is a plain-language call built only from Google review data: the venue's rating against its city or category average, how many reviews it has, whether recent reviews are trending down, what share of reviewers are Google Local Guides, and whether reviewers explicitly warn about tourist traps, long queues or high prices. Nothing is paid for and no influencer input is used.",
  },
  {
    q: "Why does a popular place get 'Overhyped'?",
    a: "Overhyped means the venue sits in the top 20% of its city by review volume but its rating does not keep up, or its recent reviews average noticeably lower than older ones. A lot of people go; a lot leave underwhelmed.",
  },
  {
    q: "The place from the video is not in the results. Is it fake?",
    a: "Not necessarily, but treat it as a signal. Thaigle indexes every Bangkok and Pattaya restaurant with a real Google footprint and seven activity categories across Thailand. A venue that is everywhere on social media but missing here is usually very new, recently renamed, or a private pop-up rather than a public business. Try a shorter part of the name or the Thai spelling.",
  },
  {
    q: "How fresh is the data?",
    a: "Each venue page shows the date its data was last checked. Ratings and review counts come from Google; review text samples and topic counts come from Thaigle's own analysis of those reviews.",
  },
];

export default async function VerifyPage() {
  const db = await loadMasterDb();
  let nicheTotal = 0;
  for (const n of NICHES) {
    const all = (await loadNicheDb(n.slug as NicheSlug)).places;
    nicheTotal += qualifyingNichePlaces(n.slug, all).length;
  }
  const total = db.restaurants.length + nicheTotal;

  return (
    <>
      <FaqJsonLd faqs={FAQ} />
      <section className="bg-gradient-to-b from-orange-50 to-white border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-10">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-widest mb-4">
            Saw it on TikTok or Instagram?
          </p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-3 text-balance">
            Verify the place before you go.
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] mb-6 text-balance">
            Type the name from the video. You get a verdict —{" "}
            <span className="font-semibold text-[var(--fg)]">worth it, overhyped, or tourist-trap risk</span> — built from{" "}
            {total.toLocaleString()} venues&apos; Google review data, not from whoever got paid to post.
          </p>
          <Suspense fallback={<div className="h-14 rounded-2xl border-2 border-orange-200 bg-white" />}>
            <VerifySearch />
          </Suspense>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-xl font-black mb-4">What the verdicts mean</h2>
        <ul className="grid sm:grid-cols-2 gap-3 text-sm">
          {(Object.keys(VERDICT_META) as (keyof typeof VERDICT_META)[]).map((code) => {
            const m = VERDICT_META[code];
            const why: Record<string, string> = {
              "worth-it": "High rating, real review volume, no warning signs, rating not falling.",
              solid: "Good scores from enough people to trust them. A safe pick.",
              mixed: "The numbers neither confirm nor kill the hype. Read recent reviews.",
              overhyped: "Top-20% review volume in its city, but the score does not keep up or is dropping.",
              "trap-risk": "Reviewers warn about a tourist trap, the Trust Score is low, or recent ratings collapsed.",
              "too-new": "Under 30 reviews (20 for activities). Not enough to call.",
              closed: "Google lists it as closed. Old videos keep circulating after venues shut.",
            };
            return (
              <li key={code} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <div className="font-black mb-1">
                  <span aria-hidden>{m.emoji}</span> {m.label}
                </div>
                <p className="text-[var(--muted)]">{why[code]}</p>
              </li>
            );
          })}
        </ul>

        <h2 className="text-xl font-black mt-10 mb-3">Why a verdict and not just a score</h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
          A Trust Score is a number, and most decent venues score well on it because it rewards rating and
          volume. That is useful for ranking a list and useless for a yes-or-no in a taxi. The verdict compares
          each venue to its own city and category — a ★4.4 spa is below par in a category where{" "}
          <a href="/activities/spa/rating-report" className="underline">76% of venues score 4.5 or higher</a>,
          while a ★4.4 restaurant in Bangkok is about average — and it reads the parts of the record that a
          single star rating hides: whether recent reviewers rate it lower than older ones, whether reviewers
          call it a tourist trap, and whether the crowd is there for the food or for the photo.
        </p>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Every line of evidence on a venue page is a fact from the data on file. Nothing is estimated and no
          venue can pay to change its verdict. <a href="/methodology" className="underline">Full methodology →</a>
        </p>

        <h2 className="text-xl font-black mt-10 mb-3">Frequently asked</h2>
        <dl className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold">{f.q}</dt>
              <dd className="text-sm text-[var(--muted)] mt-1 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap gap-2 text-sm">
          <a href="/restaurants/bangkok/instagram-famous-vs-actually-good" className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white hover:border-orange-400">
            Instagram-famous vs actually good →
          </a>
          <a href="/restaurants/bangkok/tourist-traps" className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white hover:border-orange-400">
            Bangkok tourist traps →
          </a>
          <a href="/restaurants/bangkok/hidden-gems" className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white hover:border-orange-400">
            Hidden gems →
          </a>
        </div>
      </section>
    </>
  );
}
