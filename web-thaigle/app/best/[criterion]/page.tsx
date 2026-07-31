import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { BEST_FOR, findBestFor } from "@/lib/bestFor";
import { isFood } from "@/lib/data";
import { sortWithSponsored } from "@/lib/sponsored";
import { VersusVote } from "@/components/VersusVote";
import { ShareButton } from "@/components/ShareButton";
import { RatingLegend } from "@/components/RatingLegend";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokBestViewpoints } from "@/components/BangkokBestViewpoints";
import { BangkokBudgetTravel } from "@/components/BangkokBudgetTravel";
import { BangkokOmakase } from "@/components/BangkokOmakase";
import { BangkokGlutenFree } from "@/components/BangkokGlutenFree";
import { BangkokRooftopBars } from "@/components/BangkokRooftopBars";
import { BangkokLiveMusic } from "@/components/BangkokLiveMusic";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamicParams = false;

export async function generateStaticParams() {
  return BEST_FOR.map((c) => ({ criterion: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ criterion: string }> }
): Promise<Metadata> {
  const { criterion } = await params;
  const cfg = findBestFor(criterion);
  if (!cfg) return { title: "Not found" };
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: { canonical: `/best/${cfg.slug}` },
  };
}

export default async function BestForPage(
  { params }: { params: Promise<{ criterion: string }> }
) {
  const { criterion } = await params;
  const cfg = findBestFor(criterion);
  if (!cfg) notFound();

  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const filtered = sortWithSponsored(
    db.restaurants
      .filter((r) => isFood(r) && (!cfg.filterFn || cfg.filterFn(r)))
      .map((r) => ({ ...r, _score: cfg.scoreFn(r) }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 50)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Best</span>
        <span className="mx-2">›</span>
        <span>{cfg.title.replace(/^Best Bangkok |^Bangkok |^Most |^Bangkok's /, "")}</span>
      </nav>

      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{cfg.title}</h1>
        <ShareButton title={`${cfg.title} in Bangkok 2026`} text={cfg.intro} url={`${SITE}/best/${criterion}`} line whatsapp />
      </div>
      <p className="text-[var(--muted)] mb-2">{cfg.intro}</p>
      <p className="text-xs text-[var(--muted)] mb-8 italic">
        {filtered.length} restaurants matched. Refreshed continuously from public Google reviews.
      </p>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">No restaurants matched this criterion yet.</p>
      ) : (
        <>
          <section>
            <div className="grid gap-3">
              {filtered.slice(0, 10).map((r, i) => (
                <RestaurantCard key={r.id} r={r} rank={i + 1} slugMap={slugMap} />
              ))}
            </div>
            <AffiliateInline />
            <AdSlot slot="best-for-mid" />
            <div className="grid gap-3 mt-3">
              {filtered.slice(10).map((r, i) => (
                <RestaurantCard key={r.id} r={r} rank={i + 11} slugMap={slugMap} />
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              Other ways to find a restaurant
            </h2>
            <div className="flex flex-wrap gap-2">
              {BEST_FOR.filter((x) => x.slug !== cfg.slug).map((x) => (
                <a
                  key={x.slug}
                  href={`/best/${x.slug}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  {x.title.replace(/^Best Bangkok |^Bangkok |^Most |^Bangkok's /, "").replace(/Restaurants?/, "").trim()}
                </a>
              ))}
            </div>
          </section>
        </>
      )}

      <RatingLegend />
      <BangkokTip />
      {criterion === "great-view" && <BangkokBestViewpoints />}
      {criterion === "affordable" && <BangkokBudgetTravel />}
      {criterion === "fine-dining" && <BangkokOmakase />}
      {criterion === "dietary-options" && <BangkokGlutenFree />}
      {(criterion === "rooftop" || criterion === "sky-bar") && <BangkokRooftopBars />}
      {criterion === "live-music" && <BangkokLiveMusic />}

      {/* Poll */}
      <div className="mt-8 mb-4">
        <VersusVote
          question="How do you choose a restaurant in Bangkok?"
          a={{ id: "trust-score-data", label: "Trust Score data", emoji: "📊", desc: "Verified Google reviewers, volume analysis — no hype", url: "/methodology" }}
          b={{ id: "instagram-tiktok", label: "Instagram / TikTok", emoji: "📱", desc: "If it looks amazing online, worth a try — right?", url: "/restaurants/bangkok/instagram-famous-vs-actually-good" }}
        />
      </div>

      {/* Quiz + Bingo CTAs */}
      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        <a href="/quiz" className="flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-200 hover:border-orange-300 transition group">
          <span className="text-2xl shrink-0">🎯</span>
          <div>
            <div className="font-bold text-sm group-hover:text-orange-700 transition">Take the Quiz</div>
            <div className="text-xs text-[var(--muted)]">Personalized picks</div>
          </div>
        </a>
        <a href="/for" className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-300 transition group">
          <span className="text-2xl shrink-0">✨</span>
          <div>
            <div className="font-bold text-sm group-hover:text-amber-700 transition">Perfect For...</div>
            <div className="text-xs text-[var(--muted)]">Browse by occasion</div>
          </div>
        </a>
        <a href="/bingo" className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 hover:border-green-300 transition group">
          <span className="text-2xl shrink-0">🏆</span>
          <div>
            <div className="font-bold text-sm group-hover:text-green-700 transition">Bucket List Bingo</div>
            <div className="text-xs text-[var(--muted)]">Tick what you&apos;ve done</div>
          </div>
        </a>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: cfg.title, url: `/best/${cfg.slug}` },
      ]} />
      <ItemListJsonLd
        name={cfg.title}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }) }))}
      />
    </div>
  );
}
