import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";
import { CategoryIcon } from "@/components/CategoryIcon";
import { TrustBadge } from "@/components/TrustBadge";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { LineButton } from "@/components/LineButton";
import type { Metadata } from "next";

// 정적 생성: 모든 클리닉 × 모든 클리닉 = N² → 너무 많아서 동적 SSR.
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  // 빈 배열 — generateStaticParams 호출 시 빌드 타임 0개 prerender, 실제 access 시 dynamic.
  // 어차피 dynamicParams=true 이므로 첫 access 시 ISR-like 처리.
  return [];
}

export async function generateMetadata(
  { params }: { params: Promise<{ a: string; b: string }> }
): Promise<Metadata> {
  const { a, b } = await params;
  const db = await loadMasterDb();
  const ca = getClinicById(db.clinics, a);
  const cb = getClinicById(db.clinics, b);
  if (!ca || !cb) return { title: "Compare clinics" };
  return {
    title: `${ca.name} vs ${cb.name} — Bangkok Clinic Comparison`,
    description: `Side-by-side comparison of ${ca.name} (Trust ${ca.trust_score}) vs ${cb.name} (Trust ${cb.trust_score}). Reviews, ratings, services, district, and more.`,
    alternates: { canonical: `/compare/${a}/${b}` },
  };
}

export default async function ComparePage(
  { params }: { params: Promise<{ a: string; b: string }> }
) {
  const { a, b } = await params;
  const db = await loadMasterDb();
  const ca = getClinicById(db.clinics, a);
  const cb = getClinicById(db.clinics, b);
  if (!ca || !cb) notFound();

  const rows = [
    { label: "Trust Score", a: ca.trust_score.toFixed(1), b: cb.trust_score.toFixed(1), winner: ca.trust_score > cb.trust_score ? "a" : ca.trust_score < cb.trust_score ? "b" : "tie" },
    { label: "Google Rating", a: `★ ${ca.rating.toFixed(1)}`, b: `★ ${cb.rating.toFixed(1)}`, winner: ca.rating > cb.rating ? "a" : ca.rating < cb.rating ? "b" : "tie" },
    { label: "Total Reviews", a: ca.total_reviews.toLocaleString(), b: cb.total_reviews.toLocaleString(), winner: ca.total_reviews > cb.total_reviews ? "a" : ca.total_reviews < cb.total_reviews ? "b" : "tie" },
    { label: "District", a: ca.district || "—", b: cb.district || "—" },
    { label: "Local Guide reviews", a: ca.local_guide_count.toString(), b: cb.local_guide_count.toString(), winner: ca.local_guide_count > cb.local_guide_count ? "a" : ca.local_guide_count < cb.local_guide_count ? "b" : "tie" },
    { label: "Quality trend", a: trendLabel(ca.rating_trend.trend), b: trendLabel(cb.rating_trend.trend) },
    { label: "Categories", a: ca.categories.map((c) => CATEGORY_LABELS[c] ?? c).join(", ") || "—", b: cb.categories.map((c) => CATEGORY_LABELS[c] ?? c).join(", ") || "—" },
    { label: "Business status", a: ca.business_status || "—", b: cb.business_status || "—" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Compare</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {ca.name} <span className="text-[var(--muted)] font-normal">vs</span> {cb.name}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        Independent comparison from public Google review data. Updated continuously.
      </p>

      {/* Header cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <ClinicHeader clinic={ca} />
        <ClinicHeader clinic={cb} />
      </div>

      {/* Comparison table */}
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="text-left p-3 w-1/4">Metric</th>
              <th className="text-left p-3">{ca.name}</th>
              <th className="text-left p-3">{cb.name}</th>
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
        <LineButton clinicName={ca.name} phone={ca.phone} size="lg" />
        <LineButton clinicName={cb.name} phone={cb.phone} size="lg" />
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Compare", url: "/" },
        { name: `${ca.name} vs ${cb.name}`, url: `/compare/${a}/${b}` },
      ]} />
    </div>
  );
}

function ClinicHeader({ clinic }: { clinic: ReturnType<typeof getClinicById> }) {
  if (!clinic) return null;
  return (
    <a
      href={`/clinic/${clinic.id}`}
      className="block bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-md transition"
    >
      <h2 className="font-bold text-lg mb-1 truncate">{clinic.name}</h2>
      <p className="text-sm text-[var(--muted)] mb-3 truncate">{clinic.primary_type} · {clinic.district}</p>
      <div className="flex items-center justify-between gap-3 mb-2">
        <TrustBadge score={clinic.trust_score} size="md" />
        <div className="bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md text-sm font-bold">
          ★ {clinic.rating.toFixed(1)}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {clinic.categories.slice(0, 3).map((c) => (
          <span key={c} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <CategoryIcon category={c} size={11} />
            {CATEGORY_LABELS[c] ?? c}
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
