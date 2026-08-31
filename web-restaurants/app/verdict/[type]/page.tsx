import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadMasterDb } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { EmailSignup } from "@/components/EmailSignup";
import { GenericShareButton } from "@/components/ShareButton";
import { getVerdict, getVerdictHub, VERDICT_HUBS } from "@/lib/verdict";
import type { Restaurant } from "@/lib/types";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return VERDICT_HUBS.map((h) => ({ type: h.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ type: string }> }
): Promise<Metadata> {
  const { type } = await params;
  const hub = getVerdictHub(type);
  if (!hub) return { title: "Not found" };
  const db = await loadMasterDb();
  const n = db.restaurants.filter((r) => getVerdict(r).kind === hub.kind).length;
  const title = `${hub.title} (${n})`;
  return {
    title,
    description: hub.blurb,
    alternates: { canonical: `/verdict/${hub.slug}` },
    openGraph: {
      title,
      description: hub.blurb,
      url: `/verdict/${hub.slug}`,
      type: "website",
      siteName: "SNS Stopper",
    },
    twitter: { card: "summary", title, description: hub.blurb },
  };
}

export default async function VerdictHubPage(
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const hub = getVerdictHub(type);
  if (!hub) notFound();

  const db = await loadMasterDb();
  // Deliberately not run through sortWithSponsored: a paid slot on a page that
  // says "these places are getting worse" would be selling the one thing that
  // makes the page worth reading.
  const matches: Restaurant[] = db.restaurants
    .filter((r) => getVerdict(r).kind === hub.kind)
    .sort((a, b) => {
      if (hub.kind === "slipping") {
        // Steepest fall first — that's the ranking a reader wants here, and it
        // isn't the same as "worst restaurant".
        const drop = (r: Restaurant) =>
          (r.rating_trend.old.avg ?? 0) - (r.rating_trend.recent.avg ?? 0);
        return drop(b) - drop(a);
      }
      return b.trust_score - a.trust_score;
    });

  const shown = matches.slice(0, 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28 sm:pb-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Our read", url: "/verdict" },
          { name: hub.heading, url: `/verdict/${hub.slug}` },
        ]}
      />
      <CollectionPageJsonLd
        name={hub.title}
        description={hub.blurb}
        url={`/verdict/${hub.slug}`}
        items={shown}
      />
      <ItemListJsonLd
        name={hub.title}
        items={shown.map((r) => ({ name: r.name, url: `/restaurant/${r.id}` }))}
      />

      <nav className="text-sm text-[var(--muted)] mb-4">
        <Link href="/" className="hover:text-[var(--fg)]">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/verdict" className="hover:text-[var(--fg)]">Our read</Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">{hub.heading}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {hub.title}
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">{hub.blurb}</p>
        <p className="text-sm text-[var(--muted)] mt-3">
          <strong className="text-[var(--fg)] tabular-nums">{matches.length}</strong>{" "}
          of the {db.restaurants.length.toLocaleString()} Bangkok and Pattaya
          restaurants we track. Based on the reviews we read, not on who paid us
          — nobody can.
        </p>
        <div className="mt-4">
          <GenericShareButton
            title={hub.title}
            text={`${matches.length} Bangkok & Pattaya restaurants — ${hub.heading.toLowerCase()}.`}
            url={`/verdict/${hub.slug}`}
          />
        </div>
      </header>

      <AffiliateInline />

      <div className="grid gap-4 sm:grid-cols-2">
        {shown.map((r, i) => (
          <RestaurantCard key={r.id} r={r} rank={i + 1} />
        ))}
      </div>

      {matches.length > shown.length && (
        <p className="text-sm text-[var(--muted)] mt-6">
          Showing the first {shown.length} of {matches.length}.
        </p>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-bold mb-3">Other reads</h2>
        <div className="flex flex-wrap gap-2">
          {VERDICT_HUBS.filter((h) => h.slug !== hub.slug).map((h) => (
            <Link
              key={h.slug}
              href={`/verdict/${h.slug}`}
              className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
            >
              {h.heading}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <EmailSignup />
      </div>
      <AdSlot slot="verdict-hub-foot" />
    </div>
  );
}
