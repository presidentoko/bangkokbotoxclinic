import { loadMasterDb } from "@/lib/data";
import { DashboardView } from "@/components/DashboardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard preview — bangkokbotoxclinic.com B2B",
  description: "Live demo of the clinic-side dashboard. Real anonymized data.",
};

export default async function DemoDashboardPage() {
  const db = await loadMasterDb();
  // Highest Trust Score Bangkok clinic as demo subject.
  const c = db.clinics.find((x) => x.scraped_review_count >= 30 && x.mentioned_topics.length >= 3)
    ?? db.clinics[0];
  if (!c) {
    return <div className="max-w-2xl mx-auto p-12 text-center">No demo data available.</div>;
  }
  const sameDistrict = c.district
    ? db.clinics.filter((x) => x.district === c.district)
    : db.clinics.filter((x) => x.city_label === c.city_label);
  const sameCategory = c.categories.length > 0
    ? sameDistrict.filter((x) => x.categories.some((cat) => c.categories.includes(cat)))
    : sameDistrict;
  const competitors = sameCategory.sort((a, b) => b.trust_score - a.trust_score).slice(0, 10);

  const cityList = db.clinics.filter((x) => x.city_label === c.city_label);
  const cityClinicCount = cityList.length;
  const cityAvgRating = cityList.length
    ? cityList.reduce((s, x) => s + x.rating, 0) / cityList.length
    : null;

  return (
    <DashboardView
      clinic={c}
      competitors={competitors}
      cityAvgRating={cityAvgRating}
      cityClinicCount={cityClinicCount}
      isDemo
    />
  );
}
