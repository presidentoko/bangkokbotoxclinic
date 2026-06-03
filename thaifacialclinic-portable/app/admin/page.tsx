import type { Metadata } from "next";
import { loadClinics } from "@/lib/data";
import { listPartners } from "@/lib/partnerStore";
import { isAdminAuthedFromCookies } from "@/lib/adminAuth";
import AdminView from "@/components/AdminView";
import AdminLogin from "@/components/AdminLogin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdminAuthedFromCookies();
  if (!authed) return <AdminLogin />;

  const { clinics, generated_at, total, avg_trust } = loadClinics();
  const partners = await listPartners();

  // Hair-niche only, with city, sorted by trust
  const directory = clinics
    .filter((c) => c.is_hair_relevant && c.city && c.city !== "nan")
    .sort((a, b) => b.trust_score - a.trust_score)
    .map((c) => ({
      id: c.id,
      name: c.name,
      city: c.city,
      trust: c.trust_score,
      rating: c.rating,
      reviews: c.review_count,
      is_partner: c.is_partner,
    }));

  return (
    <AdminView
      stats={{ generated_at, total, avg_trust }}
      directory={directory}
      partners={partners}
    />
  );
}
