import { notFound } from "next/navigation";
import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { TrustBadge } from "@/components/TrustBadge";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  { params }: { params: Promise<{ a: string; b: string }> }
): Promise<Metadata> {
  const { a, b } = await params;
  const db = await loadMasterDb();
  const ra = getRestaurantById(db.restaurants, a);
  const rb = getRestaurantById(db.restaurants, b);
  if (!ra || !rb) return { title: "Compare restaurants" };
  return {
    title: `${ra.name} vs ${rb.name} — Restaurant Comparison`,
    description: `Side-by-side comparison of ${ra.name} (Trust ${ra.trust_score}) vs ${rb.name} (Trust ${rb.trust_score}). Reviews, ratings, cuisines, district, and more.`,
    alternates: { canonical: `/compare/${a}/${b}` },
  };
}

export default async function ComparePage(
  { params }: { params: Promise<{ a: string; b: string }> }
) {
  const { a, b } = await params;
  const db = await loadMasterDb();
  const ra = getRestaurantById(db.restaurants, a);
  const rb = getRestaurantById(db.restaurants, b);
  if (!ra || !rb) notFound();

  const rows = [
    { label: "Trust Score", a: ra.trust_score.toFixed(1), b: rb.trust_score.toFixed(1), winner: ra.trust_score > rb.trust_score ? "a" : ra.trust_score < rb.trust_score ? "b" : "tie" },
    { label: "Google Rating", a: `★ ${ra.rating.toFixed(1)}`, b: `★ ${rb.rating.toFixed(1)}`, winner: ra.rating > rb.rating ? "a" : ra.rating < rb.rating ? "b" : "tie" },
    { label: "Total Reviews", a: ra.total_reviews.toLocaleString(), b: rb.total_reviews.toLocaleString(), winner: ra.total_reviews > rb.total_reviews ? "a" : ra.total_reviews < rb.total_reviews ? "b" : "tie" },
    { label: "City", a: ra.city_label || "—", b: rb.city_label || "—" },
    { label: "District", a: ra.district || "—", b: rb.district || "—" },
    { label: "Local Guide reviews", a: ra.local_guide_count.toString(), b: rb.local_guide_count.toString(), winner: ra.local_guide_count > rb.local_guide_count ? "a" : ra.local_guide_count < rb.local_guide_count ? "b" : "tie" },
    { label: "Quality trend", a: trendLabel(ra.rating_trend.trend), b: trendLabel(rb.rating_trend.trend) },
    { label: "Cuisines", a: ra.cuisines.map((c) => CUISINE_LABELS[c] ?? c).join(", ") || "—", b: rb.cuisines.map((c) => CUISINE_LABELS[c] ?? c).join(", ") || "—" },
    { label: "Price level", a: ra.price_level || ra.price_symbol || "—", b: rb.price_level || rb.price_symbol || "—" },
    { label: "Status", a: ra.business_status || "—", b: rb.business_status || "—" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Compare</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {ra.name} <span className="text-[var(--muted)] font-normal">vs</span> {rb.name}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        Independent comparison from public Google review data. Updated continuously.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <RestHeader r={ra} />
        <RestHeader r={rb} />
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="text-left p-3 w-1/4">Metric</th>
              <th className="text-left p-3">{ra.name}</th>
              <th className="text-left p-3">{rb.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-[var(--border)] last:border-0">
                <td className="p-3 text-sm text-[var(--muted)]">{r.label}</td>
                <td className={`p-3 text-sm font-medium ${r.winner === "a" ? "text-green-700" : ""}`}>
                  {r.a} {r.winner === "a" && <span className="ml-1 text-xs">✓</span>}
                </td>
                <td className={`p-3 text-sm font-medium ${r.winner === "b" ? "text-green-700" : ""}`}>
                  {r.b} {r.winner === "b" && <span className="ml-1 text-xs">✓</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <a
          href={ra.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-black text-white py-3 px-4 rounded-lg font-bold text-center hover:bg-gray-800 text-sm"
        >
          📍 {ra.name} on Google Maps
        </a>
        <a
          href={rb.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-black text-white py-3 px-4 rounded-lg font-bold text-center hover:bg-gray-800 text-sm"
        >
          📍 {rb.name} on Google Maps
        </a>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Compare", url: "/" },
        { name: `${ra.name} vs ${rb.name}`, url: `/compare/${a}/${b}` },
      ]} />
    </div>
  );
}

function RestHeader({ r }: { r: ReturnType<typeof getRestaurantById> }) {
  if (!r) return null;
  return (
    <a
      href={`/restaurant/${r.id}`}
      className="block bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-md transition"
    >
      <h2 className="font-bold text-lg mb-1 truncate">{r.name}</h2>
      <p className="text-sm text-[var(--muted)] mb-3 truncate">{r.primary_type} · {r.district || r.city_label}</p>
      <div className="flex items-center justify-between gap-3 mb-2">
        <TrustBadge score={r.trust_score} size="md" />
        <div className="bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md text-sm font-bold">
          ★ {r.rating.toFixed(1)}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {r.cuisines.slice(0, 3).map((c) => (
          <span key={c} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <span aria-hidden>{CUISINE_ICONS[c] ?? "🍴"}</span>
            {CUISINE_LABELS[c] ?? c}
          </span>
        ))}
      </div>
    </a>
  );
}

function trendLabel(t: string): string {
  if (t === "improving") return "↗ Improving";
  if (t === "declining") return "↘ Declining";
  if (t === "stable") return "→ Stable";
  return "—";
}
