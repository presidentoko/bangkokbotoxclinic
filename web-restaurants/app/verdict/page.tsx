import Link from "next/link";
import type { Metadata } from "next";
import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getVerdict, VERDICT_HUBS } from "@/lib/verdict";

export const dynamic = "force-static";

const TITLE = "Our read on 2,000 Bangkok & Pattaya restaurants";
const BLURB =
  "You saw it on a reel. We read its reviews. Four honest reads — which places are sliding, which live up to it, and which nobody has found yet.";

export const metadata: Metadata = {
  title: TITLE,
  description: BLURB,
  alternates: { canonical: "/verdict" },
  openGraph: { title: TITLE, description: BLURB, url: "/verdict", type: "website", siteName: "SNS Stopper" },
  twitter: { card: "summary", title: TITLE, description: BLURB },
};

export default async function VerdictIndexPage() {
  const db = await loadMasterDb();
  const counts = new Map<string, number>();
  for (const r of db.restaurants) {
    const k = getVerdict(r).kind;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 sm:pb-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Our read", url: "/verdict" },
        ]}
      />

      <nav className="text-sm text-[var(--muted)] mb-4">
        <Link href="/" className="hover:text-[var(--fg)]">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">Our read</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{TITLE}</h1>
        <p className="text-[var(--muted)] max-w-2xl">{BLURB}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {VERDICT_HUBS.map((h) => (
          <Link
            key={h.slug}
            href={`/verdict/${h.slug}`}
            className="block border border-[var(--border)] rounded-3xl p-5 bg-[var(--card)] hover:border-[var(--accent)] hover:shadow-md transition"
          >
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="font-bold text-lg">{h.heading}</h2>
              <span className="text-sm font-bold tabular-nums text-[var(--muted)]">
                {(counts.get(h.kind) ?? 0).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-[var(--muted)]">{h.blurb}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 text-sm text-[var(--muted)] max-w-2xl">
        <h2 className="font-bold text-[var(--fg)] mb-2">How we decide</h2>
        <p>
          Every read comes from the Google reviews we collected and analysed for
          that restaurant — the star average of its most recent reviews against
          its older ones, how many reviewers are Google Local Guides, and how it
          scores against comparable places in the same city. We only call a
          restaurant&apos;s ratings &ldquo;falling&rdquo; when there are at least
          eight reviews on each side of the comparison and the gap is at least a
          quarter of a star. Where we don&apos;t have enough reviews to say
          anything useful, we say that instead of guessing.
        </p>
      </section>
    </div>
  );
}
