import type { Metadata } from "next";
import { OCCASIONS } from "@/lib/occasions";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { VersusVote } from "@/components/VersusVote";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { HighlightReel } from "@/components/HighlightReel";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const metadata: Metadata = {
  title: "Perfect For... — Bangkok Restaurants by Occasion | Thaigle",
  description: "Find Bangkok restaurants by occasion: date night, group dinner, budget eats, views, halal, vegetarian & more. All ranked by real Google reviews.",
  alternates: { canonical: "/for" },
};

export const dynamic = "force-static";

export default function OccasionIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Perfect For", url: "/for" },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-[var(--muted)] mb-5">
          <a href="/" className="hover:text-black">Home</a>
          <span className="mx-2">›</span>
          <span>Perfect For</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="text-4xl font-black tracking-tight">Perfect For...</h1>
            <ShareButton title="Bangkok Restaurants Perfect For Any Occasion 2026" text="Date night, groups, budget, views, halal — find Bangkok restaurants by occasion" url={`${SITE}/for`} line whatsapp />
          </div>
          <p className="text-[var(--muted)] max-w-xl">
            Stop searching by cuisine. Find the right restaurant for your <em>situation</em> — all ranked by real Google reviews.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {OCCASIONS.map((occ) => (
            <a
              key={occ.slug}
              href={`/for/${occ.slug}`}
              className="group block border border-[var(--border)] rounded-2xl p-5 bg-white hover:border-orange-300 hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <div className="text-3xl mb-2">{occ.emoji}</div>
              <h2 className="font-black text-base group-hover:text-orange-700 transition mb-1">{occ.title}</h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">{occ.subtitle}</p>
              <div className="mt-3 text-xs text-orange-600 font-bold">Browse →</div>
            </a>
          ))}
        </div>

        <HighlightReel />
        <BangkokChallenge />
        <BangkokTip />

        {/* Poll */}
        <div className="mt-10 mb-6">
          <VersusVote
            question="What describes your Bangkok dining situation right now?"
            a={{ id: "special-occasion", label: "Special occasion", emoji: "✨", desc: "Anniversary, celebration, treat yourself — money is no object tonight", url: "/for/date-night" }}
            b={{ id: "everyday-dinner", label: "Everyday dinner", emoji: "🍜", desc: "Casual, affordable, good food — the typical Bangkok evening", url: "/for/budget" }}
          />
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="border border-orange-200 rounded-2xl p-6 bg-orange-50 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h2 className="font-black text-lg mb-2">Still can&apos;t decide?</h2>
            <p className="text-sm text-[var(--muted)] mb-4">Take our 5-question Bangkok traveler quiz and get personalized picks.</p>
            <a href="/quiz" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition">
              Take the quiz →
            </a>
          </div>
          <div className="border border-green-200 rounded-2xl p-6 bg-green-50 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h2 className="font-black text-lg mb-2">Bangkok Bucket List</h2>
            <p className="text-sm text-[var(--muted)] mb-4">Tick everything you&apos;ve done in Bangkok and share your score.</p>
            <a href="/bingo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition">
              Start checklist →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
